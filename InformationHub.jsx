import { useMemo, useState } from "react";
import { ArrowLeft, Languages, Search, Volume2, Square, MapPin, Info } from "lucide-react";
import { useLanguage } from "./LanguageContext";
import useSpeech from "./useSpeech";
import "./InformationHub.css";

const COPY = {
  en: {
    track: "Track My Complaint",
    rightsTitle:"Know Your Rights", rightsIntro:"Understand important protections at work and what steps you can take.",
    helpTitle:"Find Help", helpIntro:"Explore the kinds of services that may be able to support you. Confirm availability before travelling.",
    migrantsTitle:"New to Hyderabad?", migrantsIntro:"A practical starting guide to everyday services in your new city.",
    listen:"Listen", stop:"Stop", search:"Search topics", back:"Back to home", note:"General information only. Your exact rights and eligibility can depend on your work arrangement and current law.",
    sections:[
      ["Wages and deductions","You should be paid the wages agreed for your work, subject to applicable minimum-wage rules. Keep a record of days worked, payments and deductions. Ask for a written wage calculation if money is withheld."],
      ["Working hours and rest","Working-hour limits, overtime and weekly rest depend on the law and the type of establishment. Keep your own record of start times, finish times and rest days."],
      ["Workplace safety","Work should be organised with appropriate safety measures. Report dangerous conditions when it is safe to do so. Do not put yourself at risk to collect evidence."],
      ["Injury at work","Get medical help first if you are injured. Keep available medical records and details of when and where the injury happened. Employment-related compensation may depend on the circumstances."],
      ["Abuse, threats and forced work","Threats, violence, confinement, forced work or withholding identity documents are serious warning signs. If you are in immediate danger, move to safety and call 112 when possible."],
      ["Women at work","Workplace sexual harassment is prohibited under Indian law. Workers can seek support through the appropriate Internal Committee or Local Committee, depending on the workplace and circumstances."]
    ]
  },
  hi: {
    track: "मेरी शिकायत ट्रैक करें",
    rightsTitle:"अपने अधिकार जानें", rightsIntro:"काम पर मिलने वाली जरूरी सुरक्षा और आगे उठाए जा सकने वाले कदम समझें।",
    helpTitle:"मदद पाएं", helpIntro:"जानें कि किस तरह की सेवाएं सहायता कर सकती हैं। जाने से पहले उपलब्धता की पुष्टि करें।",
    migrantsTitle:"हैदराबाद में नए हैं?", migrantsIntro:"नए शहर में रोजमर्रा की सेवाओं के लिए एक शुरुआती मार्गदर्शिका।",
    listen:"सुनें", stop:"रोकें", search:"विषय खोजें", back:"होम पर वापस", note:"यह सामान्य जानकारी है। आपके अधिकार और पात्रता काम की स्थिति और लागू कानून पर निर्भर कर सकते हैं।",
    sections:[
      ["मजदूरी और कटौती","आपको अपने काम के लिए तय मजदूरी मिलनी चाहिए और लागू न्यूनतम मजदूरी के नियम भी लागू हो सकते हैं। काम के दिन, भुगतान और कटौती का रिकॉर्ड रखें।"],
      ["काम के घंटे और आराम","काम के घंटे, ओवरटाइम और साप्ताहिक छुट्टी के नियम काम की जगह और लागू कानून पर निर्भर करते हैं। अपना रिकॉर्ड रखें।"],
      ["कार्यस्थल की सुरक्षा","काम की जगह पर उचित सुरक्षा उपाय होने चाहिए। सुरक्षित होने पर खतरनाक स्थिति की जानकारी दें। सबूत जुटाने के लिए खुद को जोखिम में न डालें।"],
      ["काम के दौरान चोट","चोट लगने पर पहले चिकित्सा सहायता लें। उपलब्ध मेडिकल रिकॉर्ड और घटना का समय-स्थान संभालकर रखें।"],
      ["शोषण, धमकी और जबरन काम","धमकी, हिंसा, बंद करके रखना, जबरन काम या पहचान दस्तावेज रोकना गंभीर संकेत हैं। तुरंत खतरा हो तो सुरक्षित जगह जाएं और संभव हो तो 112 पर कॉल करें।"],
      ["महिलाओं के अधिकार","भारतीय कानून के तहत कार्यस्थल पर यौन उत्पीड़न प्रतिबंधित है। परिस्थिति के अनुसार संबंधित आंतरिक या स्थानीय समिति से सहायता ली जा सकती है।"]
    ]
  },
  te: {
    track: "నా ఫిర్యాదును ట్రాక్ చేయండి",
    rightsTitle:"మీ హక్కులను తెలుసుకోండి", rightsIntro:"పనిచోట మీకు వర్తించే రక్షణలు, తీసుకోవాల్సిన చర్యలను తెలుసుకోండి.",
    helpTitle:"సహాయం పొందండి", helpIntro:"మీకు ఉపయోగపడే సేవల రకాలను చూడండి. వెళ్లే ముందు అందుబాటును నిర్ధారించుకోండి.",
    migrantsTitle:"హైదరాబాద్‌కు కొత్తగా వచ్చారా?", migrantsIntro:"కొత్త నగరంలో రోజువారీ సేవల కోసం ప్రారంభ మార్గదర్శి.",
    listen:"వినండి", stop:"ఆపండి", search:"విషయాలను వెతకండి", back:"హోమ్‌కు తిరిగి వెళ్లండి", note:"ఇది సాధారణ సమాచారం మాత్రమే. మీ హక్కులు, అర్హతలు పని విధానం మరియు వర్తించే చట్టాలపై ఆధారపడవచ్చు.",
    sections:[
      ["వేతనాలు మరియు కోతలు","మీ పనికి అంగీకరించిన వేతనం చెల్లించాలి. వర్తించే కనీస వేతన నియమాలు కూడా ఉండవచ్చు. పని రోజులు, చెల్లింపులు, కోతల వివరాలు నమోదు చేసుకోండి."],
      ["పని గంటలు మరియు విశ్రాంతి","పని గంటలు, ఓవర్‌టైమ్, వారాంతపు విశ్రాంతి నియమాలు పని స్థలం మరియు వర్తించే చట్టంపై ఆధారపడతాయి. మీ స్వంత రికార్డు ఉంచుకోండి."],
      ["పనిచోట భద్రత","పనిచోట తగిన భద్రతా చర్యలు ఉండాలి. సురక్షితంగా ఉన్నప్పుడు ప్రమాదకర పరిస్థితులను తెలియజేయండి."],
      ["పనిలో గాయం","గాయం అయితే ముందుగా వైద్య సహాయం పొందండి. అందుబాటులో ఉన్న వైద్య పత్రాలు, సంఘటన వివరాలు భద్రపరచండి."],
      ["వేధింపులు, బెదిరింపులు, బలవంతపు పని","బెదిరింపులు, హింస, నిర్బంధం, బలవంతపు పని లేదా గుర్తింపు పత్రాలను తీసుకోవడం తీవ్రమైన హెచ్చరికలు. తక్షణ ప్రమాదం ఉంటే సురక్షిత ప్రదేశానికి వెళ్లి 112కు కాల్ చేయండి."],
      ["మహిళా కార్మికుల హక్కులు","భారత చట్టం ప్రకారం పనిస్థలంలో లైంగిక వేధింపులు నిషేధించబడ్డాయి. పరిస్థితిని బట్టి సంబంధిత అంతర్గత లేదా స్థానిక కమిటీ సహాయం అందించవచ్చు."]
    ]
  },
  ta: {
    track: "எனது புகாரைக் கண்காணிக்கவும்",
    rightsTitle:"உங்கள் உரிமைகளை அறியுங்கள்", rightsIntro:"வேலை இடத்தில் உள்ள பாதுகாப்புகளையும் நீங்கள் எடுக்கக்கூடிய நடவடிக்கைகளையும் அறியுங்கள்.",
    helpTitle:"உதவியைத் தேடுங்கள்", helpIntro:"உங்களுக்கு உதவக்கூடிய சேவைகளைப் பாருங்கள். செல்வதற்கு முன் கிடைப்பதை உறுதிப்படுத்துங்கள்.",
    migrantsTitle:"ஹைதராபாத்திற்கு புதிதா?", migrantsIntro:"புதிய நகரத்தில் அன்றாட சேவைகளுக்கான தொடக்க வழிகாட்டி.",
    listen:"கேளுங்கள்", stop:"நிறுத்து", search:"தலைப்புகளைத் தேடுங்கள்", back:"முகப்புக்குத் திரும்பு", note:"இது பொதுவான தகவல். உங்கள் உரிமைகள் மற்றும் தகுதி வேலை ஏற்பாடு, பொருந்தும் சட்டத்தைப் பொறுத்தது.",
    sections:[
      ["ஊதியம் மற்றும் பிடித்தம்","உங்கள் பணிக்காக ஒப்புக்கொண்ட ஊதியம் வழங்கப்பட வேண்டும். பொருந்தும் குறைந்தபட்ச ஊதிய விதிகளும் இருக்கலாம். வேலை நாட்கள், பணம், பிடித்தம் ஆகியவற்றைப் பதிவு செய்யுங்கள்."],
      ["வேலை நேரம் மற்றும் ஓய்வு","வேலை நேரம், கூடுதல் நேர ஊதியம், வார ஓய்வு ஆகியவை பணியிடம் மற்றும் சட்டத்தைப் பொறுத்தது. உங்கள் பதிவை வைத்திருங்கள்."],
      ["பணியிட பாதுகாப்பு","பணியிடத்தில் உரிய பாதுகாப்பு ஏற்பாடுகள் இருக்க வேண்டும். பாதுகாப்பாக இருந்தால் ஆபத்தான நிலையைத் தெரிவியுங்கள்."],
      ["வேலையில் காயம்","காயம் ஏற்பட்டால் முதலில் மருத்துவ உதவி பெறுங்கள். மருத்துவப் பதிவுகளையும் சம்பவ விவரங்களையும் வைத்திருங்கள்."],
      ["துன்புறுத்தல் மற்றும் கட்டாய வேலை","மிரட்டல், வன்முறை, அடைத்துவைத்தல், கட்டாய வேலை அல்லது அடையாள ஆவணங்களைப் பறித்தல் ஆகியவை கடுமையான எச்சரிக்கைகள். உடனடி ஆபத்து இருந்தால் பாதுகாப்பான இடத்திற்குச் சென்று 112-ஐ அழைக்கவும்."],
      ["பெண் தொழிலாளர்களின் உரிமைகள்","இந்திய சட்டப்படி பணியிட பாலியல் துன்புறுத்தல் தடைசெய்யப்பட்டுள்ளது. சூழ்நிலைக்கு ஏற்ப உரிய உள் அல்லது உள்ளூர் குழுவை அணுகலாம்."]
    ]
  },
  kn: {
    track: "ನನ್ನ ದೂರನ್ನು ಟ್ರ್ಯಾಕ್ ಮಾಡಿ",
    rightsTitle:"ನಿಮ್ಮ ಹಕ್ಕುಗಳನ್ನು ತಿಳಿಯಿರಿ", rightsIntro:"ಕೆಲಸದ ಸ್ಥಳದ ರಕ್ಷಣೆಗಳು ಮತ್ತು ನೀವು ತೆಗೆದುಕೊಳ್ಳಬಹುದಾದ ಕ್ರಮಗಳನ್ನು ತಿಳಿಯಿರಿ.",
    helpTitle:"ಸಹಾಯ ಹುಡುಕಿ", helpIntro:"ನಿಮಗೆ ನೆರವಾಗಬಹುದಾದ ಸೇವೆಗಳ ವಿಧಗಳನ್ನು ನೋಡಿ. ಹೋಗುವ ಮೊದಲು ಲಭ್ಯತೆಯನ್ನು ಖಚಿತಪಡಿಸಿಕೊಳ್ಳಿ.",
    migrantsTitle:"ಹೈದರಾಬಾದ್‌ಗೆ ಹೊಸಬರೇ?", migrantsIntro:"ಹೊಸ ನಗರದಲ್ಲಿನ ದೈನಂದಿನ ಸೇವೆಗಳಿಗಾಗಿ ಪ್ರಾರಂಭಿಕ ಮಾರ್ಗದರ್ಶಿ.",
    listen:"ಆಲಿಸಿ", stop:"ನಿಲ್ಲಿಸಿ", search:"ವಿಷಯಗಳನ್ನು ಹುಡುಕಿ", back:"ಮುಖಪುಟಕ್ಕೆ ಹಿಂತಿರುಗಿ", note:"ಇದು ಸಾಮಾನ್ಯ ಮಾಹಿತಿ. ನಿಮ್ಮ ಹಕ್ಕುಗಳು ಮತ್ತು ಅರ್ಹತೆ ಕೆಲಸದ ವ್ಯವಸ್ಥೆ ಹಾಗೂ ಅನ್ವಯಿಸುವ ಕಾನೂನಿನ ಮೇಲೆ ಅವಲಂಬಿತವಾಗಿರಬಹುದು.",
    sections:[
      ["ವೇತನ ಮತ್ತು ಕಡಿತಗಳು","ನಿಮ್ಮ ಕೆಲಸಕ್ಕೆ ಒಪ್ಪಿಕೊಂಡ ವೇತನವನ್ನು ಪಾವತಿಸಬೇಕು. ಅನ್ವಯಿಸುವ ಕನಿಷ್ಠ ವೇತನ ನಿಯಮಗಳೂ ಇರಬಹುದು. ಕೆಲಸದ ದಿನಗಳು, ಪಾವತಿ ಮತ್ತು ಕಡಿತಗಳನ್ನು ದಾಖಲಿಸಿ."],
      ["ಕೆಲಸದ ಸಮಯ ಮತ್ತು ವಿಶ್ರಾಂತಿ","ಕೆಲಸದ ಸಮಯ, ಹೆಚ್ಚುವರಿ ಕೆಲಸ ಮತ್ತು ವಾರದ ವಿಶ್ರಾಂತಿ ನಿಯಮಗಳು ಕೆಲಸದ ಸ್ಥಳ ಮತ್ತು ಕಾನೂನಿನ ಮೇಲೆ ಅವಲಂಬಿತವಾಗಿವೆ. ನಿಮ್ಮ ದಾಖಲೆಯನ್ನು ಇಡಿ."],
      ["ಕೆಲಸದ ಸ್ಥಳದ ಸುರಕ್ಷತೆ","ಕೆಲಸದ ಸ್ಥಳದಲ್ಲಿ ಸೂಕ್ತ ಸುರಕ್ಷತಾ ಕ್ರಮಗಳು ಇರಬೇಕು. ಸುರಕ್ಷಿತವಾಗಿದ್ದರೆ ಅಪಾಯಕಾರಿ ಪರಿಸ್ಥಿತಿಯನ್ನು ತಿಳಿಸಿ."],
      ["ಕೆಲಸದಲ್ಲಿ ಗಾಯ","ಗಾಯವಾದರೆ ಮೊದಲು ವೈದ್ಯಕೀಯ ನೆರವು ಪಡೆಯಿರಿ. ವೈದ್ಯಕೀಯ ದಾಖಲೆಗಳು ಮತ್ತು ಘಟನೆಯ ವಿವರಗಳನ್ನು ಉಳಿಸಿಕೊಳ್ಳಿ."],
      ["ಕಿರುಕುಳ, ಬೆದರಿಕೆ ಮತ್ತು ಬಲವಂತದ ಕೆಲಸ","ಬೆದರಿಕೆ, ಹಿಂಸೆ, ಬಂಧನ, ಬಲವಂತದ ಕೆಲಸ ಅಥವಾ ಗುರುತಿನ ದಾಖಲೆಗಳನ್ನು ಕಸಿದುಕೊಳ್ಳುವುದು ಗಂಭೀರ ಸೂಚನೆಗಳು. ತಕ್ಷಣದ ಅಪಾಯವಿದ್ದರೆ ಸುರಕ್ಷಿತ ಸ್ಥಳಕ್ಕೆ ತೆರಳಿ 112ಕ್ಕೆ ಕರೆಮಾಡಿ."],
      ["ಮಹಿಳಾ ಕಾರ್ಮಿಕರ ಹಕ್ಕುಗಳು","ಭಾರತದ ಕಾನೂನಿನಡಿ ಕೆಲಸದ ಸ್ಥಳದಲ್ಲಿ ಲೈಂಗಿಕ ಕಿರುಕುಳ ನಿಷಿದ್ಧ. ಪರಿಸ್ಥಿತಿಗೆ ಅನುಗುಣವಾಗಿ ಆಂತರಿಕ ಅಥವಾ ಸ್ಥಳೀಯ ಸಮಿತಿಯನ್ನು ಸಂಪರ್ಕಿಸಬಹುದು."]
    ]
  },
  bn: {
    track: "আমার অভিযোগ ট্র্যাক করুন",
    rightsTitle:"আপনার অধিকার জানুন", rightsIntro:"কর্মক্ষেত্রে আপনার সুরক্ষা এবং কী পদক্ষেপ নিতে পারেন তা জানুন।",
    helpTitle:"সহায়তা খুঁজুন", helpIntro:"আপনাকে সাহায্য করতে পারে এমন পরিষেবার ধরন দেখুন। যাওয়ার আগে উপলভ্যতা নিশ্চিত করুন।",
    migrantsTitle:"হায়দরাবাদে নতুন?", migrantsIntro:"নতুন শহরের দৈনন্দিন পরিষেবার জন্য একটি প্রাথমিক নির্দেশিকা।",
    listen:"শুনুন", stop:"থামান", search:"বিষয় খুঁজুন", back:"হোমে ফিরুন", note:"এটি সাধারণ তথ্য। আপনার অধিকার ও যোগ্যতা কাজের ধরন এবং প্রযোজ্য আইনের ওপর নির্ভর করতে পারে।",
    sections:[
      ["মজুরি ও কর্তন","আপনার কাজের জন্য সম্মত মজুরি পাওয়া উচিত। প্রযোজ্য ন্যূনতম মজুরির নিয়মও থাকতে পারে। কাজের দিন, পেমেন্ট ও কর্তনের হিসাব রাখুন।"],
      ["কাজের সময় ও বিশ্রাম","কাজের সময়, অতিরিক্ত কাজ ও সাপ্তাহিক বিশ্রামের নিয়ম কর্মস্থল ও আইনের ওপর নির্ভর করে। নিজের রেকর্ড রাখুন।"],
      ["কর্মক্ষেত্রের নিরাপত্তা","কর্মক্ষেত্রে যথাযথ নিরাপত্তার ব্যবস্থা থাকা উচিত। নিরাপদ হলে বিপজ্জনক পরিস্থিতির কথা জানান।"],
      ["কাজে আঘাত","আঘাত পেলে আগে চিকিৎসা নিন। চিকিৎসার নথি এবং ঘটনার বিবরণ সংরক্ষণ করুন।"],
      ["নির্যাতন, হুমকি ও জোরপূর্বক কাজ","হুমকি, সহিংসতা, আটকে রাখা, জোরপূর্বক কাজ বা পরিচয়পত্র আটকে রাখা গুরুতর সতর্কসংকেত। তাৎক্ষণিক বিপদে নিরাপদ স্থানে যান এবং সম্ভব হলে 112-এ ফোন করুন।"],
      ["নারী শ্রমিকদের অধিকার","ভারতীয় আইনে কর্মক্ষেত্রে যৌন হয়রানি নিষিদ্ধ। পরিস্থিতি অনুযায়ী উপযুক্ত অভ্যন্তরীণ বা স্থানীয় কমিটির সাহায্য নেওয়া যায়।"]
    ]
  }
};

const HELP = {
  en: [
    ["Emergency response","For immediate danger, call 112. For a medical emergency, seek the nearest emergency department."],
    ["Labour department support","For wage, working-condition or employment-related concerns, ask the Telangana Labour Department about the correct office and complaint process."],
    ["Free legal aid","Eligible people can ask the Telangana State Legal Services Authority or the District Legal Services Authority about free legal assistance."],
    ["Medical care","For urgent injury or illness, go to a government hospital emergency department. Carry available prescriptions or medical records."],
    ["Worker-support organisations","Community organisations may offer counselling, referrals or assistance. Confirm their current services, eligibility and opening hours before visiting."],
    ["Women’s support","For harassment or violence, seek a safe place and ask a verified women’s support service or the appropriate legal authority for help."]
  ],
  hi: [
    ["आपातकालीन सहायता","तुरंत खतरे में 112 पर कॉल करें। चिकित्सा आपात स्थिति में नजदीकी अस्पताल के आपातकालीन विभाग जाएं।"],
    ["श्रम विभाग","मजदूरी या काम की स्थिति से जुड़ी समस्या के लिए तेलंगाना श्रम विभाग से सही कार्यालय और शिकायत प्रक्रिया पूछें।"],
    ["मुफ्त कानूनी सहायता","पात्र व्यक्ति तेलंगाना राज्य या जिला विधिक सेवा प्राधिकरण से मुफ्त कानूनी सहायता के बारे में पूछ सकते हैं।"],
    ["चिकित्सा सहायता","चोट या बीमारी में सरकारी अस्पताल के आपातकालीन विभाग जाएं। उपलब्ध मेडिकल कागजात साथ रखें।"],
    ["श्रमिक सहायता संगठन","सामुदायिक संगठन सलाह या रेफरल दे सकते हैं। जाने से पहले उनकी सेवाओं और समय की पुष्टि करें।"],
    ["महिलाओं के लिए सहायता","उत्पीड़न या हिंसा की स्थिति में सुरक्षित जगह जाएं और सत्यापित सहायता सेवा से संपर्क करें।"]
  ],
  te: [
    ["అత్యవసర సహాయం","తక్షణ ప్రమాదంలో 112కు కాల్ చేయండి. వైద్య అత్యవసర పరిస్థితిలో సమీప ఆసుపత్రి అత్యవసర విభాగానికి వెళ్లండి."],
    ["కార్మిక శాఖ సహాయం","వేతనాలు లేదా పని పరిస్థితుల సమస్యలకు సరైన కార్యాలయం, ఫిర్యాదు విధానం గురించి తెలంగాణ కార్మిక శాఖను అడగండి."],
    ["ఉచిత న్యాయ సహాయం","అర్హులైన వారు తెలంగాణ రాష్ట్ర లేదా జిల్లా న్యాయ సేవల సంస్థను ఉచిత న్యాయ సహాయం గురించి అడగవచ్చు."],
    ["వైద్య సహాయం","గాయం లేదా అనారోగ్యం ఉంటే ప్రభుత్వ ఆసుపత్రి అత్యవసర విభాగానికి వెళ్లండి. వైద్య పత్రాలు ఉంటే తీసుకెళ్లండి."],
    ["కార్మిక సహాయ సంస్థలు","సామాజిక సంస్థలు సలహా లేదా రిఫరల్ ఇవ్వవచ్చు. వెళ్లే ముందు సేవలు, సమయాలు నిర్ధారించండి."],
    ["మహిళలకు సహాయం","వేధింపులు లేదా హింస ఉంటే సురక్షిత ప్రదేశానికి వెళ్లి ధృవీకరించిన సహాయ సేవను సంప్రదించండి."]
  ],
  ta: [
    ["அவசர உதவி","உடனடி ஆபத்தில் 112-ஐ அழைக்கவும். மருத்துவ அவசரநிலையில் அருகிலுள்ள மருத்துவமனை அவசரப் பிரிவுக்குச் செல்லவும்."],
    ["தொழிலாளர் துறை","ஊதியம் அல்லது வேலைநிலை பிரச்சினைகளுக்கு சரியான அலுவலகம் மற்றும் புகார் முறையை தெலங்கானா தொழிலாளர் துறையிடம் கேளுங்கள்."],
    ["இலவச சட்ட உதவி","தகுதியுள்ளவர்கள் தெலங்கானா மாநில அல்லது மாவட்ட சட்ட சேவை ஆணையத்திடம் இலவச சட்ட உதவி கேட்கலாம்."],
    ["மருத்துவ உதவி","காயம் அல்லது நோய் ஏற்பட்டால் அரசு மருத்துவமனை அவசரப் பிரிவுக்குச் செல்லுங்கள்."],
    ["தொழிலாளர் ஆதரவு அமைப்புகள்","சமூக அமைப்புகள் ஆலோசனை அல்லது பரிந்துரை வழங்கலாம். செல்வதற்கு முன் சேவைகளை உறுதிப்படுத்துங்கள்."],
    ["பெண்களுக்கான உதவி","துன்புறுத்தல் அல்லது வன்முறை ஏற்பட்டால் பாதுகாப்பான இடத்திற்குச் சென்று சரிபார்க்கப்பட்ட சேவையை அணுகுங்கள்."]
  ],
  kn: [
    ["ತುರ್ತು ನೆರವು","ತಕ್ಷಣದ ಅಪಾಯದಲ್ಲಿ 112ಕ್ಕೆ ಕರೆಮಾಡಿ. ವೈದ್ಯಕೀಯ ತುರ್ತು ಪರಿಸ್ಥಿತಿಯಲ್ಲಿ ಹತ್ತಿರದ ಆಸ್ಪತ್ರೆಯ ತುರ್ತು ವಿಭಾಗಕ್ಕೆ ಹೋಗಿ."],
    ["ಕಾರ್ಮಿಕ ಇಲಾಖೆ","ವೇತನ ಅಥವಾ ಕೆಲಸದ ಪರಿಸ್ಥಿತಿಗಳ ಸಮಸ್ಯೆಗೆ ಸರಿಯಾದ ಕಚೇರಿ ಮತ್ತು ದೂರು ವಿಧಾನವನ್ನು ತೆಲಂಗಾಣ ಕಾರ್ಮಿಕ ಇಲಾಖೆಯಿಂದ ವಿಚಾರಿಸಿ."],
    ["ಉಚಿತ ಕಾನೂನು ನೆರವು","ಅರ್ಹರು ತೆಲಂಗಾಣ ರಾಜ್ಯ ಅಥವಾ ಜಿಲ್ಲಾ ಕಾನೂನು ಸೇವಾ ಪ್ರಾಧಿಕಾರವನ್ನು ಸಂಪರ್ಕಿಸಬಹುದು."],
    ["ವೈದ್ಯಕೀಯ ನೆರವು","ಗಾಯ ಅಥವಾ ಅನಾರೋಗ್ಯಕ್ಕೆ ಸರ್ಕಾರಿ ಆಸ್ಪತ್ರೆಯ ತುರ್ತು ವಿಭಾಗಕ್ಕೆ ಹೋಗಿ."],
    ["ಕಾರ್ಮಿಕ ಬೆಂಬಲ ಸಂಸ್ಥೆಗಳು","ಸಮುದಾಯ ಸಂಸ್ಥೆಗಳು ಸಲಹೆ ಅಥವಾ ರೆಫರಲ್ ನೀಡಬಹುದು. ಭೇಟಿ ಮೊದಲು ಸೇವೆಗಳನ್ನು ಖಚಿತಪಡಿಸಿಕೊಳ್ಳಿ."],
    ["ಮಹಿಳೆಯರ ನೆರವು","ಕಿರುಕುಳ ಅಥವಾ ಹಿಂಸೆಯ ಸಂದರ್ಭದಲ್ಲಿ ಸುರಕ್ಷಿತ ಸ್ಥಳಕ್ಕೆ ತೆರಳಿ ಪರಿಶೀಲಿತ ಸೇವೆಯನ್ನು ಸಂಪರ್ಕಿಸಿ."]
  ],
  bn: [
    ["জরুরি সহায়তা","তাৎক্ষণিক বিপদে 112 নম্বরে ফোন করুন। চিকিৎসার জরুরি অবস্থায় নিকটস্থ হাসপাতালের জরুরি বিভাগে যান।"],
    ["শ্রম দপ্তরের সহায়তা","মজুরি বা কাজের পরিবেশের সমস্যায় সঠিক অফিস ও অভিযোগের পদ্ধতি জানতে তেলেঙ্গানা শ্রম দপ্তরে যোগাযোগ করুন।"],
    ["বিনামূল্যে আইনি সহায়তা","যোগ্য ব্যক্তিরা তেলেঙ্গানা রাজ্য বা জেলা আইনি পরিষেবা কর্তৃপক্ষের কাছে বিনামূল্যে আইনি সহায়তা চাইতে পারেন।"],
    ["চিকিৎসা সহায়তা","আঘাত বা অসুস্থতায় সরকারি হাসপাতালের জরুরি বিভাগে যান।"],
    ["শ্রমিক সহায়তা সংস্থা","সামাজিক সংগঠন পরামর্শ বা রেফারেল দিতে পারে। যাওয়ার আগে পরিষেবা নিশ্চিত করুন।"],
    ["নারীদের সহায়তা","হয়রানি বা হিংসার ক্ষেত্রে নিরাপদ স্থানে যান এবং যাচাইকৃত সহায়তা পরিষেবার সঙ্গে যোগাযোগ করুন।"]
  ]
};

const MIGRANTS = {
  en: [
    ["Accommodation","Before paying a deposit, check the room in person, confirm rent, deposit, water, electricity, rules and refund terms. Keep a receipt."],
    ["Food and ration","Ask the nearest fair-price shop or food-supply office about ration access. One Nation One Ration Card portability may help eligible ration-card holders access benefits away from their home state."],
    ["Healthcare","Identify the nearest government primary health centre or government hospital. Keep prescriptions and important medical details accessible."],
    ["Transport","Use official TSRTC bus and Hyderabad Metro information for routes, fares and service updates. Check current timings before travel."],
    ["Documents and work records","Keep copies of identity documents, bank details, work agreements and wage records in a safe place. Do not hand over original identity documents as a condition of work without understanding why."],
    ["Children’s education","For school admission, approach a nearby government school or local education office and ask about admission support for children who have moved from another state."],
    ["Local essentials","Locate a nearby pharmacy, grocery shop, public water point and hospital. Save the addresses offline if possible."]
  ],
  hi: [
    ["रहने की जगह","जमा राशि देने से पहले कमरा देखें और किराया, पानी, बिजली, नियम तथा वापसी की शर्तें पूछें। रसीद लें।"],
    ["भोजन और राशन","राशन के लिए नजदीकी उचित मूल्य दुकान या खाद्य आपूर्ति कार्यालय से पूछें। पात्र राशन कार्ड धारकों को वन नेशन वन राशन कार्ड से दूसरे राज्य में भी लाभ मिल सकता है।"],
    ["स्वास्थ्य सेवा","नजदीकी सरकारी प्राथमिक स्वास्थ्य केंद्र या अस्पताल की जानकारी रखें। दवाइयों के पर्चे संभालें।"],
    ["यातायात","बस और मेट्रो के मार्ग, किराए और समय के लिए आधिकारिक TSRTC और Hyderabad Metro जानकारी देखें।"],
    ["दस्तावेज और काम का रिकॉर्ड","पहचान पत्र, बैंक विवरण, काम के समझौते और मजदूरी रिकॉर्ड की सुरक्षित प्रतियां रखें।"],
    ["बच्चों की शिक्षा","स्कूल प्रवेश के लिए नजदीकी सरकारी स्कूल या स्थानीय शिक्षा कार्यालय से संपर्क करें।"],
    ["जरूरी दुकानें","नजदीकी दवा दुकान, किराना, सार्वजनिक पानी की जगह और अस्पताल का पता रखें।"]
  ],
  te: [
    ["వసతి","డిపాజిట్ చెల్లించే ముందు గదిని చూసి అద్దె, డిపాజిట్, నీరు, విద్యుత్, నియమాలు, తిరిగి చెల్లింపు వివరాలు తెలుసుకోండి. రసీదు తీసుకోండి."],
    ["ఆహారం మరియు రేషన్","రేషన్ కోసం సమీప రేషన్ దుకాణం లేదా ఆహార సరఫరా కార్యాలయాన్ని అడగండి. అర్హులైన కార్డు దారులకు వన్ నేషన్ వన్ రేషన్ కార్డ్ ఉపయోగపడవచ్చు."],
    ["ఆరోగ్య సేవలు","సమీప ప్రభుత్వ ప్రాథమిక ఆరోగ్య కేంద్రం లేదా ఆసుపత్రి వివరాలు తెలుసుకోండి. మందుల పత్రాలు భద్రపరచండి."],
    ["రవాణా","బస్సు, మెట్రో మార్గాలు, ఛార్జీలు, సమయాల కోసం అధికారిక TSRTC మరియు హైదరాబాద్ మెట్రో సమాచారాన్ని చూడండి."],
    ["పత్రాలు మరియు పని రికార్డులు","గుర్తింపు పత్రాలు, బ్యాంకు వివరాలు, పని ఒప్పందాలు, వేతన రికార్డుల ప్రతులను భద్రంగా ఉంచండి."],
    ["పిల్లల విద్య","పాఠశాల ప్రవేశం కోసం సమీప ప్రభుత్వ పాఠశాల లేదా స్థానిక విద్యా కార్యాలయాన్ని సంప్రదించండి."],
    ["స్థానిక అవసరాలు","సమీప మందుల దుకాణం, కిరాణా, తాగునీటి స్థలం, ఆసుపత్రి చిరునామాలను తెలుసుకోండి."]
  ],
  ta: [
    ["தங்குமிடம்","முன்பணம் செலுத்தும் முன் அறையைப் பார்த்து வாடகை, முன்பணம், தண்ணீர், மின்சாரம், விதிகள் மற்றும் திருப்பித் தரும் நிபந்தனைகளை உறுதிப்படுத்துங்கள்."],
    ["உணவு மற்றும் ரேஷன்","ரேஷன் அணுகலுக்கு அருகிலுள்ள நியாய விலைக் கடை அல்லது உணவு வழங்கல் அலுவலகத்தைக் கேளுங்கள். தகுதியுள்ள அட்டைதாரர்களுக்கு ஒரே நாடு ஒரே ரேஷன் அட்டை உதவலாம்."],
    ["சுகாதாரம்","அருகிலுள்ள அரசு ஆரம்ப சுகாதார நிலையம் அல்லது மருத்துவமனையை அறிந்து கொள்ளுங்கள்."],
    ["போக்குவரத்து","பேருந்து மற்றும் மெட்ரோ வழித்தடம், கட்டணம், நேரங்களுக்கு அதிகாரப்பூர்வ TSRTC மற்றும் மெட்ரோ தகவலைப் பாருங்கள்."],
    ["ஆவணங்கள் மற்றும் வேலைப் பதிவுகள்","அடையாள ஆவணங்கள், வங்கி விவரங்கள், வேலை ஒப்பந்தங்கள், ஊதியப் பதிவுகளின் நகல்களைப் பாதுகாப்பாக வைத்திருங்கள்."],
    ["குழந்தைகளின் கல்வி","பள்ளிச் சேர்க்கைக்கு அருகிலுள்ள அரசு பள்ளி அல்லது உள்ளூர் கல்வி அலுவலகத்தை அணுகுங்கள்."],
    ["அருகிலுள்ள அத்தியாவசியங்கள்","மருந்தகம், மளிகைக் கடை, குடிநீர் இடம் மற்றும் மருத்துவமனையின் முகவரியை அறிந்து கொள்ளுங்கள்."]
  ],
  kn: [
    ["ವಸತಿ","ಮುಂಗಡ ಹಣ ಕೊಡುವ ಮೊದಲು ಕೊಠಡಿ ನೋಡಿ. ಬಾಡಿಗೆ, ಠೇವಣಿ, ನೀರು, ವಿದ್ಯುತ್, ನಿಯಮಗಳು ಮತ್ತು ಮರುಪಾವತಿ ಷರತ್ತುಗಳನ್ನು ತಿಳಿದು ರಸೀದಿ ಪಡೆಯಿರಿ."],
    ["ಆಹಾರ ಮತ್ತು ಪಡಿತರ","ಪಡಿತರಕ್ಕಾಗಿ ಹತ್ತಿರದ ನ್ಯಾಯಬೆಲೆ ಅಂಗಡಿ ಅಥವಾ ಆಹಾರ ಪೂರೈಕೆ ಕಚೇರಿಯನ್ನು ಕೇಳಿ. ಅರ್ಹ ಕಾರ್ಡ್ ಹೊಂದಿರುವವರಿಗೆ ಒಂದು ರಾಷ್ಟ್ರ ಒಂದು ಪಡಿತರ ಕಾರ್ಡ್ ಸಹಾಯವಾಗಬಹುದು."],
    ["ಆರೋಗ್ಯ ಸೇವೆ","ಹತ್ತಿರದ ಸರ್ಕಾರಿ ಪ್ರಾಥಮಿಕ ಆರೋಗ್ಯ ಕೇಂದ್ರ ಅಥವಾ ಆಸ್ಪತ್ರೆಯನ್ನು ಗುರುತಿಸಿ."],
    ["ಸಾರಿಗೆ","ಬಸ್ ಮತ್ತು ಮೆಟ್ರೋ ಮಾರ್ಗ, ದರ ಮತ್ತು ಸಮಯಕ್ಕಾಗಿ ಅಧಿಕೃತ TSRTC ಹಾಗೂ ಮೆಟ್ರೋ ಮಾಹಿತಿಯನ್ನು ನೋಡಿ."],
    ["ದಾಖಲೆಗಳು ಮತ್ತು ಕೆಲಸದ ದಾಖಲೆ","ಗುರುತಿನ ದಾಖಲೆಗಳು, ಬ್ಯಾಂಕ್ ವಿವರಗಳು, ಕೆಲಸದ ಒಪ್ಪಂದಗಳು ಮತ್ತು ವೇತನದ ದಾಖಲೆಗಳ ಪ್ರತಿಗಳನ್ನು ಸುರಕ್ಷಿತವಾಗಿ ಇಡಿ."],
    ["ಮಕ್ಕಳ ಶಿಕ್ಷಣ","ಶಾಲಾ ಪ್ರವೇಶಕ್ಕಾಗಿ ಹತ್ತಿರದ ಸರ್ಕಾರಿ ಶಾಲೆ ಅಥವಾ ಸ್ಥಳೀಯ ಶಿಕ್ಷಣ ಕಚೇರಿಯನ್ನು ಸಂಪರ್ಕಿಸಿ."],
    ["ಸ್ಥಳೀಯ ಅಗತ್ಯಗಳು","ಹತ್ತಿರದ ಔಷಧ ಅಂಗಡಿ, ದಿನಸಿ ಅಂಗಡಿ, ಕುಡಿಯುವ ನೀರಿನ ಸ್ಥಳ ಮತ್ತು ಆಸ್ಪತ್ರೆಯ ವಿಳಾಸ ತಿಳಿದುಕೊಳ್ಳಿ."]
  ],
  bn: [
    ["থাকার জায়গা","জমা দেওয়ার আগে ঘর দেখে নিন। ভাড়া, জামানত, জল, বিদ্যুৎ, নিয়ম ও ফেরতের শর্ত জেনে রসিদ রাখুন।"],
    ["খাবার ও রেশন","রেশন সুবিধার জন্য নিকটস্থ ন্যায্য মূল্যের দোকান বা খাদ্য সরবরাহ দপ্তরে জিজ্ঞাসা করুন। যোগ্য কার্ডধারীদের জন্য ওয়ান নেশন ওয়ান রেশন কার্ড সহায়ক হতে পারে।"],
    ["স্বাস্থ্যসেবা","নিকটস্থ সরকারি প্রাথমিক স্বাস্থ্যকেন্দ্র বা হাসপাতালের ঠিকানা জেনে রাখুন।"],
    ["যাতায়াত","বাস ও মেট্রোর রুট, ভাড়া ও সময়ের জন্য সরকারি TSRTC এবং হায়দরাবাদ মেট্রোর তথ্য দেখুন।"],
    ["নথি ও কাজের রেকর্ড","পরিচয়পত্র, ব্যাংকের তথ্য, কাজের চুক্তি ও মজুরির রেকর্ডের কপি নিরাপদে রাখুন।"],
    ["শিশুদের শিক্ষা","স্কুলে ভর্তির জন্য নিকটস্থ সরকারি স্কুল বা স্থানীয় শিক্ষা দপ্তরে যোগাযোগ করুন।"],
    ["স্থানীয় প্রয়োজনীয় জিনিস","নিকটস্থ ওষুধের দোকান, মুদি দোকান, পানীয় জলের স্থান ও হাসপাতালের ঠিকানা জেনে রাখুন।"]
  ]
};


const RESOURCES = {
  rights: [
    [
      { label: "Telangana Labour Department", url: "https://labour.telangana.gov.in/" }
    ],
    [
      { label: "Telangana Labour Department", url: "https://labour.telangana.gov.in/" }
    ],
    [
      { label: "Telangana Labour Department", url: "https://labour.telangana.gov.in/" }
    ],
    [
      { label: "Emergency ambulance: 108", url: "tel:108" },
      { label: "Telangana Labour Department", url: "https://labour.telangana.gov.in/" }
    ],
    [
      { label: "Emergency response: 112", url: "tel:112" },
      { label: "Telangana Police", url: "https://dial112.telangana.gov.in/" }
    ],
    [
      { label: "SHE Teams", url: "https://womensafetywing.telangana.gov.in/she-teams-for-women-safety/" },
      { label: "Women Helpline: 181", url: "tel:181" }
    ]
  ],

  help: [
    [
      { label: "Telangana Emergency Services", url: "https://dial112.telangana.gov.in/" },
      { label: "Emergency contacts", url: "https://www.telangana.gov.in/Contacts/emergency-contacts/" }
    ],
    [
      { label: "Telangana Labour Department", url: "https://labour.telangana.gov.in/" },
      { label: "Telangana MeeSeva", url: "https://www.meeseva.telangana.gov.in/meeseva/home.htm" }
    ],
    [
      { label: "Telangana State Legal Services Authority", url: "https://telangana.nalsa.gov.in/contact-us/" },
      { label: "NALSA free legal aid", url: "https://nalsa.gov.in/legal-aid/" },
      { label: "NALSA helpline: 15100", url: "tel:15100" }
    ],
    [
      { label: "Government emergency ambulance: 108", url: "tel:108" },
      { label: "Telangana emergency contacts", url: "https://www.telangana.gov.in/Contacts/emergency-contacts/" }
    ],
    [
      { label: "e-Shram registration", url: "https://register.eshram.gov.in/#/user/self" },
      { label: "e-Shram grievance portal", url: "https://gms.eshram.gov.in/" },
      { label: "e-Shram helpdesk: 14434", url: "tel:14434" }
    ],
    [
      { label: "Telangana SHE Teams", url: "https://womensafetywing.telangana.gov.in/she-teams-for-women-safety/" },
      { label: "Women Helpline: 181", url: "tel:181" }
    ]
  ],

  migrants: [
    [
      { label: "Telangana MeeSeva", url: "https://www.meeseva.telangana.gov.in/meeseva/home.htm" }
    ],
    [
      { label: "One Nation One Ration Card information", url: "https://dfpd.gov.in/faqs/en" },
      { label: "National Food Security Portal", url: "https://nfsa.gov.in/portal/portal" }
    ],
    [
      { label: "Telangana emergency and hospital contacts", url: "https://www.telangana.gov.in/Contacts/emergency-contacts/" }
    ],
    [
      { label: "TGSRTC bus services", url: "https://www.tgsrtc.telangana.gov.in/" },
      { label: "Hyderabad Metro fares and tickets", url: "https://ltmetro.com/fare-ticketing/" }
    ],
    [
      { label: "e-Shram registration", url: "https://register.eshram.gov.in/#/user/self" },
      { label: "Telangana MeeSeva", url: "https://www.meeseva.telangana.gov.in/meeseva/home.htm" }
    ],
    [
      { label: "Telangana School Education information", url: "https://childinfo.tg.nic.in/" }
    ],
    [
      { label: "Telangana government services", url: "https://www.telangana.gov.in/Services/" },
      { label: "Emergency contacts", url: "https://www.telangana.gov.in/Contacts/emergency-contacts/" }
    ]
  ]
};


export default function InformationHub({ section, onBack, onChangeLanguage, onTrackRequests }) {
  const { language } = useLanguage();
  const { speak, stopSpeech, speaking, loading, error } = useSpeech(language);
  const [query, setQuery] = useState("");
  const lang = COPY[language] ? language : "en";
  const copy = COPY[lang];
  const isRights = section === "rights";
  const isHelp = section === "help";
  const title = isRights ? copy.rightsTitle : isHelp ? copy.helpTitle : copy.migrantsTitle;
  const intro = isRights ? copy.rightsIntro : isHelp ? copy.helpIntro : copy.migrantsIntro;
  const rows = isRights ? copy.sections : isHelp ? HELP[lang] : MIGRANTS[lang];
  const resources = RESOURCES[section] || [];
  const filtered = useMemo(() => rows.filter(([name, body]) => `${name} ${body}`.toLowerCase().includes(query.toLowerCase())), [rows, query]);

  const read = (text) => {
    if (speaking) stopSpeech();
    else speak(text);
  };

  return (
    <div className="info-page">
      <header className="info-header">
        <button className="info-back" onClick={onBack}><ArrowLeft size={19}/>{copy.back}</button>
        <div className="info-brand"><span className="info-mark">S</span><strong>ShramSetu</strong></div>
        <button className="info-language" onClick={onChangeLanguage}><Languages size={17}/>{language.toUpperCase()}</button>
      </header>
      <main className="info-main">
       <div className="info-emergency">
  <strong>112</strong>
  <span>
    {{
      en: "Immediate danger? Call emergency services.",
      hi: "तत्काल खतरा होने पर आपातकालीन सहायता लें।",
      te: "తక్షణ ప్రమాదం ఉంటే అత్యవసర సహాయం పొందండి।",
      ta: "உடனடி ஆபத்து ஏற்பட்டால் அவசர உதவியை நாடுங்கள்।",
      kn: "ತಕ್ಷಣದ ಅಪಾಯವಿದ್ದರೆ ತುರ್ತು ಸಹಾಯ ಪಡೆಯಿರಿ।",
      bn: "তাৎক্ষণিক বিপদে পড়লে জরুরি সহায়তা নিন।"
    }[lang]}
  </span>
  <a href="tel:112">Call 112</a>
</div>
        <div className="info-hero">
          <span className="info-kicker">{isRights ? "WORKER KNOWLEDGE" : isHelp ? "SUPPORT DIRECTORY" : "SETTLING IN THE CITY"}</span>
          <h1>{title}</h1><p>{intro}</p>
        </div>
        {isHelp && (
  <button className="info-track-button" onClick={onTrackRequests}>
    {copy.track} →
  </button>
)}
        <label className="info-search"><Search size={19}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder={copy.search}/></label>
        <div className="info-grid">
          {filtered.map(([heading, body], index) => (
            <article className="info-card" key={heading}>
              <div className="info-card-top"><span>{String(index+1).padStart(2,"0")}</span><span className="info-card-dot"/></div>
              <h2>{heading}</h2>
<p>{body}</p>

{resources[index]?.length > 0 && (
  <div className="info-resources">
    <strong>{copy.resourcesLabel}</strong>
    <div className="info-resource-links">
      {resources[index].map((resource) => (
        <a
          key={resource.url}
          href={resource.url}
          target={resource.url.startsWith("tel:") ? undefined : "_blank"}
          rel={resource.url.startsWith("tel:") ? undefined : "noopener noreferrer"}
        >
          {resource.label} ↗
        </a>
      ))}
    </div>
  </div>
)}

<button className="info-audio" onClick={()=>read(`${heading}. ${body}`)} disabled={loading}>
  {speaking ? <Square size={17}/> : <Volume2 size={18}/>}
  {speaking ? copy.stop : copy.listen}
  {loading ? "…" : ""}
</button>
            </article>
          ))}
          {filtered.length === 0 && <p className="info-empty">No matching topics found.</p>}
        </div>
        <div className="info-note"><Info size={18}/><span>{isRights ? copy.note : isHelp ? "This is a service-category guide, not a confirmed referral list. We will add named organisations and contact details only after verification." : "Service details, eligibility, routes and timings can change. Check current official information before travelling."}</span></div>
        {error && <p className="info-error">Audio could not be played. Please try again.</p>}
      </main>
      <footer className="info-footer">SHRAMSETU · EVERY WORKER. EVERY VOICE. EVERY RIGHT.</footer>
    </div>
  );
}
