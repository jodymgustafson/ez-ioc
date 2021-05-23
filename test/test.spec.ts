import { EzIocContainer } from "..";

const TYPES = {
    Animal: Symbol.for("Animal"),
};

interface Animal {
    name: string;
}

class Lion implements Animal {
    name: "lion";
}

class Tiger implements Animal {
    name: "tiger";
}

class Bear implements Animal {
    name: "bear";
}

interface Zoo {
    name: string;
}

class MyZoo implements Zoo {
    constructor(readonly name: string, readonly animals: Animal[]) {}
}

describe("When resolve factory function", () => {
    it("should get the correct object", () => {
        const container = new EzIocContainer();
        container.bindFactory(TYPES.Animal, () => new Lion());
        expect(container.resolve(TYPES.Animal)).toBeInstanceOf(Lion);
    });
});
