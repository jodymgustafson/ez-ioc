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
};

/**
 * Implements an IOC container
 */
 export class EzIocContainer {
    private bindings: Record<IocIdentifier, ConstructorFunction|IocFactory|object> = {};

    /**
     * Creates an instance
     * @param config Optional configuration
     */
    constructor(readonly config: EzIocContainerConfig = {}) {}

    /**
     * Binds an identifier to a singleton instance
     * @param identifier Identifier for the binding
     * @param type Type (constructor) to bind the interface to
     * @param dependencies Optional list of dependencies to be injected into the constructor
     */
    public bind<T extends object>(identifier: IocIdentifier, type: ConstructorFunction<T>, dependencies: IocIdentifier[]): EzIocContainer;
    /**
     * Binds an identifier to a singleton instance
     * @param identifier Identifier for the binding
     * @param type Type (constructor) to bind the interface to
     */
     public bind<T extends object>(identifier: IocIdentifier, type: ConstructorFunction<T>): EzIocContainer;
    /**
     * Binds an identifier to a singleton instance
     * @param identifier Identifier for the binding
     * @param singleton Instance of an object to bind the interface to
     */
    public bind<T extends object>(identifier: IocIdentifier, singleton: T): EzIocContainer;
    public bind<T extends object>(identifier: IocIdentifier, typeOrInstance: ConstructorFunction|T, dependencies?: IocIdentifier[]): EzIocContainer {
        if (dependencies && dependencies.length) {
            // Create a factory function that resolves the dependencies and calls the constructor
            const ctor = typeOrInstance as ConstructorFunction;
            return this.bindFactory(identifier, (...params: object[]) => {
                return new ctor(...params);
            }, dependencies);
        }

        // Create a regular binding
        this.bindings[identifier as any] = typeOrInstance;
        return this;
    }

    /**
     * Binds an identifier to a factory function
     * @param identifier Identifier for the binding
     * @param factoryFn A factory function that creates an instance of an object
     */
    public bindFactory<T extends object>(identifier: IocIdentifier, factoryFn: FactoryFunction<T>, dependencies?: IocIdentifier[]): EzIocContainer {
        this.bindings[identifier as any] = new IocFactory(factoryFn, dependencies);
        return this;
    }

    /** Gets an instance for an identifier as defined by bind() */
    public resolve<T extends object>(identifier: IocIdentifier): T {
        const c = this.bindings[identifier as any];
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

        const errMsg = `There is no binding for ${identifier.toString()}.`;
        throw Error(errMsg);
    }
}

// Create a default instance of the container
const iocContainer = new EzIocContainer();

/** The default IOC container instance */
export default iocContainer;