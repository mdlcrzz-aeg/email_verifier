# EMAIL VERIFIER

This project provides a simple web application to check if an email address exists within a predefined list of bulk buyers. The check is performed securely by comparing SHA-256 hashes, so the raw email addresses are never exposed on the client-side or in the server's memory.

It also includes a command-line utility to generate a SHA-256 hash for a given string and check it against the same list.

## Prerequisites

- Node.js (v18 or later is recommended, as per `package-lock.json` dependencies)
- npm (usually comes with Node.js)

## Setup

1.  **Install dependencies:**
    ```bash
    npm install
    ```

2.  **Prepare the data file:**
    - Ensure you have a CSV file named `bulk_buyer_latest.csv` or a similar file with hashed emails in the project's root directory.
    - This file should contain one SHA-256 hash per line. The server and scripts will load these hashes to check against.

## Running the program

### Web Application

1.  **Start the server:**
    ```bash
    node server.js
    ```
    You should see a confirmation message: `Server listening at http://localhost:3000`.

2.  **Use the application:**
    - Open your web browser and navigate to `http://localhost:3000`.
    - Enter an email address in the form and click "Submit" to see if it's on the bulk buyer list.

3.  **Stop the server:**
    - To stop the server, go back to the terminal where it is running and press `Ctrl+C`.

### Command-Line Tool

The `hashTest.js` script allows you to generate a hash for any string and check if it exists in the `bulk_buyer_latest.csv` file.

Runs the program in your terminal
```bash
node hashTest.js
```

Runs the program in the server
```
node server.js
```
