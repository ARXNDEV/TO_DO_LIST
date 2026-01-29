import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus } from 'lucide-react';
import { TodoItem } from './TodoItem';
import type { Todo } from '../types';

const API_URL = 'http://localhost:3000/api/todos';

export const TodoList: React.FC = () => {
    // State Management
    const [todos, setTodos] = useState<Todo[]>([]);
    const [isAdding, setIsAdding] = useState(false);
    const [newTitle, setNewTitle] = useState('');
    const [newDesc, setNewDesc] = useState('');

    // Initial Fetch
    useEffect(() => {
        fetchTodos();
    }, []);

    const fetchTodos = async () => {
        try {
            const response = await axios.get(API_URL);
            setTodos(response.data);
        } catch (error) {
            console.error('Failed to fetch todos:', error);
        }
    };

    const handleCreate = async () => {
        if (!newTitle.trim()) return;

        try {
            const response = await axios.post(API_URL, {
                text: newTitle,
                description: newDesc
            });
            // Add new todo to the beginning of the list
            setTodos([response.data, ...todos]);

            // Reset form
            setNewTitle('');
            setNewDesc('');
            setIsAdding(false);
        } catch (error) {
            console.error('Failed to create todo:', error);
        }
    };

    const handleUpdate = async (id: string, updates: Partial<Todo>) => {
        // Optimistic UI Update
        const previousTodos = [...todos];
        setTodos(todos.map(t => t._id === id ? { ...t, ...updates } : t));

        try {
            await axios.patch(`${API_URL}/${id}`, updates);
        } catch (error) {
            // Revert on failure
            console.error('Failed to update todo:', error);
            setTodos(previousTodos);
        }
    };

    const handleDelete = async (id: string) => {
        // Optimistic UI Update
        const previousTodos = [...todos];
        setTodos(todos.filter(t => t._id !== id));

        try {
            await axios.delete(`${API_URL}/${id}`);
        } catch (error) {
            // Revert on failure
            console.error('Failed to delete todo:', error);
            setTodos(previousTodos);
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto pt-20 px-6">
            <header className="mb-8">
                <h1 className="text-2xl font-bold text-white mb-1">Inbox</h1>
                <p className="text-zinc-500 text-xs">
                    {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                </p>
            </header>

            <div className="mb-4">
                <AnimatePresence mode="popLayout" initial={false}>
                    {todos.map(todo => (
                        <TodoItem
                            key={todo._id}
                            todo={todo}
                            onUpdate={handleUpdate}
                            onDelete={handleDelete}
                        />
                    ))}
                </AnimatePresence>
            </div>

            {/* Add Task Button / Form */}
            {!isAdding ? (
                <button
                    onClick={() => setIsAdding(true)}
                    className="group flex items-center gap-2 text-zinc-500 hover:text-zinc-300 transition-colors py-2"
                >
                    <div className="w-5 h-5 rounded-full flex items-center justify-center group-hover:bg-zinc-800 transition-colors text-zinc-400 group-hover:text-white">
                        <Plus size={16} />
                    </div>
                    <span className="text-sm font-medium">Add task</span>
                </button>
            ) : (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border border-zinc-800 rounded-lg p-3 bg-zinc-900/30 mb-8"
                >
                    <input
                        type="text"
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        placeholder="Task name"
                        autoFocus
                        className="w-full bg-transparent text-sm font-medium text-white placeholder-zinc-600 focus:outline-none mb-2"
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleCreate();
                            }
                        }}
                    />
                    <textarea
                        value={newDesc}
                        onChange={(e) => setNewDesc(e.target.value)}
                        placeholder="Description"
                        rows={1}
                        className="w-full bg-transparent text-xs text-zinc-400 placeholder-zinc-700 focus:outline-none resize-none"
                    />
                    <div className="flex items-center justify-end gap-2 mt-3 pt-2 border-t border-zinc-800/50">
                        <button
                            onClick={() => setIsAdding(false)}
                            className="px-3 py-1.5 text-xs font-medium text-zinc-400 hover:bg-zinc-800 rounded-md transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleCreate}
                            disabled={!newTitle.trim()}
                            className="px-3 py-1.5 text-xs font-bold bg-zinc-100 text-black rounded-md hover:bg-white disabled:opacity-50 transition-colors"
                        >
                            Add task
                        </button>
                    </div>
                </motion.div>
            )}
        </div>
    );
};
