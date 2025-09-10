"use strict";
//src/routes/projects.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const tokenService_js_1 = require("../services/tokenService.js");
const router = (0, express_1.Router)();
const upload = (0, multer_1.default)({ storage: multer_1.default.memoryStorage() });
/**
 * 🔹 POST /api/projects
 * Maneja subida de metadata + archivos para proyectos industriales
 */
router.post("/", upload.array("files"), async (req, res) => {
    return (0, tokenService_js_1.handleTokenization)("projects", req, res);
});
/**
 * 🔹 Healthcheck específico
 */
router.get("/health", (_req, res) => {
    res.json({
        ok: true,
        service: "projects",
        ts: Date.now(),
    });
});
exports.default = router;
