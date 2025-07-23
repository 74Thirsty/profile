// Function to fetch user's IP on page load
function fetchIP() {
  fetch('https://api.ipify.org?format=json') // Request to the ipify API
    .then(response => response.json())     // Parse the JSON response
    .then(data => {
      const userIP = data.ip;               // Extract the IP address from the response
      storeGuestbookData(userIP);           // Store IP with the other data
    })
    .catch(error => {
      console.error("Error fetching IP:", error);
    });
}

// Store guestbook data in localStorage (including IP)
function storeGuestbookData(userIP) {
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;

  if (name && email) {
    const guestbookEntry = {
      name: name,
      email: email,
      ip: userIP,
      timestamp: new Date().toISOString()  // Add timestamp
    };

    // Get existing entries or create a new array
    let entries = JSON.parse(localStorage.getItem('guestbookEntries')) || [];
    entries.push(guestbookEntry);
    localStorage.setItem('guestbookEntries', JSON.stringify(entries));

    // Clear form after submission
    document.getElementById('guestbookForm').reset();

    // Display the updated guestbook entries
    displayGuestbookEntries();
  }
}

// Display guestbook entries
function displayGuestbookEntries() {
  const entries = JSON.parse(localStorage.getItem('guestbookEntries')) || [];
  const entriesContainer = document.getElementById('entries');
  entriesContainer.innerHTML = '';

  entries.forEach(entry => {
    const entryDiv = document.createElement('div');
    entryDiv.classList.add('p-4', 'my-4', 'bg-[#1A1A1A]', 'rounded-xl');
    entryDiv.innerHTML = `
      <p><strong>Name:</strong> ${entry.name}</p>
      <p><strong>Email:</strong> ${entry.email}</p>
      <p><strong>IP Address:</strong> ${entry.ip}</p>
      <p><strong>Timestamp:</strong> ${entry.timestamp}</p>
    `;
    entriesContainer.appendChild(entryDiv);
  });
}

// Call the IP fetching function on page load
window.onload = function() {
  fetchIP();
  displayGuestbookEntries(); // Load existing entries from localStorage
};

// Form submission
document.getElementById('guestbookForm').addEventListener('submit', function(event) {
  event.preventDefault();
  fetchIP(); // Fetch the IP address when the form is submitted
});
