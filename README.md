# Exploring `cigs` LLM Workflow Framework

- https://github.com/cigs-tech/cigs
- as of 2024-09-19 (version is `0.1.4`)

# Notes

## General

- currently, each work session requires manually setting OPENAI_API_KEY as local var; e.g. `export OPENAI_API_KEY=sk-...`
- providing input via structured JSON is still most reliable (string inputs can be inconsistent)

## 🤔 Questions

**Methods**

- `.schema()`
  - is this effectively same as `.generate()` @ 1 or designed to be used differently?
- `.classify()`
  - includes 'ASSISTANT' in prompt, but other methods do not, why?
  - why using 'ASSISTANT' in prompt - is it similar to Claude 'prompt prefilling' to help shape response?
- `.uses()`
  - what model will `.uses()` cigs use if they do not have model specified by their own `config.setModel()`?
    - will they use model defined in `config.setModel()` for the main (calling) cig?
  - are tools limited to other cigs instances only?
  - what is 'instruction' key used for in `.uses` operation?
    - doesn't use value from `config.addInstruction()`, if provided
    - always appears to be empty (see `logs/uses__.log` files)
- is `defaultOperation` in codebase (and its prompt) intended to be accessed/usable by user?
  - if so, how is it accessed?
  - if not, what is its purpose; does it have any effect on workflows?

**Config**

- `config.setDescription()`
  - how is used & what does it affect? (doesn't appear to be affecting output)

## 🐛 Bugs?

**Methods**

- `.uses()`
  - tool(s) do not pass JSON as output (converts JSON values to a formatted string)
    - see `logs/uses__.log` files
  - causing errors for subsequent tools
  - happens when using both single and multiple tools

**Method Input**

- using _string inputs_ can lead to inconsistent LLM steps, e.g. -
  - returning instruction result rather than parsing string into input schema JSON object
    - see `logs/generate__string-input_error.log`, `logs/classify__string-input_error.log`
    - seems like it happens more frequently on initial calls with a string input
  - asking LLM to 'lookup' examples before generation

**Config**

- `config.addExample()`
  - examples NOT used in prompt for `.generate()`, `.schema()`
    - examples are part of operation's 'init' step
    - do these somehow affect work in operation's subsequent steps?
  - examples ARE used in prompt for:
    - `.classify()`

**Misc**

- punycode warning: `DeprecationWarning: The 'punycode' module is deprecated. Please use a userland alternative instead.`

## 🧰 Enhancements?

**Methods**

- add a generic method that allows calling LLM with custom prompt but still uses structured output schema
- if `.schema()` is unique in purpose than `.generate()` @ 1, perhaps better method name is `.transform()`

**LLMs**

- add ability to load key from `.env`
- add ability to use other OpenAI compatible APIs (e.g. OpenRouter)
  - possible with non-OpenAI LLMs that do not have official `structured-output` support?

## 🔧 Under the Hood

**Log Level**

- 1: INFO + DEBUG + TRACE (shows `extracted prompt` when applicable)
- 2: INFO + DEBUG
- 3: INFO
- 4+: no logs

If no `config.setLogLevel()` is provided, defaults to no logs.

**System Prompt Templates**

_.schema()_

```md
|SYSTEM|
# Expert Entity Extractor
You are an expert entity extractor that always maintains as much semantic
meaning as possible. You use inference or deduction whenever necessary to
supply missing or omitted data. Examine the provided data, text, or
information and generate a list of any entities or objects that match the
requested format.

|USER|
## Data to extract
{ data provided to method }

{ if `config.addInstruction()` value provided }
## Additional instructions
{ `config.addInstruction()` value }
{ end if }
```

_.generate()_

```md
|SYSTEM|
# Expert Data Generator
You are an expert data generator that always creates high-quality, random
examples of a description or type. The data you produce is relied on for
testing, examples, demonstrations, and more. You use inference or deduction
whenever necessary to supply missing or omitted data.

Unless explicitly stated otherwise, assume a request for a VARIED
and REALISTIC selection of useful outputs that meet the given criteria. However,
prefer common responses to uncommon ones.

If a description is provided, generate examples that satisfy the description. 
Do not provide more information than requested.

|USER|
## Input data
{ data provided to method }

## Requested number of entities
Generate a list of { requested number of entities } random entity/ies.

{ if `config.addInstruction()` value provided }
## Instructions
{ `config.addInstruction()` value }
{ end if }
```

_.classify()_

```md
|SYSTEM|
# Expert Classifier
You are an expert classifier that always maintains as much semantic meaning
as possible when labeling text. You use inference or deduction whenever
necessary to understand missing or omitted data. Classify the provided data,
text, or information as one of the provided labels. For boolean labels,
consider "truthy" or affirmative inputs to be "true".

|USER|
## Text or data to classify
{ data provided to method }

{ if `config.addInstruction()` value provided }
## Additional instructions
{ `config.addInstruction()` value }
{ end if }

{ if `config.addExample()` values provided }
## Examples
Example {index}:
Input: {example.input}
Label: {example.output}
{ end if }

## Labels
You must classify the data as one of the following labels, which are numbered (starting from 0) and provide a brief description. Output the label number only.

- Label #0: {1st provided category}
- Label #1: {2nd provided category}
- Label #2: {3rd provided category}
- Label #…: {… provided category}

|ASSISTANT|
The best label for the data is Label
```

_default prompt_

- within `defaultOperation` method in cigs code
- when is this used?
- is this intended to be accessed by user at any point?

```md
|SYSTEM|
Do you best to answer the question given the provided context.

|USER|
## Input
{ data provided to method }

{ if `config.addInstruction()` value provided }
## Additional instructions
{ `config.addInstruction()` value }
{ end if }

{ if `config.addExample()` values provided }
## Examples
Example {index}:
Input: {example.input}
Label: {example.output}
{ end if }
```

