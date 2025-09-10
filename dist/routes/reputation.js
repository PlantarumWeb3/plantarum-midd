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
const router = (0, express_1.Router)();
// 📌 Cargar ABI
const abiPath = path_1.default.resolve("src/abi/PlantarumReputation.json");
const ReputationABI = JSON.parse(fs_1.default.readFileSync(abiPath, "utf-8"));
// Dirección del contrato desde .env
const REPUTATION_ADDRESS = process.env.REPUTATION_ADDRESS;
const contract = new ethers_1.ethers.Contract(REPUTATION_ADDRESS, ReputationABI, provider_js_1.provider);
// ----------------------
// GET reputación simple
// ----------------------
router.get("/get/:user", async (req, res) => {
    try {
        const { user } = req.params;
        const reputation = await contract.getReputation(user);
        res.json({ ok: true, reputation: reputation.toString() });
    }
    catch (err) {
        res.status(500).json({ ok: false, error: err.message });
    }
});
// Healthcheck
router.get("/health", (_req, res) => {
    res.json({ ok: true, service: "reputation", ts: Date.now() });
});
exports.default = router;
