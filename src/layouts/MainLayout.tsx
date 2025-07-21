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
  Settings,
  Bell
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import NotificationsDropdown from '../components/NotificationsDropdown'
import { useNotifications } from '../hooks/useNotifications'
import { AnimatePresence } from 'framer-motion'
// TestPanel removed for production

interface MainLayoutProps {
  children: React.ReactNode
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { user, signOut } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const { unreadCount } = useNotifications(user?.id)
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)
  const [userMenuOpen, setUserMenuOpen] = React.useState(false)
  const [notificationsOpen, setNotificationsOpen] = React.useState(false)
  const userMenuRef = React.useRef<HTMLDivElement>(null)
  const userMenuButtonRef = React.useRef<HTMLButtonElement>(null)
  const userMenuDropdownRef = React.useRef<HTMLDivElement>(null)

  // Helper to get user initials
  const getUserInitials = () => {
    if (!user) return '';
    // Supabase user object: full_name is usually in user_metadata
    const fullName = user.user_metadata?.full_name;
    if (fullName) {
      return fullName.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase();
    }
    if (user.email) {
      return user.email[0].toUpperCase();
    }
    return '';
  };

  // Close user menu on outside click or tab out
  React.useEffect(() => {
    if (!userMenuOpen) return;
    function handleClick(event: MouseEvent) {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setUserMenuOpen(false)
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setUserMenuOpen(false)
        userMenuButtonRef.current?.focus()
      }
      // Trap focus inside dropdown
      if (event.key === 'Tab' && userMenuDropdownRef.current) {
        const focusableEls = userMenuDropdownRef.current.querySelectorAll<HTMLElement>(
          'a, button, [tabindex]:not([tabindex="-1"])'
        );
        const firstEl = focusableEls[0];
        const lastEl = focusableEls[focusableEls.length - 1];
        if (!event.shiftKey && document.activeElement === lastEl) {
          event.preventDefault();
          firstEl.focus();
        } else if (event.shiftKey && document.activeElement === firstEl) {
          event.preventDefault();
          lastEl.focus();
        }
      }
    }
    document.addEventListener('mousedown', handleClick)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handleClick)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [userMenuOpen])

  // Prevent background scroll on mobile when menu is open
  React.useEffect(() => {
    if (userMenuOpen && window.innerWidth < 768) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [userMenuOpen]);

  // Focus first menu item when opened
  React.useEffect(() => {
    if (userMenuOpen && userMenuDropdownRef.current) {
      const firstItem = userMenuDropdownRef.current.querySelector<HTMLElement>('a, button');
      firstItem?.focus();
    }
  }, [userMenuOpen]);

  // Keyboard open/close
  const handleUserMenuButtonKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setUserMenuOpen((open) => !open);
      setMobileMenuOpen(false);
    } else if (e.key === 'ArrowDown' && !userMenuOpen) {
      setUserMenuOpen(true);
      setMobileMenuOpen(false);
    }
  };

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
            <Link to="/" className="text-2xl md:text-3xl font-bold tracking-tight hover:opacity-80 transition-opacity" style={{ fontFamily: 'Abril Fatface, serif', fontWeight: 'normal' }}>
              <span className="block">Startup</span>
              <span className="block">Ecosystem</span>
            </Link>
            
            <div className="flex items-center space-x-4">
              {/* Notifications */}
              {user && (
                <div className="relative">
                  <button
                    onClick={() => {
                      setNotificationsOpen((open) => !open);
                      setUserMenuOpen(false);
                      setMobileMenuOpen(false);
                    }}
                    className="p-2 md:p-3 text-gray-600 hover:text-black hover:bg-gray-100 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-black touch-manipulation relative"
                    aria-label="Open notifications"
                  >
                    <Bell size={20} className="md:w-5 md:h-5" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                        {unreadCount > 99 ? '99+' : unreadCount}
                      </span>
                    )}
                  </button>
                  <NotificationsDropdown 
                    isOpen={notificationsOpen} 
                    onClose={() => setNotificationsOpen(false)} 
                  />
                </div>
              )}
              
              {/* User Menu */}
              {user && (
                <div className="relative" ref={userMenuRef}>
                  <button
                    ref={userMenuButtonRef}
                    className={`bg-black text-white p-2 md:p-3 rounded-full shadow-lg hover:bg-gray-900 active:bg-gray-800 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-black touch-manipulation flex items-center justify-center ${userMenuOpen ? 'ring-2 ring-black ring-offset-2' : ''} min-w-[44px] min-h-[44px]`}
                    aria-haspopup="menu"
                    aria-expanded={userMenuOpen}
                    aria-controls="user-menu-dropdown"
                    aria-label="Open user menu"
                    onClick={() => {
                      setUserMenuOpen((open) => !open);
                      setMobileMenuOpen(false);
                    }}
                    tabIndex={0}
                  >
                    <span className="font-bold text-lg md:text-xl select-none" aria-hidden="true">{getUserInitials() || <User size={18} className="md:w-5 md:h-5" />}</span>
                  </button>
                  {/* Dropdown Menu */}
                  <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      ref={userMenuDropdownRef}
                      id="user-menu-dropdown"
                      initial={window.innerWidth < 768 ? { opacity: 0, y: -32 } : { opacity: 0, scale: 0.98, y: -8 }}
                      animate={window.innerWidth < 768 ? { opacity: 1, y: 0 } : { opacity: 1, scale: 1, y: 0 }}
                      exit={window.innerWidth < 768 ? { opacity: 0, y: -32 } : { opacity: 0, scale: 0.98, y: -8 }}
                      transition={{ duration: 0.18 }}
                      className={
                        window.innerWidth < 768
                          ? 'fixed inset-0 top-0 left-0 w-full h-full bg-white z-[1000] flex flex-col md:hidden pointer-events-auto'
                          : 'absolute top-full right-0 mt-2 w-56 md:w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-[1000] animate-fadeIn transform origin-top-right focus:outline-none pointer-events-auto'
                      }
                      tabIndex={-1}
                      aria-modal="true"
                      role="menu"
                    >
                      {/* Mobile close button */}
                      <div className="md:hidden flex items-center justify-between px-4 py-4 border-b border-gray-200">
                        <span className="font-semibold text-lg">Menu</span>
                        <button
                          onClick={() => setUserMenuOpen(false)}
                          className="p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-black"
                          aria-label="Close menu"
                        >
                          <X size={24} />
                        </button>
                      </div>
                      <div className={window.innerWidth < 768 ? 'flex-1 flex flex-col justify-center space-y-2 px-6 py-8' : 'p-2'}>
                        <div className="p-4 border-b border-gray-200">
                          <p className="font-semibold text-black">
                            {user.email}
                          </p>
                          <p className="text-sm text-gray-600">
                            User
                          </p>
                        </div>
                        <Link
                          to="/profile/settings"
                          className="flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors duration-200"
                          onClick={() => setUserMenuOpen(false)}
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
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <Settings size={16} />
                          <div>
                            <span className="block">Settings</span>
                            <span className="text-xs text-gray-500">Account and privacy settings</span>
                          </div>
                        </Link>
                        <Link
                          to="/bookmarks"
                          className="flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors duration-200"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <Bookmark size={16} />
                          <div>
                            <span className="block">My Bookmarks</span>
                            <span className="text-xs text-gray-500">View saved opportunities and profiles</span>
                          </div>
                        </Link>
                        <Link
                          to="/notifications"
                          className="flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors duration-200"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <Bell size={16} />
                          <div>
                            <span className="block">Notifications</span>
                            <span className="text-xs text-gray-500">
                              {unreadCount > 0 ? `${unreadCount} unread` : 'View all notifications'}
                            </span>
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
                    </motion.div>
                  )}
                  </AnimatePresence>
                </div>
              )}
              
              {/* Mobile menu button */}
              <button
                onClick={() => {
                  setMobileMenuOpen(!mobileMenuOpen);
                  setUserMenuOpen(false); // Close user menu when mobile menu is opened
                }}
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
              
              {/* Mobile User Menu Items */}
              {user && (
                <>
                  <div className="border-t border-gray-200 pt-4 mt-4">
                    <div className="px-3 py-2 mb-2">
                      <p className="font-semibold text-black text-sm">
                        {user.email}
                      </p>
                      <p className="text-xs text-gray-600">
                        User
                      </p>
                    </div>
                    
                    <Link
                      to="/profile/settings"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center space-x-3 px-4 py-4 text-gray-700 hover:bg-gray-100 active:bg-gray-200 rounded-md transition-colors duration-200 touch-manipulation"
                    >
                      <User size={20} />
                      <div>
                        <span className="block text-base font-medium">My Profile</span>
                        <span className="text-xs text-gray-500">View and edit your profile</span>
                      </div>
                    </Link>
                    
                    <Link
                      to="/profile/settings?tab=settings"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center space-x-3 px-4 py-4 text-gray-700 hover:bg-gray-100 active:bg-gray-200 rounded-md transition-colors duration-200 touch-manipulation"
                    >
                      <Settings size={20} />
                      <div>
                        <span className="block text-base font-medium">Settings</span>
                        <span className="text-xs text-gray-500">Account and privacy settings</span>
                      </div>
                    </Link>
                    
                    <Link
                      to="/bookmarks"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center space-x-3 px-4 py-4 text-gray-700 hover:bg-gray-100 active:bg-gray-200 rounded-md transition-colors duration-200 touch-manipulation"
                    >
                      <Bookmark size={20} />
                      <div>
                        <span className="block text-base font-medium">My Bookmarks</span>
                        <span className="text-xs text-gray-500">View saved opportunities and profiles</span>
                      </div>
                    </Link>
                    
                    <Link
                      to="/notifications"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center space-x-3 px-4 py-4 text-gray-700 hover:bg-gray-100 active:bg-gray-200 rounded-md transition-colors duration-200 touch-manipulation"
                    >
                      <Bell size={20} />
                      <div>
                        <span className="block text-base font-medium">Notifications</span>
                        <span className="text-xs text-gray-500">
                          {unreadCount > 0 ? `${unreadCount} unread` : 'View all notifications'}
                        </span>
                      </div>
                    </Link>
                    
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        handleSignOut();
                      }}
                      className="flex items-center space-x-3 px-4 py-4 text-gray-700 hover:bg-gray-100 active:bg-gray-200 rounded-md transition-colors duration-200 w-full text-left touch-manipulation"
                    >
                      <LogOut size={20} />
                      <div>
                        <span className="block text-base font-medium">Sign Out</span>
                        <span className="text-xs text-gray-500">Sign out of your account</span>
                      </div>
                    </button>
                  </div>
                </>
              )}
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