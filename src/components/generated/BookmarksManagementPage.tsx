"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bookmark, 
  Search, 
  Filter, 
  X, 
  Trash2, 
  Download, 
  Calendar,
  User,
  Briefcase,
  TrendingUp,
  Calendar as CalendarIcon,
  MapPin,
  Building,
  ExternalLink,
  AlertCircle,
  Loader2,
  CheckSquare,
  Square
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { bookmarksService, Bookmark as BookmarkType, BookmarkFilters } from '../../services/bookmarks';

const BookmarksManagementPage: React.FC = () => {
  const { user } = useAuth();
  const [bookmarks, setBookmarks] = useState<BookmarkType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<'all' | 'profile' | 'job' | 'investment' | 'event'>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedBookmarks, setSelectedBookmarks] = useState<string[]>([]);
  const [stats, setStats] = useState<{
    total: number;
    byType: Record<string, number>;
    recent: number;
  } | null>(null);

  // Load bookmarks and stats
  useEffect(() => {
    const loadData = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        setError(null);
        
        const [bookmarksData, statsData] = await Promise.all([
          bookmarksService.getBookmarks(user.id),
          bookmarksService.getBookmarkStats(user.id)
        ]);
        
        setBookmarks(bookmarksData);
        setStats(statsData);
      } catch (err) {
        setError('Failed to load bookmarks');
        console.error('Error loading bookmarks:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [user]);

  // Filter bookmarks
  const filteredBookmarks = useMemo(() => {
    return bookmarks.filter(bookmark => {
      const matchesType = selectedType === 'all' || bookmark.type === selectedType;
      
      const item = bookmark.profile || bookmark.job || bookmark.investment || bookmark.event;
      const matchesSearch = searchQuery === '' || 
        (item?.name || item?.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item?.description || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item?.company || '').toLowerCase().includes(searchQuery.toLowerCase());
      
      return matchesType && matchesSearch;
    });
  }, [bookmarks, selectedType, searchQuery]);

  // Toggle bookmark selection
  const toggleBookmarkSelection = (bookmarkId: string) => {
    setSelectedBookmarks(prev => 
      prev.includes(bookmarkId) 
        ? prev.filter(id => id !== bookmarkId)
        : [...prev, bookmarkId]
    );
  };

  // Select all bookmarks
  const selectAllBookmarks = () => {
    setSelectedBookmarks(filteredBookmarks.map(b => b.id));
  };

  // Clear selection
  const clearSelection = () => {
    setSelectedBookmarks([]);
  };

  // Remove selected bookmarks
  const removeSelectedBookmarks = async () => {
    if (!user || selectedBookmarks.length === 0) return;
    
    try {
      await bookmarksService.bulkRemoveBookmarks(user.id, selectedBookmarks);
      
      // Update local state
      setBookmarks(prev => prev.filter(b => !selectedBookmarks.includes(b.id)));
      setSelectedBookmarks([]);
      
      // Reload stats
      const newStats = await bookmarksService.getBookmarkStats(user.id);
      setStats(newStats);
    } catch (err) {
      console.error('Error removing bookmarks:', err);
      setError('Failed to remove bookmarks');
    }
  };

  // Remove single bookmark
  const removeBookmark = async (bookmarkId: string) => {
    if (!user) return;
    
    try {
      const bookmark = bookmarks.find(b => b.id === bookmarkId);
      if (!bookmark) return;
      
      await bookmarksService.removeBookmark(user.id, bookmark.item_id, bookmark.type);
      
      // Update local state
      setBookmarks(prev => prev.filter(b => b.id !== bookmarkId));
      setSelectedBookmarks(prev => prev.filter(id => id !== bookmarkId));
      
      // Reload stats
      const newStats = await bookmarksService.getBookmarkStats(user.id);
      setStats(newStats);
    } catch (err) {
      console.error('Error removing bookmark:', err);
      setError('Failed to remove bookmark');
    }
  };

  // Get item display data
  const getItemDisplayData = (bookmark: BookmarkType) => {
    const item = bookmark.profile || bookmark.job || bookmark.investment || bookmark.event;
    
    switch (bookmark.type) {
      case 'profile':
        return {
          title: item?.name || 'Unknown Profile',
          subtitle: `${item?.role || 'Unknown Role'} at ${item?.company || 'Unknown Company'}`,
          description: item?.current_project || 'No project information',
          icon: <User size={20} className="text-blue-600" />,
          type: 'Profile'
        };
      case 'job':
        return {
          title: item?.title || 'Unknown Job',
          subtitle: `${item?.company || 'Unknown Company'} • ${item?.location || 'Remote'}`,
          description: item?.description || 'No description available',
          icon: <Briefcase size={20} className="text-green-600" />,
          type: 'Job'
        };
      case 'investment':
        return {
          title: item?.title || 'Unknown Investment',
          subtitle: `${item?.company || 'Unknown Company'} • ${item?.stage || 'Unknown Stage'}`,
          description: item?.description || 'No description available',
          icon: <TrendingUp size={20} className="text-purple-600" />,
          type: 'Investment'
        };
      case 'event':
        return {
          title: item?.title || 'Unknown Event',
          subtitle: `${item?.location || 'Online'} • ${item?.date ? new Date(item.date).toLocaleDateString() : 'TBD'}`,
          description: item?.description || 'No description available',
          icon: <CalendarIcon size={20} className="text-orange-600" />,
          type: 'Event'
        };
      default:
        return {
          title: 'Unknown Item',
          subtitle: 'Unknown details',
          description: 'No information available',
          icon: <Bookmark size={20} className="text-gray-600" />,
          type: 'Unknown'
        };
    }
  };

  // Skeleton component
  const SkeletonCard = () => (
    <div className="bg-white border-2 border-gray-200 p-6 animate-pulse">
      <div className="flex items-start space-x-4">
        <div className="w-6 h-6 bg-gray-200 rounded"></div>
        <div className="flex-1">
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white text-black font-sans">
      {/* Main Content */}
      <main className="px-6 py-8 md:px-12 lg:px-24">
        <div className="max-w-7xl mx-auto">
          
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              My Bookmarks
            </h1>
            <p className="text-xl md:text-2xl font-light max-w-3xl mx-auto">
              Manage your saved profiles, jobs, investments, and events in one place.
            </p>
          </motion.div>

          {/* Stats */}
          {stats && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
            >
              <div className="bg-gray-50 p-6 border-2 border-gray-200 text-center">
                <Bookmark size={32} className="mx-auto mb-2 text-gray-600" />
                <div className="text-2xl font-bold">{stats.total}</div>
                <div className="text-gray-600">Total Bookmarks</div>
              </div>
              <div className="bg-gray-50 p-6 border-2 border-gray-200 text-center">
                <User size={32} className="mx-auto mb-2 text-blue-600" />
                <div className="text-2xl font-bold">{stats.byType.profile || 0}</div>
                <div className="text-gray-600">Profiles</div>
              </div>
              <div className="bg-gray-50 p-6 border-2 border-gray-200 text-center">
                <Briefcase size={32} className="mx-auto mb-2 text-green-600" />
                <div className="text-2xl font-bold">{stats.byType.job || 0}</div>
                <div className="text-gray-600">Jobs</div>
              </div>
              <div className="bg-gray-50 p-6 border-2 border-gray-200 text-center">
                <Calendar size={32} className="mx-auto mb-2 text-orange-600" />
                <div className="text-2xl font-bold">{stats.recent}</div>
                <div className="text-gray-600">Recent (7 days)</div>
              </div>
            </motion.div>
          )}

          {/* Search and Filters */}
          <section className="mb-8">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input 
                  type="text" 
                  placeholder="Search bookmarks..." 
                  value={searchQuery} 
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 text-lg border-2 border-gray-300 focus:border-black focus:outline-none focus:ring-4 focus:ring-black focus:ring-opacity-10 transition-all duration-200"
                />
              </div>

              {/* Type Filter */}
              <select 
                value={selectedType}
                onChange={e => setSelectedType(e.target.value as any)}
                className="px-6 py-4 text-lg border-2 border-gray-300 focus:border-black focus:outline-none focus:ring-4 focus:ring-black focus:ring-opacity-10 transition-all duration-200"
              >
                <option value="all">All Types</option>
                <option value="profile">Profiles</option>
                <option value="job">Jobs</option>
                <option value="investment">Investments</option>
                <option value="event">Events</option>
              </select>

              {/* Filter Toggle */}
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 px-6 py-4 border-2 border-gray-300 hover:border-black transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-black focus:ring-opacity-10"
              >
                <Filter size={20} />
                <span className="font-semibold">Filters</span>
              </button>
            </div>

            {/* Bulk Actions */}
            {selectedBookmarks.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between p-4 bg-gray-50 border-2 border-gray-200 mb-6"
              >
                <div className="flex items-center space-x-4">
                  <span className="font-semibold">
                    {selectedBookmarks.length} bookmark{selectedBookmarks.length !== 1 ? 's' : ''} selected
                  </span>
                  <button 
                    onClick={clearSelection}
                    className="text-gray-600 hover:text-black transition-colors"
                  >
                    Clear selection
                  </button>
                </div>
                <div className="flex items-center space-x-3">
                  <button 
                    onClick={removeSelectedBookmarks}
                    className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 font-semibold hover:bg-red-700 transition-all duration-200"
                  >
                    <Trash2 size={16} />
                    <span>Remove Selected</span>
                  </button>
                </div>
              </motion.div>
            )}
          </section>

          {/* Results */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-semibold">
                {filteredBookmarks.length} {filteredBookmarks.length === 1 ? 'Bookmark' : 'Bookmarks'} Found
              </h3>
              {filteredBookmarks.length > 0 && (
                <div className="flex items-center space-x-3">
                  <button 
                    onClick={selectAllBookmarks}
                    className="flex items-center space-x-2 text-gray-600 hover:text-black transition-colors"
                  >
                    <CheckSquare size={16} />
                    <span>Select All</span>
                  </button>
                </div>
              )}
            </div>

            {/* Error State */}
            {error && !isLoading && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
                <div className="mb-6">
                  <AlertCircle size={64} className="mx-auto text-red-300" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-red-600">Error Loading Bookmarks</h3>
                <p className="text-gray-600 text-lg mb-6">{error}</p>
                <button 
                  onClick={() => window.location.reload()} 
                  className="bg-black text-white px-6 py-3 text-lg font-semibold hover:bg-gray-900 transition-all duration-200"
                >
                  Try Again
                </button>
              </motion.div>
            )}

            {/* Loading State */}
            {isLoading && (
              <div className="space-y-6">
                {Array.from({ length: 6 }).map((_, index) => (
                  <SkeletonCard key={index} />
                ))}
              </div>
            )}

            {/* Empty State */}
            {!isLoading && !error && filteredBookmarks.length === 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-16"
              >
                <Bookmark size={64} className="mx-auto mb-6 text-gray-400" />
                <h3 className="text-2xl font-semibold mb-4">No bookmarks found</h3>
                <p className="text-lg text-gray-600 mb-6">
                  {searchQuery || selectedType !== 'all' 
                    ? 'Try adjusting your search criteria or filters.'
                    : 'Start bookmarking profiles, jobs, investments, and events to see them here.'
                  }
                </p>
                {(searchQuery || selectedType !== 'all') && (
                  <button 
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedType('all');
                    }}
                    className="bg-black text-white px-6 py-3 font-semibold hover:bg-gray-900 transition-all duration-200"
                  >
                    Clear Filters
                  </button>
                )}
              </motion.div>
            )}

            {/* Bookmarks List */}
            {!isLoading && !error && filteredBookmarks.length > 0 && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="space-y-6"
              >
                {filteredBookmarks.map((bookmark, index) => {
                  const displayData = getItemDisplayData(bookmark);
                  const isSelected = selectedBookmarks.includes(bookmark.id);
                  
                  return (
                    <motion.div 
                      key={bookmark.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className={`bg-white border-2 p-6 hover:border-black transition-all duration-300 group ${
                        isSelected ? 'border-black bg-gray-50' : 'border-gray-200'
                      }`}
                    >
                      <div className="flex items-start space-x-4">
                        {/* Selection Checkbox */}
                        <button 
                          onClick={() => toggleBookmarkSelection(bookmark.id)}
                          className="mt-1"
                        >
                          {isSelected ? (
                            <CheckSquare size={20} className="text-black" />
                          ) : (
                            <Square size={20} className="text-gray-400 hover:text-gray-600" />
                          )}
                        </button>

                        {/* Icon */}
                        <div className="mt-1">
                          {displayData.icon}
                        </div>

                        {/* Content */}
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h4 className="text-xl font-bold">{displayData.title}</h4>
                              <p className="text-gray-600 flex items-center space-x-1">
                                <span>{displayData.subtitle}</span>
                              </p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium border border-gray-200">
                                {displayData.type}
                              </span>
                              <button 
                                onClick={() => removeBookmark(bookmark.id)}
                                className="p-2 text-gray-400 hover:text-red-600 transition-colors opacity-0 group-hover:opacity-100"
                                title="Remove bookmark"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                          
                          <p className="text-gray-700 leading-relaxed mb-3">
                            {displayData.description}
                          </p>
                          
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500">
                              Bookmarked on {new Date(bookmark.created_at).toLocaleDateString()}
                            </span>
                            <button className="text-black hover:text-gray-600 transition-colors duration-200 flex items-center space-x-2 font-medium">
                              <ExternalLink size={16} />
                              <span>View Details</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
};

export default BookmarksManagementPage;