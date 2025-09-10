"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.provider = void 0;
//src/utils/providers.ts
const ethers_1 = require("ethers");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config(); // 👈 asegura que RPC_URL esté cargado
const RPC_URL = process.env.RPC_URL;
if (!RPC_URL) {
    throw new Error("⚠️ Falta RPC_URL en .env");
}
exports.provider = new ethers_1.JsonRpcProvider(RPC_URL);
