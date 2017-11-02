declare module "DiRecord" {
    import * as Typedin from "index";
    /**
     * Record in [DiContainer]{@link DiContainer}. Stores key and value.
     */
    export class DiRecord<KeyT, ValueT> {
        private mKey;
        private mValue;
        private mContainer;
        constructor(container: Typedin.DiContainer, key: KeyT, value: ValueT);
        /** Key to indetify value in [DiContainer]{@link DiContainer} */
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
      * Decorator, that inject value from [DIContainer]{@link DIContainer} to the class property.
      * @param key Unique idenitifier of the value. When injecting services type of the property will be used as a key.
      */
    export function injectThe<KeyT>(key?: KeyT): (target: Object, propKey: string) => any;
    /**
     * Decorator, that inject service from [DIContainer]{@link DIContainer} to the class property
     * using property type as a key.
     */
    export function inject(target: Object, propKey: string): any;
    /**
     * Decorator ,that associates context with a class.
     * @param context Function, that returns [DIContainer]{@link DIContainer}.
     */
    export function DiContext(context: () => Typedin.DiContainer): any;
}
declare module "IHaveContext" {
    import * as Typedin from "index";
    /**
      * Interface, that describes a class with associated [DiContainer]{@link DiContainer}.
      *
      * **Note**: You can use [setDiContext]{@link setDiContext} function instead of implementing the interface.
      *
      */
    export interface IHaveConext {
        /** Returns associated dependency injection container. */
        getDiContext(): Typedin.DiContainer;
    }
    /**
     * Associates [DiContainer]{@link DiContainer} with specified object.
     *
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
    /**
     *  Dependency injection container.
     */
    export class DiContainer {
        private mParent;
        private mChildren;
        private mMap;
        private mTimestamp;
        /**
         * Initializes instance of [DiContainer]{@link DiContainer}
         * @param [parent]{@link parent} container
         */
        constructor(parent?: DiContainer);
        /**
         * Register or update value for specified key.
         * @param key Key to identify value in container.
         * @param value Value to inject.
         * @returns Created or existing [DiRecord]{@link DiRecord}
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
         * Get registered [DiRecord]{@link DiRecord} for specified key.
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
    }
    export var Global: DiContainer;
}
declare module "typedin" {
    export * from "index";
}
