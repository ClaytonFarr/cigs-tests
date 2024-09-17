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

// .schema() = transform the input to a specified output using a Zod schema

const schemaCig = cig("album-generator", albumInputSchema, (config) => {
  config.setLogLevel(1);
  config.setModel("gpt-4o-mini"); // points to gpt-4o-mini-2024-07-18
  // config.setDescription("Create albums from France."); // does not appear to be affecting outputs
  })
  .schema(albumSchema, (config) => {
    config.addInstruction(
      "Generate a list of fake albums that sound like they would be for a given genre",
    );
    config.addExample(
      "{ genre: 'rock' }",
      { title: "Exile on Main St.", artist: "The Rolling Stones", year: 1972, numTracks: 12 },
    );
  });

(async () => {
  try {
    // const call01Json = await schemaCig.run({ genre: "rock" });
    // console.log('Call 01 as Json: ', call01Json);

    const call01String = await schemaCig.run("I want a list of rock albums");
    // console.log('Call 01 as String: ', call01String);
    
    // const call02Json = await schemaCig.run({ genre: "country" });
    // console.log('Call 02 as Json: ', call02Json);

    // const call02String = await schemaCig.run("I want a list of country albums");
    // console.log('Call 02 as String: ', call02String);
  } catch (error) {
    console.error("Error:", error);
  }  
})();

/*
* .schema() observations

* If using JSON object as input:

  Operations -
  1. context: 'Running cig' | input: { genre: "rock" }
  2. context: 'Operation 1 Input' | data: { genre: "rock" }
  3. context: 'init' | operation: 'schema' | input: { genre: "rock" } | instruction: '…' | examples: '[…]'
  4. context: 'extracted prompt' | operation: 'schema' | prompt: concatenated messages for…
     - SYSTEM (prompt)
     - USER (input, instructions)
  5. context: 'Operation 1 Output' | data: (single object of generated content)

* If using string as input:
  
  Operations -
  1. context: 'Running cig' | input: 'I want a list of rock albums'
  2. context: 'Received string input'
  3. context: 'Processed string input' | result: { genre: "rock" }
  4. context: 'Operation 1 Input' | data: { genre: "rock" }
  5. context: 'init' | operation: 'schema' | input: { genre: "rock" } | instruction: '…' | examples: '[…]'
  6. context: 'extracted prompt' | operation: 'schema' | prompt: concatenated messages for…
     - SYSTEM (prompt)
     - USER (input, instructions)
  7. context: 'Operation 1 Output' | data: (single object of generated content)

* Notes

  - Can use method to generate 1 item in output
  - Both approaches do NOT seem to use example(s) in system/user message for generation
  - Both approaches ultimately produce similar output

*/
