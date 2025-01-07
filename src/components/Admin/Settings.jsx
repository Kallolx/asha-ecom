import React, { useState, useEffect } from 'react';
import { FiSave, FiAlertCircle } from 'react-icons/fi';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const Settings = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [settings, setSettings] = useState({
    siteSettings: {
      siteName: '',
      siteDescription: '',
      contactEmail: '',
      phoneNumber: '',
      address: '',
      currency: 'USD',
      taxRate: 0,
    },
    orderSettings: {
      minimumOrderAmount: 0,
      freeShippingThreshold: 0,
      defaultShippingFee: 0,
      allowGuestCheckout: true,
      requirePhoneNumber: true,
    },
    emailNotifications: {
      orderConfirmation: true,
      orderStatusUpdate: true,
      orderShipped: true,
      orderDelivered: true,
      lowStockAlert: true,
    },
    appearance: {
      primaryColor: '#3B82F6',
      accentColor: '#10B981',
      darkMode: false,
      showHero: true,
      showFeaturedProducts: true,
      showCategories: true,
    }
  });

  // Fetch settings
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const settingsDoc = await getDoc(doc(db, 'settings', 'general'));
        if (settingsDoc.exists()) {
          setSettings(prevSettings => ({
            ...prevSettings,
            ...settingsDoc.data()
          }));
        }
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching settings:', error);
        toast.error('Failed to load settings');
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, []);

  // Handle input changes
  const handleChange = (section, field, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  // Save settings
  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateDoc(doc(db, 'settings', 'general'), settings);
      toast.success('Settings saved successfully');
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save settings');
    }
    setIsSaving(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FiSave className="mr-2 -ml-1 h-5 w-5" />
          {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Site Settings */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Site Settings</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Site Name</label>
              <input
                type="text"
                value={settings.siteSettings.siteName}
                onChange={(e) => handleChange('siteSettings', 'siteName', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Site Description</label>
              <textarea
                value={settings.siteSettings.siteDescription}
                onChange={(e) => handleChange('siteSettings', 'siteDescription', e.target.value)}
                rows="3"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Contact Email</label>
              <input
                type="email"
                value={settings.siteSettings.contactEmail}
                onChange={(e) => handleChange('siteSettings', 'contactEmail', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone Number</label>
              <input
                type="tel"
                value={settings.siteSettings.phoneNumber}
                onChange={(e) => handleChange('siteSettings', 'phoneNumber', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Address</label>
              <textarea
                value={settings.siteSettings.address}
                onChange={(e) => handleChange('siteSettings', 'address', e.target.value)}
                rows="2"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Currency</label>
                <select
                  value={settings.siteSettings.currency}
                  onChange={(e) => handleChange('siteSettings', 'currency', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                >
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Tax Rate (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={settings.siteSettings.taxRate}
                  onChange={(e) => handleChange('siteSettings', 'taxRate', parseFloat(e.target.value))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Order Settings */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Order Settings</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Minimum Order Amount</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">$</span>
                </div>
                <input
                  type="number"
                  min="0"
                  value={settings.orderSettings.minimumOrderAmount}
                  onChange={(e) => handleChange('orderSettings', 'minimumOrderAmount', parseFloat(e.target.value))}
                  className="pl-7 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Free Shipping Threshold</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">$</span>
                </div>
                <input
                  type="number"
                  min="0"
                  value={settings.orderSettings.freeShippingThreshold}
                  onChange={(e) => handleChange('orderSettings', 'freeShippingThreshold', parseFloat(e.target.value))}
                  className="pl-7 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Default Shipping Fee</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">$</span>
                </div>
                <input
                  type="number"
                  min="0"
                  value={settings.orderSettings.defaultShippingFee}
                  onChange={(e) => handleChange('orderSettings', 'defaultShippingFee', parseFloat(e.target.value))}
                  className="pl-7 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="allowGuestCheckout"
                  checked={settings.orderSettings.allowGuestCheckout}
                  onChange={(e) => handleChange('orderSettings', 'allowGuestCheckout', e.target.checked)}
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <label htmlFor="allowGuestCheckout" className="ml-2 block text-sm text-gray-700">
                  Allow Guest Checkout
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="requirePhoneNumber"
                  checked={settings.orderSettings.requirePhoneNumber}
                  onChange={(e) => handleChange('orderSettings', 'requirePhoneNumber', e.target.checked)}
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <label htmlFor="requirePhoneNumber" className="ml-2 block text-sm text-gray-700">
                  Require Phone Number
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Email Notifications */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Email Notifications</h3>
          <div className="space-y-4">
            {Object.entries(settings.emailNotifications).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <label htmlFor={key} className="text-sm text-gray-700">
                  {key.split(/(?=[A-Z])/).join(' ')}
                </label>
                <div className="relative inline-block w-12 mr-2 align-middle select-none">
                  <input
                    type="checkbox"
                    id={key}
                    checked={value}
                    onChange={(e) => handleChange('emailNotifications', key, e.target.checked)}
                    className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                  />
                  <label
                    htmlFor={key}
                    className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${
                      value ? 'bg-primary' : 'bg-gray-300'
                    }`}
                  ></label>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Appearance Settings */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Appearance</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Primary Color</label>
                <input
                  type="color"
                  value={settings.appearance.primaryColor}
                  onChange={(e) => handleChange('appearance', 'primaryColor', e.target.value)}
                  className="mt-1 block w-full h-10 rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Accent Color</label>
                <input
                  type="color"
                  value={settings.appearance.accentColor}
                  onChange={(e) => handleChange('appearance', 'accentColor', e.target.value)}
                  className="mt-1 block w-full h-10 rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                />
              </div>
            </div>
            <div className="space-y-2">
              {Object.entries(settings.appearance)
                .filter(([key]) => typeof settings.appearance[key] === 'boolean')
                .map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <label htmlFor={key} className="text-sm text-gray-700">
                      {key.split(/(?=[A-Z])/).join(' ')}
                    </label>
                    <div className="relative inline-block w-12 mr-2 align-middle select-none">
                      <input
                        type="checkbox"
                        id={key}
                        checked={value}
                        onChange={(e) => handleChange('appearance', key, e.target.checked)}
                        className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                      />
                      <label
                        htmlFor={key}
                        className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${
                          value ? 'bg-primary' : 'bg-gray-300'
                        }`}
                      ></label>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>

      {/* Save Button (Bottom) */}
      <div className="flex justify-end pt-6">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FiSave className="mr-2 -ml-1 h-5 w-5" />
          {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
};

export default Settings; 