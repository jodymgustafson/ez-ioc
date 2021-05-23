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
class TestZoo {
    constructor(...animals) {
        this.animals = animals;
    }
}
class ZooCollection {
    constructor(zoo1, zoo2) {
        this.zoo1 = zoo1;
        this.zoo2 = zoo2;
    }
}
describe("When resolve factory function", () => {
    it("should get the correct object", () => {
        const container = new __1.EzIocContainer().bindFactory(TYPES.Animal, () => new Lion());
        expect(container.resolve(TYPES.Animal)).toBeInstanceOf(Lion);
    });
});
describe("When resolve factory function with dependencies", () => {
    it("should get the correct object", () => {
        const fn = (lion, bear) => new TestZoo(lion, bear);
        const container = new __1.EzIocContainer()
            .bindFactory(TYPES.Zoo, fn, [TYPES.Animal, "Bear"])
            .bind("Bear", Bear)
            .bind(TYPES.Animal, Lion);
        const zoo = container.resolve(TYPES.Zoo);
        expect(zoo).toBeInstanceOf(TestZoo);
        expect(JSON.stringify(zoo.animals)).toBe(`[{"name":"lion"},{"name":"bear"}]`);
    });
});
describe("When resolve constructor", () => {
    it("should get the correct object", () => {
        const container = new __1.EzIocContainer().bind(TYPES.Animal, Lion);
        expect(container.resolve(TYPES.Animal)).toBeInstanceOf(Lion);
    });
});
describe("When resolve constructor with dependencies", () => {
    it("should get the correct object", () => {
        const container = new __1.EzIocContainer()
            .bind(TYPES.Animal, Lion)
            .bind("Bear", Bear)
            .bind(TYPES.Zoo, TestZoo, [TYPES.Animal, "Bear"]);
        const zoo = container.resolve(TYPES.Zoo);
        expect(zoo).toBeInstanceOf(TestZoo);
        expect(JSON.stringify(zoo.animals)).toBe(`[{"name":"lion"},{"name":"bear"}]`);
    });
});
describe("When resolve singleton", () => {
    it("should get the correct object", () => {
        const bear = new Bear();
        const container = new __1.EzIocContainer().bind("Bear", bear);
        const animal = container.resolve("Bear");
        expect(animal === bear).toBe(true);
    });
});
describe("When resolve constructor with deep dependencies", () => {
    it("should get the correct object", () => {
        const container = new __1.EzIocContainer()
            .bind(TYPES.Animal, Lion)
            .bind("Bear", Bear)
            .bind("Tiger", new Tiger())
            .bind(TYPES.Zoo, TestZoo, [TYPES.Animal, "Bear"])
            .bind("OtherZoo", TestZoo, ["Tiger", "Bear"])
            .bind("ZooCollection", ZooCollection, [TYPES.Zoo, "OtherZoo"]);
        const collection = container.resolve("ZooCollection");
        expect(collection).toBeInstanceOf(ZooCollection);
        expect(JSON.stringify(collection.zoo1)).toBe(`{"animals":[{"name":"lion"},{"name":"bear"}]}`);
        expect(JSON.stringify(collection.zoo2)).toBe(`{"animals":[{"name":"tiger"},{"name":"bear"}]}`);
    });
});
//# sourceMappingURL=test.spec.js.map