"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const app_1 = __importDefault(require("./app"));
const routes_1 = __importDefault(require("./routes"));
const router = (0, express_1.Router)();
app_1.default.use("/api/v1", routes_1.default);
const PORT = process.env.PORT || 5000;
app_1.default.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
