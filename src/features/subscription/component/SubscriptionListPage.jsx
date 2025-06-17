// src/features/subscriptions/components/SubscriptionListPage.jsx
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSubscriptionKeys, createSubscriptionKey, deactivateSubscription } from '../redux/subscriptionActions';
import { format } from 'date-fns';

const SubscriptionListPage = () => {
  const dispatch = useDispatch();
  const { subscriptionKeys, loading, error } = useSelector((state) => state.subscriptions);

  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [newKeyType, setNewKeyType] = useState('1month'); // Default type
  const [newKeyMaxDevices, setNewKeyMaxDevices] = useState(1); // Default max devices
  const [generateLoading, setGenerateLoading] = useState(false);

  // Fetch subscription keys on component mount
  useEffect(() => {
    dispatch(fetchSubscriptionKeys());
  }, [dispatch]);

  const handleGenerateKey = async () => {
    if (!newKeyType || newKeyMaxDevices < 1) {
      alert('Please select a key type and specify maximum devices.');
      return;
    }
    setGenerateLoading(true);
    try {
      await dispatch(createSubscriptionKey(newKeyType, newKeyMaxDevices));
      alert('Subscription key generated successfully!');
      setShowGenerateModal(false); // Close modal on success
      setNewKeyType('1month'); // Reset form to default
      setNewKeyMaxDevices(1); // Reset form to default
    } catch (err) {
      alert(`Failed to generate key: ${err.message || JSON.stringify(err)}`);
      console.error('Generate key failed:', err);
    } finally {
      setGenerateLoading(false);
    }
  };

  const handleDeactivateKey = async (key) => {
    if (window.confirm(`Are you sure you want to deactivate key "${key}"? This will make it unusable.`)) {
      try {
        await dispatch(deactivateSubscription(key));
        alert('Subscription key deactivated successfully!');
      } catch (err) {
        alert(`Failed to deactivate key: ${err.message || JSON.stringify(err)}`);
        console.error('Deactivate key failed:', err);
      }
    }
  };

  // Display loading state if no keys are loaded yet
  if (loading && subscriptionKeys.length === 0) {
    return (
      <div className="flex justify-center items-center h-full p-6">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        <p className="ml-4 text-lg text-gray-700">Loading subscription keys...</p>
      </div>
    );
  }

  // Display error state
  if (error) {
    return (
      <div className="text-center p-6 text-red-500">
        <h2 className="text-2xl font-bold mb-2">Error Loading Subscriptions</h2>
        <p>{error.message || 'An unexpected error occurred while fetching subscription keys.'}</p>
        <p className="text-sm mt-2">Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Subscription Keys</h1>
        <button
          onClick={() => setShowGenerateModal(true)}
          className="px-4 py-2 bg-green-600 text-white rounded-md shadow-sm hover:bg-green-700 transition duration-200"
        >
          Generate New Key
        </button>
      </div>

      {/* Display message if no keys are found */}
      {subscriptionKeys.length === 0 && !loading ? (
        <p className="text-gray-600 text-center py-8">No subscription keys found. Generate one to start!</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Key
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Max Devices
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Devices Used
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Expires At
                </th>
                <th scope="col" className="relative px-6 py-3 text-center">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {subscriptionKeys.map((sub) => (
                <tr key={sub.key} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    <span className="font-mono bg-gray-100 p-1 rounded-md text-xs">{sub.key}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {sub.type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {sub.max_devices}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {sub.devices_used}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${sub.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {sub.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {sub.expires_at ? format(new Date(sub.expires_at), 'MMM dd, yyyy HH:mm') : 'Lifetime'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                    {sub.is_active && (
                      <button
                        onClick={() => handleDeactivateKey(sub.key)}
                        className="text-red-600 hover:text-red-900 px-3 py-1 rounded-md hover:bg-red-100 transition-colors duration-200"
                      >
                        Deactivate
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {/* Show inline loading spinner when fetching next pages (if pagination was implemented) */}
              {loading && subscriptionKeys.length > 0 && (
                  <tr>
                    <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-400 mr-3"></div>
                        Loading more keys...
                      </div>
                    </td>
                  </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Generate New Key Modal */}
      {showGenerateModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Generate New Subscription Key</h2>
            <div className="mb-4">
              <label htmlFor="keyType" className="block text-sm font-medium text-gray-700">Key Type</label>
              <select
                id="keyType"
                name="keyType"
                value={newKeyType}
                onChange={(e) => setNewKeyType(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="1month">1 Month</option>
                <option value="3months">3 Months</option>
                <option value="lifetime">Lifetime</option>
              </select>
            </div>
            <div className="mb-6">
              <label htmlFor="maxDevices" className="block text-sm font-medium text-gray-700">Max Devices</label>
              <input
                type="number"
                id="maxDevices"
                name="maxDevices"
                value={newKeyMaxDevices}
                onChange={(e) => setNewKeyMaxDevices(Math.max(1, parseInt(e.target.value, 10) || 1))} // Ensure minimum of 1
                min="1"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowGenerateModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition duration-200"
                disabled={generateLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleGenerateKey}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={generateLoading}
              >
                {generateLoading ? 'Generating...' : 'Generate Key'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubscriptionListPage;