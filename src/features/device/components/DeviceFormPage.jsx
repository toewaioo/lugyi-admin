// src/features/devices/components/DeviceFormPage.jsx
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router';
import { createNewDevice, updateExistingDevice, fetchDeviceById } from '../redux/deviceActions';
import { format } from 'date-fns';

const DeviceFormPage = () => {
  const { id } = useParams(); // Get ID from URL for edit mode
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { selectedDevice, loading, error } = useSelector((state) => state.devices);

  const isEditMode = Boolean(id); // True if ID exists in URL

  const [formData, setFormData] = useState({
    device_id: '',
    is_vip: false,
    osversion: '',
    appversion: '',
    platform: '',
    vip_expires_at: '', // Date string
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isEditMode) {
      dispatch(fetchDeviceById(id));
    }
    // Clear selectedDevice when leaving edit mode or creating new
    return () => {
      // Dispatch an action to clear selectedDevice if necessary,
      // or simply rely on form state. For this example, we keep it simple.
    };
  }, [dispatch, id, isEditMode]);

  useEffect(() => {
    // Populate form data if in edit mode and selectedDevice is loaded
    if (isEditMode && selectedDevice) {
      setFormData({
        device_id: selectedDevice.device.device_id || '',
        is_vip: selectedDevice.device.is_vip,
        osversion: selectedDevice.device.osversion || '',
        appversion: selectedDevice.device.appversion || '',
        platform: selectedDevice.device.platform || '',
        // Format date for input type="datetime-local" if available
        vip_expires_at: selectedDevice.device.vip_expires_at
          ? format(new Date(selectedDevice.device.vip_expires_at), "yyyy-MM-dd'T'HH:mm")
          : '',
      });
    } else if (!isEditMode) {
      // Reset form for new device if switching from edit mode
      setFormData({
        device_id: '',
        is_vip: false,
        osversion: '',
        appversion: '',
        platform: '',
        vip_expires_at: '',
      });
    }
  }, [isEditMode, selectedDevice, id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.device_id.trim()) {
      errors.device_id = 'Device ID is required.';
    }
    if (!formData.platform.trim()) {
      errors.platform = 'Platform is required.';
    }
    // Add more validation rules as needed
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        ...formData,
        // Ensure vip_expires_at is null if empty, or a valid ISO string
        vip_expires_at: formData.vip_expires_at ? new Date(formData.vip_expires_at).toISOString() : null,
      };

      if (isEditMode) {
        await dispatch(updateExistingDevice(id, payload));
        alert('Device updated successfully!');
      } else {
        await dispatch(createNewDevice(payload));
        alert('Device created successfully!');
      }
      navigate('/devices'); // Go back to device list after success
    } catch (err) {
      const errorMessage = err.message || JSON.stringify(err);
      alert(`Operation failed: ${errorMessage}`);
      console.error('Form submission error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isEditMode && loading && !selectedDevice) {
    return (
      <div className="flex justify-center items-center h-full p-6">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        <p className="ml-4 text-lg text-gray-700">Loading device for editing...</p>
      </div>
    );
  }

  if (error && isEditMode) { // Only show error for fetching in edit mode
    return (
      <div className="text-center p-6 text-red-500">
        <h2 className="text-2xl font-bold mb-2">Error Loading Device</h2>
        <p>{error.message || 'An unexpected error occurred while fetching device details.'}</p>
        <button
          onClick={() => navigate('/devices')}
          className="mt-4 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition duration-200"
        >
          Back to Device List
        </button>
      </div>
    );
  }


  return (
    <div className="p-6 bg-white rounded-lg shadow-md max-w-xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          {isEditMode ? 'Edit Device' : 'Create New Device'}
        </h1>
        <button
          onClick={() => navigate('/devices')}
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition duration-200"
        >
          &larr; Back to List
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="device_id" className="block text-sm font-medium text-gray-700">Device ID</label>
          <input
            type="text"
            id="device_id"
            name="device_id"
            value={formData.device_id}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
          {formErrors.device_id && <p className="mt-1 text-sm text-red-600">{formErrors.device_id}</p>}
        </div>

        <div>
          <label htmlFor="platform" className="block text-sm font-medium text-gray-700">Platform</label>
          <input
            type="text"
            id="platform"
            name="platform"
            value={formData.platform}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
          {formErrors.platform && <p className="mt-1 text-sm text-red-600">{formErrors.platform}</p>}
        </div>

        <div>
          <label htmlFor="osversion" className="block text-sm font-medium text-gray-700">OS Version</label>
          <input
            type="text"
            id="osversion"
            name="osversion"
            value={formData.osversion}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="appversion" className="block text-sm font-medium text-gray-700">App Version</label>
          <input
            type="text"
            id="appversion"
            name="appversion"
            value={formData.appversion}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>

        <div className="flex items-center">
          <input
            id="is_vip"
            name="is_vip"
            type="checkbox"
            checked={formData.is_vip}
            onChange={handleChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="is_vip" className="ml-2 block text-sm text-gray-900">Is VIP Device?</label>
        </div>

        {formData.is_vip && (
          <div>
            <label htmlFor="vip_expires_at" className="block text-sm font-medium text-gray-700">VIP Expires At</label>
            <input
              type="datetime-local"
              id="vip_expires_at"
              name="vip_expires_at"
              value={formData.vip_expires_at}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
        )}

        <div className="flex justify-end space-x-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Saving...' : (isEditMode ? 'Update Device' : 'Create Device')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default DeviceFormPage;