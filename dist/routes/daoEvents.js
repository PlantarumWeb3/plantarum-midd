"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//src/routes/daoEvents.ts
const express_1 = require("express");
const daoListener_js_1 = require("../services/daoListener.js");
const router = (0, express_1.Router)();
/**
 * GET /dao/events?fromBlock=NUM&toBlock=NUM
 */
router.get('/events', async (req, res) => {
    try {
        const fromBlock = req.query.fromBlock ? Number(req.query.fromBlock) : undefined;
        const toBlock = req.query.toBlock ? Number(req.query.toBlock) : undefined;
        const data = await (0, daoListener_js_1.queryDaoEvents)(fromBlock, toBlock);
        res.json({ ok: true, data });
    }
    catch (err) {
        res.status(500).json({ ok: false, error: err.message });
    }
});
exports.default = router;
