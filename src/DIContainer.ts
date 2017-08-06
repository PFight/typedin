import * as Typedin from "./index";

export type TypeOf<T> = Function & { prototype: T };

export class DiContainer {
  private mParent: DiContainer;
  private mChildren: DiContainer[] = [];
  private mMap: Typedin.DiRecord<any, any>[] = [];
  private mTimestamp: number = 0;

  public constructor(parent?: DiContainer) {
    this.parent = parent;
  }

  public register<KeyT, ValueT>(key: KeyT, value: ValueT): Typedin.DiRecord<KeyT, ValueT> {
		var record = this.getRecord<KeyT, ValueT>(key, false);
		if (!record) {
			record = new Typedin.DiRecord<KeyT, ValueT>(this, key, value);
			this.mMap.push(record);
		} else {
			record.value = value;
    }
    this.updateTimestamp();
    return record;
  }

  public unregister<KeyT>(key: KeyT, checkParents: boolean = false): Typedin.DiRecord<KeyT, any> {
    let record = this.getRecord(key, checkParents);
    if (record) {
      record.container.mMap.splice(record.container.mMap.indexOf(record));
    }
    this.updateTimestamp();
    return record;
  }

  public unregisterAll() {
    this.mMap = [];
    this.updateTimestamp();
  }

  public getRecord<KeyT, ValueT>(key: KeyT, allowParentLookup: boolean = true): Typedin.DiRecord<KeyT, ValueT> {
    let record = this.mMap.find(x => x.key == key);
    if (!record && allowParentLookup && this.mParent) {
      record = this.mParent.getRecord<KeyT, ValueT>(key);
    }
    return record;
  }

  // =======================================
  // Parent-child and timestamp stuff
  // ---------------------------------------

  public get parent(): DiContainer {
    return this.mParent;
  }
  public set parent(parent: DiContainer) {
    let oldParent = this.mParent;
    this.mParent = parent;
    if (oldParent && parent != oldParent) {
      oldParent.mChildren.splice(oldParent.mChildren.indexOf(this));
    }
    if (parent) {
      this.mParent.mChildren.push(this);
    }
  }

  public get timestamp(): number {
    return this.mTimestamp;
  }

  private updateTimestamp() {
    this.mTimestamp++;
    if (this.mChildren) {
      this.mChildren.forEach(x => x.updateTimestamp());
    }
  }

  public dispose() {
    this.unregisterAll();
    this.parent = null;
  }

  // ======================================
  // Services and values helpers
  // --------------------------------------
	
  public registerService<InterfaceT, ImplT>(interfaceType: InterfaceT, instance: ImplT): Typedin.DiRecord<InterfaceT, ImplT> {
    return this.register(interfaceType, instance);
  }
  public getService<T>(interfaceType: TypeOf<T>): T {
    let record = this.getRecord<TypeOf<T>, T>(interfaceType);
    return record && record.value;
  }

  public registerValue<T>(key: string|number, value: T) {
    return this.register(key, value);
  }
  public getValue<T>(key: string|number, defaultValue?: T): T {
    let record = this.getRecord<string|number, T>(key);
    return record && record.value || defaultValue;
  }
}
