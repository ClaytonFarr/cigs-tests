# Plan-Do-Check-Act (PDCA) Workflow

## Overview

An LLM workflow that:

- receives
  - input source (user or workflow ID)
  - input data (any data type)
  - target output
    - data structure
      - may include 1+ element(s) and nested element(s)
    - element(s)
      - data type (e.g. string, number, object, array, etc.)
      - constraints (e.g. min/max length, allowed values, etc.)
      - description?
      - success criteria?
      - required?
  - max attempts
    - max input refinements (to receive feasible input from source)
    - max output attempts (to produce any output element)

- for each output element:
  - validate feasibility of creating the element from input
  - if any elements are not feasible, request input refinements from source
  - repeat until all elements are feasible

- analyze and prioritize elements:
  - identify dependencies between elements
  - categorize elements as independent or dependent
  - create an optimized processing plan:
    - group independent elements for parallel processing
    - order dependent elements for sequential processing

- process each element:
  - process independent element groups in parallel
  - process dependent elements sequentially
  - PLAN:  create work plan to produce element (llm prompts and tools)
  - DO:    execute work plan to generate element
  - CHECK: review generated element against success criteria
  - ACT:   take action based on the check results

- once all output elements are complete, or max attempts are reached:
  - if all elements are complete:
    - publish output elements in target output data structure
  - if any elements are not complete:
    - return to input source with:
      - completed elements (if any)
      - incomplete elements with their intermediate results
      - logs detailing attempts, issues, and reasoning

## Details

- **Available Tools**

  - predefined and made known to workflow
    - LLM
    - 0+ additional tools
      - functions, APIs, database lookups, file access, etc.

- **Workflow Input**

  - _Input Source_
    - Type:
      - User
      - Workflow Output
    - ID:
      - ID of workflow (if applicable)
  - _Input Data_
    - Input data
  - _Target Output_
    - Data structure
      - May include 1+ element(s) and nested element(s)
    - Element(s)
      - Data type (e.g., string, number, object, array, etc.)
      - Constraints (e.g., min/max length, allowed values)
      - Description
      - Success criteria
      - Required?
  - _Max Attempts_
    - Maximum input refinements (to receive feasible input from source)
    - Maximum output attempts (to produce any output element)

- **Work**:

  - _Validate Input_

    - For each element in the target output:
      - Rate feasibility of creating the output element from provided input(s) (yes/no)
      - If element rated as not feasible:
        - Identify specific input refinements needed to make element feasible
        - Request refinements from Input Source
        - Re-rate feasibility after receiving refinements
      - Repeat until all elements are rated as feasible, or maximum input refinements is reached
    - If maximum input refinements is reached before all elements are rated as feasible:
      - Log the reason for inability to achieve feasible input
      - Return to input source with detailed feedback
    - If all elements are rated as feasible:
      - Proceed to next step

  - _Organize Elements_

    - For each target output element, identify:
      - Whether it's required or optional
      - Its priority level (high, medium, low)
      - Any other elements it depends on to be completed first
    - Check for circular dependencies:
      - If circular dependencies are found:
        - Log the circular dependency
        - Identify the elements involved
        - Request input from the source to resolve the circular dependency
    - Create a dependency graph of elements (as simple as possible while being effective)
    - Identify independent elements (no dependencies) and dependent elements
    - Create an ordered list of elements based on:
      1. Dependencies (elements with fewer dependencies come first)
      2. Required status (required elements before optional ones)
      3. Priority level
    - This analysis will guide the parallel and sequential processing of elements

  - _Process Elements_

    - For independent elements:
      - Assign each element for parallel processing
    - For dependent elements:
      - Process sequentially based on the ordered list
      - As dependencies are fulfilled, release dependent elements for processing
    - For each element (whether processed in parallel or sequentially):
      - Execute the PDCA cycle (Plan, Do, Check, Act)

 - For each element being processed:

    - _Plan_ : Create work plan that can produce element

      - If first attempt, initialize attempt counter for element
      - Create work plan and steps to successfully create output element
        - Incorporate feedback from previous attempts, if applicable
        - Consider dependencies:
          - If element depends on others, ensure they are completed first
          - If other elements depend on this one, plan for potential updates
        - Work plan:
          - Work step(s)
            - LLM prompt(s)
            - Tool(s) (if applicable)
        - Log rationale why this work plan should be successful
      - Once work plan is complete:
        - proceed to _Do_ with work plan and logs

    - _Do_ : Execute work plan to generate element

      - Execute work plan for output element
        - Log work performed
        - Log any issues encountered
      - If unable to successfully complete work steps:
        - return to _Plan_ with intermediate results and logs
      - Upon successful completion of all work steps:
        - proceed to _Check_ with generated output and logs

    - _Check_ : Analyze and evaluate generated element

      - Evaluate the element against two sets of criteria:
        1. Structural Requirements:
           - Verify that the output matches the expected data type
           - Confirm that all constraints (e.g., min/max length, allowed values) are met
        2. Success Criteria:
           - Assess whether the output fulfills all user-provided success criteria
      - Determine if the element passes both sets of criteria:
        - If both Structural Requirements and Success Criteria are met: Mark as "Successful"
        - If either set of criteria is not fully met: Mark as "Needs Improvement"
      - For elements marked as "Needs Improvement", provide specific feedback detailing:
        - Which structural requirements were not met (if any)
        - Which success criteria were not fulfilled (if any)
        - Suggestions for improvement

    - _Act_ : Decide and implement next action based on analysis

      - If element is marked as "Successful":
        - Proceed to the next element in the ordered list
      - If element is marked as "Needs Improvement":
        - If attempts remain:
          - Analyze feedback from _Check_ step
          - Identify specific improvements needed
          - Return to _Plan_ step with:
            - Improvement feedback from _Check_
            - Logs from previous attempts
            - Current intermediate results
          - Increment attempt counter for element
        - If max attempts reached:
          - Mark element as "Unsuccessful"
          - Log final state and reasons for unsuccessful outcome
      - After processing element (regardless of outcome):
        - Identify any subsequent elements that depend on the just-processed element
        - Flag these dependent elements for potential re-evaluation or updates

- **Workflow Output**

  - If max attempts are reached before all elements are 'successful':
    - Return to input source with:
      - Successful elements (if any)
      - Unsuccessful elements (with their intermediate results)
      - Logs detailing attempts, issues, etc.

  - If all elements are 'successful':
    - Publish output elements in target output data structure


========================================================================

## Examples

## Likely feasible input

**Product Description Generator**

```json
{
  "inputSource": {
    "type": "User",
    "id": null
  },
  "inputData": {
    "productName": "EcoFresh Water Bottle",
    "keyFeatures": ["BPA-free", "Insulated", "24oz capacity", "Leak-proof lid"],
    "targetMarket": "Environmentally conscious outdoor enthusiasts"
  },
  "targetOutput": {
    "dataStructure": {
      "shortDescription": {
        "type": "string",
        "constraints": {
          "minLength": 50,
          "maxLength": 100
        },
        "required": true
      },
      "longDescription": {
        "type": "string",
        "constraints": {
          "minLength": 200,
          "maxLength": 300
        },
        "required": true
      },
      "keySellingPoints": {
        "type": "array",
        "items": {
          "type": "string"
        },
        "constraints": {
          "minItems": 3,
          "maxItems": 5
        },
        "required": true
      }
    }
  },
  "maxAttempts": {
    "maxInputRefinements": 2,
    "maxOutputAttempts": 3
  }
}
```

**Personalized Fitness Plan Generator**

```json

{
  "inputSource": {
    "type": "WorkflowOutput",
    "id": "user-profile-analysis-workflow"
  },
  "inputData": {
    "userProfile": {
      "age": 35,
      "gender": "Female",
      "height": 165,
      "weight": 70,
      "fitnessLevel": "Intermediate",
      "goals": ["Weight loss", "Muscle toning"],
      "preferredActivities": ["Running", "Yoga", "Strength training"],
      "availableEquipment": ["Dumbbells", "Resistance bands", "Yoga mat"],
      "timeAvailability": 5,
      "medicalConditions": null
    }
  },
  "targetOutput": {
    "dataStructure": {
      "weeklySchedule": {
        "type": "object",
        "description": "Object with day keys and workout value objects",
        "properties": {
          "workoutType": { "type": "string" },
          "duration": { "type": "number" },
          "exercises": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "name": { "type": "string" },
                "sets": { "type": "number" },
                "repsOrDuration": { "type": "string" }
              }
            }
          }
        },
        "required": true
      },
      "nutritionGuidelines": {
        "type": "object",
        "properties": {
          "dailyCalorieTarget": { "type": "number" },
          "macronutrientBreakdown": {
            "type": "object",
            "properties": {
              "protein": { "type": "number" },
              "carbs": { "type": "number" },
              "fat": { "type": "number" }
            }
          },
          "mealSuggestions": {
            "type": "array",
            "items": { "type": "string" },
            "minItems": 5,
            "maxItems": 7
          }
        },
        "required": true
      },
      "progressTrackingMetrics": {
        "type": "array",
        "items": {
          "type": "object",
          "properties": {
            "metricName": { "type": "string" },
            "measurementFrequency": { "type": "string" },
            "targetValue": { "type": ["number", "string"] }
          }
        },
        "minItems": 3,
        "maxItems": 5,
        "required": true
      },
      "motivationalQuote": {
        "type": "string",
        "constraints": {
          "minLength": 50,
          "maxLength": 100
        },
        "required": false
      }
    }
  },
  "maxAttempts": {
    "maxInputRefinements": 3,
    "maxOutputAttempts": 5
  }
}
```

## Likely infeasible input

**Restaurant Menu Translator**

```json
{
  "inputSource": {
    "type": "User",
    "id": null
  },
  "inputData": {
    "restaurantName": "La Bella Italia",
    "cuisineType": "Italian",
    "menuItems": ["Spaghetti Carbonara", "Pizza Margherita", "Tiramisu"]
  },
  "targetOutput": {
    "dataStructure": {
      "translatedMenu": {
        "type": "object",
        "description": "Key-value pairs where keys are original menu items and values are translations",
        "required": true
      },
      "pronunciationGuide": {
        "type": "array",
        "items": {
          "type": "string"
        },
        "description": "One pronunciation guide for each translated item",
        "required": true
      },
      "culturalNotes": {
        "type": "string",
        "constraints": {
          "minLength": 100,
          "maxLength": 150
        },
        "required": false
      }
    }
  },
  "maxAttempts": {
    "maxInputRefinements": 2,
    "maxOutputAttempts": 3
  }
}
```

**AI-Powered Financial Report Generator**

```json
{
  "inputSource": {
    "type": "User",
    "id": null
  },
  "inputData": {
    "companyName": "TechInnovate Inc.",
    "industry": "Software as a Service (SaaS)",
    "fiscalYear": 2023,
    "revenue": 10000000,
    "expenses": 7500000,
    "employeeCount": 50
  },
  "targetOutput": {
    "dataStructure": {
      "executiveSummary": {
        "type": "string",
        "constraints": {
          "minLength": 300,
          "maxLength": 500
        },
        "required": true
      },
      "financialStatements": {
        "type": "object",
        "properties": {
          "incomeStatement": {
            "type": "object",
            "properties": {
              "revenue": { "type": "number" },
              "expenses": { "type": "number" },
              "profitOrLoss": { "type": "number" }
            }
          },
          "balanceSheet": {
            "type": "object",
            "properties": {
              "assets": { "type": "number" },
              "liabilities": { "type": "number" },
              "equity": { "type": "number" }
            }
          },
          "cashFlowStatement": {
            "type": "object",
            "properties": {
              "operatingCashFlow": { "type": "number" },
              "investingCashFlow": { "type": "number" },
              "financingCashFlow": { "type": "number" }
            }
          }
        },
        "required": true
      },
      "keyPerformanceIndicators": {
        "type": "array",
        "items": {
          "type": "object",
          "properties": {
            "kpiName": { "type": "string" },
            "value": { "type": "number" },
            "yearOverYearChange": { "type": "number" }
          }
        },
        "minItems": 5,
        "maxItems": 7,
        "required": true
      },
      "industryComparison": {
        "type": "object",
        "properties": {
          "averageRevenue": { "type": "number" },
          "averageProfitMargin": { "type": "number" },
          "marketPosition": { "type": "string" }
        },
        "required": true
      },
      "futureProjections": {
        "type": "object",
        "properties": {
          "nextYearRevenueForecast": { "type": "number" },
          "growthOpportunities": {
            "type": "array",
            "items": { "type": "string" },
            "minItems": 3,
            "maxItems": 5
          },
          "potentialRisks": {
            "type": "array",
            "items": { "type": "string" },
            "minItems": 3,
            "maxItems": 5
          }
        },
        "required": true
      }
    }
  },
  "maxAttempts": {
    "maxInputRefinements": 3,
    "maxOutputAttempts": 5
  }
}
```
