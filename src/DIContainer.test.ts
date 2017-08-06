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
    context.register("SomeKey", 42);
    expect(context.getValue("SomeKey"))
      .to.equal(42);
  });

  it('should return registered service', () => {
    const context = new Typedin.DIContainer();
    const testService = new TestService();
    context.register(ITestService, testService);
    expect(context.getService(ITestService))
      .to.equal(testService);
  });

});
