const express = require('express');
const path = require('path');
const TaskManager = require('./taskManager');

const app = express();
const PORT = process.env.PORT || 3000;
const taskManager = new TaskManager();

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Initialize TaskManager
(async () => {
    await taskManager.loadTasks();
})();

// API Endpoints

// GET /api/tasks - List all tasks, optionally filtered or sorted
app.get('/api/tasks', (req, res) => {
    let tasks = taskManager.listTasks();
    const { status, sort, search } = req.query;

    if (status) {
        tasks = taskManager.getTasksByStatus(status);
    }
    
    if (search) {
        tasks = taskManager.searchTasks(search);
    }

    if (sort === 'date') {
        // We need to use the taskManager's sort logic or implement it here.
        // Since getTasksSortedByDueDate returns *all* tasks sorted, 
        // if we are also filtering, we might need to compose these.
        // For simplicity, let's just re-use the manager's logic if no other filters,
        // or just sort the result array here.
        if (!status && !search) {
            tasks = taskManager.getTasksSortedByDueDate();
        } else {
             tasks.sort((a, b) => {
                if (!a.dueDate) return 1;
                if (!b.dueDate) return -1;
                return new Date(a.dueDate) - new Date(b.dueDate);
            });
        }
    }

    res.json(tasks);
});

// POST /api/tasks - Add a new task
app.post('/api/tasks', async (req, res) => {
    const { title, description, dueDate } = req.body;
    if (!title) {
        return res.status(400).json({ error: 'Title is required' });
    }
    const newTask = await taskManager.addTask(title, description, dueDate);
    res.status(201).json(newTask);
});

// PUT /api/tasks/:id - Update a task
app.put('/api/tasks/:id', async (req, res) => {
    const { id } = req.params;
    const updates = req.body;
    const updatedTask = await taskManager.updateTask(id, updates);
    
    if (updatedTask) {
        res.json(updatedTask);
    } else {
        res.status(404).json({ error: 'Task not found' });
    }
});

// DELETE /api/tasks/:id - Delete a task
app.delete('/api/tasks/:id', async (req, res) => {
    const { id } = req.params;
    const success = await taskManager.removeTask(id);
    
    if (success) {
        res.status(204).send();
    } else {
        res.status(404).json({ error: 'Task not found' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
