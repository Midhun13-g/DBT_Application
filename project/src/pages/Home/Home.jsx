import React from 'react';
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
  Zap
} from 'lucide-react';
import Card, { MetricCard } from '../../components/Card/Card';
import Button from '../../components/Button/Button';

const Home = () => {
  const { t } = useTranslation();

  const quickLinks = [
    {
      title: t('home.checkStatus'),
      description: 'Verify your DBT linking status',
      icon: CheckCircle,
      href: '/dbt-check',
      color: 'blue'
    },
    {
      title: t('home.seedingGuide'),
      description: 'Step-by-step account linking guide',
      icon: BookOpen,
      href: '/seeding-guide',
      color: 'green'
    },
    {
      title: t('home.awareness'),
      description: 'Learn about DBT benefits',
      icon: Users,
      href: '/awareness',
      color: 'purple'
    },
    {
      title: t('home.bookCamp'),
      description: 'Get expert assistance',
      icon: Calendar,
      href: '/camp-booking',
      color: 'orange'
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

      {/* Quick Links Section */}
      <section className="px-4 py-16 sm:px-6 lg:px-8 bg-white">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {t('home.quickLinks')}
            </h2>
            <p className="text-xl text-gray-600">
              {t('home.welcomeMessage')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickLinks.map((link) => {
              const IconComponent = link.icon;
              return (
                <Link 
                  key={link.title} 
                  to={link.href}
                  className="block group"
                >
                  <Card 
                    hover 
                    className="h-full border-t-4 border-blue-500 group-hover:border-blue-600 transition-all duration-200"
                  >
                    <div className="text-center">
                      <div className="bg-blue-100 group-hover:bg-blue-200 transition-colors duration-200 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <IconComponent className="h-8 w-8 text-blue-600" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {link.title}
                      </h3>
                      <p className="text-gray-600 mb-4">
                        {link.description}
                      </p>
                      <div className="flex items-center justify-center text-blue-600 group-hover:text-blue-700">
                        <span className="text-sm font-medium">Learn more</span>
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
    </div>
  );
};

export default Home;