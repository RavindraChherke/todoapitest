const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); 
const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(cors()); 
let todos = [];

// Function to generate a random 10-digit ID
function generateRandomId() {
    return Math.floor(1000000000 + Math.random() * 9000000000);
}

// Get all todos
app.get('/api/todos', (req, res) => {
    res.json(todos);
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
    const todo = todos.find(todo => todo.id === parseInt(todoId));
    if (!todo) {
        return res.status(404).json({ error: 'Todo not found' });
    }
    todo.task = req.body.task;
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
