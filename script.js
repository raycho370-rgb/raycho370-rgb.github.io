(() => {
  const canvas = document.querySelector('#game-canvas');
  const context = canvas.getContext('2d');
  const overlay = document.querySelector('#game-overlay');
  const startButton = document.querySelector('#start-button');
  const scoreElement = document.querySelector('#score');
  const statusElement = document.querySelector('#game-status');
  const gridSize = 20;
  const cellSize = canvas.width / gridSize;
  const directions = { up: { x: 0, y: -1 }, down: { x: 0, y: 1 }, left: { x: -1, y: 0 }, right: { x: 1, y: 0 } };
  let snake, food, enemy, direction, queuedDirection, score, gameTimer, isRunning;

  const sameCell = (a, b) => a.x === b.x && a.y === b.y;
  const randomCell = () => ({ x: Math.floor(Math.random() * gridSize), y: Math.floor(Math.random() * gridSize) });
  const occupied = (cell) => snake.some((segment) => sameCell(segment, cell)) || sameCell(enemy, cell);
  const placeFood = () => { let next; do { next = randomCell(); } while (occupied(next)); return next; };

  function resetGame() {
    snake = [{ x: 10, y: 10 }, { x: 9, y: 10 }, { x: 8, y: 10 }];
    direction = directions.right;
    queuedDirection = direction;
    enemy = { x: 4, y: 4 };
    food = placeFood();
    score = 0;
    scoreElement.textContent = score;
    draw();
  }

  function startGame() {
    resetGame();
    isRunning = true;
    overlay.classList.add('is-hidden');
    statusElement.textContent = 'Signal is live';
    clearInterval(gameTimer);
    gameTimer = setInterval(tick, 150);
  }

  function endGame(message = 'Connection lost') {
    isRunning = false;
    clearInterval(gameTimer);
    statusElement.textContent = message;
    overlay.querySelector('p').innerHTML = `${message}.<br />Final score: ${score}`;
    startButton.textContent = 'Play again';
    overlay.classList.remove('is-hidden');
  }

  function setDirection(nextDirection) {
    const next = directions[nextDirection];
    if (!next || (next.x + direction.x === 0 && next.y + direction.y === 0)) return;
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
    direction = queuedDirection;
    const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };
    const hitWall = head.x < 0 || head.x >= gridSize || head.y < 0 || head.y >= gridSize;
    const hitSelf = snake.some((segment) => sameCell(segment, head));
    if (hitWall || hitSelf || sameCell(head, enemy)) { endGame(sameCell(head, enemy) ? 'The scout found you' : 'Signal lost'); return; }
    snake.unshift(head);
    if (sameCell(head, food)) { score += 10; scoreElement.textContent = score; food = placeFood(); } else snake.pop();
    moveEnemy();
    if (sameCell(snake[0], enemy)) { endGame('The scout found you'); return; }
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

  document.addEventListener('keydown', (event) => {
    const keyMap = { ArrowUp: 'up', w: 'up', W: 'up', ArrowDown: 'down', s: 'down', S: 'down', ArrowLeft: 'left', a: 'left', A: 'left', ArrowRight: 'right', d: 'right', D: 'right' };
    if (keyMap[event.key]) { event.preventDefault(); if (!isRunning) startGame(); setDirection(keyMap[event.key]); }
  });
  document.querySelectorAll('[data-direction]').forEach((button) => button.addEventListener('click', () => { if (!isRunning) startGame(); setDirection(button.dataset.direction); }));
  startButton.addEventListener('click', startGame);
  resetGame();
})();
