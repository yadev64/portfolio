const express = require('express');
const fs = require('fs/promises');
const path = require('path');
const cors = require('cors');
const multer = require('multer');

const app = express();
const PORT = 4000;

// Path to frontend uploads directory
const UPLOADS_DIR = path.join(__dirname, '../../frontend/public/uploads');

// Configure multer for image uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, UPLOADS_DIR),
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const name = path.basename(file.originalname, ext).replace(/[^a-z0-9]/gi, '-').toLowerCase();
        cb(null, `${name}-${Date.now()}${ext}`);
    }
});
const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) cb(null, true);
        else cb(new Error('Only images are allowed'));
    }
});

app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Serve uploaded images statically
app.use('/uploads', express.static(UPLOADS_DIR));
// Path to the frontend data directory
const DATA_DIR = path.join(__dirname, '../../frontend/src/data');

// Helper to get file path
const getFilePath = (collection) => path.join(DATA_DIR, `${collection}.json`);

// Generic array reader
const readData = async (collection) => {
    try {
        const file = await fs.readFile(getFilePath(collection), 'utf8');
        return JSON.parse(file);
    } catch (e) {
        // If file doesn't exist, return empty array
        return [];
    }
};

// Generic array writer
const writeData = async (collection, data) => {
    await fs.writeFile(getFilePath(collection), JSON.stringify(data, null, 2));
};

// --- Image Upload Route (MUST be before generic :collection routes) ---
app.post('/api/upload', upload.single('image'), (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'No image provided' });
    const url = `/uploads/${req.file.filename}`;
    res.json({ success: true, url });
});

// --- CRUD Routes ---

app.get('/api/:collection', async (req, res) => {
    const { collection } = req.params;
    const data = await readData(collection);
    // Sort descending by ID (which functions as a timestamp substitute for simplicity)
    res.json(data.sort((a, b) => (b._id || 0) - (a._id || 0)));
});

app.post('/api/:collection', async (req, res) => {
    const { collection } = req.params;
    const items = await readData(collection);

    const newItem = {
        _id: Date.now().toString(), // Simple ID generation
        createdAt: new Date().toISOString(),
        ...req.body
    };

    items.push(newItem);
    await writeData(collection, items);

    res.json({ success: true, insertedId: newItem._id });
});

app.delete('/api/:collection/:id', async (req, res) => {
    const { collection, id } = req.params;
    const items = await readData(collection);

    const filteredItems = items.filter(item => item._id !== id);

    if (items.length === filteredItems.length) {
        return res.status(404).json({ error: 'Item not found' });
    }

    await writeData(collection, filteredItems);
    res.json({ success: true, deletedCount: 1 });
});



app.listen(PORT, () => {
    console.log(`\n======================================`);
    console.log(`🚀 YADEV PORTFOLIO LOCAL CMS SERVER`);
    console.log(`📡 URL: http://localhost:${PORT}`);
    console.log(`📁 Target DB: ${DATA_DIR}`);
    console.log(`======================================\n`);
});
