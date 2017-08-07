# typedin
Simple yet powerful dependency injection library for TypeScript

[API Reference](https://pfight.github.io/typedin/)

### Simple usage

1) Declare interface via abstract class and implement it (no typedin code yet).

        abstract class ILogService {
            log(message: string);
        }
        class ConsoleLogService extends ILogService {
            log(message: string) {
                console.info(message);
            }
        }

2) Create and register a service. There we use `Global`, but there are variants (see below).

        import { Global } from "typedin";

        Global.register(ILogService, new ConsoleLogService());

3) Declare property with decorator `@inject` to get service from container. 

        import {inject} from "typedin";

        class SomeComponent {
            @inject logService: ILogService;

		    foo() {
			    this.logService.log("Hello there");
		    }
        }

Decorator `@inject` will determine type of property, resolve depenency container, and receive service from it.


### Providing dependency container

In sample above we used Global container. Decorator `@inject` looks for the container in next order:

1. In `this` object. You can implement interface 'IHaveContext' to provide context:

        import {inject, DiContainer IHaveContext} from "typedin";

        class SomeComponent implements IHaveContext {  
            @inject logService: ILogService;
      
            constructor(private context: DiContainer) {
            }        
            getDiContext() {
                return this.context;
            }
        }

Another way (the same in internals), but without implementing `IHaveContext`. Just use `setDiContext`:

        import {inject, DiContainer, setDiContext} from "typedin";

        class SomeComponent {
            @inject logService: ILogService;
  
            constructor(context?: DiContainer) {
                setDiContext(this, context);
            }
        }
        // Or from external
        var someComponent = new SomeComponent();
        setDiContext(someComponent, GlobalContainer);

2. If this object have no context, then looks for `@DiContext` decorator value. You can pass some own global context to it.
    
        import {inject, DiContainer, DiContext} from "typedin";

        var MyGlobalContext = new DiContainer();

        @DiContext(() => MyGlobalContext)
        class SomeComponent {
            @inject logService: ILogService;
        }

3. If on steps 1 and 2 container not found, then `Global` container is selected.


### Injecting values

You can inject any values as well as a services, just use `@injectThe` decorator, instead of `@inject`. Key can be any object comparable via '==' operator. 

    import {injectThe, Global} from "typedin";

    enum MagicValues {
        LifeMeaning
    }

    Global.register(MagicValues.LifeMeaning, 42);
    
    class SomeComponent {
        @injectThe(MagicValues.LifeMeaning) lifeMeaning: number;
    }


### Inheritance of the containers

Containers can be inherited one from another. If container not found value, it will continue search in parent container. In example we override `LifeMeaning` value in derived container, but `DevilNumber` will be received from parent.


    import {inject, Global, seDiContext} from "typedin";

    enum MagicValues {
        LifeMeaning,
        DevilNumber
    }

    Global.registerValue(MagicValues.LifeMeaning, 42);
    Global.registerValue(MagicValues.DevilNumber, 666);
    
    class SomeComponent {
        @inject(MagicValues.LifeMeaning) lifeMeaning: number;
        @inject(MagicValues.DevilNumber) devilNumber: number;
    }

    // Create myContext inherited from Global
    let myContext = new DiContainer(Global);
    // My context will have only LifeMeaning, DevilNumber it will get from parent.
    myContext.register(MagicValues.LifeMeaning, 24);
    
    var obj = new SomeComponent();
    setDiContext(obj, myContext);


### Cahcing and cache update

Injected values are cached after first access. Cache is invalidates when you change something in container, or in some of the parent containers (for example, register new value).

    import {inject, Global, seDiContext} from "typedin";

    class SomeComponent {
        @inject(MagicValues.LifeMeaning) lifeMeaning: number;
    }
    var some = new SomeComponent();
    
    Global.registerValue(MagicValues.LifeMeaning, 42);
    console.info(some.lifeMeaning); // 42
    console.info(some.lifeMeaning); // 42 from cache
    // Next row change container, cache will be invalidated. 
    // Note, parent container change also invalidates a cache.
    Global.registerValue(MagicValues.LifeMeaning, 24); 
    console.info(some.lifeMeaning); // 24