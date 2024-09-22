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
  
  // infeasibleElements = []
  // attemptsCount = 0

  // While there are infeasible elements and attemptsCount < maxInputRefinements:
    // For each element in the target output:
      // If element not in infeasibleElements:
        // Assess feasibility of creating element from input
        // If element not feasible:
          // Add element to infeasibleElements
          // Determine input refinements needed to make it feasible

    // If infeasibleElements is not empty:
      // Request input refinement(s) from inputSource for all infeasibleElements
      // Receive updated input based on refinements
      // Clear infeasibleElements
      // Increment attemptsCount
    // Else:
      // All elements are feasible (break loop)

  // If infeasibleElements is not empty:
    // Handle case where some elements remain infeasible after max attempts

  // Organize Elements
  // -----------------
  
  // Process Elements
  // ----------------

    // Plan
    // ----

    // Do
    // --

    // Check
    // -----

    // Act
    // ---

  // Output
  

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