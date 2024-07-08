const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); 
const app = express();
const PORT = 4000;

app.use(bodyParser.json());
app.use(cors());

// Function to generate a random 10-digit ID
function generateRandomId() {
    return Math.floor(1000000000 + Math.random() * 9000000000);
}

let todos = [];

// Function to create dummy todos
function createDummyTodos(count) {
    const tasks = [
        'Buy groceries', 'Walk the dog', 'Finish homework', 'Clean the house', 'Call mom',
        'Prepare dinner', 'Write report', 'Attend meeting', 'Read a book', 'Work out',
        'Pay bills', 'Fix the car', 'Visit the doctor', 'Watch a movie', 'Go shopping',
        'Plan vacation', 'Water plants', 'Send emails', 'Organize files', 'Take a nap',
        'Meditate', 'Feed the cat', 'Learn guitar', 'Practice yoga', 'Bake cookies',
        'Play video games', 'Study for exam', 'Go for a run', 'Write a blog post', 'Attend class',
        'Do laundry', 'Clean the fridge', 'Mow the lawn', 'Update resume', 'Make a presentation',
        'Research project', 'Take out trash', 'Plan a party', 'Volunteer work', 'Schedule appointment',
        'Buy a gift', 'Check emails', 'Backup data', 'Go hiking', 'Visit friends',
        'Make a budget', 'Buy new shoes', 'Write a poem', 'Decorate home', 'Take photos'
    ];

    for (let i = 0; i < count; i++) {
        todos.push({
            id: generateRandomId(),
            task: tasks[i % tasks.length]
        });
    }
}

// Create 50 dummy todos
createDummyTodos(50);

// // Get all todos
// app.get('/api/todos', (req, res) => {
//     res.json(todos);
// });

// Get all todos with pagination and search
app.get('/api/todos', (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const query = req.query.q || '';
    
    // Filter todos based on search query
    const filteredTodos = todos.filter(todo => todo.task.toLowerCase().includes(query.toLowerCase()));
    
    const total = filteredTodos.length;
    const totalPages = Math.ceil(total / limit);

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const results = {};

    if (endIndex < total) {
        results.next = {
            page: page + 1,
            limit: limit
        };
    }
    
    if (startIndex > 0) {
        results.previous = {
            page: page - 1,
            limit: limit
        };
    }
    
    results.total = total;
    results.pages = totalPages;
    results.current_page = page;
    results.page_size = limit;
    results.results = filteredTodos.slice(startIndex, endIndex);

    res.json(results);
});

// Get a specific todo
app.get('/api/todos/:id', (req, res) => {
    const todoId = req.params.id;
    const todo = todos.find(todo => todo.id === parseInt(todoId));
    if (!todo) {
        return res.status(404).json({ error: 'Todo not found' });
    }
    res.json(todo);
});

// Add a new todo
app.post('/api/todos', (req, res) => {
    const { task } = req.body;

    // Check if task field is empty or not provided
    if (!task || task.trim() === '') {
        return res.status(400).json({ error: 'Task cannot be empty' });
    }

    const newTodo = {
        id: generateRandomId(),
        task: task.trim(), // Trim the task to remove extra spaces
    };

    todos.push(newTodo);
    res.status(201).json(newTodo);
});

// Update a todo
app.put('/api/todos/:id', (req, res) => {
    const todoId = req.params.id;
    const updatedTask = req.body.task;

    // Check if task field is empty or not provided
    if (!updatedTask || updatedTask.trim() === '') {
        return res.status(400).json({ error: 'Task cannot be empty' });
    }

    const todo = todos.find(todo => todo.id === parseInt(todoId));
    if (!todo) {
        return res.status(404).json({ error: 'Todo not found' });
    }

    todo.task = updatedTask.trim(); // Update the task and trim extra spaces
    res.json(todo);
});

// Delete a todo
app.delete('/api/todos/:id', (req, res) => {
    const todoId = req.params.id;
    const todoIndex = todos.findIndex(todo => todo.id === parseInt(todoId));
    if (todoIndex === -1) {
        return res.status(404).json({ error: 'Todo not found' });
    }
    
    // Retrieve the ID of the deleted todo
    const deletedTodoId = todos[todoIndex].id;

    // Remove the todo from the list
    const deletedTodo = todos.splice(todoIndex, 1);

    // Return the ID of the deleted todo
    res.status(200).json({ deletedTodoId });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
