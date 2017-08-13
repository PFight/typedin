import { bind, to, injectable, injectables } from "./typedin";
import { expect } from 'chai';
import "reflect-metadata";

// Interfaces
interface ITestService {
  foo(): string;
}
var $ITestService = { testService: injectable<ITestService>() };
var $LifeMeaning = { lifeMeaning: injectable<number>() };
var $DevilNumber = { devilNumber: injectable<number>() };

// Implementation
class TestService implements ITestService {
  foo() {
    return "foo";
  }
}
var Global = {
  testService: new TestService(),
  lifeMeaning: 42,
  devilNumber: 666
};

// Users
class ConstructorInjectionUser {
  static Requires = injectables($ITestService, $LifeMeaning);
  constructor(public external: typeof ConstructorInjectionUser.Requires) {
  }
}



describe('typedin3', () => {
  it('should receive service and values from container', () => {
    var container = {
      testService: new TestService(),
      lifeMeaning: 42,
      devilNumber: 666
    };
    var user = new ConstructorInjectionUser(
      bind(ConstructorInjectionUser.Requires, container));

    expect(user.external.testService)
      .equal(container.testService);
    expect(user.external.lifeMeaning)
      .equal(container.lifeMeaning);
  });

  it('should not allow to change container', () => {
    var container = {
      testService: new TestService(),
      lifeMeaning: 42,
      devilNumber: 666
    };
    var user = new ConstructorInjectionUser(
      bind(ConstructorInjectionUser.Requires, container));

    expect(() => user.external.lifeMeaning = 13).to.throw();
  });

  it('should not allow to access not injected values', () => {
    var container = {
      testService: new TestService(),
      lifeMeaning: 42,
      devilNumber: 666
    };
    var user = new ConstructorInjectionUser(
      bind(ConstructorInjectionUser.Requires, container));

    expect(user.external["devilNumber"]).equals(undefined);
  });
});
