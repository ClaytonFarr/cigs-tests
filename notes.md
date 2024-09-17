# Notes

**Methods**

- `.schema()` same as `.generate()` @ 1?
- `.classify()` includes 'ASSISTANT' but other methods do not, why?
- `.uses()`
  - are tools limited to other cigs instances only?
  - what is 'instruction' key for in `.uses()`? (does not appear to use value from`config.addInstruction()`)

**Method input**

- structured JSON as input seems to be most reliable
- string inputs can lead to inconsistent LLM steps, e.g.
  - extra operations steps that ask LLM to 'lookup' examples before generation
  - `Processed string input` results in instruction results, e.g. 
    - .generate() : occasionally returns concatenated string of album titles rather than genre label for 'genre' key
    - .classify() : consistently returns "That's a lovely compliment! Thank you. If there's anything you'd like to know or discuss, feel free to let me know.")

**Extracted prompt**

- `config.addExample()`
  - do NOT see config examples being used in system/user message for:
    - `.generate()`
    - `.schema()`
    - do the included examples in the 'init' context somehow affect the work 'extracted prompt' context performs?
  - DO see config examples being used in system/user message for:
    - `.classify()`
- `config.setDescription()`
  - how is used and what does it affect? (doesn't appear to be affecting outputs)

**LLMs**

- ? add ability to load key from `.env`
- ? add ability to use other OpenAI compatible APIs (e.g. OpenRouter)

**Log Level**

- 1: INFO + DEBUG + TRACE (shows `extracted prompt` when applicable)
- 2: INFO + DEBUG
- 3: INFO
- 4+: no logs

**Other**

- `punycode` DeprecationWarning?