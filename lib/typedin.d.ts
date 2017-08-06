declare module "DiRecord" {
    import * as Typedin from "index";
    /**
     * Record in {@link DiContainer}. Stores key and value.
     */
    export class DiRecord<KeyT, ValueT> {
        private mKey;
        private mValue;
        private mContainer;
        constructor(container: Typedin.DiContainer, key: KeyT, value: ValueT);
        /** Key to indetify value in {@link DiContainer} */
        readonly key: KeyT;
        /** Dependency value, that should be injected. */
        value: ValueT;
        /** Container, where record stored. */
        readonly container: Typedin.DiContainer;
    }
}
declare module "Inject" {
    import * as Typedin from "index";
    /**
      * Decorator, that inject value or service from {@link DIContainer} to the class property.
      * @param context Function, that returns {@link DIContainer} or {@link fromSelf} value.
      * @param key Unique idenitifier of the value. When injecting services type of the property will be used as a key.
      */
    export function inject<KeyT>(context: () => Typedin.DiContainer, key?: KeyT): (target: Object, propKey: string) => any;
    /**
     * Simple stub for the first parameter of the {@link inject} decorator, means
     * that class implements {@link IHaveCOntext} and that context should be received
     * by calling this.getDiContext().
     */
    export const fromSelf: () => Typedin.DiContainer;
}
declare module "IHaveContext" {
    import * as Typedin from "index";
    /**
      * Interface, that describes a class with associated {@link DiContainer}.
      *
      * **Note**: You can use {@link setDiContext} function instead of implementing the interface.
      *
      * **Note**: When some container associated with the object, {@link formSelf} can be used
      * as the first parameter of {@inject}.
      */
    export interface IHaveConext {
        /** Returns associated dependency injection container. */
        getDiContext(): Typedin.DiContainer;
    }
    /**
     * Associates {@link DiContainer} with specified object.
     *
     * When some container associated with the object, {@link formSelf} can be used
     * as the first parameter of {@inject}.
     * @param target Object to associate container with.
     * @param context Dependency injection container or function, that returns it.
     */
    export function setDiContext(target: IHaveConext | any, context: Typedin.DiContainer | (() => Typedin.DiContainer)): void;
}
declare module "index" {
    export * from "DiRecord";
    export * from "DiContainer";
    export * from "Inject";
    export * from "IHaveContext";
}
declare module "DiContainer" {
    import * as Typedin from "index";
    /** You can assign class name itself to variables of this type. */
    export type TypeOf<T> = Function & {
        prototype: T;
    };
    /**
     *  Dependency injection container.
     */
    export class DiContainer {
        private mParent;
        private mChildren;
        private mMap;
        private mTimestamp;
        /**
         * Initializes instance of {@link DiContainer}
         * @param parent {@link parent} container
         */
        constructor(parent?: DiContainer);
        /**
         * Register or update value for specified key.
         * @param key Key to identify value in container.
         * @param value Value to inject.
         * @returns Created or existing {@link DiRecord}
         */
        register<KeyT, ValueT>(key: KeyT, value: ValueT): Typedin.DiRecord<KeyT, ValueT>;
        /**
         * Removes recored from the container.
         * @param key Record key to remove.
         * @param checkParents Should remove from parent containers as well.
         * @returns Did any record found (and removed) or not.
         */
        unregister<KeyT>(key: KeyT, checkParents?: boolean): boolean;
        /**
         * Remove all records from current container (parent containers are not touched).
         */
        unregisterAll(): void;
        /**
         * Get registered {@link DiRecord} for specified key.
         * @param key Key of the record
         * @param allowParentLookup Should conainer look up to the parents, if no own record found.
         */
        getRecord<KeyT, ValueT>(key: KeyT, allowParentLookup?: boolean): Typedin.DiRecord<KeyT, ValueT>;
        /**
         * Parent container. By default, if container has no own value it looks to the parents.
         */
        parent: DiContainer;
        /** Value, indicating last change of the current container and its parents. */
        readonly timestamp: number;
        private updateTimestamp();
        /**
         * Releases all records and removes itself from parent container.
         */
        dispose(): void;
        /**
         * Same as {@link register}, but with service semantics.
         * @param interfaceType Name of the abstract class, that declares service interface.
         * @param instance Implementation of the interface.
         */
        registerService<InterfaceT, ImplT>(interfaceType: InterfaceT, instance: ImplT): Typedin.DiRecord<InterfaceT, ImplT>;
        /**
         * Wrapper of {@link getRecord} with service semantics.
         * @param interfaceType Name of the abstract class, that declares service interface.
         * @returns Registered implementation of the interface.
         */
        getService<T>(interfaceType: TypeOf<T>): T;
        /**
         * Same as {@link register}, but with value semantics.
         * @param key Value unique identifier
         * @param value Value itself
         */
        registerValue<T>(key: string | number, value: T): Typedin.DiRecord<string | number, T>;
        /**
         * Wrapper of {@link getRecord} with value semantics.
         * @param key Unique key of the value.
         * @param defaultValue Value, that will be returned if no record found.
         * @returns Value of the found record or defaultValue, if no record found.
         */
        getValue<T>(key: string | number, defaultValue?: T): T;
    }
}
