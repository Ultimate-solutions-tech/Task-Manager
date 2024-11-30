document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('taskForm');
    const tasks = [];

    taskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const title = document.getElementById('title').value;
        const description = document.getElementById('description').value;
        const deadline = document.getElementById('deadline').value;
        const priority = document.getElementById('priority').value;

        const task = {
            id: Date.now(),
            title,
            description,
            deadline,
            priority,
            status: 'todo'
        };

        tasks.push(task);
        renderTasks();
        taskForm.reset();
    });

    const renderingTasks = () => { 
        const tasksList = document.getElementById('tasks'); 
        const filterPriority = document.getElementById('filterPriority').value; 
        const filterDate = document.getElementById('filterDate').value; 
        const searchQuery = document.getElementById('search').value.toLowerCase(); 
        
        tasksList.innerHTML = ''; 
        
        tasks 
            .filter(task => { 
                const matchesPriority = filterPriority === 'all' || task.priority === filterPriority; 
                const matchesDate = !filterDate || task.deadline === filterDate; 
                const matchesSearch = task.title.toLowerCase().includes(searchQuery); 
                return matchesPriority && matchesDate && matchesSearch;
            })
    
        }

    const renderTasks = () => {
        const todoTasks = document.getElementById('todoTasks');
        const doingTasks = document.getElementById('doingTasks');
        const doneTasks = document.getElementById('doneTasks');

        todoTasks.innerHTML = '';
        doingTasks.innerHTML = '';
        doneTasks.innerHTML = '';

        tasks.forEach(task => {
            const taskItem = document.createElement('li');
            taskItem.className = `task ${task.priority}`;
            taskItem.innerHTML = `
                <h4>${task.title}</h4>
                <p>${task.description}</p>
                <p>Due: ${task.deadline}</p>
                <div class="task-actions">
                    <button onclick="moveTask(${task.id}, 'todo')">To Do</button>
                    <button onclick="moveTask(${task.id}, 'doing')">Doing</button>
                    <button onclick="moveTask(${task.id}, 'done')">Done</button>
                    <button onclick="deleteTask(${task.id})">Delete</button>
                </div>
            `;

            if (task.status === 'todo') {
                todoTasks.appendChild(taskItem);
            } else if (task.status === 'doing') {
                doingTasks.appendChild(taskItem);
            } else {
                doneTasks.appendChild(taskItem);
            }
        });
    };

    window.moveTask = (id, status) => {
        const task = tasks.find(task => task.id === id);
        if (task) {
            task.status = status;
            renderTasks();
        }
    };

    window.deleteTask = (id) => {
        const index = tasks.findIndex(task => task.id === id);
        if (index !== -1) {
            tasks.splice(index, 1);
            renderTasks();
        }
    };
});

document.addEventListener('DOMContentLoaded', () => {
    // Registration Form Handler
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            try {
                const response = await fetch('/api/users/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, email, password })
                });
                const data = await response.json();
                if (response.ok) {
                    alert('Registration successful!');
                    window.location.href = 'login.html';
                } else {
                    alert(`Error: ${data.message}`);
                }
            } catch (error) {
                console.error('Error:', error);
            }
        });
    }

    // Login Form Handler
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            try {
                const response = await fetch('/api/users/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });
                const data = await response.json();
                if (response.ok) {
                    localStorage.setItem('token', data.token);
                    alert('Login successful!');
                    window.location.href = 'index.html';
                } else {
                    alert(`Error: ${data.message}`);
                }
            } catch (error) {
                console.error('Error:', error);
            }
        });
    }
});

// Example of fetching protected data using the token
const fetchProtectedTasks = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('Please log in to access tasks.');
        window.location.href = 'login.html';
        return;
    }

    try {
        const response = await fetch('/api/tasks', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        if (response.ok) {
            renderTasks(data);  // Assume you have a renderTasks function
        } else {
            alert('Error fetching tasks.');
        }
    } catch (error) {
        console.error('Error fetching tasks:', error);
    }
};

const logout = () => {
    localStorage.removeItem('token');
    alert('You have been logged out.');
    window.location.href = 'login.html';
};

document.getElementById('logoutButton')?.addEventListener('click', logout);


const checkTokenValidity = () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const payload = JSON.parse(atob(token.split('.')[1]));
    if (Date.now() >= payload.exp * 1000) {
        alert('Session expired. Please log in again.');
        logout();
    }
};

window.addEventListener('load', checkTokenValidity);

