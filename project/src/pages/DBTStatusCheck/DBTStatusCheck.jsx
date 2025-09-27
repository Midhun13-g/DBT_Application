import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  CheckCircle, 
  AlertCircle, 
  XCircle, 
  FileText, 
  Calendar,
  ArrowRight
} from 'lucide-react';
import Card, { StatusCard } from '../../components/Card/Card';
import Button from '../../components/Button/Button';
import Loader from '../../components/Loader/Loader';
import { useDBTStatus } from '../../hooks/useDBTStatus';
import { DBT_STATUS } from '../../utils/constants';
import { validateAadhaar, validateApplicationId } from '../../utils/helpers';

const DBTStatusCheck = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { checkDBTStatus, loading, currentStatus } = useDBTStatus();
  
  const [formData, setFormData] = useState({
    aadhaarDigits: '',
    applicationId: ''
  });
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value.toUpperCase()
    }));
    
    // Clear errors when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.aadhaarDigits) {
      newErrors.aadhaarDigits = 'Please enter last 4 digits of Aadhaar';
    } else if (!validateAadhaar(formData.aadhaarDigits)) {
      newErrors.aadhaarDigits = 'Please enter valid 4 digits';
    }
    
    if (!formData.applicationId) {
      newErrors.applicationId = 'Please enter Application ID or Account Number';
    } else if (!validateApplicationId(formData.applicationId)) {
      newErrors.applicationId = 'Please enter a valid ID (8-12 characters)';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      await checkDBTStatus(formData.aadhaarDigits, formData.applicationId);
    } catch (error) {
      setErrors({ submit: 'Failed to check status. Please try again.' });
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case DBT_STATUS.ENABLED:
        return CheckCircle;
      case DBT_STATUS.LINKED_NOT_ENABLED:
        return AlertCircle;
      case DBT_STATUS.NOT_LINKED:
        return XCircle;
      default:
        return FileText;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case DBT_STATUS.ENABLED:
        return 'green';
      case DBT_STATUS.LINKED_NOT_ENABLED:
        return 'yellow';
      case DBT_STATUS.NOT_LINKED:
        return 'red';
      default:
        return 'blue';
    }
  };

  const getStatusTitle = (status) => {
    switch (status) {
      case DBT_STATUS.ENABLED:
        return t('dbtCheck.statusEnabled');
      case DBT_STATUS.LINKED_NOT_ENABLED:
        return t('dbtCheck.statusLinkedNotEnabled');
      case DBT_STATUS.NOT_LINKED:
        return t('dbtCheck.statusNotLinked');
      default:
        return 'Unknown Status';
    }
  };

  const getStatusMessage = (status) => {
    switch (status) {
      case DBT_STATUS.ENABLED:
        return t('dbtCheck.enabledMessage');
      case DBT_STATUS.LINKED_NOT_ENABLED:
        return t('dbtCheck.linkedMessage');
      case DBT_STATUS.NOT_LINKED:
        return t('dbtCheck.notLinkedMessage');
      default:
        return 'Status could not be determined.';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {t('dbtCheck.title')}
          </h1>
          <p className="text-xl text-gray-600">
            {t('dbtCheck.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <Card>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label 
                  htmlFor="aadhaarDigits" 
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  {t('dbtCheck.aadhaarLabel')} *
                </label>
                <input
                  type="text"
                  id="aadhaarDigits"
                  name="aadhaarDigits"
                  value={formData.aadhaarDigits}
                  onChange={handleInputChange}
                  maxLength="4"
                  placeholder="1234"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    errors.aadhaarDigits ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.aadhaarDigits && (
                  <p className="mt-1 text-sm text-red-600">{errors.aadhaarDigits}</p>
                )}
              </div>

              <div>
                <label 
                  htmlFor="applicationId" 
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  {t('dbtCheck.applicationLabel')} *
                </label>
                <input
                  type="text"
                  id="applicationId"
                  name="applicationId"
                  value={formData.applicationId}
                  onChange={handleInputChange}
                  maxLength="12"
                  placeholder="APP123456789"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    errors.applicationId ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.applicationId && (
                  <p className="mt-1 text-sm text-red-600">{errors.applicationId}</p>
                )}
              </div>

              {errors.submit && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600">{errors.submit}</p>
                </div>
              )}

              <Button
                type="submit"
                loading={loading}
                disabled={loading}
                className="w-full"
                size="lg"
                icon={Search}
              >
                {t('dbtCheck.checkButton')}
              </Button>
            </form>

            {/* Security Notice */}
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Security Notice:</strong> Your data is encrypted and secure. 
                We only use the last 4 digits of your Aadhaar for verification.
              </p>
            </div>
          </Card>

          {/* Results Section */}
          <div className="space-y-6">
            {loading && (
              <Card>
                <div className="text-center py-8">
                  <Loader size="lg" text="Checking your DBT status..." />
                </div>
              </Card>
            )}

            {currentStatus && !loading && (
              <>
                <StatusCard
                  status={currentStatus.status}
                  title={getStatusTitle(currentStatus.status)}
                  description={getStatusMessage(currentStatus.status)}
                  icon={getStatusIcon(currentStatus.status)}
                  color={getStatusColor(currentStatus.status)}
                />

                {/* Action Buttons */}
                <Card>
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Next Steps
                    </h3>
                    
                    {currentStatus.status !== DBT_STATUS.ENABLED && (
                      <Button
                        onClick={() => navigate('/seeding-guide')}
                        className="w-full"
                        icon={FileText}
                      >
                        {t('dbtCheck.guidanceButton')}
                      </Button>
                    )}
                    
                    <Button
                      onClick={() => navigate('/camp-booking')}
                      variant="outline"
                      className="w-full"
                      icon={Calendar}
                    >
                      {t('dbtCheck.bookAssistance')}
                    </Button>
                  </div>
                </Card>

                {/* Status Details */}
                <Card>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Check Details
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Aadhaar (Last 4):</span>
                      <span className="font-medium">****{currentStatus.aadhaarDigits}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Application ID:</span>
                      <span className="font-medium">{currentStatus.applicationId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Checked on:</span>
                      <span className="font-medium">
                        {new Date(currentStatus.checkedAt).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </Card>
              </>
            )}

            {!currentStatus && !loading && (
              <Card className="text-center py-12 text-gray-500">
                <FileText className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p>Enter your details to check DBT status</p>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DBTStatusCheck;