"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/ipfs.ts
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const sdk_1 = __importDefault(require("@pinata/sdk"));
const stream_1 = require("stream");
const router = (0, express_1.Router)();
const upload = (0, multer_1.default)({ storage: multer_1.default.memoryStorage() });
// ----------------------
// Configuración Pinata
// ----------------------
const pinata = new sdk_1.default(process.env.PINATA_API_KEY, process.env.PINATA_SECRET_API_KEY);
// ----------------------
// Subir JSON a IPFS
// ----------------------
router.post("/json", async (req, res) => {
    try {
        const { data } = req.body;
        if (!data) {
            return res.status(400).json({ ok: false, error: "Falta data en el body" });
        }
        const result = await pinata.pinJSONToIPFS(data, {
            pinataMetadata: { name: "plantarum-json" },
        });
        res.json({
            ok: true,
            IpfsHash: result.IpfsHash,
            Timestamp: new Date().toISOString(),
        });
    }
    catch (err) {
        console.error("❌ Error subiendo JSON:", err);
        res.status(500).json({ ok: false, error: err.message });
    }
});
// ----------------------
// Subir archivo a IPFS (imagen/pdf/etc.)
// ----------------------
router.post("/file", upload.single("file"), async (req, res) => {
    try {
        if (!req.file) {
            return res
                .status(400)
                .json({ ok: false, error: "No se subió ningún archivo" });
        }
        const bufferStream = new stream_1.PassThrough();
        bufferStream.end(req.file.buffer);
        const result = await pinata.pinFileToIPFS(bufferStream, {
            pinataMetadata: { name: req.file.originalname },
        });
        res.json({
            ok: true,
            IpfsHash: result.IpfsHash,
            Name: req.file.originalname,
            Size: req.file.size,
            MimeType: req.file.mimetype,
            Timestamp: new Date().toISOString(),
        });
    }
    catch (err) {
        console.error("❌ Error subiendo archivo:", err);
        res.status(500).json({ ok: false, error: err.message });
    }
});
exports.default = router;
