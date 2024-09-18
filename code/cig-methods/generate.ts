import cig, { z } from "cigs";

const albumInputSchema = z.object({
  genre: z.string(),
});

const albumSchema = z.object({
  title: z.string(),
  artist: z.string(),
  year: z.number(),
  numTracks: z.number(),
});

// .generate() = generate multiple outputs based on the schema

const generateCig = cig("album-generator", albumInputSchema, (config) => {
  config.setLogLevel(1);
  config.setModel("gpt-4o-mini"); // points to gpt-4o-mini-2024-07-18
  // config.setDescription("Create albums from France."); // does not appear to be affecting outputs
  })
  .generate(albumSchema, 3, (config) => {
    config.addInstruction(
      "Generate a list of fake albums that sound like they would be for a given genre",
    );
    config.addExample(
      "{ genre: 'rock' }",
      { title: "Exile on Main St.", artist: "The Rolling Stones", year: 1972, numTracks: 12 },
    );
  })
;

(async () => {
  try {
    const call01Json = await generateCig.run({ genre: "rock" });
    // console.log('Call 01 as Json: ', call01Json);

    // const call01String = await generateCig.run("I want a list of rock albums");
    // console.log('Call 01 as String: ', call01String);
    
    // const call02Json = await generateCig.run({ genre: "hip-hop" });
    // console.log('Call 02 as Json: ', call02Json);

    // const call02String = await generateCig.run("I want a list of hip-hop albums");
    // console.log('Call 02 as String: ', call02String);
  } catch (error) {
    console.error("Error:", error);
  }
  
})();

/*
* .generate()

* If using JSON object as input:

  Operations -
  1. context: 'Running cig' | input: { genre: "rock" }
  2. context: 'Operation 1 Input' | data: { genre: "rock" }
  3. context: 'init' | operation: 'generate' | input: { genre: "rock" } | instruction: '…' | examples: '[…]'
  4. context: 'extracted prompt' | operation: 'generate' | prompt: concatenated messages for…
     - SYSTEM (prompt)
     - USER (input, instructions)
  5. context: 'Operation 1 Output' | data: (array of generated content)

* If using string as input:
  
  Operations -
  1. context: 'Running cig' | input: 'I want a list of country albums'
  2. context: 'Received string input'
  3. context: 'Processed string input' | result: { genre: "Country" }
  4. context: 'Operation 1 Input' | data: { genre: "Country" }
  5. context: 'init' | operation: 'generate' | input: { genre: "Country" } | instruction: '…' | examples: '[…]'
  6. context: 'extracted prompt' | operation: 'generate' | prompt: concatenated messages for…
     - SYSTEM (prompt)
     - USER (input, instructions)
  7. context: 'Operation 1 Output' | data: (array of generated content)
  
  Performs additional processing, potentially including
  example lookup or natural language understanding, before generation.
  
* Notes

  - Can use method to generate 1+ items in output
  - Both approaches do NOT seem to use example(s) in system/user message for generation
  - String input can lead to inconsistent LLM steps, e.g.
    - Extra operations steps that ask LLM to 'lookup' examples before generation
    - 'Processed string input' results in instruction results (e.g. a concatenated string of album titles rather than genre label for 'genre' key)
  - Both approaches ultimately produce similar output

*/
