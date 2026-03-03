export interface Turn {
  speaker: "student" | "teacher";
  text: string;
  isShutdown: boolean;
}

export interface Alternatives {
  dialogicTeaching: string;
  productiveFailure: string;
  uptake: string;
  pressingForReasoning: string;
}

export interface Example {
  id: string;
  obsid: number;
  teacherTurnIdx: number;
  teacherText: string;
  studentText: string;
  context: Turn[];
  alternatives: Alternatives;
}

export const FRAMEWORK_INFO: Record<
  keyof Alternatives,
  { label: string; citation: string; description: string; paperUrl?: string }
> = {
  dialogicTeaching: {
    label: "Dialogic Teaching",
    citation: "Alexander, 2018",
    description:
      "Promotes interthinking by distributing authority across the classroom through reciprocal dialogue.",
    paperUrl: "https://doi.org/10.1080/0305764X.2017.1389666",
  },
  productiveFailure: {
    label: "Productive Failure",
    citation: "Kapur & Roll, 2023",
    description:
      "Uses student misconceptions as a resource for deeper conceptual change through deliberate struggle.",
  },
  uptake: {
    label: "Uptake",
    citation: "Nystrand, 1997",
    description:
      "Validates student ideas as intellectual capital and extends the chain of inquiry.",
  },
  pressingForReasoning: {
    label: "Pressing for Reasoning",
    citation: "Chin, 2007",
    description:
      "Shifts focus from the answer to the reasoning process, maintaining high cognitive demand.",
    paperUrl: "https://doi.org/10.1002/tea.20171",
  },
};

import examplesData from "@/data/examples.json";
export const examples: Example[] = examplesData as Example[];
