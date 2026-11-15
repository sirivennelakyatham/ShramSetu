
import json
from pathlib import Path

DIRECTORY = Path(__file__).parent / "complaint_pathways.json"

# Convert the four categories used by the ShramSetu form
# into the more specific issue tags used in the pathway directory.
CATEGORY_ALIASES = {
    "unpaid_wages": {
        "unpaid_wages",
        "delayed_wages",
        "illegal_deductions",
        "minimum_wage",
        "overtime",
        "labour_dispute",
    },
    "safety_injury": {
        "safety_injury",
        "workplace_safety",
        "workplace_injury",
        "factory_safety",
        "industrial_workplace_safety",
        "factory_injury",
        "construction_worker_accident",
    },
    "abuse_exploitation": {
        "abuse_exploitation",
        "abuse",
        "exploitation",
        "violence",
        "threats",
        "confinement",
        "forced_labour",
        "trafficking",
        "sexual_assault",
        "workplace_sexual_harassment",
    },
    "other": {
        "other",
        "government_service_problem",
        "departmental_grievance",
        "documentation",
        "worker_welfare",
    },
}


def get_pathways(report: dict) -> list:
    with open(DIRECTORY, "r", encoding="utf-8") as file:
        data = json.load(file)

    state = str(report.get("state", "Telangana")).strip().lower()

    if state not in ("telangana", "tg"):
        return []

    categories = set()

    primary = report.get("category")
    if primary:
        categories.add(str(primary).strip().lower())

    secondary = report.get("secondary_categories", [])
    if isinstance(secondary, list):
        categories.update(
            str(item).strip().lower()
            for item in secondary
            if item
        )

    # Expand the form categories into the directory's issue tags.
    expanded_categories = set(categories)

    for category in categories:
        expanded_categories.update(
            CATEGORY_ALIASES.get(category, set())
        )

    matches = []
    seen_ids = set()

    for pathway in data.get("pathways", []):
        pathway_id = pathway.get("id")

        if pathway_id in seen_ids:
            continue

        supported_issues = {
            str(issue).strip().lower()
            for issue in pathway.get("issues", [])
        }

        if expanded_categories.intersection(supported_issues):
            matches.append(pathway)
            seen_ids.add(pathway_id)

    return matches
