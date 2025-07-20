import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import StatusPagesCollection from '../components/generated/StatusPagesCollection';
import { useAuth } from '../contexts/AuthContext';

interface StatusPageProps {}

const StatusPage: React.FC<StatusPageProps> = () => {
  const { type } = useParams<{ type: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Extract URL parameters
  const opportunityTitle = searchParams.get('title') || 'Unknown Opportunity';
  const company = searchParams.get('company') || 'Unknown Company';
  const pendingCount = parseInt(searchParams.get('pending') || '0');
  const canEditResponses = searchParams.get('canEdit') === 'true';

  // Validate status type
  const validStatusTypes = ['opportunity-grabbed', 'questionnaire-submitted', 'pending-reviews'];
  const statusType = validStatusTypes.includes(type || '') ? type as any : 'opportunity-grabbed';

  // Set page title based on status type
  useEffect(() => {
    const titles = {
      'opportunity-grabbed': 'Interest Sent - Startup Ecosystem',
      'questionnaire-submitted': 'Questionnaire Submitted - Startup Ecosystem',
      'pending-reviews': 'Pending Reviews - Startup Ecosystem'
    };
    document.title = titles[statusType] || 'Status - Startup Ecosystem';
  }, [statusType]);

  // Handle navigation actions
  const handleBrowseMore = () => {
    navigate('/opportunities');
  };

  const handleEditResponses = () => {
    // Navigate to edit responses page
    navigate('/questionnaire/edit');
  };

  const handleReviewAll = () => {
    // Navigate to review page
    navigate('/opportunities/review');
  };

  const handleBack = () => {
    navigate(-1);
  };

  // Add real-time updates for pending reviews
  const [realPendingCount, setRealPendingCount] = useState(pendingCount);

  useEffect(() => {
    if (statusType === 'pending-reviews' && user) {
      // Set up real-time subscription for pending reviews
      const interval = setInterval(async () => {
        try {
          // This would fetch real pending count from the database
          // For now, we'll simulate it
          const newCount = Math.max(0, realPendingCount - Math.floor(Math.random() * 2));
          setRealPendingCount(newCount);
        } catch (error) {
          console.error('Error fetching pending count:', error);
        }
      }, 30000); // Update every 30 seconds

      return () => clearInterval(interval);
    }
  }, [statusType, user, realPendingCount]);

  return (
    <div className="min-h-screen bg-white">
      <StatusPagesCollection
        statusType={statusType}
        opportunityTitle={opportunityTitle}
        posterName={company}
        pendingCount={realPendingCount}
        canEditResponses={canEditResponses}
        onBrowseMore={handleBrowseMore}
        onEditResponses={handleEditResponses}
        onReviewAll={handleReviewAll}
        onBack={handleBack}
      />
    </div>
  );
};

export default StatusPage; 