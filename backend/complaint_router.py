"""Conservative, read-only complaint routing for ShramSetu.

This module does not file government complaints or contact NGOs.
It returns potential routes with limitations and verification metadata.
"""

from __future__ import annotations

import json
import re
from pathlib import Path
from typing import Any

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

ROUTES_FILE = Path(__file__).resolve().parent / "complaint_routes.json"
router = APIRouter(tags=["Complaint Routing"])

VALID_CATEGORIES = {"unpaid_wages", "safety_injury", "abuse_exploitation", "other"}

CATEGORY_ALIASES = {
    "unpaid_wages": {"unpaid_wages", "delayed_wages", "illegal_deductions", "minimum_wage", "overtime", "gratuity", "maternity_benefit", "equal_remuneration", "illegal_termination", "industrial_dispute", "labour_dispute"},
    "safety_injury": {"safety_injury", "workplace_safety", "workplace_injury", "factory_safety", "industrial_workplace_safety", "factory_injury", "construction_worker_accident"},
    "abuse_exploitation": {"abuse_exploitation", "abuse", "exploitation", "violence", "threats", "confinement", "forced_labour", "trafficking", "sexual_assault", "workplace_sexual_harassment"},
    "other": {"other", "government_service_problem", "departmental_grievance", "documentation", "worker_welfare"},
}

TELANGANA_HINTS = (
    "telangana", "hyderabad", "secunderabad", "rangareddy", "ranga reddy",
    "medchal", "miyapur", "warangal", "karimnagar", "nizamabad", "khammam",
    "nalgonda", "sangareddy", "adilabad", "mahbubnagar", "siddipet",
)

class RoutingRequest(BaseModel):
    # Accept both the current Gemini schema and the older form schema.
    primary_category: str | None = None
    category: str | None = None
    secondary_categories: list[str] = Field(default_factory=list)
    problem_description: str | None = None
    description: str | None = None
    work_type: str | None = None
    employer_or_contractor: str | None = None
    work_location: str | None = None
    state: str | None = None
    amount_owed: dict[str, Any] | str | int | float | None = None
    duration: dict[str, Any] | str | None = None
    incident_details: str | None = None
    immediate_danger: bool | None = None
    injuries: str | None = None
    other_relevant_details: list[str] = Field(default_factory=list)
    missing_information: list[str] = Field(default_factory=list)


def _load_directory() -> dict[str, Any]:
    try:
        with ROUTES_FILE.open("r", encoding="utf-8") as handle:
            data = json.load(handle)
    except (OSError, json.JSONDecodeError) as exc:
        raise RuntimeError(f"Could not load routing directory: {exc}") from exc
    if not isinstance(data, dict):
        raise RuntimeError("Routing directory must contain a JSON object.")
    return data


def _text(value: Any) -> str:
    if value is None:
        return ""
    if isinstance(value, (dict, list)):
        return json.dumps(value, ensure_ascii=False)
    return str(value)


def _normalise(value: Any) -> str:
    return re.sub(r"[^a-z0-9]+", "_", _text(value).strip().lower()).strip("_")


def _collect_categories(report: dict[str, Any]) -> set[str]:
    raw: list[str] = []
    primary = report.get("primary_category") or report.get("category")
    if primary:
        raw.append(_normalise(primary))
    secondary = report.get("secondary_categories") or []
    if isinstance(secondary, list):
        raw.extend(_normalise(item) for item in secondary if item)

    categories = set(raw)
    for item in raw:
        categories.update(CATEGORY_ALIASES.get(item, set()))
    return categories


def _report_text(report: dict[str, Any]) -> str:
    fields = (
        "problem_description", "description", "work_type", "work_location",
        "incident_details", "injuries", "employer_or_contractor",
    )
    parts = [_text(report.get(field)) for field in fields]
    details = report.get("other_relevant_details")
    if isinstance(details, list):
        parts.extend(_text(item) for item in details)
    return " ".join(parts).lower()


def _is_telangana(report: dict[str, Any]) -> bool:
    state = _text(report.get("state")).strip().lower()
    if state == "tg" or "telangana" in state:
        return True
    if state:
        return False
    location = _text(report.get("work_location")).lower()
    return any(hint in location for hint in TELANGANA_HINTS)


def _is_construction_worker(report: dict[str, Any], text: str) -> bool:
    work_type = _text(report.get("work_type")).lower()
    return any(term in work_type or term in text for term in (
        "construction worker", "construction site", "building worker", "mason", "scaffolding", "civil construction"
    ))


def _route_reason(route: dict[str, Any], categories: set[str], text: str, report: dict[str, Any]) -> str | None:
    route_id = route.get("id")
    tags = set(route.get("issue_tags", []))
    overlap = categories.intersection(tags)

    if route_id == "samadhan":
        wage_terms = ("wage", "salary", "payment", "deduction", "minimum wage", "overtime", "gratuity", "maternity benefit", "equal remuneration", "termination", "dismissal", "retrenchment")
        if "unpaid_wages" in categories or any(term in text for term in wage_terms):
            return "The report indicates a wage, payment or employment-claim issue that may fall within a SAMADHAN claim/dispute category. The worker must check the exact claim type and competent authority."
        return None

    if route_id == "telangana_labour_department":
        if not _is_telangana(report):
            return None
        if "unpaid_wages" in categories or "safety_injury" in categories:
            return "The issue may fall within the Telangana Labour Department's labour-law or workplace remit; the correct local office and process need confirmation."
        return None

    if route_id == "telangana_factories_directorate":
        if not _is_telangana(report) or "safety_injury" not in categories:
            return None
        factory_terms = ("factory", "manufacturing plant", "industrial unit", "factory floor")
        if any(term in text for term in factory_terms):
            return "The worker describes a safety/injury issue and a factory or industrial establishment; statutory coverage still needs confirmation."
        return None

    if route_id == "telangana_bocw_welfare_board":
        if not _is_telangana(report) or not _is_construction_worker(report, text):
            return None
        welfare_terms = ("registration", "welfare", "benefit", "construction accident", "injury", "compensation")
        if "safety_injury" in categories or any(term in text for term in welfare_terms):
            return "The worker appears to work in construction and may need construction-worker registration, accident or welfare-benefit information. This is not a general wage-claim route."
        return None

    if route_id == "telangana_police":
        if not _is_telangana(report):
            return None
        risk_terms = ("physical violence", "beaten", "assault", "threatened", "threats", "locked in", "confined", "not allowed to leave", "forced labour", "trafficking", "sexual assault")
        if report.get("immediate_danger") is True or any(term in text for term in risk_terms):
            return "The report contains a possible violence, threat, confinement, trafficking or forced-labour concern. Contact emergency services if anyone is in immediate danger."
        return None

    if route_id == "telangana_women_safety_wing":
        if not _is_telangana(report):
            return None
        specific = ("sexual harassment", "sexual assault", "violence against women", "trafficking", "forced labour")
        if "abuse_exploitation" in categories and any(term in text for term in specific):
            return "The description may fit the Women Safety Wing's stated specialist support areas; confirm its intake process for this specific incident."
        return None

    if route_id == "district_legal_services_authority":
        if not _is_telangana(report):
            return None
        if categories.intersection({"unpaid_wages", "safety_injury", "abuse_exploitation"}):
            return "A worker may seek legal-aid information about this type of dispute. Eligibility and the relevant district authority must be assessed."
        return None

    if route_id == "prajavani":
        if not _is_telangana(report):
            return None
        public_terms = ("government department", "public service", "government office", "pension office", "ration office", "municipal service")
        if any(term in text for term in public_terms) or "government_service_problem" in categories or "departmental_grievance" in categories:
            return "The complaint appears to concern a Telangana government department or public service, which is Prajavani's remit."
        return None

    if route_id == "cpgrams":
        central_terms = ("central government", "ministry", "central department", "labour ministry")
        if any(term in text for term in central_terms) or "central_government_service_problem" in categories or "central_departmental_grievance" in categories:
            return "The report appears to concern a central government ministry or department rather than a private employer."
        return None

    if route_id == "eshram_gms":
        eshram_terms = ("e-shram", "eshram", "shram card", "unorganised worker registration")
        if any(term in text for term in eshram_terms) or categories.intersection({"eshram_registration", "eshram_card", "eshram_account", "eshram_service_problem"}):
            return "The issue appears to concern e-Shram registration, card, account or service access."
        return None

    if route_id == "epfo_grievance":
        pf_terms = ("provident fund", "epf", "epfo", "uan", "pf contribution", "pf account")
        if any(term in text for term in pf_terms) or categories.intersection({"pf_non_payment", "pf_account_problem", "provident_fund"}):
            return "The report mentions provident-fund/EPFO services or contributions."
        return None

    if overlap:
        return f"The report category overlaps with this route's listed issue areas ({', '.join(sorted(overlap))}); applicability still needs checking."
    return None


def get_recommendations(report: dict[str, Any]) -> dict[str, Any]:
    """Return government routes and unverified NGO leads separately."""
    categories = _collect_categories(report)
    text = _report_text(report)
    directory = _load_directory()
    telangana = _is_telangana(report)

    government_routes = []
    for route in directory.get("government_routes", []):
        reason = _route_reason(route, categories, text, report)
        if not reason:
            continue
        government_routes.append({
            "id": route["id"],
            "name": route["name"],
            "route_type": route.get("route_type"),
            "jurisdiction": route.get("jurisdiction"),
            "official_url": route.get("official_url"),
            "emergency_number": route.get("emergency_number"),
            "helpline": route.get("helpline"),
            "why_relevant": reason,
            "limitations": route.get("limitations"),
            "verification_status": route.get("verification_status"),
            "source_urls": route.get("source_urls", []),
            "submission_model": route.get("submission_model", "worker_guided_self_submission"),
        })

    ngo_matches = []
    for lead in directory.get("ngo_leads", []):
        lead_tags = set(lead.get("issue_tags", []))
        # A generic "other" category is too broad to justify an NGO match.
        meaningful_categories = categories - {"other"}
        if not meaningful_categories.intersection(lead_tags):
            continue
        ngo_matches.append({
            "id": lead["id"],
            "name": lead["name"],
            "location": lead.get("location"),
            "match_status": "unverified_lead",
            "is_verified_recommendation": False,
            "referral_enabled": False,
            "contact_verified": bool(lead.get("contact_verified", False)),
            "accepts_individual_cases": lead.get("accepts_individual_cases", "needs_verification"),
            "why_listed": "The lead's starter-directory issue tags overlap with the report category. This does not establish that the organisation currently provides this service or accepts individual referrals.",
            "limitations": lead.get("limitations"),
            "verification_status": lead.get("verification_status"),
        })

    immediate_danger = report.get("immediate_danger") is True
    emergency = None
    if immediate_danger:
        emergency = {
            "priority": "urgent",
            "message": "The report marks immediate danger. Do not delay urgent assistance while collecting more information.",
            "emergency_number": "112",
            "service": "India Emergency Response Support System",
            "telangana_police_url": "https://erss.tspolice.gov.in/",
        }

    return {
        "success": True,
        "government_routes": government_routes,
        "ngo_matches": ngo_matches,
        "emergency": emergency,
        "is_provisional": True,
        "location_scope": "Telangana" if telangana else ("unknown_or_other_state" if not _text(report.get("state") or report.get("work_location")).strip() else "other_state"),
        "notes": [
            "These are potential navigation routes, not legal eligibility decisions.",
            "Government complaints are not submitted by ShramSetu; the worker completes the official process.",
            "NGO entries are unverified leads. No email or referral is sent by this endpoint.",
        ],
    }


@router.post("/routing/recommendations")
def routing_recommendations(request: RoutingRequest):
    report = request.model_dump(exclude_none=True)
    category = report.get("primary_category") or report.get("category")
    if category and _normalise(category) not in VALID_CATEGORIES and _normalise(category) not in CATEGORY_ALIASES.get("other", set()):
        # Unknown categories are allowed through as long as descriptive details exist;
        # the router will simply avoid unsupported category-only matches.
        pass
    if not category and not (report.get("problem_description") or report.get("description")):
        raise HTTPException(status_code=422, detail="Provide primary_category/category or a problem description.")
    try:
        return get_recommendations(report)
    except RuntimeError as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc
