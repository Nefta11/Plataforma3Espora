export type ProjectStage = 
  | "acquisition"
  | "eho"
  | "development"
  | "presentation"
  | "calibration";

export const PROJECT_STAGES: ProjectStage[] = [
  "acquisition",
  "eho",
  "development",
  "presentation",
  "calibration"
];

export const STAGE_LABELS: Record<ProjectStage, string> = {
  acquisition: "Ventas",
  eho: "EHO",
  development: "Kick-off y desarrollo",
  presentation: "Presentación",
  calibration: "Calibración"
};

export interface StageAccess {
  role: string;
  stages: ProjectStage[];
}

export const ROLE_STAGE_ACCESS: StageAccess[] = [
  {
    role: "alpha-sales",
    stages: ["acquisition", "eho", "development"]
  },
  {
    role: "alpha-ssc",
    stages: ["acquisition", "eho", "development", "presentation", "calibration"]
  },
  {
    role: "espora-strategy",
    stages: ["eho", "development"]
  },
  {
    role: "testank-studies",
    stages: ["eho", "development", "presentation", "calibration"]
  },
  {
    role: "espora-accompaniment",
    stages: ["eho", "development", "presentation", "calibration"]
  },
  {
    role: "espora-management",
    stages: ["eho", "development", "presentation", "calibration"]
  },
  {
    role: "espora-production",
    stages: ["eho", "development"]
  },
  {
    role: "espora-diffusion",
    stages: ["eho", "development"]
  }
];