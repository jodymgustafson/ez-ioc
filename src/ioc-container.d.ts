declare type FactoryFunction<T = object> = (...depends: object[]) => T;
declare type ConstructorFunction<T = object> = new (...depends: object[]) => T;
declare type IocIdentifier = string | symbol;
export declare type EzIocContainerConfig = {
    /** If true an error won't be thrown when trying to resolve unknown identifiers, will return undefined */
    allowUnbound?: boolean;
};
/**
 * Implements an IOC container
 */
export declare class EzIocContainer {
    readonly config: EzIocContainerConfig;
    private bindings;
    /**
     * Creates an instance
     * @param config Optional configuration
     */
    constructor(config?: EzIocContainerConfig);
    /**
     * Binds an identifier to a singleton instance
     * @param identifier Identifier for the binding
     * @param type Type (constructor) to bind the interface to
     * @param dependencies Optional list of dependencies to be injected into the constructor
     */
    bind<T extends object>(identifier: IocIdentifier, type: ConstructorFunction<T>, dependencies: IocIdentifier[]): EzIocContainer;
    /**
     * Binds an identifier to a singleton instance
     * @param identifier Identifier for the binding
     * @param type Type (constructor) to bind the interface to
     */
    bind<T extends object>(identifier: IocIdentifier, type: ConstructorFunction<T>): EzIocContainer;
    /**
     * Binds an identifier to a singleton instance
     * @param identifier Identifier for the binding
     * @param singleton Instance of an object to bind the interface to
     */
    bind<T extends object>(identifier: IocIdentifier, singleton: T): EzIocContainer;
    /**
     * Binds an identifier to a factory function
     * @param identifier Identifier for the binding
     * @param factoryFn A factory function that creates an instance of an object
     */
    bindFactory<T extends object>(identifier: IocIdentifier, factoryFn: FactoryFunction<T>, dependencies?: IocIdentifier[]): EzIocContainer;
    /** Gets an instance for an identifier as defined by bind() */
    resolve<T extends object>(identifier: IocIdentifier): T;
}
declare const iocContainer: EzIocContainer;
/** The default IOC container instance */
export default iocContainer;
