import * as Typedin from "../src/index";
import { inject, fromSelf } from "../src/index";
import { expect } from 'chai';
import "reflect-metadata";

abstract class ITestService {
  abstract foo(): string;
}

class TestService {
  foo() {
    return "foo";
  }
}

var GlobalContext: Typedin.DiContainer;
var fromGlobal = () => GlobalContext; 
enum MagicValues {
  LifeMeaning
}


class TestGlobalDIUser {
  @inject(fromGlobal) testService: ITestService;
  @inject(fromGlobal, MagicValues.LifeMeaning) testValue: number;
}

class TestDIUser {
  @inject(fromSelf) testService: ITestService;
  @inject(fromSelf, MagicValues.LifeMeaning) testValue: number;
}

describe('Inject', () => {
  it('should receive registered service from global context', () => {
    GlobalContext = new Typedin.DiContainer();
    const testService = new TestService();
    GlobalContext.register(ITestService, testService);

    const diUser = new TestGlobalDIUser();

    expect(diUser.testService)
      .equal(testService);

    GlobalContext = null;
  });

  it('should receive registered service from self context', () => {
    const context = new Typedin.DiContainer();
    const testService = new TestService();
    context.register(ITestService, testService);

    const diUser = new TestDIUser();
    Typedin.setDiContext(diUser, context);

    expect(diUser.testService)
      .equal(testService);
  });

  it('should receive registered value', () => {
    const context = new Typedin.DiContainer();

    const lifeMeaning = 42;
    context.register(MagicValues.LifeMeaning, lifeMeaning);

    const diUser = new TestDIUser();
    Typedin.setDiContext(diUser, context);

    expect(diUser.testValue).equal(lifeMeaning);
  });

  it('should cache injected value', () => {
    const context = new Typedin.DiContainer();
    const lifeMeaning = 42;
    context.register(MagicValues.LifeMeaning, lifeMeaning);
    const diUser = new TestDIUser();
    Typedin.setDiContext(diUser, context);

    let testValue = diUser.testValue;
    let accesed = false;
    context.getRecord = function() {
      accesed = true;
      return context.getRecord.apply(context, arguments);
    };

    expect(accesed).equal(false);
  });

  it('should update cached value, if new value registered', () => {
    const context = new Typedin.DiContainer();
    const lifeMeaning = 42;
    const anotherLifeMeading = 24;
    context.register(MagicValues.LifeMeaning, lifeMeaning);
    const diUser = new TestDIUser();
    Typedin.setDiContext(diUser, context);

    const testValue1 = diUser.testValue;
    context.register(MagicValues.LifeMeaning, anotherLifeMeading);
    const testValue2 = diUser.testValue;

    expect(testValue1).not.equal(testValue2);
    expect(testValue2).equal(anotherLifeMeading);
  });

});
