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
        expect(container.resolve<Animal>(TYPES.Animal)).toEqual({ name: "monkey" });
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

describe("When lazy resolve constructor", () => {
    const container = new EzIocContainer();
    beforeAll(() => {
        container.lazyBind(TYPES.Animal, Lion);
    });
    it("should get the correct object", () => {
        const animal = container.resolve(TYPES.Animal);
        expect(animal).toBeInstanceOf(Lion);
        // should get the same instance again
        expect(container.resolve(TYPES.Animal)).toBe(animal);
    });
});

describe("When lazy resolve constructor with dependencies", () => {
    const container = new EzIocContainer();
    let zoo: Zoo;
    beforeAll(() => {
        container.bind(TYPES.Animal, Lion)
            .lazyBind("Bear", Bear)
            .lazyBind(TYPES.Zoo, TestZoo, [TYPES.Animal, "Bear"]);
        zoo = container.resolve(TYPES.Zoo);
    });
    it("should get the correct objects", () => {
        expect(zoo).toBeInstanceOf(TestZoo);
        expect(JSON.stringify(zoo.animals)).toBe(`[{"name":"lion"},{"name":"bear"}]`);
        // should get the same instance again
        expect(container.resolve(TYPES.Zoo)).toBe(zoo);
    });
    it("should get the same lazy loaded bear", () => {
        expect(container.resolve("Bear")).toBe(zoo.animals[1]);
        // but the lion should be different
        expect(container.resolve(TYPES.Animal) !== zoo.animals[0]).toBeTrue();
    });
});

describe("When lazy resolve factory function", () => {
    const container = new EzIocContainer();
    let count = 0;
    let animal: Animal;
    beforeAll(() => {
        const fn = (): Animal => {
            count++;
            return { name: "monkey" };
        };
        container.lazyBindFactory<Animal>(TYPES.Animal, fn);
        animal = container.resolve<Animal>(TYPES.Animal);
    });
    it("should get the correct object", () => {
        expect(animal).toEqual({ name: "monkey" });
        // should get the same instance again
        expect(container.resolve(TYPES.Animal)).toBe(animal);
    });
    it("should get called once", () => {
        expect(count).toBe(1);
    });
});

describe("When lazy resolve factory function with dependencies", () => {
    const container = new EzIocContainer();
    let count = 0;
    let zoo: Zoo;
    beforeAll(() => {
        const fn = (lion: Animal, bear: Animal) => {
            count++;
            return new TestZoo(lion, bear);
        }
        container.lazyBindFactory<Zoo>(TYPES.Zoo, fn, [TYPES.Animal, "Bear"])
            .lazyBind<Animal>("Bear", Bear)
            .bind<Animal>(TYPES.Animal, Lion);        
        zoo = container.resolve(TYPES.Zoo);
    });
    it("should get the correct object", () => {
        expect(zoo).toBeInstanceOf(TestZoo);
        expect(JSON.stringify(zoo.animals)).toBe(`[{"name":"lion"},{"name":"bear"}]`);
        // should get the same instance again
        expect(container.resolve(TYPES.Zoo)).toBe(zoo);
    });
    it("should get called once", () => {
        expect(count).toBe(1);
    });
    it("should get the same lazy loaded bear", () => {
        expect(container.resolve("Bear")).toBe(zoo.animals[1]);
        // but the lion should be different
        expect(container.resolve(TYPES.Animal) !== zoo.animals[0]).toBeTrue();
    });
});

// Configuration ///////////////////////////////////////

describe("When resolve unknown identifier", () => {
    it("should throw an error", () => {
        const container = new EzIocContainer();
        expect(() => container.resolve("Foo")).toThrowError("There is no binding for Foo");
    });
});

describe("When resolve unknown identifier with allowUnbound", () => {
    it("should not throw an error", () => {
        const container = new EzIocContainer({ allowUnbound: true });
        expect(container.resolve("Foo")).toBeUndefined();
    });
});

describe("When rebind existing identifier", () => {
    it("should throw an error", () => {
        const container = new EzIocContainer();
        container.bind("Foo", {});
        expect(() => container.bind("Foo", {})).toThrowError("Identifier is already bound: Foo");
    });
});

describe("When rebind existing identifier with allowRebind", () => {
    it("should not throw an error", () => {
        const container = new EzIocContainer({ allowRebind: true });
        container.bind("Foo", {});
        expect(container.bind("Foo", {})).toBe(container);
    });
});
