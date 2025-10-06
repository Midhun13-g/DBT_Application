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
import noticeService from '../../services/noticeService';
import eventBus from '../../services/eventBus';

const Home = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [showQuiz, setShowQuiz] = useState(false);
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    loadNotices();
    
    // Subscribe to real-time updates
    const unsubscribe = eventBus.on('notices-updated', () => {
      console.log('Home received notice update');
      loadNotices();
    });
    
    return unsubscribe;
  }, []);

  const loadNotices = () => {
    try {
      // Initialize dummy data and get notices
      noticeService.initializeDummyData();
      const noticeData = noticeService.getNoticesFromStorage();
      
      // Get top 3 active notices for display
      const activeNotices = noticeData
        .filter(notice => notice.isActive)
        .sort((a, b) => {
          // Sort by priority first, then by date
          const priorityOrder = { URGENT: 4, HIGH: 3, MEDIUM: 2, LOW: 1 };
          if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
            return priorityOrder[b.priority] - priorityOrder[a.priority];
          }
          return new Date(b.createdAt) - new Date(a.createdAt);
        })
        .slice(0, 3);
      
      setNotices(activeNotices);
    } catch (error) {
      console.error('Error loading notices:', error);
    } finally {
      setLoading(false);
    }
  };

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
      title: t('sections.quickAccess.noticeBoard.title'),
      description: t('sections.quickAccess.noticeBoard.description'),
      icon: CheckCircle,
      href: '/notice-board',
      color: 'blue'
    },
    {
      title: t('sections.quickAccess.schoolActivities.title'),
      description: t('sections.quickAccess.schoolActivities.description'),
      icon: Users,
      href: '/school-activities',
      color: 'green'
    },
    {
      title: t('sections.quickAccess.communityEvents.title'),
      description: t('sections.quickAccess.communityEvents.description'),
      icon: Calendar,
      href: '/events',
      color: 'purple'
    }
  ];

  const features = [
    {
      icon: Shield,
      title: t('sections.features.secure.title'),
      description: t('sections.features.secure.description')
    },
    {
      icon: Globe,
      title: t('sections.features.multilingual.title'),
      description: t('sections.features.multilingual.description')
    },
    {
      icon: Zap,
      title: t('sections.features.instantStatus.title'),
      description: t('sections.features.instantStatus.description')
    }
  ];

  const schemes = [
    {
      title: t('sections.schemes.preMatric.title'),
      description: t('sections.schemes.preMatric.description'),
      eligibility: t('sections.schemes.preMatric.eligibility'),
      amount: t('sections.schemes.preMatric.amount'),
      status: t('sections.schemes.status')
    },
    {
      title: t('sections.schemes.postMatric.title'),
      description: t('sections.schemes.postMatric.description'),
      eligibility: t('sections.schemes.postMatric.eligibility'),
      amount: t('sections.schemes.postMatric.amount'),
      status: t('sections.schemes.status')
    },
    {
      title: t('sections.schemes.pmKisan.title'),
      description: t('sections.schemes.pmKisan.description'),
      eligibility: t('sections.schemes.pmKisan.eligibility'),
      amount: t('sections.schemes.pmKisan.amount'),
      status: t('sections.schemes.status')
    },
    {
      title: t('sections.schemes.pmAwas.title'),
      description: t('sections.schemes.pmAwas.description'),
      eligibility: t('sections.schemes.pmAwas.eligibility'),
      amount: t('sections.schemes.pmAwas.amount'),
      status: t('sections.schemes.status')
    },
    {
      title: t('sections.schemes.ayushman.title'),
      description: t('sections.schemes.ayushman.description'),
      eligibility: t('sections.schemes.ayushman.eligibility'),
      amount: t('sections.schemes.ayushman.amount'),
      status: t('sections.schemes.status')
    },
    {
      title: t('sections.schemes.nsap.title'),
      description: t('sections.schemes.nsap.description'),
      eligibility: t('sections.schemes.nsap.eligibility'),
      amount: t('sections.schemes.nsap.amount'),
      status: t('sections.schemes.status')
    }
  ];

  const stats = [
    { title: t('sections.stats.citizensServed'), value: t('sections.stats.citizensServedValue'), subtitle: t('sections.stats.citizensServedSubtitle') },
    { title: t('sections.stats.banksConnected'), value: t('sections.stats.banksConnectedValue'), subtitle: t('sections.stats.banksConnectedSubtitle') },
    { title: t('sections.stats.successRate'), value: t('sections.stats.successRateValue'), subtitle: t('sections.stats.successRateSubtitle') },
    { title: t('sections.stats.supportCenters'), value: t('sections.stats.supportCentersValue'), subtitle: t('sections.stats.supportCentersSubtitle') }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <section className="relative px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
              {t('portal.mainTitle')}
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-xl text-gray-600">
              {t('home.subtitle')}
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/dbt-check">
                <Button size="lg" icon={CheckCircle}>
                  {t('home.checkStatus')}
                </Button>
              </Link>
              <Link to="/seeding-guide">
                <Button variant="outline" size="lg" icon={BookOpen}>
                  {t('common.viewGuide')}
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

      {/* DBT vs Aadhaar Seeding Section */}
      <section className="px-4 py-12 sm:px-6 lg:px-8 bg-white">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {t('sections.dbtVsAadhaar.title')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-6">
              <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
                <h3 className="text-lg font-semibold text-blue-900 mb-2">{t('sections.dbtVsAadhaar.dbtTitle')}</h3>
                <p className="text-gray-700">{t('sections.dbtVsAadhaar.dbtDescription')}</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
                <h3 className="text-lg font-semibold text-green-900 mb-2">{t('sections.dbtVsAadhaar.aadhaarTitle')}</h3>
                <p className="text-gray-700">{t('sections.dbtVsAadhaar.aadhaarDescription')}</p>
              </div>
            </div>
            <img 
              src="https://soft-techsolutions.com/assets/img/Banner-of-aadhaar-deeding.png" 
              alt="DBT Aadhaar Seeding Process" 
              className="w-full rounded-lg mix-blend-multiply opacity-90 bg-white p-4"
            />
          </div>

          {/* Simple Content Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card className="p-4 text-center">
              <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">{t('sections.dbtVsAadhaar.linkAadhaar')}</h4>
              <p className="text-gray-600 text-sm">{t('sections.dbtVsAadhaar.linkAadhaarDesc')}</p>
            </Card>
            
            <Card className="p-4 text-center">
              <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">{t('sections.dbtVsAadhaar.directTransfer')}</h4>
              <p className="text-gray-600 text-sm">{t('sections.dbtVsAadhaar.directTransferDesc')}</p>
            </Card>
            
            <Card className="p-4 text-center">
              <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <Zap className="h-6 w-6 text-purple-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">{t('sections.dbtVsAadhaar.secureFast')}</h4>
              <p className="text-gray-600 text-sm">{t('sections.dbtVsAadhaar.secureFastDesc')}</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Public Awareness Cards */}
      <section className="px-4 py-16 sm:px-6 lg:px-8 bg-white">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {t('sections.updates.title')}
            </h2>
            <p className="text-xl text-gray-600">
              {t('sections.updates.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {loading ? (
              Array.from({ length: 3 }).map((_, index) => (
                <Card key={index} className="animate-pulse">
                  <div className="flex items-start space-x-3">
                    <div className="bg-gray-300 w-10 h-10 rounded-full"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-300 rounded mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded mb-2"></div>
                      <div className="h-6 bg-gray-200 rounded w-20"></div>
                    </div>
                  </div>
                </Card>
              ))
            ) : notices.length > 0 ? (
              notices.map((notice, index) => {
                const getNoticeColor = (priority) => {
                  switch (priority) {
                    case 'URGENT': return { bg: 'from-red-50 to-red-100', border: 'border-red-500', iconBg: 'bg-red-500', badgeBg: 'bg-red-100 text-red-800' };
                    case 'HIGH': return { bg: 'from-orange-50 to-orange-100', border: 'border-orange-500', iconBg: 'bg-orange-500', badgeBg: 'bg-orange-100 text-orange-800' };
                    case 'MEDIUM': return { bg: 'from-blue-50 to-blue-100', border: 'border-blue-500', iconBg: 'bg-blue-500', badgeBg: 'bg-blue-100 text-blue-800' };
                    default: return { bg: 'from-green-50 to-green-100', border: 'border-green-500', iconBg: 'bg-green-500', badgeBg: 'bg-green-100 text-green-800' };
                  }
                };
                
                const getNoticeIcon = (type) => {
                  switch (type) {
                    case 'CAMP': return Calendar;
                    case 'DEADLINE': return AlertCircle;
                    case 'SCHOLARSHIP': return CheckCircle;
                    default: return Calendar;
                  }
                };
                
                const colors = getNoticeColor(notice.priority);
                const IconComponent = getNoticeIcon(notice.type);
                
                return (
                  <Link key={notice.id} to="/notice-board" className="block">
                    <Card className={`bg-gradient-to-r ${colors.bg} border-l-4 ${colors.border} hover:shadow-lg transition-shadow cursor-pointer`}>
                      <div className="flex items-start space-x-3">
                        <div className={`${colors.iconBg} p-2 rounded-full`}>
                          <IconComponent className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-1">{notice.title}</h3>
                          <p className="text-sm text-gray-600 mb-2">
                            {notice.content.length > 60 ? `${notice.content.substring(0, 60)}...` : notice.content}
                          </p>
                          <div className="flex items-center justify-between">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${colors.badgeBg}`}>
                              {notice.priority}
                            </span>
                            {notice.eventDate && (
                              <span className="text-xs text-gray-500">
                                {new Date(notice.eventDate).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </Card>
                  </Link>
                );
              })
            ) : (
              <Card className="col-span-3 text-center py-8">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">{t('common.noNoticesAvailable')}</h3>
                <p className="text-gray-600">{t('common.checkBackLater')}</p>
                <Link to="/notice-board">
                  <Button variant="outline" className="mt-4">
                    {t('common.viewNoticeBoard')}
                  </Button>
                </Link>
              </Card>
            )}

          </div>
        </div>
      </section>

      {/* Quick Links Section */}
      <section className="px-4 py-16 sm:px-6 lg:px-8 bg-gray-50">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {t('sections.quickAccess.title')}
            </h2>
            <p className="text-xl text-gray-600">
              {t('sections.quickAccess.subtitle')}
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
                        <span className="text-sm font-medium">{t('common.accessNow')}</span>
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
              {t('sections.features.title')}
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
              {t('sections.schemes.title')}
            </h2>
            <p className="text-xl text-gray-600">
              {t('sections.schemes.subtitle')}
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
                      <span className="font-medium text-gray-700">{t('sections.schemes.eligibility')} </span>
                      <span className="text-gray-600">{scheme.eligibility}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">{t('sections.schemes.amount')} </span>
                      <span className="text-green-600 font-semibold">{scheme.amount}</span>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <Link to={`/schemes/${getSchemeId(scheme.title)}`}>
                      <Button variant="outline" size="sm" className="w-full">
                        {t('common.learnMore')}
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
              {t('sections.quiz.title')}
            </h2>
            <p className="text-xl text-gray-600">
              {t('sections.quiz.subtitle')}
            </p>
          </div>

          {!showQuiz ? (
            <div className="text-center">
              <Card padding="xl" className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 max-w-2xl mx-auto">
                <Brain className="h-16 w-16 text-purple-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {t('sections.quiz.cardTitle')}
                </h3>
                <p className="text-lg text-gray-600 mb-6">
                  {t('sections.quiz.cardDescription')}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" icon={Brain} onClick={() => setShowQuiz(true)}>
                    {t('common.startQuiz')}
                  </Button>
                  <Button variant="outline" size="lg">
                    {t('sections.quiz.learnMoreAboutDBT')}
                  </Button>
                </div>
              </Card>
            </div>
          ) : (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900">DBT Knowledge Quiz</h3>
                <Button variant="outline" onClick={() => setShowQuiz(false)}>
                  {t('common.closeQuiz')}
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
              {t('sections.cta.title')}
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              {t('sections.cta.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/dbt-check">
                <Button size="lg" icon={CheckCircle}>
                  {t('common.checkStatusNow')}
                </Button>
              </Link>
              <Link to="/events">
                <Button variant="outline" size="lg" icon={Calendar}>
                  {t('common.communityEvents')}
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