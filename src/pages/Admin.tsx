import React from 'react';
import { ProjectManagement } from '../components/services/ProjectManagement';
import { motion } from 'framer-motion';
import { FaShieldAlt, FaUsers, FaChartLine } from 'react-icons/fa';

const Admin = () => {
  // TODO: Add proper authentication check
  const isAuthenticated = true; // This should be replaced with actual auth check

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Access Denied</h1>
          <p className="text-gray-600">Please log in to access the admin dashboard.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Admin Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">Admin User</span>
              <button className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Admin Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex space-x-8">
            <button className="py-4 px-2 border-b-2 border-primary text-primary font-medium">
              Projects
            </button>
            <button className="py-4 px-2 text-gray-600 hover:text-primary font-medium">
              Clients
            </button>
            <button className="py-4 px-2 text-gray-600 hover:text-primary font-medium">
              Analytics
            </button>
            <button className="py-4 px-2 text-gray-600 hover:text-primary font-medium">
              Settings
            </button>
          </div>
        </div>
      </nav>

      {/* Quick Stats */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow p-6"
          >
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-full">
                <FaUsers className="w-6 h-6 text-blue-500" />
              </div>
              <div className="ml-4">
                <h3 className="text-gray-500 text-sm">Active Clients</h3>
                <p className="text-2xl font-bold text-gray-800">24</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-lg shadow p-6"
          >
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-full">
                <FaChartLine className="w-6 h-6 text-green-500" />
              </div>
              <div className="ml-4">
                <h3 className="text-gray-500 text-sm">Active Projects</h3>
                <p className="text-2xl font-bold text-gray-800">12</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-lg shadow p-6"
          >
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-full">
                <FaShieldAlt className="w-6 h-6 text-purple-500" />
              </div>
              <div className="ml-4">
                <h3 className="text-gray-500 text-sm">System Status</h3>
                <p className="text-2xl font-bold text-gray-800">Healthy</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Project Management Dashboard */}
      <ProjectManagement />
    </div>
  );
};

export default Admin; 