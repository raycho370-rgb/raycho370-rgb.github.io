(() => {
  const canvas = document.querySelector('#game-canvas');
  const context = canvas.getContext('2d');
  const overlay = document.querySelector('#game-overlay');
  const startButton = document.querySelector('#start-button');
  const pauseButton = document.querySelector('#pause-button');
  const restartButton = document.querySelector('#restart-button');
  const scoreElement = document.querySelector('#score');
  const highScoreElement = document.querySelector('#high-score');
  const statusElement = document.querySelector('#game-status');
  const gridSize = 20;
  const cellSize = canvas.width / gridSize;
  const highScoreKey = 'signal-runner-high-score';
  const directions = { up: { x: 0, y: -1 }, down: { x: 0, y: 1 }, left: { x: -1, y: 0 }, right: { x: 1, y: 0 } };
  let snake = [];
  let food = { x: 0, y: 0 };
  let enemy = { x: 4, y: 4 };
  let direction = directions.right;
  let queuedDirection = direction;
  let score = 0;
  let highScore = readHighScore();
  let gameTimer = null;
  let isRunning = false;
  let isPaused = false;

  function readHighScore() {
    try { return Number.parseInt(window.localStorage.getItem(highScoreKey) || '0', 10) || 0; } catch { return 0; }
  }

  function writeHighScore() {
    try { window.localStorage.setItem(highScoreKey, String(highScore)); } catch { /* Storage can be unavailable in private contexts. */ }
  }

  const sameCell = (a, b) => a.x === b.x && a.y === b.y;
  const randomCell = () => ({ x: Math.floor(Math.random() * gridSize), y: Math.floor(Math.random() * gridSize) });
  const occupied = (cell) => snake.some((segment) => sameCell(segment, cell)) || sameCell(enemy, cell);
  const placeFood = () => { let next; do { next = randomCell(); } while (occupied(next)); return next; };
  const stopTimer = () => { if (gameTimer !== null) { clearInterval(gameTimer); gameTimer = null; } };

  function updateScore() {
    scoreElement.textContent = score;
    highScoreElement.textContent = highScore;
  }

  function resetGame() {
    snake = [{ x: 10, y: 10 }, { x: 9, y: 10 }, { x: 8, y: 10 }];
    direction = directions.right;
    queuedDirection = direction;
    enemy = { x: 4, y: 4 };
    food = placeFood();
    score = 0;
    updateScore();
    draw();
  }

  function startGame() {
    stopTimer();
    resetGame();
    isRunning = true;
    isPaused = false;
    overlay.classList.add('is-hidden');
    pauseButton.disabled = false;
    pauseButton.textContent = 'Pause';
    startButton.textContent = 'Start game';
    statusElement.textContent = 'Signal is live';
    gameTimer = setInterval(tick, 150);
  }

  function endGame(message = 'Connection lost') {
    stopTimer();
    isRunning = false;
    isPaused = false;
    pauseButton.disabled = true;
    pauseButton.textContent = 'Pause';
    if (score > highScore) { highScore = score; writeHighScore(); updateScore(); }
    statusElement.textContent = message;
    overlay.querySelector('p').innerHTML = `${message}.<br />Final score: ${score}`;
    startButton.textContent = 'Play again';
    overlay.classList.remove('is-hidden');
  }

  function togglePause() {
    if (!isRunning) return;
    if (isPaused) {
      isPaused = false;
      pauseButton.textContent = 'Pause';
      statusElement.textContent = 'Signal is live';
      gameTimer = setInterval(tick, 150);
    } else {
      isPaused = true;
      stopTimer();
      pauseButton.textContent = 'Resume';
      statusElement.textContent = 'Paused';
    }
  }

  function setDirection(nextDirection) {
    const next = directions[nextDirection];
    const active = queuedDirection || direction;
    if (!next || (next.x + active.x === 0 && next.y + active.y === 0)) return;
    queuedDirection = next;
  }

  function moveEnemy() {
    const candidates = Object.values(directions).filter((candidate) => {
      const next = { x: enemy.x + candidate.x, y: enemy.y + candidate.y };
      return next.x >= 0 && next.x < gridSize && next.y >= 0 && next.y < gridSize && !snake.some((segment) => sameCell(segment, next));
    });
    if (!candidates.length) return;
    const next = candidates[Math.floor(Math.random() * candidates.length)];
    enemy = { x: enemy.x + next.x, y: enemy.y + next.y };
  }

  function tick() {
    if (!isRunning || isPaused) return;
    direction = queuedDirection;
    const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };
    const hitWall = head.x < 0 || head.x >= gridSize || head.y < 0 || head.y >= gridSize;
    const hitSelf = snake.some((segment) => sameCell(segment, head));
    if (hitWall || hitSelf || sameCell(head, enemy)) { endGame(sameCell(head, enemy) ? 'The scout found you' : 'Signal lost'); return; }
    snake.unshift(head);
    if (sameCell(head, food)) { score += 10; food = placeFood(); } else snake.pop();
    moveEnemy();
    if (sameCell(snake[0], enemy)) { endGame('The scout found you'); return; }
    updateScore();
    draw();
  }

  function drawCell(cell, color, radius = 4) {
    const x = cell.x * cellSize + 3;
    const y = cell.y * cellSize + 3;
    const size = cellSize - 6;
    context.fillStyle = color;
    context.beginPath();
    context.roundRect(x, y, size, size, radius);
    context.fill();
  }

  function draw() {
    context.fillStyle = '#102039';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.strokeStyle = 'rgba(159, 186, 221, .07)';
    context.lineWidth = 1;
    for (let i = 1; i < gridSize; i += 1) { context.beginPath(); context.moveTo(i * cellSize, 0); context.lineTo(i * cellSize, canvas.height); context.stroke(); context.beginPath(); context.moveTo(0, i * cellSize); context.lineTo(canvas.width, i * cellSize); context.stroke(); }
    drawCell(food, '#f6c85f', 8);
    drawCell(enemy, '#ff7a8a', 5);
    snake.forEach((segment, index) => drawCell(segment, index === 0 ? '#8fe8d6' : '#32b8a5', 5));
  }

  function createLetterRain() {
    const rain = document.querySelector('#letter-rain');
    if (!rain || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const phrases = ['Build with care', 'Ideas find a path', 'Systems serve people', 'Curiosity keeps moving', 'Signals find meaning', 'Make space for wonder', 'Reliable by design', 'Keep learning forward', 'Small steps compound'];
    const fragment = document.createDocumentFragment();
    for (let index = 0; index < 18; index += 1) {
      const letter = document.createElement('span');
      letter.className = 'rain-phrase';
      letter.textContent = phrases[index % phrases.length];
      letter.style.left = `${Math.random() * 100}%`;
      letter.style.setProperty('--drift', `${Math.round((Math.random() - 0.5) * 90)}px`);
      letter.style.animationDelay = `${Math.random() * -18}s`;
      letter.style.animationDuration = `${12 + Math.random() * 12}s`;
      letter.style.fontSize = `${0.58 + Math.random() * 0.38}rem`;
      fragment.appendChild(letter);
    }
    rain.appendChild(fragment);
  }

  document.addEventListener('keydown', (event) => {
    const keyMap = { ArrowUp: 'up', w: 'up', W: 'up', ArrowDown: 'down', s: 'down', S: 'down', ArrowLeft: 'left', a: 'left', A: 'left', ArrowRight: 'right', d: 'right', D: 'right' };
    if (event.key === ' ' || event.key === 'p' || event.key === 'P') { event.preventDefault(); togglePause(); return; }
    if (keyMap[event.key]) { event.preventDefault(); if (!isRunning && !isPaused) startGame(); if (isRunning && !isPaused) setDirection(keyMap[event.key]); }
  });
  document.querySelectorAll('[data-direction]').forEach((button) => button.addEventListener('click', () => { if (!isRunning && !isPaused) startGame(); if (isRunning && !isPaused) setDirection(button.dataset.direction); }));
  startButton.addEventListener('click', startGame);
  pauseButton.addEventListener('click', togglePause);
  restartButton.addEventListener('click', startGame);
  resetGame();
  createLetterRain();
})();
