import cig, { z } from "cigs";

const sentimentInputSchema = z.object({
  text: z.string(),
});

// .classify() = classify the input into predefined categories

const classifyCig = cig("sentiment-analyzer", sentimentInputSchema, (config) => {
  config.setLogLevel(1);
  config.setModel("gpt-4o-mini"); // points to gpt-4o-mini-2024-07-18
  })
  .classify(["cool", "lame", "neutral"], (config) => {
    config.addInstruction("Classify the sentiment of the input text");
    config.addExample("I love you!", "cool");
    config.addExample("I hate you!", "lame");
  });

(async () => {
  try {
    const call01Json = await classifyCig.run({ text: "I think you're swell." });
    // console.log('Call 01 as Json: ', call01Json);

    // const call01String = await classifyCig.run("I think you're swell.");
    // console.log('Call 01 as String: ', call01String);
    
    // const call02Json = await classifyCig.run({ text: "I don't think we'll get along." });
    // console.log('Call 02 as Json: ', call02Json);

    // const call02String = await classifyCig.run("I don't think we'll get along.");
    // console.log('Call 02 as String: ', call02String);

  } catch (error) {
    console.error("Error:", error);
  }
})();

/*
* .classify()

* If using JSON object as input:

  Operations -
  1. context: 'Running cig' | input: { text: "I think you're swell." }
  2. context: 'Operation 1 Input' | data: { text: "I think you're swell." }
  3. context: 'init' | operation: 'classify' | input: { text: "I think you're swell." } | instruction: '…' | examples: '[…]'
  4. context: 'extracted prompt' | operation: 'classify' | prompt: concatenated messages for…
     - SYSTEM (prompt)
     - USER (input, instructions, any examples)
     - ASSISTANT (generated message prefix? E.g. 'The best label for the data is Label\n')
  5. context: 'Operation 1 Output' | data: 'cool'

* If using string as input:
  
  Operations -
  1. context: 'Running cig' | input: 'I think you're swell.'
  2. context: 'Received string input'
  3. context: 'Processed string input' | result: { text: "Thank you so much for your kind words! It's always wonderful to receive such positive feedback. If there's anything else you'd like to share or discuss, feel free to let me know!" } // consistently errors with showing result instead of parsing string into JSON
  4. context: 'Operation 1 Input' | data: { text: "… same value as above …" }
  5. context: 'init' | operation: 'generate' | input: { text: "… same value as above …" } | instruction: '…' | examples: '[…]'
  6. context: 'extracted prompt' | operation: 'classify' | prompt: concatenated messages for…
     - SYSTEM (prompt)
     - USER (input, instructions, any examples)
     - ASSISTANT (generated message prefix? E.g. 'The best label for the data is Label\n')
  7. context: 'Operation 1 Output' | data: 'cool'
  
* Notes

  - String input can lead to inconsistent LLM steps, e.g.
  - 'Processed string input' results in instruction results (e.g. "That's a lovely compliment! Thank you. If there's anything you'd like to know or discuss, feel free to let me know."

*/
