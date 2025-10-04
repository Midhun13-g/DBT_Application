// Dummy data initializer for awareness and school activities

export const initializeAwarenessData = () => {
  const dummyAwareness = [
    {
      id: 1,
      title: "Understanding DBT Benefits",
      content: "Direct Benefit Transfer (DBT) is a revolutionary system that ensures government subsidies reach beneficiaries directly. Learn how to check your DBT status and link your Aadhaar with bank accounts for seamless transfers.",
      description: "Comprehensive guide on DBT system and its benefits for citizens",
      category: "EDUCATION",
      mediaType: "ARTICLE",
      tags: ["dbt", "benefits", "government"],
      targetAudience: "ALL",
      priority: "HIGH",
      isActive: true,
      isFeatured: true,
      createdAt: "2024-01-15T10:00:00Z",
      updatedAt: "2024-01-15T10:00:00Z"
    },
    {
      id: 2,
      title: "Aadhaar Seeding Process",
      content: "Step-by-step guide to link your Aadhaar number with your bank account. This process is essential for receiving government benefits and subsidies directly in your account.",
      description: "Complete tutorial on Aadhaar seeding for bank accounts",
      category: "FINANCE",
      mediaType: "VIDEO",
      videoUrl: "https://www.youtube.com/watch?v=example",
      tags: ["aadhaar", "banking", "seeding"],
      targetAudience: "ALL",
      priority: "URGENT",
      isActive: true,
      isFeatured: false,
      createdAt: "2024-01-14T14:30:00Z",
      updatedAt: "2024-01-14T14:30:00Z"
    },
    {
      id: 3,
      title: "Digital Literacy for Seniors",
      content: "Learn basic digital skills to access government services online. This guide covers smartphone usage, internet banking, and digital payment methods for senior citizens.",
      description: "Digital literacy program designed for elderly citizens",
      category: "TECHNOLOGY",
      mediaType: "INFOGRAPHIC",
      imageUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
      tags: ["digital", "seniors", "technology"],
      targetAudience: "SENIOR_CITIZENS",
      priority: "NORMAL",
      isActive: true,
      isFeatured: false,
      createdAt: "2024-01-13T09:15:00Z",
      updatedAt: "2024-01-13T09:15:00Z"
    },
    {
      id: 4,
      title: "Health Insurance Schemes",
      content: "Explore various government health insurance schemes like Ayushman Bharat. Learn about eligibility criteria, application process, and benefits covered under these schemes.",
      description: "Information about government health insurance programs",
      category: "HEALTH",
      mediaType: "ARTICLE",
      tags: ["health", "insurance", "ayushman"],
      targetAudience: "ALL",
      priority: "HIGH",
      isActive: true,
      isFeatured: true,
      createdAt: "2024-01-12T16:45:00Z",
      updatedAt: "2024-01-12T16:45:00Z"
    },
    {
      id: 5,
      title: "Women Empowerment Schemes",
      content: "Discover government schemes designed for women empowerment including skill development programs, financial assistance, and entrepreneurship support initiatives.",
      description: "Comprehensive guide on women-focused government schemes",
      category: "EDUCATION",
      mediaType: "PDF",
      pdfUrl: "data:application/pdf;base64,sample",
      tags: ["women", "empowerment", "schemes"],
      targetAudience: "WOMEN",
      priority: "NORMAL",
      isActive: true,
      isFeatured: false,
      createdAt: "2024-01-11T11:20:00Z",
      updatedAt: "2024-01-11T11:20:00Z"
    }
  ];

  localStorage.setItem('awarenessContent', JSON.stringify(dummyAwareness));
  return dummyAwareness;
};

export const initializeSchoolActivitiesData = () => {
  const dummyActivities = [
    {
      id: 1,
      title: "DBT Awareness Workshop",
      description: "Interactive workshop to educate students and parents about Direct Benefit Transfer system and its advantages.",
      date: "2024-02-15",
      time: "10:00 AM",
      venue: "School Auditorium",
      organizer: "Principal Office",
      category: "WORKSHOP",
      targetAudience: "Students & Parents",
      maxParticipants: 200,
      registeredCount: 45,
      status: "UPCOMING",
      priority: "HIGH",
      isActive: true,
      createdAt: "2024-01-15T08:00:00Z",
      updatedAt: "2024-01-15T08:00:00Z"
    },
    {
      id: 2,
      title: "Digital Literacy Training",
      description: "Hands-on training session for teachers on using digital tools and government online services effectively.",
      date: "2024-02-20",
      time: "2:00 PM",
      venue: "Computer Lab",
      organizer: "IT Department",
      category: "TRAINING",
      targetAudience: "Teachers",
      maxParticipants: 30,
      registeredCount: 18,
      status: "UPCOMING",
      priority: "MEDIUM",
      isActive: true,
      createdAt: "2024-01-14T12:30:00Z",
      updatedAt: "2024-01-14T12:30:00Z"
    },
    {
      id: 3,
      title: "Parent-Teacher Meeting",
      description: "Monthly meeting to discuss student progress and upcoming government scholarship opportunities.",
      date: "2024-02-10",
      time: "4:00 PM",
      venue: "Respective Classrooms",
      organizer: "Academic Department",
      category: "MEETING",
      targetAudience: "Parents & Teachers",
      maxParticipants: 150,
      registeredCount: 89,
      status: "UPCOMING",
      priority: "HIGH",
      isActive: true,
      createdAt: "2024-01-13T15:45:00Z",
      updatedAt: "2024-01-13T15:45:00Z"
    },
    {
      id: 4,
      title: "Scholarship Application Drive",
      description: "Special session to help students apply for various government scholarships and understand eligibility criteria.",
      date: "2024-01-25",
      time: "11:00 AM",
      venue: "Library Hall",
      organizer: "Counseling Department",
      category: "WORKSHOP",
      targetAudience: "Students",
      maxParticipants: 100,
      registeredCount: 67,
      status: "COMPLETED",
      priority: "URGENT",
      isActive: true,
      createdAt: "2024-01-12T09:20:00Z",
      updatedAt: "2024-01-25T12:00:00Z"
    },
    {
      id: 5,
      title: "Health Checkup Camp",
      description: "Free health checkup camp organized in collaboration with local health department for students and staff.",
      date: "2024-02-28",
      time: "9:00 AM",
      venue: "School Playground",
      organizer: "Health Committee",
      category: "HEALTH",
      targetAudience: "Students & Staff",
      maxParticipants: 300,
      registeredCount: 125,
      status: "UPCOMING",
      priority: "MEDIUM",
      isActive: true,
      createdAt: "2024-01-11T14:10:00Z",
      updatedAt: "2024-01-11T14:10:00Z"
    },
    {
      id: 6,
      title: "Financial Literacy Session",
      description: "Educational session on banking, savings, and government financial schemes for senior students.",
      date: "2024-03-05",
      time: "1:00 PM",
      venue: "Conference Room",
      organizer: "Commerce Department",
      category: "EDUCATION",
      targetAudience: "Senior Students",
      maxParticipants: 80,
      registeredCount: 23,
      status: "UPCOMING",
      priority: "NORMAL",
      isActive: true,
      createdAt: "2024-01-10T10:30:00Z",
      updatedAt: "2024-01-10T10:30:00Z"
    }
  ];

  localStorage.setItem('schoolActivities', JSON.stringify(dummyActivities));
  return dummyActivities;
};

export const clearAwarenessContent = () => {
  localStorage.removeItem('awarenessContent');
  console.log('Awareness content cleared');
};

export const initializeAllDummyData = () => {
  clearAwarenessContent();
  const awareness = initializeAwarenessData();
  const activities = initializeSchoolActivitiesData();
  
  console.log('Initialized dummy data:');
  console.log('- Awareness items:', awareness.length);
  console.log('- School activities:', activities.length);
  
  return { awareness, activities };
};