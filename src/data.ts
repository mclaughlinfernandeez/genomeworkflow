import { PatientCase, SSAListingCriteria, GWASPipelineStep } from "./types";

export const SAMPLE_CASES: PatientCase[] = [
  {
    id: "case-hiv",
    name: "Thomas S. McLaughlin",
    dob: "1978-08-14",
    ssn: "XXX-XX-5142",
    allegedOnset: "2024-04-12",
    listings: ["14.11"],
    exhibits: [
      {
        id: "exhibit-01",
        exhibitNumber: "Exhibit 1A",
        dateOfService: "2025-10-14",
        facility: "Stanford University Medical Center - Infectious Diseases",
        sourceText: `PATIENT CHART SUMMARY - CONFIDENTIAL MEDICAL RECORD
Patient Name: Thomas S. McLaughlin
Date of Birth: 08/14/1978
Date of Service: 10/14/2025
Provider: Dr. Marcus Vance, MD (Infectious Disease)

Chief Complaint: Progressive profound weight loss, intermittent viral spikes, severe sensory neuropathy.
Physical Exam: Weight is down to 134 lbs from baseline 168 lbs (severe wasting, BMI: 18.2). Visible signs of temporal wasting and extremity muscle atrophy.
Neurological assessment: Intermittent paresthesia in bilateral lower extremities. Patient reports burning pain (severity 7/10) limiting standing or walking duration.
Functional Notes: Patient reports being unable to lift more than 10 lbs. Cannot walk continuously for more than 10 minutes without severe neuropathic distress or profound cardiorespiratory fatigue. Requires a cane for long distances.
Labs: CD4 count is 185 cells/mm3 (severe cellular immunodeficiency). Viral load remains detectable despite adjusted antiretroviral therapy (HAART: Biktarvy daily).
Assessment: HIV-1 infection with wasting syndrome, severe peripheral neuropathy, CD4 < 200. Persistent opportunistic fatigue.`,
        pageCount: 2
      },
      {
        id: "exhibit-02",
        exhibitNumber: "Exhibit 2B",
        dateOfService: "2026-03-10",
        facility: "Bay Area Neuromuscular Rehab",
        sourceText: `CLINICAL EVALUATION & FUNCTIONAL CAPACITY ASSESSMENT
Patient: Thomas S. McLaughlin
Date of Assessment: 03/10/2026
Therapist: Elena Rostova, DPT

Objective Findings:
Gait: Moderately antalgic and wide-based. Positive Romberg sign, indicating deficits in proprioception.
Strength: Bilateral ankle dorsiflexion is 3/5. Knee extension 4/5. Grip strength remains relatively intact but reports tremors during fine motor coordination.
RFC (Residual Functional Capacity) Observations:
1. Lift/Carry: Patient can lifted up to 8 lbs occasionally but shows visible hand tremors and axial spinal strain. Repetitive lifting is clinically contraindicated.
2. Stand/Walk: Patient is restricted to standing/walking less than 2 hours in an 8-hour workday. Continuous standing without support is limited to 8-10 minutes. Requires assistive walking device (single-point cane) for open environments.
3. Fatigue: Extreme fatigability observed. After 15 minutes of low-intensity exercises, heart rate spiked to 142 bpm and patient required 20 minutes of recumbent rest.
Conclusion: Demonstrates profound functional compromise, showing limitations marking an inability to sustain full-time sedentary or light employment. Fits criteria for extreme activity limitation over time.`,
        pageCount: 3
      }
    ]
  },
  {
    id: "case-ms",
    name: "Sarah Jenkins",
    dob: "1983-11-22",
    ssn: "XXX-XX-8491",
    allegedOnset: "2023-09-01",
    listings: ["11.09"],
    exhibits: [
      {
        id: "exhibit-03",
        exhibitNumber: "Exhibit 1A",
        dateOfService: "2024-11-05",
        facility: "Mayo Clinic Department of Neurology",
        sourceText: `NEUROLOGICAL CONSULTATION
Patient Name: Sarah Jenkins
Date of Exam: 11/05/2024
Physician: Dr. Robert Mercer, MD, PhD

History of Present Illness: Sarah is a 40-year-old female diagnosed with Relapsing-Remitting Multiple Sclerosis in 2018, now showing secondary progressive traits.
Symptom Review & Clinical Evaluation:
1. Motor: Prominent spasticity in lower extremities, left greater than right. Hyperreflexia 3+ at knees. Unsustained ankle clonus.
2. Stability: Severe gait ataxia. Patient was unable to perform a straight-line heel-to-toe walk without substantial loss of balance. Needs bilateral forearm crutches for safe community ambulation.
3. Cognitive: Subjective "brain fog" reports. Symbol Digit Modalities Test (SDMT) score is 1.5 standard deviations below average, marking cognitive slowing.
4. Active Symptoms: 8/10 fatigue. Sensory abnormalities in both upper limbs described as constant numbness.
MRI Spine & Brain: Demonstrates multiple new high-signal T2 hyperintense demyelinating lesions in the cervical spinal cord and periventricular white matter.
Assessment: Secondary Progressive Multiple Sclerosis with severe locomotive ataxia. Unsafe to navigate physical environments unsupported.`,
        pageCount: 4
      }
    ]
  },
  {
    id: "case-adhd",
    name: "Arthur Pendelton (Gonomic Participant #142)",
    dob: "1994-03-31",
    ssn: "XXX-XX-1983",
    allegedOnset: "2025-01-15",
    listings: ["12.11"],
    exhibits: [
      {
        id: "exhibit-04",
        exhibitNumber: "Exhibit 1A",
        dateOfService: "2025-12-10",
        facility: "Genomic Neuro-Cognitive Registry",
        sourceText: `GENOMIC PSYCHIATRIC RECORD & COGNITIVE LOG
Subject Identifier: Arthur Pendelton / Gonomic-142
Date of Extraction: 12/10/2025
Clinical Coordinator: Dr. Susan Cho, PhD

DNA Sample Reference: adhd_gwas_sample_142.tsv.gz (analyzed via ADH_GWAS summary model)
Polygenic Risk Score (PRS): Calculated using high-density genotyping array. LDpred2 adjusted score lands in the 98th percentile, highly predictive of treatment-resistant ADHD.
Clinical Presentation: Shows extreme psychiatric executive dysfunction. Impaired attention span restricts complex cognitive tasks to 5-minute continuous windows. Extreme difficulty organizing tasks, chronic cognitive pacing deficits.
Detailed Neuropsychological Assessment:
- Working Memory Index (WMI): 78 (Borderline Range)
- Processing Speed Index (PSI): 74 (Extremely Low)
- Severe hyperactive restlessness, unable to sit in standard posture for > 15 minutes.
Diagnostic Conclusion: ADHD, Inattentive and Hyperactive combined type, severe, verified by clinical scale and highly supportive polygenic neuro-marker indicators.`,
        pageCount: 3
      }
    ]
  }
];

export const LISTINGS_MUTATOR: Record<string, SSAListingCriteria> = {
  "14.11": {
    listingNumber: "14.11",
    title: "Human Immunodeficiency Virus (HIV) Infection",
    description: "Evaluates HIV with documented fungal, bacterial, or viral opportunistic strains, cellular immuno-suppression (CD4 < 200), or significant wasting syndrome.",
    requiredElements: [
      "Laboratory evidence of HIV infection",
      "CD4 lymphocytes count under 200 cells/mm3",
      "Marked restriction in activities of daily living OR in completing tasks with functional efficiency"
    ],
    satisfiedElements: [],
    missingElements: [],
    isMetOrEqual: false,
    preponderanceScore: 0,
    legalStandard: "Primary / Medical Equivalency ('Or-Equal')"
  },
  "11.09": {
    listingNumber: "11.09",
    title: "Multiple Sclerosis (MS)",
    description: "Evaluates demyelinating neurological deficits characterized by severe disorganization of motor function in two limbs, or marked cognitive deficits with physical fatigue.",
    requiredElements: [
      "Documented diagnostic demyelinating plaques on spinal/cranial MRIs",
      "Persistent instability in walking or standing requiring assistive devices (crutches/cane)",
      "Marked limitation in physical vigor, pace, and sustained physical execution"
    ],
    satisfiedElements: [],
    missingElements: [],
    isMetOrEqual: false,
    preponderanceScore: 0,
    legalStandard: "Primary Section 11.09 criteria"
  },
  "12.11": {
    listingNumber: "12.11",
    title: "Neurodevelopmental Disorders (ADHD/ASD)",
    description: "Characterized by hyperactive behavior, profound inattention, and marked limitations in memory, executive tasks, social pacing, or self-management.",
    requiredElements: [
      "Frequent inattentiveness, impulsiveness, and poor concentration patterns",
      "Extreme limitation in cognitive execution and processing speed indices",
      "Longitudinal clinical history of performance disruption across educational or employment settings"
    ],
    satisfiedElements: [],
    missingElements: [],
    isMetOrEqual: false,
    preponderanceScore: 0,
    legalStandard: "Primary / Diagnostic Genetic Correlation"
  }
};

export const PIPELINE_CODE_SNIPPETS: GWASPipelineStep[] = [
  {
    id: "step-orchestrator",
    name: "Pipeline Orchestrator",
    scriptName: "pipeline.py",
    description: "Orchestrates manifests, cryptographically fingerprints datasets using SHA3-256 hashes, kicks off physical R algorithms, and prepares the secure execution logging context.",
    language: "Python",
    status: "idle",
    codeSnippet: `import os
import json
import hashlib
import subprocess
import datetime

PROJECT_ROOT = os.getcwd()
RUN_ID = datetime.datetime.utcnow().strftime("prs_run_%Y%m%d_%H%M%S")

MANIFEST = {
    "run_id": RUN_ID,
    "timestamp": datetime.datetime.utcnow().isoformat()
}

def sha3_file(path):
    h = hashlib.sha3_256()
    with open(path, "rb") as f:
        while True:
            chunk = f.read(8192)
            if not chunk:
                break
            h.update(chunk)
    return h.hexdigest()

def record_hash(label, path):
    digest = sha3_file(path)
    MANIFEST[label] = {
        "file": path,
        "sha3_256": digest
    }
    return digest

print("=== GWAS PRS PIPELINE ===")
gwas_file = "gwas/summary_stats/adhd_gwas.tsv.gz"
record_hash("raw_gwas", gwas_file)

# Run R-based harmonization and model calculations
subprocess.run(["Rscript", "prs/scripts/run_prs_pipeline.R"], check=True)

# Record final outputs
record_hash("prs_output", "prs/outputs/prs_scores.csv")

with open(f"audit/manifests/{RUN_ID}.json", "w") as f:
    json.dump(MANIFEST, f, indent=2)

print(f"Manifest generated successfully: audit/manifests/{RUN_ID}.json")`,
    outputLog: []
  },
  {
    id: "step-harmonize",
    name: "GWAS Harmonization",
    scriptName: "harmonize.R",
    description: "Filters SNPs to ensure standard AT / CG base matching and filters out ambiguous palindromic alleles, standardizing summary statistics.",
    language: "R",
    status: "idle",
    codeSnippet: `library(data.table)

harmonize_snps <- function(df){
    valid <- c("A","C","G","T")

    # Match bases to standard genomic orientation
    df <- df[
      effect_allele %in% valid &
      non_effect_allele %in% valid
    ]

    # Purge polymorphic / palindromic strands (e.g. A/T, C/G are ambiguous)
    df <- df[
      effect_allele != non_effect_allele
    ]

    return(df)
}`,
    outputLog: []
  },
  {
    id: "step-ld-correct",
    name: "LD Correlation Matrix",
    scriptName: "ld_correct.R",
    description: "Computes the Linkage Disequilibrium (LD) correlation model among physical variants using a sliding 3-centiMorgan window configuration.",
    language: "R",
    status: "idle",
    codeSnippet: `library(bigsnpr)

run_ld_matrix <- function(G, map){
    # Slide across physical positions using a genetic recombination distance window
    corr <- snp_cor(
        G,
        infos.pos = map$physical.pos,
        size = 3/1000
    )

    return(corr)
}`,
    outputLog: []
  },
  {
    id: "step-prs-engine",
    name: "LDpred2 Engine",
    scriptName: "compute_prs.R",
    description: "Applies Bayesian infinitesimal modeling to calculate individual polygenic liability weights scaled by the LD reference array.",
    language: "R",
    status: "idle",
    codeSnippet: `library(bigsnpr)

compute_prs <- function(corr, df_beta, genotype_matrix){
    # Run LDpred2 Infinitesimal variant calculation
    # Heritability (h2) configured to 0.20 based on neuropsychiatric trials
    beta_inf <- snp_ldpred2_inf(
        corr,
        df_beta,
        h2 = 0.20
    )

    # Multiply genotyping state markers by computed beta coefficients
    prs <- genotype_matrix %*% beta_inf

    return(prs)
}`,
    outputLog: []
  },
  {
    id: "step-validation",
    name: "Receiver Operating Curve",
    scriptName: "validate.R",
    description: "Exposes sensitivity and specificity curves from computed scores, calculating predictive strength AUC indices.",
    language: "R",
    status: "idle",
    codeSnippet: `library(pROC)

validate_prs <- function(y_true, prs_scores){
    # Formulate ROC object from true conditions and target scores
    roc_obj <- roc(
        y_true,
        prs_scores
    )

    auc_val <- auc(roc_obj)

    return(list(
        auc = auc_val
    ))
}`,
    outputLog: []
  },
  {
    id: "step-ledger",
    name: "Chain-of-Custody Logging",
    scriptName: "audit_ledger.py",
    description: "Appends immutable SHA3 file hashes to a sequential JSON Lines ledger, building an ongoing tamper-evident blockchain log.",
    language: "Python",
    status: "idle",
    codeSnippet: `import json
import hashlib
from pathlib import Path

ledger_file = Path("audit/ledger.jsonl")

def append_event(stage, file_hash):
    event = {
        "stage": stage,
        "hash": file_hash
    }

    serialized = json.dumps(event)
    
    # Generate cryptographic binding linking the event sequence
    chain_hash = hashlib.sha3_256(
        serialized.encode()
    ).hexdigest()

    event["chain_hash"] = chain_hash

    # Write in write-once append fashion
    with open(ledger_file, "a") as f:
        f.write(json.dumps(event) + "\\n")`,
    outputLog: []
  },
  {
    id: "step-cobol-custody",
    name: "Mainframe Chain of Custody",
    scriptName: "CHAINCUST.cbl",
    description: "A production COBOL program intended to write structured event hashes into a strict LINE SEQUENTIAL mainframe ledger.",
    language: "COBOL",
    status: "idle",
    codeSnippet: `IDENTIFICATION DIVISION.
       PROGRAM-ID. CHAINCUST.

       ENVIRONMENT DIVISION.

       INPUT-OUTPUT SECTION.

       FILE-CONTROL.

           SELECT LEDGER-FILE
               ASSIGN TO "ledger.txt"
               ORGANIZATION IS LINE SEQUENTIAL.

       DATA DIVISION.

       FILE SECTION.

       FD LEDGER-FILE.

       01 LEDGER-REC PIC X(200).

       WORKING-STORAGE SECTION.

       01 WS-STAGE PIC X(50).
       01 WS-HASH  PIC X(128).

       PROCEDURE DIVISION.

       MAIN-PARA.

           OPEN EXTEND LEDGER-FILE

           MOVE "PRS_OUTPUT" TO WS-STAGE

           MOVE
           "8F12D93A4F11EBC89812A98DBC81F27E9F9C3D"
           TO WS-HASH

           STRING
               WS-STAGE DELIMITED BY SPACE
               "|"
               WS-HASH DELIMITED BY SPACE
               INTO LEDGER-REC

           WRITE LEDGER-REC

           CLOSE LEDGER-FILE

           STOP RUN.`,
    outputLog: []
  },
  {
    id: "step-cobol-evidence",
    name: "Mainframe Evidentiary Reporter",
    scriptName: "EVIDENCE.cbl",
    description: "Generates high-visibility litigation-grade visual report of SHA3 calculations and verified chain elements for terminal output.",
    language: "COBOL",
    status: "idle",
    codeSnippet: `IDENTIFICATION DIVISION.
       PROGRAM-ID. EVIDENCE.

       DATA DIVISION.

       WORKING-STORAGE SECTION.

       01 REPORT-LINE PIC X(200).

       PROCEDURE DIVISION.

           DISPLAY
           "POLYGENIC RISK SCORE ANALYSIS"

           DISPLAY
           "RUN ID: PRS_RUN_20260524"

           DISPLAY
           "LDPRED2 MODEL"

           DISPLAY
           "SHA3 VERIFIED"

           DISPLAY
           "CHAIN OF CUSTODY VERIFIED"

           STOP RUN.`,
    outputLog: []
  }
];
