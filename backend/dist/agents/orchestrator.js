"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOrchestrator = createOrchestrator;
exports.getNextStage = getNextStage;
class StateGraph {
    nodes = {};
    edges = {};
    constructor(config) { }
    addNode(name, handler) {
        this.nodes[name] = handler;
    }
    addEdge(from, to) {
        this.edges[from] = to;
    }
    compile() {
        return {
            invoke: async (initialState) => {
                // minimal mock implementation for now
                return initialState;
            }
        };
    }
}
const START = "__START__";
const END = "__END__";
function createOrchestrator() {
    // Define a simple state schema for the graph channels manually to match InterviewState
    const graphChannels = {
        sessionId: { value: (x, y) => y ?? x },
        currentStage: { value: (x, y) => y ?? x },
        conversationHistory: { value: (x, y) => ({ ...x, ...y }) },
        jobDescription: { value: (x, y) => y ?? x },
        jobTitle: { value: (x, y) => y ?? x },
        company: { value: (x, y) => y ?? x },
        experience: { value: (x, y) => y ?? x },
        skills: { value: (x, y) => y ?? x },
        candidateLevel: { value: (x, y) => y ?? x }
    };
    const workflow = new StateGraph({ channels: graphChannels });
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
function getNextStage(currentStage, score) {
    const pipeline = ["resume", "initial", "technical", "knowledge", "hr", "report"];
    const currentIdx = pipeline.indexOf(currentStage);
    if (currentIdx === -1 || currentIdx >= pipeline.length - 1)
        return "report";
    return pipeline[currentIdx + 1];
}
//# sourceMappingURL=orchestrator.js.map