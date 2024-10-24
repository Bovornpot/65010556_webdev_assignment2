// script2.js

// Function to submit log data
function submitLog(event) {
    event.preventDefault();

    const droneId = document.getElementById("drone_id").value;
    const droneName = document.getElementById("drone_name").value;
    const country = document.getElementById("country").value;
    const celsius = document.getElementById("celsius").value;

    const logData = {
        drone_id: droneId,
        drone_name: droneName,
        country: country,
        celsius: celsius
    };

    // Send the log data to the server
    fetch('http://3.107.190.248:3000/logs', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(logData)
    })
    .then(response => {
        if (response.ok) {
            alert("Log submitted successfully!");
            console.log("Data submitted successfully:", logData);
            document.getElementById("logForm").reset(); // Reset the form

            // Fetch logs again to update the View Logs page
            fetchLogs(); // Check if logsTableBody exists before calling fetchLogs
        } else {
            alert("Error submitting log.");
            console.log("Response:", response);
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

// Function to fetch logs from the server
function fetchLogs() {
    const logsTableBody = document.querySelector('#logs-table tbody');

    if (!logsTableBody) {
        console.error('Error: logsTableBody not found');
        return; // Exit if tbody not found
    }

    fetch('http://3.107.190.248:3000/logs')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log("Logs Data:", data);  // Log the entire data structure
            logsTableBody.innerHTML = ''; // Clear the table before adding new data
            // data.reverse();

            // ตรวจสอบโครงสร้างของข้อมูลที่ได้รับ
            console.log(data);  // Log the full response to understand its structure
            if (data && Array.isArray(data)) { // หรือ data.logs ตามที่คาดไว้
                data.forEach(log => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${log.created}</td>
                        <td>${log.country}</td>
                        <td>${log.drone_id}</td>
                        <td>${log.drone_name}</td>
                        <td>${log.celsius}</td>
                    `;
                    logsTableBody.appendChild(row);
                });
            } else {
                console.error('Error: Unexpected data structure', data);
            }
        })
        .catch(error => {
            console.error('Error fetching logs:', error);
        });
}



// Event listener for DOMContentLoaded
document.addEventListener("DOMContentLoaded", function () {
    // Only fetch logs if on the View Logs page
    if (document.title === "View Logs") {
        fetchLogs();
    }

    // Event listeners for pagination buttons
    const prevButton = document.getElementById("prev-page");
    const nextButton = document.getElementById("next-page");

    if (prevButton) {
        prevButton.addEventListener("click", function () {
            console.log("Previous page clicked");
            // Logic to go to the previous page can be added here
        });
    }

    if (nextButton) {
        nextButton.addEventListener("click", function () {
            console.log("Next page clicked");
            // Logic to go to the next page can be added here
        });
    }
});
