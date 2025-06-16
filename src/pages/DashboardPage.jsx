// src/pages/DashboardPage.jsx
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchOverviewData,
  setDashboardTimeRange,
} from "../features/dashboard/redux/dashboardActions";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const DashboardPage = () => {
  const dispatch = useDispatch();
  const { data, timeRange, loading, error } = useSelector(
    (state) => state.dashboard
  );

  useEffect(() => {
    dispatch(fetchOverviewData(timeRange));
  }, [dispatch, timeRange]); // Re-fetch when timeRange changes

  const handleTimeRangeChange = (newTimeRange) => {
    dispatch(setDashboardTimeRange(newTimeRange));
  };

  const renderStatCard = (
    title,
    value,
    percentageChange,
    isCurrency = false
  ) => {
    const changeClass =
      percentageChange > 0
        ? "text-green-500"
        : percentageChange < 0
        ? "text-red-500"
        : "text-gray-500";
    const arrow = percentageChange > 0 ? "▲" : percentageChange < 0 ? "▼" : "";

    return (
      <div className="bg-white p-6 rounded-lg shadow-md flex-1 min-w-[200px]">
        <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
        <p className="text-3xl font-bold text-gray-900 mt-2">
          {isCurrency ? `$${value}` : value}
        </p>
        {percentageChange !== undefined && (
          <p className={`text-sm mt-1 ${changeClass}`}>
            {arrow} {Math.abs(percentageChange)}%{" "}
            <span className="text-gray-500">vs last period</span>
          </p>
        )}
      </div>
    );
  };

  const renderChart = (chartData, dataKey, title) => {
    if (!chartData || chartData.length === 0) {
      return (
        <div className="bg-white p-6 rounded-lg shadow-md col-span-full md:col-span-1">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            {title} Trend
          </h3>
          <div className="flex items-center justify-center h-48 text-gray-500">
            No chart data available for this period.
          </div>
        </div>
      );
    }

    return (
      <div className="bg-white p-6 rounded-lg shadow-md col-span-full md:col-span-1">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">
          {title} Trend
        </h3>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis dataKey="date" tickLine={false} />
            <YAxis tickLine={false} />
            <Tooltip />
            <Line
              type="monotone"
              dataKey={dataKey}
              stroke="#8884d8"
              strokeWidth={2}
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full p-6">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        <p className="ml-4 text-lg text-gray-700">Loading dashboard data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-6 text-red-500">
        <h2 className="text-2xl font-bold mb-2">Error Loading Dashboard</h2>
        <p>{error.message || "An unexpected error occurred."}</p>
        <p className="text-sm mt-2">Please try again later.</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center p-6 text-gray-600">
        No dashboard data available. Please select a time range.
      </div>
    );
  }

  const { users, devices, content, subscriptions, last_updated } = data;

  return (
    <div className="p-6 bg-gray-50 min-h-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
        <div className="flex space-x-2">
          <button
            onClick={() => handleTimeRangeChange("week")}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              timeRange === "week"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Week
          </button>
          <button
            onClick={() => handleTimeRangeChange("month")}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              timeRange === "month"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Month
          </button>
          <button
            onClick={() => handleTimeRangeChange("year")}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              timeRange === "year"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Year
          </button>
        </div>
      </div>

      <p className="text-right text-sm text-gray-500 mb-6">
        Last Updated: {last_updated || "N/A"}
      </p>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {renderStatCard("Total Users", users.total, users.change_percentage)}
        {renderStatCard(
          "Total Devices",
          devices.total,
          devices.change_percentage
        )}
        {renderStatCard("Total Content", content.total, null)}{" "}
        {/* No change_percentage for content total in data */}
        {renderStatCard("Total Subscriptions", subscriptions.total, null)}
      </div>

      {/* Charts Section */}
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Trends</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {renderChart(users.chart, "count", "Users")}
        {renderChart(devices.chart, "total", "Devices")}{" "}
        {/* Assuming 'total' for device chart dataKey */}
        {renderChart(content.views_chart, "views", "Content Views")}{" "}
        {/* Assuming 'views' for content views chart dataKey */}
        {renderChart(subscriptions.chart, "count", "Subscriptions")}
      </div>

      {/* Popular Content */}
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Popular Content</h2>
      {content.popular_content && content.popular_content.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {content.popular_content.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <img
                src={
                  item.coverImg ||
                  `https://placehold.co/400x200/cccccc/333333?text=${item.title}`
                }
                alt={item.title}
                className="w-full h-40 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800 truncate">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                  {item.content}
                </p>
                <div className="flex flex-wrap gap-1 mb-2">
                  {item.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <p className="text-sm text-gray-500">
                  Views: {item.views_count || 0}
                </p>
                <a
                  href={`/contents/details/${item.id}`}
                  className="mt-2 inline-block text-blue-600 hover:underline text-sm"
                >
                  View Details &rarr;
                </a>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-600 text-center py-8">
          No popular content to display for this period.
        </p>
      )}
    </div>
  );
};

export default DashboardPage;
