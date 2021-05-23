"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const ioc_container_1 = __importStar(require("./src/ioc-container"));
exports.EzIocContainer = ioc_container_1.EzIocContainer;
exports.default = {
    iocContainer: ioc_container_1.default
};
//# sourceMappingURL=index.js.map