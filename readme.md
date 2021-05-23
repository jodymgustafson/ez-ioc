# EZ-IOC

EZ-IOC is yet another dependency-injection/inversion-of-control package. It is super simple to configure and use. It doesn't use experimental decorators. It has TypeScript definition files included.

## Features

An IOC container is used to bind an instance of an object to an interface or an identifier. It also allows you to inject dependencies into object constructors. This allows you to easily replace implementations depending on the circumstances. This is especially helpful for using mocks in unit tests.

- Bind names or symbols to
  - Constructor functions
  - Factory functions
  - Singleton object instances
- Define constructor dependencies
  - Dependency injection in deep object hierarchies

## But why?

Cause I didn't like any other IOC packages out there. None of them seemed either simple enough or did what I needed so I made my own. Plus most of them have horrible documentation, which I hope is not the case here. (I mean why create a public package if you're not going to tell people how to use it?)

## Install

`npm i ez-ioc`

## How to Use

1. Create or use the default IOC container
2. Define your bindings in the container
3. Resolve your bindings to get instances of objects

### Quick Example

Here is a Typescript example:

```
interface Animal{...}
class Lion implements Animal{...}
class Bear implements Animal{...}
interface Zoo{...}
class MyZoo implements Zoo{...}

import iocContainer from "ez-ioc";
// Bind Lion class to Animal interface
iocContainer.bind("Animal", Lion)
    // Bind "Bear" to a single instance of Bear
    .bind("Bear", new Bear())
    // Bind MyZoo class to Zoo interface and pass in resolved Animals to the constructor
    .bind("Zoo", MyZoo, [TYPES.Animal, "Bear"]);

// Get a Zoo instance with a Lion and Bear
const zoo: Zoo = container.resolve("Zoo");
```

## Documentation

### Get a Container

You can either create a container or use the default one. The advantage of using the default is that you can access it anywhere.

    import iocContainer from "ez-ioc";

or

    const iocContainer = require("ez-ioc");

or create one

    const myContainer = new EzIocContainer();

### Define Bindings

There are a number of different bindings you can create.

- Bind to a single instance of an object
- Bind to a constructor function
- Bind to a factory function

In all cases you bind a name to an implementation. The name can be a `string` or a `Symbol`.

There are two bind methods:
- bind
- bindFactory

### Bind to Singleton

The simplest binding is binding to an instance of an object. Use the `bind()` method for this.

    iocContainer.bind("Foo", new Bar());

### Bind to Constructor

To create a transient instance of your class also use `bind()`.

    iocContainer.bind("Foo", Bar);

