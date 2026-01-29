import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import todoRoutes from './routes/todos';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/todos', todoRoutes);

app.get('/', (req: Request, res: Response) => {
    res.json({ message: 'Todo API is running' });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
