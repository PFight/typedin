import { expect } from 'chai';
import "reflect-metadata";

// Interfaces
interface ITestService {
  foo(): string;
}
interface $ITestService { testService: ITestService; };
interface $LifeMeaning { lifeMeaning: number; };
interface $DevilNumber { devilNumber: number; };

// Users
class ConstructorInjectionUser {
  static Requires: $ITestService & $LifeMeaning;
  
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
