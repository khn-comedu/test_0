document.addEventListener('DOMContentLoaded', () => {
    const elements = {
        startModal: document.getElementById('start-modal'),
        gameContainer: document.getElementById('game-container'),
        inventory: document.getElementById('inventory'),
        modalContainer: document.getElementById('modal-container'),
        successScreen: document.getElementById('success-screen'),
        startButton: document.getElementById('start-button'),
        closeModalBtn: document.getElementById('close-modal-btn'),
        getHintBtn: document.getElementById('get-hint-btn'),
        finalSubmitBtn: document.getElementById('final-submit-btn'),
        clickableObjects: document.querySelectorAll('.clickable-object'),
        submitBtns: document.querySelectorAll('.submit-btn'),
        memoryGrid: document.getElementById('memory-grid'),
        memoryMessage: document.getElementById('memory-message'),
        hintList: document.getElementById('hint-list')
    };
    const gameState = {
        collectedHints: {},
        FINAL_PASSWORD: "2025",
        playerInfo: {},
        startTime: null,
        memoryCards: ['🦁', '🦁', '🕷️', '🕷️', '🐸', '🐸', '🦊', '🦊'],
        flippedCards: [],
        matchedPairs: 0
    };
    elements.startButton.addEventListener('click', () => {
        const name = document.getElementById('player-name').value;
        if (!name) { alert("이름을 입력해야 합니다."); return; }
        gameState.playerInfo = {
            grade: document.getElementById('player-grade').value || '미입력',
            p_class: document.getElementById('player-class').value || '미입력',
            name: name,
        };
        elements.startModal.classList.add('hidden');
        elements.gameContainer.classList.remove('hidden');
        elements.inventory.classList.remove('hidden');
        gameState.startTime = new Date();
    });
    elements.clickableObjects.forEach(obj => obj.addEventListener('click', e => showPuzzle(e.currentTarget.dataset.puzzle)));
    elements.closeModalBtn.addEventListener('click', closePuzzle);
    elements.getHintBtn.addEventListener('click', () => {
        addHint('puzzle-hint', "알 수 없는 소음: 실험 시작년도는 2025년...?");
        closePuzzle();
    });
    elements.submitBtns.forEach(btn => {
        btn.addEventListener('click', e => {
            const type = e.currentTarget.dataset.type;
            const correctAnswer = e.currentTarget.dataset.answer;
            const userAnswer = document.getElementById(`answer-${type}`).value.trim().toLowerCase();
            if (userAnswer === correctAnswer) {
                alert("...정답.");
                let hintText = "";
                switch(type) {
                    case 'animal1': hintText = "기록: LION 프로젝트 성공"; break;
                    case 'animal2': hintText = "정보: 실험체 S-P-8의 다리 8개"; break;
                    case 'animal3': hintText = "분석: 거대 생체 에너지 (고래)"; break;
                    case 'animal4': hintText = "서랍: 어둠 속 비행 생명체 (박쥐)"; break;
                }
                addHint(`puzzle-${type}`, hintText);
                closePuzzle();
            } else { alert("...오답."); }
        });
    });
    elements.finalSubmitBtn.addEventListener('click', () => {
        if (document.getElementById('final-password').value === gameState.FINAL_PASSWORD) {
            const timeDiff = Math.round((new Date() - gameState.startTime) / 1000);
            document.getElementById('player-info-final').textContent = `${gameState.playerInfo.grade}학년 ${gameState.playerInfo.p_class}반`;
            document.getElementById('player-name-final').textContent = gameState.playerInfo.name;
            document.getElementById('play-time').textContent = `${Math.floor(timeDiff / 60)}분 ${timeDiff % 60}초`;
            elements.gameContainer.classList.add('hidden');
            elements.inventory.classList.add('hidden');
            closePuzzle();
            elements.successScreen.classList.remove('hidden');
        } else { alert("경고: 비밀번호 불일치."); }
    });
    function showPuzzle(puzzleId) {
        if (gameState.collectedHints[puzzleId] && puzzleId !== 'puzzle-final') { alert("이미 확인했다."); return; }
        elements.modalContainer.style.display = 'flex';
        document.querySelectorAll('.puzzle-item').forEach(p => p.classList.add('hidden'));
        document.getElementById(puzzleId).classList.remove('hidden');
        if (puzzleId === 'puzzle-memory') startMemoryGame();
    }
    function closePuzzle() { elements.modalContainer.style.display = 'none'; }
    function addHint(id, text) { if (!gameState.collectedHints[id]) { gameState.collectedHints[id] = text; updateInventory(); } }
    function updateInventory() {
        elements.hintList.innerHTML = '';
        Object.values(gameState.collectedHints).forEach(hint => {
            const li = document.createElement('li');
            li.textContent = `> ${hint}`;
            elements.hintList.appendChild(li);
        });
    }
    function startMemoryGame() {
        gameState.matchedPairs = 0;
        gameState.flippedCards = [];
        elements.memoryMessage.textContent = "";
        elements.memoryGrid.innerHTML = '';
        let cards = [...gameState.memoryCards].sort(() => 0.5 - Math.random());
        cards.forEach(symbol => {
            const card = document.createElement('div');
            card.classList.add('memory-card');
            card.dataset.symbol = symbol;
            card.textContent = symbol;
            card.addEventListener('click', () => {
                if (gameState.flippedCards.length < 2 && !card.classList.contains('flipped')) {
                    card.classList.add('flipped');
                    gameState.flippedCards.push(card);
                    if (gameState.flippedCards.length === 2) setTimeout(checkMatch, 700);
                }
            });
            elements.memoryGrid.appendChild(card);
        });
    }
    function checkMatch() {
        const [card1, card2] = gameState.flippedCards;
        if (card1.dataset.symbol === card2.dataset.symbol) {
            card1.classList.add('matched');
            card2.classList.add('matched');
            gameState.matchedPairs++;
            if (gameState.matchedPairs === gameState.memoryCards.length / 2) {
                elements.memoryMessage.textContent = "안정화 성공!";
                addHint('puzzle-memory', "기록: 숫자 '20'과 '25' 발견");
                setTimeout(closePuzzle, 1500);
            }
        } else {
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
        }
        gameState.flippedCards = [];
    }
});