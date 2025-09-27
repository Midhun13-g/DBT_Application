import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  MapPin, 
  Calendar, 
  Clock, 
  CheckCircle, 
  User, 
  Phone, 
  Mail,
  FileText,
  AlertCircle,
  Navigation
} from 'lucide-react';
import Card from '../../components/Card/Card';
import Button from '../../components/Button/Button';
import Modal from '../../components/Modal/Modal';
import { CAMP_LOCATIONS, TIME_SLOTS } from '../../utils/constants';
import { generateBookingId } from '../../utils/helpers';

const CampBooking = () => {
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState(1);
  const [bookingData, setBookingData] = useState({
    location: '',
    date: '',
    timeSlot: '',
    name: '',
    phone: '',
    email: '',
    aadhaarLast4: '',
    issue: ''
  });
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [bookingId, setBookingId] = useState('');
  const [errors, setErrors] = useState({});

  const steps = [
    { id: 1, title: 'Location & Date', icon: MapPin },
    { id: 2, title: 'Personal Details', icon: User },
    { id: 3, title: 'Confirmation', icon: CheckCircle }
  ];

  const issueTypes = [
    'Aadhaar-Bank Account Linking',
    'DBT Status Check',
    'Account Seeding Issues',
    'Benefit Transfer Problems',
    'Document Verification',
    'General DBT Queries'
  ];

  // Generate available dates (next 30 days, excluding weekends)
  const getAvailableDates = () => {
    const dates = [];
    const today = new Date();
    let currentDate = new Date(today);
    currentDate.setDate(currentDate.getDate() + 1); // Start from tomorrow

    while (dates.length < 20) {
      const dayOfWeek = currentDate.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) { // Exclude Sunday (0) and Saturday (6)
        dates.push(new Date(currentDate));
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return dates;
  };

  const availableDates = getAvailableDates();

  const handleInputChange = (field, value) => {
    setBookingData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      if (!bookingData.location) newErrors.location = 'Please select a location';
      if (!bookingData.date) newErrors.date = 'Please select a date';
      if (!bookingData.timeSlot) newErrors.timeSlot = 'Please select a time slot';
    }

    if (step === 2) {
      if (!bookingData.name.trim()) newErrors.name = 'Name is required';
      if (!bookingData.phone.trim()) newErrors.phone = 'Phone number is required';
      else if (!/^[6-9]\d{9}$/.test(bookingData.phone)) newErrors.phone = 'Invalid phone number';
      if (!bookingData.email.trim()) newErrors.email = 'Email is required';
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(bookingData.email)) newErrors.email = 'Invalid email';
      if (!bookingData.aadhaarLast4.trim()) newErrors.aadhaarLast4 = 'Last 4 digits of Aadhaar required';
      else if (!/^\d{4}$/.test(bookingData.aadhaarLast4)) newErrors.aadhaarLast4 = 'Must be 4 digits';
      if (!bookingData.issue) newErrors.issue = 'Please select your issue type';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async () => {
    if (validateStep(2)) {
      // Simulate API call
      const newBookingId = generateBookingId();
      setBookingId(newBookingId);
      setShowConfirmation(true);
    }
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const resetBooking = () => {
    setCurrentStep(1);
    setBookingData({
      location: '',
      date: '',
      timeSlot: '',
      name: '',
      phone: '',
      email: '',
      aadhaarLast4: '',
      issue: ''
    });
    setErrors({});
    setShowConfirmation(false);
    setBookingId('');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {t('campBooking.title')}
          </h1>
          <p className="text-xl text-gray-600">
            {t('campBooking.subtitle')}
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-8">
            {steps.map((step, index) => {
              const IconComponent = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;
              
              return (
                <div key={step.id} className="flex items-center">
                  <div className={`flex items-center space-x-2 ${
                    isActive ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-400'
                  }`}>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                      isActive ? 'border-blue-600 bg-blue-50' : 
                      isCompleted ? 'border-green-600 bg-green-50' : 
                      'border-gray-300 bg-white'
                    }`}>
                      {isCompleted ? (
                        <CheckCircle className="h-6 w-6" />
                      ) : (
                        <IconComponent className="h-5 w-5" />
                      )}
                    </div>
                    <span className="font-medium hidden sm:block">{step.title}</span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-16 h-0.5 mx-4 ${
                      isCompleted ? 'bg-green-600' : 'bg-gray-300'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Step Content */}
        <Card>
          {currentStep === 1 && (
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                Select Location, Date & Time
              </h2>
              
              {/* Location Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  {t('campBooking.selectLocation')} *
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {CAMP_LOCATIONS.map((location) => (
                    <button
                      key={location}
                      onClick={() => handleInputChange('location', location)}
                      className={`p-4 text-left border-2 rounded-lg transition-all ${
                        bookingData.location === location
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <MapPin className={`h-5 w-5 ${
                          bookingData.location === location ? 'text-blue-600' : 'text-gray-400'
                        }`} />
                        <span className="font-medium">{location}</span>
                      </div>
                    </button>
                  ))}
                </div>
                {errors.location && (
                  <p className="mt-1 text-sm text-red-600">{errors.location}</p>
                )}
              </div>

              {/* Date Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  {t('campBooking.selectDate')} *
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {availableDates.slice(0, 8).map((date) => {
                    const dateStr = date.toISOString().split('T')[0];
                    return (
                      <button
                        key={dateStr}
                        onClick={() => handleInputChange('date', dateStr)}
                        className={`p-3 text-center border-2 rounded-lg transition-all ${
                          bookingData.date === dateStr
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className={`${
                          bookingData.date === dateStr ? 'text-blue-600' : 'text-gray-600'
                        }`}>
                          <Calendar className="h-4 w-4 mx-auto mb-1" />
                          <div className="text-sm font-medium">
                            {date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                          </div>
                          <div className="text-xs">
                            {date.toLocaleDateString('en-IN', { weekday: 'short' })}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
                {errors.date && (
                  <p className="mt-1 text-sm text-red-600">{errors.date}</p>
                )}
              </div>

              {/* Time Slot Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  {t('campBooking.selectTime')} *
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {TIME_SLOTS.map((slot) => (
                    <button
                      key={slot}
                      onClick={() => handleInputChange('timeSlot', slot)}
                      className={`p-3 text-center border-2 rounded-lg transition-all ${
                        bookingData.timeSlot === slot
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-center space-x-2">
                        <Clock className={`h-4 w-4 ${
                          bookingData.timeSlot === slot ? 'text-blue-600' : 'text-gray-400'
                        }`} />
                        <span className={`text-sm font-medium ${
                          bookingData.timeSlot === slot ? 'text-blue-600' : 'text-gray-600'
                        }`}>
                          {slot}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
                {errors.timeSlot && (
                  <p className="mt-1 text-sm text-red-600">{errors.timeSlot}</p>
                )}
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                Personal Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={bookingData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.name ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Enter your full name"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={bookingData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.phone ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="10-digit mobile number"
                    maxLength="10"
                  />
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={bookingData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.email ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="your.email@example.com"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last 4 digits of Aadhaar *
                  </label>
                  <input
                    type="text"
                    value={bookingData.aadhaarLast4}
                    onChange={(e) => handleInputChange('aadhaarLast4', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.aadhaarLast4 ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="1234"
                    maxLength="4"
                  />
                  {errors.aadhaarLast4 && (
                    <p className="mt-1 text-sm text-red-600">{errors.aadhaarLast4}</p>
                  )}
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type of Issue/Query *
                </label>
                <select
                  value={bookingData.issue}
                  onChange={(e) => handleInputChange('issue', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.issue ? 'border-red-300' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select your issue type</option>
                  {issueTypes.map((issue) => (
                    <option key={issue} value={issue}>{issue}</option>
                  ))}
                </select>
                {errors.issue && (
                  <p className="mt-1 text-sm text-red-600">{errors.issue}</p>
                )}
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                Confirm Your Booking
              </h2>
              
              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Appointment Details</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        <span>{bookingData.location}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <span>{formatDate(new Date(bookingData.date))}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span>{bookingData.timeSlot}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Personal Information</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-gray-500" />
                        <span>{bookingData.name}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Phone className="h-4 w-4 text-gray-500" />
                        <span>{bookingData.phone}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4 text-gray-500" />
                        <span>{bookingData.email}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <FileText className="h-4 w-4 text-gray-500" />
                        <span>Issue: {bookingData.issue}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-1">Important Instructions:</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Please arrive 15 minutes before your scheduled time</li>
                      <li>Bring original Aadhaar card and bank passbook</li>
                      <li>You will receive a confirmation SMS and email</li>
                      <li>For any changes, call our helpline: 1800-11-1400</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-6 border-t border-gray-200">
            <div>
              {currentStep > 1 && (
                <Button variant="outline" onClick={handlePrevious}>
                  Previous
                </Button>
              )}
            </div>
            <div>
              {currentStep < 3 ? (
                <Button onClick={handleNext}>
                  Next
                </Button>
              ) : (
                <Button onClick={handleSubmit} icon={CheckCircle}>
                  {t('campBooking.bookButton')}
                </Button>
              )}
            </div>
          </div>
        </Card>
      </div>

      {/* Confirmation Modal */}
      <Modal
        isOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        title={t('campBooking.confirmationTitle')}
        size="md"
      >
        <div className="text-center">
          <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Booking Confirmed!
          </h3>
          <p className="text-gray-600 mb-4">
            Your appointment has been successfully booked.
          </p>
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-600 mb-2">{t('campBooking.bookingId')}</p>
            <p className="text-xl font-bold text-blue-600">{bookingId}</p>
          </div>
          <p className="text-sm text-gray-600 mb-6">
            You will receive confirmation details via SMS and email shortly.
          </p>
          <div className="flex space-x-3">
            <Button variant="outline" onClick={() => setShowConfirmation(false)}>
              Close
            </Button>
            <Button onClick={resetBooking}>
              Book Another
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CampBooking;