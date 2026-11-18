import { useEffect, useState } from "react";
import API from "../api";
import Navbar from "../components/navbar";

function Dashboard() {
    const [todos, setTodos] = useState([]);

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    const [editId, setEditId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Fetch todos
    const fetchTodos = async () => {
        try {
            const response = await API.get("/todos");
            setTodos(response.data);
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Unable to fetch tasks"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTodos();
    }, []);

    // Add or update todo
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!title.trim()) return;

        try {
            const todoData = {
                title,
                description
            };

            if (editId) {
                await API.put(`/todos/${editId}`, todoData);
                setEditId(null);
            } else {
                await API.post("/todos", todoData);
            }

            setTitle("");
            setDescription("");

            fetchTodos();

        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Unable to save task"
            );
        }
    };

    // Edit todo
    const handleEdit = (todo) => {
        setTitle(todo.title);
        setDescription(todo.description || "");
        setEditId(todo._id);
    };

    // Delete todo
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this task?")) {
            return;
        }

        try {
            await API.delete(`/todos/${id}`);
            fetchTodos();
        } catch (error) {
            setError("Unable to delete task");
        }
    };

    // Mark todo completed or pending
    const toggleComplete = async (todo) => {
        try {
            await API.put(`/todos/${todo._id}`, {
                completed: !todo.completed
            });

            fetchTodos();
        } catch (error) {
            setError("Unable to update task");
        }
    };

    const cancelEdit = () => {
        setEditId(null);
        setTitle("");
        setDescription("");
    };

    const completedCount = todos.filter(
        todo => todo.completed
    ).length;

    return (
        <>
            <Navbar />

            <div className="dashboard">
                <div className="welcome">
                    <h1>My Tasks</h1>
                    <p>Organize your day and get things done!</p>
                </div>

                <div className="stats">
                    <div className="stat-card">
                        <h2>{todos.length}</h2>
                        <p>Total Tasks</p>
                    </div>

                    <div className="stat-card">
                        <h2>{completedCount}</h2>
                        <p>Completed</p>
                    </div>

                    <div className="stat-card">
                        <h2>{todos.length - completedCount}</h2>
                        <p>Pending</p>
                    </div>
                </div>

                <form className="todo-form" onSubmit={handleSubmit}>
                    <h2>{editId ? "Update Task" : "Add New Task"}</h2>

                    <input
                        type="text"
                        placeholder="Enter task title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />

                    <textarea
                        placeholder="Enter task description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />

                    <button type="submit">
                        {editId ? "Update Task" : "Add Task"}
                    </button>

                    {editId && (
                        <button
                            type="button"
                            className="cancel-btn"
                            onClick={cancelEdit}
                        >
                            Cancel
                        </button>
                    )}
                </form>

                <div className="todo-list">
                    <h2>My To-Do List</h2>

                    {error && <p className="error">{error}</p>}

                    {loading ? (
                        <p>Loading tasks...</p>
                    ) : todos.length === 0 ? (
                        <p>No tasks yet. Add your first task!</p>
                    ) : (
                        todos.map(todo => (
                            <div className="todo-item" key={todo._id}>
                                <div className="todo-content">
                                    <h3 className={
                                        todo.completed ? "completed" : ""
                                    }>
                                        {todo.title}
                                    </h3>

                                    <p>{todo.description}</p>

                                    <span className={
                                        todo.completed
                                            ? "status done"
                                            : "status pending"
                                    }>
                                        {todo.completed
                                            ? "Completed"
                                            : "Pending"}
                                    </span>
                                </div>

                                <div className="todo-actions">
                                    <button
                                        onClick={() => toggleComplete(todo)}
                                        className="complete-btn"
                                    >
                                        {todo.completed
                                            ? "Undo"
                                            : "Complete"}
                                    </button>

                                    <button
                                        onClick={() => handleEdit(todo)}
                                        className="edit-btn"
                                    >
                                        Edit
                                    </button>

                                    <button
                                        onClick={() => handleDelete(todo._id)}
                                        className="delete-btn"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </>
    );
}

export default Dashboard;