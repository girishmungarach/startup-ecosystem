import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Settings, Save, Camera, Eye, EyeOff, Bell, Shield, Globe, Mail, ArrowLeft } from 'lucide-react';
import { supabase } from '../services/supabase';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Cropper from 'react-easy-crop';
import Modal from 'react-modal';

interface ProfileData {
  full_name: string;
  role: string;
  company: string;
  location: string;
  bio: string;
  linkedin_url?: string;
  twitter_url?: string;
  website_url?: string;
  avatar_url?: string; // Add avatar_url for profile picture
  email: string; // Added email field
}

interface SettingsData {
  email_notifications: boolean;
  profile_visibility: 'public' | 'private' | 'connections_only';
  allow_messages: boolean;
  show_contact_info: boolean;
}

const ProfileSettings: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'profile' | 'settings'>('profile');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  const [profileData, setProfileData] = useState<ProfileData>({
    full_name: '',
    role: '',
    company: '',
    location: '',
    bio: '',
    linkedin_url: '',
    twitter_url: '',
    website_url: '',
    avatar_url: '', // Add avatar_url for profile picture
    email: '', // Added email field
  });

  const [settingsData, setSettingsData] = useState<SettingsData>({
    email_notifications: true,
    profile_visibility: 'public',
    allow_messages: true,
    show_contact_info: true
  });

  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  });

  const [profileError, setProfileError] = useState<string | null>(null);
  const [profileSuccess, setProfileSuccess] = useState<string | null>(null);

  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [showCropModal, setShowCropModal] = useState(false);

  const onCropComplete = (croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const getCroppedImg = async (imageSrc, crop) => {
    const createImage = (url) => new Promise((resolve, reject) => {
      const image = new window.Image();
      image.addEventListener('load', () => resolve(image));
      image.addEventListener('error', error => reject(error));
      image.setAttribute('crossOrigin', 'anonymous');
      image.src = url;
    });
    const image = await createImage(imageSrc);
    const canvas = document.createElement('canvas');
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(
      image,
      crop.x,
      crop.y,
      crop.width,
      crop.height,
      0,
      0,
      crop.width,
      crop.height
    );
    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        resolve(blob);
      }, 'image/jpeg');
    });
  };

  // Load profile data
  useEffect(() => {
    const loadProfile = async () => {
      if (!user) return;

      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Error loading profile:', error);
          return;
        }

        if (data) {
          setProfileData({
            full_name: data.full_name || '',
            role: data.role || '',
            company: data.company || '',
            location: data.location || '',
            bio: data.bio || '',
            linkedin_url: data.linkedin_url || '',
            twitter_url: data.twitter_url || '',
            website_url: data.website_url || '',
            avatar_url: data.avatar_url || '',
            email: data.email || user.email || '', // Set email
          });
        }
      } catch (error) {
        console.error('Failed to load profile:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [user]);

  const handleProfileSave = async () => {
    if (!user) return;

    setIsSaving(true);
    setProfileError(null);
    setProfileSuccess(null);
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          ...profileData,
          email: profileData.email || user.email, // Ensure email is included
          updated_at: new Date().toISOString()
        });

      if (error) {
        setProfileError(error.message || 'Failed to save profile. Please try again.');
        return;
      }

      setProfileSuccess('Profile updated successfully!');
    } catch (error) {
      setProfileError(error instanceof Error ? error.message : 'Failed to save profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordChange = async () => {
    if (!user) return;

    if (passwordData.new_password !== passwordData.confirm_password) {
      alert('New passwords do not match!');
      return;
    }

    if (passwordData.new_password.length < 6) {
      alert('Password must be at least 6 characters long!');
      return;
    }

    setIsSaving(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: passwordData.new_password
      });

      if (error) {
        console.error('Error changing password:', error);
        alert('Failed to change password. Please try again.');
        return;
      }

      alert('Password changed successfully!');
      setPasswordData({
        current_password: '',
        new_password: '',
        confirm_password: ''
      });
    } catch (error) {
      console.error('Failed to change password:', error);
      alert('Failed to change password. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSettingsSave = async () => {
    if (!user) return;

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('user_settings')
        .upsert({
          user_id: user.id,
          ...settingsData,
          updated_at: new Date().toISOString()
        });

      if (error) {
        console.error('Error saving settings:', error);
        return;
      }

      alert('Settings updated successfully!');
    } catch (error) {
      console.error('Failed to save settings:', error);
      alert('Failed to save settings. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!user || !event.target.files || event.target.files.length === 0) return;
    setSelectedImage(event.target.files[0]);
    setShowCropModal(true);
  };

  const handleCropSave = async () => {
    if (!selectedImage || !croppedAreaPixels) return;
    setUploading(true);
    setProfileError(null);
    try {
      const imageDataUrl = URL.createObjectURL(selectedImage);
      const croppedBlob = await getCroppedImg(imageDataUrl, croppedAreaPixels);
      const fileExt = selectedImage.name.split('.').pop();
      const filePath = `avatars/${user.id}.${fileExt}`;
      let { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, croppedBlob, { upsert: true });
      if (uploadError) {
        setProfileError(uploadError.message || 'Failed to upload image.');
        setUploading(false);
        setShowCropModal(false);
        return;
      }
      const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
      const publicUrl = data.publicUrl;
      const { error: updateError } = await supabase.from('profiles').update({ avatar_url: publicUrl, updated_at: new Date().toISOString(), email: profileData.email || user.email }).eq('id', user.id);
      if (updateError) {
        setProfileError(updateError.message || 'Failed to update profile with image.');
        setUploading(false);
        setShowCropModal(false);
        return;
      }
      const { data: profileDataDb, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      if (profileError) {
        setProfileError(profileError.message || 'Failed to reload profile.');
        setUploading(false);
        setShowCropModal(false);
        return;
      }
      setProfileData({
        full_name: profileDataDb.full_name || '',
        role: profileDataDb.role || '',
        company: profileDataDb.company || '',
        location: profileDataDb.location || '',
        bio: profileDataDb.bio || '',
        linkedin_url: profileDataDb.linkedin_url || '',
        twitter_url: profileDataDb.twitter_url || '',
        website_url: profileDataDb.website_url || '',
        avatar_url: profileDataDb.avatar_url || '',
        email: profileDataDb.email || user.email || '',
      });
      setProfileSuccess('Profile picture updated!');
      setShowCropModal(false);
      setSelectedImage(null);
    } catch (error) {
      setProfileError(error instanceof Error ? error.message : 'Failed to upload image.');
      setShowCropModal(false);
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteAvatar = async () => {
    if (!user) return;
    setUploading(true);
    setProfileError(null);
    try {
      // Remove from Supabase Storage
      // Try to delete both .jpg and .png extensions for safety
      const jpgPath = `avatars/${user.id}.jpg`;
      const pngPath = `avatars/${user.id}.png`;
      const jpegPath = `avatars/${user.id}.jpeg`;
      await supabase.storage.from('avatars').remove([jpgPath, pngPath, jpegPath]);
      // Set avatar_url to null in DB
      const { error: updateError } = await supabase.from('profiles').update({ avatar_url: null, updated_at: new Date().toISOString(), email: profileData.email || user.email }).eq('id', user.id);
      if (updateError) {
        setProfileError(updateError.message || 'Failed to update profile.');
        setUploading(false);
        return;
      }
      // Reload profile data
      const { data: profileDataDb, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      if (profileError) {
        setProfileError(profileError.message || 'Failed to reload profile.');
        setUploading(false);
        return;
      }
      setProfileData({
        full_name: profileDataDb.full_name || '',
        role: profileDataDb.role || '',
        company: profileDataDb.company || '',
        location: profileDataDb.location || '',
        bio: profileDataDb.bio || '',
        linkedin_url: profileDataDb.linkedin_url || '',
        twitter_url: profileDataDb.twitter_url || '',
        website_url: profileDataDb.website_url || '',
        avatar_url: profileDataDb.avatar_url || '',
        email: profileDataDb.email || user.email || '',
      });
      setProfileSuccess('Profile picture deleted!');
    } catch (error) {
      setProfileError(error instanceof Error ? error.message : 'Failed to delete image.');
    } finally {
      setUploading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white text-black font-sans flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-lg">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black font-sans">
      {/* Main Content */}
      <main className="px-6 py-8 md:px-12 lg:px-24">
        <div className="max-w-4xl mx-auto">
          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 md:mb-8"
          >
            <div className="flex items-center mb-4 md:mb-6">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center space-x-2 text-gray-600 hover:text-black transition-colors duration-200 mr-4"
              >
                <ArrowLeft size={18} className="md:w-5 md:h-5" />
                <span className="text-sm md:text-base">Back</span>
              </button>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4">
              Profile & Settings
            </h1>
            <p className="text-lg md:text-xl font-light text-gray-600">
              Manage your profile information and account settings
            </p>
          </motion.div>

          {/* Tab Navigation */}
          <div className="flex border-b border-gray-200 mb-6 md:mb-8 overflow-x-auto">
            <button
              onClick={() => setActiveTab('profile')}
              className={`px-4 md:px-6 py-2 md:py-3 text-base md:text-lg font-medium transition-all duration-200 border-b-2 whitespace-nowrap ${
                activeTab === 'profile'
                  ? 'border-black text-black'
                  : 'border-transparent text-gray-600 hover:text-black'
              }`}
            >
              <User size={18} className="inline mr-2 md:w-5 md:h-5" />
              Profile
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`px-4 md:px-6 py-2 md:py-3 text-base md:text-lg font-medium transition-all duration-200 border-b-2 whitespace-nowrap ${
                activeTab === 'settings'
                  ? 'border-black text-black'
                  : 'border-transparent text-gray-600 hover:text-black'
              }`}
            >
              <Settings size={18} className="inline mr-2 md:w-5 md:h-5" />
              Settings
            </button>
          </div>

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              {/* Profile Picture Section */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-4">Profile Picture</h3>
                <div className="flex items-center space-x-6">
                  <div className="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden">
                    {profileData.avatar_url ? (
                      <img src={profileData.avatar_url} alt="Profile" className="w-24 h-24 object-cover rounded-full" />
                    ) : (
                      <User size={48} className="text-gray-600" />
                    )}
                  </div>
                  <div>
                    <label className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-900 transition-colors duration-200 flex items-center space-x-2 cursor-pointer">
                      <Camera size={16} />
                      <span>{uploading ? 'Uploading...' : 'Upload Photo'}</span>
                      <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} disabled={uploading} />
                    </label>
                    <p className="text-sm text-gray-600 mt-2">
                      JPG, PNG or GIF. Max size 2MB.
                    </p>
                  </div>
                  {profileData.avatar_url && (
                    <button
                      onClick={handleDeleteAvatar}
                      className="ml-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200"
                      disabled={uploading}
                    >
                      {uploading ? 'Deleting...' : 'Delete Photo'}
                    </button>
                  )}
                </div>
              </div>

              {/* Basic Information */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold">Basic Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Full Name *</label>
                    <input
                      type="text"
                      value={profileData.full_name}
                      onChange={(e) => setProfileData(prev => ({ ...prev, full_name: e.target.value }))}
                      className="w-full px-3 md:px-4 py-2 md:py-3 text-base border-2 border-gray-300 focus:border-black focus:outline-none transition-colors duration-200"
                      placeholder="Enter your full name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Role *</label>
                    <input
                      type="text"
                      value={profileData.role}
                      onChange={(e) => setProfileData(prev => ({ ...prev, role: e.target.value }))}
                      className="w-full px-3 md:px-4 py-2 md:py-3 text-base border-2 border-gray-300 focus:border-black focus:outline-none transition-colors duration-200"
                      placeholder="e.g., Founder, Developer, Investor"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Company</label>
                    <input
                      type="text"
                      value={profileData.company}
                      onChange={(e) => setProfileData(prev => ({ ...prev, company: e.target.value }))}
                      className="w-full px-3 md:px-4 py-2 md:py-3 text-base border-2 border-gray-300 focus:border-black focus:outline-none transition-colors duration-200"
                      placeholder="Your company name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Location</label>
                    <input
                      type="text"
                      value={profileData.location}
                      onChange={(e) => setProfileData(prev => ({ ...prev, location: e.target.value }))}
                      className="w-full px-3 md:px-4 py-2 md:py-3 text-base border-2 border-gray-300 focus:border-black focus:outline-none transition-colors duration-200"
                      placeholder="City, Country"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Bio</label>
                  <textarea
                    value={profileData.bio}
                    onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                    rows={4}
                    className="w-full px-4 py-3 border-2 border-gray-300 focus:border-black focus:outline-none transition-colors duration-200"
                    placeholder="Tell us about yourself, your experience, and what you're looking for..."
                  />
                </div>
              </div>

              {/* Social Links */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold">Social Links</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">LinkedIn</label>
                    <input
                      type="url"
                      value={profileData.linkedin_url}
                      onChange={(e) => setProfileData(prev => ({ ...prev, linkedin_url: e.target.value }))}
                      className="w-full px-4 py-3 border-2 border-gray-300 focus:border-black focus:outline-none transition-colors duration-200"
                      placeholder="https://linkedin.com/in/yourprofile"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Twitter</label>
                    <input
                      type="url"
                      value={profileData.twitter_url}
                      onChange={(e) => setProfileData(prev => ({ ...prev, twitter_url: e.target.value }))}
                      className="w-full px-4 py-3 border-2 border-gray-300 focus:border-black focus:outline-none transition-colors duration-200"
                      placeholder="https://twitter.com/yourhandle"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2">Website</label>
                    <input
                      type="url"
                      value={profileData.website_url}
                      onChange={(e) => setProfileData(prev => ({ ...prev, website_url: e.target.value }))}
                      className="w-full px-4 py-3 border-2 border-gray-300 focus:border-black focus:outline-none transition-colors duration-200"
                      placeholder="https://yourwebsite.com"
                    />
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <div className="flex justify-end">
                <button
                  onClick={handleProfileSave}
                  disabled={isSaving}
                  className="bg-black text-white px-8 py-3 font-semibold hover:bg-gray-900 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  <Save size={16} />
                  <span>{isSaving ? 'Saving...' : 'Save Profile'}</span>
                </button>
              </div>
              {profileError && (
                <div className="bg-red-50 border-2 border-red-200 p-4 rounded-lg mb-6">
                  <div className="flex items-center space-x-2 text-red-800">
                    <span className="font-medium">Error</span>
                  </div>
                  <p className="text-red-700 mt-2 text-sm">{profileError}</p>
                </div>
              )}
              {profileSuccess && (
                <div className="bg-green-50 border-2 border-green-200 p-4 rounded-lg mb-6">
                  <div className="flex items-center space-x-2 text-green-800">
                    <span className="font-medium">Success</span>
                  </div>
                  <p className="text-green-700 mt-2 text-sm">{profileSuccess}</p>
                </div>
              )}
            </motion.div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              {/* Privacy Settings */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold">Privacy Settings</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <h4 className="font-medium">Profile Visibility</h4>
                      <p className="text-sm text-gray-600">Control who can see your profile</p>
                    </div>
                    <select
                      value={settingsData.profile_visibility}
                      onChange={(e) => setSettingsData(prev => ({ ...prev, profile_visibility: e.target.value as any }))}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:border-black focus:outline-none"
                    >
                      <option value="public">Public</option>
                      <option value="connections_only">Connections Only</option>
                      <option value="private">Private</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <h4 className="font-medium">Allow Messages</h4>
                      <p className="text-sm text-gray-600">Let other users send you messages</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settingsData.allow_messages}
                        onChange={(e) => setSettingsData(prev => ({ ...prev, allow_messages: e.target.checked }))}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-black peer-focus:ring-opacity-20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <h4 className="font-medium">Show Contact Info</h4>
                      <p className="text-sm text-gray-600">Display your email to other users</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settingsData.show_contact_info}
                        onChange={(e) => setSettingsData(prev => ({ ...prev, show_contact_info: e.target.checked }))}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-black peer-focus:ring-opacity-20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Notification Settings */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold">Notification Settings</h3>
                
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h4 className="font-medium">Email Notifications</h4>
                    <p className="text-sm text-gray-600">Receive email updates about opportunities and connections</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settingsData.email_notifications}
                      onChange={(e) => setSettingsData(prev => ({ ...prev, email_notifications: e.target.checked }))}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-black peer-focus:ring-opacity-20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
                  </label>
                </div>
              </div>

              {/* Password Change */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold">Change Password</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Current Password</label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={passwordData.current_password}
                        onChange={(e) => setPasswordData(prev => ({ ...prev, current_password: e.target.value }))}
                        className="w-full px-4 py-3 border-2 border-gray-300 focus:border-black focus:outline-none transition-colors duration-200 pr-12"
                        placeholder="Enter current password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-black"
                      >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">New Password</label>
                    <input
                      type="password"
                      value={passwordData.new_password}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, new_password: e.target.value }))}
                      className="w-full px-4 py-3 border-2 border-gray-300 focus:border-black focus:outline-none transition-colors duration-200"
                      placeholder="Enter new password"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Confirm New Password</label>
                    <input
                      type="password"
                      value={passwordData.confirm_password}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, confirm_password: e.target.value }))}
                      className="w-full px-4 py-3 border-2 border-gray-300 focus:border-black focus:outline-none transition-colors duration-200"
                      placeholder="Confirm new password"
                    />
                  </div>
                </div>

                <button
                  onClick={handlePasswordChange}
                  disabled={isSaving || !passwordData.new_password || !passwordData.confirm_password}
                  className="bg-black text-white px-6 py-3 font-semibold hover:bg-gray-900 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSaving ? 'Changing Password...' : 'Change Password'}
                </button>
              </div>

              {/* Save Settings Button */}
              <div className="flex justify-end">
                <button
                  onClick={handleSettingsSave}
                  disabled={isSaving}
                  className="bg-black text-white px-8 py-3 font-semibold hover:bg-gray-900 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  <Save size={16} />
                  <span>{isSaving ? 'Saving...' : 'Save Settings'}</span>
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </main>
      <Modal
        isOpen={showCropModal}
        onRequestClose={() => setShowCropModal(false)}
        contentLabel="Crop Image"
        ariaHideApp={false}
        style={{ content: { maxWidth: 400, margin: 'auto' } }}
      >
        {selectedImage && (
          <div style={{ position: 'relative', width: 300, height: 300 }}>
            <Cropper
              image={URL.createObjectURL(selectedImage)}
              crop={crop}
              zoom={zoom}
              aspect={1}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
          </div>
        )}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 16 }}>
          <button onClick={() => setShowCropModal(false)} className="bg-gray-300 px-4 py-2 rounded">Cancel</button>
          <button onClick={handleCropSave} className="bg-black text-white px-4 py-2 rounded" disabled={uploading}>{uploading ? 'Uploading...' : 'Save'}</button>
        </div>
      </Modal>
    </div>
  );
};

export default ProfileSettings; 