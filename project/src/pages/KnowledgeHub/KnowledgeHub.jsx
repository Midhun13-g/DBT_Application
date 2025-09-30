import React, { useState, useEffect } from 'react';
import { BookOpen, Play, Star, Eye, Award, Filter, Search } from 'lucide-react';
import Card from '../../components/Card/Card';
import Button from '../../components/Button/Button';

const KnowledgeHub = () => {
  const [content, setContent] = useState([]);
  const [filters, setFilters] = useState({
    type: '',
    difficulty: '',
    language: 'en'
  });
  const [userProgress, setUserProgress] = useState({});

  const contentTypes = ['GUIDE', 'TUTORIAL', 'VIDEO', 'FAQ', 'ARTICLE'];
  const difficultyLevels = ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'];
  const languages = [
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'Hindi' },
    { code: 'ta', name: 'Tamil' }
  ];

  const typeIcons = {
    GUIDE: BookOpen,
    TUTORIAL: BookOpen,
    VIDEO: Play,
    FAQ: BookOpen,
    ARTICLE: BookOpen
  };

  const difficultyColors = {
    BEGINNER: 'bg-green-100 text-green-800',
    INTERMEDIATE: 'bg-yellow-100 text-yellow-800',
    ADVANCED: 'bg-red-100 text-red-800'
  };

  useEffect(() => {
    // Mock data
    setContent([
      {
        id: 1,
        title: 'Complete Guide to DBT Account Linking',
        content: 'Step-by-step instructions for linking your bank account with Aadhaar for DBT benefits.',
        type: 'GUIDE',
        difficulty: 'BEGINNER',
        language: 'en',
        rating: 4.8,
        viewCount: 1250,
        videoUrl: null,
        resourceUrl: '/guides/dbt-linking.pdf'
      },
      {
        id: 2,
        title: 'DBT Status Check Tutorial',
        content: 'Learn how to check your DBT status using multiple methods including online portal and mobile.',
        type: 'VIDEO',
        difficulty: 'BEGINNER',
        language: 'en',
        rating: 4.6,
        viewCount: 890,
        videoUrl: '/videos/dbt-status-check.mp4'
      },
      {
        id: 3,
        title: 'Advanced Scholarship Management',
        content: 'Comprehensive guide for managing multiple scholarship applications and tracking disbursements.',
        type: 'TUTORIAL',
        difficulty: 'ADVANCED',
        language: 'en',
        rating: 4.9,
        viewCount: 456,
        resourceUrl: '/tutorials/scholarship-management.pdf'
      }
    ]);

    setUserProgress({
      1: { completed: true, progressPercentage: 100, badgesEarned: ['DBT_EXPERT'] },
      2: { completed: false, progressPercentage: 60, badgesEarned: [] }
    });
  }, []);

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  const getBadgeColor = (badge) => {
    const colors = {
      DBT_EXPERT: 'bg-blue-100 text-blue-800',
      SCHOLARSHIP_MASTER: 'bg-purple-100 text-purple-800',
      QUICK_LEARNER: 'bg-green-100 text-green-800'
    };
    return colors[badge] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Knowledge Hub</h1>
          <p className="text-gray-600 mt-2">Learn, grow, and master DBT with our comprehensive resources</p>
        </div>

        {/* User Progress Summary */}
        <Card className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Your Learning Journey</h3>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <span>2 Guides Completed</span>
                <span>•</span>
                <span>1 Badge Earned</span>
                <span>•</span>
                <span>80% Progress</span>
              </div>
            </div>
            <div className="flex space-x-2">
              <div className="bg-blue-100 px-3 py-1 rounded-full">
                <Award className="h-4 w-4 text-blue-600 inline mr-1" />
                <span className="text-xs font-medium text-blue-800">DBT Expert</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Filters */}
        <Card className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search content..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={filters.type}
                onChange={(e) => setFilters({...filters, type: e.target.value})}
              >
                <option value="">All Types</option>
                {contentTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={filters.difficulty}
                onChange={(e) => setFilters({...filters, difficulty: e.target.value})}
              >
                <option value="">All Levels</option>
                {difficultyLevels.map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={filters.language}
                onChange={(e) => setFilters({...filters, language: e.target.value})}
              >
                {languages.map(lang => (
                  <option key={lang.code} value={lang.code}>{lang.name}</option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <Button variant="outline" icon={Filter} className="w-full">
                Apply Filters
              </Button>
            </div>
          </div>
        </Card>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {content.map((item) => {
            const IconComponent = typeIcons[item.type];
            const progress = userProgress[item.id];
            
            return (
              <Card key={item.id} className="h-full hover:shadow-lg transition-shadow duration-200">
                <div className="flex flex-col h-full">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <IconComponent className="h-5 w-5 text-blue-600" />
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${difficultyColors[item.difficulty]}`}>
                        {item.difficulty}
                      </span>
                    </div>
                    {progress?.completed && (
                      <Award className="h-5 w-5 text-green-600" />
                    )}
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600 mb-4 flex-1">{item.content}</p>

                  {/* Progress Bar */}
                  {progress && (
                    <div className="mb-4">
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>Progress</span>
                        <span>{progress.progressPercentage}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${progress.progressPercentage}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  {/* Badges */}
                  {progress?.badgesEarned?.length > 0 && (
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-1">
                        {progress.badgesEarned.map(badge => (
                          <span key={badge} className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getBadgeColor(badge)}`}>
                            <Award className="h-3 w-3 mr-1" />
                            {badge.replace('_', ' ')}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center space-x-1">
                      {renderStars(item.rating)}
                      <span className="ml-1">{item.rating}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Eye className="h-4 w-4" />
                      <span>{item.viewCount}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Button size="sm" className="w-full">
                      {progress?.completed ? 'Review' : 'Start Learning'}
                    </Button>
                    {item.resourceUrl && (
                      <Button variant="outline" size="sm" className="w-full">
                        Download Resource
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default KnowledgeHub;