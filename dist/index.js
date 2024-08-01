"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
// import prisma from './db/db' 
// import router from './routes/user.routes';
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
// import jwtConfig from './middleware/jwt';
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json({
    verify: (req, res, buf) => {
        req.body = buf;
    },
}));
// app.use("/api", router);
// const port = 3000;
const port = process.env.PORT || 3000;
// app.get('/', async (req: Request, res: Response) => {
//     try {
//       const users = await prisma.user.findMany();
//       res.json({ users, message: 'Fetched successfully' });
//     } catch (error) {
//       res.status(500).json({ error: 'Internal Server Error' });
//     }
//   });
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
//# sourceMappingURL=index.js.map