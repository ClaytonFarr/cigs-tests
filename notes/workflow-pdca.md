# Plan-Do-Check-Act (PDCA) Workflow

_Receive data (from user or other workflow output)_

- input source (user, workflow id)
- input data
  - type (new, refinement)
  - value (data)
- target output
  - output data structure
  - output element/s
  - output element success criteria
- quality controls (applicable across all output elements)
  - output quality threshold (e.g. rating output against success criteria on a scale of 1-5)
  - maximum attempts to produce output

For each target output element:

  **Plan**

  - Determine feasibility of creating output element from provided input data
    - If not feasible, request input refinements/additions from source
  - If feasible, create work plan for output element
    - Utilize available tools (functions, APIs, etc.) as needed
    - Incorporate refinement feedback from previous attempt, if applicable
    - Log reasoning for work plan
  - Once work plan complete, proceed to _Do_

  **Do**

  - Execute work plan for output element
  - Log work performed and any issues encountered
  - If unable to successfully complete work steps, return to _Plan_ with logs and intermediate results
  - Upon successful completion of all work steps, proceed to _Check_

  **Check**

  - Rate output element against its success criteria
  - Log reasoning for rating
  - If rated below prescribed quality threshold, generate improvement feedback

  **Act**

  - If output element rating meets quality threshold:
    - mark output element as 'complete'
  - If output element rating below threshold & attempts remain:
    - return to _Plan_ with _Check_ improvement feedback
  - If output element rating below threshold & max attempts reached:
    - prepare logs and intermediate results

Once all output elements marked 'complete' / or all output element attempts exhausted:

  - If all elements 'complete':
    - publish output elements in target output data structure
  - If any element is not 'complete':
    - Return to input source with:
      - Completed elements (if any)
      - Incomplete elements with their intermediate results
      - Logs detailing attempts, issues, and reasoning