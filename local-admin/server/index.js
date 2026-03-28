const express = require('express');
const fs = require('fs/promises');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

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
