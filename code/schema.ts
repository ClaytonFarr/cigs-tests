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

const generate = cig("album-generator", albumInputSchema, (config) => {
  config.setModel("gpt-4o-mini"); // points to gpt-4o-mini-2024-07-18
  config.setLogLevel(1);
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
    const call01Json = await generate.run({ genre: "rock" });
    // console.log('Call 01 as Json: ', call01Json);
    const call01String = await generate.run("I want a list of rock albums");
    // console.log('Call 01 as String: ', call01String);
    
    // const call02Json = await generate.run({ genre: "country" });
    // console.log('Call 02 as Json: ', call02Json);
    // const call02String = await generate.run("I want a list of country albums");
    // console.log('Call 02 as String: ', call02String);
  } catch (error) {
    console.error("Error:", error);
  }

  /*
  * .schema() observations

  * If using JSON object as input:

    Operations -
    …

  * If using string as input:
    
    Operations -
    …

    
  * Notes

    - Can use method to generate 1 item in output
    - Both approaches do NOT seem to use example(s) in system/user message for generation
    - …

    */
  
})();
