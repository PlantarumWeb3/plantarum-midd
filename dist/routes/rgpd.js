"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/rgpd.ts
const express_1 = require("express");
const rgpdService_js_1 = require("../services/rgpdService.js");
const router = (0, express_1.Router)();
// 📌 Guardar dato personal
router.post("/store", (req, res) => {
    try {
        const { data } = req.body;
        if (!data)
            return res.status(400).json({ ok: false, error: "Falta 'data'" });
        const { hashId } = (0, rgpdService_js_1.storePersonalData)(data);
        res.json({ ok: true, hashId });
    }
    catch (err) {
        res.status(500).json({ ok: false, error: err.message });
    }
});
// 📌 Obtener dato por hashId
router.get("/:hashId", (req, res) => {
    try {
        const result = (0, rgpdService_js_1.getPersonalData)(req.params.hashId);
        if (!result)
            return res.status(404).json({ ok: false, error: "No encontrado" });
        res.json({ ok: true, data: result });
    }
    catch (err) {
        res.status(500).json({ ok: false, error: err.message });
    }
});
// 📌 Borrar dato (derecho al olvido)
router.delete("/:hashId", (req, res) => {
    try {
        const success = (0, rgpdService_js_1.deletePersonalData)(req.params.hashId);
        if (!success)
            return res.status(404).json({ ok: false, error: "No encontrado" });
        res.json({ ok: true, message: "Dato eliminado según RGPD" });
    }
    catch (err) {
        res.status(500).json({ ok: false, error: err.message });
    }
});
exports.default = router;
