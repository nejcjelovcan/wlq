This is a serverless quiz game I am working on to strengthen my skills of building fullstack applications in Typescript.

- [The game](#the-game)
- [Current focus](#current-focus)
- [Packages](#packages)
  - [wlq-core](#wlq-core)
  - [wlq-api-aws](#wlq-api-aws)
  - [wlq-app](#wlq-app)
- [Not doing](#not-doing)

## The game
The basic idea is to have a simple Browser-based multiplayer quiz game where you can test your knowledge of Geography while competing with your friends (or other users that are currently online). It should be easy to get into and invite others.

Link to live demo coming soon...

## Current focus
While it is important to me that the game is at least playable, the main focus of this whole endeavour is:
- doing a 100% Typescript project
- making sure data models and ~~business~~ __game__ logic are decoupled from cloud service (AWS)
- having core logic covered with unit tests (~75%)
- making use of different AWS services and trying them in a (semi) real-world scenarios 
- doing automated integration and system testing before merging to default branch
- utilizing Github actions, Codecov.io, dependabot, etc.

The frontend part currently didn't get enough love (yet).

## Packages

### wlq-core
See [packages/wlq-core](packages/wlq-core)

Currently experimenting with [io-ts](https://github.com/gcanti/io-ts) for runtime data validation.

I tried to decouple most of API logic from AWS by doing inversion of control with dependency injection via two main interfaces (not doing [fp-ts](https://github.com/gcanti/fp-ts) just yet 🤪):

- [IStore](packages/wlq-core/src/model/IStore.ts) is a very simple Data Access Layer that currently has two implementations, [MemoryStore](packages/wlq-core/src/model/MemoryStore.ts) for usage in tests and [DynamoDB](packages/wlq-api-aws/src/tools/room.store.ts) implementation for data persistence in AWS DynamoDB.

- [IEmitter](packages/wlq-core/src/emitter/IEmitter.ts) is an interface that allows for
  1. setting responses that can be handled by REST Lambdas to generate APIGatewayProxyResult
  2. emitting websocket events that can be handled by Websocket Lambdas to send events to open websocket connections
  3. publishing messages to notification topic, used by AWS SNS - which then broadcasts messages to certain groups of websocket connections
  4. starting new state machines (used with Step functions) - and handling state machine task callbacks

  Emitters are currently stubbed in tests and [implemented for AWS](packages/wlq-api-aws/src/tools).

### wlq-api-aws
Backend (FaaS) part of the application is in [packages/wlq-api-aws/](packages/wlq-api-aws/) and uses [Serverless framework](https://www.serverless.com/) to define [AWS](https://aws.amazon.com/) CloudFormation with AWS Lambda, DynamoDB, SNS, Step functions, API Gateway.

This might change. I'm fed up with Serverless Framework and also want to try out Amazon Cloud Development kit, Azure and eventually extract some parts of the architecture and manage it in a more PaaS way...

### wlq-app
Browser part of the application is in [packages/wlq-app](packages/wlq-app) and uses [React](https://reactjs.org/) with [ChakraUI](https://next.chakra-ui.com/) toolkit (1.0 RC).

This also might change, I'm thinking about trying out Svelte, Flutter and maybe doing a WebGL version...

## Not doing
There are a couple of things I have thought about but are out scope for a minimal viable game. I intentionally didn't work on these:

Content management:
A quiz game needs content. Scraping a couple of Wikipedia lists is not enough. I am planning to make use of WikiData and SPARQL and a headless CMS system for proper editorial. With a combination of automatically harvested content and human editing, there is potential to make a vast database of randomly generated Quiz questions while minimizing the amount of repetitive labour.
