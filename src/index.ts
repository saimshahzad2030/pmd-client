import express, { Request, Response } from 'express'; 
// import prisma from './db/db' 
// import router from './routes/user.routes';
import cors from 'cors'
import bodyParser from 'body-parser';
// import jwtConfig from './middleware/jwt';
const app = express();
app.use(cors())
app.use(
  bodyParser.json({
    verify: (req:Request, res:Response, buf) => {
      req.body = buf;
    },
  })
);
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
