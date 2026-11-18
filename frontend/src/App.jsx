
import React, { useState } from "react";
import "./App.css";

function App() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [uploadedImage, setUploadedImage] = useState(null);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    // Select image and show preview
    const handleFileChange = (e) => {
        const file = e.target.files[0];

        setMessage("");
        setUploadedImage(null);

        if (!file) return;

        if (!file.type.startsWith("image/")) {
            setMessage("Please select a valid image!");
            setSelectedFile(null);
            setPreview(null);
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            setMessage("Image must be less than 5 MB!");
            setSelectedFile(null);
            setPreview(null);
            return;
        }

        setSelectedFile(file);
        setPreview(URL.createObjectURL(file));
    };

    // Upload image to backend
    const handleUpload = async () => {
        if (!selectedFile) {
            setMessage("Please select an image first!");
            return;
        }

        const formData = new FormData();
        formData.append("image", selectedFile);

        try {
            setLoading(true);
            setMessage("");

            const response = await fetch(
                "http://localhost:5000/upload",
                {
                    method: "POST",
                    body: formData
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message);
            }

            setUploadedImage(data.image.url);
            setMessage(data.message);
            setSelectedFile(null);
            setPreview(null);

        } catch (error) {
            setMessage(error.message || "Upload failed!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <h1>Image Upload App</h1>

            <p>Select an image to upload</p>

            <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
            />

            {preview && (
                <div className="preview">
                    <h3>Image Preview</h3>
                    <img src={preview} alt="Preview" />
                </div>
            )}

            <button
                onClick={handleUpload}
                disabled={!selectedFile || loading}
            >
                {loading ? "Uploading..." : "Upload Image"}
            </button>

            {message && <p className="message">{message}</p>}

            {uploadedImage && (
                <div className="uploaded">
                    <h3>Uploaded Successfully!</h3>
                    <img
                        src={uploadedImage}
                        alt="Uploaded"
                    />
                </div>
            )}
        </div>
    );
}

export default App;
