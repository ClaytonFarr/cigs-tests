import cig, { z } from "cigs";
import { log } from "console";

// Constants

const logLevel = 3; // 4 = off

// Schemas

const inputSourceSchema = z.object({
  type: z.enum(["User", "Previous Step"]),
  id: z.string().optional(),
});

const inputDataSchema = z.object({
  type: z.enum(["New", "Prior Output Refinement"]),
  value: z.any(),
  refinementFeedback: z.string().optional(),
});

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

const targetOutputSchema: z.ZodType<any> = z.lazy(() => 
  z.object({
    type: z.enum(['string', 'number', 'object', 'array', 'integer']),
    description: z.string().optional(),
    properties: z.record(targetOutputSchema).optional(),
    items: targetOutputSchema.optional(),
    required: z.array(z.string()).optional(),
    constraints: TargetOutputConstraintsSchema.optional(),
    criteria: z.string().optional(),
  })
);

const workflowInputSchema = z.object({
  inputSource: inputSourceSchema,
  inputData: inputDataSchema,
  targetOutput: targetOutputSchema,
});

const feasibilityInputSchema = z.object({
  workflowInput: z.any(),
  targetOutput: targetOutputSchema,
});

const feasibilityOutputSchema = z.object({
  rating: z.number().min(1).max(6),
});

// const refinementsNeededSchema = z.object({
//   refinements: z.array(z.string()),
// });

// const workStepSchema = z.object({
//   llmPrompt: z.string(),
//   tools: z.array(z.string()).optional(),
// });

// const workPlanSchema = z.record(z.string(), z.array(workStepSchema));

// const workPlanRationaleSchema = z.string();

// Main Workflow

// TODO: add examples
// TODO: add more detail on feasibility rating scale
// TODO: update to loop creation of work plan + rationale for each output element
// TODO: create set of available tools
// TODO: update to select tool(s) for work plan from available tools

log(`\nStarting Plan workflow...\n`);

const plan = cig("plan", workflowInputSchema, (config) => {
  // Reviews the provided input against the target output structure.
  // Assesses the feasibility of creating all targets output(s) successfully from the provided input(s).
  // If the feasibility is low, request input refinements.
  // If the feasibility is high, create a work plan for each necessary output element.

  config.setLogLevel(logLevel);
  config.setDescription("A workflow for planning tasks to transform an input into desired output(s).");

  // config.setModel("gpt-4o-2024-08-06");
  // config.setModel("gpt-4o"); // after 10-02-2024 this will point to gpt-4o-2024-08-06
  config.setModel("gpt-4o-mini"); // points to gpt-4o-mini-2024-07-18
  })
  .handler(async (input) => {
    try {

      const feasibility = await assessWorkFeasibility.run(input);
      log(`\nFeasibility: ${feasibility.rating}\n`);

      // if (feasibility.rating <= 4) {
      //   const refinements = await determineRefinementsNeeded.run(input);
      //   return {
      //     success: false,
      //     inputRefinementsNeeded: refinements,
      //   };
      // } else {
      //   const workPlan = await createWorkPlan.run(input);
      //   const workPlanRationale = await articulateWorkPlanRationale.run(workPlan[0]);
      //   return {
      //     success: true,
      //     workPlan,
      //     workPlanRationale,
      //   };
      // }

    } catch (error) {
      console.error("Error in a Plan workflow handler:", error);
      throw new Error("Plan workflow execution failed");
    }
  });

// Helper Workflows

const assessWorkFeasibility = cig("assessWorkFeasibility", feasibilityInputSchema, (config) => {
  config.setLogLevel(logLevel);
  config.setDescription("Assess the feasibility of creating the output from the input.");
})
  .schema(feasibilityOutputSchema, (config) => {
    // transforms input to specified output
    config.addInstruction(
      "Rate the feasibility of creating all of the target output(s) from the provided input(s) on a scale of 1 to 6.",
    );
    config.addExample("Impossible", { rating: 1 });
    config.addExample("Highly unlikely", { rating: 2 });
    config.addExample("Somewhat unlikely", { rating: 3 });
    config.addExample("Unclear", { rating: 4 });
    config.addExample("Likely", { rating: 5 });
    config.addExample("Certain", { rating: 6 });
  })

// const determineRefinementsNeeded = cig("determineRefinementsNeeded", workflowInputSchema, (config) => {
//   config.setLogLevel(logLevel);
//   config.setDescription("Determines input refinements needed to make the output feasible.");
// })
//   .generate(refinementsNeededSchema, 1, (config) => {
//     config.addInstruction(
//       "Determine the input refinements needed to make the output feasible.",
//     );
//   });

// const createWorkPlan = cig("createWorkPlan", workflowInputSchema, (config) => {
//   config.setLogLevel(logLevel);
//   config.setDescription("Creates detailed work plan to produce desired output(s) from input data.");
// })
//   .generate(workPlanSchema, 1, (config) => {
//     config.addInstruction(
//       "Create a work plan with necessary steps to create each output element.",
//     );
//   });

// const articulateWorkPlanRationale = cig("articulateWorkPlanRationale", workPlanSchema, (config) => {
//   config.setLogLevel(logLevel);
//   config.setDescription("Articulates rationale for work plan.");
// })
//   .generate(workPlanRationaleSchema, 1, (config) => {
//     config.addInstruction(
//       "Explain why this work plan should be successful.",
//     );
//   });

export { plan };