import express, { Request, Response } from 'express';
import fs from 'fs/promises';
import path from 'path';
import { Todo } from '../models/Todo';

const router = express.Router();
const DATA_FILE = path.join(__dirname, '../../data/todos.json');

// Helper to read todos
const readTodos = async (): Promise<Todo[]> => {
    try {
        const data = await fs.readFile(DATA_FILE, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
};

// Helper to write todos
const writeTodos = async (todos: Todo[]) => {
    await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
    await fs.writeFile(DATA_FILE, JSON.stringify(todos, null, 2));
};

// Get all todos
router.get('/', async (req: Request, res: Response) => {
    try {
        const todos = await readTodos();
        // Sort by newest first
        const sortedTodos = todos.sort((a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        res.json(sortedTodos);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching todos' });
    }
});

// Create a todo
router.post('/', async (req: Request, res: Response) => {
    try {
        const todos = await readTodos();
        const newTodo: Todo = {
            _id: Date.now().toString(),
            text: req.body.text,
            description: req.body.description || '',
            completed: false,
            createdAt: new Date().toISOString()
        };

        const updatedTodos = [...todos, newTodo];
        await writeTodos(updatedTodos);

        res.status(201).json(newTodo);
    } catch (error) {
        res.status(400).json({ message: 'Error creating todo' });
    }
});

// Update todo (Toggle / Edit)
router.patch('/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const todos = await readTodos();
        const todoIndex = todos.findIndex(t => t._id === id);

        if (todoIndex === -1) {
            return res.status(404).json({ message: 'Todo not found' });
        }

        todos[todoIndex] = {
            ...todos[todoIndex],
            ...req.body
        };

        await writeTodos(todos);
        res.json(todos[todoIndex]);
    } catch (error) {
        res.status(400).json({ message: 'Error updating todo' });
    }
});

// Delete a todo
router.delete('/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const todos = await readTodos();
        const filteredTodos = todos.filter(t => t._id !== id);

        if (todos.length === filteredTodos.length) {
            return res.status(404).json({ message: 'Todo not found' });
        }

        await writeTodos(filteredTodos);
        res.json({ message: 'Todo deleted' });
    } catch (error) {
        res.status(400).json({ message: 'Error deleting todo' });
    }
});

export default router;
