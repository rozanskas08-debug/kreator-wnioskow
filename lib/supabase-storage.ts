/**
 * Supabase-backed storage for grant projects.
 * Replaces AsyncStorage with cloud persistence.
 * Falls back to AsyncStorage if Supabase is unavailable.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from './supabase';
import {
  GrantProject,
  ApplicantType,
  ProjectStatus,
  WIZARD_STEPS,
  CONTROL_CHECKLIST,
} from './data/grant-data';

const LOCAL_CACHE_KEY = '@grant_projects_cache';

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

// ─── SERIALIZATION ────────────────────────────────────────────
// Supabase stores complex objects as JSONB columns
function projectToRow(project: GrantProject): Record<string, unknown> {
  return {
    id: project.id,
    title: project.title,
    applicant_name: project.applicantName,
    applicant_type: project.applicantType,
    competition_name: project.competitionName,
    funding_source: project.fundingSource,
    status: project.status,
    requested_amount: project.requestedAmount,
    own_contribution: project.ownContribution,
    submission_deadline: project.submissionDeadline ?? null,
    project_start_date: project.projectStartDate ?? null,
    project_end_date: project.projectEndDate ?? null,
    step_data: project.stepData,
    step_statuses: project.stepStatuses,
    budget_items: project.budgetItems,
    gantt_activities: project.ganttActivities,
    checklist_items: project.checklistItems,
    consultant_notes: project.consultantNotes,
    created_at: project.createdAt,
    updated_at: project.updatedAt,
  };
}

function rowToProject(row: Record<string, unknown>): GrantProject {
  return {
    id: row.id as string,
    title: row.title as string,
    applicantName: row.applicant_name as string,
    applicantType: row.applicant_type as ApplicantType,
    competitionName: (row.competition_name as string) ?? '',
    fundingSource: (row.funding_source as string) ?? '',
    status: row.status as ProjectStatus,
    requestedAmount: Number(row.requested_amount ?? 0),
    ownContribution: Number(row.own_contribution ?? 0),
    submissionDeadline: (row.submission_deadline as string) ?? undefined,
    projectStartDate: (row.project_start_date as string) ?? undefined,
    projectEndDate: (row.project_end_date as string) ?? undefined,
    stepData: (row.step_data as Record<string, Record<string, string>>) ?? {},
    stepStatuses: (row.step_statuses as Record<string, import('./data/grant-data').StepStatus>) ?? buildDefaultStepStatuses(),
    budgetItems: (row.budget_items as import('./data/grant-data').BudgetItem[]) ?? [],
    ganttActivities: (row.gantt_activities as import('./data/grant-data').GanttActivity[]) ?? [],
    checklistItems: (row.checklist_items as Record<string, boolean>) ?? buildDefaultChecklistItems(),
    consultantNotes: (row.consultant_notes as string) ?? '',
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  };
}

// ─── LOCAL CACHE HELPERS ──────────────────────────────────────
async function getCachedProjects(): Promise<GrantProject[]> {
  try {
    const raw = await AsyncStorage.getItem(LOCAL_CACHE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as GrantProject[];
  } catch {
    return [];
  }
}

async function setCachedProjects(projects: GrantProject[]): Promise<void> {
  try {
    await AsyncStorage.setItem(LOCAL_CACHE_KEY, JSON.stringify(projects));
  } catch {
    // ignore cache errors
  }
}

// ─── MIGRATE LOCAL DATA TO SUPABASE ──────────────────────────
const OLD_STORAGE_KEY = '@grant_projects';
export async function migrateLocalDataToSupabase(): Promise<void> {
  try {
    const raw = await AsyncStorage.getItem(OLD_STORAGE_KEY);
    if (!raw) return;
    const localProjects: GrantProject[] = JSON.parse(raw);
    if (!localProjects.length) return;

    // Check if Supabase already has data
    const { data: existing } = await supabase.from('grant_projects').select('id').limit(1);
    if (existing && existing.length > 0) return; // already migrated

    // Upload all local projects
    const rows = localProjects.map(projectToRow);
    await supabase.from('grant_projects').upsert(rows);

    // Clear old key after successful migration
    await AsyncStorage.removeItem(OLD_STORAGE_KEY);
  } catch {
    // Migration failure is non-fatal
  }
}

// ─── CRUD OPERATIONS ─────────────────────────────────────────
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
    const { data, error } = await supabase
      .from('grant_projects')
      .select('*')
      .order('updated_at', { ascending: false });

    if (error) throw error;

    const projects = (data ?? []).map((row) => rowToProject(row as Record<string, unknown>));
    await setCachedProjects(projects);
    return projects;
  } catch {
    // Fall back to local cache
    return getCachedProjects();
  }
}

export async function saveProject(project: GrantProject): Promise<void> {
  const updated = { ...project, updatedAt: new Date().toISOString() };
  const row = projectToRow(updated);

  try {
    const { error } = await supabase.from('grant_projects').upsert(row);
    if (error) throw error;
  } catch {
    // Fall back to local cache
    const cached = await getCachedProjects();
    const idx = cached.findIndex((p) => p.id === updated.id);
    if (idx >= 0) {
      cached[idx] = updated;
    } else {
      cached.push(updated);
    }
    await setCachedProjects(cached);
  }

  // Always update local cache for fast reads
  const cached = await getCachedProjects();
  const idx = cached.findIndex((p) => p.id === updated.id);
  if (idx >= 0) {
    cached[idx] = updated;
  } else {
    cached.push(updated);
  }
  await setCachedProjects(cached);
}

export async function deleteProject(id: string): Promise<void> {
  try {
    const { error } = await supabase.from('grant_projects').delete().eq('id', id);
    if (error) throw error;
  } catch {
    // Fall back to local cache
  }

  // Always update local cache
  const cached = await getCachedProjects();
  await setCachedProjects(cached.filter((p) => p.id !== id));
}

export async function getProjectById(id: string): Promise<GrantProject | null> {
  try {
    const { data, error } = await supabase
      .from('grant_projects')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return rowToProject(data as Record<string, unknown>);
  } catch {
    // Fall back to local cache
    const cached = await getCachedProjects();
    return cached.find((p) => p.id === id) ?? null;
  }
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
