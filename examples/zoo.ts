import { EzIocContainer } from "..";

const TYPES = {
    Animal: Symbol.for("Animal"),
    Zoo: Symbol.for("Zoo")
};

interface Animal {
    name: string;
}

class Lion implements Animal {
    name: string = "lion";
}

class Tiger implements Animal {
    name: string = "tiger";
}

class Bear implements Animal {
    name: string = "bear";
}

interface Zoo {
    animals: Animal[];
}

class MyZoo implements Zoo {
    animals: Animal[];
    constructor(...animals: Animal[]) {
        this.animals = animals;
    }
}

const container = new EzIocContainer()
    // Bind a constructor
    .bind(TYPES.Animal, Lion)
    // Bind some singletons
    .bind("Tiger", new Tiger())
    .bind("Bear", new Bear())
    // Bind constructor with dependencies
    .bind(TYPES.Zoo, MyZoo, [TYPES.Animal, "Tiger", "Bear"])
    // Bind a factory function with dependencies
    .bindFactory("FactoryZoo", (lion: Animal, bear: Animal) => new MyZoo(lion, bear), [TYPES.Animal, "Bear"]);

// Get an instance bound to type Animal
const animal: Animal = container.resolve(TYPES.Animal);
console.log(animal);

// Get the bear singleton
const bear: Animal = container.resolve("Bear");
console.log(bear);

// Get an instance bound to type Zoo
const zoo: Zoo = container.resolve(TYPES.Zoo);
console.log(zoo);

const zoo2: Zoo = container.resolve("FactoryZoo");
console.log(zoo2);
