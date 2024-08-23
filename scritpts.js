function setCurrentMonth() {
    const monthInput = document.getElementById('month');
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 2).toString().padStart(2, '0');
    monthInput.value = `${year}-${month}`;
    generateCalendar();
}

function generateCalendar() {
    const monthInput = document.getElementById('month').value;
    const [year, month] = monthInput.split('-').map(Number);
    const calendarDiv = document.getElementById('calendar');
    calendarDiv.innerHTML = '';

    const daysInMonth = new Date(year, month, 0).getDate();

    for (let day = 1; day <= daysInMonth; day++) {
        const dayDiv = document.createElement('div');
        dayDiv.classList.add('day');
        dayDiv.textContent = day;

        dayDiv.onclick = () => {
            if (dayDiv.classList.contains('selected')) {
                dayDiv.classList.remove('selected');
                removeTimeInput(day);
            } else {
                dayDiv.classList.add('selected');
                addTimeInput(day);
            }
        };

        calendarDiv.appendChild(dayDiv);
    }
}

function addTimeInput(day) {
    const timeFormDiv = document.getElementById('timeForm');
    const timeDiv = document.createElement('div');
    timeDiv.classList.add('time-input');
    timeDiv.id = `time_${day}`;

    const label = document.createElement('label');
    label.textContent = `${day}日の出勤可能な時間帯:`;

    const input = document.createElement('input');
    input.type = 'text';
    input.value = '08:00-20:00';

    timeDiv.appendChild(label);
    timeDiv.appendChild(input);
    timeFormDiv.appendChild(timeDiv);
}

function removeTimeInput(day) {
    const timeDiv = document.getElementById(`time_${day}`);
    timeDiv.remove();
}

function submitShift() {
    const monthInput = document.getElementById('month').value;
    const [year, month] = monthInput.split('-').map(Number);
    const selectedDays = document.querySelectorAll('.day.selected');
    const outputTextarea = document.getElementById('output');
    
    let outputText = '';

    selectedDays.forEach(dayDiv => {
        const day = dayDiv.textContent.padStart(2, '0');
        const timeInput = document.querySelector(`#time_${day} input`);
        const time = timeInput.value;
        if (time) {
            outputText += `${year}-${month.toString().padStart(2, '0')}-${day} ${time}\n`;
        }
    });

    outputTextarea.value = outputText;
}
