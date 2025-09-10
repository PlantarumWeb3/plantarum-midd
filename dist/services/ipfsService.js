"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pinJSONToPinata = pinJSONToPinata;
exports.pinBase64ToPinata = pinBase64ToPinata;
// src/services/ipfsService.ts
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const PINATA_JWT = process.env.PINATA_JWT;
if (!PINATA_JWT) {
    console.warn("[IPFS] ⚠️ PINATA_JWT ausente. /ipfs/* fallará hasta configurarlo.");
}
/**
 * 📌 Sube JSON a Pinata vía API
 */
async function pinJSONToPinata(data) {
    if (!PINATA_JWT)
        throw new Error("PINATA_JWT no configurado");
    const res = await fetch("https://api.pinata.cloud/pinning/pinJSONToIPFS", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${PINATA_JWT}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ pinataContent: data }),
    });
    if (!res.ok) {
        const text = await res.text();
        throw new Error(`[Pinata JSON] ${res.status} ${res.statusText} :: ${text}`);
    }
    return res.json();
}
/**
 * 📌 Sube archivo base64 (imagen/pdf/etc.) a Pinata
 */
async function pinBase64ToPinata(params) {
    if (!PINATA_JWT)
        throw new Error("PINATA_JWT no configurado");
    const buffer = Buffer.from(params.base64, "base64");
    const form = new FormData();
    // @ts-ignore Node FormData vs browser
    form.append("file", new Blob([buffer], { type: params.mimeType || "application/octet-stream" }), params.filename);
    const res = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
        method: "POST",
        headers: { Authorization: `Bearer ${PINATA_JWT}` },
        // @ts-ignore
        body: form,
    });
    if (!res.ok) {
        const text = await res.text();
        throw new Error(`[Pinata File] ${res.status} ${res.statusText} :: ${text}`);
    }
    return res.json();
}
