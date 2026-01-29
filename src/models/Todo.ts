export interface Todo {
    _id: string; // Keeping _id for frontend compatibility
    text: string;
    description: string;
    completed: boolean;
    createdAt: string;
}

