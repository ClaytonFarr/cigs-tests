import cig, { z } from "cigs";
import { log } from "console";

/* Notes
   ================================
   
   OpenAI compatible models:
   
   - 'gpt-4o-mini' // points to gpt-4o-mini-2024-07-18
   - 'gpt-4o-2024-08-06' // required to use 4o before 10-02-2024
   - 'gpt-4o' // after 10-02-2024 this will point to gpt-4o-2024-08-06
   
   */

// Constants
// ================================

const logLevel = 3; // 4 = off

// Schemas
// ================================

// Workflow Input

const inputSourceSchema = z.object({
  type: z.enum(["User", "Workflow"]),
  id: z.string().optional(), // workflow ID
});

const targetOutputSchema: z.ZodType<any> = z.lazy(() => 
  z.object({
    type: z.enum(['string', 'number', 'object', 'array', 'integer']),
    description: z.string().optional(),
    properties: z.record(targetOutputSchema).optional(), // object properties
    items: targetOutputSchema.optional(), // array items
    required: z.array(z.string()).optional(),
    constraints: TargetOutputConstraintsSchema.optional(),
    criteria: z.string().optional(),
  })
);

const TargetOutputConstraintsSchema = z.object({
  minLength: z.number().optional(),
  maxLength: z.number().optional(),
  minimum: z.number().optional(),
  maximum: z.number().optional(),
  enum: z.array(z.union([z.string(), z.number()])).optional(),
  format: z.enum(['date', 'time', 'uri']).optional(),
  minItems: z.number().optional(),
  maxItems: z.number().optional(),
});

const maxAttemptsSchema = z.object({
  maxInputRefinements: z.number(),
  maxOutputAttempts: z.number(),
}).optional().default({
  maxInputRefinements: 3,
  maxOutputAttempts: 3,
});

const workflowInputSchema = z.object({
  inputSource: inputSourceSchema,
  inputData: z.any(),
  targetOutput: targetOutputSchema,
  maxAttempts: maxAttemptsSchema,
});

const placeholderSchema = z.object({});

// Main Workflow
// ================================

const pdca = cig("pdca", workflowInputSchema, (config) => {
  config.setLogLevel(logLevel);
  config.setModel("gpt-4o-mini");
  })

  // Validate Input
  // --------------

  // Initialize infeasibleElements and attemptsCount
  // While infeasibleElements exist and attemptsCount < maxInputRefinements:
    // For each element in targetOutput:
      // Assess feasibility of creating element from input
      // If not feasible:
        // Add to infeasibleElements
        // Determine required input refinements
    // If infeasibleElements:
      // Request input refinements from inputSource
      // Update input based on refinements
      // Clear infeasibleElements
      // Increment attemptsCount
    // Else: break loop (all elements feasible)
  // If infeasibleElements remain:
    // Log infeasibility reasons
    // Return to input source with detailed feedback

  // Organize Elements
  // -----------------

  // Initialize requiredElements, optionalElements, and dependencyGraph
  // For each element in targetOutput:
    // Identify if required or optional
    // Determine priority (high, medium, low)
    // Identify dependencies
    // Add to appropriate list and update dependencyGraph
  // Check for circular dependencies
  // If circular dependencies found:
    // Log issue and request resolution from input source
  // Create orderedElementList based on:
    // 1. Dependencies (fewer first)
    // 2. Required status (required before optional)
    // 3. Priority level

  // Process Elements
  // ----------------

  // Initialize completedElements and waitingElements
  // Identify independent elements for parallel processing
  // For each element in orderedElementList:
    // If element is independent:
      // Process in parallel
    // Else if element has no unmet dependencies:
      // Process element (PDCA cycle)
    // Else:
      // Add to waitingElements

    // Plan
    // ----
    // If first attempt, initialize attemptCounter for element
    // Create work plan to produce element:
      // Incorporate feedback from previous attempts, if applicable
      // Consider dependencies:
        // If element depends on others, ensure they are completed first
        // If other elements depend on this one, plan for potential updates
      // Define work steps:
        // LLM prompt(s)
        // Tool(s) (if applicable)
    // Log rationale why this work plan should be successful

    // Do
    // --
    // For each step in the work plan:
      // Execute step (LLM prompt or tool)
      // If step execution fails:
        // Log error and reason
        // Attempt error recovery if possible
        // If recovery fails, break and return to Plan
      // Log step output and any relevant metrics
    // If all steps complete successfully:
      // Compile final output for the element
    // Log overall work performed and any issues encountered

    // Check
    // -----
    // Evaluate output against:
      // 1. Structural requirements (data type, constraints)
      // 2. Success criteria
    // Determine if the element passes both sets of criteria:
      // If both Structural Requirements and Success Criteria are met: Mark as "Successful"
      // If either set of criteria is not fully met: Mark as "Needs Improvement"
    // For elements marked as "Needs Improvement", provide specific feedback detailing:
      // Which structural requirements were not met (if any)
      // Which success criteria were not fulfilled (if any)
      // Specific suggestions for improvement to meet criteria

    // Act
    // ---
    // If "Successful":
      // Add to completedElements
      // Update any waiting dependent elements
    // If "Needs Improvement":
      // If attempts remain:
        // Analyze feedback
        // Return to Plan step with improvements
        // Increment attemptCounter
      // If max attempts reached:
        // Mark as "Unsuccessful"
        // Log final state and reasons

    // After processing element:
      // Identify and flag dependent elements for potential updates
      // If any flagged elements are in completedElements, move them back to waitingElements for re-evaluation

  // Output
  // ------
  // If all elements in completedElements:
    // Assemble and return final output in targetOutput structure
  // Else:
    // Return to input source with:
      // Successful elements
      // Unsuccessful elements (with intermediate results)
      // Detailed logs of attempts and issues

// Helpers
// ================================

const validateInput = cig("validateInput", placeholderSchema, (config) => {
  config.setLogLevel(logLevel);
  config.setModel("gpt-4o-mini");
})

const identifyInputRefinements = cig("identifyInputRefinements", placeholderSchema, (config) => {
  config.setLogLevel(logLevel);
  config.setModel("gpt-4o-mini");
})

const requestInputRefinements = () => {};

const organizeElements = () => {};

const processElements = () => {};

const availableTools = {};

const createWorkPlan = cig("plan", placeholderSchema, (config) => {
  config.setLogLevel(logLevel);
  config.setModel("gpt-4o-mini");
  })

const doWork = cig("do", placeholderSchema, (config) => {
  config.setLogLevel(logLevel);
  config.setModel("gpt-4o-mini");
  })

const checkResult = cig("check", placeholderSchema, (config) => {
  config.setLogLevel(logLevel);
  config.setModel("gpt-4o-mini");
  })

const takeAction = cig("act", placeholderSchema, (config) => {
  config.setLogLevel(logLevel);
  config.setModel("gpt-4o-mini");
  })


  // Exports
// ================================

export { pdca as workflowPdca };