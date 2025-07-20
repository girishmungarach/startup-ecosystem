import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { supabase } from '../services/supabase'
import { motion } from 'framer-motion'
import { CheckCircle, XCircle, Loader } from 'lucide-react'

const AuthCallback: React.FC = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('Processing authentication...')
  const [debugInfo, setDebugInfo] = useState<string>('')

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Log all URL parameters for debugging
        const allParams = Object.fromEntries(searchParams.entries())
        console.log('Auth callback URL parameters:', allParams)
        setDebugInfo(`URL params: ${JSON.stringify(allParams)}`)

        // Get the error from URL params
        const error = searchParams.get('error')
        const errorDescription = searchParams.get('error_description')
        const errorCode = searchParams.get('error_code')

        if (error) {
          console.error('Auth error details:', { error, errorDescription, errorCode })
          setStatus('error')
          setMessage(errorDescription || `Authentication failed: ${error}`)
          setDebugInfo(`Error: ${error}, Code: ${errorCode}, Description: ${errorDescription}`)
          
          // Redirect to signin after 5 seconds
          setTimeout(() => {
            navigate('/signin')
          }, 5000)
          return
        }

        // Handle successful authentication
        console.log('Getting session...')
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        
        if (sessionError) {
          console.error('Session error:', sessionError)
          setStatus('error')
          setMessage(`Failed to get session: ${sessionError.message}`)
          setDebugInfo(`Session error: ${JSON.stringify(sessionError)}`)
          
          setTimeout(() => {
            navigate('/signin')
          }, 5000)
          return
        }

        console.log('Session data:', session)

        if (session?.user) {
          console.log('User authenticated:', session.user)
          setStatus('success')
          setMessage('Authentication successful! Checking profile...')
          setDebugInfo(`User ID: ${session.user.id}, Email: ${session.user.email}`)
          
          // Check if user has a complete profile
          console.log('Checking user profile...')
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('full_name, company, role')
            .eq('id', session.user.id)
            .single()

          if (profileError) {
            console.error('Profile fetch error:', profileError)
            setDebugInfo(`Profile error: ${JSON.stringify(profileError)}`)
          } else {
            console.log('Profile data:', profile)
            setDebugInfo(`Profile: ${JSON.stringify(profile)}`)
          }

          // Redirect based on profile completion
          setTimeout(() => {
            if (profile && profile.full_name && profile.company && profile.role) {
              console.log('Profile complete, redirecting to opportunities')
              navigate('/opportunities')
            } else {
              console.log('Profile incomplete, redirecting to profile creation')
              navigate('/profile/create')
            }
          }, 3000)
        } else {
          console.log('No session found')
          setStatus('error')
          setMessage('No session found after authentication')
          setDebugInfo('No session data available')
          
          setTimeout(() => {
            navigate('/signin')
          }, 5000)
        }
      } catch (error) {
        console.error('Auth callback error:', error)
        setStatus('error')
        setMessage(`An unexpected error occurred: ${error instanceof Error ? error.message : 'Unknown error'}`)
        setDebugInfo(`Exception: ${JSON.stringify(error)}`)
        
        setTimeout(() => {
          navigate('/signin')
        }, 5000)
      }
    }

    handleAuthCallback()
  }, [searchParams, navigate])

  return (
    <div className="min-h-screen bg-white text-black font-sans flex items-center justify-center">
      <div className="max-w-md w-full mx-auto p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          {/* Status Icon */}
          <div className="mb-6">
            {status === 'loading' && (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="mx-auto w-16 h-16 text-black"
              >
                <Loader size={64} />
              </motion.div>
            )}
            {status === 'success' && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5 }}
                className="mx-auto w-16 h-16 text-green-600"
              >
                <CheckCircle size={64} />
              </motion.div>
            )}
            {status === 'error' && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5 }}
                className="mx-auto w-16 h-16 text-red-600"
              >
                <XCircle size={64} />
              </motion.div>
            )}
          </div>

          {/* Status Message */}
          <h1 className="text-2xl font-bold mb-4">
            {status === 'loading' && 'Processing...'}
            {status === 'success' && 'Success!'}
            {status === 'error' && 'Error'}
          </h1>
          
          <p className="text-gray-600 mb-4">
            {message}
          </p>

          {/* Debug Information */}
          {debugInfo && (
            <div className="mb-4 p-3 bg-gray-100 rounded text-xs text-left overflow-auto max-h-32">
              <strong>Debug Info:</strong><br />
              {debugInfo}
            </div>
          )}

          {/* Progress Bar for Loading */}
          {status === 'loading' && (
            <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
              <motion.div
                className="bg-black h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 3, ease: "easeInOut" }}
              />
            </div>
          )}

          {/* Action Buttons */}
          {status === 'error' && (
            <div className="space-y-3">
              <button
                onClick={() => navigate('/signin')}
                className="w-full bg-black text-white px-6 py-3 font-semibold hover:bg-gray-900 transition-colors duration-200"
              >
                Try Again
              </button>
              <button
                onClick={() => navigate('/')}
                className="w-full bg-gray-200 text-black px-6 py-3 font-semibold hover:bg-gray-300 transition-colors duration-200"
              >
                Go Home
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

export default AuthCallback 