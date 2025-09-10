import { Router, Request, Response } from "express";
import { ethers } from "ethers";
import { provider } from "../utils/provider.js";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

const router = Router();

// 📌 Cargar ABI
const abiPath = path.resolve("src/abi/PlantarumKyc.json");
const PlantarumKYC_ABI = JSON.parse(fs.readFileSync(abiPath, "utf-8"));

// Dirección del contrato desde .env
const KYC_ADDRESS = process.env.KYC_ADDRESS as string;
if (!KYC_ADDRESS) {
  throw new Error("⚠️ Falta KYC_ADDRESS en .env");
}

// Instancia contrato
const contract = new ethers.Contract(KYC_ADDRESS, PlantarumKYC_ABI, provider);

// Healthcheck
router.get("/health", (_req: Request, res: Response) => {
  res.json({ ok: true, service: "kyc", ts: Date.now() });
});

// Consultar estado KYC
router.get("/:address", async (req: Request, res: Response) => {
  try {
    const user = req.params.address;
    const status = await contract.getKYCStatus(user);
    res.json({ ok: true, user, status });
  } catch (err: any) {
    console.error("❌ Error en /api/kyc/:address:", err);
    res.status(500).json({ ok: false, error: err.message });
  }
});

// Registrar KYC (simulado: frontend hace la transacción real)
router.post("/register", async (req: Request, res: Response) => {
  try {
    const { user, hashId } = req.body;
    if (!user || !hashId) {
      return res.status(400).json({ ok: false, error: "Faltan parámetros" });
    }
    res.json({ ok: true, user, hashId, note: "Frontend debe firmar registerKYC()" });
  } catch (err: any) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

export default router;
