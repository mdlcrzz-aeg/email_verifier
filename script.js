const form = document.getElementById('emailForm');
const resultDiv = document.getElementById('result'); // Get the result div

form.addEventListener('submit', async function(event) {
    event.preventDefault(); // Prevent the default form submission
    
    const emailInput = document.getElementById('email');
    const email = emailInput.value;

    if (email) {
        resultDiv.textContent = 'Checking...'; // Give feedback while waiting
        resultDiv.className = '';
        const result = await checkEmailOnServer(email);

        // If checkEmailOnServer returned null, it means an error occurred and was handled.
        if (result === null) return;

        if (result) {
            resultDiv.textContent = 'This email IS in the bulk buyer list.';
            resultDiv.className = 'error'; // Use a class for styling (red)
        } else {
            resultDiv.textContent = 'This email is NOT in the bulk buyer list.';
            resultDiv.className = 'success'; // Use a class for styling (green)
        }
    } else {
        resultDiv.textContent = 'Please enter a valid email address.';
        resultDiv.className = 'error';
    }
});

// Add a listener for the reset button to clear the message
form.addEventListener('reset', function() {
    resultDiv.textContent = '';
    resultDiv.className = '';
});

async function checkEmailOnServer(email) {
    try {
        const response = await fetch('http://localhost:3000/check-email', { // Explicit port 3000
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        });
        if (!response.ok) {
            throw new Error(`Server error: ${response.statusText}`);
        }
        const data = await response.json();
        return data.found; // Return true/false
    } catch (error) {
        console.error("Error checking email:", error);
        resultDiv.textContent = "Error checking email. Please try again.";
        resultDiv.className = 'error';
        return null; // Indicate an error occurred
    }
}