define("DiRecord", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * Record in {@link DiContainer}. Stores key and value.
     */
    var DiRecord = (function () {
        function DiRecord(container, key, value) {
            this.mKey = key;
            this.mValue = value;
        }
        Object.defineProperty(DiRecord.prototype, "key", {
            /** Key to indetify value in {@link DiContainer} */
            get: function () {
                return this.mKey;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DiRecord.prototype, "value", {
            /** Dependency value, that should be injected. */
            get: function () {
                return this.mValue;
            },
            set: function (val) {
                this.mValue = val;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DiRecord.prototype, "container", {
            /** Container, where record stored. */
            get: function () {
                return this.mContainer;
            },
            enumerable: true,
            configurable: true
        });
        return DiRecord;
    }());
    exports.DiRecord = DiRecord;
});
define("Inject", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
      * Decorator, that inject value or service from {@link DIContainer} to the class property.
      * @param context Function, that returns {@link DIContainer} or {@link fromSelf} value.
      * @param key Unique idenitifier of the value. When injecting services type of the property will be used as a key.
      */
    function inject(context, key) {
        return function (target, propKey) {
            var recordKey = key !== undefined ? key
                : Reflect.getMetadata("design:type", target, propKey);
            var diRecord;
            var lastContextTimestamp;
            var lastContext;
            var descriptor = {
                get: function () {
                    var currentContext = context && context() ||
                        this.getDiContext && this.getDiContext();
                    if (!currentContext)
                        throw new Error("Cant inject value: 'context' is not defined in decorator of property '@{propKey}'");
                    if (!diRecord ||
                        currentContext != lastContext ||
                        currentContext.timestamp != lastContextTimestamp) {
                        lastContext = currentContext;
                        lastContextTimestamp = currentContext.timestamp;
                        diRecord = currentContext.getRecord(recordKey);
                    }
                    return diRecord && diRecord.value;
                }
            };
            Object.defineProperty(target, propKey, descriptor);
            return descriptor;
        };
    }
    exports.inject = inject;
    /**
     * Simple stub for the first parameter of the {@link inject} decorator, means
     * that class implements {@link IHaveCOntext} and that context should be received
     * by calling this.getDiContext().
     */
    exports.fromSelf = null;
});
define("IHaveContext", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * Associates {@link DiContainer} with specified object.
     *
     * When some container associated with the object, {@link formSelf} can be used
     * as the first parameter of {@inject}.
     * @param target Object to associate container with.
     * @param context Dependency injection container or function, that returns it.
     */
    function setDiContext(target, context) {
        if (typeof (context) == "object") {
            target.getDiContext = function () { return context; };
        }
        else if (typeof (context) == "function") {
            target.getDiContext == context;
        }
        else {
            throw new Error("Invalid argument 'context'");
        }
    }
    exports.setDiContext = setDiContext;
});
define("index", ["require", "exports", "DiRecord", "DiContainer", "Inject", "IHaveContext"], function (require, exports, DiRecord_1, DiContainer_1, Inject_1, IHaveContext_1) {
    "use strict";
    function __export(m) {
        for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    __export(DiRecord_1);
    __export(DiContainer_1);
    __export(Inject_1);
    __export(IHaveContext_1);
});
define("DiContainer", ["require", "exports", "index"], function (require, exports, Typedin) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     *  Dependency injection container.
     */
    var DiContainer = (function () {
        /**
         * Initializes instance of {@link DiContainer}
         * @param parent {@link parent} container
         */
        function DiContainer(parent) {
            this.mChildren = [];
            this.mMap = [];
            this.mTimestamp = 0;
            this.parent = parent;
        }
        /**
         * Register or update value for specified key.
         * @param key Key to identify value in container.
         * @param value Value to inject.
         * @returns Created or existing {@link DiRecord}
         */
        DiContainer.prototype.register = function (key, value) {
            var record = this.getRecord(key, false);
            if (!record) {
                record = new Typedin.DiRecord(this, key, value);
                this.mMap.push(record);
            }
            else {
                record.value = value;
            }
            this.updateTimestamp();
            return record;
        };
        /**
         * Removes recored from the container.
         * @param key Record key to remove.
         * @param checkParents Should remove from parent containers as well.
         * @returns Did any record found (and removed) or not.
         */
        DiContainer.prototype.unregister = function (key, checkParents) {
            if (checkParents === void 0) { checkParents = false; }
            var record;
            var removed = false;
            // Loop to remove from all parents
            while (record = this.getRecord(key, checkParents)) {
                record.container.mMap.splice(record.container.mMap.indexOf(record));
                removed = true;
            }
            this.updateTimestamp();
            return removed;
        };
        /**
         * Remove all records from current container (parent containers are not touched).
         */
        DiContainer.prototype.unregisterAll = function () {
            this.mMap = [];
            this.updateTimestamp();
        };
        /**
         * Get registered {@link DiRecord} for specified key.
         * @param key Key of the record
         * @param allowParentLookup Should conainer look up to the parents, if no own record found.
         */
        DiContainer.prototype.getRecord = function (key, allowParentLookup) {
            if (allowParentLookup === void 0) { allowParentLookup = true; }
            var record = this.mMap.find(function (x) { return x.key == key; });
            if (!record && allowParentLookup && this.mParent) {
                record = this.mParent.getRecord(key, allowParentLookup);
            }
            return record;
        };
        Object.defineProperty(DiContainer.prototype, "parent", {
            // =======================================
            // Parent-child and timestamp stuff
            // ---------------------------------------
            /**
             * Parent container. By default, if container has no own value it looks to the parents.
             */
            get: function () {
                return this.mParent;
            },
            set: function (parent) {
                var oldParent = this.mParent;
                this.mParent = parent;
                if (oldParent && parent != oldParent) {
                    oldParent.mChildren.splice(oldParent.mChildren.indexOf(this));
                }
                if (parent) {
                    this.mParent.mChildren.push(this);
                }
                this.updateTimestamp();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DiContainer.prototype, "timestamp", {
            /** Value, indicating last change of the current container and its parents. */
            get: function () {
                return this.mTimestamp;
            },
            enumerable: true,
            configurable: true
        });
        DiContainer.prototype.updateTimestamp = function () {
            this.mTimestamp++;
            if (this.mChildren) {
                this.mChildren.forEach(function (x) { return x.updateTimestamp(); });
            }
        };
        /**
         * Releases all records and removes itself from parent container.
         */
        DiContainer.prototype.dispose = function () {
            this.unregisterAll();
            this.parent = null;
        };
        // ======================================
        // Services and values helpers
        // --------------------------------------
        /**
         * Same as {@link register}, but with service semantics.
         * @param interfaceType Name of the abstract class, that declares service interface.
         * @param instance Implementation of the interface.
         */
        DiContainer.prototype.registerService = function (interfaceType, instance) {
            return this.register(interfaceType, instance);
        };
        /**
         * Wrapper of {@link getRecord} with service semantics.
         * @param interfaceType Name of the abstract class, that declares service interface.
         * @returns Registered implementation of the interface.
         */
        DiContainer.prototype.getService = function (interfaceType) {
            var record = this.getRecord(interfaceType);
            return record && record.value;
        };
        /**
         * Same as {@link register}, but with value semantics.
         * @param key Value unique identifier
         * @param value Value itself
         */
        DiContainer.prototype.registerValue = function (key, value) {
            return this.register(key, value);
        };
        /**
         * Wrapper of {@link getRecord} with value semantics.
         * @param key Unique key of the value.
         * @param defaultValue Value, that will be returned if no record found.
         * @returns Value of the found record or defaultValue, if no record found.
         */
        DiContainer.prototype.getValue = function (key, defaultValue) {
            var record = this.getRecord(key);
            return record ? record.value : defaultValue;
        };
        return DiContainer;
    }());
    exports.DiContainer = DiContainer;
});