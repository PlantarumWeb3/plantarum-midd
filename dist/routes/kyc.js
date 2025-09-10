"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ethers_1 = require("ethers");
const provider_js_1 = require("../utils/provider.js");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const router = (0, express_1.Router)();
// 📌 Cargar ABI
const abiPath = path_1.default.resolve("src/abi/PlantarumKyc.json");
const PlantarumKYC_ABI = JSON.parse(fs_1.default.readFileSync(abiPath, "utf-8"));
// Dirección del contrato desde .env
const KYC_ADDRESS = process.env.KYC_ADDRESS;
if (!KYC_ADDRESS) {
    throw new Error("⚠️ Falta KYC_ADDRESS en .env");
}
// Instancia contrato
const contract = new ethers_1.ethers.Contract(KYC_ADDRESS, PlantarumKYC_ABI, provider_js_1.provider);
// Healthcheck
router.get("/health", (_req, res) => {
    res.json({ ok: true, service: "kyc", ts: Date.now() });
});
// Consultar estado KYC
router.get("/:address", async (req, res) => {
    try {
        const user = req.params.address;
        const status = await contract.getKYCStatus(user);
        res.json({ ok: true, user, status });
    }
    catch (err) {
        console.error("❌ Error en /api/kyc/:address:", err);
        res.status(500).json({ ok: false, error: err.message });
    }
});
// Registrar KYC (simulado: frontend hace la transacción real)
router.post("/register", async (req, res) => {
    try {
        const { user, hashId } = req.body;
        if (!user || !hashId) {
            return res.status(400).json({ ok: false, error: "Faltan parámetros" });
        }
        res.json({ ok: true, user, hashId, note: "Frontend debe firmar registerKYC()" });
    }
    catch (err) {
        res.status(500).json({ ok: false, error: err.message });
    }
});
exports.default = router;
