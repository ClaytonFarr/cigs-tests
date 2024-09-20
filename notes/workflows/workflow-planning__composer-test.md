# Generic Planning Workflow

## Workflow Input

- Source: User or Previous Step
- Data: Any data type (string, number, object, array, etc.)
- Format: Flexible (JSON, YAML, plain text, etc.)

## Workflow Output

- Format: Structured object (JSON, YAML, or TypeScript interface)
- Content: Detailed plan with steps to achieve the desired outcome

## Workflow Steps

1. Input Analysis
   - Input: Raw input data
   - Output: Structured input data and initial goal understanding
   - Reasoning: Ensure input is in a workable format and establish a clear starting point

2. Goal Clarification
   - Input: Structured input data and initial goal understanding
   - Output: Clear, well-defined goal and success criteria
   - Reasoning: Ensure the workflow has a precise target to aim for

3. Resource Identification
   - Input: Clear goal and available tools list
   - Output: List of relevant tools and resources for the task
   - Reasoning: Determine which tools and resources will be most effective for achieving the goal

4. Feasibility Assessment
   - Input: Clear goal and available resources
   - Output: Feasibility rating (1-6) and any necessary input refinements
   - Reasoning: Determine if the goal is achievable with given inputs and resources

5. Work Plan Creation
   - Input: Clear goal, available resources, and feasibility assessment
   - Output: Detailed work plan with steps, tools, and rationale
   - Reasoning: Break down the goal into manageable, logical steps

6. Plan Optimization
   - Input: Initial work plan
   - Output: Optimized work plan
   - Reasoning: Refine the plan to be as efficient and effective as possible

7. Quality Control Design
   - Input: Optimized work plan and success criteria
   - Output: Quality control checkpoints and metrics
   - Reasoning: Ensure the plan includes ways to verify progress and success

8. Risk Assessment and Mitigation
   - Input: Optimized work plan
   - Output: Potential risks and mitigation strategies
   - Reasoning: Identify potential issues and plan how to address them

9. Final Plan Compilation
   - Input: All previous outputs
   - Output: Comprehensive, structured plan document
   - Reasoning: Combine all elements into a cohesive, actionable plan

## Error Handling
- Each step includes error checking and handling
- If a step fails, the workflow attempts to refine inputs or adjust the approach
- If critical errors occur, the workflow provides detailed feedback and suggestions for resolution

## User Interaction
- The workflow may prompt for additional information or clarification at any step
- User feedback is incorporated to refine and improve the plan

## Example

Input: "Create a marketing plan for a new eco-friendly water bottle"

Output:
```json
{
  "goal": "Create a comprehensive marketing plan for launching a new eco-friendly water bottle",
  "targetAudience": "Environmentally conscious consumers, aged 25-40",
  "keyMessages": [
    "Sustainable materials",
    "Reduces plastic waste",
    "Stylish design"
  ],
  "marketingChannels": [
    "Social media (Instagram, Facebook, Twitter)",
    "Environmental blogs and websites",
    "Outdoor and fitness events"
  ],
  "timeline": {
    "preLaunch": "2 months",
    "launch": "1 month",
    "postLaunch": "3 months"
  },
  "budgetAllocation": {
    "socialMediaAds": "40%",
    "influencerPartnerships": "30%",
    "contentCreation": "20%",
    "eventSponsorship": "10%"
  },
  "successMetrics": [
    "Reach 1 million social media impressions",
    "Achieve 10,000 unit sales in first 3 months",
    "Gain 5 major retail partnerships"
  ],
  "risks": [
    {
      "risk": "Strong competition from established brands",
      "mitigation": "Focus on unique eco-friendly features and storytelling"
    },
    {
      "risk": "Supply chain disruptions",
      "mitigation": "Identify multiple suppliers and maintain safety stock"
    }
  ]
}
```