import React, { useState, useEffect } from 'react';
import { Search, Download, CheckCircle, Clock, XCircle, AlertCircle, CreditCard } from 'lucide-react';
import Card from '../../components/Card/Card';
import Button from '../../components/Button/Button';

const ScholarshipStatus = () => {
  const [scholarships, setScholarships] = useState([]);
  const [searchData, setSearchData] = useState({
    applicationId: '',
    aadhaarLast4: ''
  });
  const [loading, setLoading] = useState(false);

  const statusConfig = {
    APPLIED: { icon: Clock, color: 'text-blue-600', bg: 'bg-blue-100', text: 'Application Submitted' },
    UNDER_REVIEW: { icon: AlertCircle, color: 'text-yellow-600', bg: 'bg-yellow-100', text: 'Under Review' },
    APPROVED: { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100', text: 'Approved' },
    DISBURSED: { icon: CreditCard, color: 'text-green-600', bg: 'bg-green-100', text: 'Amount Disbursed' },
    REJECTED: { icon: XCircle, color: 'text-red-600', bg: 'bg-red-100', text: 'Rejected' },
    ON_HOLD: { icon: AlertCircle, color: 'text-orange-600', bg: 'bg-orange-100', text: 'On Hold' }
  };

  useEffect(() => {
    // Mock data
    setScholarships([
      {
        id: 1,
        schemeName: 'Pre-Matric Scholarship for SC Students',
        applicationId: 'PM2024001234',
        status: 'DISBURSED',
        amount: 5000,
        disbursementDate: '2024-02-15T10:30:00',
        bankVerificationStatus: 'VERIFIED',
        certificateUrl: '/certificates/pm-2024-001234.pdf',
        remarks: 'Successfully disbursed to linked bank account'
      },
      {
        id: 2,
        schemeName: 'Post-Matric Scholarship for OBC Students',
        applicationId: 'PMS2024005678',
        status: 'UNDER_REVIEW',
        amount: 8000,
        disbursementDate: null,
        bankVerificationStatus: 'PENDING',
        certificateUrl: null,
        remarks: 'Document verification in progress'
      },
      {
        id: 3,
        schemeName: 'Merit-cum-Means Scholarship',
        applicationId: 'MCM2024009876',
        status: 'APPROVED',
        amount: 12000,
        disbursementDate: null,
        bankVerificationStatus: 'VERIFIED',
        certificateUrl: '/certificates/mcm-2024-009876.pdf',
        remarks: 'Approved for disbursement. Amount will be credited within 7 working days.'
      }
    ]);
  }, []);

  const handleSearch = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not Available';
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Scholarship Status Checker</h1>
          <p className="text-gray-600 mt-2">Track multiple scholarship applications and disbursement details</p>
        </div>

        {/* Search Section */}
        <Card className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Check Scholarship Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Application ID
              </label>
              <input
                type="text"
                placeholder="Enter application ID"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={searchData.applicationId}
                onChange={(e) => setSearchData({...searchData, applicationId: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Last 4 digits of Aadhaar
              </label>
              <input
                type="text"
                placeholder="1234"
                maxLength="4"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={searchData.aadhaarLast4}
                onChange={(e) => setSearchData({...searchData, aadhaarLast4: e.target.value})}
              />
            </div>
            <div className="flex items-end">
              <Button 
                icon={Search} 
                className="w-full"
                onClick={handleSearch}
                disabled={loading}
              >
                {loading ? 'Searching...' : 'Check Status'}
              </Button>
            </div>
          </div>
        </Card>

        {/* Scholarships List */}
        <div className="space-y-6">
          {scholarships.map((scholarship) => {
            const statusInfo = statusConfig[scholarship.status];
            const StatusIcon = statusInfo.icon;

            return (
              <Card key={scholarship.id} className="hover:shadow-lg transition-shadow duration-200">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          {scholarship.schemeName}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Application ID: {scholarship.applicationId}
                        </p>
                      </div>
                      <div className={`flex items-center space-x-2 px-3 py-1 rounded-full ${statusInfo.bg}`}>
                        <StatusIcon className={`h-4 w-4 ${statusInfo.color}`} />
                        <span className={`text-sm font-medium ${statusInfo.color}`}>
                          {statusInfo.text}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-sm font-medium text-gray-700">Amount</p>
                        <p className="text-lg font-semibold text-green-600">
                          {formatAmount(scholarship.amount)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">Disbursement Date</p>
                        <p className="text-sm text-gray-900">
                          {formatDate(scholarship.disbursementDate)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">Bank Verification</p>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          scholarship.bankVerificationStatus === 'VERIFIED' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {scholarship.bankVerificationStatus}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">Certificate</p>
                        {scholarship.certificateUrl ? (
                          <Button variant="outline" size="sm" icon={Download}>
                            Download
                          </Button>
                        ) : (
                          <span className="text-sm text-gray-500">Not Available</span>
                        )}
                      </div>
                    </div>

                    {scholarship.remarks && (
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-sm font-medium text-gray-700 mb-1">Remarks:</p>
                        <p className="text-sm text-gray-600">{scholarship.remarks}</p>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Summary Card */}
        <Card className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Scholarship Summary</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Total Applications</p>
                  <p className="text-xl font-bold text-blue-600">{scholarships.length}</p>
                </div>
                <div>
                  <p className="text-gray-600">Total Amount Received</p>
                  <p className="text-xl font-bold text-green-600">
                    {formatAmount(scholarships.filter(s => s.status === 'DISBURSED').reduce((sum, s) => sum + s.amount, 0))}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Pending Applications</p>
                  <p className="text-xl font-bold text-orange-600">
                    {scholarships.filter(s => ['APPLIED', 'UNDER_REVIEW', 'APPROVED'].includes(s.status)).length}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ScholarshipStatus;