let selectedDays = {};  // 選択された日付と対応する時間を保持するオブジェクト

function setCurrentMonth() {
    const monthInput = document.getElementById('month');
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    monthInput.value = `${year}-${month}`;
    generateCalendar();
}

function generateCalendar() {
    const monthInput = document.getElementById('month').value;
    const [year, month] = monthInput.split('-').map(Number);
    const calendarDiv = document.getElementById('calendar');
    calendarDiv.innerHTML = '';

    const daysInMonth = new Date(year, month, 0).getDate();
    const firstDay = new Date(year, month - 1, 1).getDay();  // 1日の曜日

    // 曜日のヘッダー
    const daysOfWeek = ['日', '月', '火', '水', '木', '金', '土'];
    daysOfWeek.forEach(day => {
        const dayHeader = document.createElement('div');
        dayHeader.classList.add('day-header');
        dayHeader.textContent = day;
        calendarDiv.appendChild(dayHeader);
    });

    // 空のセルを追加して1日の位置を調整
    for (let i = 0; i < firstDay; i++) {
        const emptyDiv = document.createElement('div');
        emptyDiv.classList.add('day');
        calendarDiv.appendChild(emptyDiv);
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const dayDiv = document.createElement('div');
        dayDiv.classList.add('day');
        dayDiv.textContent = day;

        dayDiv.onclick = () => {
            if (dayDiv.classList.contains('selected')) {
                dayDiv.classList.remove('selected');
                delete selectedDays[day];  // 日付を選択解除する際に時間情報を削除
                updateTimeForm();
            } else {
                dayDiv.classList.add('selected');
                if (!selectedDays[day]) {
                    selectedDays[day] = { start: '08:00', end: '20:00' };  // デフォルトの時間を設定
                }
                updateTimeForm();
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

    const startInput = document.createElement('input');
    startInput.type = 'time';
    startInput.id = `start_${day}`;
    startInput.value = selectedDays[day]?.start || '08:00';  // 既存の時間を設定、デフォルト値は'08:00'

    const endInput = document.createElement('input');
    endInput.type = 'time';
    endInput.id = `end_${day}`;
    endInput.value = selectedDays[day]?.end || '20:00';  // 既存の時間を設定、デフォルト値は'20:00'

    startInput.onchange = () => {
        selectedDays[day].start = startInput.value;  // 時間が変更されたときにオブジェクトを更新
    };

    endInput.onchange = () => {
        selectedDays[day].end = endInput.value;  // 時間が変更されたときにオブジェクトを更新
    };

    timeDiv.appendChild(label);
    timeDiv.appendChild(startInput);
    timeDiv.appendChild(endInput);
    timeFormDiv.appendChild(timeDiv);
}

function removeTimeInput(day) {
    const timeDiv = document.getElementById(`time_${day}`);
    if (timeDiv) {
        timeDiv.remove();
    }
}

function updateTimeForm() {
    const timeFormDiv = document.getElementById('timeForm');
    timeFormDiv.innerHTML = ''; // 既存の時間入力フィールドをクリア

    const sortedDays = Object.keys(selectedDays).sort((a, b) => a - b);

    sortedDays.forEach(day => {
        addTimeInput(Number(day));  // 時間入力フィールドを追加
    });
}

function submitShift() {
    const monthInput = document.getElementById('month').value;
    const [year, month] = monthInput.split('-').map(Number);
    const outputTextarea = document.getElementById('output');
    
    let outputText = '';

    Object.keys(selectedDays).forEach(day => {
        const startTime = selectedDays[day].start;
        const endTime = selectedDays[day].end;
        outputText += `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')} ${startTime}-${endTime}\n`;
    });

    outputTextarea.value = outputText;
    
    // 選択状態と時間をクリア
    selectedDays = {};
    document.querySelectorAll('.day.selected').forEach(dayDiv => {
        dayDiv.classList.remove('selected');
    });
    updateTimeForm();
}
