const participants = ["Laura", "Marjaana", "Jarkko"];
const startDate = new Date(2025, 0, 14); // January 13, 2025
const endDate = new Date(2025, 2, 29);  // March 28, 2025
const totalDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;

let currentDate = new Date(); // Default to today's date
let data = {};

// Ensure that currentDate is within the challenge range
if (currentDate < startDate) {
    currentDate = new Date(startDate); // Show the start date if before start
} else if (currentDate > endDate) {
    currentDate = new Date(endDate); // Show the end date if after the end
}

document.addEventListener("DOMContentLoaded", () => {
    updateDateDisplay();
    updateProgressBar();
    generateTable();
    setDatePicker();
});

// Set the Date Picker to match the current date and handle changes
function setDatePicker() {
    const datePicker = document.getElementById("datePicker");
    const formattedDate = currentDate.toISOString().split("T")[0]; // format date as yyyy-mm-dd
    datePicker.value = formattedDate;

    datePicker.addEventListener("change", (e) => {
        const selectedDate = new Date(e.target.value);
        if (selectedDate >= startDate && selectedDate <= endDate) {
            currentDate = selectedDate;
            updateDateDisplay();
            updateProgressBar();
            generateTable();
        }
    });
}

// Previous and Next Day navigation
document.getElementById("prevDay").addEventListener("click", () => {
    if (currentDate > startDate) {
        currentDate.setDate(currentDate.getDate() - 1);
        updateDateDisplay();
        updateProgressBar();
        generateTable();
    }
});

document.getElementById("nextDay").addEventListener("click", () => {
    if (currentDate < endDate) {
        currentDate.setDate(currentDate.getDate() + 1);
        updateDateDisplay();
        updateProgressBar();
        generateTable();
    }
});

document.getElementById("prev5Days").addEventListener("click", () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() - 5);
    if (newDate >= startDate) {
        currentDate = newDate;
        updateDateDisplay();
        updateProgressBar();
        generateTable();
    }
});

// Skip 5 Days Forward
document.getElementById("next5Days").addEventListener("click", () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + 5);
    if (newDate <= endDate) {
        currentDate = newDate;
        updateDateDisplay();
        updateProgressBar();
        generateTable();
    }
});

// Update the Date Display
function updateDateDisplay() {
    const formattedDate = currentDate.toLocaleDateString("en-GB"); // dd/mm/yyyy format
    document.getElementById("currentDate").textContent = formattedDate;
}

// Update the Progress Bar
function updateProgressBar() {
    const daysCompleted = Math.ceil((currentDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
    const progressPercent = Math.min((daysCompleted / totalDays) * 100, 100);
    document.getElementById("progressFill").style.width = `${progressPercent}%`;
    document.getElementById("progressText").textContent = `${Math.round(progressPercent)}% Completed (${daysCompleted}/${totalDays} days)`;
}

// Generate the Challenge Table for the current date
function generateTable() {
    const dateKey = currentDate.toISOString().split("T")[0]; // Key to store data for the current date
    if (!data[dateKey]) {
        data[dateKey] = participants.map(name => ({
            name,
            water: false,
            book: false,
            exercise: false,
            comments: ""
        }));
    }

    const tableBody = document.getElementById("challengeTable");
    tableBody.innerHTML = "";

    data[dateKey].forEach((entry, index) => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${entry.name}</td>
            <td><button class="${entry.water ? 'completed' : ''}" onclick="toggleTask('${dateKey}', ${index}, 'water')">${entry.water ? 'Completed' : 'Incomplete'}</button></td>
            <td><button class="${entry.book ? 'completed' : ''}" onclick="toggleTask('${dateKey}', ${index}, 'book')">${entry.book ? 'Completed' : 'Incomplete'}</button></td>
            <td><button class="${entry.exercise ? 'completed' : ''}" onclick="toggleTask('${dateKey}', ${index}, 'exercise')">${entry.exercise ? 'Completed' : 'Incomplete'}</button></td>
            <td>
                <textarea onchange="updateComments('${dateKey}', ${index}, this.value)">${entry.comments}</textarea>
            </td>
        `;

        tableBody.appendChild(row);
    });
}

// Toggle task completion (water, book, exercise)
function toggleTask(dateKey, index, task) {
    data[dateKey][index][task] = !data[dateKey][index][task];
    generateTable();
}

// Update comments for each participant
function updateComments(dateKey, index, value) {
    data[dateKey][index].comments = value;
}
