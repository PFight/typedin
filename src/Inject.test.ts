import * as Typedin from "../src/index";
import { inject, injectThe, DiContext } from "../src/index";
import { expect } from 'chai';
import "reflect-metadata";

abstract class ITestService {
  abstract foo(): string;
}

function injectable<T>(): T {
  return null;
}

class TestService {
  foo() {
    return "foo";
  }
}
var $ITestService = { testSerice: injectable<ITestService>() };
 
enum MagicValues {
  LifeMeaning
}
var $LifeMeaning = { lifeMeaning: injectable<number>() };
var $DevilNumber = { devilNumber: injectable<number>() };

class TestDIUserDeps {
  @inject testService: ITestService;
  @injectThe(MagicValues.LifeMeaning) testValue: number;
}

function injectables<T1, T2, T3>(a1: T1, a2?: T2, a3?: T3): T1 & T2 & T3 {
  const newObj = {};
  [].forEach.apply(arguments, (obj) => {
    for (const key in obj) {
      //copy all the fields
      newObj[key] = obj[key];
    }
  });
  return newObj as any; 
}

function initialize<TOwner, TDeps>(self: TOwner, deps: TDeps) {
  return (dependencies: TDeps) => {
    (self as any).deps = dependencies;
  }; 
}

var Global = {
  testSerice: new TestService(),
  lifeMeaning: 42,
  devilNumber: 666
};
var $Global = () => Global;

interface TestDIUserProps {
  deps: typeof TestDIUser.Requires;
}

function extract<R>(r: R, provider: R): R {
  return provider;
}

interface IHaveContext<T> {
  getDiContext(): T;
}

function bind<R>(r: R, self: IHaveContext<R> | any, ...p: (() => R)[]): requires<R> {
  return () => {
    let result = self && (self as IHaveContext<R>).getDiContext();
    if (!result) {
      for (let cur of p) {
        result = cur();
        if (result)
          break;
      }
    }
    return result;
  };
}

function to<T>(arg: T) {
  if (typeof (arg) == "function") {
    return arg;
  } else {
    return () => arg;
  }
}

type requires<T> = () => T;

class TestDIUser {
  static Requires = injectables($ITestService, $LifeMeaning);
  public pdeps = bind(TestDIUser.Requires, to(this), to(Global));
  //public pdeps: requires<typeof TestDIUser.Requires>;

  constructor(deps: typeof TestDIUser.Requires) {
    this.pdeps = bind(TestDIUser.Requires, to(this), to(deps), to(Global));
  }
  
  @inject testService: ITestService;
  @injectThe(MagicValues.LifeMeaning) testValue: number;

  foo() {
    this.pdeps().lifeMeaning;
  }
}

class TUs2 {
  static Requires = injectables($ITestService, $DevilNumber);
}



var dd = new TestDIUser(Global);

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
