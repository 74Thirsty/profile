// Fetch user's IP address using ipify API
async function fetchIP() {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip;
  } catch (error) {
    console.error('Error fetching IP address:', error);
    return 'Unknown IP';
  }
}

// Get user's geolocation if available
async function fetchLocation() {
  if (navigator.geolocation) {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          resolve({ latitude, longitude });
        },
        (error) => {
          console.error('Error getting location:', error);
          resolve({ latitude: 'Unknown', longitude: 'Unknown' });
        }
      );
    });
  } else {
    return { latitude: 'Unknown', longitude: 'Unknown' };
  }
}

// Collect browser and device information
function getUserAgentInfo() {
  const userAgent = navigator.userAgent;
  const browser = userAgent.match(/(firefox|msie|chrome|safari|trident|edge)/i) ? RegExp.$1 : 'Unknown Browser';
  const device = /Mobi|Android/i.test(userAgent) ? 'Mobile' : 'Desktop';
  return { browser, device };
}

// Collect referrer URL
function getReferrer() {
  return document.referrer || 'No referrer';
}

// Collect language
function getLanguage() {
  return navigator.language || 'Unknown Language';
}

// Store all collected information in localStorage
async function logVisit() {
  const ip = await fetchIP(); // Fetch user's IP address
  const location = await fetchLocation(); // Get user's location
  const { browser, device } = getUserAgentInfo(); // Get browser/device info
  const referrer = getReferrer(); // Get referrer URL
  const language = getLanguage(); // Get language

  const timestamp = Date.now(); // Record the visit timestamp

  // Prepare the log entry
  const guestbookEntry = {
    ip,
    location,
    browser,
    device,
    referrer,
    language,
    timestamp
  };

  // Retrieve the stored logs from localStorage
  let entries = JSON.parse(localStorage.getItem('guestbookLogEntries')) || [];

  // Add the new log entry
  entries.push(guestbookEntry);

  // Save the updated log entries to localStorage
  localStorage.setItem('guestbookLogEntries', JSON.stringify(entries));
}

// Display stored log entries
function displayLogEntries() {
  const entriesContainer = document.getElementById('log-entries');
  const entries = JSON.parse(localStorage.getItem('guestbookLogEntries')) || [];

  entriesContainer.innerHTML = ''; // Clear existing entries

  entries.forEach(entry => {
    const entryDiv = document.createElement('div');
    entryDiv.className = 'p-4 bg-[#0a192f]/90 rounded-lg shadow-md mb-4';
    entryDiv.innerHTML = `
      <p class="text-xl text-primary font-semibold">IP Address: ${entry.ip}</p>
      <p class="text-lg text-gray-300">Location: ${entry.location.latitude}, ${entry.location.longitude}</p>
      <p class="text-sm text-gray-400">Browser: ${entry.browser} | Device: ${entry.device}</p>
      <p class="text-xs text-gray-400">Referrer: ${entry.referrer}</p>
      <p class="text-xs text-gray-400">Language: ${entry.language}</p>
      <p class="text-xs text-gray-400">Logged at: ${new Date(entry.timestamp).toLocaleString()}</p>
    `;
    entriesContainer.appendChild(entryDiv);
  });
}

// Call logVisit on page load and display the logs
window.onload = async function () {
  await logVisit(); // Log the visit
  displayLogEntries(); // Display the stored log entries
};
