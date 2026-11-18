const express = require("express");
const Todo = require("../models/Todo");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Get all todos
router.get("/", authMiddleware, async (req, res) => {
    try {
        const todos = await Todo.find({
            user: req.user
        }).sort({ createdAt: -1 });

        res.json(todos);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create todo
router.post("/", authMiddleware, async (req, res) => {
    try {
        const { title, description } = req.body;

        if (!title || !title.trim()) {
            return res.status(400).json({
                message: "Title is required"
            });
        }

        const todo = await Todo.create({
            title: title.trim(),
            description,
            user: req.user
        });

        res.status(201).json(todo);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update todo
router.put("/:id", authMiddleware, async (req, res) => {
    try {
        const todo = await Todo.findOneAndUpdate(
            {
                _id: req.params.id,
                user: req.user
            },
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!todo) {
            return res.status(404).json({
                message: "Todo not found"
            });
        }

        res.json(todo);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete todo
router.delete("/:id", authMiddleware, async (req, res) => {
    try {
        const todo = await Todo.findOneAndDelete({
            _id: req.params.id,
            user: req.user
        });

        if (!todo) {
            return res.status(404).json({
                message: "Todo not found"
            });
        }

        res.json({
            message: "Todo deleted successfully"
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;