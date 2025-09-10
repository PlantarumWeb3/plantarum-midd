"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/token.ts
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const ipfsService_js_1 = require("../services/ipfsService.js");
const router = (0, express_1.Router)();
const upload = (0, multer_1.default)({ storage: multer_1.default.memoryStorage() });
/**
 * 🔹 POST /token/json
 * Recibe metadata JSON de tokenización y lo guarda en IPFS
 */
router.post("/json", async (req, res) => {
    try {
        const { data } = req.body;
        if (!data) {
            return res.status(400).json({ ok: false, error: "Falta metadata JSON" });
        }
        const result = await (0, ipfsService_js_1.pinJSONToPinata)(data);
        res.json({
            ok: true,
            IpfsHash: result.IpfsHash,
            PinSize: result.PinSize,
            Timestamp: result.Timestamp,
        });
    }
    catch (err) {
        console.error("❌ Error en /token/json:", err);
        res.status(500).json({ ok: false, error: err.message });
    }
});
/**
 * 🔹 POST /token/file
 * Recibe archivo (imagen/pdf) y lo guarda en IPFS
 */
router.post("/file", upload.single("file"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ ok: false, error: "No se subió ningún archivo" });
        }
        // Convertimos a base64 para reutilizar pinBase64ToPinata
        const base64 = req.file.buffer.toString("base64");
        const result = await (0, ipfsService_js_1.pinBase64ToPinata)({
            filename: req.file.originalname,
            mimeType: req.file.mimetype,
            base64,
        });
        res.json({
            ok: true,
            IpfsHash: result.IpfsHash,
            PinSize: result.PinSize,
            Timestamp: result.Timestamp,
        });
    }
    catch (err) {
        console.error("❌ Error en /token/file:", err);
        res.status(500).json({ ok: false, error: err.message });
    }
});
/**
 * 🔹 Healthcheck específico de token
 */
router.get("/health", (_req, res) => {
    res.json({
        ok: true,
        service: "tokenization",
        ts: Date.now(),
    });
});
exports.default = router;
