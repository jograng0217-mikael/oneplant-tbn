let currentMode = {}; // tracks 'increment' or 'reset' for each dial
const unitsList = ['slp3-a', 'slp3-b', 'slp3-c', 'slp3-d', 'slp4-a', 'slp4-b', 'slp4-c', 'slp4-d'];

function toggleControls(id) {
    const controls = document.getElementById(`controls-${id}`);
    if (controls.style.display === 'none' || controls.style.display === '') {
        currentMode[id] = 'increment';
        updateControlButtons(id);
        document.querySelectorAll('.control-panel').forEach(panel => panel.style.display = 'none');
        controls.style.display = 'flex';
    } else {
        controls.style.display = 'none';
    }
}

function updateControlButtons(id) {
    const controls = document.getElementById(`controls-${id}`);
    const okBtn = controls.querySelector('.btn-ok');
    const resetBtn = controls.querySelector('.btn-reset');

    if (currentMode[id] === 'reset') {
        okBtn.innerText = '초기화 확인';
        okBtn.style.backgroundColor = '#ef4444';
        if (resetBtn) resetBtn.style.display = 'none';
    } else {
        okBtn.innerText = 'OK';
        okBtn.style.backgroundColor = '#3b82f6';
        if (resetBtn) resetBtn.style.display = 'inline-block';
    }
}

function handleOk(id, slpNum) {
    if (currentMode[id] === 'reset') {
        resetCount(id);
    } else {
        increment(id, slpNum);
    }
}

function getMonthKey() {
    const now = new Date();
    return `monthly-${now.getFullYear()}-${now.getMonth() + 1}`;
}

function increment(id, slpNum) {
    // 1. Total Count
    let count = parseInt(localStorage.getItem(`count-${id}`)) || 0;
    count++;
    localStorage.setItem(`count-${id}`, count);

    // 2. Monthly Count (Per Unit)
    const monthKey = getMonthKey();
    let unitMonthlyKey = `${monthKey}-${id}`;
    let unitMonthlyTotal = parseInt(localStorage.getItem(unitMonthlyKey)) || 0;
    unitMonthlyTotal++;
    localStorage.setItem(unitMonthlyKey, unitMonthlyTotal);

    // 3. Log
    const now = new Date();
    const dateStr = `${now.getFullYear().toString().slice(-2)}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getDate().toString().padStart(2, '0')}`;
    const logText = `SLP #${slpNum} (${dateStr})`;
    localStorage.setItem(`log-${id}`, logText);

    refreshAllDisplays();
    toggleControls(id);
}

function deleteLog(id, event) {
    event.stopPropagation();

    // Decrement Total
    let count = parseInt(localStorage.getItem(`count-${id}`)) || 0;
    if (count > 0) count--;
    localStorage.setItem(`count-${id}`, count);

    // Decrement Monthly (Per Unit)
    const monthKey = getMonthKey();
    let unitMonthlyKey = `${monthKey}-${id}`;
    let unitMonthlyTotal = parseInt(localStorage.getItem(unitMonthlyKey)) || 0;
    if (unitMonthlyTotal > 0) unitMonthlyTotal--;
    localStorage.setItem(unitMonthlyKey, unitMonthlyTotal);

    // Clear Log
    localStorage.removeItem(`log-${id}`);

    refreshAllDisplays();
}

function requestReset(id) {
    currentMode[id] = 'reset';
    updateControlButtons(id);
}

function resetCount(id) {
    localStorage.setItem(`count-${id}`, 0);

    const monthKey = getMonthKey();
    localStorage.setItem(`${monthKey}-${id}`, 0);
    localStorage.removeItem(`log-${id}`);

    refreshAllDisplays();
    toggleControls(id);
}

function refreshAllDisplays() {
    unitsList.forEach(id => {
        const count = localStorage.getItem(`count-${id}`) || 0;
        const display = document.getElementById(`count-${id}`);
        if (display) display.innerText = `누적 ${count}회`;

        const log = localStorage.getItem(`log-${id}`) || '-';
        updateLogBoxUI(id, log);
    });

    const monthKey = getMonthKey();
    let globalMonthlyTotal = 0;
    unitsList.forEach(id => {
        globalMonthlyTotal += parseInt(localStorage.getItem(`${monthKey}-${id}`)) || 0;
    });

    const monthlyDisplay = document.getElementById('monthly-inspection-count');
    if (monthlyDisplay) monthlyDisplay.innerText = `${globalMonthlyTotal}번`;
}

function updateLogBoxUI(id, text) {
    const logContainer = document.getElementById(`log-${id}`);
    if (logContainer) {
        if (text === '-') {
            logContainer.innerHTML = '-';
        } else {
            logContainer.innerHTML = `
                ${text}
                <div class="close-btn" onclick="deleteLog('${id}', event)">X</div>
            `;
        }
    }
}

function toggleMonthlyLog() {
    document.body.classList.toggle('show-logs');
}

// Initialize counts on page load
document.addEventListener('DOMContentLoaded', () => {
    refreshAllDisplays();
});
