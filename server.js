const express = require('express');
const crypto = require('crypto');
const fs = require('fs');
const { parse } = require('csv-parse');    
const cors = require('cors'); // Import cors
const path = require('path');



const app = express();
const port = 3000; // Or any port you prefer

let knownHashes = new Set(); // Use a Set for much faster lookups

async function loadHashesFromCsv(filePath) {
    return new Promise((resolve, reject) => {
        const hashes = [];
        fs.createReadStream(filePath)
            .pipe(parse({ columns: false, trim: true, skip_empty_lines: true }))
            .on('data', (row) => {
                if (row.length > 0 && typeof row[0] === 'string') {
                    hashes.push(row[0].toLowerCase());
                }
            })
            .on('end', () => {
                console.log(`Successfully loaded ${hashes.length} hashes from ${filePath}`);
                resolve(hashes);
            })
            .on('error', (error) => {
                console.error(`Error reading CSV file at ${filePath}: ${error.message}`);
                reject(error);
            });
    });
}

// Middleware setup
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Middleware to parse JSON requests
// Serve static files from the project's root directory where index.html is.
app.use(express.static(__dirname));

// API endpoint for checking the hash
app.post('/check-email', async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ error: 'Email is required' });
    }

    const hashedEmail = crypto.createHash('sha256').update(email.toLowerCase()).digest('hex');

    // Check against the in-memory set of hashes for better performance
    const found = knownHashes.has(hashedEmail);
    res.json({ found }); // Send true or false
});

async function startServer() {
    try {
        const CSV_FILE_PATH = 'bulk_buyer_latest.csv';
        const hashesArray = await loadHashesFromCsv(CSV_FILE_PATH);
        knownHashes = new Set(hashesArray); // Convert array to a Set for O(1) lookups

        app.listen(port, () => {
            console.log(`Server listening at http://localhost:${port}`);
        });
    } catch (error) {
        console.error("Failed to start server:", error);
        process.exit(1); // Exit if we can't load the essential data
    }
}

startServer();