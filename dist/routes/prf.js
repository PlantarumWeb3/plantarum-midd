"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const ipfsService_js_1 = require("../services/ipfsService.js");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const ethers_1 = require("ethers");
const provider_js_1 = require("../utils/provider.js");
const router = (0, express_1.Router)();
const upload = (0, multer_1.default)({ storage: multer_1.default.memoryStorage() });
// 📌 Cargar ABI
const abiPath = path_1.default.resolve("src/abi/PlantarumPrf.json");
const PlantarumPrfABI = JSON.parse(fs_1.default.readFileSync(abiPath, "utf-8"));
// Dirección del contrato (desde .env)
const PRF_ADDRESS = process.env.PRF_ADDRESS;
const contract = new ethers_1.ethers.Contract(PRF_ADDRESS, PlantarumPrfABI, provider_js_1.provider);
// 📌 Subida de documentos de auditoría
router.post("/submit", upload.array("files"), async (req, res) => {
    try {
        const { auditId, phase, descripcion } = req.body;
        const files = req.files;
        const pinnedFiles = [];
        for (const file of files) {
            const base64 = file.buffer.toString("base64");
            const result = await (0, ipfsService_js_1.pinBase64ToPinata)({
                filename: file.originalname,
                mimeType: file.mimetype,
                base64,
            });
            pinnedFiles.push({ name: file.originalname, IpfsHash: result.IpfsHash });
        }
        const metadata = {
            type: "audit-document",
            auditId,
            phase,
            descripcion,
            files: pinnedFiles,
            ts: Date.now(),
        };
        const result = await (0, ipfsService_js_1.pinJSONToPinata)(metadata);
        res.json({ ok: true, IpfsHash: result.IpfsHash, metadata });
    }
    catch (err) {
        console.error("❌ Error subiendo documento de auditoría:", err);
        res.status(500).json({ ok: false, error: "Error en middleware PRF" });
    }
});
// Healthcheck
router.get("/health", (_req, res) => {
    res.json({ ok: true, service: "prf", ts: Date.now() });
});
exports.default = router;
