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

const targetSchema = z.object({
  name: z.string(),
  location: z.string(),
  temperature: z.number(),
  precipitation: z.number(),
})

// .uses() = execute a series of tools (other cigs instances)

// Helper functions (cigs)

const getUserInfoCig = cig("getUserInfo", userInfoSchema)
  .handler(async (input) => {
    // console.log("1️⃣ getUserInfoCig input: ", input);
    const userInfo = {
      'john_doe': { name: 'John Doe', location: 'New York' },
      'jane_smith': { name: 'Jane Smith', location: 'London' },
      'alice_wong': { name: 'Alice Wong', location: 'Tokyo' },
    };
    const thisUserInfo = userInfo[input.username as keyof typeof userInfo] || { name: 'Unknown', location: 'Unknown' };
    // console.log("2️⃣ getUserInfoCig output: ", thisUserInfo);
    return thisUserInfo;
  });
  
async function fetchWeatherData(input: string): Promise<{ temperature: number; precipitation: number }> {
  // console.log("1️⃣ fetchWeatherData input: ", input);
  const weatherData = {
    'New York': { temperature: 20, precipitation: 10 },
    'London': { temperature: 15, precipitation: 5 },
    'Tokyo': { temperature: 25, precipitation: 20 },
  };
  const thisWeatherData = weatherData[input as keyof typeof weatherData];
  // console.log("2️⃣ fetchWeatherData output: ", thisWeatherData);
  return thisWeatherData;
}

const getWeatherInfoCig = cig("getWeatherData", locationSchema)
  .handler(async (input) => {
    // console.log("1️⃣ getWeatherInfoCig input: ", input);
    const thisWeatherInfo = await fetchWeatherData(input.location);
    // console.log("2️⃣ getWeatherInfoCig output: ", thisWeatherInfo);
    return thisWeatherInfo;
  });

// Main workflow

const usesCig = cig("handle-users-with-tools", usernameSchema, (config) => {
  config.setLogLevel(1);
  config.setModel("gpt-4o-mini"); // points to gpt-4o-mini-2024-07-18
  config.addInstruction("Handle weather notifications for users and create a French nickname for each user"); // does not seem to pass into `uses` operation 'instruction' key
  })
  .uses([getUserInfoCig, getWeatherInfoCig])
  .handler(async (input) => {
    // console.log("⭐️ Handler input (after .uses) - expecting JSON: ", input);

    // Alternative approach to using .uses():

    // const results = await Promise.all(input.usernames.map(async (username: string) => {
    //   const userInfo = await getUserInfoCig.run({ username });
    //   const weatherData = await getWeatherInfoCig.run({ location: userInfo.location });
    //   return { 
    //     name: userInfo.name,
    //     location: userInfo.location,
    //     temperature: weatherData.temperature,
    //     precipitation: weatherData.precipitation,
    //   };
    // }));
    // return results;
  });

(async () => {
  try {
    // const callJson = await usesCig.run({ usernames: ['john_doe', 'alice_wong'] });
    // console.log('Call as Json: ', callJson);

    const callString = await usesCig.run("check on john_doe and alice_wong");
    // console.log('Call as String: ', callString);

  } catch (error) {
    console.error("Error:", error);
  }
})();

/*
* .uses()

* If using JSON object as input:

  Operations -
  1. context: 'Running cig' | input: { usernames: ['john_doe', 'alice_wong'] }
  2. context: 'Operation 1 Input' | data: { usernames: ['john_doe', 'alice_wong'] }
  3. context: 'init' | operation: 'uses' | input: { usernames: ['john_doe', 'alice_wong'] } | instruction: '' (always empty)
  3. context: 'received tool execution output' | operation: 'uses' | finalContent: (string output instead of expected JSON) | instruction: '' (always empty)
  4. context: 'Operation 1 Output' | data: (string output instead of expected JSON)
  4. context: 'Operation 2 Input' | data: (string output from previous step instead of expected JSON)
  3. context: 'init' | operation: 'handler' | input: (string output from previous step instead of expected JSON)
  4. context: 'Operation 2 Output' | data: undefined

* If using string as input:
  
  Operations -
  1. context: 'Running cig' | input: 'check on john_doe and alice_wong'
  2. context: 'Received string input'
  3. context: 'Processed string input' | result: { usernames: ['john_doe', 'alice_wong'] }
  4. context: 'Operation 1 Input' | data: { usernames: ['john_doe', 'alice_wong'] }
  5. context: 'init' | operation: 'uses' | input: { usernames: ['john_doe', 'alice_wong'] } | instruction: '' (always empty)
  6. context: 'received tool execution output' | operation: 'uses' | finalContent: (string output instead of expected JSON) | instruction: '' (always empty)
  7. context: 'Operation 1 Output' | data: (string output instead of expected JSON)
  8. context: 'Operation 2 Input' | data: (string output from previous step instead of expected JSON)
  9. context: 'init' | operation: 'handler' | input: (string output from previous step instead of expected JSON)
  10. context: 'Operation 2 Output' | data: undefined
  
* Notes

  - .uses() cannot be used alone; must use with another method after it, e.g. .handler(), generate()
  - .uses() does not seem to use `config.addInstruction` value (operation's `instruction` key is always empty)
  - .uses() does not seem to pass JSON as output (causing error for subsequent tools; happens when using both single and multiple tools)
*/
