import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, Mic, MicOff, Volume2, HelpCircle, Phone, Globe, BookOpen, CreditCard, GraduationCap } from 'lucide-react';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [showQuickQuestions, setShowQuickQuestions] = useState(true);
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const recognitionRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const welcomeMessage = {
      id: 1,
      text: getWelcomeMessage(),
      sender: 'bot',
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);
  }, [currentLanguage]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const getWelcomeMessage = () => {
    const messages = {
      en: "Hello! I'm your DBT assistant. I can help with scholarships, DBT status, and government schemes. You can type or speak in multiple Indian languages.",
      ta: "வணக்கம்! நான் உங்கள் DBT உதவியாளர். நான் உதவித்தொகை, DBT நிலை மற்றும் அரசு திட்டங்களில் உதவ முடியும். நீங்கள் பல இந்திய மொழிகளில் தட்டச்சு செய்யலாம் அல்லது பேசலாம்.",
      hi: "नमस्ते! मैं आपका DBT सहायक हूं। मैं छात्रवृत्ति, DBT स्थिति और सरकारी योजनाओं में मदद कर सकता हूं। आप कई भारतीय भाषाओं में टाइप या बोल सकते हैं।",
      te: "నమస్కారం! నేను మీ DBT సహాయకుడను. నేను స్కాలర్షిప్లు, DBT స్థితి మరియు ప్రభుత్వ పథకాలలో సహాయం చేయగలను.",
      kn: "ನಮಸ್ಕಾರ! ನಾನು ನಿಮ್ಮ DBT ಸಹಾಯಕ. ನಾನು ವಿದ್ಯಾರ್ಥಿವೇತನ, DBT ಸ್ಥಿತಿ ಮತ್ತು ಸರ್ಕಾರಿ ಯೋಜನೆಗಳಲ್ಲಿ ಸಹಾಯ ಮಾಡಬಲ್ಲೆ.",
      ml: "നമസ്കാരം! ഞാൻ നിങ്ങളുടെ DBT സഹായകനാണ്. സ്കോളർഷിപ്പുകൾ, DBT സ്റ്റാറ്റസ്, സർക്കാർ പദ്ധതികൾ എന്നിവയിൽ എനിക്ക് സഹായിക്കാൻ കഴിയും.",
      bn: "নমস্কার! আমি আপনার DBT সহায়ক। আমি বৃত্তি, DBT স্ট্যাটাস এবং সরকারি প্রকল্পে সাহায্য করতে পারি।",
      gu: "નમસ્કાર! હું તમારો DBT સહાયક છું। હું શિષ્યવૃત્તિ, DBT સ્થિતિ અને સરકારી યોજનાઓમાં મદદ કરી શકું છું.",
      mr: "नमस्कार! मी तुमचा DBT सहाय्यक आहे। मी शिष्यवृत्ती, DBT स्थिती आणि सरकारी योजनांमध्ये मदत करू शकतो."
    };
    return messages[currentLanguage] || messages.en;
  };

  const getQuickQuestions = () => {
    const questions = {
      en: [
        { text: "What is Pre-Matric Scholarship?", icon: GraduationCap },
        { text: "Post-Matric Scholarship Info", icon: BookOpen },
        { text: "Check DBT Status", icon: HelpCircle },
        { text: "Link Aadhaar Account", icon: CreditCard },
        { text: "Merit Scholarship Details", icon: GraduationCap },
        { text: "Contact Human Support", icon: Phone }
      ],
      ta: [
        { text: "முன்-மெட்ரிக் உதவித்தொகை என்றால் என்ன?", icon: GraduationCap },
        { text: "பின்-மெட்ரிக் உதவித்தொகை தகவல்", icon: BookOpen },
        { text: "DBT நிலை சரிபார்க்கவும்", icon: HelpCircle },
        { text: "ஆதார் கணக்கை இணைக்கவும்", icon: CreditCard },
        { text: "மெரிட் உதவித்தொகை விவரங்கள்", icon: GraduationCap },
        { text: "மனித ஆதரவைத் தொடர்பு கொள்ளுங்கள்", icon: Phone }
      ],
      hi: [
        { text: "प्री-मैट्रिक छात्रवृत्ति क्या है?", icon: GraduationCap },
        { text: "पोस्ट-मैट्रिक छात्रवृत्ति जानकारी", icon: BookOpen },
        { text: "DBT स्थिति जांचें", icon: HelpCircle },
        { text: "आधार खाता लिंक करें", icon: CreditCard },
        { text: "मेरिट छात्रवृत्ति विवरण", icon: GraduationCap },
        { text: "मानव सहायता से संपर्क करें", icon: Phone }
      ],
      te: [
        { text: "ప్రీ-మెట్రిక్ స్కాలర్షిప్ అంటే ఏమిటి?", icon: GraduationCap },
        { text: "పోస్ట్-మెట్రిక్ స్కాలర్షిప్ సమాచారం", icon: BookOpen },
        { text: "DBT స్థితి తనిఖీ చేయండి", icon: HelpCircle },
        { text: "ఆధార్ ఖాతాను లింక్ చేయండి", icon: CreditCard },
        { text: "మెరిట్ స్కాలర్షిప్ వివరాలు", icon: GraduationCap },
        { text: "మానవ మద్దతును సంప్రదించండి", icon: Phone }
      ],
      kn: [
        { text: "ಪ್ರಿ-ಮೆಟ್ರಿಕ್ ವಿದ್ಯಾರ್ಥಿವೇತನ ಎಂದರೇನು?", icon: GraduationCap },
        { text: "ಪೋಸ್ಟ್-ಮೆಟ್ರಿಕ್ ವಿದ್ಯಾರ್ಥಿವೇತನ ಮಾಹಿತಿ", icon: BookOpen },
        { text: "DBT ಸ್ಥಿತಿ ಪರಿಶೀಲಿಸಿ", icon: HelpCircle },
        { text: "ಆಧಾರ್ ಖಾತೆ ಲಿಂಕ್ ಮಾಡಿ", icon: CreditCard },
        { text: "ಮೆರಿಟ್ ವಿದ್ಯಾರ್ಥಿವೇತನ ವಿವರಗಳು", icon: GraduationCap },
        { text: "ಮಾನವ ಬೆಂಬಲವನ್ನು ಸಂಪರ್ಕಿಸಿ", icon: Phone }
      ],
      ml: [
        { text: "പ്രീ-മെട്രിക് സ്കോളർഷിപ്പ് എന്താണ്?", icon: GraduationCap },
        { text: "പോസ്റ്റ്-മെട്രിക് സ്കോളർഷിപ്പ് വിവരം", icon: BookOpen },
        { text: "DBT സ്റ്റാറ്റസ് പരിശോധിക്കുക", icon: HelpCircle },
        { text: "ആധാർ അക്കൗണ്ട് ലിങ്ക് ചെയ്യുക", icon: CreditCard },
        { text: "മെറിറ്റ് സ്കോളർഷിപ്പ് വിശദാംശങ്ങൾ", icon: GraduationCap },
        { text: "മനുഷ്യ പിന്തുണയുമായി ബന്ധപ്പെടുക", icon: Phone }
      ],
      bn: [
        { text: "প্রি-ম্যাট্রিক বৃত্তি কী?", icon: GraduationCap },
        { text: "পোস্ট-ম্যাট্রিক বৃত্তির তথ্য", icon: BookOpen },
        { text: "DBT স্ট্যাটাস চেক করুন", icon: HelpCircle },
        { text: "আধার অ্যাকাউন্ট লিঙ্ক করুন", icon: CreditCard },
        { text: "মেরিট বৃত্তির বিবরণ", icon: GraduationCap },
        { text: "মানব সহায়তার সাথে যোগাযোগ করুন", icon: Phone }
      ],
      gu: [
        { text: "પ્રી-મેટ્રિક શિષ્યવૃત્તિ શું છે?", icon: GraduationCap },
        { text: "પોસ્ટ-મેટ્રિક શિષ્યવૃત્તિ માહિતી", icon: BookOpen },
        { text: "DBT સ્થિતિ તપાસો", icon: HelpCircle },
        { text: "આધાર એકાઉન્ટ લિંક કરો", icon: CreditCard },
        { text: "મેરિટ શિષ્યવૃત્તિ વિગતો", icon: GraduationCap },
        { text: "માનવ સહાયતાનો સંપર્ક કરો", icon: Phone }
      ],
      mr: [
        { text: "प्री-मॅट्रिक शिष्यवृत्ती काय आहे?", icon: GraduationCap },
        { text: "पोस्ट-मॅट्रिक शिष्यवृत्ती माहिती", icon: BookOpen },
        { text: "DBT स्थिती तपासा", icon: HelpCircle },
        { text: "आधार खाते लिंक करा", icon: CreditCard },
        { text: "मेरिट शिष्यवृत्ती तपशील", icon: GraduationCap },
        { text: "मानवी मदतीशी संपर्क साधा", icon: Phone }
      ]
    };
    return questions[currentLanguage] || questions.en;
  };

  const getPlaceholderText = () => {
    const placeholders = {
      en: "Type or speak your message...",
      hi: "अपना संदेश टाइप करें या बोलें...",
      ta: "உங்கள் செய்தியை தட்டச்சு செய்யுங்கள் அல்லது பேசுங்கள்...",
      te: "మీ సందేశాన్ని టైప్ చేయండి లేదా మాట్లాడండి...",
      kn: "ನಿಮ್ಮ ಸಂದೇಶವನ್ನು ಟೈಪ್ ಮಾಡಿ ಅಥವಾ ಮಾತನಾಡಿ...",
      ml: "നിങ്ങളുടെ സന്ദേശം ടൈപ്പ് ചെയ്യുക അല്ലെങ്കിൽ സംസാരിക്കുക...",
      bn: "আপনার বার্তা টাইপ করুন বা বলুন...",
      gu: "તમારો સંદેશ ટાઇપ કરો અથવા બોલો...",
      mr: "तुमचा संदेश टाइप करा किंवा बोला..."
    };
    return placeholders[currentLanguage] || placeholders.en;
  };

  const getFooterText = () => {
    const footers = {
      en: "Voice input • Multi-language • Human support available",
      hi: "आवाज इनपुट • बहु-भाषा • मानव सहायता उपलब्ध",
      ta: "குரல் உள்ளீடு • பல மொழி • மனித ஆதரவு கிடைக்கும்",
      te: "వాయిస్ ఇన్‌పుట్ • బహుభాష • మానవ మద్దతు అందుబాటులో",
      kn: "ಧ್ವನಿ ಇನ್‌ಪುಟ್ • ಬಹುಭಾಷೆ • ಮಾನವ ಬೆಂಬಲ ಲಭ್ಯ",
      ml: "വോയ്‌സ് ഇൻപുട്ട് • മൾട്ടി-ലാംഗ്വേജ് • ഹ്യൂമൻ സപ്പോർട്ട് ലഭ്യം",
      bn: "ভয়েস ইনপুট • বহু-ভাষা • মানব সহায়তা উপলব্ধ",
      gu: "વૉઇસ ઇનપુટ • બહુ-ભાષા • માનવ સહાય ઉપલબ્ધ",
      mr: "व्हॉइस इनपुट • बहु-भाषा • मानवी मदत उपलब्ध"
    };
    return footers[currentLanguage] || footers.en;
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setShowQuickQuestions(false);

    setTimeout(() => {
      const botResponse = getBotResponse(inputMessage);
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        text: botResponse,
        sender: 'bot',
        timestamp: new Date()
      }]);
    }, 1000);
  };

  const getBotResponse = (message) => {
    const lowerMessage = message.toLowerCase();
    
    // Multi-language keyword detection for support
    const supportKeywords = {
      en: ['human', 'support', 'agent', 'help'],
      hi: ['मानव', 'सहायता', 'एजेंट', 'मदद'],
      ta: ['மனித', 'ஆதரவு', 'உதவி'],
      te: ['మానవ', 'మద్దతు', 'సహాయం'],
      kn: ['ಮಾನವ', 'ಬೆಂಬಲ', 'ಸಹಾಯ'],
      ml: ['മനുഷ്യ', 'പിന്തുണ', 'സഹായം'],
      bn: ['মানব', 'সহায়তা', 'সাহায্য'],
      gu: ['માનવ', 'સહાય', 'મદદ'],
      mr: ['मानव', 'समर्थन', 'मदत']
    };
    
    const isSupport = supportKeywords[currentLanguage]?.some(keyword => message.includes(keyword)) || 
                     supportKeywords.en.some(keyword => lowerMessage.includes(keyword));
    
    if (isSupport) {
      const responses = {
        en: "I'm connecting you to our human support team. Please hold on while I transfer your chat. You can also call our helpline at 1800-11-1400 for immediate assistance.",
        hi: "मैं आपको हमारी मानव सहायता टीम से जोड़ रहा हूं। कृपया प्रतीक्षा करें जब तक मैं आपकी चैट स्थानांतरित करता हूं। तत्काल सहायता के लिए आप हमारी हेल्पलाइन 1800-11-1400 पर भी कॉल कर सकते हैं।",
        ta: "நான் உங்களை எங்கள் மனித ஆதரவு குழுவுடன் இணைக்கிறேன். உங்கள் அரட்டையை மாற்றும்போது தயவுசெய்து காத்திருங்கள். உடனடி உதவிக்கு எங்கள் உதவி எண் 1800-11-1400 ஐ அழைக்கலாம்।",
        te: "నేను మిమ్మల్ని మా మానవ మద్దతు బృందంతో కనెక్ట్ చేస్తున్నాను. దయచేసి మీ చాట్ను బదిలీ చేసేటప్పుడు వేచి ఉండండి. తక్షణ సహాయం కోసం మా హెల్ప్లైన్ 1800-11-1400కు కాల్ చేయవచ్చు।",
        kn: "ನಾನು ನಿಮ್ಮನ್ನು ನಮ್ಮ ಮಾನವ ಬೆಂಬಲ ತಂಡದೊಂದಿಗೆ ಸಂಪರ್ಕಿಸುತ್ತಿದ್ದೇನೆ. ನಿಮ್ಮ ಚಾಟ್ ಅನ್ನು ವರ್ಗಾಯಿಸುವಾಗ ದಯವಿಟ್ಟು ಕಾಯಿರಿ. ತಕ್ಷಣದ ಸಹಾಯಕ್ಕಾಗಿ ನಮ್ಮ ಹೆಲ್ಪ್ಲೈನ್ 1800-11-1400 ಗೆ ಕರೆ ಮಾಡಬಹುದು।",
        ml: "ഞാൻ നിങ്ങളെ ഞങ്ങളുടെ മനുഷ്യ പിന്തുണാ ടീമുമായി ബന്ധിപ്പിക്കുന്നു. നിങ്ങളുടെ ചാറ്റ് കൈമാറുമ്പോൾ ദയവായി കാത്തിരിക്കുക. ഉടനടി സഹായത്തിനായി ഞങ്ങളുടെ ഹെൽപ്ലൈൻ 1800-11-1400 ലേക്ക് കോൾ ചെയ്യാം।",
        bn: "আমি আপনাকে আমাদের মানব সহায়তা দলের সাথে সংযুক্ত করছি। আপনার চ্যাট স্থানান্তর করার সময় অনুগ্রহ করে অপেক্ষা করুন। তাৎক্ষণিক সহায়তার জন্য আমাদের হেল্পলাইন 1800-11-1400 এ কল করতে পারেন।",
        gu: "હું તમને અમારી માનવ સહાય ટીમ સાથે જોડી રહ્યો છું. તમારી ચેટ ટ્રાન્સફર કરતી વખતે કૃપા કરીને રાહ જુઓ. તાત્કાલિક સહાય માટે અમારી હેલ્પલાઇન 1800-11-1400 પર કોલ કરી શકો છો।",
        mr: "मी तुम्हाला आमच्या मानवी सहाय्य संघाशी जोडत आहे. तुमची चॅट हस्तांतरित करताना कृपया प्रतीक्षा करा. तत्काळ मदतीसाठी आमच्या हेल्पलाइन 1800-11-1400 वर कॉल करू शकता."
      };
      return responses[currentLanguage] || responses.en;
    }

    // Pre-Matric scholarship detection
    const preMatricKeywords = {
      en: ['pre-matric', 'pre matric', 'prematric'],
      hi: ['प्री-मैट्रिक', 'प्री मैट्रिक', 'प्रीमैट्रिक'],
      ta: ['முன்-மெட்ரிக்', 'முன் மெட்ரிக்'],
      te: ['ప్రీ-మెట్రిక్', 'ప్రీ మెట్రిక్'],
      kn: ['ಪ್ರಿ-ಮೆಟ್ರಿಕ್', 'ಪ್ರಿ ಮೆಟ್ರಿಕ್'],
      ml: ['പ്രീ-മെട്രിക്', 'പ്രീ മെട്രിക്'],
      bn: ['প্রি-ম্যাট্রিক', 'প্রি ম্যাট্রিক'],
      gu: ['પ્રી-મેટ્રિક', 'પ્રી મેટ્રિક'],
      mr: ['प्री-मॅट्रिक', 'प्री मॅट्रिक']
    };
    
    const isPreMatric = preMatricKeywords[currentLanguage]?.some(keyword => message.includes(keyword)) || 
                       preMatricKeywords.en.some(keyword => lowerMessage.includes(keyword));
    
    if (isPreMatric) {
      const responses = {
        en: "Pre-Matric Scholarship:\n\n📚 For students in Class 1-10\n💰 Amount: ₹1,000 - ₹5,700 per year\n📋 Eligibility: Family income below ₹2.5 lakhs\n📝 Required Documents: Aadhaar, Bank Passbook, Income Certificate, Caste Certificate\n🎯 Purpose: School fees, books, uniform\n\nVisit our Scholarship section for more details and application process.",
        hi: "प्री-मैट्रिक छात्रवृत्ति:\n\n📚 कक्षा 1-10 के छात्रों के लिए\n💰 राशि: ₹1,000 - ₹5,700 प्रति वर्ष\n📋 पात्रता: पारिवारिक आय ₹2.5 लाख से कम\n📝 आवश्यक दस्तावेज: आधार, बैंक पासबुक, आय प्रमाण पत्र, जाति प्रमाण पत्र\n🎯 उद्देश्य: स्कूल फीस, किताबें, यूनिफॉर्म\n\nअधिक जानकारी के लिए हमारे छात्रवृत्ति अनुभाग पर जाएं।",
        ta: "முன்-மெட்ரிக் உதவித்தொகை:\n\n📚 வகுப்பு 1-10 மாணவர்களுக்கு\n💰 தொகை: ₹1,000 - ₹5,700 ஆண்டுக்கு\n📋 தகுதி: குடும்ப வருமானம் ₹2.5 லட்சத்திற்கு கீழ்\n📝 தேவையான ஆவணங்கள்: ஆதார், வங்கி பாஸ்புக், வருமான சான்றிதழ், சாதி சான்றிதழ்\n🎯 நோக்கம்: கல்வி கட்டணம், புத்தகங்கள், சீருடை\n\nமேலும் தகவலுக்கு எங்கள் உதவித்தொகை பிரிவைப் பார்வையிடவும்।",
        te: "ప్రీ-మెట్రిక్ స్కాలర్షిప్:\n\n📚 తరగతి 1-10 విద్యార్థులకు\n💰 మొత్తం: సంవత్సరానికి ₹1,000 - ₹5,700\n📋 అర్హత: కుటుంబ ఆదాయం ₹2.5 లక్షలకు తక్కువ\n📝 అవసరమైన పత్రాలు: ఆధార్, బ్యాంక్ పాస్బుక్, ఆదాయ ధృవీకరణ పత్రం, కుల ధృవీకరణ పత్రం\n🎯 ప్రయోజనం: పాఠశాల రుసుము, పుస్తకాలు, యూనిఫాం\n\nమరిన్ని వివరాలకు మా స్కాలర్షిప్ విభాగాన్ని సందర్శించండి।",
        kn: "ಪ್ರಿ-ಮೆಟ್ರಿಕ್ ವಿದ್ಯಾರ್ಥಿವೇತನ:\n\n📚 ತರಗತಿ 1-10 ವಿದ್ಯಾರ್ಥಿಗಳಿಗೆ\n💰 ಮೊತ್ತ: ವರ್ಷಕ್ಕೆ ₹1,000 - ₹5,700\n📋 ಅರ್ಹತೆ: ಕುಟುಂಬದ ಆದಾಯ ₹2.5 ಲಕ್ಷಕ್ಕಿಂತ ಕಡಿಮೆ\n📝 ಅಗತ್ಯ ದಾಖಲೆಗಳು: ಆಧಾರ್, ಬ್ಯಾಂಕ್ ಪಾಸ್ಬುಕ್, ಆದಾಯ ಪ್ರಮಾಣಪತ್ರ, ಜಾತಿ ಪ್ರಮಾಣಪತ್ರ\n🎯 ಉದ್ದೇಶ: ಶಾಲಾ ಶುಲ್ಕ, ಪುಸ್ತಕಗಳು, ಸಮವಸ್ತ್ರ\n\nಹೆಚ್ಚಿನ ವಿವರಗಳಿಗೆ ನಮ್ಮ ವಿದ್ಯಾರ್ಥಿವೇತನ ವಿಭಾಗವನ್ನು ಭೇಟಿ ಮಾಡಿ।",
        ml: "പ്രീ-മെട്രിക് സ്കോളർഷിപ്പ്:\n\n📚 ക്ലാസ് 1-10 വിദ്യാർത്ഥികൾക്ക്\n💰 തുക: വർഷത്തിൽ ₹1,000 - ₹5,700\n📋 യോഗ്യത: കുടുംബ വരുമാനം ₹2.5 ലക്ഷത്തിൽ താഴെ\n📝 ആവശ്യമായ രേഖകൾ: ആധാർ, ബാങ്ക് പാസ്ബുക്ക്, വരുമാന സർട്ടിഫിക്കറ്റ്, ജാതി സർട്ടിഫിക്കറ്റ്\n🎯 ഉദ്ദേശ്യം: സ്കൂൾ ഫീസ്, പുസ്തകങ്ങൾ, യൂണിഫോം\n\nകൂടുതൽ വിവരങ്ങൾക്ക് ഞങ്ങളുടെ സ്കോളർഷിപ്പ് വിഭാഗം സന്ദർശിക്കുക।",
        bn: "প্রি-ম্যাট্রিক বৃত্তি:\n\n📚 ক্লাস ১-১০ এর ছাত্রছাত্রীদের জন্য\n💰 পরিমাণ: বছরে ₹১,০০০ - ₹৫,৭০০\n📋 যোগ্যতা: পারিবারিক আয় ₹২.৫ লাখের নিচে\n📝 প্রয়োজনীয় কাগজপত্র: আধার, ব্যাংক পাসবুক, আয়ের সার্টিফিকেট, জাতি সার্টিফিকেট\n🎯 উদ্দেশ্য: স্কুল ফি, বই, ইউনিফর্ম\n\nআরও তথ্যের জন্য আমাদের বৃত্তি বিভাগ দেখুন।",
        gu: "પ્રી-મેટ્રિક શિષ્યવૃત્તિ:\n\n📚 વર્ગ 1-10 ના વિદ્યાર્થીઓ માટે\n💰 રકમ: વર્ષે ₹1,000 - ₹5,700\n📋 લાયકાત: કુટુંબની આવક ₹2.5 લાખથી ઓછી\n📝 જરૂરી દસ્તાવેજો: આધાર, બેંક પાસબુક, આવકનું પ્રમાણપત્ર, જાતિનું પ્રમાણપત્ર\n🎯 હેતુ: શાળા ફી, પુસ્તકો, યુનિફોર્મ\n\nવધુ માહિતી માટે અમારા શિષ્યવૃત્તિ વિભાગની મુલાકાત લો।",
        mr: "प्री-मॅट्रिक शिष्यवृत्ती:\n\n📚 वर्ग 1-10 च्या विद्यार्थ्यांसाठी\n💰 रक्कम: वर्षाला ₹1,000 - ₹5,700\n📋 पात्रता: कुटुंबाचे उत्पन्न ₹2.5 लाखांपेक्षा कमी\n📝 आवश्यक कागदपत्रे: आधार, बँक पासबुक, उत्पन्न प्रमाणपत्र, जात प्रमाणपत्र\n🎯 उद्देश: शाळा फी, पुस्तके, गणवेश\n\nअधिक माहितीसाठी आमच्या शिष्यवृत्ती विभागाला भेट द्या."
      };
      return responses[currentLanguage] || responses.en;
    }

    // Default response
    const defaultResponses = {
      en: "I understand you're asking about DBT services. I can help with status checks, account linking, scholarships, and general DBT information. For complex issues, I can connect you to human support. What specific help do you need?",
      hi: "मैं समझता हूं कि आप DBT सेवाओं के बारे में पूछ रहे हैं। मैं स्थिति जांच, खाता लिंकिंग, छात्रवृत्ति और सामान्य DBT जानकारी में मदद कर सकता हूं। जटिल मुद्दों के लिए, मैं आपको मानव सहायता से जोड़ सकता हूं। आपको किस विशिष्ट सहायता की आवश्यकता है?",
      ta: "நான் DBT சேவைகளைப் பற்றி புரிந்துகொள்கிறேன். நான் நிலை சரிபார்ப்பு, கணக்கு இணைப்பு, உதவித்தொகை மற்றும் பொதுவான DBT தகவல்களில் உதவ முடியும். சிக்கலான பிரச்சினைகளுக்கு, நான் உங்களை மனித ஆதரவுடன் இணைக்க முடியும். உங்களுக்கு என்ன குறிப்பிட்ட உதவி தேவை?",
      te: "మీరు DBT సేవల గురించి అడుగుతున్నారని నేను అర్థం చేసుకున్నాను. నేను స్థితి తనిఖీలు, ఖాతా లింకింగ్, స్కాలర్‌షిప్‌లు మరియు సాధారణ DBT సమాచారంలో సహాయం చేయగలను. సంక్లిష్ట సమస్యలకు, నేను మిమ్మల్ని మానవ మద్దతుతో కనెక్ట్ చేయగలను. మీకు ఏ నిర్దిష్ట సహాయం అవసరం?",
      kn: "ನೀವು DBT ಸೇವೆಗಳ ಬಗ್ಗೆ ಕೇಳುತ್ತಿದ್ದೀರಿ ಎಂದು ನಾನು ಅರ್ಥಮಾಡಿಕೊಂಡಿದ್ದೇನೆ. ನಾನು ಸ್ಥಿತಿ ಪರಿಶೀಲನೆ, ಖಾತೆ ಲಿಂಕಿಂಗ್, ವಿದ್ಯಾರ್ಥಿವೇತನ ಮತ್ತು ಸಾಮಾನ್ಯ DBT ಮಾಹಿತಿಯಲ್ಲಿ ಸಹಾಯ ಮಾಡಬಲ್ಲೆ. ಸಂಕೀರ್ಣ ಸಮಸ್ಯೆಗಳಿಗೆ, ನಾನು ನಿಮ್ಮನ್ನು ಮಾನವ ಬೆಂಬಲದೊಂದಿಗೆ ಸಂಪರ್ಕಿಸಬಲ್ಲೆ. ನಿಮಗೆ ಯಾವ ನಿರ್ದಿಷ್ಟ ಸಹಾಯ ಬೇಕು?",
      ml: "നിങ്ങൾ DBT സേവനങ്ങളെക്കുറിച്ച് ചോദിക്കുന്നുണ്ടെന്ന് ഞാൻ മനസ്സിലാക്കുന്നു. സ്റ്റാറ്റസ് പരിശോധനകൾ, അക്കൗണ്ട് ലിങ്കിംഗ്, സ്കോളർഷിപ്പുകൾ, പൊതുവായ DBT വിവരങ്ങൾ എന്നിവയിൽ എനിക്ക് സഹായിക്കാൻ കഴിയും. സങ്കീർണ്ണമായ പ്രശ്നങ്ങൾക്ക്, എനിക്ക് നിങ്ങളെ മനുഷ്യ പിന്തുണയുമായി ബന്ധിപ്പിക്കാൻ കഴിയും. നിങ്ങൾക്ക് എന്ത് പ്രത്യേക സഹായം വേണം?",
      bn: "আমি বুঝতে পারছি আপনি DBT সেবা সম্পর্কে জিজ্ঞাসা করছেন। আমি স্ট্যাটাস চেক, অ্যাকাউন্ট লিঙ্কিং, বৃত্তি এবং সাধারণ DBT তথ্যে সাহায্য করতে পারি। জটিল সমস্যার জন্য, আমি আপনাকে মানব সহায়তার সাথে সংযুক্ত করতে পারি। আপনার কী নির্দিষ্ট সাহায্য প্রয়োজন?",
      gu: "હું સમજું છું કે તમે DBT સેવાઓ વિશે પૂછી રહ્યા છો. હું સ્થિતિ તપાસ, એકાઉન્ટ લિંકિંગ, શિષ્યવૃત્તિ અને સામાન્ય DBT માહિતીમાં મદદ કરી શકું છું. જટિલ મુદ્દાઓ માટે, હું તમને માનવ સહાય સાથે જોડી શકું છું. તમને કઈ ચોક્કસ મદદની જરૂર છે?",
      mr: "मला समजते की तुम्ही DBT सेवांबद्दल विचारत आहात. मी स्थिती तपासणी, खाते लिंकिंग, शिष्यवृत्ती आणि सामान्य DBT माहितीमध्ये मदत करू शकतो. गुंतागुंतीच्या समस्यांसाठी, मी तुम्हाला मानवी मदतीशी जोडू शकतो. तुम्हाला कोणत्या विशिष्ट मदतीची गरज आहे?"
    };
    return defaultResponses[currentLanguage] || defaultResponses.en;
  };

  const handleQuickQuestion = (question) => {
    setInputMessage(question.text);
    setTimeout(() => handleSendMessage(), 100);
  };

  const startVoiceInput = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      
      const langMap = {
        'en': 'en-IN',
        'ta': 'ta-IN',
        'hi': 'hi-IN',
        'te': 'te-IN',
        'kn': 'kn-IN',
        'ml': 'ml-IN',
        'bn': 'bn-IN',
        'gu': 'gu-IN',
        'mr': 'mr-IN'
      };
      recognition.lang = langMap[currentLanguage] || 'en-IN';
      
      recognition.onstart = () => {
        setIsListening(true);
      };
      
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputMessage(transcript);
        setIsListening(false);
      };
      
      recognition.onerror = (event) => {
        setIsListening(false);
        console.error('Speech recognition error:', event.error);
      };
      
      recognition.onend = () => {
        setIsListening(false);
      };
      
      recognition.start();
      recognitionRef.current = recognition;
    } else {
      const message = currentLanguage === 'ta' ? 
        'உங்கள் உலாவியில் குரல் உள்ளீடு ஆதரிக்கப்படவில்லை.' :
        'Voice input is not supported in your browser.';
      alert(message);
    }
  };

  const stopVoiceInput = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  };

  const speakMessage = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      const langMap = {
        'en': 'en-IN',
        'ta': 'ta-IN',
        'hi': 'hi-IN',
        'te': 'te-IN',
        'kn': 'kn-IN',
        'ml': 'ml-IN',
        'bn': 'bn-IN',
        'gu': 'gu-IN',
        'mr': 'mr-IN'
      };
      utterance.lang = langMap[currentLanguage] || 'en-IN';
      utterance.rate = 0.9;
      utterance.pitch = 1;
      window.speechSynthesis.speak(utterance);
    }
  };

  const toggleLanguage = () => {
    const languages = ['en', 'hi', 'ta', 'te', 'kn', 'ml', 'bn', 'gu', 'mr'];
    const currentIndex = languages.indexOf(currentLanguage);
    const nextIndex = (currentIndex + 1) % languages.length;
    setCurrentLanguage(languages[nextIndex]);
  };

  const getLanguageLabel = () => {
    const labels = {
      'en': 'EN',
      'hi': 'हिं',
      'ta': 'தமிழ்',
      'te': 'తెలుగు',
      'kn': 'ಕನ್ನಡ',
      'ml': 'മലയാളം',
      'bn': 'বাংলা',
      'gu': 'ગુજરાતી',
      'mr': 'मराठी'
    };
    return labels[currentLanguage];
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 w-16 h-16 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg transition-all duration-300 flex items-center justify-center z-50 animate-pulse ${isOpen ? 'hidden' : 'block'}`}
      >
        <MessageCircle className="h-7 w-7" />
      </button>

      {isOpen && (
        <div className="fixed bottom-6 right-6 w-[450px] h-[700px] bg-white rounded-lg shadow-xl border z-50 flex flex-col">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 rounded-t-lg flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Bot className="h-6 w-6" />
              <div>
                <span className="font-medium block">Enhanced DBT Assistant</span>
                <span className="text-xs opacity-90 flex items-center">
                  <span className="w-2 h-2 bg-green-400 rounded-full mr-1 animate-pulse"></span>
                  Online • Voice • Multi-language
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <select
                  value={currentLanguage}
                  onChange={(e) => setCurrentLanguage(e.target.value)}
                  className="bg-white/20 hover:bg-white/30 px-2 py-1 rounded text-xs font-medium text-white border-none outline-none cursor-pointer"
                >
                  <option value="en" className="text-black">🇬🇧 English</option>
                  <option value="hi" className="text-black">🇮🇳 हिंदी</option>
                  <option value="ta" className="text-black">🇮🇳 தமிழ்</option>
                  <option value="te" className="text-black">🇮🇳 తెలుగు</option>
                  <option value="kn" className="text-black">🇮🇳 ಕನ್ನಡ</option>
                  <option value="ml" className="text-black">🇮🇳 മലയാളം</option>
                  <option value="bn" className="text-black">🇮🇳 বাংলা</option>
                  <option value="gu" className="text-black">🇮🇳 ગુજરાતી</option>
                  <option value="mr" className="text-black">🇮🇳 मराठी</option>
                </select>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white hover:text-gray-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-start space-x-3 max-w-sm ${message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${message.sender === 'user' ? 'bg-blue-600' : 'bg-gradient-to-r from-green-400 to-blue-500'}`}>
                    {message.sender === 'user' ? (
                      <User className="h-4 w-4 text-white" />
                    ) : (
                      <Bot className="h-4 w-4 text-white" />
                    )}
                  </div>
                  <div className={`p-3 rounded-lg relative group max-w-xs ${message.sender === 'user' ? 'bg-blue-600 text-white rounded-br-sm' : 'bg-gray-100 text-gray-800 rounded-bl-sm'}`}>
                    <p className="text-sm whitespace-pre-line">{message.text}</p>
                    {message.sender === 'bot' && (
                      <button
                        onClick={() => speakMessage(message.text)}
                        className="absolute -right-10 top-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-200 rounded-full"
                        title="Listen to message"
                      >
                        <Volume2 className="h-4 w-4 text-gray-500" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {showQuickQuestions && (
            <div className="px-4 pb-3 max-h-40 overflow-y-auto">
              <p className="text-xs text-gray-600 mb-3 font-medium">
                {currentLanguage === 'ta' ? 'விரைவு கேள்விகள்:' : 'Quick Questions:'}
              </p>
              <div className="grid grid-cols-1 gap-2">
                {getQuickQuestions().map((question, index) => {
                  const IconComponent = question.icon;
                  return (
                    <button
                      key={index}
                      onClick={() => handleQuickQuestion(question)}
                      className="text-xs px-3 py-2 bg-gradient-to-r from-gray-50 to-gray-100 hover:from-blue-50 hover:to-blue-100 rounded-lg text-gray-700 transition-all duration-200 flex items-center space-x-2 border border-gray-200 hover:border-blue-300"
                    >
                      <IconComponent className="h-4 w-4 text-blue-600" />
                      <span className="text-left flex-1">{question.text}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div className="p-4 border-t bg-gray-50">
            <div className="flex space-x-2 mb-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder={getPlaceholderText()}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
              />
              <button
                onClick={isListening ? stopVoiceInput : startVoiceInput}
                className={`p-3 rounded-lg transition-all duration-200 ${isListening ? 'bg-red-100 text-red-600 animate-pulse shadow-lg' : 'bg-blue-100 text-blue-600 hover:bg-blue-200'}`}
                title={isListening ? 'Stop recording' : `Voice input (${getLanguageLabel()})`}
              >
                {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
              </button>
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim()}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white p-3 rounded-lg transition-colors"
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
            <p className="text-xs text-gray-500 text-center">
              {getFooterText()}
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;