export interface ProjectPhase {
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
  deliverables: string[];
  timeline: string;
}

export interface ProjectMilestone {
  title: string;
  description: string;
  dueDate: string;
  completed: boolean;
}

export interface ProjectManagementDataType {
  sectionHeading: string;
  timelineButtonText: string;
  milestonesButtonText: string;
  projectPhases: ProjectPhase[];
  milestones: ProjectMilestone[];
  quickActions: {
    viewDocuments: string;
    projectDiscussion: string;
    timeTracking: string;
    codeRepository: string;
  };
}

export const projectManagementData: ProjectManagementDataType = {
  sectionHeading: "Project Management",
  timelineButtonText: "Project Timeline",
  milestonesButtonText: "Key Milestones",
  projectPhases: [
    {
      title: "Phase 1: Discovery & Planning",
      description: "Define project scope, goals, requirements, and create a detailed project plan.",
      status: "completed",
      deliverables: ["Project Scope Document", "Detailed Project Plan", "Wireframes & Site Map"],
      timeline: "2 Weeks",
    },
    {
      title: "Phase 2: Design & Development",
      description: "Build the visual design and core functionality of the project.",
      status: "in-progress",
      deliverables: ["UI/UX Design Mockups", "Frontend Development", "Backend Development"],
      timeline: "4-6 Weeks",
    },
    {
      title: "Phase 3: Testing & Deployment",
      description: "Conduct thorough testing, refine the project, and deploy to live environment.",
      status: "pending",
      deliverables: ["Quality Assurance Testing", "User Acceptance Testing", "Deployment to Production"],
      timeline: "1-2 Weeks",
    },
  ],
  milestones: [
    {
      title: "Project Kick-off Meeting",
      description: "Formal start of the project with key stakeholders.",
      dueDate: "Completed",
      completed: true,
    },
    {
      title: "Wireframe & Site Map Approval",
      description: "Sign-off on the structural and navigational plan.",
      dueDate: "Completed",
      completed: true,
    },
    {
      title: "UI/UX Design Approval",
      description: "Approval of the visual design and user experience.",
      dueDate: "Next Week",
      completed: false,
    },
    {
      title: "Beta Launch",
      description: "Internal testing launch.",
      dueDate: "In 3 Weeks",
      completed: false,
    },
    {
      title: "Final Deployment",
      description: "Project goes live.",
      dueDate: "In 6 Weeks",
      completed: false,
    },
  ],
  quickActions: {
    viewDocuments: "View Project Documents",
    projectDiscussion: "Join Project Discussion",
    timeTracking: "Log Time",
    codeRepository: "Access Code Repository",
  },
}; 