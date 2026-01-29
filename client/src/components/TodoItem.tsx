import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, Trash2 } from 'lucide-react';
import type { Todo } from '../types';
import clsx from 'clsx';

interface TodoItemProps {
    todo: Todo;
    onUpdate: (id: string, updates: Partial<Todo>) => void;
    onDelete: (id: string) => void;
}

export const TodoItem: React.FC<TodoItemProps> = ({ todo, onUpdate, onDelete }) => {
    // State for editing mode
    const [isEditing, setIsEditing] = useState(false);
    const [editTitle, setEditTitle] = useState(todo.text);
    const [editDesc, setEditDesc] = useState(todo.description);

    // Autosize textarea ref
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Auto-resize description textarea
    useEffect(() => {
        if (isEditing && textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
        }
    }, [isEditing, editDesc]);

    const handleSave = () => {
        if (!editTitle.trim()) return;
        onUpdate(todo._id, { text: editTitle, description: editDesc });
        setIsEditing(false);
    };

    const handleCancel = () => {
        // Reset to original values
        setEditTitle(todo.text);
        setEditDesc(todo.description);
        setIsEditing(false);
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="group border-b border-zinc-900 py-3"
        >
            {!isEditing ? (
                <div className="flex items-start gap-3">
                    {/* Completion Checkbox */}
                    <button
                        onClick={() => onUpdate(todo._id, { completed: !todo.completed })}
                        className={clsx(
                            "mt-1 w-5 h-5 rounded-full border flex-shrink-0 flex items-center justify-center transition-all duration-200",
                            todo.completed
                                ? "bg-zinc-500 border-zinc-500 text-black"
                                : "border-zinc-700 hover:border-zinc-500 bg-transparent"
                        )}
                    >
                        {todo.completed && <Check size={12} strokeWidth={3} />}
                    </button>

                    {/* Todo Content */}
                    <div
                        className="flex-1 cursor-pointer"
                        onClick={() => setIsEditing(true)}
                    >
                        <h3 className={clsx(
                            "text-sm mb-1 transition-colors",
                            todo.completed ? "text-zinc-600 line-through" : "text-zinc-200"
                        )}>
                            {todo.text}
                        </h3>
                        {todo.description && (
                            <p className={clsx(
                                "text-xs line-clamp-2",
                                todo.completed ? "text-zinc-700" : "text-zinc-500"
                            )}>
                                {todo.description}
                            </p>
                        )}
                    </div>

                    {/* Delete Action (Hidden until hover) */}
                    <button
                        onClick={() => onDelete(todo._id)}
                        className="opacity-0 group-hover:opacity-100 p-1 text-zinc-600 hover:text-red-400 transition-opacity"
                        aria-label="Delete todo"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            ) : (
                /* Edit Mode */
                <div className="pl-8 pb-2">
                    <div className="border border-zinc-800 rounded-lg p-3 bg-zinc-900/30">
                        <input
                            type="text"
                            value={editTitle}
                            onChange={e => setEditTitle(e.target.value)}
                            className="w-full bg-transparent text-sm font-medium text-white placeholder-zinc-600 focus:outline-none mb-2"
                            placeholder="Task name"
                            autoFocus
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    handleSave();
                                } else if (e.key === 'Escape') {
                                    handleCancel();
                                }
                            }}
                        />
                        <textarea
                            ref={textareaRef}
                            value={editDesc}
                            onChange={e => setEditDesc(e.target.value)}
                            className="w-full bg-transparent text-xs text-zinc-400 placeholder-zinc-700 focus:outline-none resize-none overflow-hidden"
                            placeholder="Description"
                            rows={1}
                        />
                    </div>
                    <div className="flex items-center gap-2 mt-2 justify-end">
                        <button
                            onClick={handleCancel}
                            className="px-3 py-1.5 text-xs font-medium text-zinc-400 hover:bg-zinc-900 rounded-md transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={!editTitle.trim()}
                            className="px-3 py-1.5 text-xs font-medium bg-zinc-100 text-black rounded-md hover:bg-white disabled:opacity-50 transition-colors"
                        >
                            Save
                        </button>
                    </div>
                </div>
            )}
        </motion.div>
    );
};
