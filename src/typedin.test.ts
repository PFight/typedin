import { injectable, Requires, injectables, bind, to } from "./typedin";
import { expect } from 'chai';
import "reflect-metadata";

// Interfaces
interface ITestService {
  foo(): string;
}
var $ITestService = { testService: injectable<ITestService>() };
var $LifeMeaning = { lifeMeaning: injectable<number>() };
var $DevilNumber = { devilNumber: injectable<number>() };

// Using
class ConstructorInjectionUser {
  static Requires = injectables($ITestService, $LifeMeaning);
  
  constructor(public external: typeof ConstructorInjectionUser.Requires) {
  }
}

// Implementation
class TestService implements ITestService {
  foo() {
    return "foo";
  }
}

describe('typedin', () => {
  it('should receive service and values from container', () => {
    var container = {
      testService: new TestService(),
      lifeMeaning: 42,
      devilNumber: 666
    };
    var user = new ConstructorInjectionUser(container);

    expect(user.external.testService)
      .equal(container.testService);
    expect(user.external.lifeMeaning)
      .equal(container.lifeMeaning);
  });
});
