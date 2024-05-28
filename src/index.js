require('dotenv').config(); // Load environment variables from .env file

const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

const app = express();
const port = process.env.PORT || 3000;

// Configure Cloudinary with environment variables
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Set up multer storage with Cloudinary
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'uploads',
        allowed_formats: ['jpg', 'png', 'jpeg', 'gif'],
    },
});

const upload = multer({ storage: storage });

app.use(express.static('src'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.post('/upload', upload.single('file'), (req, res) => {
    if (req.file) {
        res.status(200).json({
            message: 'File uploaded successfully',
            imageUrl: req.file.path,
        });
    } else {
        res.status(400).json({ message: 'Failed to upload file' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
