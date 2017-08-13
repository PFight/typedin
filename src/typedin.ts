export type Requires<T> = () => T;

export function to<T>(arg: T | (() => T)) {
  if (typeof (arg) == "function") {
    return arg;
  } else {
    return () => arg;
  }
}

export function injectable<T>(): T {
  return null;
}

export function bind<RequiresSpec>(spec: RequiresSpec, container: RequiresSpec): RequiresSpec {
  let result = {};
  for (let prop in spec) {
    let resultProp = {
      get: function () {
        return container[prop];
      },
      configurable: false,
      enumerable: true
    } as TypedPropertyDescriptor<any>;
    Object.defineProperty(result, prop, resultProp);
  }
  return result as RequiresSpec;
}

export function injectables<T1>(d1: T1): T1;
export function injectables<T1, T2>(d1: T1, d2: T2): T1 & T2;
export function injectables<T1, T2, T3>(d1: T1, d2: T2, d3: T3): T1 & T2 & T3;
export function injectables<T1, T2, T3, T4>(d1: T1, d2: T2, d3: T3, d4: T4): T1 & T2 & T3 & T4;
export function injectables<T1, T2, T3, T4, T5>(d1: T1, d2: T2, d3: T3, d4: T4, d5: T5): T1 & T2 & T3 & T4 & T5;
export function injectables<T1, T2, T3, T4, T5, T6>(d1: T1, d2: T2, d3: T3, d4: T4, d5: T5, d6: T6): T1 & T2 & T3 & T4 & T5 & T6;
export function injectables<T1, T2, T3, T4, T5, T6, T7>(d1: T1, d2: T2, d3: T3, d4: T4, d5: T5, d6: T6, d7: T7): T1 & T2 & T3 & T4 & T5 & T6 & T7;
export function injectables<T1, T2, T3, T4, T5, T6, T7, T8>(d1: T1, d2: T2, d3: T3, d4: T4, d5: T5, d6: T6, d7: T7, d8: T8): T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8;
export function injectables<T1, T2, T3, T4, T5, T6, T7, T8, T9>(d1: T1, d2: T2, d3: T3, d4: T4, d5: T5, d6: T6, d7: T7, d8: T8, d9: T9): T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9;
export function injectables<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10>(d1: T1, d2: T2, d3: T3, d4: T4, d5: T5, d6: T6, d7: T7, d8: T8, d9: T9, d10: T10): T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10;
export function injectables<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11>(d1: T1, d2: T2, d3: T3, d4: T4, d5: T5, d6: T6, d7: T7, d8: T8, d9: T9, d10: T10, d11: T11): T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10 & T11;
export function injectables<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, T12>(d1: T1, d2: T2, d3: T3, d4: T4, d5: T5, d6: T6, d7: T7, d8: T8, d9: T9, d10: T10, d11: T11, d12: T12): T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10 & T11 & T12;
export function injectables<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, T12, T13>(d1: T1, d2: T2, d3: T3, d4: T4, d5: T5, d6: T6, d7: T7, d8: T8, d9: T9, d10: T10, d11: T11, d12: T12, d13: T13): T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10 & T11 & T12 & T13;
export function injectables<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, T12, T13, T14>(d1: T1, d2: T2, d3: T3, d4: T4, d5: T5, d6: T6, d7: T7, d8: T8, d9: T9, d10: T10, d11: T11, d12: T12, d13: T13, d14: T14): T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10 & T11 & T12 & T13 & T14;
export function injectables<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, T12, T13, T14, T15>(d1: T1, d2: T2, d3: T3, d4: T4, d5: T5, d6: T6, d7: T7, d8: T8, d9: T9, d10: T10, d11: T11, d12: T12, d13: T13, d14: T14, d15: T15): T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10 & T11 & T12 & T13 & T14 & T15;
export function injectables<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, T12, T13, T14, T15, T16>(d1: T1, d2: T2, d3: T3, d4: T4, d5: T5, d6: T6, d7: T7, d8: T8, d9: T9, d10: T10, d11: T11, d12: T12, d13: T13, d14: T14, d15: T15, d16: T16): T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10 & T11 & T12 & T13 & T14 & T15 & T16;
export function injectables<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, T12, T13, T14, T15, T16, T17>(d1: T1, d2: T2, d3: T3, d4: T4, d5: T5, d6: T6, d7: T7, d8: T8, d9: T9, d10: T10, d11: T11, d12: T12, d13: T13, d14: T14, d15: T15, d16: T16, d17: T17): T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10 & T11 & T12 & T13 & T14 & T15 & T16 & T17;
export function injectables<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, T12, T13, T14, T15, T16, T17, T18>(d1: T1, d2: T2, d3: T3, d4: T4, d5: T5, d6: T6, d7: T7, d8: T8, d9: T9, d10: T10, d11: T11, d12: T12, d13: T13, d14: T14, d15: T15, d16: T16, d17: T17, d18: T18): T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10 & T11 & T12 & T13 & T14 & T15 & T16 & T17 & T18;
export function injectables<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, T12, T13, T14, T15, T16, T17, T18, T19>(d1: T1, d2: T2, d3: T3, d4: T4, d5: T5, d6: T6, d7: T7, d8: T8, d9: T9, d10: T10, d11: T11, d12: T12, d13: T13, d14: T14, d15: T15, d16: T16, d17: T17, d18: T18, d19: T19): T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10 & T11 & T12 & T13 & T14 & T15 & T16 & T17 & T18 & T19;
export function injectables<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, T12, T13, T14, T15, T16, T17, T18, T19, T20>(d1: T1, d2: T2, d3: T3, d4: T4, d5: T5, d6: T6, d7: T7, d8: T8, d9: T9, d10: T10, d11: T11, d12: T12, d13: T13, d14: T14, d15: T15, d16: T16, d17: T17, d18: T18, d19: T19, d20: T20): T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10 & T11 & T12 & T13 & T14 & T15 & T16 & T17 & T18 & T19 & T20;
export function injectables() {
  const newObj = {} as any;
  for (let i = 0; i < arguments.length; i++) {
    let obj = arguments[i];
    for (const key in obj) {
      //copy all the fields
      newObj[key] = obj[key];
    }
  };
  (newObj as From<any>).from = function (container) { return bind(this, container) };
  return newObj as any;
}
