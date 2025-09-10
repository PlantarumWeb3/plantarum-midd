"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//src/index.ts
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const daoEvents_js_1 = __importDefault(require("./routes/daoEvents.js"));
const ipfs_js_1 = __importDefault(require("./routes/ipfs.js"));
const token_js_1 = __importDefault(require("./routes/token.js"));
const conservation_js_1 = __importDefault(require("./routes/conservation.js"));
const forest_js_1 = __importDefault(require("./routes/forest.js"));
const carbon_js_1 = __importDefault(require("./routes/carbon.js"));
const projects_js_1 = __importDefault(require("./routes/projects.js"));
const rgpd_js_1 = __importDefault(require("./routes/rgpd.js"));
const reputation_js_1 = __importDefault(require("./routes/reputation.js"));
const kyc_js_1 = __importDefault(require("./routes/kyc.js"));
const prf_js_1 = __importDefault(require("./routes/prf.js"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// 🔹 Endpoint de salud
app.get("/health", (_req, res) => {
    res.json({
        ok: true,
        service: "plantarum-midd",
        ts: Date.now(),
    });
});
// Rutas
app.use("/dao", daoEvents_js_1.default);
app.use("/ipfs", ipfs_js_1.default);
app.use("/token", token_js_1.default);
app.use("/api/conservation", conservation_js_1.default);
app.use("/api/forest", forest_js_1.default);
app.use("/api/carbon", carbon_js_1.default);
app.use("/api/projects", projects_js_1.default);
app.use("/api/rgpd", rgpd_js_1.default);
app.use("/api/reputation", reputation_js_1.default);
app.use("/api/kyc", kyc_js_1.default);
app.use("/api/prf", prf_js_1.default);
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`✅ Middleware corriendo en http://localhost:${PORT}`);
});
