# typedin
Simple yet powerful dependency injection library for TypeScript


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

2) Create dependency container and register service in it.

        import { DiContainer } from "typedin";

        var GlobalContainer = new DiContainer();
        GlobalContainer.registerService(ILogService, new ConsoleLogService());
        var fromGlobal = () => GlobalContainer;

3) Declare property with decorator `@inject` to get service from container. 

        import {inject} from "typedin";

        class SomeComponent {
            @inject(fromGlobal) logService: ILogService;

		    foo() {
			    this.logService.log("Hello there");
		    }
        }


### More usage examples

#### Associate container with object

You can provide own dynamic logic to determine what container to use. Just implement 'IHaveContext' and send `fromSelf` value to the first parameter of `inject`.

    import {inject, fromSelf, DiContainer IHaveContext} from "typedin";

    class SomeComponent implements IHaveContext {
        // fromSelf - use this.getDiContext method to receive context.
        @inject(fromSelf) logService: ILogService;
        
        constructor(private context: DiContainer) {
        }        
        getDiContext() {
            return this.context;
        }
    }

Another way (the same in internals), but without implementing `IHaveContext`. Just use `setDiContext`:

    import {inject, fromSelf, DiContainer, setDiContext} from "typedin";

    class SomeComponent {
        @inject(fromSelf) logService: ILogService;
        
        constructor(context?: DiContainer) {
            setDiContext(this, context);
        }
    }
    // Or from external
    var someComponent = new SomeComponent();
    setDiContext(someComponent, GlobalContainer);
    

#### Injecting values

You can inject any values as well as a services. Key can be any object, that comparable via '==' operator. 

    import {inject, DiContainer} from "typedin";

    enum MagicValues {
        LifeMeaning
    }

    var GlobalContainer = new DiContainer();
    GlobalContext.registerValue(MagicValues.LifeMeaning, 42);
    var fromGlobal = () => GlobalContainer;

    
    class SomeComponent {
        @inject(fromGlobal, MagicValues.LifeMeaning) lifeMeaning: number;
    }


#### Inheritance of the containers

Containers can be inherited one from another. If container not found value, it will continue search in parent container. In example we override `LifeMeaning` value in derived container, but `DevilNumber` will be received from parent.


    import {inject, DiContainer, fromSelf, seDiContext} from "typedin";

    enum MagicValues {
        LifeMeaning,
        DevilNumber
    }

    var GlobalContainer = new DiContainer();
    GlobalContext.registerValue(MagicValues.LifeMeaning, 42);
    GlobalContext.registerValue(MagicValues.DevilNumber, 666);
    var fromGlobal = () => GlobalContainer;

    
    class SomeComponent {
        @inject(fromSelf, MagicValues.LifeMeaning) lifeMeaning: number;
        @inject(fromSelf, MagicValues.DevilNumber) devilNumber: number;

        constructor() {
            let myContext = new DiContainer(GlobalContext);
            myContext.register(MagicValues.LifeMeaning, 24);
            setDiContext(this, myContext);
        }
    }


#### Cahcing and cache update

Injected values are cached after first access. Cache is invalidates when you change something in container, or in some of the parent containers (for example, register new value).

