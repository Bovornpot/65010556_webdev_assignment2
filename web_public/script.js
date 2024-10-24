// script.js

// Fetching drone configs and displaying in the View Config page
document.addEventListener("DOMContentLoaded", function () {
    fetchDroneConfigs();

    const prevButton = document.getElementById("prev-page");
    const nextButton = document.getElementById("next-page");

    let currentPage = 1; // เริ่มที่หน้าแรก
    const itemsPerPage = 10; // จำนวนรายการที่ต้องการแสดงต่อหน้า

    // ฟังก์ชันสำหรับโหลดข้อมูลตามหน้า
    function loadPage(page) {
        fetchDroneConfigs(page);
        // Update the page number display
        document.getElementById("page-number").innerText = "Page " + page;
    }

    if (prevButton) {
        prevButton.addEventListener("click", function () {
            if (currentPage > 1) {  
                currentPage--;
                loadPage(currentPage);
            }
        });
    }

    if (nextButton) {
        nextButton.addEventListener("click", function () {
            currentPage++;
            loadPage(currentPage);
        });
    }
});

function searchDroneConfig() {
    const input = document.getElementById("search-drone-id");
    const filter = input.value.toLowerCase(); // แปลงเป็นตัวพิมพ์เล็ก
    const table = document.getElementById("config-table");
    const rows = table.getElementsByTagName("tbody")[0].getElementsByTagName("tr");

    for (let i = 0; i < rows.length; i++) {
        const droneIdCell = rows[i].getElementsByTagName("td")[0]; // รับค่า Drone ID จากคอลัมน์แรก
        if (droneIdCell) {
            const droneId = droneIdCell.textContent || droneIdCell.innerText;
            // ถ้าค่าที่ผู้ใช้ค้นหาอยู่ใน Drone ID
            if (droneId.toLowerCase().indexOf(filter) > -1) {
                rows[i].style.display = ""; // แสดงแถว
            } else {
                rows[i].style.display = "none"; // ซ่อนแถว
            }
        }
    }
}
// Fetch drone configurations
function fetchDroneConfigs() {
    fetch("http://3.107.190.248:3000/configs/5")
        .then(response => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json();
        })
        .then(responseData => {
            const tbody = document.querySelector("#config-table tbody");
            tbody.innerHTML = ""; // Clear previous data
            
            // Accessing the data array from the response object
            const data = responseData.data; // Get the array from the response
            
            if (Array.isArray(data)) {
                data.forEach(item => {
                    const row = document.createElement("tr");
                    row.innerHTML = `
                        <td>${item.drone_id}</td>
                        <td>${item.drone_name}</td>
                        <td>${item.condition}</td>
                        <td>${item.light}</td>
                        <td>${item.max_speed !== null ? item.max_speed : 'N/A'}</td>
                        <td>${item.country}</td>
                        <td>${item.population}</td>
                    `;
                    tbody.appendChild(row);
                });
            } else {
                console.error("Expected an array but got:", data);
            }
        })
        .catch(error => console.error("Error fetching data:", error));
}
