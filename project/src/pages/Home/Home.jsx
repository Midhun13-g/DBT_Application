import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { 
  CheckCircle, 
  BookOpen, 
  Users, 
  Calendar,
  ArrowRight,
  Shield,
  Globe,
  Zap,
  Brain,
  AlertCircle
} from 'lucide-react';
import Card, { MetricCard } from '../../components/Card/Card';
import Button from '../../components/Button/Button';
import DBTQuiz from '../../components/Quiz/DBTQuiz';
import Chatbot from '../../components/Chatbot/Chatbot';
import RoleDashboard from '../../components/RoleDashboard/RoleDashboard';
import { useAuth } from '../../hooks/useAuth';

const Home = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [showQuiz, setShowQuiz] = useState(false);

  const getSchemeId = (title) => {
    const mapping = {
      'Pre-Matric Scholarship': 'pre-matric',
      'Post-Matric Scholarship': 'post-matric',
      'PM-KISAN Scheme': 'pm-kisan',
      'Pradhan Mantri Awas Yojana': 'pm-awas',
      'Ayushman Bharat': 'ayushman-bharat',
      'National Social Assistance Programme': 'nsap'
    };
    return mapping[title] || title.toLowerCase().replace(/\s+/g, '-');
  };

  const quickLinks = [
    {
      title: 'Notice Board',
      description: 'Latest announcements and updates',
      icon: CheckCircle,
      href: '/notice-board',
      color: 'blue'
    },
    {
      title: 'School Activities',
      description: 'Workshops, meetings, and events',
      icon: Users,
      href: '/school-activities',
      color: 'green'
    },
    {
      title: 'Community Events',
      description: 'Upcoming events and activities',
      icon: Calendar,
      href: '/events',
      color: 'purple'
    }
  ];

  const features = [
    {
      icon: Shield,
      title: 'Secure & Safe',
      description: 'Government-grade security for your data'
    },
    {
      icon: Globe,
      title: 'Multi-language',
      description: 'Available in English, Hindi, and Tamil'
    },
    {
      icon: Zap,
      title: 'Instant Status',
      description: 'Real-time DBT status verification'
    }
  ];

  const schemes = [
    {
      title: 'Pre-Matric Scholarship',
      description: 'Financial assistance for SC/ST/OBC students studying in classes I-X',
      eligibility: 'Students from SC/ST/OBC categories',
      amount: '₹1,000 - ₹5,700 per year',
      status: 'Active'
    },
    {
      title: 'Post-Matric Scholarship',
      description: 'Support for higher education for SC/ST/OBC students',
      eligibility: 'Students pursuing higher education',
      amount: '₹2,000 - ₹12,000 per year',
      status: 'Active'
    },
    {
      title: 'PM-KISAN Scheme',
      description: 'Income support to farmer families',
      eligibility: 'Small and marginal farmers',
      amount: '₹6,000 per year',
      status: 'Active'
    },
    {
      title: 'Pradhan Mantri Awas Yojana',
      description: 'Housing for all by 2022',
      eligibility: 'Economically weaker sections',
      amount: '₹1.2 - ₹2.5 lakh subsidy',
      status: 'Active'
    },
    {
      title: 'Ayushman Bharat',
      description: 'Health insurance coverage',
      eligibility: 'Poor and vulnerable families',
      amount: '₹5 lakh per family per year',
      status: 'Active'
    },
    {
      title: 'National Social Assistance Programme',
      description: 'Social security for elderly, widows, and disabled',
      eligibility: 'BPL families',
      amount: '₹200 - ₹1,000 per month',
      status: 'Active'
    }
  ];

  const stats = [
    { title: 'Citizens Served', value: '1.2M+', subtitle: 'Across India' },
    { title: 'Banks Connected', value: '150+', subtitle: 'Major banks' },
    { title: 'Success Rate', value: '98%', subtitle: 'DBT linking' },
    { title: 'Support Centers', value: '500+', subtitle: 'Nationwide' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <section className="relative px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
              {t('home.title')}
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-xl text-gray-600">
              {t('home.subtitle')}
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/dbt-check">
                <Button size="lg" icon={CheckCircle}>
                  Check DBT Status
                </Button>
              </Link>
              <Link to="/seeding-guide">
                <Button variant="outline" size="lg" icon={BookOpen}>
                  View Guide
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Decorative background */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute left-[50%] top-0 ml-[-30rem] h-[50rem] w-[81.25rem] bg-gradient-to-r from-blue-300/20 to-indigo-400/20 rotate-[-60deg] blur-3xl" />
        </div>
      </section>

      {/* DBT Aadhaar Seeding Section */}
      <section className="px-4 py-12 sm:px-6 lg:px-8 bg-white">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              What is DBT Aadhaar Seeding?
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              A simple process to link your Aadhaar with your bank account for direct benefit transfer
            </p>
          </div>

          <div className="mb-8">
            <img 
              src="https://soft-techsolutions.com/assets/img/Banner-of-aadhaar-deeding.png" 
              alt="DBT Aadhaar Seeding Process" 
              className="w-full rounded-lg"
            />
          </div>

          {/* Simple Content Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card className="p-4 text-center">
              <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Link Aadhaar</h4>
              <p className="text-gray-600 text-sm">Connect your Aadhaar with bank account</p>
            </Card>
            
            <Card className="p-4 text-center">
              <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Direct Transfer</h4>
              <p className="text-gray-600 text-sm">Get benefits directly in your account</p>
            </Card>
            
            <Card className="p-4 text-center">
              <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <Zap className="h-6 w-6 text-purple-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Secure & Fast</h4>
              <p className="text-gray-600 text-sm">Safe transfers within 24-48 hours</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Public Awareness Cards */}
      <section className="px-4 py-16 sm:px-6 lg:px-8 bg-white">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Latest Updates & Announcements
            </h2>
            <p className="text-xl text-gray-600">
              Stay informed with the latest news and important notices
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-l-4 border-blue-500">
              <div className="flex items-start space-x-3">
                <div className="bg-blue-500 p-2 rounded-full">
                  <Calendar className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Upcoming Workshop</h3>
                  <p className="text-sm text-gray-600 mb-2">DBT Awareness Camp - March 15, 2024</p>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    High Priority
                  </span>
                </div>
              </div>
            </Card>

            <Card className="bg-gradient-to-r from-green-50 to-green-100 border-l-4 border-green-500">
              <div className="flex items-start space-x-3">
                <div className="bg-green-500 p-2 rounded-full">
                  <CheckCircle className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">New Scholarship Scheme</h3>
                  <p className="text-sm text-gray-600 mb-2">Applications open for Merit Scholarship 2024</p>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    New
                  </span>
                </div>
              </div>
            </Card>

            <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-l-4 border-purple-500">
              <div className="flex items-start space-x-3">
                <div className="bg-purple-500 p-2 rounded-full">
                  <AlertCircle className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Important Notice</h3>
                  <p className="text-sm text-gray-600 mb-2">Deadline extension for DBT linking - March 31</p>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                    Urgent
                  </span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Quick Links Section */}
      <section className="px-4 py-16 sm:px-6 lg:px-8 bg-gray-50">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Quick Access Portal
            </h2>
            <p className="text-xl text-gray-600">
              Access all services and information in one place
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quickLinks.map((link) => {
              const IconComponent = link.icon;
              const colorClasses = {
                blue: 'border-blue-500 bg-blue-100 text-blue-600 group-hover:bg-blue-200',
                green: 'border-green-500 bg-green-100 text-green-600 group-hover:bg-green-200',
                purple: 'border-purple-500 bg-purple-100 text-purple-600 group-hover:bg-purple-200',
                orange: 'border-orange-500 bg-orange-100 text-orange-600 group-hover:bg-orange-200',
                indigo: 'border-indigo-500 bg-indigo-100 text-indigo-600 group-hover:bg-indigo-200',
                pink: 'border-pink-500 bg-pink-100 text-pink-600 group-hover:bg-pink-200'
              };
              
              return (
                <Link 
                  key={link.title} 
                  to={link.href}
                  className="block group"
                >
                  <Card 
                    hover 
                    className={`h-full border-t-4 ${colorClasses[link.color].split(' ')[0]} group-hover:shadow-lg transition-all duration-200`}
                  >
                    <div className="text-center">
                      <div className={`${colorClasses[link.color]} transition-colors duration-200 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4`}>
                        <IconComponent className="h-8 w-8" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {link.title}
                      </h3>
                      <p className="text-gray-600 mb-4">
                        {link.description}
                      </p>
                      <div className={`flex items-center justify-center ${colorClasses[link.color].split(' ')[2]} group-hover:${colorClasses[link.color].split(' ')[2].replace('600', '700')}`}>
                        <span className="text-sm font-medium">Access Now</span>
                        <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 py-16 sm:px-6 lg:px-8 bg-gray-50">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose DBT Portal?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature) => {
              const IconComponent = feature.icon;
              return (
                <div key={feature.title} className="text-center">
                  <div className="bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="px-4 py-16 sm:px-6 lg:px-8 bg-blue-600">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat) => (
              <div key={stat.title} className="text-center text-white">
                <div className="text-4xl font-bold mb-2">{stat.value}</div>
                <div className="text-xl font-medium mb-1">{stat.title}</div>
                <div className="text-blue-200">{stat.subtitle}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Government Schemes Section */}
      <section className="px-4 py-16 sm:px-6 lg:px-8 bg-white">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Government Schemes
            </h2>
            <p className="text-xl text-gray-600">
              Explore various government schemes and benefits available through DBT
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {schemes.map((scheme, index) => (
              <Card key={index} className="h-full hover:shadow-lg transition-shadow duration-200">
                <div className="flex flex-col h-full">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-semibold text-gray-900 flex-1">
                      {scheme.title}
                    </h3>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 ml-2">
                      {scheme.status}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-4 flex-1">
                    {scheme.description}
                  </p>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">Eligibility: </span>
                      <span className="text-gray-600">{scheme.eligibility}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Amount: </span>
                      <span className="text-green-600 font-semibold">{scheme.amount}</span>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <Link to={`/schemes/${getSchemeId(scheme.title)}`}>
                      <Button variant="outline" size="sm" className="w-full">
                        Learn More
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* DBT Quiz Section */}
      <section className="px-4 py-16 sm:px-6 lg:px-8 bg-gray-50">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Test Your DBT Knowledge
            </h2>
            <p className="text-xl text-gray-600">
              Take our interactive quiz to learn more about Direct Benefit Transfer
            </p>
          </div>

          {!showQuiz ? (
            <div className="text-center">
              <Card padding="xl" className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 max-w-2xl mx-auto">
                <Brain className="h-16 w-16 text-purple-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  DBT Knowledge Quiz
                </h3>
                <p className="text-lg text-gray-600 mb-6">
                  Test your understanding of DBT with 5 quick questions. Learn while you play!
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" icon={Brain} onClick={() => setShowQuiz(true)}>
                    Start Quiz
                  </Button>
                  <Button variant="outline" size="lg">
                    Learn More About DBT
                  </Button>
                </div>
              </Card>
            </div>
          ) : (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900">DBT Knowledge Quiz</h3>
                <Button variant="outline" onClick={() => setShowQuiz(false)}>
                  Close Quiz
                </Button>
              </div>
              <DBTQuiz />
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-16 sm:px-6 lg:px-8 bg-white">
        <div className="mx-auto max-w-4xl text-center">
          <Card padding="xl" className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Ready to Check Your DBT Status?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Get started in seconds with your Aadhaar details and account information.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/dbt-check">
                <Button size="lg" icon={CheckCircle}>
                  Check Status Now
                </Button>
              </Link>
              <Link to="/camp-booking">
                <Button variant="outline" size="lg" icon={Calendar}>
                  Book Assistance
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </section>
      
      {/* Chatbot */}
      <Chatbot />
    </div>
  );
};

export default Home;