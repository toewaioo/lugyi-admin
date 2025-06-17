// src/features/devices/components/DeviceListPage.jsx
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router'; // Import useNavigate
import { fetchDevices, deleteDeviceAction } from '../redux/deviceActions'; // Import deleteDeviceAction
import { format } from 'date-fns';

const DeviceListPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Initialize useNavigate
  const { devices, pagination, loading, error } = useSelector((state) => state.devices    );

  // Fetch devices on component mount or when page/per_page changes
  useEffect(() => {
    dispatch(fetchDevices(pagination.current_page, pagination.per_page));
  }, [dispatch, pagination.current_page, pagination.per_page]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= pagination.last_page) {
      dispatch(fetchDevices(page, pagination.per_page));
    }
  };

  const handlePerPageChange = (e) => {
    dispatch(fetchDevices(1, parseInt(e.target.value, 10))); // Reset to first page
  };

  const handleDelete = async (deviceId, deviceIdentifier) => {
    if (window.confirm(`Are you sure you want to delete device "${deviceIdentifier}"? This action cannot be undone.`)) {
      try {
        await dispatch(deleteDeviceAction(deviceIdentifier));
        alert('Device deleted successfully!');
        // Re-fetch devices to update the list, especially if a page becomes empty
        dispatch(fetchDevices(pagination.current_page, pagination.per_page));
      } catch (err) {
        alert(`Failed to delete device: ${err.message || JSON.stringify(err)}`);
        console.error('Delete failed:', err);
      }
    }
  };

  if (loading && devices.length === 0) { // Only show full loading spinner if no data is present yet
    return (
      <div className="flex justify-center items-center h-full p-6">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        <p className="ml-4 text-lg text-gray-700">Loading devices...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-6 text-red-500">
        <h2 className="text-2xl font-bold mb-2">Error Loading Devices</h2>
        <p>{error.message || 'An unexpected error occurred while fetching devices.'}</p>
        <p className="text-sm mt-2">Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Device Management</h1>
        <button
          onClick={() => navigate('/devices/new')}
          className="px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700 transition duration-200"
        >
          Add New Device
        </button>
      </div>

      {devices.length === 0 && !loading ? ( // Check loading here too
        <p className="text-gray-600 text-center py-8">No devices found.</p>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Device ID
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Platform
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    OS/App Version
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Active
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    VIP Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    VIP Expires
                  </th>
                  <th scope="col" className="relative px-6 py-3 text-center">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {devices.map((device) => (
                  <tr key={device.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {device.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {device.device_id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {device.platform || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {device.osversion || 'N/A'} / {device.appversion || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {device.last_active_at ? format(new Date(device.last_active_at), 'MMM dd, yyyy HH:mm') : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${device.is_vip ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {device.is_vip ? 'VIP' : 'Free'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {device.vip_expires_at ? format(new Date(device.vip_expires_at), 'MMM dd, yyyy') : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium space-x-2">
                      <button
                        onClick={() => navigate(`/devices/details/${device.device_id}`)}
                        className="text-blue-600 hover:text-blue-900 px-2 py-1 rounded-md hover:bg-blue-100 transition-colors duration-200"
                        title="View Details"
                      >
                        View
                      </button>
                      <button
                        onClick={() => navigate(`/devices/edit/${device.device_id}`)}
                        className="text-yellow-600 hover:text-yellow-900 px-2 py-1 rounded-md hover:bg-yellow-100 transition-colors duration-200"
                        title="Edit Device"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(device.id, device.device_id)}
                        className="text-red-600 hover:text-red-900 px-2 py-1 rounded-md hover:bg-red-100 transition-colors duration-200"
                        title="Delete Device"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {loading && devices.length > 0 && ( // Show inline loading spinner when fetching next pages
                    <tr>
                      <td colSpan="8" className="px-6 py-4 text-center text-gray-500">
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-400 mr-3"></div>
                          Loading more devices...
                        </div>
                      </td>
                    </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="mt-6 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-2">
              <label htmlFor="perPage" className="text-sm text-gray-700">Show:</label>
              <select
                id="perPage"
                value={pagination.per_page}
                onChange={handlePerPageChange}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 sm:text-sm"
              >
                {[10, 20, 50, 100].map((num) => (
                  <option key={num} value={num}>{num}</option>
                ))}
              </select>
              <span className="text-sm text-gray-700">entries</span>
            </div>

            <div className="flex items-center space-x-1">
              <button
                onClick={() => handlePageChange(pagination.current_page - 1)}
                disabled={pagination.current_page === 1}
                className="px-3 py-1 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              {Array.from({ length: pagination.last_page }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-3 py-1 rounded-md ${
                    pagination.current_page === page
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => handlePageChange(pagination.current_page + 1)}
                disabled={pagination.current_page === pagination.last_page}
                className="px-3 py-1 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>

            <div className="text-sm text-gray-700">
              Page {pagination.current_page} of {pagination.last_page} (Total {pagination.total} devices)
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default DeviceListPage;