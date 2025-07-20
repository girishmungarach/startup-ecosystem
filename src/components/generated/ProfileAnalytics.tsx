"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Eye, 
  Users, 
  TrendingUp, 
  Calendar, 
  Star, 
  MessageCircle, 
  Share2, 
  Target,
  Activity,
  BarChart3,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { supabase } from '../../services/supabase';
import { useAuth } from '../../contexts/AuthContext';

interface AnalyticsData {
  profileViews: number;
  profileViewsChange: number;
  connections: number;
  connectionsChange: number;
  opportunitiesPosted: number;
  opportunitiesPostedChange: number;
  bookmarks: number;
  bookmarksChange: number;
  responseRate: number;
  responseRateChange: number;
  recentActivity: ActivityItem[];
  topInterests: InterestMetric[];
  engagementTrend: EngagementData[];
}

interface ActivityItem {
  id: string;
  type: 'view' | 'connection' | 'opportunity' | 'bookmark';
  description: string;
  timestamp: string;
  user?: {
    id: string;
    name: string;
    role: string;
  };
}

interface InterestMetric {
  interest: string;
  count: number;
  percentage: number;
}

interface EngagementData {
  date: string;
  views: number;
  connections: number;
  opportunities: number;
}

const ProfileAnalytics: React.FC = () => {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');

  useEffect(() => {
    const loadAnalytics = async () => {
      if (!user) return;

      setIsLoading(true);
      try {
        // Load profile views (simulated for now)
        const profileViews = Math.floor(Math.random() * 100) + 50;
        const profileViewsChange = Math.floor(Math.random() * 20) - 10;

        // Load connections
        const { count: connectionsCount } = await supabase
          .from('connections')
          .select('*', { count: 'exact', head: true })
          .or(`requester_id.eq.${user.id},responder_id.eq.${user.id}`)
          .eq('status', 'accepted');

        const { count: connectionsCountPrev } = await supabase
          .from('connections')
          .select('*', { count: 'exact', head: true })
          .or(`requester_id.eq.${user.id},responder_id.eq.${user.id}`)
          .eq('status', 'accepted')
          .lt('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

        const connectionsChange = connectionsCountPrev ? 
          Math.round(((connectionsCount || 0) - connectionsCountPrev) / connectionsCountPrev * 100) : 0;

        // Load opportunities posted
        const { count: opportunitiesCount } = await supabase
          .from('opportunities')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id);

        const { count: opportunitiesCountPrev } = await supabase
          .from('opportunities')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .lt('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

        const opportunitiesChange = opportunitiesCountPrev ? 
          Math.round(((opportunitiesCount || 0) - opportunitiesCountPrev) / opportunitiesCountPrev * 100) : 0;

        // Load bookmarks received
        const { count: bookmarksCount } = await supabase
          .from('bookmarks')
          .select('*', { count: 'exact', head: true })
          .eq('profile_id', user.id);

        const { count: bookmarksCountPrev } = await supabase
          .from('bookmarks')
          .select('*', { count: 'exact', head: true })
          .eq('profile_id', user.id)
          .lt('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

        const bookmarksChange = bookmarksCountPrev ? 
          Math.round(((bookmarksCount || 0) - bookmarksCountPrev) / bookmarksCountPrev * 100) : 0;

        // Calculate response rate (simulated)
        const responseRate = Math.floor(Math.random() * 40) + 60;
        const responseRateChange = Math.floor(Math.random() * 20) - 10;

        // Load recent activity
        const { data: recentConnections } = await supabase
          .from('connections')
          .select(`
            id,
            created_at,
            requester_id,
            responder_id,
            profiles!connections_requester_id_fkey(id, full_name, role),
            profiles!connections_responder_id_fkey(id, full_name, role)
          `)
          .or(`requester_id.eq.${user.id},responder_id.eq.${user.id}`)
          .order('created_at', { ascending: false })
          .limit(5);

        const recentActivity: ActivityItem[] = recentConnections?.map(conn => ({
          id: conn.id,
          type: 'connection',
          description: `New connection with ${conn.requester_id === user.id ? 
            conn.profiles?.full_name : conn.profiles?.full_name}`,
          timestamp: conn.created_at,
          user: {
            id: conn.requester_id === user.id ? conn.responder_id : conn.requester_id,
            name: conn.requester_id === user.id ? 
              conn.profiles?.full_name || 'Unknown' : 
              conn.profiles?.full_name || 'Unknown',
            role: conn.requester_id === user.id ? 
              conn.profiles?.role || 'Unknown' : 
              conn.profiles?.role || 'Unknown'
          }
        })) || [];

        // Generate mock data for interests and engagement
        const topInterests: InterestMetric[] = [
          { interest: 'AI/ML', count: 45, percentage: 35 },
          { interest: 'SaaS', count: 32, percentage: 25 },
          { interest: 'Fintech', count: 28, percentage: 22 },
          { interest: 'HealthTech', count: 15, percentage: 12 },
          { interest: 'EdTech', count: 8, percentage: 6 }
        ];

        const engagementTrend: EngagementData[] = Array.from({ length: 7 }, (_, i) => ({
          date: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000).toLocaleDateString(),
          views: Math.floor(Math.random() * 20) + 5,
          connections: Math.floor(Math.random() * 5) + 1,
          opportunities: Math.floor(Math.random() * 3) + 0
        }));

        setAnalytics({
          profileViews,
          profileViewsChange,
          connections: connectionsCount || 0,
          connectionsChange,
          opportunitiesPosted: opportunitiesCount || 0,
          opportunitiesPostedChange: opportunitiesChange,
          bookmarks: bookmarksCount || 0,
          bookmarksChange,
          responseRate,
          responseRateChange,
          recentActivity,
          topInterests,
          engagementTrend
        });
      } catch (error) {
        console.error('Error loading analytics:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAnalytics();
  }, [user, timeRange]);

  const formatNumber = (num: number) => {
    if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
    return num.toString();
  };

  const getChangeIcon = (change: number) => {
    if (change > 0) return <ArrowUp size={16} className="text-green-600" />;
    if (change < 0) return <ArrowDown size={16} className="text-red-600" />;
    return null;
  };

  const getChangeColor = (change: number) => {
    if (change > 0) return 'text-green-600';
    if (change < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white text-black font-sans flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="min-h-screen bg-white text-black font-sans flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">No Analytics Available</h2>
          <p className="text-gray-600">Start building your profile to see analytics.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black font-sans">
      <div className="max-w-7xl mx-auto px-6 py-8 md:px-12 lg:px-24">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold mb-2">Profile Analytics</h1>
          <p className="text-gray-600">Track your profile performance and engagement</p>
        </motion.div>

        {/* Time Range Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex space-x-2">
            {(['7d', '30d', '90d'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  timeRange === range
                    ? 'bg-black text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {range === '7d' ? '7 Days' : range === '30d' ? '30 Days' : '90 Days'}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Key Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Eye className="text-blue-600" size={20} />
              </div>
              {getChangeIcon(analytics.profileViewsChange)}
            </div>
            <h3 className="text-2xl font-bold mb-1">{formatNumber(analytics.profileViews)}</h3>
            <p className="text-gray-600 text-sm mb-2">Profile Views</p>
            <p className={`text-sm font-medium ${getChangeColor(analytics.profileViewsChange)}`}>
              {analytics.profileViewsChange > 0 ? '+' : ''}{analytics.profileViewsChange}% from last period
            </p>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <Users className="text-green-600" size={20} />
              </div>
              {getChangeIcon(analytics.connectionsChange)}
            </div>
            <h3 className="text-2xl font-bold mb-1">{analytics.connections}</h3>
            <p className="text-gray-600 text-sm mb-2">Connections</p>
            <p className={`text-sm font-medium ${getChangeColor(analytics.connectionsChange)}`}>
              {analytics.connectionsChange > 0 ? '+' : ''}{analytics.connectionsChange}% from last period
            </p>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Target className="text-purple-600" size={20} />
              </div>
              {getChangeIcon(analytics.opportunitiesPostedChange)}
            </div>
            <h3 className="text-2xl font-bold mb-1">{analytics.opportunitiesPosted}</h3>
            <p className="text-gray-600 text-sm mb-2">Opportunities Posted</p>
            <p className={`text-sm font-medium ${getChangeColor(analytics.opportunitiesPostedChange)}`}>
              {analytics.opportunitiesPostedChange > 0 ? '+' : ''}{analytics.opportunitiesPostedChange}% from last period
            </p>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Star className="text-yellow-600" size={20} />
              </div>
              {getChangeIcon(analytics.bookmarksChange)}
            </div>
            <h3 className="text-2xl font-bold mb-1">{analytics.bookmarks}</h3>
            <p className="text-gray-600 text-sm mb-2">Bookmarks Received</p>
            <p className={`text-sm font-medium ${getChangeColor(analytics.bookmarksChange)}`}>
              {analytics.bookmarksChange > 0 ? '+' : ''}{analytics.bookmarksChange}% from last period
            </p>
          </div>
        </motion.div>

        {/* Charts and Detailed Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Engagement Trend */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gray-50 p-6 rounded-lg"
          >
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <TrendingUp className="mr-2" size={20} />
              Engagement Trend
            </h3>
            <div className="space-y-3">
              {analytics.engagementTrend.map((data, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{data.date}</span>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm">Views: {data.views}</span>
                    <span className="text-sm">Connections: {data.connections}</span>
                    <span className="text-sm">Opportunities: {data.opportunities}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Top Interests */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gray-50 p-6 rounded-lg"
          >
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <BarChart3 className="mr-2" size={20} />
              Top Interests
            </h3>
            <div className="space-y-3">
              {analytics.topInterests.map((interest, index) => (
                <div key={interest.interest} className="flex items-center justify-between">
                  <span className="text-sm font-medium">{interest.interest}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${interest.percentage}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-600">{interest.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8"
        >
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Activity className="mr-2" size={20} />
            Recent Activity
          </h3>
          <div className="bg-gray-50 p-6 rounded-lg">
            {analytics.recentActivity.length > 0 ? (
              <div className="space-y-4">
                {analytics.recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activity.description}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(activity.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 text-center py-4">No recent activity</p>
            )}
          </div>
        </motion.div>

        {/* Response Rate */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8 bg-blue-50 p-6 rounded-lg"
        >
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <MessageCircle className="mr-2" size={20} />
            Response Rate
          </h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold text-blue-600">{analytics.responseRate}%</p>
              <p className="text-sm text-gray-600">Average response rate to opportunities</p>
            </div>
            <div className="text-right">
              <p className={`text-sm font-medium ${getChangeColor(analytics.responseRateChange)}`}>
                {analytics.responseRateChange > 0 ? '+' : ''}{analytics.responseRateChange}% from last period
              </p>
              {getChangeIcon(analytics.responseRateChange)}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProfileAnalytics; 