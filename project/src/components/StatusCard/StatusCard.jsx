import React from 'react';
import { CheckCircle, AlertCircle, XCircle, Clock } from 'lucide-react';

const StatusCard = ({ status, title, description, lastChecked, showActions = true, onRecheck, onGetHelp }) => {
  const getStatusConfig = (status) => {
    switch (status) {
      case 'ENABLED':
        return {
          icon: CheckCircle,
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          iconColor: 'text-green-600',
          titleColor: 'text-green-800',
          badge: 'bg-green-100 text-green-800'
        };
      case 'LINKED_NOT_ENABLED':
        return {
          icon: AlertCircle,
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
          iconColor: 'text-yellow-600',
          titleColor: 'text-yellow-800',
          badge: 'bg-yellow-100 text-yellow-800'
        };
      case 'NOT_LINKED':
        return {
          icon: XCircle,
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          iconColor: 'text-red-600',
          titleColor: 'text-red-800',
          badge: 'bg-red-100 text-red-800'
        };
      default:
        return {
          icon: Clock,
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200',
          iconColor: 'text-gray-600',
          titleColor: 'text-gray-800',
          badge: 'bg-gray-100 text-gray-800'
        };
    }
  };

  const config = getStatusConfig(status);
  const Icon = config.icon;

  return (
    <div className={`${config.bgColor} ${config.borderColor} border-2 rounded-lg p-6`}>
      <div className="flex items-start space-x-4">
        <div className={`${config.iconColor} flex-shrink-0`}>
          <Icon className="h-8 w-8" />
        </div>
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <h3 className={`text-lg font-semibold ${config.titleColor}`}>
              {title}
            </h3>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.badge}`}>
              {status.replace('_', ' ')}
            </span>
          </div>
          <p className="text-gray-700 mb-3">{description}</p>
          {lastChecked && (
            <p className="text-sm text-gray-500 mb-4">
              Last checked: {new Date(lastChecked).toLocaleString()}
            </p>
          )}
          {showActions && (
            <div className="flex space-x-3">
              {onRecheck && (
                <button
                  onClick={onRecheck}
                  className="text-sm font-medium text-blue-600 hover:text-blue-500"
                >
                  Check Again
                </button>
              )}
              {onGetHelp && status !== 'ENABLED' && (
                <button
                  onClick={onGetHelp}
                  className="text-sm font-medium text-blue-600 hover:text-blue-500"
                >
                  Get Help
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatusCard;