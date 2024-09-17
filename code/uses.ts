import cig, { z } from "cigs";

const locationSchema = z.object({
  location: z.string(),
})

const userInfoSchema = z.object({
  username: z.string(),
})

const usernameSchema = z.object({
  usernames: z.array(z.string()),
})

async function fetchWeatherData(location: string): Promise<{ temperature: number; precipitation: number }> {
  const data = {
    'New York': { temperature: 20, precipitation: 10 },
    'London': { temperature: 15, precipitation: 5 },
    'Tokyo': { temperature: 25, precipitation: 20 },
  };
  return data[location as keyof typeof data];
}

const getUserInfoCig = cig("getUserInfo", userInfoSchema)
  .handler(async (input) => {
    // console.log("GetUserInfo", input);
    const userInfo = {
      'john_doe': { name: 'John Doe', location: 'New York' },
      'jane_smith': { name: 'Jane Smith', location: 'London' },
      'alice_wong': { name: 'Alice Wong', location: 'Tokyo' },
    };
    return userInfo[input.username as keyof typeof userInfo] || { name: 'Unknown', location: 'Unknown' };
  });

const getWeatherDataCig = cig("getWeatherData", locationSchema)
  // input will receive {location: ""}
  .handler(async (input) => {
    console.log("GetWeatherData", input, input.location);
    const data = await fetchWeatherData(input.location);
    return data;
  });

// .uses() = execute a series of tools (other cigs instances)

const usesCig = cig("handle-users-with-tools", usernameSchema, (config) => {
  config.setLogLevel(1);
  config.setModel("gpt-4o-mini"); // points to gpt-4o-mini-2024-07-18
  config.addInstruction("Handle weather notifications for users and create a French nickname for each user"); // does not seem to pass into `uses` operation 'instruction' key
  // config.setDescription("Handle weather notifications for users and create a French nickname for each user"); // does not appear to be affecting outputs
  })
  .uses([getUserInfoCig, getWeatherDataCig])
  .handler(async (input) => {
    // console.log("Handler input (after .uses): ", input);
  });

(async () => {
  try {
    const call01Json = await usesCig.run({ usernames: ['john_doe'] });
    // console.log('Call 01 as Json: ', call01Json);

    // const call01String = await usesCig.run("john_doe");
    // console.log('Call 01 as String: ', call01String);
    
    // const call02Json = await usesCig.run({ username: ['john_doe', 'jane_smith', 'alice_wong'] });
    // console.log('Call 02 as Json: ', call02Json);

    // const call02String = await usesCig.run("check on john_doe, jane_smith, and alice_wong");
    // console.log('Call 02 as String: ', call02String);

  } catch (error) {
    console.error("Error:", error);
  }
})();

/*
* .uses() observations

* TODO: check if can get both tools to work; does not seem to be passing 'location' to the second tool as JSON
* TODO: check if possible to use with string as input

* If using JSON object as input:

  Operations -
  1. context: 'Running cig' | input: { usernames: ["john_doe"] }
  2. context: 'Operation 1 Input' | data: { usernames: ["john_doe"] }
  3. context: 'init' | operation: 'uses' | input: { usernames: ["john_doe"] } | instruction: '…'
  3. context: 'received tool execution output' | operation: 'uses' | finalContent: '…' | instruction: '…'
  4. context: 'Operation 1 Output' | data: '…'
  4. context: 'Operation 2 Input' | data: '… data output from previous step …'
  3. context: 'init' | operation: 'handler' | input: '… data output from previous step …'
  4. context: 'Operation 2 Output' | data: '…'

* If using string as input:
  
  Operations -
  1. …
  
* Notes

  - .uses() cannot be used alone; must use with another method after it, e.g. .handler(), generate()

*/
