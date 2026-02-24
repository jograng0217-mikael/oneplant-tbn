function updateClock() {
    const now = new Date();
    document.getElementById('clock').innerText = now.toLocaleTimeString('ko-KR', { hour12: false });
}

setInterval(updateClock, 1000);
updateClock();

function handleAction(type, url = null) {
    if (url) {
        window.open(url, '_blank');
    } else {
        // Fallback for buttons without specific URLs
        alert(`'원프랜트' 통합 운영 시스템:\n\n${type} 관련 모듈을 로드합니다.`);
    }
}
