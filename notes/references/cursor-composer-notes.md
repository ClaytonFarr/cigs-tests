# Create Successful LLM Workflows

Your goal is to convert a user provided workflow description into a 
coded script that can be executed to successfully complete the workflow.

Do this by completing 2 phases of work:

## Phase 1

1. receive or request from the user:
   - the workflow's desired output(s), including any preferences for the format of the output(s)
   - the workflow's expected inputs, including any constraints on the input(s)
   - any preferences for the workflow's structure or steps
2. create a new markdown document (`/notes/workflows/workflow-{workflowLabel}.md`) that contains a step-by-step workflow outline which:
   - specifies the workflow's input(s) and output(s)
   - specifies the steps to take to successfully convert the inputs into the outputs
     - utilize as small and as simple steps as possible (each step should be simple enough to have a very high likelihood of success)
     - for each step - note the step's expected input, output, and reasoning for the step
   - includes flow logic to handle
     - any errors that may occur during the workflow
     - asking the user for clarification or additional information if needed
3. append to end of the outline document a simple real-world example that demonstrates the expected behavior of the workflow
4. ask the user to review the workflow outline and provide feedback
5. repeat steps 2-4 until the workflow outline is approved by the user

**Phase 1 Work Considerations**

- the initial user input may be detailed or simple, in all cases evaluate any user assumptions 
  and determine the ideal flow and steps to conform to the user's inputs, outputs, and preferences
- whenever needed, ask the user for clarification or additional information
  to successfully complete work in phase 2

## Phase 2

1. reference the approved workflow outline (`/notes/workflows/workflow-{workflowLabel}.md`)
2. create a new script (`/code/workflows/workflow-{workflowLabel}.ts`) that:
   - utilizes `cigs` (an llm workflow framework) to implement the workflow
   - includes all code needed to successfully implement the workflow, including error handling and user input handling
   - executes workflow with example from outline's example section
3. ask the user to run the workflow script and provide feedback
4. repeat steps 2-3 until the workflow script is approved by the user

**Phase 2 Work Considerations**

_cigs_

`cigs` is an LLM workflow framework. It uses Zod to define input and output schemas, and OpenAI's 'structured-outputs' to convert the input data into the desired output format. Each method in `cigs` can be used as one or more steps in a workflow, and the output from one method is passed as the input to the next method. `cig` workflows can be nested as needed (e.g. using some workflows as steps or helpers in other workflows).

Overview: @cigs-read-me.md
Repo: https://github.com/cigs-tech/cigs
Methods:
  - `.schema()`: converts input to specified output schema; creates 1 output (LLM prompted to use inference or deduction to supply missing or omitted data)
  - `.generate()`: converts input to specified output schema; creates 1+ outputs (LLM prompted to create varied and random examples of desired output)
  - `.generate()`: generate 1+ responses from LLM that use input data and return 1+ outputs
  - `.classify()`: select which user-defined category best describes the input data
  - `.uses()`: use to execute 1+ tools (other cigs instances) on input; each tool's output is passed as input to next tool (Note: not currently working as expected)
  - `.handler()`: apply a custom function and/or other cigs to input
Configs:
  - `config.setModel()` // llm model to use for call; e.g. 'config.setModel("gpt-4o-mini")'
  - `config.setLogLevel()` // logging level for workflow; e.g. 'config.setLogLevel(1)'
  - `config.addInstruction()` // user instruction to LLM call; e.g. 'config.addInstruction("...")'
  - `config.addExample()` // example added to LLM call; can add multiple examples; e.g. 'config.addExample("...")'
Current bugs:
  - `.uses()` currently not working as expected - perform same operation(s) using `.handler()` instead
  - using strings as inputs for methods is unreliable - always use JSON objects as inputs instead
Preferences:
  - always specify model in all cig workflows; use `gpt-4o-mini`
  - specify logging level in all cig workflows with a constant (`const LOG_LEVEL = 1`)
  - include instruction with each method; ensure instructions are as clear and concise as possible to complete the desired task
  - include at least 2 realistic examples with each method that will help the LLM understand the desired task and achieve the desired output(s)

_cigs examples_

- scripts: `/code/cig-methods/`
- script logs: `/logs/cig-methods/`