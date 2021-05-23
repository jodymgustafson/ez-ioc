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

class TestZoo implements Zoo {
    animals: Animal[];
    constructor(...animals: Animal[]) {
        this.animals = animals;
    }
}

class ZooCollection {
    constructor(readonly zoo1: Zoo, readonly zoo2: Zoo) {}
}

describe("When resolve factory function", () => {
    it("should get the correct object", () => {
        const fn = (): Animal => ({ name: "monkey" });
        const container = new EzIocContainer().bindFactory<Animal>(TYPES.Animal, fn);
        expect(container.resolve(TYPES.Animal)).toEqual({ name: "monkey" });
    });
});

describe("When resolve factory function with dependencies", () => {
    it("should get the correct object", () => {
        const fn = (lion: Animal, bear: Animal) => new TestZoo(lion, bear);
        const container = new EzIocContainer()
            .bindFactory<Zoo>(TYPES.Zoo, fn, [TYPES.Animal, "Bear"])
            .bind<Animal>("Bear", Bear)
            .bind<Animal>(TYPES.Animal, Lion);
            
        const zoo: Zoo = container.resolve(TYPES.Zoo);
        expect(zoo).toBeInstanceOf(TestZoo);
        expect(JSON.stringify(zoo.animals)).toBe(`[{"name":"lion"},{"name":"bear"}]`);
    });
});

describe("When resolve constructor", () => {
    it("should get the correct object", () => {
        const container = new EzIocContainer().bind(TYPES.Animal, Lion);
        expect(container.resolve(TYPES.Animal)).toBeInstanceOf(Lion);
    });
});

describe("When resolve constructor with dependencies", () => {
    it("should get the correct objects", () => {
        const container = new EzIocContainer()
            .bind(TYPES.Animal, Lion)
            .bind("Bear", Bear)
            .bind(TYPES.Zoo, TestZoo, [TYPES.Animal, "Bear"]);
        
        const zoo: Zoo = container.resolve(TYPES.Zoo);
        expect(zoo).toBeInstanceOf(TestZoo);
        expect(JSON.stringify(zoo.animals)).toBe(`[{"name":"lion"},{"name":"bear"}]`);
    });
});

describe("When resolve singleton", () => {
    it("should get the correct object", () => {
        const bear = new Bear();
        const container = new EzIocContainer().bind("Bear", bear);
        const animal: Animal = container.resolve("Bear");
        expect(animal === bear).toBe(true);
    });
});

describe("When resolve constructor with deep dependencies", () => {
    it("should get the correct objects", () => {
        const container = new EzIocContainer()
            .bind(TYPES.Animal, Lion)
            .bind("Bear", Bear)
            .bind("Tiger", new Tiger())
            .bind(TYPES.Zoo, TestZoo, [TYPES.Animal, "Bear"])
            .bind("OtherZoo", TestZoo, ["Tiger", "Bear"])
            .bind("ZooCollection", ZooCollection, [TYPES.Zoo, "OtherZoo"]);
        
        const collection: ZooCollection = container.resolve("ZooCollection");
        expect(collection).toBeInstanceOf(ZooCollection);
        expect(JSON.stringify(collection.zoo1)).toBe(`{"animals":[{"name":"lion"},{"name":"bear"}]}`);
        expect(JSON.stringify(collection.zoo2)).toBe(`{"animals":[{"name":"tiger"},{"name":"bear"}]}`);
    });
});

describe("When resolve unknown identifier", () => {
    it("should throw an error", () => {
        const container = new EzIocContainer();
        expect(() => container.resolve("Foo")).toThrowError("");
    });
});

describe("When resolve unknown identifier with allowUnbound", () => {
    it("should not throw an error", () => {
        const container = new EzIocContainer({ allowUnbound: true });
        expect(container.resolve("Foo")).toBeUndefined();
    });
});
