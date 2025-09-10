import { Router } from "express";
import multer from "multer";
import { pinBase64ToPinata, pinJSONToPinata } from "../services/ipfsService.js";
import fs from "fs";
import path from "path";
import { ethers } from "ethers";
import { provider } from "../utils/provider.js";

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

// 📌 Cargar ABI
const abiPath = path.resolve("src/abi/PlantarumPrf.json");
const PlantarumPrfABI = JSON.parse(fs.readFileSync(abiPath, "utf-8"));

// Dirección del contrato (desde .env)
const PRF_ADDRESS = process.env.PRF_ADDRESS as string;
const contract = new ethers.Contract(PRF_ADDRESS, PlantarumPrfABI, provider);

// 📌 Subida de documentos de auditoría
router.post("/submit", upload.array("files"), async (req, res) => {
  try {
    const { auditId, phase, descripcion } = req.body;
    const files = req.files as Express.Multer.File[];

    const pinnedFiles = [];
    for (const file of files) {
      const base64 = file.buffer.toString("base64");
      const result = await pinBase64ToPinata({
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

    const result = await pinJSONToPinata(metadata);
    res.json({ ok: true, IpfsHash: result.IpfsHash, metadata });
  } catch (err) {
    console.error("❌ Error subiendo documento de auditoría:", err);
    res.status(500).json({ ok: false, error: "Error en middleware PRF" });
  }
});

// Healthcheck
router.get("/health", (_req, res) => {
  res.json({ ok: true, service: "prf", ts: Date.now() });
});

export default router;
