import cig, { z } from "cigs";

const userInfoSchema = z.object({
  username: z.string(),
});

function getUserColor(username: string) {
  const colorMap = {
    "Alice": "blue",
    "Bob": "green",
    "Charlie": "red",
  };
  return {
    color: colorMap[username as keyof typeof colorMap] || "unknown",
  };
}

// .handler() = apply a custom handler function

const handlerCig = cig("get-user-color", userInfoSchema, (config) => {
  config.setModel("gpt-4o-mini"); // points to gpt-4o-mini-2024-07-18
  config.setLogLevel(1);
  })
  .handler(async (input) => {
    // console.log('Handler input: ', input);
    return getUserColor(input.username);
  });

(async () => {
  try {
    // const call01Json = await handlerCig.run({ username: "Alice" });
    // console.log('Call 01 as Json: ', call01Json);

    // const call01String = await handlerCig.run("Alice");
    // console.log('Call 01 as String: ', call01String);
    
    // const call02Json = await handlerCig.run({ username: "Bob" });
    // console.log('Call 02 as Json: ', call02Json);

    const call02String = await handlerCig.run("What's Bob's favorite color?");
    // console.log('Call 02 as String: ', call02String);

  } catch (error) {
    console.error("Error:", error);
  }
})();

/*
* .handler() observations

* If using JSON object as input:

  Operations -
  1. context: 'Running cig' | input: { username: "Alice" }
  2. context: 'Operation 1 Input' | data: { username: "Alice" }
  3. context: 'init' | operation: 'handler' | input: { username: "Alice" } | instruction: '…' | examples: '[…]'
  4. context: 'Operation 1 Output' | data: { color: "blue" }

* If using string as input:
  
  Operations -
  1. context: 'Running cig' | input: 'Alice'
  2. context: 'Received string input'
  3. context: 'Processed string input' | result: { username: "Alice" }
  4. context: 'Operation 1 Input' | data: { username: "Alice" }
  5. context: 'init' | operation: 'handler' | input: { username: "Alice" }
  6. context: 'Operation 1 Output' | data: { color: "blue" }
  
* Notes

  - String input works fairly well, but can lead to some inconsistent JSON parsing, e.g. -
    - "What's Bob's favorite color?" = { username: "Bob" } = 
    - "What's Mr. Bob's favorite color?" = { username: "Mr. Bob" } = { color: "unknown" }

*/
