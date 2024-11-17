"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initConfig = void 0;
const database_1 = require("./database");
const initConfig = async () => {
    await (0, database_1.connectDatabase)();
};
exports.initConfig = initConfig;
//# sourceMappingURL=index.js.map