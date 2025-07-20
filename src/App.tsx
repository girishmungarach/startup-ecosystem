import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, useParams } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'

import MainLayout from './layouts/MainLayout'

// Import existing components
import LandingPage from './components/generated/LandingPage'
import ProfileCreationForm from './components/generated/ProfileCreationForm'
import OpportunitiesDashboard from './components/generated/OpportunitiesDashboard'
import PostOpportunityForm from './components/generated/PostOpportunityForm'
import MyOpportunitiesDashboard from './components/generated/MyOpportunitiesDashboard'
import OpportunityGrabsReview from './components/generated/OpportunityGrabsReview'
import QuestionnaireCreationForm from './components/generated/QuestionnaireCreationForm'
import QuestionnaireResponseForm from './components/generated/QuestionnaireResponseForm'
import QuestionnaireResponseReview from './components/generated/QuestionnaireResponseReview'
import ProfileDiscoveryPage from './components/generated/ProfileDiscoveryPage'
import ProfileDetailView from './components/generated/ProfileDetailView'
import MyConnectionsPage from './components/generated/MyConnectionsPage'
import BookmarksManagementPage from './components/generated/BookmarksManagementPage'
import ContactRevelationSuccess from './components/generated/ContactRevelationSuccess'
import StatusPage from './pages/StatusPage'

// Import new pages
import SignInPage from './pages/SignInPage'
import SignUpPage from './pages/SignUpPage'
import AuthCallback from './pages/AuthCallback'
import ProfileSettings from './pages/ProfileSettings'

// Protected Route Component
interface ProtectedRouteProps {
  children: React.ReactNode
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-white text-black font-sans flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-lg">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/signin" replace />
  }

  return <MainLayout>{children}</MainLayout>
}

// Public Route Component (redirects to opportunities if already authenticated)
interface PublicRouteProps {
  children: React.ReactNode
}

const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-white text-black font-sans flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-lg">Loading...</p>
        </div>
      </div>
    )
  }

  if (user) {
    return <Navigate to="/opportunities" replace />
  }

  return <>{children}</>
}

// Wrapper component for OpportunityGrabsReview
const OpportunityGrabsReviewWrapper: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  return <OpportunityGrabsReview opportunityId={id || ''} />;
};

// Main App Component
const AppContent: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        
        {/* Auth Callback Route */}
        <Route path="/auth/callback" element={<AuthCallback />} />
        
        <Route 
          path="/signin" 
          element={
            <PublicRoute>
              <SignInPage />
            </PublicRoute>
          } 
        />
        
        <Route 
          path="/signup" 
          element={
            <PublicRoute>
              <SignUpPage />
            </PublicRoute>
          } 
        />

        {/* Protected Routes */}
        <Route 
          path="/profile/create" 
          element={
            <ProtectedRoute>
              <ProfileCreationForm />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/profile/settings" 
          element={
            <ProtectedRoute>
              <ProfileSettings />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/opportunities" 
          element={
            <ProtectedRoute>
              <OpportunitiesDashboard />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/opportunities/post" 
          element={
            <ProtectedRoute>
              <PostOpportunityForm />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/my-opportunities" 
          element={
            <ProtectedRoute>
              <MyOpportunitiesDashboard />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/opportunities/:id/review" 
          element={
            <ProtectedRoute>
              <OpportunityGrabsReviewWrapper />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/questionnaire/create" 
          element={
            <ProtectedRoute>
              <QuestionnaireCreationForm />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/questionnaire/respond/:id" 
          element={
            <ProtectedRoute>
              <QuestionnaireResponseForm />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/questionnaire/review/:id" 
          element={
            <ProtectedRoute>
              <QuestionnaireResponseReview />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/profiles" 
          element={
            <ProtectedRoute>
              <ProfileDiscoveryPage />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/profiles/:id" 
          element={
            <ProtectedRoute>
              <ProfileDetailView />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/connections" 
          element={
            <ProtectedRoute>
              <MyConnectionsPage />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/bookmarks" 
          element={
            <ProtectedRoute>
              <BookmarksManagementPage />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/contact-success" 
          element={
            <ProtectedRoute>
              <ContactRevelationSuccess userRole="grabber" />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/status/:type" 
          element={
            <ProtectedRoute>
              <StatusPage />
            </ProtectedRoute>
          } 
        />

        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  )
}

// Root App Component with Auth Provider
const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App
