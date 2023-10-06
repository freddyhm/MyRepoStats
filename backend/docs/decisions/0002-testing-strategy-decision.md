# **Application Framework Decision**

## Date

09/09/2023

## **Status**

Accepted

## **Context**

We need to define the appropriate testing strategy. The size and purpose of the project is to get an overview of Javascript and its ecosystem. Although implementing the testing pyramid is not needed for the app’s requirements, testing is a fundamental part of the developer experience.

## **Decision**

We will try to include at least one unit, integration, and functional test. If there’s not enough time, we will have only one functional test (this will help us when using TDD)

## Alternatives

- The full set: unit + integration + functional
- A mix of the three
- None

## Risks

Waste too much time setting up tests and mocking dependencies. Don’t get the full picture of what it’s like to write tests with the language’s ecosystem.

## **Consequences**

App will have an incomplete testing strategy, optimized for hands-on experience more than protection against regression.
