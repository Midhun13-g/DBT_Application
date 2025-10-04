import React, { useState, useEffect } from 'react';
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
  MessageCircle,
  RefreshCw,
  Wifi,
  WifiOff,
  Image,
  Star,
  Tag,
  Eye
} from 'lucide-react';
import Card from '../../components/Card/Card';
import Button from '../../components/Button/Button';
import Modal from '../../components/Modal/Modal';
import socketService from '../../services/socketService';
import dataService from '../../services/dataService';

const Awareness = () => {
  const { t } = useTranslation();
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [awarenessContent, setAwarenessContent] = useState([]);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

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

  useEffect(() => {
    loadAwarenessContent();
    
    // Initialize socket connection
    const initSocket = async () => {
      try {
        await socketService.connect();
        const user = JSON.parse(localStorage.getItem('dbt_user') || '{}');
        if (user.id) {
          socketService.registerUser({
            userId: user.id,
            role: user.role || 'user',
            name: user.name || 'User'
          });
        }
        setIsConnected(true);
      } catch (error) {
        console.warn('Socket connection failed:', error);
        setIsConnected(false);
      }
    };
    
    initSocket();
    
    // Listen for real-time content updates
    const handleContentUpdate = (event) => {
      console.log('📚 Awareness content update received:', event.detail);
      loadAwarenessContent();
    };
    
    window.addEventListener('contentUpdate', handleContentUpdate);
    
    // Check connection status periodically
    const statusInterval = setInterval(() => {
      setIsConnected(socketService.isConnected());
    }, 3000);
    
    // Fallback polling for offline mode
    const pollInterval = setInterval(() => {
      if (!socketService.isConnected()) {
        loadAwarenessContent();
      }
    }, 10000);
    
    return () => {
      window.removeEventListener('contentUpdate', handleContentUpdate);
      clearInterval(statusInterval);
      clearInterval(pollInterval);
    };
  }, []);

  const loadAwarenessContent = async () => {
    try {
      const dummyContent = [
          {
            id: 1,
            title: 'Understanding Direct Benefit Transfer (DBT)',
            content: 'DBT is a revolutionary system that ensures government benefits reach citizens directly without intermediaries.',
            description: 'Learn how this transparent mechanism eliminates corruption and ensures timely delivery of subsidies and welfare payments to your bank account. This comprehensive guide covers all aspects of DBT implementation, benefits, and how it transforms the way government services are delivered to citizens.',
            category: 'EDUCATION',
            mediaType: 'ARTICLE',
            targetAudience: 'ALL',
            priority: 'HIGH',
            tags: ['dbt', 'benefits', 'transparency', 'government'],
            isActive: true,
            isFeatured: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          {
            id: 2,
            title: 'Aadhaar Linking: Your Gateway to Benefits',
            content: 'Discover why linking your Aadhaar with your bank account is crucial for receiving government benefits.',
            description: 'This comprehensive guide explains the process, benefits, and common issues faced during Aadhaar seeding. Includes step-by-step instructions, troubleshooting tips, and answers to frequently asked questions about Aadhaar-bank account linking.',
            category: 'FINANCE',
            mediaType: 'VIDEO',
            targetAudience: 'ALL',
            priority: 'URGENT',
            tags: ['aadhaar', 'banking', 'linking', 'seeding'],
            videoUrl: 'https://youtube.com/watch?v=example-aadhaar-linking',
            isActive: true,
            isFeatured: false,
            createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
          },
          {
            id: 3,
            title: 'DBT Guidelines 2024 - Complete Manual',
            content: 'Official government guidelines for Direct Benefit Transfer implementation and usage.',
            description: 'Comprehensive PDF document containing all official guidelines, procedures, and best practices for DBT implementation across various government schemes. Essential reading for understanding the complete DBT ecosystem.',
            category: 'GOVERNMENT',
            mediaType: 'PDF',
            targetAudience: 'ALL',
            priority: 'NORMAL',
            tags: ['guidelines', 'manual', 'official', 'pdf'],
            pdfUrl: 'data:application/pdf;base64,sample-pdf-data-for-dbt-guidelines',
            isActive: true,
            isFeatured: true,
            createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString()
          },
          {
            id: 4,
            title: 'Digital Payment Safety Guidelines',
            content: 'Stay safe while using digital payment methods and protect your financial information.',
            description: 'Learn about secure online banking practices, how to identify fraud attempts, and protect your financial information in the digital age. Includes infographic with safety tips and best practices for digital transactions.',
            category: 'TECHNOLOGY',
            mediaType: 'INFOGRAPHIC',
            targetAudience: 'ALL',
            priority: 'HIGH',
            tags: ['safety', 'digital payments', 'security', 'fraud prevention'],
            imageUrl: 'https://example.com/digital-payment-safety-infographic.jpg',
            isActive: true,
            isFeatured: false,
            createdAt: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString()
          },
          {
            id: 5,
            title: 'Government Schemes and Eligibility',
            content: 'Explore various government welfare schemes available for different sections of society.',
            description: 'Understand eligibility criteria, application processes, and how to track your application status online. Complete guide covering pension schemes, healthcare benefits, education support, and employment programs.',
            category: 'EDUCATION',
            mediaType: 'ARTICLE',
            targetAudience: 'ALL',
            priority: 'NORMAL',
            tags: ['schemes', 'eligibility', 'welfare', 'benefits'],
            isActive: true,
            isFeatured: false,
            createdAt: new Date(Date.now() - 96 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date(Date.now() - 96 * 60 * 60 * 1000).toISOString()
          },
          {
            id: 6,
            title: 'Mobile Banking Tutorial for Seniors',
            content: 'Step-by-step video guide for senior citizens to use mobile banking safely and effectively.',
            description: 'Specially designed tutorial for senior citizens covering smartphone basics, mobile banking app usage, security measures, and common troubleshooting. Includes large text and clear audio instructions.',
            category: 'TECHNOLOGY',
            mediaType: 'VIDEO',
            targetAudience: 'SENIOR_CITIZENS',
            priority: 'HIGH',
            tags: ['mobile banking', 'seniors', 'tutorial', 'safety'],
            videoUrl: 'https://youtube.com/watch?v=example-mobile-banking-seniors',
            isActive: true,
            isFeatured: true,
            createdAt: new Date(Date.now() - 120 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date(Date.now() - 120 * 60 * 60 * 1000).toISOString()
          }
        ];
      
      const content = await dataService.loadData('awarenessContent', dummyContent);
      const activeContent = content.filter(item => item.isActive);
      setAwarenessContent(activeContent);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Error loading awareness content:', error);
      setAwarenessContent([]);
    }
  };

  const toggleFaq = (faqId) => {
    setExpandedFaq(expandedFaq === faqId ? null : faqId);
  };

  const handleVideoPlay = (video) => {
    setSelectedVideo(video);
    setShowVideoModal(true);
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'EDUCATION': return 'bg-blue-100 text-blue-800';
      case 'HEALTH': return 'bg-green-100 text-green-800';
      case 'FINANCE': return 'bg-purple-100 text-purple-800';
      case 'TECHNOLOGY': return 'bg-orange-100 text-orange-800';
      case 'GOVERNMENT': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getMediaIcon = (mediaType) => {
    switch (mediaType) {
      case 'VIDEO': return Video;
      case 'ARTICLE': return FileText;
      case 'INFOGRAPHIC': return Image;
      default: return BookOpen;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Awareness & Education
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-4">
            Stay informed with the latest educational content and resources
          </p>
          <div className="flex justify-center items-center space-x-4">
            <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${
              isConnected 
                ? 'bg-green-100 text-green-800' 
                : 'bg-yellow-100 text-yellow-800'
            }`}>
              {isConnected ? <Wifi className="h-4 w-4" /> : <WifiOff className="h-4 w-4" />}
              <span>{isConnected ? 'Live Updates' : 'Offline Mode'}</span>
            </div>
            {lastUpdate && (
              <p className="text-sm text-gray-500">
                Last updated: {lastUpdate.toLocaleTimeString()}
              </p>
            )}
            <button
              onClick={loadAwarenessContent}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors text-sm"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Refresh</span>
            </button>
          </div>
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

        {/* Dynamic Awareness Content */}
        <div className="mt-12">
          <Card>
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              Latest Educational Content
            </h2>
            {awarenessContent.length === 0 ? (
              <div className="text-center py-12">
                <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No content available</h3>
                <p className="text-gray-500">Check back later for new educational resources.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {awarenessContent.map((item) => {
                  const MediaIcon = getMediaIcon(item.mediaType);
                  return (
                    <div key={item.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="bg-blue-100 p-2 rounded-lg">
                            <MediaIcon className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                              {item.title}
                            </h3>
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getCategoryColor(item.category)}`}>
                              {item.category}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <p className="text-gray-700 mb-4 line-clamp-4">
                        {item.content}
                      </p>
                      
                      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-gray-500">
                            {new Date(item.createdAt).toLocaleDateString('en-IN')}
                          </span>
                          <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                            {item.mediaType}
                          </span>
                        </div>
                        <div className="flex space-x-2">
                          {item.mediaType === 'PDF' && item.pdfUrl && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                const link = document.createElement('a');
                                link.href = item.pdfUrl;
                                link.download = `${item.title}.pdf`;
                                link.click();
                              }}
                              className="bg-red-600 text-white px-3 py-1 rounded-lg text-xs font-medium hover:bg-red-700 transition-colors flex items-center space-x-1"
                            >
                              <Download className="h-3 w-3" />
                              <span>Download PDF</span>
                            </button>
                          )}
                          {item.mediaType === 'VIDEO' && item.videoUrl && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                window.open(item.videoUrl, '_blank');
                              }}
                              className="bg-purple-600 text-white px-3 py-1 rounded-lg text-xs font-medium hover:bg-purple-700 transition-colors flex items-center space-x-1"
                            >
                              <Play className="h-3 w-3" />
                              <span>Watch Video</span>
                            </button>
                          )}
                          <button className="bg-blue-600 text-white px-3 py-1 rounded-lg text-xs font-medium hover:bg-blue-700 transition-colors flex items-center space-x-1">
                            <Eye className="h-3 w-3" />
                            <span>Read More</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        </div>

        {/* Educational Videos */}
        <div className="mt-12">
          <Card>
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              Educational Videos
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