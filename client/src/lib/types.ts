// Types used for localStorage data management

export interface Worker {
  id: string;
  name: string;
  position: string;
  dailySalary: number;
  workDays: number;
}

export interface Project {
  id: string;
  name: string;
  address: string;
  createdAt: string;
  workers: Worker[];
}

export interface PositionSummary {
  position: string;
  count: number;
  totalSalary: number;
}

export interface CalculationResult {
  id: string;
  projectId: string;
  date: string;
  projectName: string;
  projectAddress: string;
  workers: Worker[];
  positionSummaries: PositionSummary[];
  totalSalary: number;
}

export interface UserProfile {
  username: string;
  email: string;
  bio: string;
  photoUrl: string;
}

export interface AppData {
  projects: Project[];
  calculations: CalculationResult[];
  profile: UserProfile;
}
