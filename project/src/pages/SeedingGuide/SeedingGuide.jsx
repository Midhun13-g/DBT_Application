import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  CreditCard, 
  Building, 
  Smartphone, 
  Globe, 
  CheckCircle, 
  ArrowRight,
  Download,
  Play,
  FileText,
  AlertCircle
} from 'lucide-react';
import Card from '../../components/Card/Card';
import Button from '../../components/Button/Button';
import Modal from '../../components/Modal/Modal';

const SeedingGuide = () => {
  const { t } = useTranslation();
  const [activeMethod, setActiveMethod] = useState('onlineBanking');
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);

  const seedingMethods = [
    {
      id: 'onlineBanking',
      title: t('seedingGuide.onlineBanking'),
      icon: Globe,
      color: 'blue',
      difficulty: 'Easy',
      time: '5-10 minutes',
      steps: [
        'Login to your bank\'s net banking portal',
        'Navigate to "Profile" or "Account Settings"',
        'Look for "Aadhaar Linking" or "KYC Update" section',
        'Enter your 12-digit Aadhaar number',
        'Verify with OTP sent to registered mobile',
        'Submit and wait for confirmation'
      ]
    },
    {
      id: 'atmMethod',
      title: t('seedingGuide.atmMethod'),
      icon: CreditCard,
      color: 'green',
      difficulty: 'Easy',
      time: '3-5 minutes',
      steps: [
        'Visit any ATM of your bank',
        'Insert your debit card and enter PIN',
        'Select "Registration" or "Services" menu',
        'Choose "Aadhaar Registration"',
        'Enter your 12-digit Aadhaar number',
        'Confirm the details and complete'
      ]
    },
    {
      id: 'branchVisit',
      title: t('seedingGuide.branchVisit'),
      icon: Building,
      color: 'purple',
      difficulty: 'Medium',
      time: '30-60 minutes',
      steps: [
        'Visit your bank branch with required documents',
        'Fill the Aadhaar seeding form',
        'Submit Aadhaar copy and bank passbook',
        'Provide biometric verification if required',
        'Get acknowledgment receipt',
        'Check status after 2-3 working days'
      ]
    },
    {
      id: 'cscMethod',
      title: t('seedingGuide.cscMethod'),
      icon: Smartphone,
      color: 'orange',
      difficulty: 'Easy',
      time: '10-15 minutes',
      steps: [
        'Visit nearest Common Service Center (CSC)',
        'Carry Aadhaar card and bank passbook',
        'Request for Aadhaar-Bank account linking',
        'Provide biometric authentication',
        'Pay nominal service charges',
        'Collect acknowledgment receipt'
      ]
    }
  ];

  const videos = [
    {
      id: 1,
      title: 'Net Banking Aadhaar Linking - SBI',
      duration: '3:45',
      thumbnail: 'https://images.pexels.com/photos/5473955/pexels-photo-5473955.jpeg?auto=compress&cs=tinysrgb&w=300',
      url: '#'
    },
    {
      id: 2,
      title: 'ATM Aadhaar Seeding Process',
      duration: '2:30',
      thumbnail: 'https://images.pexels.com/photos/4386321/pexels-photo-4386321.jpeg?auto=compress&cs=tinysrgb&w=300',
      url: '#'
    },
    {
      id: 3,
      title: 'Branch Visit Complete Guide',
      duration: '5:20',
      thumbnail: 'https://images.pexels.com/photos/5473956/pexels-photo-5473956.jpeg?auto=compress&cs=tinysrgb&w=300',
      url: '#'
    }
  ];

  const documents = [
    'Original Aadhaar Card',
    'Bank Account Passbook',
    'Valid Photo ID (if Aadhaar photo is unclear)',
    'Mobile number registered with bank'
  ];

  const currentMethod = seedingMethods.find(method => method.id === activeMethod);

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
            {t('seedingGuide.title')}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('seedingGuide.subtitle')}
          </p>
        </div>

        {/* Important Notice */}
        <Card className="mb-8 border-l-4 border-orange-500 bg-orange-50">
          <div className="flex items-start space-x-3">
            <AlertCircle className="h-6 w-6 text-orange-600 mt-0.5" />
            <div>
              <h3 className="text-lg font-semibold text-orange-900 mb-2">
                Important Notice
              </h3>
              <p className="text-orange-800">
                Ensure your mobile number is registered with both your bank and Aadhaar. 
                This is mandatory for successful linking and receiving OTPs.
              </p>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Method Selection */}
          <div className="lg:col-span-1">
            <Card>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Choose Your Method
              </h2>
              <div className="space-y-3">
                {seedingMethods.map((method) => {
                  const IconComponent = method.icon;
                  return (
                    <button
                      key={method.id}
                      onClick={() => setActiveMethod(method.id)}
                      className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                        activeMethod === method.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${
                          activeMethod === method.id ? 'bg-blue-100' : 'bg-gray-100'
                        }`}>
                          <IconComponent className={`h-5 w-5 ${
                            activeMethod === method.id ? 'text-blue-600' : 'text-gray-600'
                          }`} />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">
                            {method.title}
                          </h3>
                          <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                            <span>{method.difficulty}</span>
                            <span>•</span>
                            <span>{method.time}</span>
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </Card>

            {/* Required Documents */}
            <Card className="mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Required Documents
              </h3>
              <ul className="space-y-2">
                {documents.map((doc, index) => (
                  <li key={index} className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-gray-700">{doc}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>

          {/* Step-by-Step Guide */}
          <div className="lg:col-span-2">
            <Card>
              <div className="flex items-center space-x-3 mb-6">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <currentMethod.icon className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    {currentMethod.title}
                  </h2>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>Difficulty: {currentMethod.difficulty}</span>
                    <span>•</span>
                    <span>Time: {currentMethod.time}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {currentMethod.steps.map((step, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-medium flex-shrink-0">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-700">{step}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="font-medium text-green-900">Success!</span>
                </div>
                <p className="text-green-800 mt-1">
                  Once completed, you'll receive a confirmation SMS. Your account will be 
                  DBT-enabled within 24-48 hours.
                </p>
              </div>
            </Card>
          </div>
        </div>

        {/* Video Tutorials */}
        <div className="mt-12">
          <Card>
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              Video Tutorials
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {videos.map((video) => (
                <div key={video.id} className="group cursor-pointer">
                  <div 
                    className="relative rounded-lg overflow-hidden"
                    onClick={() => handleVideoPlay(video)}
                  >
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
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
                  <h3 className="font-medium text-gray-900 mt-3 group-hover:text-blue-600 transition-colors">
                    {video.title}
                  </h3>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Download Resources */}
        <div className="mt-8">
          <Card>
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              Download Resources
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button variant="outline" icon={Download} className="justify-start">
                Aadhaar Seeding Form (PDF)
              </Button>
              <Button variant="outline" icon={Download} className="justify-start">
                Bank List for DBT (Excel)
              </Button>
              <Button variant="outline" icon={FileText} className="justify-start">
                Step-by-Step Guide (PDF)
              </Button>
              <Button variant="outline" icon={Download} className="justify-start">
                Troubleshooting Guide
              </Button>
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
        <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center">
          <div className="text-center text-white">
            <Play className="h-16 w-16 mx-auto mb-4 opacity-50" />
            <p>Video player would be embedded here</p>
            <p className="text-sm opacity-75 mt-2">Duration: {selectedVideo?.duration}</p>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default SeedingGuide;