import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Briefcase, 
  Users, 
  Bookmark, 
  Plus, 
  LogOut, 
  User,
  Menu,
  X,
  Settings
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
// TestPanel removed for production

interface MainLayoutProps {
  children: React.ReactNode
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { user, signOut } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)

  const navigation = [
    { name: 'Opportunities', href: '/opportunities', icon: Briefcase },
    { name: 'Browse Profiles', href: '/profiles', icon: Users },
    { name: 'My Opportunities', href: '/my-opportunities', icon: Plus },
    { name: 'Bookmarks', href: '/bookmarks', icon: Bookmark },
    { name: 'My Connections', href: '/connections', icon: Users },
  ]

  const handleSignOut = async () => {
    try {
      await signOut()
      // The signOut function now handles navigation and clearing
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const isActive = (path: string) => {
    return location.pathname === path
  }

  return (
    <div className="min-h-screen bg-white text-black font-sans">
      {/* Header */}
      <header className="w-full px-6 py-6 md:px-12 lg:px-24 border-b border-gray-200">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <Link to="/" className="text-2xl md:text-3xl font-bold tracking-tight hover:opacity-80 transition-opacity">
              <span className="block">Startup</span>
              <span className="block">Ecosystem</span>
            </Link>
            
            <div className="flex items-center space-x-4">
              {/* User Menu */}
              {user && (
                <div className="relative group">
                  <button className="bg-black text-white p-2 md:p-3 rounded-full shadow-lg hover:bg-gray-900 transition-colors duration-200">
                    <User size={18} className="md:w-5 md:h-5" />
                  </button>
                  
                  {/* Dropdown Menu */}
                  <div className="absolute top-full right-0 mt-2 w-56 md:w-64 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="p-4 border-b border-gray-200">
                      <p className="font-semibold text-black">
                        {user.email}
                      </p>
                      <p className="text-sm text-gray-600">
                        User
                      </p>
                    </div>
                    
                    <div className="p-2">
                      <Link
                        to="/profile/settings"
                        className="flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors duration-200"
                      >
                        <User size={16} />
                        <div>
                          <span className="block">My Profile</span>
                          <span className="text-xs text-gray-500">View and edit your profile</span>
                        </div>
                      </Link>
                      
                      <Link
                        to="/profile/settings?tab=settings"
                        className="flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors duration-200"
                      >
                        <Settings size={16} />
                        <div>
                          <span className="block">Settings</span>
                          <span className="text-xs text-gray-500">Account and privacy settings</span>
                        </div>
                      </Link>
                      
                      <button
                        onClick={handleSignOut}
                        className="flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors duration-200 w-full"
                      >
                        <LogOut size={16} />
                        <div>
                          <span className="block">Sign Out</span>
                          <span className="text-xs text-gray-500">Sign out of your account</span>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Mobile menu button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-md hover:bg-gray-100 transition-colors"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex flex-wrap items-center gap-8">
            {navigation.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center space-x-2 text-lg font-medium transition-colors duration-200 ${
                    isActive(item.href)
                      ? 'text-black border-b-2 border-black pb-1'
                      : 'text-gray-600 hover:text-black'
                  }`}
                >
                  <Icon size={20} />
                  <span>{item.name}</span>
                </Link>
              )
            })}
          </nav>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <motion.nav
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden space-y-4 py-4 border-t border-gray-200"
            >
              {navigation.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center space-x-3 text-lg font-medium transition-colors duration-200 ${
                      isActive(item.href)
                        ? 'text-black'
                        : 'text-gray-600 hover:text-black'
                    }`}
                  >
                    <Icon size={20} />
                    <span>{item.name}</span>
                  </Link>
                )
              })}
            </motion.nav>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="px-6 py-8 md:px-12 lg:px-24">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>


    </div>
  )
}

export default MainLayout 