import { LanguageCode } from '../types/index.js';

export interface Translations {
  appName: string;
  tagline: string;
  nav: {
    dashboard: string;
    weather: string;
    satellite: string;
    cropDoctor: string;
    calendar: string;
    aiAssistant: string;
    soilHealth: string;
    regenerativeScore: string;
    federatedRegistry: string;
    marketPrices: string;
    researchHub: string;
    pmKisan: string;
    notifications: string;
    settings: string;
    architecture: string;
  };
  roles: {
    farmer: string;
    researcher: string;
    student: string;
  };
  dashboard: {
    welcome: string;
    farmLocation: string;
    farmArea: string;
    currentCrop: string;
    growthStage: string;
    quickActions: string;
    thunderstormWarning: string;
    soilMoisture: string;
    satelliteHealth: string;
    regenerativeRating: string;
    upcomingActivities: string;
    marketOverview: string;
    askAi: string;
    diagnoseCrop: string;
    viewForecast: string;
    triggerAlert: string;
  };
  weather: {
    title: string;
    subtitle: string;
    temperature: string;
    humidity: string;
    rainfall: string;
    windSpeed: string;
    rainProb: string;
    thunderstormProb: string;
    thunderstormAlerts: string;
    emergencyChecklist: string;
    smsNotificationStatus: string;
    simulateStorm: string;
  };
  cropDoctor: {
    title: string;
    subtitle: string;
    uploadPhoto: string;
    describeSymptoms: string;
    voiceInput: string;
    listening: string;
    runScreening: string;
    possibleIssue: string;
    confidence: string;
    observedSymptoms: string;
    recommendedActions: string;
    prevention: string;
    disclaimer: string;
  };
  ai: {
    title: string;
    subtitle: string;
    placeholder: string;
    send: string;
    listening: string;
    voiceSearch: string;
    suggestedPrompts: string[];
  };
  sms: {
    demoLabel: string;
    disclaimer: string;
  };
}

export const translations: Record<LanguageCode, Translations> = {
  en: {
    appName: 'AgriN',
    tagline: 'Intelligence for every farm. Cooperation for a resilient food future.',
    nav: {
      dashboard: 'Dashboard',
      weather: 'Weather & Alerts',
      satellite: 'Satellite Monitoring',
      cropDoctor: 'Crop Doctor',
      calendar: 'Farmer Calendar',
      aiAssistant: 'AgriN AI Assistant',
      soilHealth: 'Soil Health',
      regenerativeScore: 'Regenerative Score',
      federatedRegistry: 'Federated Registry',
      marketPrices: 'Market Prices',
      researchHub: 'Research Hub',
      pmKisan: 'PM-KISAN & Schemes',
      notifications: 'Notification Center',
      settings: 'Settings',
      architecture: 'BRICS Architecture'
    },
    roles: {
      farmer: 'Farmer',
      researcher: 'Agricultural Researcher',
      student: 'B.Sc Agriculture Student'
    },
    dashboard: {
      welcome: 'Welcome back',
      farmLocation: 'Farm Location',
      farmArea: 'Area',
      currentCrop: 'Active Crop',
      growthStage: 'Crop Stage',
      quickActions: 'Quick Farm Actions',
      thunderstormWarning: 'Severe Thunderstorm Warning',
      soilMoisture: 'Soil Moisture',
      satelliteHealth: 'Satellite Crop Health (NDVI)',
      regenerativeRating: 'Regenerative Farm Score',
      upcomingActivities: 'Upcoming Farm Activities',
      marketOverview: 'Mandi Price Telemetry',
      askAi: 'Ask AgriN AI',
      diagnoseCrop: 'Scan Crop Disease',
      viewForecast: 'Weather Radar',
      triggerAlert: 'Simulate Thunderstorm Alert'
    },
    weather: {
      title: 'Agro-Meteorological Radar & Alerts',
      subtitle: 'Real-time hyper-local climate intelligence and early storm warning',
      temperature: 'Temperature',
      humidity: 'Relative Humidity',
      rainfall: 'Precipitation (24h)',
      windSpeed: 'Wind Velocity',
      rainProb: 'Rain Probability',
      thunderstormProb: 'Thunderstorm Risk',
      thunderstormAlerts: 'Active Thunderstorm Advisory',
      emergencyChecklist: 'Pre-Storm Safety Protocol',
      smsNotificationStatus: 'Automated SMS Alert Delivery',
      simulateStorm: 'Trigger Test Thunderstorm Alert'
    },
    cropDoctor: {
      title: 'AgriN AI Crop Doctor',
      subtitle: 'AI-assisted multi-spectral crop disease screening and regenerative therapy',
      uploadPhoto: 'Upload or Capture Leaf Photo',
      describeSymptoms: 'Describe Symptoms (or use Voice Input)',
      voiceInput: 'Voice Input',
      listening: 'Listening...',
      runScreening: 'Analyze & Screen Disease',
      possibleIssue: 'Possible Issue Identified',
      confidence: 'Screening Confidence',
      observedSymptoms: 'Observed Diagnostic Indicators',
      recommendedActions: 'Recommended Non-Chemical Actions',
      prevention: 'Long-term Prevention & Soil Care',
      disclaimer: 'Notice: AI screening tool for early field triage. Requires confirmation by a certified agronomist.'
    },
    ai: {
      title: 'AgriN AI Agriculture Assistant',
      subtitle: 'Context-aware agronomist powered by localized soil, weather & satellite telemetry',
      placeholder: 'Ask about irrigation, soil fertility, pests, weather or schemes...',
      send: 'Ask AgriN',
      listening: 'Listening to your voice...',
      voiceSearch: 'Speak in your language',
      suggestedPrompts: [
        'Should I irrigate my paddy field today?',
        'Is it safe to spray bio-pesticides with current weather?',
        'How can I increase my Soil Organic Carbon (SOC)?',
        'What are the mandatory requirements for PM-KISAN 17th installment?'
      ]
    },
    sms: {
      demoLabel: 'DEMO SMS SENT',
      disclaimer: 'SMS logged in prototype demo mode. In production, real-time alerts are delivered via Twilio gateway.'
    }
  },

  te: {
    appName: 'AgriN',
    tagline: 'ప్రతి పొలానికి సాంకేతిక పరిజ్ఞానం. స్థిరమైన ఆహార భవిష్యత్తు కోసం సహకారం.',
    nav: {
      dashboard: 'డాష్‌బోర్డ్',
      weather: 'వాతావరణం & హెచ్చరికలు',
      satellite: 'ఉపగ్రహ పర్యవేక్షణ',
      cropDoctor: 'క్రాప్ డాక్టర్',
      calendar: 'రైతు క్యాలెండర్',
      aiAssistant: 'AgriN AI సహాయకుడు',
      soilHealth: 'నేల ఆరోగ్యం',
      regenerativeScore: 'పునరుత్పత్తి స్కోరు',
      federatedRegistry: 'ఫెడరేటెడ్ రిజిస్ట్రీ',
      marketPrices: 'మార్కెట్ ధరలు',
      researchHub: 'పరిశోధనా కేంద్రం',
      pmKisan: 'పీఎం-కిసాన్ & పథకాలు',
      notifications: 'నోటిఫికేషన్లు',
      settings: 'సెట్టింగ్‌లు',
      architecture: 'BRICS ఆర్కిటెక్చర్'
    },
    roles: {
      farmer: 'రైతు',
      researcher: 'వ్యవసాయ పరిశోధకుడు',
      student: 'బి.ఎస్సీ అగ్రికల్చర్ విద్యార్థి'
    },
    dashboard: {
      welcome: 'స్వాగతం',
      farmLocation: 'పొలం ప్రాంతం',
      farmArea: 'విస్తీర్ణం',
      currentCrop: 'ప్రస్తుత పంట',
      growthStage: 'పంట దశ',
      quickActions: 'శీఘ్ర చర్యలు',
      thunderstormWarning: 'తీవ్ర తుఫాను హెచ్చరిక',
      soilMoisture: 'నేల తేమ',
      satelliteHealth: 'ఉపగ్రహ పంట ఆరోగ్యం (NDVI)',
      regenerativeRating: 'పునరుత్పత్తి వ్యవసాయ స్కోరు',
      upcomingActivities: 'రాబోయే పనులు',
      marketOverview: 'మార్కెట్ ధరల స్థితి',
      askAi: 'AI ని అడగండి',
      diagnoseCrop: 'తెగులు స్కానింగ్',
      viewForecast: 'వాతావరణ రాడార్',
      triggerAlert: 'తుఫాను అలర్ట్ పరీక్షించు'
    },
    weather: {
      title: 'వాతావరణ రాడార్ & హెచ్చరికలు',
      subtitle: 'నిజ-సమయ క్షేత్ర వాతావరణ సమాచారం మరియు ముందస్తు హెచ్చరికలు',
      temperature: 'ఉష్ణోగ్రత',
      humidity: 'తేమ శాతం',
      rainfall: 'వర్షపాతం (24 గంటలు)',
      windSpeed: 'గాలి వేగం',
      rainProb: 'వర్షం సంభావ్యత',
      thunderstormProb: 'తుఫాను ముప్పు',
      thunderstormAlerts: 'క్రియాశీల తుఫాను హెచ్చరిక',
      emergencyChecklist: 'తుఫాను భద్రతా మార్గదర్శకాలు',
      smsNotificationStatus: 'SMS అలర్ట్ స్థితి',
      simulateStorm: 'పరీక్ష తుఫాను హెచ్చరికను ప్రారంభించు'
    },
    cropDoctor: {
      title: 'AgriN AI క్రాప్ డాక్టర్',
      subtitle: 'AI ఆధారిత పంట తెగుళ్ల నిర్ధారణ మరియు సహజ నివారణోపాయాలు',
      uploadPhoto: 'ఆకు ఫోటో అప్‌లోడ్ చేయండి',
      describeSymptoms: 'లక్షణాలు వివరించండి (లేదా వాయిస్ ఉపయోగించండి)',
      voiceInput: 'వాయిస్ ఇన్‌పుట్',
      listening: 'వింటున్నాము...',
      runScreening: 'తెగులు విశ్లేషించండి',
      possibleIssue: 'గుర్తించబడిన సంభావ్య సమస్య',
      confidence: 'నిర్ధారణ ఖచ్చితత్వం',
      observedSymptoms: 'గమనించిన లక్షణాలు',
      recommendedActions: 'సిఫార్సు చేయబడిన చర్యలు',
      prevention: 'దీర్ఘకాలిక నివారణ చర్యలు',
      disclaimer: 'గమనిక: ఇది AI స్క్రీనింగ్ సాధనం. వ్యవసాయ నిపుణుల సలహా తప్పనిసరి.'
    },
    ai: {
      title: 'AgriN AI వ్యవసాయ సలహాదారు',
      subtitle: 'మీ పొలం మట్టి, వాతావరణం ఆధారంగా సమాధానాలు ఇచ్చే AI',
      placeholder: 'నీటి పారుదల, ఎరువులు, తెగుళ్లు లేదా పథకాల గురించి అడగండి...',
      send: 'సమాధానం పొందండి',
      listening: 'మీ మాటలను వింటున్నాము...',
      voiceSearch: 'తెలుగులో మాట్లాడండి',
      suggestedPrompts: [
        'నేడు నా వరి పొలానికి నీరు పెట్టవచ్చా?',
        'ఈ వాతావరణంలో పురుగుమందులు పిచికారీ చేయడం సురక్షితమేనా?',
        'సేంద్రీయ కార్బన్ శాతం ఎలా పెంచాలి?',
        'పీఎం-కిసాన్ 17వ విడత కోసం ముఖ్యమైన నిబంధనలు ఏమిటి?'
      ]
    },
    sms: {
      demoLabel: 'DEMO SMS పంపబడింది',
      disclaimer: 'డెమో మోడ్‌లో SMS లాగ్ చేయబడింది. రియల్ మోడ్‌లో Twilio గేట్‌వే ద్వారా పంపబడుతుంది.'
    }
  },

  hi: {
    appName: 'AgriN',
    tagline: 'हर खेत के लिए बुद्धिमत्ता। संवहनीय खाद्य सुरक्षा के लिए सहयोग।',
    nav: {
      dashboard: 'डैशबोर्ड',
      weather: 'मौसम और चेतावनी',
      satellite: 'उपग्रह निगरानी',
      cropDoctor: 'फसल चिकित्सक',
      calendar: 'किसान कैलेंडर',
      aiAssistant: 'AgriN AI सहायक',
      soilHealth: 'मृदा स्वास्थ्य',
      regenerativeScore: 'पुनर्योजी स्कोर',
      federatedRegistry: 'फेडरेटेड रजिस्ट्री',
      marketPrices: 'मंडी भाव',
      researchHub: 'अनुसंधान केंद्र',
      pmKisan: 'पीएम-किसान व योजनाएं',
      notifications: 'अधिसूचना केंद्र',
      settings: 'सेटिंग्स',
      architecture: 'ब्रिक्स वास्तुकला'
    },
    roles: {
      farmer: 'किसान',
      researcher: 'कृषि अनुसंधानकर्ता',
      student: 'बी.एससी कृषि छात्र'
    },
    dashboard: {
      welcome: 'स्वागत है',
      farmLocation: 'खेत का स्थान',
      farmArea: 'क्षेत्रफल',
      currentCrop: 'वर्तमान फसल',
      growthStage: 'फसल अवस्था',
      quickActions: 'त्वरित कार्य',
      thunderstormWarning: 'भीषण आंधी-तूफान चेतावनी',
      soilMoisture: 'मृदा नमी',
      satelliteHealth: 'उपग्रह फसल स्वास्थ्य (NDVI)',
      regenerativeRating: 'पुनर्योजी कृषि स्कोर',
      upcomingActivities: 'आगामी कृषि कार्य',
      marketOverview: 'ताज़ा मंडी भाव',
      askAi: 'AI से पूछें',
      diagnoseCrop: 'रोग जांचें',
      viewForecast: 'मौसम रडार',
      triggerAlert: 'तूफान अलर्ट टेस्ट करें'
    },
    weather: {
      title: 'कृषि-मौसम रडार व अलर्ट',
      subtitle: 'स्थानीय मौसम की सटीक जानकारी और तूफान की पूर्व चेतावनी',
      temperature: 'तापमान',
      humidity: 'सापेक्ष आर्द्रता',
      rainfall: 'वर्षा (24 घंटे)',
      windSpeed: 'हवा की गति',
      rainProb: 'वर्षा संभावना',
      thunderstormProb: 'तूफान जोखिम',
      thunderstormAlerts: 'सक्रिय आंधी-तूफान चेतावनी',
      emergencyChecklist: 'तूफान पूर्व सुरक्षा नियम',
      smsNotificationStatus: 'स्वचालित SMS अलर्ट स्थिति',
      simulateStorm: 'टेस्ट तूफान अलर्ट शुरू करें'
    },
    cropDoctor: {
      title: 'AgriN AI फसल डॉक्टर',
      subtitle: 'AI आधारित रोग पहचान और जैविक उपचार सलाह',
      uploadPhoto: 'पत्ती की तस्वीर अपलोड करें',
      describeSymptoms: 'लक्षण लिखें या बोलकर बताएं',
      voiceInput: 'आवाज इनपुट',
      listening: 'सुन रहे हैं...',
      runScreening: 'रोग की जांच करें',
      possibleIssue: 'संभावित समस्या',
      confidence: 'सटीकता स्तर',
      observedSymptoms: 'देखे गए लक्षण',
      recommendedActions: 'सुझाए गए गैर-रासायनिक उपाय',
      prevention: 'दीर्घकालिक रोकथाम',
      disclaimer: 'सूचना: यह प्रारंभिक AI स्क्रीनिंग है। कृषि विशेषज्ञ से पुष्टि अवश्य कराएं।'
    },
    ai: {
      title: 'AgriN AI कृषि सहायक',
      subtitle: 'आपके खेत की मिट्टी, मौसम और उपग्रह डेटा के अनुसार व्यक्तिगत सलाह',
      placeholder: 'सिंचाई, कीट, उर्वरक या सरकारी योजनाओं के बारे में पूछें...',
      send: 'पूछें',
      listening: 'आपकी आवाज सुनी जा रही है...',
      voiceSearch: 'हिंदी में बोलें',
      suggestedPrompts: [
        'क्या आज धान में सिंचाई करनी चाहिए?',
        'क्या आज कीटनाशक का छिड़काव सुरक्षित है?',
        'मिट्टी में जैविक कार्बन (SOC) कैसे बढ़ाएं?',
        'पीएम-किसान 17वीं किस्त की शर्तें क्या हैं?'
      ]
    },
    sms: {
      demoLabel: 'DEMO SMS भेजा गया',
      disclaimer: 'डेमो मोड में SMS सुरक्षित रूप से लॉग किया गया है।'
    }
  },

  ta: {
    appName: 'AgriN',
    tagline: 'ஒவ்வொரு பண்ணைக்கும் நுண்ணறிவு. உணவுப் பாதுகாப்பிற்கான ஒத்துழைப்பு.',
    nav: {
      dashboard: 'டாஷ்போர்டு',
      weather: 'வானிலை & எச்சரிக்கைகள்',
      satellite: 'செயற்கைக்கோள் கண்காணிப்பு',
      cropDoctor: 'பயிர் மருத்துவர்',
      calendar: 'விவசாயி நாட்காட்டி',
      aiAssistant: 'AgriN AI உதவியாளர்',
      soilHealth: 'மண் வளம்',
      regenerativeScore: 'மறுஉற்பத்தி மதிப்பீடு',
      federatedRegistry: 'கூட்டமைப்பு பதிவகம்',
      marketPrices: 'சந்தை விலைகள்',
      researchHub: 'ஆராய்ச்சி மையம்',
      pmKisan: 'பிஎம்-கிசான் திட்டங்கள்',
      notifications: 'அறிவிப்புகள்',
      settings: 'அமைப்புகள்',
      architecture: 'BRICS கட்டமைப்பு'
    },
    roles: {
      farmer: 'விவசாயி',
      researcher: 'வேளாண் ஆராய்ச்சியாளர்',
      student: 'இளங்கலை வேளாண் மாணவர்'
    },
    dashboard: {
      welcome: 'நல்வரவு',
      farmLocation: 'பண்ணை இடம்',
      farmArea: 'பரப்பளவு',
      currentCrop: 'நடப்பு பயிர்',
      growthStage: 'பயிர் வளர்ச்சி நிலை',
      quickActions: 'விரைவு நடவடிக்கைகள்',
      thunderstormWarning: 'கடும் இடிமின்னல் எச்சரிக்கை',
      soilMoisture: 'மண் ஈரப்பதம்',
      satelliteHealth: 'செயற்கைக்கோள் பயிர் நலம் (NDVI)',
      regenerativeRating: 'மறுஉற்பத்தி பண்ணை மதிப்பீடு',
      upcomingActivities: 'அடுத்தகட்ட பணிகள்',
      marketOverview: 'சந்தை விலை விவரம்',
      askAi: 'AI இடம் கேளுங்கள்',
      diagnoseCrop: 'நோய் கண்டறிதல்',
      viewForecast: 'வானிலை ரேடார்',
      triggerAlert: 'புயல் எச்சரிக்கை சோதனை'
    },
    weather: {
      title: 'வேளாண் வானிலை ரேடார்',
      subtitle: 'நிகழ்நேர பண்ணை வானிலை மற்றும் புயல் எச்சரிக்கை',
      temperature: 'வெப்பநிலை',
      humidity: 'ஈரப்பதம்',
      rainfall: 'மழைப்பொழிவு (24 மணிநேரம்)',
      windSpeed: 'காற்றின் வேகம்',
      rainProb: 'மழை வாய்ப்பு',
      thunderstormProb: 'இடிமின்னல் அபாயம்',
      thunderstormAlerts: 'தீவிர இடிமின்னல் எச்சரிக்கை',
      emergencyChecklist: 'பாதுகாப்பு நெறிமுறைகள்',
      smsNotificationStatus: 'தானியங்கி SMS நிலை',
      simulateStorm: 'சோதனை எச்சரிக்கையை இயக்கு'
    },
    cropDoctor: {
      title: 'AgriN AI பயிர் மருத்துவர்',
      subtitle: 'செயற்கை நுண்ணறிவு அடிப்படையிலான பயிர் நோய் கண்டறிதல்',
      uploadPhoto: 'இலை புகைப்படத்தை பதிவேற்றவும்',
      describeSymptoms: 'அறிகுறிகளை விவரிக்கவும்',
      voiceInput: 'குரல் உள்ளீடு',
      listening: 'கேட்கிறது...',
      runScreening: 'நோயை ஆய்வு செய்',
      possibleIssue: 'சாத்தியமான நோய்',
      confidence: 'துல்லியம்',
      observedSymptoms: 'கண்டறியப்பட்ட அறிகுறிகள்',
      recommendedActions: 'பரிந்துரைக்கப்படும் இயற்கை தீர்வுகள்',
      prevention: 'நீண்டகால தடுப்பு முறைகள்',
      disclaimer: 'குறிப்பு: இது AI ஆரம்ப கட்ட ஆய்வு. வேளாண் வல்லுநரிடம் உறுதிப்படுத்தவும்.'
    },
    ai: {
      title: 'AgriN AI வேளாண் ஆலோசகர்',
      subtitle: 'மண், வானிலை மற்றும் செயற்கைக்கோள் தரவு சார்ந்த வழிகாட்டி',
      placeholder: 'பாசனம், உரங்கள், பூச்சிகள் பற்றி கேளுங்கள்...',
      send: 'கேள்வி கேள்',
      listening: 'குரல் பதிவு நடக்கிறது...',
      voiceSearch: 'தமிழில் பேசுங்கள்',
      suggestedPrompts: [
        'இன்று என் வயலுக்கு பாசனம் செய்யலாமா?',
        'மழை வரும்போது பூச்சிக்கொல்லி தெளிப்பது நல்லதா?',
        'மண்ணில் அங்கக கரிமம் (SOC) எவ்வாறு கூட்டுவது?',
        'பிஎம்-கிசான் தவணை பெறுவதற்கான தகுதிகள் என்ன?'
      ]
    },
    sms: {
      demoLabel: 'DEMO SMS அனுப்பப்பட்டது',
      disclaimer: 'டெமோ முறையில் பதிவு செய்யப்பட்டுள்ளது.'
    }
  },

  kn: {
    appName: 'AgriN',
    tagline: 'ಪ್ರತಿ ಜಮೀನಿಗೂ ಬುದ್ಧಿವಂತಿಕೆ. ಸುಸ್ಥಿರ ಆಹಾರ ಭವಿಷ್ಯಕ್ಕಾಗಿ ಸಹಕಾರ.',
    nav: {
      dashboard: 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
      weather: 'ಹವಾಮಾನ ಮತ್ತು ಎಚ್ಚರಿಕೆಗಳು',
      satellite: 'ಉಪಗ್ರಹ ಮೇಲ್ವಿಚಾರಣೆ',
      cropDoctor: 'ಬೆಳೆ ವೈದ್ಯ',
      calendar: 'ರೈತ ಕ್ಯಾಲೆಂಡರ್',
      aiAssistant: 'AgriN AI ಸಹಾಯಕ',
      soilHealth: 'ಮಣ್ಣಿನ ಆರೋಗ್ಯ',
      regenerativeScore: 'ಪುನರುತ್ಪಾದಕ ಸ್ಕೋರ್',
      federatedRegistry: 'ಫೆಡರೇಟೆಡ್ ರಿಜಿಸ್ಟ್ರಿ',
      marketPrices: 'ಮಾರುಕಟ್ಟೆ ದರಗಳು',
      researchHub: 'ಸಂಶೋಧನಾ ಕೇಂದ್ರ',
      pmKisan: 'ಪಿಎಂ-ಕಿಸಾನ್ ಯೋಜನೆಗಳು',
      notifications: 'ಸೂಚನೆಗಳು',
      settings: 'ಸೆಟ್ಟಿಂಗ್ಸ್',
      architecture: 'BRICS ಆರ್ಕಿಟೆಕ್ಚರ್'
    },
    roles: {
      farmer: 'ರೈತ',
      researcher: 'ಕೃಷಿ ಸಂಶೋಧಕ',
      student: 'ಬಿ.ಎಸ್ಸಿ ಕೃಷಿ ವಿದ್ಯಾರ್ಥಿ'
    },
    dashboard: {
      welcome: 'ಸುಸ್ವಾಗತ',
      farmLocation: 'ಜಮೀನಿನ ಸ್ಥಳ',
      farmArea: 'ವಿಸ್ತೀರ್ಣ',
      currentCrop: 'ಪ್ರಸ್ತುತ ಬೆಳೆ',
      growthStage: 'ಬೆಳೆಯ ಹಂತ',
      quickActions: 'ತ್ವರಿತ ಕ್ರಿಯೆಗಳು',
      thunderstormWarning: 'ತೀವ್ರ ಗುಡುಗು ಮಿಂಚು ಎಚ್ಚರಿಕೆ',
      soilMoisture: 'ಮಣ್ಣಿನ ತೇವಾಂಶ',
      satelliteHealth: 'ಉಪಗ್ರಹ ಬೆಳೆ ಆರೋಗ್ಯ (NDVI)',
      regenerativeRating: 'ಪುನರುತ್ಪಾದಕ ಕೃಷಿ ಸ್ಕೋರ್',
      upcomingActivities: 'ಮುಂಬರುವ ಕೃಷಿ ಕೆಲಸಗಳು',
      marketOverview: 'ಮಾರುಕಟ್ಟೆ ಬೆಲೆಗಳು',
      askAi: 'AI ಗೆ ಕೇಳಿ',
      diagnoseCrop: 'ರೋಗ ಪರೀಕ್ಷೆ',
      viewForecast: 'ಹವಾಮಾನ ರೇಡಾರ್',
      triggerAlert: 'ಗುಡುಗು ಎಚ್ಚರಿಕೆ ಪರೀಕ್ಷಿಸಿ'
    },
    weather: {
      title: 'ಕೃಷಿ ಹವಾಮಾನ ರೇಡಾರ್',
      subtitle: 'ನಿಖರ ನೈಜ ಸಮಯದ ಹವಾಮಾನ ಮಾಹಿತಿ ಮತ್ತು ಮುನ್ನೆಚ್ಚರಿಕೆಗಳು',
      temperature: 'ತಾಪಮಾನ',
      humidity: 'ಆರ್ದ್ರತೆ',
      rainfall: 'ಮಳೆ ಪ್ರಮಾಣ',
      windSpeed: 'ಗಾಳಿಯ ವೇಗ',
      rainProb: 'ಮಳೆಯ ಸಂಭವನೀಯತೆ',
      thunderstormProb: 'ಗುಡುಗು ಮಿಂಚು ಅಪಾಯ',
      thunderstormAlerts: 'ಸಕ್ರಿಯ ಗುಡುಗು ಎಚ್ಚರಿಕೆ',
      emergencyChecklist: 'ತುರ್ತು ಸುರಕ್ಷತಾ ಕ್ರಮಗಳು',
      smsNotificationStatus: 'ಸ್ವಯಂಚಾಲಿತ SMS ಸ್ಥಿತಿ',
      simulateStorm: 'ಪರೀಕ್ಷಾರ್ಥ ಎಚ್ಚರಿಕೆಯನ್ನು ಆರಂಭಿಸಿ'
    },
    cropDoctor: {
      title: 'AgriN AI ಬೆಳೆ ವೈದ್ಯ',
      subtitle: 'AI ಆಧಾರಿತ ಬೆಳೆ ರೋಗ ಪತ್ತೆ ಮತ್ತು ನೈಸರ್ಗಿಕ ಚಿಕಿತ್ಸೆ',
      uploadPhoto: 'ಎಲೆಯ ಫೋಟೋ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ',
      describeSymptoms: 'ಲಕ್ಷಣಗಳನ್ನು ವಿವರಿಸಿ',
      voiceInput: 'ಧ್ವನಿ ಇನ್‌ಪುಟ್',
      listening: 'ಆಲಿಸಲಾಗುತ್ತಿದೆ...',
      runScreening: 'ರೋಗ ಪರೀಕ್ಷಿಸಿ',
      possibleIssue: 'ಗುರುತಿಸಲಾದ ಸಂಭಾವ್ಯ ಸಮಸ್ಯೆ',
      confidence: 'ನಿಖರತೆ ಮಟ್ಟ',
      observedSymptoms: 'ಕಂಡುಬಂದ ಲಕ್ಷಣಗಳು',
      recommendedActions: 'ಶಿಫಾರಸು ಮಾಡಿದ ಕ್ರಮಗಳು',
      prevention: 'ದೀರ್ಘಕಾಲೀನ ತಡೆಗಟ್ಟುವಿಕೆ',
      disclaimer: 'ಗಮನಿಸಿ: ಇದು AI ಪ್ರಾಥಮಿಕ ಪರೀಕ್ಷಾ ಸಾಧನ. ಕೃಷಿ ತಜ್ಞರ ಸಲಹೆ ಪಡೆಯಿರಿ.'
    },
    ai: {
      title: 'AgriN AI ಕೃಷಿ ಸಲಹೆಗಾರ',
      subtitle: 'ನಿಮ್ಮ ಮಣ್ಣು, ಹವಾಮಾನ ಮತ್ತು ಉಪಗ್ರಹ ದತ್ತಾಂಶ ಆಧಾರಿತ AI',
      placeholder: 'ನೀರಾವರಿ, ಗೊಬ್ಬರ, ಕೀಟಗಳು ಅಥವಾ ಯೋಜನೆಗಳ ಬಗ್ಗೆ ಕೇಳಿ...',
      send: 'ಕೇಳಿ',
      listening: 'ಧ್ವನಿ ರೆಕಾರ್ಡ್ ಆಗುತ್ತಿದೆ...',
      voiceSearch: 'ಕನ್ನಡದಲ್ಲಿ ಮಾತನಾಡಿ',
      suggestedPrompts: [
        'ಇಂದು ನನ್ನ ಭತ್ತದ ಗದ್ದೆಗೆ ನೀರು ಹಾಯಿಸಬೇಕೆ?',
        'ಪ್ರಸ್ತುತ ಹವಾಮಾನದಲ್ಲಿ ಕೀಟನಾಶಕ ಸಿಂಪಡಿಸುವುದು ಸುರಕ್ಷಿತವೇ?',
        'ಮಣ್ಣಿನಲ್ಲಿ ಸಾವಯವ ಇಂಗಾಲವನ್ನು (SOC) ಹೇಗೆ ಹೆಚ್ಚಿಸುವುದು?',
        'ಪಿಎಂ-ಕಿಸಾನ್ 17ನೇ ಕಂತಿನ ಅಗತ್ಯ ನಿಯಮಗಳೇನು?'
      ]
    },
    sms: {
      demoLabel: 'DEMO SMS ಕಳುಹಿಸಲಾಗಿದೆ',
      disclaimer: 'ಡೆಮೊ ಮೋಡ್‌ನಲ್ಲಿ SMS ದಾಖಲಿಸಲಾಗಿದೆ.'
    }
  }
};
