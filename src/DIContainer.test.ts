import * as Typedin from "../src/index";
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
    const context = new Typedin.DIContainer();
    const key = "SomeKey";
    context.register(key, 42);
    expect(context.getValue(key))
      .equal(42);
  });

  it('should return registered service', () => {
    const context = new Typedin.DIContainer();
    const testService = new TestService();
    context.register(ITestService, testService);
    expect(context.getService(ITestService))
      .equal(testService);
  });

  it('should return registered in parent value', () => {
    const key = "SomeKey";
    const parentContext = new Typedin.DIContainer();
    parentContext.register(key, 42);
    const childContext = new Typedin.DIContainer(parentContext);

    expect(childContext.getValue(key))
      .equal(42);
  });
  it('should update timestamp on register', () => {
    const context = new Typedin.DIContainer();
    const initialTimestamp = context.timestamp;
    const key = "SomeKey";
    context.register(key, 42);
    expect(context.timestamp)
      .not.equal(initialTimestamp);
  });
  it('should update timestamp on register in parent context', () => {
    const parentContext = new Typedin.DIContainer();
    const childContext = new Typedin.DIContainer(parentContext);
    const initialChildTimestamp = childContext.timestamp;

    parentContext.register("SomeKey", 42);

    expect(childContext.timestamp)
      .not.equal(initialChildTimestamp);
  });

});
