
const express = require("express");
const multer = require("multer");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Create uploads folder if it doesn't exist
const uploadDir = path.join(__dirname, "uploads");

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Serve uploaded images
app.use("/uploads", express.static(uploadDir));

// Multer storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueName =
            Date.now() + "-" + Math.round(Math.random() * 1E9);

        cb(null, uniqueName + path.extname(file.originalname));
    }
});

// Allow only image files
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const ext = path.extname(file.originalname).toLowerCase();
    const mime = file.mimetype;

    if (
        allowedTypes.test(ext.slice(1)) &&
        allowedTypes.test(mime.split("/")[1])
    ) {
        cb(null, true);
    } else {
        cb(new Error("Only image files are allowed!"));
    }
};

// Configure Multer
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5 MB
    }
});

// Test route
app.get("/", (req, res) => {
    res.send("Image Upload API is running!");
});

// Image upload endpoint
app.post("/upload", upload.single("image"), (req, res) => {
    if (!req.file) {
        return res.status(400).json({
            message: "Please select an image!"
        });
    }

    res.status(200).json({
        message: "Image uploaded successfully!",
        image: {
            filename: req.file.filename,
            url: `http://localhost:${PORT}/uploads/${req.file.filename}`
        }
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        return res.status(400).json({
            message: err.code === "LIMIT_FILE_SIZE"
                ? "Image size must be less than 5 MB"
                : err.message
        });
    }

    res.status(400).json({
        message: err.message || "Upload failed"
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
