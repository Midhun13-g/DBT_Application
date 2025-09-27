import React from 'react';

const Card = ({ 
  children, 
  className = '', 
  padding = 'md', 
  shadow = 'md', 
  hover = false,
  border = false,
  ...props 
}) => {
  const paddingClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-10'
  };

  const shadowClasses = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl'
  };

  return (
    <div
      className={`
        bg-white rounded-lg
        ${paddingClasses[padding]}
        ${shadowClasses[shadow]}
        ${hover ? 'hover:shadow-lg transition-shadow duration-200' : ''}
        ${border ? 'border border-gray-200' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
};

// Card components for specific use cases
export const StatusCard = ({ status, title, description, icon: Icon, color = 'blue' }) => {
  const colorClasses = {
    blue: 'border-blue-200 bg-blue-50',
    green: 'border-green-200 bg-green-50',
    yellow: 'border-yellow-200 bg-yellow-50',
    red: 'border-red-200 bg-red-50'
  };

  const iconColorClasses = {
    blue: 'text-blue-600',
    green: 'text-green-600',
    yellow: 'text-yellow-600',
    red: 'text-red-600'
  };

  return (
    <Card className={`border-l-4 ${colorClasses[color]}`} border>
      <div className="flex items-start space-x-3">
        {Icon && (
          <Icon className={`h-6 w-6 mt-0.5 ${iconColorClasses[color]}`} />
        )}
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
          <p className="text-gray-700 mb-3">{description}</p>
          {status && (
            <div className="text-sm text-gray-600 bg-white px-3 py-1 rounded-full inline-block">
              Status: {status}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export const MetricCard = ({ title, value, subtitle, icon: Icon, trend, trendValue }) => {
  const trendColorClass = trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-gray-600';

  return (
    <Card hover>
      <div className="flex items-center">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          {subtitle && (
            <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
          )}
          {trendValue && (
            <p className={`text-sm mt-2 ${trendColorClass}`}>
              {trend === 'up' ? '↑' : trend === 'down' ? '↓' : ''} {trendValue}
            </p>
          )}
        </div>
        {Icon && (
          <div className="bg-blue-100 p-3 rounded-lg">
            <Icon className="h-6 w-6 text-blue-600" />
          </div>
        )}
      </div>
    </Card>
  );
};

export default Card;