export interface ClinicalExhibit {
  id: string;
  exhibitNumber: string; // e.g. "Exhibit 1"
  dateOfService: string;
  facility: string;
  sourceText: string;
  pageCount: number;
}

export interface MedicalEvidence {
  diagnoses: string[];
  functionalLimitations: string[];
  painLevel: number | null;
  medications: string[];
  exhibitReference: string;
  dateOfService: string;
  confidenceScore: number;
  evidenceSource: string;
}

export interface SSAListingCriteria {
  listingNumber: string;
  title: string;
  description: string;
  requiredElements: string[];
  satisfiedElements: string[];
  missingElements: string[];
  isMetOrEqual: boolean;
  preponderanceScore: number;
  legalStandard: string;
}

export interface RAGAgent {
  id: string;
  name: string;
  role: string;
  description: string;
  status: "idle" | "working" | "completed" | "error";
  avatar: string;
}

export interface ProcessingLog {
  id: string;
  timestamp: string;
  agentId: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  metadata?: any;
}

export interface PatientCase {
  id: string;
  name: string;
  dob: string;
  ssn: string;
  allegedOnset: string;
  listings: string[];
  exhibits: ClinicalExhibit[];
}

export interface GWASPipelineStep {
  id: string;
  name: string;
  scriptName: string;
  description: string;
  language: "Python" | "R" | "COBOL";
  codeSnippet: string;
  status: "idle" | "running" | "completed" | "failed";
  outputLog: string[];
}

export interface AuditLedgerEntry {
  timestamp: string;
  stage: string;
  inputFile: string;
  sha3_256: string;
  crystalsSignature: string;
  cobolLine: string;
}
