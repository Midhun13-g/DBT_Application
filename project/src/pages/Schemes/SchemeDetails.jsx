import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Users, Calendar, FileText, ExternalLink } from 'lucide-react';
import Card from '../../components/Card/Card';
import Button from '../../components/Button/Button';

const SchemeDetails = () => {
  const { schemeId } = useParams();
  const navigate = useNavigate();

  const schemes = {
    'pre-matric': {
      title: 'Pre-Matric Scholarship',
      description: 'Financial assistance for SC/ST/OBC students studying in classes I-X',
      eligibility: 'Students from SC/ST/OBC categories',
      amount: '₹1,000 - ₹5,700 per year',
      status: 'Active',
      details: {
        objective: 'To provide financial assistance to students belonging to Scheduled Castes, Scheduled Tribes and Other Backward Classes studying in classes I to X.',
        benefits: [
          'Day scholars: ₹1,000 to ₹2,250 per year',
          'Hostellers: ₹3,500 to ₹5,700 per year',
          'Book allowance and other expenses covered'
        ],
        eligibility: [
          'Student must belong to SC/ST/OBC category',
          'Family income should not exceed ₹2.5 lakh per annum',
          'Student should be studying in classes I-X',
          'Must have passed previous class with minimum marks'
        ],
        documents: [
          'Caste certificate',
          'Income certificate',
          'Previous year mark sheet',
          'Bank account details',
          'Aadhaar card'
        ],
        applicationProcess: [
          'Visit National Scholarship Portal (NSP)',
          'Register with required details',
          'Fill application form',
          'Upload required documents',
          'Submit application before deadline'
        ]
      }
    },
    'post-matric': {
      title: 'Post-Matric Scholarship',
      description: 'Support for higher education for SC/ST/OBC students',
      eligibility: 'Students pursuing higher education',
      amount: '₹2,000 - ₹12,000 per year',
      status: 'Active',
      details: {
        objective: 'To provide financial assistance to students belonging to Scheduled Castes, Scheduled Tribes and Other Backward Classes for pursuing higher education.',
        benefits: [
          'Maintenance allowance: ₹2,000 to ₹5,500 per month',
          'Tuition fee reimbursement',
          'Book allowance and other compulsory fees'
        ],
        eligibility: [
          'Student must belong to SC/ST/OBC category',
          'Family income should not exceed ₹2.5 lakh per annum',
          'Student should be pursuing post-matriculation studies',
          'Must have secured admission in recognized institution'
        ],
        documents: [
          'Caste certificate',
          'Income certificate',
          'Admission proof',
          'Fee receipt',
          'Bank account details'
        ],
        applicationProcess: [
          'Apply through National Scholarship Portal',
          'Complete online registration',
          'Fill scholarship application',
          'Upload all required documents',
          'Track application status online'
        ]
      }
    },
    'pm-kisan': {
      title: 'PM-KISAN Scheme',
      description: 'Income support to farmer families',
      eligibility: 'Small and marginal farmers',
      amount: '₹6,000 per year',
      status: 'Active',
      details: {
        objective: 'To provide income support to all landholding farmer families to supplement their financial needs for agriculture and allied activities.',
        benefits: [
          '₹6,000 per year in three equal installments',
          'Direct benefit transfer to bank accounts',
          'No application fee required'
        ],
        eligibility: [
          'Small and marginal farmer families',
          'Landholding farmers across the country',
          'Families with cultivable land holding'
        ],
        documents: [
          'Aadhaar card',
          'Bank account details',
          'Land ownership documents',
          'Mobile number'
        ],
        applicationProcess: [
          'Visit PM-KISAN portal',
          'Register with Aadhaar number',
          'Fill farmer registration form',
          'Upload land documents',
          'Submit application'
        ]
      }
    },
    'pm-awas': {
      title: 'Pradhan Mantri Awas Yojana',
      description: 'Housing for all by 2022',
      eligibility: 'Economically weaker sections',
      amount: '₹1.2 - ₹2.5 lakh subsidy',
      status: 'Active',
      details: {
        objective: 'To provide affordable housing to urban and rural poor by 2022.',
        benefits: [
          'Interest subsidy on home loans',
          'Direct financial assistance',
          'In-situ slum redevelopment'
        ],
        eligibility: [
          'Economically Weaker Section (EWS)',
          'Low Income Group (LIG)',
          'Middle Income Group (MIG)'
        ],
        documents: [
          'Income certificate',
          'Aadhaar card',
          'Bank account details',
          'Property documents'
        ],
        applicationProcess: [
          'Visit PMAY portal',
          'Fill online application',
          'Upload required documents',
          'Submit application',
          'Track application status'
        ]
      }
    },
    'ayushman-bharat': {
      title: 'Ayushman Bharat',
      description: 'Health insurance coverage',
      eligibility: 'Poor and vulnerable families',
      amount: '₹5 lakh per family per year',
      status: 'Active',
      details: {
        objective: 'To provide health insurance coverage to poor and vulnerable families.',
        benefits: [
          '₹5 lakh per family per year',
          'Cashless treatment at empaneled hospitals',
          'Coverage for secondary and tertiary care'
        ],
        eligibility: [
          'Families identified in SECC 2011',
          'Rural and urban poor families',
          'Vulnerable occupational categories'
        ],
        documents: [
          'Aadhaar card',
          'Ration card',
          'Mobile number',
          'Family details'
        ],
        applicationProcess: [
          'Visit nearest CSC or hospital',
          'Verify eligibility',
          'Generate Ayushman card',
          'Use for cashless treatment'
        ]
      }
    },
    'nsap': {
      title: 'National Social Assistance Programme',
      description: 'Social security for elderly, widows, and disabled',
      eligibility: 'BPL families',
      amount: '₹200 - ₹1,000 per month',
      status: 'Active',
      details: {
        objective: 'To provide social assistance to elderly, widows, and disabled persons from BPL families.',
        benefits: [
          'Old Age Pension: ₹200-1000 per month',
          'Widow Pension: ₹300-1000 per month',
          'Disability Pension: ₹300-1000 per month'
        ],
        eligibility: [
          'BPL families',
          'Age criteria varies by scheme',
          'Disability certificate for disabled persons'
        ],
        documents: [
          'BPL certificate',
          'Age proof',
          'Bank account details',
          'Aadhaar card'
        ],
        applicationProcess: [
          'Apply at local government office',
          'Submit required documents',
          'Verification by officials',
          'Approval and pension disbursement'
        ]
      }
    }
  };

  const scheme = schemes[schemeId] || schemes['pre-matric'];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Button
            variant="outline"
            icon={ArrowLeft}
            onClick={() => navigate('/')}
            className="mb-4"
          >
            Back to Home
          </Button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{scheme.title}</h1>
              <p className="text-gray-600">{scheme.description}</p>
            </div>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
              {scheme.status}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Objective */}
            <Card>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Objective</h2>
              <p className="text-gray-700">{scheme.details.objective}</p>
            </Card>

            {/* Benefits */}
            <Card>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Benefits</h2>
              <ul className="space-y-2">
                {scheme.details.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{benefit}</span>
                  </li>
                ))}
              </ul>
            </Card>

            {/* Eligibility */}
            <Card>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Eligibility Criteria</h2>
              <ul className="space-y-2">
                {scheme.details.eligibility.map((criteria, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <Users className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{criteria}</span>
                  </li>
                ))}
              </ul>
            </Card>

            {/* Application Process */}
            <Card>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Application Process</h2>
              <ol className="space-y-3">
                {scheme.details.applicationProcess.map((step, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </div>
                    <span className="text-gray-700">{step}</span>
                  </li>
                ))}
              </ol>
            </Card>
          </div>

          <div className="space-y-6">
            {/* Quick Info */}
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Information</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Amount:</span>
                  <span className="font-semibold text-green-600">{scheme.amount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Category:</span>
                  <span className="font-semibold">SC/ST/OBC</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className="font-semibold text-green-600">{scheme.status}</span>
                </div>
              </div>
            </Card>

            {/* Required Documents */}
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Required Documents</h3>
              <ul className="space-y-2">
                {scheme.details.documents.map((doc, index) => (
                  <li key={index} className="flex items-center space-x-2">
                    <FileText className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-700">{doc}</span>
                  </li>
                ))}
              </ul>
            </Card>

            {/* Actions */}
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Apply Now</h3>
              <div className="space-y-3">
                <Button className="w-full" icon={ExternalLink}>
                  Apply on NSP Portal
                </Button>
                <Button variant="outline" className="w-full" icon={Calendar}>
                  Book Assistance
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchemeDetails;