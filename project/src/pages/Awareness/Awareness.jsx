import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  HelpCircle, 
  Play, 
  Download, 
  FileText, 
  Video, 
  BookOpen,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Phone,
  Mail,
  MessageCircle
} from 'lucide-react';
import Card from '../../components/Card/Card';
import Button from '../../components/Button/Button';
import Modal from '../../components/Modal/Modal';

const Awareness = () => {
  const { t } = useTranslation();
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);

  const faqs = [
    {
      id: 1,
      question: "What is Direct Benefit Transfer (DBT)?",
      answer: "DBT is a mechanism to transfer subsidies and benefits directly to the bank accounts of beneficiaries. It eliminates intermediaries and ensures that benefits reach the intended recipients without leakage or delay."
    },
    {
      id: 2,
      question: "Why is Aadhaar linking mandatory for DBT?",
      answer: "Aadhaar linking ensures unique identification of beneficiaries, prevents duplicate payments, and enables direct transfer to the correct bank account. It helps in eliminating ghost beneficiaries and reduces corruption."
    },
    {
      id: 3,
      question: "How long does it take to link Aadhaar with bank account?",
      answer: "The linking process is usually instant through net banking or ATM. However, it may take 24-48 hours for the DBT status to be updated in the system. Branch visits might take 2-3 working days."
    },
    {
      id: 4,
      question: "What if my Aadhaar details don't match with bank records?",
      answer: "If there's a mismatch in name, address, or other details, you need to update either your Aadhaar or bank records. Visit your bank branch with supporting documents to correct the information."
    },
    {
      id: 5,
      question: "Can I link multiple bank accounts with one Aadhaar?",
      answer: "Yes, you can link multiple bank accounts with your Aadhaar. However, for DBT purposes, you should designate one primary account where you want to receive government benefits."
    },
    {
      id: 6,
      question: "What happens if I don't link my Aadhaar?",
      answer: "Without Aadhaar linking, you may not receive government subsidies and benefits directly. Your account will not be DBT-enabled, and you might face difficulties in accessing various government schemes."
    },
    {
      id: 7,
      question: "Is there any charge for Aadhaar-bank account linking?",
      answer: "No, banks cannot charge any fee for linking Aadhaar with bank accounts. This service is provided free of cost. However, CSC centers may charge a nominal service fee."
    },
    {
      id: 8,
      question: "How can I check if my account is DBT-enabled?",
      answer: "You can check your DBT status using our online portal by entering your Aadhaar last 4 digits and application ID. You can also check with your bank or visit the PFMS website."
    }
  ];

  const videos = [
    {
      id: 1,
      title: "Understanding DBT - Complete Overview",
      duration: "8:45",
      thumbnail: "https://images.pexels.com/photos/5473955/pexels-photo-5473955.jpeg?auto=compress&cs=tinysrgb&w=400",
      description: "Learn about the benefits and importance of Direct Benefit Transfer system in India."
    },
    {
      id: 2,
      title: "Aadhaar Linking Benefits Explained",
      duration: "5:30",
      thumbnail: "https://images.pexels.com/photos/4386321/pexels-photo-4386321.jpeg?auto=compress&cs=tinysrgb&w=400",
      description: "Understand why Aadhaar linking is crucial for receiving government benefits."
    },
    {
      id: 3,
      title: "Common DBT Issues and Solutions",
      duration: "6:15",
      thumbnail: "https://images.pexels.com/photos/5473956/pexels-photo-5473956.jpeg?auto=compress&cs=tinysrgb&w=400",
      description: "Troubleshoot common problems faced during DBT enrollment and usage."
    },
    {
      id: 4,
      title: "Success Stories - DBT Impact",
      duration: "4:20",
      thumbnail: "https://images.pexels.com/photos/5473958/pexels-photo-5473958.jpeg?auto=compress&cs=tinysrgb&w=400",
      description: "Real stories of how DBT has transformed lives across rural and urban India."
    }
  ];

  const resources = [
    {
      title: "DBT Guidelines 2024",
      type: "PDF",
      size: "2.5 MB",
      icon: FileText,
      description: "Complete guidelines for Direct Benefit Transfer implementation"
    },
    {
      title: "Aadhaar Linking Poster",
      type: "PDF",
      size: "1.2 MB",
      icon: FileText,
      description: "Informational poster about Aadhaar-bank account linking"
    },
    {
      title: "DBT Scheme List",
      type: "Excel",
      size: "850 KB",
      icon: FileText,
      description: "List of all government schemes using DBT mechanism"
    },
    {
      title: "Troubleshooting Guide",
      type: "PDF",
      size: "1.8 MB",
      icon: BookOpen,
      description: "Step-by-step solutions for common DBT issues"
    }
  ];

  const supportChannels = [
    {
      title: "DBT Helpline",
      contact: "1800-11-1400",
      icon: Phone,
      description: "24/7 toll-free helpline for DBT related queries",
      available: "Available 24/7"
    },
    {
      title: "Email Support",
      contact: "help@dbt.gov.in",
      icon: Mail,
      description: "Send your queries via email for detailed assistance",
      available: "Response within 24 hours"
    },
    {
      title: "WhatsApp Support",
      contact: "+91-9876543210",
      icon: MessageCircle,
      description: "Get instant help through WhatsApp chat",
      available: "9 AM - 6 PM"
    }
  ];

  const toggleFaq = (faqId) => {
    setExpandedFaq(expandedFaq === faqId ? null : faqId);
  };

  const handleVideoPlay = (video) => {
    setSelectedVideo(video);
    setShowVideoModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {t('awareness.title')}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('awareness.subtitle')}
          </p>
        </div>

        {/* Key Benefits Section */}
        <div className="mb-12">
          <Card>
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
              Key Benefits of DBT
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Transparency
                </h3>
                <p className="text-gray-600">
                  Direct transfer eliminates middlemen and ensures complete transparency in benefit distribution.
                </p>
              </div>
              <div className="text-center">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <HelpCircle className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Efficiency
                </h3>
                <p className="text-gray-600">
                  Faster delivery of benefits directly to bank accounts without delays or leakages.
                </p>
              </div>
              <div className="text-center">
                <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Accountability
                </h3>
                <p className="text-gray-600">
                  Real-time tracking and monitoring of benefit transfers ensures accountability.
                </p>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* FAQ Section */}
          <div>
            <Card>
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                {t('awareness.faqTitle')}
              </h2>
              <div className="space-y-4">
                {faqs.map((faq) => (
                  <div key={faq.id} className="border border-gray-200 rounded-lg">
                    <button
                      onClick={() => toggleFaq(faq.id)}
                      className="w-full px-4 py-3 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                    >
                      <span className="font-medium text-gray-900">
                        {faq.question}
                      </span>
                      {expandedFaq === faq.id ? (
                        <ChevronUp className="h-5 w-5 text-gray-500" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-gray-500" />
                      )}
                    </button>
                    {expandedFaq === faq.id && (
                      <div className="px-4 pb-3 text-gray-700 border-t border-gray-200 bg-gray-50">
                        <p className="pt-3">{faq.answer}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Support Channels */}
          <div>
            <Card>
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                Get Help & Support
              </h2>
              <div className="space-y-4">
                {supportChannels.map((channel, index) => {
                  const IconComponent = channel.icon;
                  return (
                    <div key={index} className="flex items-start space-x-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="bg-blue-100 p-3 rounded-lg">
                        <IconComponent className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">
                          {channel.title}
                        </h3>
                        <p className="text-blue-600 font-medium mb-1">
                          {channel.contact}
                        </p>
                        <p className="text-gray-600 text-sm mb-2">
                          {channel.description}
                        </p>
                        <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
                          {channel.available}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>
        </div>

        {/* Educational Videos */}
        <div className="mt-12">
          <Card>
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              {t('awareness.videosTitle')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {videos.map((video) => (
                <div key={video.id} className="group cursor-pointer">
                  <div 
                    className="relative rounded-lg overflow-hidden mb-3"
                    onClick={() => handleVideoPlay(video)}
                  >
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center group-hover:bg-opacity-30 transition-all">
                      <div className="bg-white bg-opacity-90 rounded-full p-3 group-hover:scale-110 transition-transform">
                        <Play className="h-6 w-6 text-blue-600" />
                      </div>
                    </div>
                    <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                      {video.duration}
                    </div>
                  </div>
                  <h3 className="font-medium text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {video.title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {video.description}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Downloadable Resources */}
        <div className="mt-12">
          <Card>
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              {t('awareness.resourcesTitle')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {resources.map((resource, index) => {
                const IconComponent = resource.icon;
                return (
                  <div key={index} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group">
                    <div className="bg-blue-100 p-3 rounded-lg group-hover:bg-blue-200 transition-colors">
                      <IconComponent className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 mb-1">
                        {resource.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">
                        {resource.description}
                      </p>
                      <div className="flex items-center space-x-2 text-xs text-gray-500">
                        <span>{resource.type}</span>
                        <span>•</span>
                        <span>{resource.size}</span>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" icon={Download}>
                      Download
                    </Button>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        {/* External Links */}
        <div className="mt-12">
          <Card>
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              Useful Links
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <a
                href="https://pfms.nic.in"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors group"
              >
                <ExternalLink className="h-5 w-5 text-blue-600" />
                <div>
                  <h3 className="font-medium text-gray-900 group-hover:text-blue-600">
                    PFMS Portal
                  </h3>
                  <p className="text-sm text-gray-600">
                    Public Financial Management System
                  </p>
                </div>
              </a>
              <a
                href="https://uidai.gov.in"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors group"
              >
                <ExternalLink className="h-5 w-5 text-blue-600" />
                <div>
                  <h3 className="font-medium text-gray-900 group-hover:text-blue-600">
                    UIDAI
                  </h3>
                  <p className="text-sm text-gray-600">
                    Unique Identification Authority
                  </p>
                </div>
              </a>
              <a
                href="https://dbtbharat.gov.in"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors group"
              >
                <ExternalLink className="h-5 w-5 text-blue-600" />
                <div>
                  <h3 className="font-medium text-gray-900 group-hover:text-blue-600">
                    DBT Bharat
                  </h3>
                  <p className="text-sm text-gray-600">
                    Official DBT Portal
                  </p>
                </div>
              </a>
            </div>
          </Card>
        </div>
      </div>

      {/* Video Modal */}
      <Modal
        isOpen={showVideoModal}
        onClose={() => setShowVideoModal(false)}
        title={selectedVideo?.title}
        size="lg"
      >
        <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center mb-4">
          <div className="text-center text-white">
            <Play className="h-16 w-16 mx-auto mb-4 opacity-50" />
            <p>Video player would be embedded here</p>
            <p className="text-sm opacity-75 mt-2">Duration: {selectedVideo?.duration}</p>
          </div>
        </div>
        <p className="text-gray-600">{selectedVideo?.description}</p>
      </Modal>
    </div>
  );
};

export default Awareness;