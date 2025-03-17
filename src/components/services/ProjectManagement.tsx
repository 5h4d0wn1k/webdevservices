import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaClock, FaCode, FaComments, FaFile, FaTasks } from 'react-icons/fa';

interface ProjectPhase {
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
  deliverables: string[];
  timeline: string;
}

interface ProjectMilestone {
  title: string;
  description: string;
  dueDate: string;
  completed: boolean;
}

const projectPhases: ProjectPhase[] = [
  {
    title: "Discovery & Planning",
    description: "Understanding requirements and planning project architecture",
    status: 'completed',
    deliverables: [
      "Project Requirements Document",
      "Technical Specifications",
      "Project Timeline",
      "Architecture Diagram"
    ],
    timeline: "Week 1-2"
  },
  {
    title: "Design & Prototyping",
    description: "Creating wireframes and visual designs",
    status: 'in-progress',
    deliverables: [
      "Wireframes",
      "UI/UX Design",
      "Interactive Prototype",
      "Design System"
    ],
    timeline: "Week 2-4"
  },
  {
    title: "Development",
    description: "Building the core functionality and features",
    status: 'pending',
    deliverables: [
      "Frontend Implementation",
      "Backend Development",
      "Database Integration",
      "API Development"
    ],
    timeline: "Week 4-10"
  },
  {
    title: "Testing & QA",
    description: "Ensuring quality and performance",
    status: 'pending',
    deliverables: [
      "Unit Testing",
      "Integration Testing",
      "Performance Testing",
      "Bug Fixes"
    ],
    timeline: "Week 10-12"
  },
  {
    title: "Deployment & Launch",
    description: "Going live and monitoring performance",
    status: 'pending',
    deliverables: [
      "Production Deployment",
      "Performance Monitoring",
      "Documentation",
      "Training Materials"
    ],
    timeline: "Week 12"
  }
];

const milestones: ProjectMilestone[] = [
  {
    title: "Project Kickoff",
    description: "Initial meeting and requirement gathering",
    dueDate: "2024-04-01",
    completed: true
  },
  {
    title: "Design Approval",
    description: "Client sign-off on final designs",
    dueDate: "2024-04-15",
    completed: false
  },
  {
    title: "MVP Release",
    description: "First version with core features",
    dueDate: "2024-05-15",
    completed: false
  },
  {
    title: "Beta Testing",
    description: "User testing and feedback collection",
    dueDate: "2024-06-01",
    completed: false
  },
  {
    title: "Production Launch",
    description: "Official website launch",
    dueDate: "2024-06-15",
    completed: false
  }
];

export const ProjectManagement = () => {
  const [activeTab, setActiveTab] = useState('timeline');

  return (
    <div className="container mx-auto px-4 py-16">
      <h2 className="text-4xl font-bold text-center mb-12">Project Management Dashboard</h2>

      {/* Project Navigation */}
      <div className="flex justify-center mb-8">
        <div className="flex space-x-4">
          <button
            onClick={() => setActiveTab('timeline')}
            className={`px-6 py-3 rounded-lg ${
              activeTab === 'timeline'
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Project Timeline
          </button>
          <button
            onClick={() => setActiveTab('milestones')}
            className={`px-6 py-3 rounded-lg ${
              activeTab === 'milestones'
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Milestones
          </button>
        </div>
      </div>

      {/* Project Timeline */}
      {activeTab === 'timeline' && (
        <div className="grid gap-8">
          {projectPhases.map((phase, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-lg shadow-lg p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div
                    className={`w-3 h-3 rounded-full mr-4 ${
                      phase.status === 'completed'
                        ? 'bg-green-500'
                        : phase.status === 'in-progress'
                        ? 'bg-yellow-500'
                        : 'bg-gray-300'
                    }`}
                  />
                  <h3 className="text-xl font-semibold">{phase.title}</h3>
                </div>
                <span className="text-gray-500">{phase.timeline}</span>
              </div>
              <p className="text-gray-600 mb-4">{phase.description}</p>
              <div className="grid grid-cols-2 gap-4">
                {phase.deliverables.map((deliverable, i) => (
                  <div
                    key={i}
                    className="flex items-center text-gray-700"
                  >
                    <FaCheckCircle className={`mr-2 ${
                      phase.status === 'completed'
                        ? 'text-green-500'
                        : 'text-gray-300'
                    }`} />
                    {deliverable}
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Project Milestones */}
      {activeTab === 'milestones' && (
        <div className="grid gap-6">
          {milestones.map((milestone, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-lg shadow-lg p-6"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <FaTasks className={`mr-3 text-xl ${
                    milestone.completed ? 'text-green-500' : 'text-gray-400'
                  }`} />
                  <h3 className="text-lg font-semibold">{milestone.title}</h3>
                </div>
                <span className="text-gray-500">{milestone.dueDate}</span>
              </div>
              <p className="text-gray-600">{milestone.description}</p>
            </motion.div>
          ))}
        </div>
      )}

      {/* Quick Actions */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <button className="flex items-center justify-center p-4 bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
          <FaFile className="mr-2 text-primary" />
          <span>View Documents</span>
        </button>
        <button className="flex items-center justify-center p-4 bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
          <FaComments className="mr-2 text-primary" />
          <span>Project Discussion</span>
        </button>
        <button className="flex items-center justify-center p-4 bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
          <FaClock className="mr-2 text-primary" />
          <span>Time Tracking</span>
        </button>
        <button className="flex items-center justify-center p-4 bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
          <FaCode className="mr-2 text-primary" />
          <span>Code Repository</span>
        </button>
      </div>
    </div>
  );
}; 