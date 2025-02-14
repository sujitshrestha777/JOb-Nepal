import express from 'express';
import { router } from './routes';
import 'dotenv/config'; 
import cors from "cors"
import path from 'path';


const app = express();
const port = process.env.PORT||5000;

app.use(cors());
app.use(express.json())
app.use('/uploads', express.static('uploads'));
app.use(express.urlencoded({ extended: true }));

app.use("/api",router)
app.get('/', (req, res) => {
  res.send('Hello from the backend!');
});

app.listen(port, () => {
  console.log(`Backend running at http://localhost:${port}`);
});