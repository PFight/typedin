import * as Typedin from "./index";

/** You can assign class name itself to variables of this type. */
export type TypeOf<T> = Function & { prototype: T };

/**
 *  Dependency injection container.
 */
export class DiContainer {
  private mParent: DiContainer;
  private mChildren: DiContainer[] = [];
  private mMap: Typedin.DiRecord<any, any>[] = [];
  private mTimestamp: number = 0;

  /**
   * Initializes instance of {@link DiContainer}
   * @param parent {@link parent} container
   */
  public constructor(parent?: DiContainer) {
    this.parent = parent;
  }

  /**
   * Register or update value for specified key.
   * @param key Key to identify value in container.
   * @param value Value to inject.
   * @returns Created or existing {@link DiRecord}
   */
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

  /**
   * Removes recored from the container.
   * @param key Record key to remove.
   * @param checkParents Should remove from parent containers as well.
   * @returns Did any record found (and removed) or not.
   */
  public unregister<KeyT>(key: KeyT, checkParents: boolean = false): boolean {
    let record: Typedin.DiRecord<KeyT, any>;
    let removed = false;
    // Loop to remove from all parents
    while (record = this.getRecord(key, checkParents)) {
      record.container.mMap.splice(record.container.mMap.indexOf(record));
      removed = true;
    }
    this.updateTimestamp();
    return removed;
  }

  /**
   * Remove all records from current container (parent containers are not touched).
   */
  public unregisterAll() {
    this.mMap = [];
    this.updateTimestamp();
  }

  /**
   * Get registered {@link DiRecord} for specified key.
   * @param key Key of the record
   * @param allowParentLookup Should conainer look up to the parents, if no own record found.
   */
  public getRecord<KeyT, ValueT>(key: KeyT, allowParentLookup: boolean = true): Typedin.DiRecord<KeyT, ValueT> {
    let record = this.mMap.find(x => x.key == key);
    if (!record && allowParentLookup && this.mParent) {
      record = this.mParent.getRecord<KeyT, ValueT>(key, allowParentLookup);
    }
    return record;
  }

  // =======================================
  // Parent-child and timestamp stuff
  // ---------------------------------------

  /**
   * Parent container. By default, if container has no own value it looks to the parents.
   */
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
    this.updateTimestamp();
  }

  /** Value, indicating last change of the current container and its parents. */
  public get timestamp(): number {
    return this.mTimestamp;
  }

  private updateTimestamp() {
    this.mTimestamp++;
    if (this.mChildren) {
      this.mChildren.forEach(x => x.updateTimestamp());
    }
  }

  /**
   * Releases all records and removes itself from parent container.
   */
  public dispose() {
    this.unregisterAll();
    this.parent = null;
  }
}

export var Global = new DiContainer();