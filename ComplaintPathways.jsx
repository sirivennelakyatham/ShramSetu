import { useEffect, useMemo, useState } from "react";
import { Volume2, VolumeX, MapPin, ShieldCheck, ShieldAlert, ArrowRight, Headphones } from "lucide-react";
import useSpeech from "./useSpeech";
import portalData from "./government_portal_guides.json";
import "./ComplaintPathways.css";
import "./GovernmentPortalGuides.css";

const API_URL = "http://127.0.0.1:8000";

const pathwayText = {
  en: {
    loading: "Finding possible support channels...", loadingInfo: "Please wait while we look for relevant options.",
    errorTitle: "We couldn't load the support channels.", error: "Unable to load support channels. Please try again.",
    retry: "Try again", emptyTitle: "No matching channels found",
    emptyInfo: "We couldn't find a listed channel for this issue. This does not mean help is unavailable.",
    eyebrow: "YOUR NEXT STEP", title: "Where can you seek help?",
    intro: "These are possible organisations and channels related to your report.",
    government: "Government department", organisation: "Support organisation",
    verified: "Contact verified", unverified: "Contact not yet verified",
    services: "How they may help", notice: "Contact details or individual case intake have not yet been verified. Please check before sharing personal information.",
    view: "View this option", listen: "Listen", listenAll: "Listen to all options",
    disclaimer: "These are possible routes for seeking help. ShramSetu has not submitted your complaint. Your original report remains separate.",
    location: "Area / location", option: "Support option"
  },
  te: {
    loading: "సహాయ మార్గాలను వెతుకుతున్నాము...", loadingInfo: "మీకు సంబంధించిన ఎంపికలను పరిశీలించడానికి దయచేసి వేచి ఉండండి.",
    errorTitle: "సహాయ మార్గాలను లోడ్ చేయలేకపోయాము.", error: "సహాయ మార్గాలను లోడ్ చేయలేకపోయాము. మళ్లీ ప్రయత్నించండి.",
    retry: "మళ్లీ ప్రయత్నించండి", emptyTitle: "సరిపోలే మార్గాలు కనుగొనబడలేదు",
    emptyInfo: "ఈ సమస్యకు సంబంధించిన మార్గం జాబితాలో కనిపించలేదు. దీనర్థం సహాయం అందుబాటులో లేదని కాదు.",
    eyebrow: "మీ తదుపరి అడుగు", title: "మీరు ఎక్కడ సహాయం పొందవచ్చు?",
    intro: "మీ నివేదికకు సంబంధించిన సంస్థలు మరియు సహాయ మార్గాలు ఇవి.",
    government: "ప్రభుత్వ శాఖ", organisation: "సహాయ సంస్థ",
    verified: "సంప్రదింపు వివరాలు ధృవీకరించబడ్డాయి", unverified: "సంప్రదింపు వివరాలు ఇంకా ధృవీకరించబడలేదు",
    services: "వారు అందించగల సహాయం", notice: "సంప్రదింపు వివరాలు లేదా వ్యక్తిగత కేసులను స్వీకరించే విధానం ఇంకా ధృవీకరించబడలేదు. వ్యక్తిగత సమాచారం పంచుకునే ముందు తనిఖీ చేయండి.",
    view: "ఈ ఎంపికను చూడండి", listen: "వినండి", listenAll: "అన్ని ఎంపికలను వినండి",
    disclaimer: "ఇవి సహాయం పొందడానికి ఉండే మార్గాలు మాత్రమే. ShramSetu మీ ఫిర్యాదును ఏ సంస్థకూ పంపలేదు. మీ అసలు నివేదిక వేరుగా ఉంటుంది.",
    location: "ప్రాంతం / స్థానం", option: "సహాయ ఎంపిక"
  },
  hi: {
    loading: "सहायता के संभावित विकल्प खोजे जा रहे हैं...", loadingInfo: "कृपया संबंधित विकल्प खोजने तक प्रतीक्षा करें।",
    errorTitle: "सहायता के विकल्प लोड नहीं हो सके।", error: "सहायता के विकल्प लोड नहीं हो सके। कृपया फिर कोशिश करें।",
    retry: "फिर कोशिश करें", emptyTitle: "कोई मेल खाता विकल्प नहीं मिला",
    emptyInfo: "इस समस्या के लिए कोई सूचीबद्ध विकल्प नहीं मिला। इसका मतलब यह नहीं है कि सहायता उपलब्ध नहीं है।",
    eyebrow: "आपका अगला कदम", title: "आप सहायता कहाँ प्राप्त कर सकते हैं?",
    intro: "ये आपकी रिपोर्ट से संबंधित संभावित संस्थाएँ और सहायता के रास्ते हैं।",
    government: "सरकारी विभाग", organisation: "सहायता संगठन", verified: "संपर्क सत्यापित है",
    unverified: "संपर्क अभी सत्यापित नहीं है", services: "संभावित सहायता",
    notice: "संपर्क विवरण या व्यक्तिगत मामलों को स्वीकार करने की प्रक्रिया अभी सत्यापित नहीं है। निजी जानकारी साझा करने से पहले जाँच करें।",
    view: "यह विकल्प देखें", listen: "सुनें", listenAll: "सभी विकल्प सुनें",
    disclaimer: "ये सहायता पाने के संभावित रास्ते हैं। ShramSetu ने आपकी शिकायत किसी संस्था को नहीं भेजी है। आपकी मूल रिपोर्ट अलग रहेगी।",
    location: "क्षेत्र / स्थान", option: "सहायता विकल्प"
  },
  ta: {
    loading: "உதவி வழிகளைத் தேடுகிறோம்...", loadingInfo: "உங்களுக்குப் பொருத்தமான விருப்பங்களைக் கண்டறிய காத்திருக்கவும்.",
    errorTitle: "உதவி வழிகளை ஏற்ற முடியவில்லை.", error: "உதவி வழிகளை ஏற்ற முடியவில்லை. மீண்டும் முயற்சிக்கவும்.",
    retry: "மீண்டும் முயற்சிக்கவும்", emptyTitle: "பொருத்தமான வழிகள் எதுவும் கிடைக்கவில்லை",
    emptyInfo: "இந்தப் பிரச்சினைக்கான வழி பட்டியலில் இல்லை. அதனால் உதவி கிடைக்காது என்று அர்த்தமல்ல.",
    eyebrow: "உங்கள் அடுத்த படி", title: "நீங்கள் எங்கே உதவி பெறலாம்?",
    intro: "உங்கள் புகாருடன் தொடர்புடைய சாத்தியமான நிறுவனங்கள் மற்றும் உதவி வழிகள் இவை.",
    government: "அரசுத் துறை", organisation: "உதவி அமைப்பு", verified: "தொடர்பு விவரங்கள் சரிபார்க்கப்பட்டன",
    unverified: "தொடர்பு விவரங்கள் இன்னும் சரிபார்க்கப்படவில்லை", services: "வழங்கக்கூடிய உதவி",
    notice: "தொடர்பு விவரங்கள் அல்லது தனிப்பட்ட புகார்களை ஏற்கும் நடைமுறை இன்னும் சரிபார்க்கப்படவில்லை. தனிப்பட்ட தகவல்களைப் பகிர்வதற்கு முன் சரிபார்க்கவும்.",
    view: "இந்த விருப்பத்தைப் பார்க்கவும்", listen: "கேளுங்கள்", listenAll: "அனைத்து விருப்பங்களையும் கேளுங்கள்",
    disclaimer: "இவை உதவி பெறுவதற்கான சாத்தியமான வழிகள் மட்டுமே. ShramSetu உங்கள் புகாரை எந்த அமைப்பிற்கும் அனுப்பவில்லை. உங்கள் அசல் அறிக்கை தனியாகவே இருக்கும்.",
    location: "பகுதி / இடம்", option: "உதவி விருப்பம்"
  },
  kn: {
    loading: "ಸಹಾಯದ ಮಾರ್ಗಗಳನ್ನು ಹುಡುಕಲಾಗುತ್ತಿದೆ...", loadingInfo: "ನಿಮಗೆ ಸಂಬಂಧಿಸಿದ ಆಯ್ಕೆಗಳನ್ನು ಹುಡುಕುವವರೆಗೆ ದಯವಿಟ್ಟು ಕಾಯಿರಿ.",
    errorTitle: "ಸಹಾಯದ ಮಾರ್ಗಗಳನ್ನು ಲೋಡ್ ಮಾಡಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ.", error: "ಸಹಾಯದ ಮಾರ್ಗಗಳನ್ನು ಲೋಡ್ ಮಾಡಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ. ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.",
    retry: "ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ", emptyTitle: "ಹೊಂದಾಣಿಕೆಯ ಮಾರ್ಗಗಳು ಕಂಡುಬಂದಿಲ್ಲ",
    emptyInfo: "ಈ ಸಮಸ್ಯೆಗೆ ಸಂಬಂಧಿಸಿದ ಮಾರ್ಗ ಪಟ್ಟಿ ಮಾಡಲಾಗಿಲ್ಲ. ಇದರಿಂದ ಸಹಾಯ ಲಭ್ಯವಿಲ್ಲ ಎಂದರ್ಥವಲ್ಲ.",
    eyebrow: "ನಿಮ್ಮ ಮುಂದಿನ ಹೆಜ್ಜೆ", title: "ನೀವು ಎಲ್ಲಿ ಸಹಾಯ ಪಡೆಯಬಹುದು?",
    intro: "ನಿಮ್ಮ ವರದಿಗೆ ಸಂಬಂಧಿಸಿದ ಸಂಭಾವ್ಯ ಸಂಸ್ಥೆಗಳು ಮತ್ತು ಸಹಾಯದ ಮಾರ್ಗಗಳು ಇವು.",
    government: "ಸರ್ಕಾರಿ ಇಲಾಖೆ", organisation: "ಸಹಾಯ ಸಂಸ್ಥೆ", verified: "ಸಂಪರ್ಕ ವಿವರಗಳನ್ನು ಪರಿಶೀಲಿಸಲಾಗಿದೆ",
    unverified: "ಸಂಪರ್ಕ ವಿವರಗಳನ್ನು ಇನ್ನೂ ಪರಿಶೀಲಿಸಲಾಗಿಲ್ಲ", services: "ಅವರು ನೀಡಬಹುದಾದ ಸಹಾಯ",
    notice: "ಸಂಪರ್ಕ ವಿವರಗಳು ಅಥವಾ ವೈಯಕ್ತಿಕ ಪ್ರಕರಣಗಳನ್ನು ಸ್ವೀಕರಿಸುವ ವಿಧಾನ ಇನ್ನೂ ಪರಿಶೀಲನೆಯಾಗಿಲ್ಲ. ವೈಯಕ್ತಿಕ ಮಾಹಿತಿಯನ್ನು ಹಂಚುವ ಮೊದಲು ಪರಿಶೀಲಿಸಿ.",
    view: "ಈ ಆಯ್ಕೆಯನ್ನು ನೋಡಿ", listen: "ಕೇಳಿ", listenAll: "ಎಲ್ಲಾ ಆಯ್ಕೆಗಳನ್ನು ಕೇಳಿ",
    disclaimer: "ಇವು ಸಹಾಯ ಪಡೆಯಲು ಇರುವ ಸಂಭಾವ್ಯ ಮಾರ್ಗಗಳು ಮಾತ್ರ. ShramSetu ನಿಮ್ಮ ದೂರನ್ನು ಯಾವುದೇ ಸಂಸ್ಥೆಗೆ ಕಳುಹಿಸಿಲ್ಲ. ನಿಮ್ಮ ಮೂಲ ವರದಿ ಪ್ರತ್ಯೇಕವಾಗಿರುತ್ತದೆ.",
    location: "ಪ್ರದೇಶ / ಸ್ಥಳ", option: "ಸಹಾಯದ ಆಯ್ಕೆ"
  },
  bn: {
    loading: "সম্ভাব্য সহায়তার পথ খোঁজা হচ্ছে...", loadingInfo: "আপনার জন্য প্রাসঙ্গিক বিকল্প খুঁজে পেতে অপেক্ষা করুন।",
    errorTitle: "সহায়তার বিকল্পগুলি লোড করা যায়নি।", error: "সহায়তার বিকল্পগুলি লোড করা যায়নি। আবার চেষ্টা করুন।",
    retry: "আবার চেষ্টা করুন", emptyTitle: "মিলছে এমন কোনো পথ পাওয়া যায়নি",
    emptyInfo: "এই সমস্যার জন্য কোনো পথ তালিকাভুক্ত নেই। এর মানে এই নয় যে সাহায্য পাওয়া যাবে না।",
    eyebrow: "আপনার পরবর্তী পদক্ষেপ", title: "আপনি কোথায় সাহায্য পেতে পারেন?",
    intro: "আপনার রিপোর্টের সঙ্গে সম্পর্কিত সম্ভাব্য সংস্থা ও সহায়তার পথগুলি এখানে দেওয়া হয়েছে।",
    government: "সরকারি বিভাগ", organisation: "সহায়তা সংস্থা", verified: "যোগাযোগের তথ্য যাচাই করা হয়েছে",
    unverified: "যোগাযোগের তথ্য এখনও যাচাই করা হয়নি", services: "সম্ভাব্য সহায়তা",
    notice: "যোগাযোগের তথ্য বা ব্যক্তিগত অভিযোগ গ্রহণের পদ্ধতি এখনও যাচাই করা হয়নি। ব্যক্তিগত তথ্য দেওয়ার আগে যাচাই করুন।",
    view: "এই বিকল্পটি দেখুন", listen: "শুনুন", listenAll: "সব বিকল্প শুনুন",
    disclaimer: "এগুলি সাহায্য পাওয়ার সম্ভাব্য পথ। ShramSetu আপনার অভিযোগ কোনো সংস্থার কাছে পাঠায়নি। আপনার মূল রিপোর্ট আলাদা থাকবে।",
    location: "এলাকা / অবস্থান", option: "সহায়তার বিকল্প"
  }
};

function getLocalized(pathway, language, field) {
  const translated = pathway?.translations?.[language];
  return translated?.[field] || pathway?.[field] || "";
}

function getDemoPathway() {
  return {
    id: "shramsetu-demo-support",
    type: "support_organisation",
    name: "ShramSetu Demo Worker Support",
    location: "Local demo inbox (Mailpit)",
    description:
      "Try the ShramSetu NGO email assistance workflow. Review your grievance details and send a help request to a simulated local inbox.",
    services: [
      "Preview a generated help-request email",
      "Send the request after giving consent",
      "See the captured email in the local demo inbox"
    ],
    contact_verified: false,
    demo_only: true
  };
}

const guideUiText = {
  en: {
    back: "Back to help options",
    eyebrow: "GOVERNMENT FILING GUIDE",
    appropriate: "When this route is appropriate",
    notFor: "Do not use this route for",
    steps: "Step-by-step instructions",
    prepare: "Keep these details ready",
    after: "After submitting",
    cautions: "Important limitations",
    sources: "Official sources",
    disclaimer: "ShramSetu provides guidance only. You must complete identity verification, review the live portal and submit the complaint yourself. Portal requirements may change.",
    chooseTitle: "Choose the government organisation",
    chooseInfo: "We couldn't confidently match this recommendation to one guide. Choose the organisation shown on your recommendation.",
    view: "View filing instructions"
  },
  te: {
    back: "సహాయ ఎంపికలకు తిరిగి వెళ్లండి",
    eyebrow: "ప్రభుత్వ ఫిర్యాదు మార్గదర్శిని",
    appropriate: "ఈ మార్గాన్ని ఎప్పుడు ఉపయోగించాలి",
    notFor: "ఈ మార్గాన్ని వీటి కోసం ఉపయోగించవద్దు",
    steps: "దశలవారీ సూచనలు",
    prepare: "ఈ వివరాలను సిద్ధంగా ఉంచుకోండి",
    after: "సమర్పించిన తర్వాత",
    cautions: "ముఖ్యమైన పరిమితులు",
    sources: "అధికారిక మూలాలు",
    disclaimer: "శ్రమసేతు మార్గదర్శకత్వం మాత్రమే అందిస్తుంది. గుర్తింపు ధృవీకరణ, ప్రస్తుత పోర్టల్ పరిశీలన మరియు ఫిర్యాదు తుది సమర్పణను మీరే పూర్తి చేయాలి. పోర్టల్ అవసరాలు మారవచ్చు.",
    chooseTitle: "ప్రభుత్వ సంస్థను ఎంచుకోండి",
    chooseInfo: "ఈ సిఫార్సుకు సరైన మార్గదర్శిని గుర్తించలేకపోయాము. మీకు చూపిన సంస్థను ఎంచుకోండి.",
    view: "ఫిర్యాదు సూచనలు చూడండి"
  },
  hi: {
    back: "सहायता विकल्पों पर वापस जाएँ",
    eyebrow: "सरकारी शिकायत मार्गदर्शिका",
    appropriate: "इस मार्ग का उपयोग कब करें",
    notFor: "इस मार्ग का उपयोग इनके लिए न करें",
    steps: "चरण-दर-चरण निर्देश",
    prepare: "ये विवरण तैयार रखें",
    after: "जमा करने के बाद",
    cautions: "महत्वपूर्ण सीमाएँ",
    sources: "आधिकारिक स्रोत",
    disclaimer: "ShramSetu केवल मार्गदर्शन देता है। पहचान सत्यापन, लाइव पोर्टल की जाँच और शिकायत जमा करने की प्रक्रिया आपको स्वयं पूरी करनी होगी। पोर्टल की आवश्यकताएँ बदल सकती हैं।",
    chooseTitle: "सरकारी संगठन चुनें",
    chooseInfo: "हम इस सुझाव को किसी एक मार्गदर्शिका से निश्चित रूप से नहीं जोड़ सके। सुझाव में दिखाया गया संगठन चुनें।",
    view: "शिकायत के निर्देश देखें"
  },
  ta: {
    back: "உதவி விருப்பங்களுக்குத் திரும்பு",
    eyebrow: "அரசு புகார் வழிகாட்டி",
    appropriate: "இந்த வழியை எப்போது பயன்படுத்தலாம்",
    notFor: "இந்த வழியை எதற்குப் பயன்படுத்தக்கூடாது",
    steps: "படிப்படியான வழிமுறைகள்",
    prepare: "இந்த விவரங்களைத் தயாராக வைத்திருங்கள்",
    after: "சமர்ப்பித்த பிறகு",
    cautions: "முக்கிய வரம்புகள்",
    sources: "அதிகாரப்பூர்வ ஆதாரங்கள்",
    disclaimer: "ShramSetu வழிகாட்டுதலை மட்டுமே வழங்குகிறது. அடையாளச் சரிபார்ப்பு, தற்போதைய இணையதளத்தைப் பார்வையிடுதல் மற்றும் புகாரைச் சமர்ப்பித்தல் ஆகியவற்றை நீங்களே முடிக்க வேண்டும். இணையதளத் தேவைகள் மாறலாம்.",
    chooseTitle: "அரசு அமைப்பைத் தேர்ந்தெடுக்கவும்",
    chooseInfo: "இந்தப் பரிந்துரையை ஒரு குறிப்பிட்ட வழிகாட்டியுடன் உறுதியாகப் பொருத்த முடியவில்லை. பரிந்துரையில் காட்டப்பட்ட அமைப்பைத் தேர்ந்தெடுக்கவும்.",
    view: "புகார் வழிமுறைகளைப் பார்க்கவும்"
  },
  kn: {
    back: "ಸಹಾಯ ಆಯ್ಕೆಗಳಿಗೆ ಹಿಂತಿರುಗಿ",
    eyebrow: "ಸರ್ಕಾರಿ ದೂರು ಮಾರ್ಗದರ್ಶಿ",
    appropriate: "ಈ ಮಾರ್ಗವನ್ನು ಯಾವಾಗ ಬಳಸಬೇಕು",
    notFor: "ಈ ಮಾರ್ಗವನ್ನು ಇವುಗಳಿಗೆ ಬಳಸಬೇಡಿ",
    steps: "ಹಂತ ಹಂತದ ಸೂಚನೆಗಳು",
    prepare: "ಈ ವಿವರಗಳನ್ನು ಸಿದ್ಧವಾಗಿಡಿ",
    after: "ಸಲ್ಲಿಸಿದ ನಂತರ",
    cautions: "ಮುಖ್ಯ ಮಿತಿಗಳು",
    sources: "ಅಧಿಕೃತ ಮೂಲಗಳು",
    disclaimer: "ShramSetu ಮಾರ್ಗದರ್ಶನವನ್ನು ಮಾತ್ರ ನೀಡುತ್ತದೆ. ಗುರುತಿನ ಪರಿಶೀಲನೆ, ಪ್ರಸ್ತುತ ಪೋರ್ಟಲ್ ಪರಿಶೀಲನೆ ಮತ್ತು ದೂರಿನ ಅಂತಿಮ ಸಲ್ಲಿಕೆಯನ್ನು ನೀವೇ ಪೂರ್ಣಗೊಳಿಸಬೇಕು. ಪೋರ್ಟಲ್ ಅವಶ್ಯಕತೆಗಳು ಬದಲಾಗಬಹುದು.",
    chooseTitle: "ಸರ್ಕಾರಿ ಸಂಸ್ಥೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ",
    chooseInfo: "ಈ ಶಿಫಾರಸನ್ನು ಒಂದು ನಿರ್ದಿಷ್ಟ ಮಾರ್ಗದರ್ಶಿಗೆ ಖಚಿತವಾಗಿ ಹೊಂದಿಸಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ. ಶಿಫಾರಸಿನಲ್ಲಿ ತೋರಿಸಿರುವ ಸಂಸ್ಥೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ.",
    view: "ದೂರು ಸೂಚನೆಗಳನ್ನು ನೋಡಿ"
  },
  bn: {
    back: "সহায়তার বিকল্পগুলিতে ফিরে যান",
    eyebrow: "সরকারি অভিযোগ নির্দেশিকা",
    appropriate: "কখন এই পথটি ব্যবহার করবেন",
    notFor: "যেসব ক্ষেত্রে এই পথ ব্যবহার করবেন না",
    steps: "ধাপে ধাপে নির্দেশাবলী",
    prepare: "এই তথ্যগুলি প্রস্তুত রাখুন",
    after: "জমা দেওয়ার পরে",
    cautions: "গুরুত্বপূর্ণ সীমাবদ্ধতা",
    sources: "সরকারি সূত্র",
    disclaimer: "ShramSetu শুধুমাত্র নির্দেশিকা দেয়। পরিচয় যাচাই, বর্তমান পোর্টাল পরীক্ষা এবং অভিযোগ জমা দেওয়ার কাজ আপনাকেই সম্পন্ন করতে হবে। পোর্টালের নিয়ম পরিবর্তিত হতে পারে।",
    chooseTitle: "সরকারি সংস্থা নির্বাচন করুন",
    chooseInfo: "এই সুপারিশটিকে নিশ্চিতভাবে কোনো একটি নির্দেশিকার সঙ্গে মেলানো যায়নি। সুপারিশে দেখানো সংস্থাটি নির্বাচন করুন।",
    view: "অভিযোগের নির্দেশাবলী দেখুন"
  }
};

function toGuideList(value) {
  if (Array.isArray(value)) return value;
  if (typeof value === "string" && value.trim()) return [value];
  return [];
}

function ComplaintPathways({ report, language: selectedLanguage, onSelectPathway }) {
  const [pathways, setPathways] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [playingAll, setPlayingAll] = useState(false);
  const [selectedGuideId, setSelectedGuideId] = useState(null);
  const [showGuideChooser, setShowGuideChooser] = useState(false);
  const language = selectedLanguage || report?.language || "en";
  const t = pathwayText[language] || pathwayText.en;
  const { speak, stopSpeech, speaking, loading: speechLoading } = useSpeech(language);

  useEffect(() => {
    let cancelled = false;
    if (!report) {
      setError(t.error);
      setLoading(false);
      return undefined;
    }
    async function fetchPathways() {
      try {
        setLoading(true);
        setError("");
       
const response = await fetch(
  `${API_URL}/routing/recommendations`,
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(report),
  }
);

if (!response.ok) {
  throw new Error(`Routing request failed (${response.status})`);
}

const data = await response.json();

if (!data.success) {
  throw new Error(data.detail || "Unable to find support channels.");
}

if (!cancelled) {
  // Convert government_routes into the format used by the UI.
  const governmentPathways = (data.government_routes || []).map((route) => ({
    id: route.id,
    type: "government_authority",
    name: route.name,
    location: route.jurisdiction || "",
    description: route.why_relevant || "",
    services: [],
    contact_verified: false,
    official_url: route.official_url,
    sources: route.source_urls || [],
    limitations: route.limitations || "",
    verification_status: route.verification_status || "",
    submission_model: route.submission_model || "",
  }));

  // Convert NGO matches into the format used by the UI.
  const supportPathways = (data.ngo_matches || []).map((ngo) => ({
    id: ngo.id,
    type: "support_organisation",
    name: ngo.name,
    location: ngo.location || "",
    description: ngo.why_listed || "",
    services: [],
    contact_verified: false,
    limitations: ngo.limitations || "",
    verification_status: ngo.verification_status || "",
  }));

  const existingPathways = [
    ...governmentPathways,
    ...supportPathways,
  ];

  const hasDemoPathway = existingPathways.some(
    (pathway) => pathway.id === "shramsetu-demo-support"
  );

  setPathways(
    hasDemoPathway
      ? existingPathways
      : [...existingPathways, getDemoPathway()]
  );
}

      } catch (err) {
        if (!cancelled) setError(err.message || t.error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchPathways();
    return () => { cancelled = true; };
  }, [report, language]); // eslint-disable-line react-hooks/exhaustive-deps

  const governmentGuides = portalData.portals || [];

  function findGuideForPathway(pathway) {
    const rawId = String(pathway?.portal_id || pathway?.guide_id || pathway?.id || "").toLowerCase();
    const rawName = String(pathway?.name || pathway?.title || "").toLowerCase();
    const haystack = `${rawId} ${rawName}`;
    const aliases = [
      ["samadhan", ["samadhan", "wage claim", "unpaid wage", "delayed wage"]],
      ["telangana-labour", ["telangana labour", "labour department", "labour officer", "labour commissioner"]],
      ["prajavani", ["prajavani", "praja bhavan"]],
      ["cpgrams", ["cpgrams", "central grievance", "pgportal"]],
      ["eshram-gms", ["e-shram", "eshram", "gms"]],
      ["tbocwwb", ["tbocwwb", "building and other construction", "construction workers welfare"]],
      ["erss-112", ["112", "erss", "emergency response"]],
      ["women-safety-sahas", ["sahas", "women safety", "workplace sexual harassment"]],
      ["legal-aid", ["legal services", "dlsa", "tslsa", "nalsa", "legal aid"]],
      ["epfigms", ["epfo", "epfigms", "provident fund", "pf grievance"]]
    ];
    // Exact portal identifiers take priority.
    const exact = governmentGuides.find((guide) => rawId === guide.id);
    if (exact) return exact;
    for (const [id, terms] of aliases) {
      if (terms.some((term) => haystack.includes(term))) {
        return governmentGuides.find((guide) => guide.id === id) || null;
      }
    }
    return governmentGuides.find((guide) => {
      const guideName = guide.name.toLowerCase();
      return rawName && (rawName.includes(guideName) || guideName.includes(rawName));
    }) || null;
  }

 function handleViewPathway(pathway) {
  if (isGovernmentPathway(pathway)) {
    const guide = findGuideForPathway(pathway);

    if (guide) {
      setSelectedGuideId(guide.id);
      setShowGuideChooser(false);
    } else {
      setSelectedGuideId(null);
      setShowGuideChooser(true);
    }

    stopSpeech();
    return;
  }

  onSelectPathway?.(pathway);
}

  const selectedGuide = governmentGuides.find((guide) => guide.id === selectedGuideId);

  
const guideLabels = guideUiText[language] || guideUiText.en;

const localizedGuide = selectedGuide
  ? {
      ...selectedGuide,
      ...(selectedGuide.translations?.[language] || {})
    }
  : null;
  
function GuideSection({ title, items = [], numbered = false, warning = false }) {
  const safeItems = toGuideList(items);
  if (!safeItems.length) return null;

  const ListTag = numbered ? "ol" : "ul";

  return (
    <section className={`ss-guide-block ${warning ? "ss-warning" : ""}`}>
      <h3>{title}</h3>
      <ListTag>
        {safeItems.map((item, index) => (
          <li key={`${index}-${item}`}>{item}</li>
        ))}
      </ListTag>
    </section>
  );
}

  const speakOne = (pathway) => {
    const parts = [
      getLocalized(pathway, language, "name"),
      getLocalized(pathway, language, "location"),
      getLocalized(pathway, language, "description"),
      ...(getLocalized(pathway, language, "services") || [])
    ].filter(Boolean);
    if (speaking) stopSpeech();
    else speak(parts.join(". "));
  };

  async function speakAll() {
    if (playingAll) {
      setPlayingAll(false);
      stopSpeech();
      return;
    }
    setPlayingAll(true);
    const chunks = [
      `${t.eyebrow}. ${t.title}. ${t.intro}`,
      ...pathways.map((p) => [
        getLocalized(p, language, "name"),
        getLocalized(p, language, "location"),
        getLocalized(p, language, "description"),
        ...(getLocalized(p, language, "services") || []),
        p.contact_verified ? t.verified : t.unverified,
        !p.contact_verified ? t.notice : ""
      ].filter(Boolean).join(". ")),
      t.disclaimer
    ].filter(Boolean);
    try {
      for (const chunk of chunks) {
        if (!playingAll) break;
        await new Promise((resolve) => {
          speak(chunk);
          const check = window.setInterval(() => {
            if (!speaking) {
              window.clearInterval(check);
              resolve();
            }
          }, 250);
          window.setTimeout(() => { window.clearInterval(check); resolve(); }, 30000);
        });
      }
    } finally {
      setPlayingAll(false);
    }
  }

  if (loading) return <div className="pathways-state"><div className="pathways-spinner" /><h2>{t.loading}</h2><p>{t.loadingInfo}</p></div>;
  if (error) return <div className="pathways-state"><div className="pathways-state-icon"><ShieldAlert /></div><h2>{t.errorTitle}</h2><p>{error}</p><button className="pathways-primary-button" onClick={() => window.location.reload()}>{t.retry}</button></div>;
  if (!pathways.length) return <div className="pathways-state"><h2>{t.emptyTitle}</h2><p>{t.emptyInfo}</p></div>;


if (selectedGuide && localizedGuide) {
  return (
    <section className="ss-guides">
      <button
        className="ss-back"
        type="button"
        onClick={() => setSelectedGuideId(null)}
      >
        ← {guideLabels.back}
      </button>

      <div className="ss-guide-heading">
        <span className="ss-eyebrow">{guideLabels.eyebrow}</span>
        <h2>{localizedGuide.name || selectedGuide.name}</h2>
        <p>{localizedGuide.scope || selectedGuide.scope}</p>
        <span className="ss-guide-type">
          {localizedGuide.type || selectedGuide.type}
        </span>
      </div>

      <div className="ss-guide-actions">
        <a
          className="ss-official-link"
          href={selectedGuide.official_url || selectedGuide.url}
          target="_blank"
          rel="noreferrer"
        >
          {language === "te" ? "అధికారిక వెబ్‌సైట్ తెరవండి ↗" :
           language === "hi" ? "आधिकारिक वेबसाइट खोलें ↗" :
           language === "ta" ? "அதிகாரப்பூர்வ இணையதளத்தைத் திறக்கவும் ↗" :
           language === "kn" ? "ಅಧಿಕೃತ ವೆಬ್‌ಸೈಟ್ ತೆರೆಯಿರಿ ↗" :
           language === "bn" ? "সরকারি ওয়েবসাইট খুলুন ↗" :
           "Open official website ↗"}
        </a>
      </div>

      <GuideSection
        title={guideLabels.appropriate}
        items={localizedGuide.when_to_use}
      />
      <GuideSection
        title={guideLabels.notFor}
        items={localizedGuide.not_for}
        warning
      />
      <GuideSection
        title={guideLabels.steps}
        items={localizedGuide.steps}
        numbered
      />
      <GuideSection
        title={guideLabels.prepare}
        items={localizedGuide.prepare}
      />
      <GuideSection
        title={guideLabels.after}
        items={localizedGuide.after}
      />
      <GuideSection
        title={guideLabels.cautions}
        items={localizedGuide.cautions}
        warning
      />

      <div className="ss-source-list">
        <h3>{guideLabels.sources}</h3>
        {(selectedGuide.sources || []).map((url) => (
          <a key={url} href={url} target="_blank" rel="noreferrer">
            {url}
          </a>
        ))}
      </div>

      <p className="ss-disclaimer">{guideLabels.disclaimer}</p>
    </section>
  );
}


  if (showGuideChooser) {
    return (
      <section className="ss-guides">
        <button className="ss-back" type="button" onClick={() => setShowGuideChooser(false)}>← {guideLabels.back}</button>
        <div className="ss-guide-heading"><span className="ss-eyebrow">{guideLabels.eyebrow}</span><h2>{guideLabels.chooseTitle}</h2><p>{guideLabels.chooseInfo}</p></div>
        <div className="ss-guide-grid">{governmentGuides.map((guide) => <button className="ss-guide-card" type="button" key={guide.id} onClick={() => { setSelectedGuideId(guide.id); setShowGuideChooser(false); }}><span className="ss-card-title">{guide.translations?.[language]?.name || guide.name}
</span><span className="ss-card-scope"> {guide.translations?.[language]?.scope || guide.scope}
</span><span className="ss-card-cta">{guideLabels.view}</span></button>)}</div>
      </section>
    );
  }

  return (
    <section className="complaint-pathways">
      <header className="pathways-hero">
        <div className="pathways-hero-icon"><ShieldCheck size={27} /></div>
        <p className="pathways-eyebrow">{t.eyebrow}</p>
        <h1>{t.title}</h1>
        <p className="pathways-intro">{t.intro}</p>
        <button type="button" className="pathways-listen-all" onClick={speakAll} disabled={speechLoading}>
          {playingAll || speaking ? <VolumeX size={19} /> : <Headphones size={19} />}
          {speechLoading ? "…" : playingAll ? (language === "te" ? "ఆపండి" : language === "hi" ? "रोकें" : language === "ta" ? "நிறுத்து" : language === "kn" ? "ನಿಲ್ಲಿಸಿ" : language === "bn" ? "থামুন" : "Stop") : t.listenAll}
        </button>
      </header>

      <div className="pathways-results-heading">
        <div><span>{t.option}</span><strong>{pathways.length.toString().padStart(2, "0")}</strong></div>
        <p>{t.intro}</p>
      </div>

      {(() => {
       const governmentPathways = pathways.filter(isGovernmentPathway);

const supportPathways = pathways.filter(
  (p) => !isGovernmentPathway(p)
);
        const renderCard = (pathway, index) => {
          const verified = pathway.contact_verified === true;
          const isDemoPathway = pathway.id === "shramsetu-demo-support";

          const name = getLocalized(pathway, language, "name");
          const location = getLocalized(pathway, language, "location");
          const description = getLocalized(pathway, language, "description");
          const services = getLocalized(pathway, language, "services") || [];
          return (
            <article className={`pathway-card ${isGovernmentPathway(pathway) ? "pathway-government" : "pathway-community"}`} key={pathway.id || `${pathway.type}-${index}`}>
              <div className="pathway-card-heading">
                <span className="pathway-number">{String(index + 1).padStart(2, "0")}</span>
                <span className="pathway-type">{isGovernmentPathway(pathway) ? t.government : t.organisation}</span>
                <span className={`pathway-verification ${isDemoPathway ? "is-unverified" : verified ? "is-verified" : "is-unverified"}`}>
  {isDemoPathway ? (
    <>
      <ShieldAlert size={14} />
      DEMO ONLY
    </>
  ) : (
    <>
      {verified ? <ShieldCheck size={14} /> : <ShieldAlert size={14} />}
      {verified ? t.verified : t.unverified}
    </>
  )}
</span>
              </div>
              <h2>{name}</h2>
              {location && <p className="pathway-location"><MapPin size={15} />{location}</p>}
              <p className="pathway-description">{description}</p>
              {services.length > 0 && <div className="pathway-services"><h3>{t.services}</h3><ul>{services.map((service, i) => <li key={i}>{service}</li>)}</ul></div>}
{!verified && !isDemoPathway && (
  <div className="pathway-notice">
    <ShieldAlert size={17} />
    <span>{t.notice}</span>
  </div>
)}              <div className="pathway-card-actions">
                <button type="button" className="pathway-listen-button" onClick={() => speakOne(pathway)} disabled={speechLoading}>
                  {speaking ? <VolumeX size={17} /> : <Volume2 size={17} />}{t.listen}
                </button>
                <button
  type="button"
  className="pathway-select-button"
  onClick={() => handleViewPathway(pathway)}
>
  {isDemoPathway ? "Request Help" : t.view}
  <ArrowRight size={17} />
</button>
              </div>
            </article>
          );
        };
        return <>
          {governmentPathways.length > 0 && <section className="pathways-group"><h2 className="pathways-group-title">Government complaint routes</h2><div className="pathways-grid">{governmentPathways.map(renderCard)}</div></section>}
          {supportPathways.length > 0 && <section className="pathways-group"><h2 className="pathways-group-title">NGOs and support organisations</h2><div className="pathways-grid">{supportPathways.map(renderCard)}</div></section>}
        </>;
      })()}
      <p className="pathways-disclaimer">{t.disclaimer}</p>
    </section>
  );
}

function isGovernmentPathway(pathway) {
  const text = [
    pathway?.type,
    pathway?.id,
    pathway?.portal_id,
    pathway?.name,
    pathway?.title
  ].filter(Boolean).join(" ").toLowerCase();

  const governmentKeywords = [
    "government_department",
    "government department",
    "telangana labour",
    "labour department",
    "labour officer",
    "district legal services",
    "legal services authority",
    "dlsa",
    "tslsa",
    "nalsa",
    "samadhan",
    "prajavani",
    "cpgrams",
    "pgportal",
    "e-shram",
    "eshram",
    "tbocwwb",
    "construction workers welfare",
    "epfo",
    "epfigms",
    "women safety wing",
    "sahas",
    "erss",
    "112"
  ];

  return governmentKeywords.some(keyword => text.includes(keyword));
}

export default ComplaintPathways;
