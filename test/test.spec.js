"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("..");
const TYPES = {
    Animal: Symbol.for("Animal"),
};
class Lion {
}
class Tiger {
}
class Bear {
}
class MyZoo {
    constructor(name, animals) {
        this.name = name;
        this.animals = animals;
    }
}
describe("When resolve factory function", () => {
    it("should get the correct object", () => {
        const container = new __1.EzIocContainer();
        container.bindFactory(TYPES.Animal, () => new Lion());
        expect(container.resolve(TYPES.Animal)).toBeInstanceOf(Lion);
    });
});
//# sourceMappingURL=test.spec.js.map