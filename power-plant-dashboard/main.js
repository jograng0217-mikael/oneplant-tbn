// Clock functions removed as per UI refinement

function handleAction(type, url = null) {
    if (url) {
        window.open(url, '_blank');
    } else if (type === '작업지시서') {
        window.location.href = 'work-order.html';
    } else if (type === 'MBCW') {
        window.location.href = 'mbcw.html';
    } else {
        // Fallback for buttons without specific URLs
        alert(`'원프랜트' 통합 운영 시스템:\n\n${type} 관련 모듈을 로드합니다.`);
    }
}
