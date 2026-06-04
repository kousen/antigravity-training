document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('addTaskForm');
    const tasksContainer = document.getElementById('tasksContainer');
    const searchInput = document.getElementById('searchInput');
    const statusFilter = document.getElementById('statusFilter');
    const sortDateBtn = document.getElementById('sortDateBtn');

    let currentSort = null;

    // Initial Load
    fetchTasks();

    // Event Listeners
    taskForm.addEventListener('submit', handleAddTask);
    searchInput.addEventListener('input', () => fetchTasks());
    statusFilter.addEventListener('change', () => fetchTasks());
    sortDateBtn.addEventListener('click', () => {
        currentSort = currentSort === 'date' ? null : 'date';
        fetchTasks();
    });

    async function fetchTasks() {
        const params = new URLSearchParams();
        const search = searchInput.value;
        const status = statusFilter.value;

        if (search) params.append('search', search);
        if (status) params.append('status', status);
        if (currentSort) params.append('sort', currentSort);

        try {
            const res = await fetch(`/api/tasks?${params.toString()}`);
            const tasks = await res.json();
            renderTasks(tasks);
        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
    }

    async function handleAddTask(e) {
        e.preventDefault();
        const title = document.getElementById('taskTitle').value;
        const description = document.getElementById('taskDesc').value;
        const dueDate = document.getElementById('taskDate').value;

        try {
            await fetch('/api/tasks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, description, dueDate })
            });
            taskForm.reset();
            fetchTasks();
        } catch (error) {
            console.error('Error adding task:', error);
        }
    }

    async function updateStatus(id, newStatus) {
        try {
            await fetch(`/api/tasks/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });
            fetchTasks();
        } catch (error) {
            console.error('Error updating status:', error);
        }
    }

    async function deleteTask(id) {
        if (!confirm('Are you sure you want to delete this task?')) return;
        try {
            await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
            fetchTasks();
        } catch (error) {
            console.error('Error deleting task:', error);
        }
    }

    function renderTasks(tasks) {
        tasksContainer.innerHTML = '';
        if (tasks.length === 0) {
            tasksContainer.innerHTML = '<p>No tasks found.</p>';
            return;
        }

        tasks.forEach(task => {
            const card = document.createElement('div');
            card.className = `task-card ${task.status}`;
            
            const dateDisplay = task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No Due Date';

            card.innerHTML = `
                <div class="task-header">
                    <span class="task-title">${escapeHtml(task.title)}</span>
                    <span class="task-meta">${dateDisplay}</span>
                </div>
                <p>${escapeHtml(task.description)}</p>
                <div class="task-actions">
                    <select onchange="window.updateTaskStatus('${task.id}', this.value)" class="btn-small">
                        <option value="pending" ${task.status === 'pending' ? 'selected' : ''}>Pending</option>
                        <option value="in-progress" ${task.status === 'in-progress' ? 'selected' : ''}>In Progress</option>
                        <option value="completed" ${task.status === 'completed' ? 'selected' : ''}>Completed</option>
                    </select>
                    <button onclick="window.deleteTaskById('${task.id}')" class="btn-small btn-delete">Delete</button>
                </div>
            `;
            tasksContainer.appendChild(card);
        });
    }

    // Expose helpers to global scope for inline event handlers
    window.updateTaskStatus = updateStatus;
    window.deleteTaskById = deleteTask;
    
    function escapeHtml(text) {
        if (!text) return '';
        return text
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
});
