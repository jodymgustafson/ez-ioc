# EZ-IOC

EZ-IOC is yet another dependency-injection/inversion-of-control package. It is super simple to configure and use, extremely lightweight, has no dependencies and doesn't use experimental decorators. And TypeScript definition files are included.

## Features

An IOC container is used to bind an instance of an object to an interface or an identifier. It also allows you to inject dependencies into object constructors. This lets you to easily change implementations depending on the circumstances. Which is especially helpful for using mocks in unit tests.

- Bind names or symbols to
  - Constructor functions
  - Factory functions
  - Singleton object instances
- Define constructor dependencies
  - Dependency injection in deep object hierarchies

## Install

`npm i ez-ioc`

## How to Use

1. Create your own, or use the default IOC container
2. Define your bindings in the container
3. Resolve your bindings to get instances of objects

### Quick Example

Here is a simple Typescript example:

```typescript
interface Animal{...}
class Lion implements Animal{...}
class Bear implements Animal{...}
interface Zoo{...}
class MyZoo implements Zoo {
    constructor(animal1: Animal, animal2: Animal) {...}
}

import iocContainer from "ez-ioc";

// Bind Lion class to Animal interface
iocContainer.bind("Animal", Lion)
    // Bind "Bear" to a single instance of Bear
    .bind("Bear", new Bear())
    // Bind MyZoo class to Zoo interface and pass in resolved Animals to the constructor
    .bind("Zoo", MyZoo, ["Animal", "Bear"]);

// Get a Zoo instance with a Lion and Bear
const zoo: Zoo = container.resolve("Zoo");
```

## Documentation

This package contains one class: EzIocContainer.

### Get a Container

You can either create a container or use the default one. The advantage of using the default is that you can access it anywhere.

```typescript
import iocContainer from "ez-ioc";
```

or

```typescript
const iocContainer = require("ez-ioc");
```

Or create your own:

```typescript
import {EzIocContainer} from "ez-ioc";
const myContainer = new EzIocContainer();
```

### Configuration

The constructor can take a configuration object change certain functionality.

By default if you try to resolve an identifier that doesn't exist in your container it will throw an error. To override that behavior pass in a config object with `allowUnbound` set to true. In that case it will return `undefined` rather than throw an error.

By default if you try to bind to an identifier that has already been bound it will throw an error. To override that behavior pass in a config object with `allowRebind` set to true.

```typescript
const myContainer = new EzIocContainer({
    allowUnbound: true,
    allowRebind: true    
});
```

### Define Bindings

There are a number of different bindings you can create.

- Bind to an instance of an object (singleton)
- Bind to a constructor function
- Bind to a factory function

In all cases you bind an identifier to an implementation. The identifier can be a `string` or a `Symbol`.

There are four bind methods:
- bind()
- bindFactory()
- bindLazy()
- bindFactoryLazy()

### Bind to Singleton

The simplest bind is binding to an instance of an object. Use the `bind()` method for this.

```typescript
iocContainer.bind("Bear", new Bear());
```

Every time "Bear" is resolved it will return the same object.

### Bind to Constructor

To bind to a object/class constructor also use the `bind()` method. This will create a new instance every time you resolve it.

```typescript
iocContainer.bind("Animal", Lion);
```

If the constructor takes other dependencies as parameters you can define those as a third parameter which is an array of identifiers. The container will resolve those dependencies and inject them into the constructor in the order listed. If those dependencies also have dependencies they will be resolved too, all the way down the object hierarchy.

```typescript
class MyZoo implements Zoo {
    constructor(readonly ...animals: Animal[]) {}
}
iocContainer.bind("Zoo", Zoo, ["Animal", "Bear"]);
```

### Bind to Factory Function

You may also bind a factory function. A factory function is a function that creates an object. It works almost identically to binding a constructor except it uses the `bindFactory()` method. Note that the list of dependencies is optional.

```typescript
const func = (a1, a2) => ({ animals: [a1, a2] });
iocContainer.bindFactory("Zoo", func, ["Animal", "Bear"]);
```

In this case the factory function will be called with the objects that "Animal" and "Bear" resolve to.

### Lazy Load Bindings

Sometimes you may have an instance of an object that you want to create bindings for but are not sure that they will be used. In that case you can use lazy load bindings to bind a constructor or factory function. The first time the binding is resolved an object instance will be created and cached. Subsequent resolves will then use the cached instance.

Just use the `bindLazy` or `bindFactoryLazy` methods which take the same parameters as their non-lazy counterparts.

```typescript
iocContainer.bindLazy("Zoo", Zoo, ["Animal", "Bear"]);

const func = (a1, a2) => ({ animals: [a1, a2] });
iocContainer.bindFactoryLazy("Zoo", func, ["Animal", "Bear"]);
```

### Resolve Bindings

Use the `resolve()` method to resolve bindings. It works the same no matter which kind of binding you've created.

```typescript
const zoo: Zoo = iocContainer.resolve("Zoo");
```

### Async Bindings

You may have to bind a factory function that does some async work. In that case you will need to add `async` to the function definition and `await` to return a promise.

```typescript
iocContained.bindFactory("MyService", async () => await getMyService());
```

Then when you resolve it you can use `await` to resolve the promise.

```typescript
const svc: MyService = await iocContainer.resolve("MyService");
```

### Using Symbols

If desired you can use Symbols instead of strings for bind identifiers. You might even build a set of identifiers and use them throughout your code to make sure you don't make mistakes. Usually you would use your type's name for the symbol name.

```typescript
const TYPES = {
    Animal: Symbol.for("Animal"),
    Zoo: Symbol.for("Zoo")
};

iocContainer.bind(TYPES.Animal, Lion);
const animal = iocContainer.resolve(TYPES.Animal);
```

## More Examples

For more examples visit the GitHub repo and look at the `/examples` folder or unit tests in the `/spec` folder.

https://github.com/jodymgustafson/ez-ioc

## Code Hard