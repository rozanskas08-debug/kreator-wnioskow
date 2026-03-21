import AsyncStorage from "@react-native-async-storage/async-storage";
import type { ClientProject, ClientStep, ClientDocument, DocumentStatus, StepStatus } from "./data/client-types";
import { FOUNDATION_WIZARD_STEPS } from "./data/foundation-data";

const PROJECTS_KEY = "@fundacja_projects";

// ── Generate ID ──────────────────────────────────────────────
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

// ── Build default steps from foundation data ─────────────────
function buildDefaultSteps(): ClientStep[] {
  return FOUNDATION_WIZARD_STEPS.map((step) => ({
    id: step.id,
    stepNumber: step.stepNumber,
    title: step.title,
    status: "not_started" as StepStatus,
    consultantNote: "",
    documents: step.checklist.map((item) => ({
      id: item.id,
      label: item.label,
      required: item.required,
      status: "pending" as DocumentStatus,
      note: "",
    })),
  }));
}

// ── Create new project ────────────────────────────────────────
export function createProject(clientName: string, foundationName: string, phone?: string, email?: string): ClientProject {
  const now = new Date().toISOString();
  return {
    id: generateId(),
    clientName,
    foundationName,
    phone,
    email,
    startedAt: now,
    updatedAt: now,
    currentStep: 0,
    steps: buildDefaultSteps(),
    isArchived: false,
  };
}

// ── Load all projects ─────────────────────────────────────────
export async function getAllProjects(): Promise<ClientProject[]> {
  try {
    const raw = await AsyncStorage.getItem(PROJECTS_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as ClientProject[];
  } catch {
    return [];
  }
}

// ── Save project ──────────────────────────────────────────────
export async function saveProject(project: ClientProject): Promise<void> {
  const all = await getAllProjects();
  const idx = all.findIndex((p) => p.id === project.id);
  const updated = { ...project, updatedAt: new Date().toISOString() };
  if (idx >= 0) {
    all[idx] = updated;
  } else {
    all.unshift(updated);
  }
  await AsyncStorage.setItem(PROJECTS_KEY, JSON.stringify(all));
}

// ── Delete project ────────────────────────────────────────────
export async function deleteProject(id: string): Promise<void> {
  const all = await getAllProjects();
  await AsyncStorage.setItem(PROJECTS_KEY, JSON.stringify(all.filter((p) => p.id !== id)));
}

// ── Get project by ID ─────────────────────────────────────────
export async function getProjectById(id: string): Promise<ClientProject | null> {
  const all = await getAllProjects();
  return all.find((p) => p.id === id) ?? null;
}

// ── Update document status ────────────────────────────────────
export async function updateDocumentStatus(
  projectId: string,
  stepId: string,
  docId: string,
  status: DocumentStatus,
  note?: string,
): Promise<ClientProject | null> {
  const project = await getProjectById(projectId);
  if (!project) return null;
  const step = project.steps.find((s) => s.id === stepId);
  if (!step) return null;
  const doc = step.documents.find((d) => d.id === docId);
  if (!doc) return null;
  doc.status = status;
  if (note !== undefined) doc.note = note;
  doc.updatedAt = new Date().toISOString();
  // Auto-update step status
  const allDocs = step.documents;
  const approvedCount = allDocs.filter((d) => d.status === "approved").length;
  const requiredDocs = allDocs.filter((d) => d.required);
  const allRequiredApproved = requiredDocs.every((d) => d.status === "approved");
  if (allRequiredApproved && requiredDocs.length > 0) {
    step.status = "done";
  } else if (approvedCount > 0 || allDocs.some((d) => d.status === "received" || d.status === "needs_correction")) {
    step.status = "in_progress";
  }
  await saveProject(project);
  return project;
}

// ── Update step note ──────────────────────────────────────────
export async function updateStepNote(projectId: string, stepId: string, note: string): Promise<void> {
  const project = await getProjectById(projectId);
  if (!project) return;
  const step = project.steps.find((s) => s.id === stepId);
  if (step) {
    step.consultantNote = note;
    await saveProject(project);
  }
}

// ── Compute project progress ──────────────────────────────────
export function getProjectProgress(project: ClientProject): {
  totalDocs: number;
  approvedDocs: number;
  stepsCompleted: number;
  pct: number;
} {
  const allDocs = project.steps.flatMap((s) => s.documents);
  const totalDocs = allDocs.length;
  const approvedDocs = allDocs.filter((d) => d.status === "approved").length;
  const stepsCompleted = project.steps.filter((s) => s.status === "done").length;
  const pct = totalDocs > 0 ? Math.round((approvedDocs / totalDocs) * 100) : 0;
  return { totalDocs, approvedDocs, stepsCompleted, pct };
}

// ── Get step completion ───────────────────────────────────────
export function getStepCompletion(step: ClientStep): { total: number; approved: number; required: number; requiredApproved: number } {
  const total = step.documents.length;
  const approved = step.documents.filter((d) => d.status === "approved").length;
  const required = step.documents.filter((d) => d.required).length;
  const requiredApproved = step.documents.filter((d) => d.required && d.status === "approved").length;
  return { total, approved, required, requiredApproved };
}
