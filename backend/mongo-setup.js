/**
 * MongoDB Setup & Seeder for Yadev Portfolio
 * 
 * This script initializes your database by connecting directly to MongoDB Atlas 
 * using the connection string and inserting default documents.
 * 
 * Run it locally using Node.js:
 * node mongo-setup.js
 */

const { MongoClient } = require('mongodb');

const URI = "mongodb+srv://yadev64_db_user:8sI0GFDMChlSDKus@portfoliodb.vvkezzd.mongodb.net/?appName=PortfolioDB";
const DB_NAME = "portfolio";
const COLLECTIONS = ['projects', 'career', 'writing', 'skills'];

async function setupDatabase() {
    console.log(`\nConnecting to MongoDB Atlas...`);

    const client = new MongoClient(URI);

    try {
        await client.connect();
        console.log(`✅ Connected successfully to server`);

        const db = client.db(DB_NAME);

        for (const collectionName of COLLECTIONS) {
            console.log(`Setting up collection: [${collectionName}]...`);
            const collection = db.collection(collectionName);

            // Insert initialization document
            const result = await collection.insertOne({
                _setup: true,
                message: `Initialization document for ${collectionName}`,
                createdAt: new Date().toISOString()
            });

            console.log(`✅ [${collectionName}] collection successfully created! (Inserted ID: ${result.insertedId})`);
        }

        console.log("\nSetup Complete! Your MongoDB database is now primed and ready.");

    } catch (err) {
        console.error("❌ Connection error:", err.stack);
    } finally {
        await client.close();
    }
}

setupDatabase();
