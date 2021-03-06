﻿import * as Typedin from "../src/index";
import { expect } from 'chai';

abstract class ITestService {
  abstract foo(): string;
}

class TestService {
  foo() {
    return "foo";
  }
}

describe('DIContainer', () => {
  it('should return registered value', () => {
    const context = new Typedin.DiContainer();
    const key = "SomeKey";
    context.register(key, 42);
    expect(context.getRecord(key).value)
      .equal(42);
  });

  it('should return registered service', () => {
    const context = new Typedin.DiContainer();
    const testService = new TestService();
    context.register(ITestService, testService);
    expect(context.getRecord(ITestService).value)
      .equal(testService);
  });

  it('should return registered in parent value', () => {
    const key = "SomeKey";
    const parentContext = new Typedin.DiContainer();
    parentContext.register(key, 42);
    const childContext = new Typedin.DiContainer(parentContext);

    expect(childContext.getRecord(key).value)
      .equal(42);
  });
  it('should update timestamp on register', () => {
    const context = new Typedin.DiContainer();
    const initialTimestamp = context.timestamp;
    const key = "SomeKey";
    context.register(key, 42);
    expect(context.timestamp)
      .not.equal(initialTimestamp);
  });
  it('should update timestamp on register in parent context', () => {
    const parentContext = new Typedin.DiContainer();
    const childContext = new Typedin.DiContainer(parentContext);
    const initialChildTimestamp = childContext.timestamp;

    parentContext.register("SomeKey", 42);

    expect(childContext.timestamp)
      .not.equal(initialChildTimestamp);
  });

});
