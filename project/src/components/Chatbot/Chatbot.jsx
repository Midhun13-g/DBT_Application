import React, { useState, useRef } from 'react';
import { MessageCircle, X, Send, Bot, User, Mic, MicOff, Volume2, HelpCircle, Phone } from 'lucide-react';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm your DBT assistant. How can I help you today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [showQuickQuestions, setShowQuickQuestions] = useState(true);
  const recognitionRef = useRef(null);

  const quickQuestions = [
    { text: "Check DBT Status", icon: HelpCircle },
    { text: "Link Aadhaar Account", icon: HelpCircle },
    { text: "Scholarship Information", icon: HelpCircle },
    { text: "Bank Account Issues", icon: HelpCircle },
    { text: "Application Status", icon: HelpCircle },
    { text: "Contact Human Support", icon: Phone }
  ];

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

    // Simulate bot response
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
    
    if (lowerMessage.includes('human') || lowerMessage.includes('support') || lowerMessage.includes('agent')) {
      return "I'm connecting you to our human support team. Please hold on while I transfer your chat. You can also call our helpline at 1800-11-1400 for immediate assistance.";
    }
    
    if (lowerMessage.includes('status') || lowerMessage.includes('check')) {
      return "To check your DBT status, you'll need your Aadhaar number and bank account details. You can use our DBT Status Check page, WhatsApp bot (send 'Hi' to +91-9876543210), or call our IVR system at 1800-11-1400. Would you like me to guide you through any of these methods?";
    }
    
    if (lowerMessage.includes('link') || lowerMessage.includes('aadhaar')) {
      return "To link your Aadhaar with your bank account, you can: 1) Visit your bank branch with Aadhaar card, 2) Use net banking, 3) Visit an ATM, or 4) go to a CSC center. I can provide detailed step-by-step instructions for any of these methods. Which would you prefer?";
    }
    
    if (lowerMessage.includes('scholarship')) {
      return "We have information about various scholarships including Pre-Matric (₹1,000-₹5,700), Post-Matric (₹2,000-₹12,000), and Merit scholarships. You can check eligibility, apply online, and track status on our Scholarship Status page. Which specific scholarship interests you?";
    }
    
    if (lowerMessage.includes('bank') || lowerMessage.includes('account')) {
      return "For bank account related issues: 1) Ensure your account is active, 2) Verify Aadhaar linking, 3) Check if DBT is enabled. If you're facing specific issues, I can connect you to human support or you can visit your bank branch with Aadhaar and passbook.";
    }
    
    return "I understand you're asking about DBT services. I can help with status checks, account linking, scholarships, and general DBT information. For complex issues, I can connect you to human support. What specific help do you need?";
  };

  const handleQuickQuestion = (question) => {
    setInputMessage(question.text);
    setTimeout(() => handleSendMessage(), 100);
  };

  const startVoiceInput = () => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new window.webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-IN';
      
      recognition.onstart = () => {
        setIsListening(true);
      };
      
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputMessage(transcript);
        setIsListening(false);
      };
      
      recognition.onerror = () => {
        setIsListening(false);
      };
      
      recognition.onend = () => {
        setIsListening(false);
      };
      
      recognition.start();
      recognitionRef.current = recognition;
    } else {
      alert('Voice input is not supported in your browser.');
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
      utterance.lang = 'en-IN';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg transition-all duration-300 flex items-center justify-center z-50 animate-pulse ${isOpen ? 'hidden' : 'block'}`}
      >
        <MessageCircle className="h-6 w-6" />
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-80 h-96 bg-white rounded-lg shadow-xl border z-50 flex flex-col">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 rounded-t-lg flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Bot className="h-5 w-5" />
              <div>
                <span className="font-medium block">Enhanced DBT Assistant</span>
                <span className="text-xs opacity-90 flex items-center">
                  <span className="w-2 h-2 bg-green-400 rounded-full mr-1 animate-pulse"></span>
                  Online • Voice Enabled
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-gray-200"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-start space-x-2 max-w-xs ${message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${message.sender === 'user' ? 'bg-blue-600' : 'bg-gray-300'}`}>
                    {message.sender === 'user' ? (
                      <User className="h-3 w-3 text-white" />
                    ) : (
                      <Bot className="h-3 w-3 text-gray-600" />
                    )}
                  </div>
                  <div className={`p-2 rounded-lg relative group ${message.sender === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800'}`}>
                    <p className="text-sm">{message.text}</p>
                    {message.sender === 'bot' && (
                      <button
                        onClick={() => speakMessage(message.text)}
                        className="absolute -right-8 top-1 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-200 rounded"
                      >
                        <Volume2 className="h-3 w-3 text-gray-500" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Questions */}
          {showQuickQuestions && (
            <div className="px-4 pb-2 max-h-32 overflow-y-auto">
              <p className="text-xs text-gray-600 mb-2">Quick Questions:</p>
              <div className="grid grid-cols-2 gap-1">
                {quickQuestions.map((question, index) => {
                  const IconComponent = question.icon;
                  return (
                    <button
                      key={index}
                      onClick={() => handleQuickQuestion(question)}
                      className="text-xs px-2 py-1 bg-gray-100 hover:bg-blue-100 rounded text-gray-700 transition-colors flex items-center space-x-1"
                    >
                      <IconComponent className="h-3 w-3" />
                      <span className="truncate">{question.text}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-4 border-t">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type or speak your message..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
              <button
                onClick={isListening ? stopVoiceInput : startVoiceInput}
                className={`p-2 rounded-lg transition-colors ${isListening ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >
                {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              </button>
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim()}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white p-2 rounded-lg"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1 text-center">
              Voice input • Multi-language • Human support available
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;