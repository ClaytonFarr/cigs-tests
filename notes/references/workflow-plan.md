# PLANNING Workflow

- An LLM workflow that takes in input, determines a plan to create the desired output(s) (for subsequent LLM calls using tools like API calls, etc. as needed), and requests updated input if necessary.

## Structure

- **Target Output**

  - Overall output object structure
  - Individual elements within the structure
  - For each element or sub-structure:
    - Data type (e.g., string, number, object, array)
    - Description
    - Constraints (e.g., min/max length, allowed values)
    - Success criteria
  - Required elements or properties
  - May include nested structures and references to reusable definitions
  - May be defined using YAML, JSON Schema, TypeScript interface or similar standards

- **Available Tools**

  - LLM
  - 0+ Additional Tools
    - e.g. functions, APIs, database lookups, file access, etc.

- **Workflow Input**

  - _Source_
    - Type:
      - User
      - Previous Step
    - ID:
      - ID of previous step (if applicable)
  - _Data_
    - Type:
      - New
      - Prior Output Refinement
    - Value:
      - New data
      - Prior output with refinement feedback
      - Can be any data type (string, number, object, etc.)

- **Work**:

  - _Output Feasibility_
    - Rate feasibility of creating output from input
      - 1: Impossible
      - 2: Highly unlikely
      - 3: Somewhat unlikely
      - 4: Unclear
      - 5: Likely
      - 6: Certain
  - If rated as "4: Unclear" or lower
    - Determine input refinements needed to rate feasibility as "6: Certain"
    - _Input Refinements Needed_
      - Input updates (changes, clarifications) needed to make output feasible
        - i.e. the gap(s) between what has been provided via input and desired output(s)
  - If rated as "5: Likely" or higher
    - Create Work Plan for each necessary output element
      - Incorporate any refinement feedback from previous attempts, if applicable
    - _Work Plan_
      - for each element:
        - Work Step(s)
          - LLM Prompt(s)
          - Tool(s) (if applicable)
    - _Work Plan Rationale_
      - Why this work plan should be successful

  - _Work Execution_
    - Execute work plan for each output element
    - Log work performed and any issues encountered
  - _Quality Check_
    - Rate each output element against its success criteria
    - Log reasoning for rating
  - _Iteration_
    - If output element rating meets quality threshold:
      - Mark output element as 'complete'
    - If output element rating below threshold & attempts remain:
      - Return to Work Plan with improvement feedback
    - If output element rating below threshold & max attempts reached:
      - Prepare logs and intermediate results

- **Quality Controls**
  - Output quality threshold (e.g., rating output against success criteria on a scale of 1-5)
  - Maximum attempts to produce output

- **Workflow Output**

  - If all elements 'complete':
    - Publish output elements in target output data structure
  - If any element is not 'complete':
    - Return to input source with:
      - Completed elements (if any)
      - Incomplete elements with their intermediate results
      - Logs detailing attempts, issues, and reasoning


========================================================================================


## Examples

### 01: Book Review Blog Post

**Target Output**

```yaml
TargetOutput:
  type: object
  properties:
    title:
      type: string
      description: Title of the book review
    author:
      type: string
      description: Author of the book being reviewed
    bookSummary:
      type: string
      description: 150-200 word summary of the book
      minLength: 150
      maxLength: 200
      criteria: Captures key plot points without spoilers
    criticalAnalysis:
      type: string
      description: 300-400 word analysis of themes, writing style, and cultural impact
      minLength: 300
      maxLength: 400
      criteria: Discusses themes, writing style, and cultural impact
    authorBackground:
      type: string
      description: 100 word background on the author
      maxLength: 100
      criteria: Relevant to the book
    rating:
      type: number
      description: Rating from 1 to 5 stars
      minimum: 1
      maximum: 5
      criteria: Justified in the analysis
    recommendation:
      type: string
      description: 50-100 word recommendation
      minLength: 50
      maxLength: 100
      criteria: Clearly states target audience
  required:
    - title
    - author
    - bookSummary
    - criticalAnalysis
    - authorBackground
    - rating
    - recommendation
```

**Available Tools**

- LLM
- Goodreads API (for book metadata and author information)
- Literary Criticism Database API

**Workflow Input**

- _Source_
  - Type: User
- _Data_
  - Type: New
  - Value: 
    - Example 01:
      ```json
      {
        "book_title": "The Midnight Library",
        "author": "Matt Haig",
        "genre": "Fiction, Fantasy",
        "publication_year": 2020,
        "user_notes": "Explores themes of regret and choice. Interested in how it compares to other works dealing with parallel lives."
      }
      ```
    - Example 02:
      ```
      "Can you review 'The Midnight Library' by Matt Haig?"
      ```

**Work**

- _Output Feasibility_: 6 (Certain)
- _Work Plan_
  1. Book Summary
     - LLM Prompt: "Summarize 'The Midnight Library' by Matt Haig in 150-200 words, focusing on the main plot points without revealing major spoilers."
  2. Critical Analysis
     - Tool: Literary Criticism Database API to fetch scholarly articles on "The Midnight Library"
     - LLM Prompt: "Analyze 'The Midnight Library' in 300-400 words, discussing its themes of regret and choice, writing style, and cultural impact. Compare it to other works dealing with parallel lives. Incorporate insights from the scholarly articles provided."
  3. Author Background
     - Tool: Goodreads API to fetch Matt Haig's biography
     - LLM Prompt: "Summarize Matt Haig's background in 100 words, focusing on aspects relevant to 'The Midnight Library' and his writing career."
  4. Rating
     - LLM Prompt: "Based on the analysis, assign a rating from 1-5 stars to 'The Midnight Library'. Justify this rating in 2-3 sentences."
  5. Recommendation
     - LLM Prompt: "In 50-100 words, recommend 'The Midnight Library' to a specific audience. Consider the themes, style, and content of the book."
- _Work Plan Rationale_: This work plan should be successful because:
  1. It utilizes a combination of LLM capabilities and external data sources for comprehensive coverage.
  2. The Goodreads API ensures accurate author information, enhancing the credibility of the author background section.
  3. The Literary Criticism Database provides scholarly context, allowing for a more informed and nuanced analysis.
  4. The step-by-step approach ensures all required elements of the book review are addressed systematically.
  5. The specific word count guidelines for each section help maintain the desired blog post structure and length.

**Workflow Output**

- _Success_: Yes
- _Work Plan_: [As detailed above]
- _Work Plan Rationale_: [As detailed above]
