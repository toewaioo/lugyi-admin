// src/features/devices/components/DeviceDetailsPage.jsx
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router";
import { fetchDeviceById } from "../redux/deviceActions";
import { format } from "date-fns";

const DeviceDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { selectedDevice, loading, error } = useSelector(
    (state) => state.devices
  );

  useEffect(() => {
    if (id) {
      dispatch(fetchDeviceById(id));
    }
  }, [dispatch, id]);
  console.log("DeviceDetailsPage", selectedDevice, loading, error);
  if (loading) {
    return (
      <div className="flex justify-center items-center h-full p-6">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        <p className="ml-4 text-lg text-gray-700">Loading device details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-6 text-red-500">
        <h2 className="text-2xl font-bold mb-2">
          Error Loading Device Details
        </h2>
        <p>{error.message || "An unexpected error occurred."}</p>
        <button
          onClick={() => navigate("/devices")}
          className="mt-4 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition duration-200"
        >
          Back to Device List
        </button>
      </div>
    );
  }

  if (!selectedDevice) {
    return (
      <div className="text-center p-6 text-gray-600">
        <p>No device found with ID: {id}.</p>
        <button
          onClick={() => navigate("/devices")}
          className="mt-4 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition duration-200"
        >
          Back to Device List
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-md max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Device Details</h1>
        <button
          onClick={() => navigate("/devices")}
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition duration-200"
        >
          &larr; Back to List
        </button>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between border-b pb-2">
          <span className="font-semibold text-gray-700">ID:</span>
          <span className="text-gray-900">{selectedDevice.device.id}</span>
        </div>
        <div className="flex justify-between border-b pb-2">
          <span className="font-semibold text-gray-700">Device ID:</span>
          <span className="text-gray-900">{selectedDevice.device.device_id}</span>
        </div>
        <div className="flex justify-between border-b pb-2">
          <span className="font-semibold text-gray-700">Platform:</span>
          <span className="text-gray-900">
            {selectedDevice.device.platform || "N/A"}
          </span>
        </div>
        <div className="flex justify-between border-b pb-2">
          <span className="font-semibold text-gray-700">OS Version:</span>
          <span className="text-gray-900">
            {selectedDevice.device.osversion || "N/A"}
          </span>
        </div>
        <div className="flex justify-between border-b pb-2">
          <span className="font-semibold text-gray-700">App Version:</span>
          <span className="text-gray-900">
            {selectedDevice.device.appversion || "N/A"}
          </span>
        </div>
        <div className="flex justify-between border-b pb-2">
          <span className="font-semibold text-gray-700">Last Active:</span>
          <span className="text-gray-900">
            {selectedDevice.device.last_active_at
              ? format(
                  new Date(selectedDevice.device.last_active_at),
                  "MMM dd, yyyy HH:mm"
                )
              : "N/A"}
          </span>
        </div>
        <div className="flex justify-between border-b pb-2">
          <span className="font-semibold text-gray-700">VIP Status:</span>
          <span
            className={`font-semibold ${
              selectedDevice.device.is_vip ? "text-green-600" : "text-red-600"
            }`}
          >
            {selectedDevice.device.is_vip ? "VIP" : "Free"}
          </span>
        </div>
        <div className="flex justify-between border-b pb-2">
          <span className="font-semibold text-gray-700">VIP Expires At:</span>
          <span className="text-gray-900">
            {selectedDevice.device.vip_expires_at
              ? format(
                  new Date(selectedDevice.device.vip_expires_at),
                  "MMM dd, yyyy HH:mm"
                )
              : "N/A"}
          </span>
        </div>
        <div className="flex justify-between border-b pb-2">
          <span className="font-semibold text-gray-700">Created At:</span>
          <span className="text-gray-900">
            {selectedDevice.device.created_at
              ? format(
                  new Date(selectedDevice.device.created_at),
                  "MMM dd, yyyy HH:mm"
                )
              : "N/A"}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="font-semibold text-gray-700">Updated At:</span>
          <span className="text-gray-900">
            {selectedDevice.device.updated_at
              ? format(
                  new Date(selectedDevice.device.updated_at),
                  "MMM dd, yyyy HH:mm"
                )
              : "N/A"}
          </span>
        </div>
      </div>

      <div className="mt-8 flex justify-end space-x-3">
        <button
          onClick={() => navigate(`/devices/edit/${selectedDevice.device.device_id}`)}
          className="px-5 py-2 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700 transition duration-200"
        >
          Edit Device
        </button>
      </div>
    </div>
  );
};

export default DeviceDetailsPage;
