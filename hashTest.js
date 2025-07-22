const crypto = require('crypto');
const readline = require('readline');
const fs = require('fs');
const { parse } = require('csv-parse'); // Import parse from csv-parse

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const CSV_FILE_PATH = 'bulk_buyer_latest.csv'; // Make sure this path is correct

/**
 * Loads a list of SHA-256 hashes from a CSV file.
 * Assumes the CSV has one hash per line, possibly with leading/trailing whitespace.
 *
 * @param {string} filePath - The path to the CSV file.
 * @returns {Promise<string[]>} A promise that resolves with an array of lowercase hashes.
 */
async function loadHashesFromCsv(filePath) {
  return new Promise((resolve, reject) => {
    const hashes = [];
    fs.createReadStream(filePath)
      .pipe(parse({ columns: false, trim: true, skip_empty_lines: true }))
      .on('data', (row) => {
        // Assuming each row in your CSV is just one hash in the first column
        if (row.length > 0 && typeof row[0] === 'string') {
          hashes.push(row[0].toLowerCase()); // Store in lowercase for consistent comparison
        }
      })
      .on('end', () => {
        console.log(`Loaded ${hashes.length} hashes from ${filePath}`);
        resolve(hashes);
      })
      .on('error', (error) => {
        console.error(`Error reading CSV file at ${filePath}: ${error.message}`);
        reject(error);
      });
  });
}

/**
 * Main function to run the hash generation and validation logic.
 */
async function main() {
  let knownHashes = [];
  try {
    // Load hashes from the CSV file
    knownHashes = await loadHashesFromCsv(CSV_FILE_PATH);
  } catch (error) {
    console.error("\nCould not load known hashes. Please ensure 'hashes.csv' exists and is correctly formatted. Exiting.");
    rl.close();
    return;
  }

  rl.question("Enter the value to hash: ", (val) => {
    // Create the SHA-256 hash (lowercased)
    const newHash = crypto.createHash('sha256').update(val.toLowerCase()).digest('hex');

    // Output the hash
    console.log(`\nSHA-256 hash of '${val.toLowerCase()}' is: ${newHash}`);

    // Validate if the new hash exists in the loaded list
    if (knownHashes.includes(newHash)) {
      console.log(`\n✅ The generated hash '${newHash}' IS PRESENT in '${CSV_FILE_PATH}'.`);
    } else {
      console.log(`\n❌ The generated hash '${newHash}' IS NOT present in '${CSV_FILE_PATH}'.`);
    }

    rl.close();
  });
}

// Run the main function when the script starts
main();