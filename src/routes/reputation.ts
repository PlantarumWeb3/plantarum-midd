import { Router, Request, Response } from "express";
import { ethers } from "ethers";
import { provider } from "../utils/provider.js";
import fs from "fs";
import path from "path";

const router = Router();

// 📌 Cargar ABI
const abiPath = path.resolve("src/abi/PlantarumReputation.json");
const ReputationABI = JSON.parse(fs.readFileSync(abiPath, "utf-8"));

// Dirección del contrato desde .env
const REPUTATION_ADDRESS = process.env.REPUTATION_ADDRESS as string;
const contract = new ethers.Contract(REPUTATION_ADDRESS, ReputationABI, provider);

// ----------------------
// GET reputación simple
// ----------------------
router.get("/get/:user", async (req: Request, res: Response) => {
  try {
    const { user } = req.params;
    const reputation = await contract.getReputation(user);
    res.json({ ok: true, reputation: reputation.toString() });
  } catch (err: any) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// Healthcheck
router.get("/health", (_req: Request, res: Response) => {
  res.json({ ok: true, service: "reputation", ts: Date.now() });
});

export default router;
