import { v4 as uuidv4 } from 'uuid';
import { 
  AppData, 
  Project, 
  Worker, 
  CalculationResult, 
  UserProfile,
  PositionSummary 
} from './types';

// Helper to get data from localStorage
const getData = (): AppData => {
  const data = localStorage.getItem('hitungYukData');
  return data ? JSON.parse(data) : {
    projects: [],
    calculations: [],
    profile: {
      username: '',
      email: '',
      bio: '',
      photoUrl: ''
    }
  };
};

// Helper to save data to localStorage
const saveData = (data: AppData): void => {
  localStorage.setItem('hitungYukData', JSON.stringify(data));
};

// Delete all data and reset to initial state
export const deleteAllData = (): void => {
  const emptyData: AppData = {
    projects: [],
    calculations: [],
    profile: {
      username: '',
      email: '',
      bio: '',
      photoUrl: ''
    }
  };
  saveData(emptyData);
};

// Project operations
export const getProjects = (): Project[] => {
  return getData().projects;
};

export const getProject = (id: string): Project | undefined => {
  return getData().projects.find(project => project.id === id);
};

export const saveProject = (project: Omit<Project, 'id' | 'createdAt' | 'workers'>): Project => {
  const data = getData();
  
  const newProject: Project = {
    id: uuidv4(),
    name: project.name,
    address: project.address,
    createdAt: new Date().toISOString(),
    workers: []
  };
  
  data.projects.push(newProject);
  saveData(data);
  
  return newProject;
};

export const addWorkerToProject = (projectId: string, worker: Omit<Worker, 'id'>): Worker => {
  const data = getData();
  const project = data.projects.find(p => p.id === projectId);
  
  if (!project) {
    throw new Error('Project not found');
  }
  
  const newWorker: Worker = {
    id: uuidv4(),
    name: worker.name,
    position: worker.position,
    dailySalary: worker.dailySalary,
    workDays: worker.workDays
  };
  
  project.workers.push(newWorker);
  saveData(data);
  
  return newWorker;
};

export const updateProject = (updatedProject: Project): Project => {
  const data = getData();
  const index = data.projects.findIndex(p => p.id === updatedProject.id);
  
  if (index === -1) {
    throw new Error('Project not found');
  }
  
  data.projects[index] = updatedProject;
  saveData(data);
  
  return updatedProject;
};

export const deleteProject = (id: string): void => {
  const data = getData();
  data.projects = data.projects.filter(p => p.id !== id);
  data.calculations = data.calculations.filter(c => c.projectId !== id);
  saveData(data);
};

// Calculation operations
export const getCalculations = (): CalculationResult[] => {
  return getData().calculations;
};

export const getCalculation = (id: string): CalculationResult | undefined => {
  return getData().calculations.find(calc => calc.id === id);
};

export const saveCalculation = (calculation: Omit<CalculationResult, 'id'>): CalculationResult => {
  const data = getData();
  
  const newCalculation: CalculationResult = {
    id: uuidv4(),
    ...calculation
  };
  
  data.calculations.push(newCalculation);
  saveData(data);
  
  return newCalculation;
};

export const deleteCalculation = (id: string): void => {
  const data = getData();
  data.calculations = data.calculations.filter(c => c.id !== id);
  saveData(data);
};

// Calculate position summaries for a project
export const calculatePositionSummaries = (workers: Worker[]): PositionSummary[] => {
  const positions = workers.reduce<Record<string, PositionSummary>>((acc, worker) => {
    const { position } = worker;
    const salary = worker.dailySalary * worker.workDays;
    
    if (!acc[position]) {
      acc[position] = { position, count: 0, totalSalary: 0 };
    }
    
    acc[position].count += 1;
    acc[position].totalSalary += salary;
    
    return acc;
  }, {});
  
  return Object.values(positions);
};

// Calculate total salary for a project
export const calculateTotalSalary = (workers: Worker[]): number => {
  return workers.reduce((total, worker) => {
    return total + (worker.dailySalary * worker.workDays);
  }, 0);
};

// Profile operations
export const getProfile = (): UserProfile => {
  return getData().profile;
};

export const updateProfile = (profile: UserProfile): UserProfile => {
  const data = getData();
  data.profile = profile;
  saveData(data);
  return profile;
};

// Dashboard summary data
export const getDashboardSummary = () => {
  const data = getData();
  
  const workerCount = data.projects.reduce((count, project) => {
    return count + project.workers.length;
  }, 0);
  
  const workDaysCount = data.projects.reduce((count, project) => {
    return count + project.workers.reduce((days, worker) => {
      return days + worker.workDays;
    }, 0);
  }, 0);
  
  const projectCount = data.projects.length;
  
  const totalSalary = data.calculations.reduce((total, calc) => {
    return total + calc.totalSalary;
  }, 0);
  
  return {
    workerCount,
    workDaysCount,
    projectCount,
    totalSalary
  };
};
