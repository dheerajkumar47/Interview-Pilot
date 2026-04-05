class StateGraph<T> {
  nodes: Record<string, (state: T) => Promise<Partial<T>>> = {};
  edges: Record<string, string> = {};

  constructor(config: { channels: any }) {}

  addNode(name: string, handler: (state: T) => Promise<Partial<T>>) {
    this.nodes[name] = handler;
  }

  addEdge(from: string, to: string) {
    this.edges[from] = to;
  }

  compile() {
    return {
      invoke: async (initialState: T) => {
         // minimal mock implementation for now
         return initialState;
      }
    };
  }
}

const START = "__START__";
const END = "__END__";
import { InterviewState } from "./state";
import { chatWithResumeAgent } from "./resumeAnalyst";
import { conductTechnicalInterview } from "./technicalInterviewer";
import { conductKnowledgeAssessment } from "./knowledgeAssessor";
import { conductHRInterview } from "./hrCoach";

export function createOrchestrator() {
  // Define a simple state schema for the graph channels manually to match InterviewState
  const graphChannels = {
    sessionId: { value: (x: any, y: any) => y ?? x },
    currentStage: { value: (x: any, y: any) => y ?? x },
    conversationHistory: { value: (x: any, y: any) => ({ ...x, ...y }) },
    jobDescription: { value: (x: any, y: any) => y ?? x },
    jobTitle: { value: (x: any, y: any) => y ?? x },
    company: { value: (x: any, y: any) => y ?? x },
    experience: { value: (x: any, y: any) => y ?? x },
    skills: { value: (x: any, y: any) => y ?? x },
    candidateLevel: { value: (x: any, y: any) => y ?? x }
  };

  const workflow = new StateGraph<any>({ channels: graphChannels as any });

  // Add Nodes
  workflow.addNode("resume", async (state) => {
    // Process via resume agent if a new message exists
    return { currentStage: "resume" };
  });

  workflow.addNode("technical", async (state) => {
    return { currentStage: "technical" };
  });

  workflow.addNode("knowledge", async (state) => {
    return { currentStage: "knowledge" };
  });

  workflow.addNode("hr", async (state) => {
    return { currentStage: "hr" };
  });

  // Add Edges
  workflow.addEdge(START, "resume");
  workflow.addEdge("resume", "technical");
  workflow.addEdge("technical", "knowledge");
  workflow.addEdge("knowledge", "hr");
  workflow.addEdge("hr", END);

  return workflow.compile();
}

export function getNextStage(currentStage: string, score: number): string {
  const pipeline = ["resume", "initial", "technical", "knowledge", "hr", "report"];
  const currentIdx = pipeline.indexOf(currentStage);
  if (currentIdx === -1 || currentIdx >= pipeline.length - 1) return "report";
  return pipeline[currentIdx + 1];
}
