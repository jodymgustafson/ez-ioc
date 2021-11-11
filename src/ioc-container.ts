type FactoryFunction<T=object> = (...depends: any[]) => T;
type ConstructorFunction<T=object> = new (...depends: any[]) => T;
type IocIdentifier = string|symbol;

/** Defines a factory function in the container */
class IocFactory {
    constructor(readonly fn: FactoryFunction, readonly deps: IocIdentifier[] = []) {}
}

export type EzIocContainerConfig = {
    /** If true an error won't be thrown when trying to resolve unknown identifiers, will return undefined */
    allowUnbound?: boolean;
    /** If true an error won't be thrown when trying to bind to an identifier that is already being used */
    allowRebind?: boolean
};

let defaultConfig: EzIocContainerConfig = {};

/**
 * Sets the default config to be used when creating an EzIocContainer.
 * Will not affect the default container.
 * @param config An EzIocContainerConfig
 */
export function setDefaultConfig(config: EzIocContainerConfig): void {
    defaultConfig = config;
}

/**
 * Implements an IOC container
 */
 export class EzIocContainer {
    private readonly bindings: Record<IocIdentifier, ConstructorFunction|IocFactory|object> = {};

    /**
     * Creates an instance
     * @param config Optional configuration
     */
    constructor(readonly config: EzIocContainerConfig = defaultConfig) {}

    /**
     * Binds an identifier to a constructor (with dependencies) that will be used to create an object every time it is resolved
     * @param identifier Identifier for the binding
     * @param type Type (constructor) to bind the interface to
     * @param dependencies List of dependencies to be injected into the constructor
     * @throws If the identifier is already being used, unless allowRebind is true in configuration
     */
    bind<T extends object>(identifier: IocIdentifier, type: ConstructorFunction<T>, dependencies: IocIdentifier[]): EzIocContainer;
    /**
     * Binds an identifier to a constructor that will be used to create an object every time it is resolved
     * @param identifier Identifier for the binding
     * @param type Type (constructor) to bind the interface to
     * @throws If the identifier is already being used, unless allowRebind is true in configuration
     */
     bind<T extends object>(identifier: IocIdentifier, type: ConstructorFunction<T>): EzIocContainer;
    /**
     * Binds an identifier to a singleton instance
     * @param identifier Identifier for the binding
     * @param singleton Instance of an object to bind the interface to
     * @throws If the identifier is already being used, unless allowRebind is true in configuration
     */
    bind<T extends object>(identifier: IocIdentifier, singleton: T): EzIocContainer;
    bind<T extends object>(identifier: IocIdentifier, typeOrInstance: ConstructorFunction|T, dependencies?: IocIdentifier[]): EzIocContainer {
        if (!this.config.allowRebind && this.bindings[identifier]) {
            throw new Error("Identifier is already bound: " + identifier.toString());
        }

        if (dependencies && dependencies.length) {
            // Create a factory function that resolves the dependencies and calls the constructor
            const ctor = typeOrInstance as ConstructorFunction;
            return this.bindFactory(identifier, (...params: object[]) => {
                return new ctor(...params);
            }, dependencies);
        }

        // Create a regular binding
        this.bindings[identifier] = typeOrInstance;
        return this;
    }

    /**
     * Binds an identifier to a factory function
     * @param identifier Identifier for the binding
     * @param factoryFn A factory function that creates an object
     * @param dependencies Optional list of dependencies to be passed into the function
     */
    bindFactory<T extends object>(identifier: IocIdentifier, factoryFn: FactoryFunction<T>, dependencies?: IocIdentifier[]): EzIocContainer {
        this.bindings[identifier] = new IocFactory(factoryFn, dependencies);
        return this;
    }

    /**
     * Binds an identifier to a constructor that will be used to create a singleton object the first time it is resolved
     * @param identifier Identifier for the binding
     * @param type Type (constructor) to bind the interface to
     * @param dependencies Optional list of dependencies to be injected into the constructor
     */
     bindLazy<T extends object>(identifier: IocIdentifier, type: ConstructorFunction<T>, dependencies?: IocIdentifier[]): EzIocContainer {
        let instance: T;
        this.bindFactory(identifier, (...deps) => instance ?? (instance = new type(...deps)), dependencies);
        return this;
    }

    /**
     * Binds an identifier to a factory function that will be used to create a singleton object the first time it is resolved
     * @param identifier Identifier for the binding
     * @param factoryFn A factory function that creates an object
     * @param dependencies Optional list of dependencies to be passed into the function
     */
     bindFactoryLazy<T extends object>(identifier: IocIdentifier, factoryFn: FactoryFunction<T>, dependencies?: IocIdentifier[]): EzIocContainer {
        let instance: T;
        this.bindFactory(identifier, (...deps) => instance ?? (instance = factoryFn(...deps)), dependencies);
        return this;
    }

    /**
     * Gets an instance for an identifier as defined by bind() 
     * @param identifier Identifier of the binding
     * @throws If the binding doesn't exist, unless allowUnbound is true in configuration
     */
    resolve<T extends object>(identifier: IocIdentifier): T {
        const c = this.bindings[identifier];
        if (c) {
            if (typeof c === "object") {
                if (c instanceof IocFactory) {
                    // Call factory function
                    const params = c.deps.map(d => this.resolve(d));
                    return c.fn(...params) as T;
                }
                else {
                    // Return singleton
                    return c as T;
                }
            }
            else {
                // Create new instance of object th no dependencies
                return new (c as ConstructorFunction)() as T;
            }
        }

        if (this.config.allowUnbound) {
            return undefined;
        }

        throw Error("There is no binding for " + identifier.toString());
    }
}

// Create a default instance of the container
const iocContainer = new EzIocContainer();

/** The default IOC container instance */
export default iocContainer;