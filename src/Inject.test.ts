import * as Typedin from "../src/index";
import { expect } from 'chai';
let inject = Typedin.inject;
import "reflect-metadata";

abstract class ITestService {
  abstract foo(): string;
}

class TestService {
  foo() {
    return "foo";
  }
}

var GlobalContext: Typedin.DIContainer;
var fromGlobal = () => GlobalContext; 
enum MagicValues {
  LifeMeaning
}


class TestDIUser {
  @inject(fromGlobal) testService: ITestService;
  @inject(fromGlobal, MagicValues.LifeMeaning) testValue: number;
}

describe('Inject', () => {
  it('should receive registered service', () => {
    GlobalContext = new Typedin.DIContainer();
    const testService = new TestService();
    GlobalContext.register(ITestService, testService);

    const diUser = new TestDIUser();

    expect(diUser.testService)
      .equal(testService);

    GlobalContext = null;
  });

  it('should receive registered value', () => {
    GlobalContext = new Typedin.DIContainer();

    const lifeMeaning = 42;
    GlobalContext.register(MagicValues.LifeMeaning, lifeMeaning);

    const diUser = new TestDIUser();

    expect(diUser.testValue)
      .equal(lifeMeaning);

    GlobalContext = null;
  });

});
