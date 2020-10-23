import IEmitter from "../IEmitter";

export function newStubEmitter(overrides: Partial<IEmitter> = {}): IEmitter {
  return {
    websocket: jest.fn(),
    restResponse: jest.fn(),
    publish: jest.fn(),
    stateMachineStart: jest.fn(),
    stateMachineTaskSuccess: jest.fn(),
    ...overrides
  };
}
