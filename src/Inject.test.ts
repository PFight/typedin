import * as Typedin from "../src/index";
import { inject, injectThe, DiContext } from "../src/index";
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


 
enum MagicValues {
  LifeMeaning
}

class TestDIUser {
  @inject testService: ITestService;
  @injectThe(MagicValues.LifeMeaning) testValue: number;
}

var SomeGlobalContext: Typedin.DiContainer;
@DiContext(() => SomeGlobalContext)
class TestSomeDIUser {
  @inject testService: ITestService;
}


describe('Inject', () => {
  it('should receive registered service from global context', () => {
    Typedin.Global.unregisterAll();
    const testService = new TestService();
    Typedin.Global.register(ITestService, testService);
    const diUser = new TestDIUser();

    expect(diUser.testService)
      .equal(testService);

    Typedin.Global.unregisterAll();
  });

  it('should receive registered service from context, specified by DiContext', () => {
    SomeGlobalContext = new Typedin.DiContainer();
    const testService = new TestService();
    SomeGlobalContext.register(ITestService, testService);
    const diUser = new TestSomeDIUser();

    expect(diUser.testService)
      .equal(testService);

    SomeGlobalContext = null;
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
