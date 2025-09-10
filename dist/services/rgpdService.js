"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.storePersonalData = storePersonalData;
exports.getPersonalData = getPersonalData;
exports.deletePersonalData = deletePersonalData;
// src/services/rgpdService.ts
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const crypto_1 = __importDefault(require("crypto"));
const STORAGE_PATH = path_1.default.join(process.cwd(), "src", "storage", "rgpd");
// Asegura que la carpeta exista
if (!fs_1.default.existsSync(STORAGE_PATH)) {
    fs_1.default.mkdirSync(STORAGE_PATH, { recursive: true });
}
/**
 * 🔹 Genera un hash único con salt
 */
function generateHash(data, salt) {
    return crypto_1.default.createHash("sha256").update(data + salt).digest("hex");
}
/**
 * 🔹 Guardar datos personales off-chain (con hash en blockchain)
 */
function storePersonalData(data) {
    const salt = crypto_1.default.randomBytes(16).toString("hex"); // clave secreta
    const hashId = generateHash(JSON.stringify(data), salt);
    const filePath = path_1.default.join(STORAGE_PATH, `${hashId}.json`);
    const payload = {
        salt,
        data,
        createdAt: new Date().toISOString(),
    };
    fs_1.default.writeFileSync(filePath, JSON.stringify(payload, null, 2));
    return { hashId, filePath };
}
/**
 * 🔹 Obtener datos personales por hashId
 */
function getPersonalData(hashId) {
    const filePath = path_1.default.join(STORAGE_PATH, `${hashId}.json`);
    if (!fs_1.default.existsSync(filePath)) {
        return null;
    }
    const content = fs_1.default.readFileSync(filePath, "utf-8");
    return JSON.parse(content);
}
/**
 * 🔹 Borrar datos personales (ejercicio de derecho al olvido)
 */
function deletePersonalData(hashId) {
    const filePath = path_1.default.join(STORAGE_PATH, `${hashId}.json`);
    if (!fs_1.default.existsSync(filePath)) {
        return false;
    }
    // 🚨 Destruimos la sal para que el hash quede "huérfano"
    const payload = JSON.parse(fs_1.default.readFileSync(filePath, "utf-8"));
    payload.salt = null;
    payload.data = null;
    payload.deletedAt = new Date().toISOString();
    fs_1.default.writeFileSync(filePath, JSON.stringify(payload, null, 2));
    return true;
}
