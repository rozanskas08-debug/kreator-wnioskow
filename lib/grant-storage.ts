import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  GrantProject,
  ApplicantType,
  ProjectStatus,
  WIZARD_STEPS,
  CONTROL_CHECKLIST,
} from './data/grant-data';

const STORAGE_KEY = '@grant_projects';

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

function buildDefaultStepStatuses(): Record<string, import('./data/grant-data').StepStatus> {
  const statuses: Record<string, import('./data/grant-data').StepStatus> = {};
  for (const step of WIZARD_STEPS) {
    statuses[step.id] = 'not_started';
  }
  return statuses;
}

function buildDefaultChecklistItems(): Record<string, boolean> {
  const items: Record<string, boolean> = {};
  for (const item of CONTROL_CHECKLIST) {
    items[item.id] = false;
  }
  return items;
}

export function createProject(
  title: string,
  applicantName: string,
  applicantType: ApplicantType,
  competitionName: string = '',
  fundingSource: string = '',
): GrantProject {
  const now = new Date().toISOString();
  return {
    id: generateId(),
    title,
    applicantName,
    applicantType,
    competitionName,
    fundingSource,
    status: 'draft',
    requestedAmount: 0,
    ownContribution: 0,
    createdAt: now,
    updatedAt: now,
    stepData: {},
    stepStatuses: buildDefaultStepStatuses(),
    budgetItems: [],
    ganttActivities: [],
    checklistItems: buildDefaultChecklistItems(),
    consultantNotes: '',
  };
}

export async function getAllProjects(): Promise<GrantProject[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as GrantProject[];
  } catch {
    return [];
  }
}

export async function saveProject(project: GrantProject): Promise<void> {
  const projects = await getAllProjects();
  const idx = projects.findIndex((p) => p.id === project.id);
  const updated = { ...project, updatedAt: new Date().toISOString() };
  if (idx >= 0) {
    projects[idx] = updated;
  } else {
    projects.push(updated);
  }
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
}

export async function deleteProject(id: string): Promise<void> {
  const projects = await getAllProjects();
  const filtered = projects.filter((p) => p.id !== id);
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
}

export async function getProjectById(id: string): Promise<GrantProject | null> {
  const projects = await getAllProjects();
  return projects.find((p) => p.id === id) ?? null;
}

export async function updateProjectStatus(id: string, status: ProjectStatus): Promise<void> {
  const project = await getProjectById(id);
  if (!project) return;
  await saveProject({ ...project, status });
}

export async function updateStepData(
  projectId: string,
  stepId: string,
  data: Record<string, string>,
): Promise<void> {
  const project = await getProjectById(projectId);
  if (!project) return;
  const stepData = { ...project.stepData, [stepId]: data };
  // Auto-update step status: if any field filled → in_progress
  const stepStatuses = { ...project.stepStatuses };
  const hasData = Object.values(data).some((v) => v && v.trim().length > 0);
  if (hasData && stepStatuses[stepId] === 'not_started') {
    stepStatuses[stepId] = 'in_progress';
  }
  await saveProject({ ...project, stepData, stepStatuses });
}

export async function updateStepStatus(
  projectId: string,
  stepId: string,
  status: import('./data/grant-data').StepStatus,
): Promise<void> {
  const project = await getProjectById(projectId);
  if (!project) return;
  const stepStatuses = { ...project.stepStatuses, [stepId]: status };
  await saveProject({ ...project, stepStatuses });
}

export async function updateChecklistItem(
  projectId: string,
  itemId: string,
  checked: boolean,
): Promise<void> {
  const project = await getProjectById(projectId);
  if (!project) return;
  const checklistItems = { ...project.checklistItems, [itemId]: checked };
  await saveProject({ ...project, checklistItems });
}

export async function updateConsultantNotes(projectId: string, notes: string): Promise<void> {
  const project = await getProjectById(projectId);
  if (!project) return;
  await saveProject({ ...project, consultantNotes: notes });
}

// ─── PROGRESS HELPERS ────────────────────────────────────────
export function getProjectProgress(project: GrantProject): {
  totalSteps: number;
  doneSteps: number;
  checklistTotal: number;
  checklistDone: number;
  requiredChecklistTotal: number;
  requiredChecklistDone: number;
  pct: number;
} {
  const totalSteps = WIZARD_STEPS.length;
  const doneSteps = Object.values(project.stepStatuses).filter((s) => s === 'done').length;

  const checklistTotal = CONTROL_CHECKLIST.length;
  const checklistDone = Object.values(project.checklistItems).filter(Boolean).length;
  const requiredChecklistTotal = CONTROL_CHECKLIST.filter((i) => i.required).length;
  const requiredChecklistDone = CONTROL_CHECKLIST.filter(
    (i) => i.required && project.checklistItems[i.id],
  ).length;

  const pct = Math.round((doneSteps / totalSteps) * 100);
  return { totalSteps, doneSteps, checklistTotal, checklistDone, requiredChecklistTotal, requiredChecklistDone, pct };
}

export function getChecklistScore(project: GrantProject): {
  total: number;
  checked: number;
  required: number;
  requiredChecked: number;
  pct: number;
} {
  const total = CONTROL_CHECKLIST.length;
  const checked = CONTROL_CHECKLIST.filter((i) => project.checklistItems[i.id]).length;
  const required = CONTROL_CHECKLIST.filter((i) => i.required).length;
  const requiredChecked = CONTROL_CHECKLIST.filter((i) => i.required && project.checklistItems[i.id]).length;
  const pct = Math.round((checked / total) * 100);
  return { total, checked, required, requiredChecked, pct };
}

export function getBudgetSummary(project: GrantProject): {
  totalCost: number;
  fromGrant: number;
  ownContribution: number;
  adminTotal: number;
  programTotal: number;
  adminPct: number;
} {
  const totalCost = project.budgetItems.reduce((sum, i) => sum + i.totalCost, 0);
  const fromGrant = project.budgetItems.reduce((sum, i) => sum + i.fromGrant, 0);
  const ownContribution = project.budgetItems.reduce((sum, i) => sum + i.ownContribution, 0);
  const adminTotal = project.budgetItems.filter((i) => i.category === 'admin').reduce((sum, i) => sum + i.fromGrant, 0);
  const programTotal = project.budgetItems.filter((i) => i.category === 'program').reduce((sum, i) => sum + i.fromGrant, 0);
  const adminPct = fromGrant > 0 ? Math.round((adminTotal / fromGrant) * 100) : 0;
  return { totalCost, fromGrant, ownContribution, adminTotal, programTotal, adminPct };
}
