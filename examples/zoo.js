"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("..");
const TYPES = {
    Animal: Symbol.for("Animal"),
    Zoo: Symbol.for("Zoo")
};
class Lion {
    constructor() {
        this.name = "lion";
    }
}
class Tiger {
    constructor() {
        this.name = "tiger";
    }
}
class Bear {
    constructor() {
        this.name = "bear";
    }
}
class MyZoo {
    constructor(...animals) {
        this.animals = animals;
    }
}
const container = new __1.EzIocContainer()
    // Bind a constructor
    .bind(TYPES.Animal, Lion)
    // Bind some singletons
    .bind("Tiger", new Tiger())
    .bind("Bear", new Bear())
    // Bind constructor with dependencies
    .bind(TYPES.Zoo, MyZoo, [TYPES.Animal, "Tiger", "Bear"])
    // Bind a factory function with dependencies
    .bindFactory("FactoryZoo", (lion, bear) => new MyZoo(lion, bear), [TYPES.Animal, "Bear"]);
// Get an instance bound to type Animal
const animal = container.resolve(TYPES.Animal);
console.log(animal);
// Get the bear singleton
const bear = container.resolve("Bear");
console.log(bear);
// Get an instance bound to type Zoo
const zoo = container.resolve(TYPES.Zoo);
console.log(zoo);
const zoo2 = container.resolve("FactoryZoo");
console.log(zoo2);
//# sourceMappingURL=zoo.js.map