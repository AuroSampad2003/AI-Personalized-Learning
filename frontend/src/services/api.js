export const API_BASE = "http://localhost:5000";

fetch(`${API_BASE}/`)
  .then(res => res.text())
  .then(data => console.log(data)); // should log "Backend running"
// Add more API calls as needed