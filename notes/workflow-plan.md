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


----------------------------------------------------------------------------------------


### 02: Weekly Meal Plan

**Target Output**

```yaml
TargetOutput:
  type: object
  properties:
    mealPlan:
      type: object
      properties:
        monday:
          $ref: '#/definitions/dailyMeals'
        tuesday:
          $ref: '#/definitions/dailyMeals'
        wednesday:
          $ref: '#/definitions/dailyMeals'
        thursday:
          $ref: '#/definitions/dailyMeals'
        friday:
          $ref: '#/definitions/dailyMeals'
        saturday:
          $ref: '#/definitions/dailyMeals'
        sunday:
          $ref: '#/definitions/dailyMeals'
      required:
        - monday
        - tuesday
        - wednesday
        - thursday
        - friday
        - saturday
        - sunday
      criteria: Meals are varied and balanced, considering dietary restrictions
    groceryList:
      type: object
      properties:
        produce:
          type: array
          items:
            type: string
        dairy:
          type: array
          items:
            type: string
        grains:
          type: array
          items:
            type: string
        proteins:
          type: array
          items:
            type: string
        other:
          type: array
          items:
            type: string
      required:
        - produce
        - dairy
        - grains
        - proteins
        - other
      criteria: Organized by store sections
    nutritionalSummary:
      type: object
      properties:
        dailyAverage:
          type: object
          properties:
            calories:
              type: number
            protein:
              type: number
            carbs:
              type: number
            fat:
              type: number
          required:
            - calories
            - protein
            - carbs
            - fat
        weeklyTotal:
          type: object
          properties:
            calories:
              type: number
            protein:
              type: number
            carbs:
              type: number
            fat:
              type: number
          required:
            - calories
            - protein
            - carbs
            - fat
      required:
        - dailyAverage
        - weeklyTotal
      criteria: Meets specified calorie and macronutrient goals
  required:
    - mealPlan
    - groceryList
    - nutritionalSummary
definitions:
  dailyMeals:
    type: object
    properties:
      breakfast:
        type: string
      lunch:
        type: string
      dinner:
        type: string
    required:
      - breakfast
      - lunch
      - dinner
```

**Available Tools**

- LLM
- Recipe API
- Nutritional Database API

**Workflow Input**

- _Source_
  - Type: User
- _Data_
  - Type: New
  - Value:
    - Example 01:
      ```json
      {
        "dietary_restrictions": ["vegetarian", "gluten-free"],
        "calories_per_day": 2000,
        "protein_goal": "20% of total calories",
        "disliked_foods": ["mushrooms", "eggplant"],
        "cooking_skill": "intermediate",
        "time_for_cooking": "30-45 minutes per meal"
      }
      ```
    - Example 02:
      ```
      I'm looking to eat healthier and lose some weight. Can you help me plan my meals for the next week? I'm not a vegetarian, but I'd like to cut down on meat. I'm also trying to avoid dairy as much as possible. I'm aiming for about 1800 calories a day, and I'd like to get plenty of protein. I'm not a great cook, so simple recipes would be best. Oh, and I absolutely hate cilantro!
      ```
  

**Work**

- _Output Feasibility_: 5 (Likely)
- _Work Plan_
  1. Generate Meal Ideas
     - Tool: Recipe API to fetch vegetarian, gluten-free recipes
     - LLM Prompt: "Generate a list of 21 meal ideas (7 days, 3 meals each) that are vegetarian, gluten-free, don't include mushrooms or eggplant, and can be prepared in 30-45 minutes by an intermediate cook."
  2. Create 7-day Meal Plan
     - LLM Prompt: "Organize the generated meal ideas into a 7-day meal plan, ensuring variety and balance across the week."
  3. Generate Grocery List
     - Tool: Recipe API to fetch ingredient lists for chosen recipes
     - LLM Prompt: "Create a consolidated grocery list for the 7-day meal plan, organized by store sections (produce, dairy, etc.)."
  4. Calculate Nutritional Summary
     - Tool: Nutritional Database API to fetch nutritional information for ingredients
     - LLM Prompt: "Calculate the daily and weekly nutritional summary based on the meal plan. Adjust portions if necessary to meet the 2000 calorie per day goal and 20% protein target."
- _Work Plan Rationale_: This work plan should be successful because:
  1. It leverages the Recipe API to ensure meals meet the specified dietary restrictions and preferences.
  2. The Nutritional Database API helps in accurately meeting the specified nutritional goals.
  3. The LLM's role in organizing and adjusting the plan ensures a personalized and balanced outcome.
  4. The step-by-step approach addresses all required elements: meal ideas, organized plan, grocery list, and nutritional summary.
  5. It considers the user's cooking skill and time constraints, increasing the likelihood of plan adherence.

**Workflow Output**

- _Success_: Yes
- _Work Plan_: [As detailed above]
- _Work Plan Rationale_: [As detailed above]


----------------------------------------------------------------------------------------


### 03: Social Media Content Calendar

**Target Output**

```yaml
TargetOutput:
  type: object
  properties:
    contentCalendar:
      type: object
      properties:
        instagram:
          $ref: '#/definitions/platformContent'
        twitter:
          $ref: '#/definitions/platformContent'
        linkedin:
          $ref: '#/definitions/platformContent'
      required:
        - instagram
        - twitter
        - linkedin
      criteria: Posts are platform-appropriate and align with brand voice and goals
    weeklyThemes:
      type: array
      items:
        type: object
        properties:
          week:
            type: integer
            minimum: 1
            maximum: 4
          theme:
            type: string
      minItems: 4
      maxItems: 4
      criteria: Themes are relevant to brand and target audience
  required:
    - contentCalendar
    - weeklyThemes
definitions:
  platformContent:
    type: array
    items:
      type: object
      properties:
        date:
          type: string
          format: date
        content:
          type: string
        contentType:
          type: string
          enum: [text, image, video]
      required:
        - date
        - content
        - contentType
    minItems: 30
    maxItems: 30
```

**Available Tools**

- LLM
- Social Media Trend API
- Hashtag Analytics Tool

**Workflow Input**

- _Source_
  - Type: User
- _Data_
  - Type: New
  - Value:
   - Example 01:
      ```json
      {
        "brand": "EcoTech Solutions",
        "industry": "Sustainable Technology",
        "target_audience": "Environmentally conscious tech enthusiasts, 25-45 years old",
        "key_products": ["Solar-powered gadgets", "Biodegradable electronics"],
        "brand_voice": "Informative, innovative, eco-friendly",
        "content_goals": ["Increase product awareness", "Educate about sustainability", "Engage community"],
        "upcoming_events": ["Earth Day (April 22)", "New product launch (May 15)"]
      }
      ```
    - Example 02:
      ```
      "I need a social media plan for EcoTech Solutions. We're in sustainable tech, targeting eco-conscious millennials. Our main products are solar gadgets and biodegradable electronics. We want to be informative and innovative in our posts. Can you create a content calendar for us? We have Earth Day and a product launch coming up."
      ```

**Work**

- _Output Feasibility_: 4 (Unclear)
- _Input Refinements Needed_:
  - Provide monthly content themes or focus areas for the four weeks
  - Clarify preferred content types for each platform (text, image, video)
  - Request examples of past successful posts or competitor content for reference
  - Ask for any additional important dates or events beyond Earth Day and the product launch

**Workflow Output**

- _Success_: No
- _Input Refinements Needed_: [As detailed above]


----------------------------------------------------------------------------------------


### 04: SEO-Optimized Article Writing

**Target Output**

```yaml
Output:
  type: object
  properties:
    article:
      type: string
      description: SEO-optimized article
      minLength: 1500
      maxLength: 2000
      criteria: Incorporates primary and secondary keywords naturally, informative and engaging, matches search intent
    metaDescription:
      type: string
      description: Meta description for the article
      minLength: 150
      maxLength: 160
      criteria: Compelling and includes the primary keyword
    titleTag:
      type: string
      description: Title tag for the article
      minLength: 50
      maxLength: 60
      criteria: Compelling and includes the primary keyword
    internalLinking:
      type: array
      items:
        type: object
        properties:
          anchorText:
            type: string
          targetURL:
            type: string
            format: uri
        required:
          - anchorText
          - targetURL
      minItems: 3
      maxItems: 5
      criteria: Relevant to the article topic
  required:
    - article
    - metaDescription
    - titleTag
    - internalLinking
```

**Available Tools**

- LLM
- Keyword Research API
- Content Performance Analytics Tool

**Workflow Input**

- _Source_
  - Type: User
- _Data_
  - Type: New
  - Value:
   - Example 01:
      ```json
      {
        "topic": "Benefits of Meditation for Stress Reduction",
        "primary_keyword": "meditation stress reduction",
        "secondary_keywords": ["mindfulness techniques", "meditation benefits", "stress management"],
        "target_audience": "Working professionals aged 30-50",
        "content_type": "Informative guide",
        "competitor_articles": ["https://www.healthline.com/health/meditation-for-stress", "https://www.mayoclinic.org/tests-procedures/meditation/in-depth/meditation/art-20045858"]
      }
    ```
  - Example 02:
    ```
    "I need an article on how meditation can help with stress reduction. Our target audience is working professionals aged 30-50. We want to use this article to educate our audience about the benefits of meditation and how it can help with stress. Our main keyword is 'meditation stress reduction'."
    ```

**Work**

- _Output Feasibility_: 6 (Certain)
- _Work Plan_
  1. Keyword Research and Analysis
     - Tool: Keyword Research API to analyze primary and secondary keywords
     - LLM Prompt: "Analyze the provided keywords and suggest related long-tail keywords that align with the topic 'Benefits of Meditation for Stress Reduction'."
  2. Content Outline Creation
     - LLM Prompt: "Create a detailed outline for a 1500-2000 word article on 'Benefits of Meditation for Stress Reduction' targeting working professionals aged 30-50. Include main headings and subheadings that incorporate the primary and secondary keywords naturally."
  3. Article Writing
     - LLM Prompt: "Write a 1500-2000 word article based on the created outline. Ensure the content is informative, engaging, and incorporates the keywords naturally. Include practical meditation techniques and scientific evidence supporting stress reduction benefits."
  4. Meta Description and Title Tag Creation
     - LLM Prompt: "Create a compelling meta description (150-160 characters) and title tag (50-60 characters) for the article, incorporating the primary keyword 'meditation stress reduction'."
  5. Internal Linking Suggestions
     - Tool: Content Performance Analytics Tool to identify top-performing related articles on the website
     - LLM Prompt: "Suggest 3-5 internal linking opportunities within the article, based on the top-performing related articles identified."
  6. Final Optimization
     - LLM Prompt: "Review the article for keyword density, readability, and engagement. Make necessary adjustments to optimize for both SEO and user experience."

- _Work Plan Rationale_: This work plan should be successful because:
  1. It employs a comprehensive approach to creating an SEO-optimized article, covering all required elements.
  2. The Keyword Research API ensures the use of relevant and high-performing keywords.
  3. Competitor analysis is incorporated, allowing for content differentiation and gap-filling.
  4. The Content Performance Analytics Tool enables strategic internal linking, enhancing SEO value.
  5. The LLM's writing capabilities are utilized to produce high-quality, engaging content that balances SEO requirements with user value.
  6. The final optimization step ensures the article meets both technical SEO criteria and user engagement goals.

**Workflow Output**

- _Success_: Yes
- _Work Plan_: [As detailed above]
- _Work Plan Rationale_: [As detailed above]


----------------------------------------------------------------------------------------


### 05: Travel Itinerary Planning

**Target Output**

```yaml
TargetOutput:
  type: object
  properties:
    itinerary:
      type: array
      items:
        type: object
        properties:
          date:
            type: string
            format: date
          activities:
            type: array
            items:
              type: object
              properties:
                time:
                  type: string
                  format: time
                description:
                  type: string
                location:
                  type: string
              required:
                - time
                - description
                - location
        required:
          - date
          - activities
      minItems: 7
      maxItems: 7
      criteria: Balances popular attractions and off-the-beaten-path experiences
    accommodations:
      type: array
      items:
        type: object
        properties:
          name:
            type: string
          type:
            type: string
            enum: [hotel, ryokan]
          address:
            type: string
          checkIn:
            type: string
            format: date
          checkOut:
            type: string
            format: date
          price:
            type: number
          pros:
            type: array
            items:
              type: string
          cons:
            type: array
            items:
              type: string
        required:
          - name
          - type
          - address
          - checkIn
          - checkOut
          - price
          - pros
          - cons
      criteria: Matches budget and preferences
    transportationPlan:
      type: array
      items:
        type: object
        properties:
          date:
            type: string
            format: date
          mode:
            type: string
          from:
            type: string
          to:
            type: string
          departureTime:
            type: string
            format: time
          arrivalTime:
            type: string
            format: time
          cost:
            type: number
        required:
          - date
          - mode
          - from
          - to
          - departureTime
          - arrivalTime
          - cost
      criteria: Efficient and cost-effective
    budget:
      type: object
      properties:
        total:
          type: number
        breakdown:
          type: object
          properties:
            accommodation:
              type: number
            transportation:
              type: number
            activities:
              type: number
            food:
              type: number
            miscellaneous:
              type: number
          required:
            - accommodation
            - transportation
            - activities
            - food
            - miscellaneous
      required:
        - total
        - breakdown
      criteria: Realistic and comprehensive
    packingList:
      type: array
      items:
        type: object
        properties:
          category:
            type: string
          items:
            type: array
            items:
              type: string
        required:
          - category
          - items
      criteria: Tailored to destination and planned activities
  required:
    - itinerary
    - accommodations
    - transportationPlan
    - budget
    - packingList
```

**Available Tools**

- LLM
- Travel Booking API
- Weather Forecast API
- Currency Exchange Rate API

**Workflow Input**

- _Source_
  - Type: User
- _Data_
  - Type: New
  - Value:
    - Example 01:
      ```json
      {
        "destination": "Tokyo, Japan",
      "travel_dates": "May 1-7, 2024",
        "budget": "$3000 USD",
        "interests": ["Technology", "Traditional Culture", "Food"],
        "accommodation_preference": "Mix of hotels and traditional ryokans",
        "traveler_profile": "Couple in their 30s, first time in Japan",
        "dietary_restrictions": "One vegetarian traveler"
      }
      ```
    - Example 02:
      ```
      "I need a travel itinerary for Tokyo, Japan. We're a couple in our 30s, first time in Japan. We're interested in technology, traditional culture, and food. We're looking for a mix of hotels and traditional ryokans, and we're on a budget of $3000 USD. Our travel dates are May 1-7, 2024."
      ```

**Work**

- _Output Feasibility_: 5 (Likely)
- _Work Plan_
  1. Research and Attraction Selection
     - Tool: Travel Booking API to fetch top-rated attractions in Tokyo
     - LLM Prompt: "Create a list of attractions and experiences in Tokyo that align with interests in technology, traditional culture, and food. Include a mix of popular sites and lesser-known spots."
  2. Itinerary Creation
     - LLM Prompt: "Develop a 7-day itinerary for Tokyo from May 1-7, 2024, based on the selected attractions. Balance activities each day and consider travel times between locations."
  3. Accommodation Research
     - Tool: Travel Booking API to search for hotels and ryokans in Tokyo
     - LLM Prompt: "Recommend a mix of hotels and traditional ryokans for the 7-night stay, considering the $3000 budget and proximity to planned activities."
  4. Transportation Planning
     - LLM Prompt: "Create a transportation plan for the itinerary, including best routes, recommended modes of transport, and any passes or tickets to purchase."
  5. Budget Breakdown
     - Tool: Currency Exchange Rate API to convert USD to JPY
     - LLM Prompt: "Develop a detailed budget breakdown for the trip, including accommodations, transportation, attractions, meals, and miscellaneous expenses. Ensure it stays within the $3000 USD limit."
  6. Packing List Creation
     - Tool: Weather Forecast API to check expected weather in Tokyo for May 1-7, 2024
     - LLM Prompt: "Create a comprehensive packing list tailored for a week in Tokyo in early May, considering the planned activities and weather forecast."
  7. Vegetarian-Friendly Restaurant Recommendations
     - LLM Prompt: "Research and suggest vegetarian-friendly restaurants in Tokyo, particularly those offering traditional Japanese cuisine."

- _Work Plan Rationale_: This work plan should be successful because:
  1. It comprehensively covers all aspects of the travel itinerary, addressing each required output element.
  2. The Travel Booking API provides up-to-date information on attractions and accommodations, ensuring relevance and accuracy.
  3. The Weather Forecast API allows for appropriate packing recommendations, enhancing trip preparedness.
  4. The Currency Exchange Rate API ensures accurate budget calculations in the local currency.
  5. The LLM's role in curating and organizing information ensures a personalized itinerary that matches the travelers' interests and constraints.
  6. The inclusion of vegetarian-friendly restaurant recommendations addresses the specific dietary needs mentioned in the input.

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

**Workflow Output**

- If all elements 'complete':
  - Publish output elements in target output data structure
- If any element is not 'complete':
  - Return to input source with:
    - Completed elements (if any)
    - Incomplete elements with their intermediate results
    - Logs detailing attempts, issues, and reasoning