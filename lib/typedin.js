define("DiRecord", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * Record in [DiContainer]{@link DiContainer}. Stores key and value.
     */
    var DiRecord = (function () {
        function DiRecord(container, key, value) {
            this.mKey = key;
            this.mValue = value;
        }
        Object.defineProperty(DiRecord.prototype, "key", {
            /** Key to indetify value in [DiContainer]{@link DiContainer} */
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
define("Inject", ["require", "exports", "index"], function (require, exports, Typedin) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var DiContextMetadataKey = "Typedin_DiContext";
    /**
      * Decorator, that inject value from [DIContainer]{@link DIContainer} to the class property.
      * @param key Unique idenitifier of the value. When injecting services type of the property will be used as a key.
      */
    function injectThe(key) {
        return function (target, propKey) {
            var recordKey = key !== undefined ? key
                : Reflect.getMetadata("design:type", target, propKey);
            var context;
            var diRecord;
            var lastContextTimestamp;
            var lastContext;
            var descriptor = {
                get: function () {
                    if (context === undefined) {
                        context = Reflect.getMetadata(DiContextMetadataKey, target);
                    }
                    var currentContext = this.getDiContext && this.getDiContext()
                        || context && context()
                        || Typedin.Global;
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
    exports.injectThe = injectThe;
    /**
     * Decorator, that inject service from [DIContainer]{@link DIContainer} to the class property
     * using property type as a key.
     */
    function inject(target, propKey) {
        return injectThe()(target, propKey);
    }
    exports.inject = inject;
    /**
     * Decorator ,that associates context with a class.
     * @param context Function, that returns [DIContainer]{@link DIContainer}.
     */
    function DiContext(context) {
        return function (target) {
            var classPrototype = target.prototype;
            Reflect.defineMetadata(DiContextMetadataKey, context, classPrototype);
            console.info("protype", classPrototype);
            return target;
        };
    }
    exports.DiContext = DiContext;
});
define("IHaveContext", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * Associates [DiContainer]{@link DiContainer} with specified object.
     *
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
         * Initializes instance of [DiContainer]{@link DiContainer}
         * @param [parent]{@link parent} container
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
         * @returns Created or existing [DiRecord]{@link DiRecord}
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
         * Get registered [DiRecord]{@link DiRecord} for specified key.
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
        return DiContainer;
    }());
    exports.DiContainer = DiContainer;
    exports.Global = new DiContainer();
});
define("typedin", ["require", "exports", "index"], function (require, exports, index_1) {
    "use strict";
    function __export(m) {
        for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    __export(index_1);
});
