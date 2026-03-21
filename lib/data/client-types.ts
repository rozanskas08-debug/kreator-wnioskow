// ============================================================
// CLIENT PROJECT TYPES — Consultant Tool
// ============================================================

export type DocumentStatus = "pending" | "received" | "needs_correction" | "approved";
export type StepStatus = "not_started" | "in_progress" | "done";

export interface ClientDocument {
  id: string;
  label: string;
  required: boolean;
  status: DocumentStatus;
  note: string; // consultant note
  updatedAt?: string;
}

export interface ClientStep {
  id: string;
  stepNumber: number;
  title: string;
  status: StepStatus;
  documents: ClientDocument[];
  consultantNote: string;
  completedAt?: string;
}

export interface ClientProject {
  id: string;
  clientName: string;       // name of the client person
  foundationName: string;   // name of the foundation being registered
  phone?: string;
  email?: string;
  startedAt: string;
  updatedAt: string;
  currentStep: number;      // 0-based index
  steps: ClientStep[];
  isArchived: boolean;
  // Statute data (filled in statute writer)
  statuteData?: StatuteFormData;
}

// ============================================================
// STATUTE FORM DATA
// ============================================================

export interface StatuteFormData {
  // Basic info
  foundationName: string;
  foundationCity: string;       // siedziba
  foundationAddress?: string;
  founderName: string;          // fundator (osoba fizyczna lub prawna)
  founderType: "person" | "company";
  founderAddress: string;
  initialFund: string;          // fundusz założycielski (kwota)

  // Purpose (cel fundacji)
  purposes: string[];           // list of purposes

  // Board
  boardMinMembers: string;      // min liczba członków zarządu
  boardMaxMembers: string;
  boardTermYears: string;       // kadencja
  boardRepresentation: string;  // sposób reprezentacji

  // Optional features
  hasEconomicActivity: boolean;        // działalność gospodarcza
  hasOPP: boolean;                     // OPP (organizacja pożytku publicznego)
  hasVolunteerProgram: boolean;        // wolontariat
  hasSupervisoryBoard: boolean;        // rada fundacji / rada nadzorcza
  supervisoryBoardName?: string;       // nazwa organu nadzorczego

  // Additional
  operationArea: "poland" | "world";   // obszar działania
  liquidationBeneficiary?: string;     // beneficjent majątku po likwidacji
}

// ============================================================
// VERIFICATION ITEM
// ============================================================

export interface VerificationItem {
  id: string;
  label: string;
  description: string;
  example?: string;
  checked: boolean;
  required: boolean;
}

export interface VerificationSection {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  color: string;
  items: VerificationItem[];
}
