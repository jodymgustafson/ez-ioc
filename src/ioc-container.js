"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/** Defines a factory function in the container */
class IocFactory {
    constructor(fn, deps = []) {
        this.fn = fn;
        this.deps = deps;
    }
}
/**
 * Implements an IOC container
 */
class EzIocContainer {
    /**
     * Creates an instance
     * @param config Optional configuration
     */
    constructor(config = {}) {
        this.config = config;
        this.bindings = {};
    }
    bind(identifier, typeOrInstance, dependencies) {
        if (dependencies && dependencies.length) {
            // Create a factory function that resolves the dependencies and calls the constructor
            const ctor = typeOrInstance;
            return this.bindFactory(identifier, (...params) => {
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
     * @param factoryFn A factory function that creates an instance of an object
     */
    bindFactory(identifier, factoryFn, dependencies) {
        this.bindings[identifier] = new IocFactory(factoryFn, dependencies);
        return this;
    }
    /** Gets an instance for an identifier as defined by bind() */
    resolve(identifier) {
        const c = this.bindings[identifier];
        if (c) {
            if (typeof c === "object") {
                if (c instanceof IocFactory) {
                    // Call factory function
                    const params = c.deps.map(d => this.resolve(d));
                    return c.fn(...params);
                }
                else {
                    // Return singleton
                    return c;
                }
            }
            else {
                // Create new instance of object th no dependencies
                return new c();
            }
        }
        if (this.config.allowUnbound) {
            return undefined;
        }
        const errMsg = `There is no binding for ${identifier.toString()}.`;
        throw Error(errMsg);
    }
}
exports.EzIocContainer = EzIocContainer;
// Create a default instance of the container
const iocContainer = new EzIocContainer();
/** The default IOC container instance */
exports.default = iocContainer;
//# sourceMappingURL=ioc-container.js.map