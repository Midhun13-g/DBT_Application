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
      title: 'UIDAI Official Guide',
      duration: '4:32',
      thumbnail: 'https://img.youtube.com/vi/0-Z99j3RwBY/maxresdefault.jpg',
      url: 'https://www.youtube.com/embed/0-Z99j3RwBY',
      description: 'Official UIDAI Aadhaar guidance and procedures'
    },
    {
      id: 2,
      title: 'Net Banking Aadhaar Linking - SBI',
      duration: '3:45',
      thumbnail: 'https://img.youtube.com/vi/rUBGa76gYsw/maxresdefault.jpg',
      url: 'https://www.youtube.com/embed/rUBGa76gYsw',
      description: 'Complete guide for SBI net banking Aadhaar linking'
    },
    {
      id: 3,
      title: 'Branch Visit Complete Guide',
      duration: '5:20',
      thumbnail: 'https://img.youtube.com/vi/Pbz-nGsYOAs/maxresdefault.jpg',
      url: 'https://www.youtube.com/embed/Pbz-nGsYOAs',
      description: 'What to expect during branch visit and required documents'
    },
    {
      id: 4,
      title: 'Understanding DBT',
      duration: '6:15',
      thumbnail: 'https://img.youtube.com/vi/umYJLxMLZ9E/maxresdefault.jpg',
      url: 'https://www.youtube.com/embed/umYJLxMLZ9E',
      description: 'Complete understanding of Direct Benefit Transfer system'
    },
    {
      id: 5,
      title: 'Aadhaar Seeding Awareness - Part 1',
      duration: '4:30',
      thumbnail: 'https://img.youtube.com/vi/gjPkUF23UTg/maxresdefault.jpg',
      url: 'https://www.youtube.com/embed/gjPkUF23UTg',
      description: 'Government awareness program on Aadhaar seeding'
    },
    {
      id: 6,
      title: 'Aadhaar Seeding Awareness - Part 2',
      duration: '3:45',
      thumbnail: 'https://img.youtube.com/vi/PQ2rO7BDE9c/maxresdefault.jpg',
      url: 'https://www.youtube.com/embed/PQ2rO7BDE9c',
      description: 'Advanced Aadhaar seeding awareness and best practices'
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                  <div className="mt-3">
                    <h3 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                      {video.title}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">{video.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Download Resources */}
        <div className="mt-8">
          <Card>
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              Download Bank Forms & Resources
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Button variant="outline" icon={FileText} className="justify-start w-full" onClick={() => {
                const link = document.createElement('a');
                link.href = 'https://www.npci.org.in/PDF/nach/faqs/apbs-customer/Aadhaar-seeding-process.pdf';
                link.target = '_blank';
                link.rel = 'noopener noreferrer';
                link.click();
              }}>
                <div className="text-left">
                  <div className="font-medium">NPCI Aadhaar Seeding Guide</div>
                  <div className="text-xs text-gray-500">Official NPCI process guide (PDF)</div>
                </div>
              </Button>
              
              <Button variant="outline" icon={FileText} className="justify-start w-full" onClick={() => {
                const pdfContent = `
AADHAAR SEEDING APPLICATION FORM

Name: _________________________
Aadhaar Number: _______________
Bank Account Number: __________
IFSC Code: ___________________
Mobile Number: _______________

I hereby request to link my Aadhaar number with my bank account for DBT services.

Signature: ___________________
Date: _______________________
`;
                const blob = new Blob([pdfContent], { type: 'text/plain' });
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = 'Aadhaar_Seeding_Application_Form.txt';
                link.click();
                URL.revokeObjectURL(url);
              }}>
                <div className="text-left">
                  <div className="font-medium">Aadhaar Seeding Form</div>
                  <div className="text-xs text-gray-500">Bank linking application (PDF)</div>
                </div>
              </Button>
              
              <Button variant="outline" icon={FileText} className="justify-start w-full" onClick={() => {
                const link = document.createElement('a');
                link.href = 'data:application/pdf;base64,sample';
                link.download = 'Aadhaar_Seeding_Checklist.pdf';
                link.click();
              }}>
                <div className="text-left">
                  <div className="font-medium">Seeding Checklist</div>
                  <div className="text-xs text-gray-500">Step-by-step guide (PDF)</div>
                </div>
              </Button>
              
              <Button variant="outline" icon={FileText} className="justify-start w-full" onClick={() => {
                const link = document.createElement('a');
                link.href = 'https://www.pvgcoenashik.org/wp-content/uploads/2019/04/pvgcoen_aadhar_link.pdf';
                link.target = '_blank';
                link.rel = 'noopener noreferrer';
                link.click();
              }}>
                <div className="text-left">
                  <div className="font-medium">PVGCOE Aadhaar Link Guide</div>
                  <div className="text-xs text-gray-500">College Aadhaar linking guide (PDF)</div>
                </div>
              </Button>
              
              <Button variant="outline" icon={FileText} className="justify-start w-full" onClick={() => {
                const link = document.createElement('a');
                link.href = 'https://tinpan.proteantech.in/downloads/Aadhaar_Seeding_Request_Form.pdf';
                link.target = '_blank';
                link.rel = 'noopener noreferrer';
                link.click();
              }}>
                <div className="text-left">
                  <div className="font-medium">Aadhaar Seeding Request Form</div>
                  <div className="text-xs text-gray-500">Official seeding request form (PDF)</div>
                </div>
              </Button>
              
              <Button variant="outline" icon={FileText} className="justify-start w-full" onClick={() => {
                const link = document.createElement('a');
                link.href = 'data:application/pdf;base64,sample';
                link.download = 'Required_Documents_List.pdf';
                link.click();
              }}>
                <div className="text-left">
                  <div className="font-medium">Documents List</div>
                  <div className="text-xs text-gray-500">Required documents (PDF)</div>
                </div>
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
        size="xl"
      >
        <div className="space-y-4">
          <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden">
            {selectedVideo?.url ? (
              <iframe
                src={selectedVideo.url}
                title={selectedVideo.title}
                className="w-full h-full"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <div className="flex items-center justify-center h-full text-center text-white">
                <div>
                  <Play className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p>Video player would be embedded here</p>
                  <p className="text-sm opacity-75 mt-2">Duration: {selectedVideo?.duration}</p>
                </div>
              </div>
            )}
          </div>
          {selectedVideo?.description && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">About this video</h4>
              <p className="text-gray-700">{selectedVideo.description}</p>
              <div className="flex items-center space-x-4 mt-3 text-sm text-gray-600">
                <span>Duration: {selectedVideo.duration}</span>
                <span>•</span>
                <span>Official Government Video</span>
              </div>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default SeedingGuide;