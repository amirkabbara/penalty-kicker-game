document.addEventListener('DOMContentLoaded', () => {
  console.log('Penalty Kicker Game initialized');
  
  // Game elements
  const canvas = document.getElementById('gameCanvas');
  const ctx = canvas.getContext('2d');
  const aimButton = document.getElementById('aim-button');
  const kickButton = document.getElementById('kick-button');
  const messageElement = document.getElementById('message');
  const scoreElement = document.getElementById('score');
  const attemptsElement = document.getElementById('attempts');
  const accuracyElement = document.getElementById('accuracy');
  const saveRateElement = document.getElementById('save-rate');
  const aimer = document.getElementById('aimer');
  const aimerDot = document.getElementById('aimer-dot');
  const instruction = document.getElementById('instruction');
  
  // Game state
  let score = 0;
  let attempts = 0;
  let isAiming = false;
  let isAnimating = false;
  let targetX = 0;
  let targetY = 0;
  
  // Game constants
  const GOAL_WIDTH = 500;
  const GOAL_HEIGHT = 200;
  const GOAL_POST_WIDTH = 10;
  const BALL_RADIUS = 15;
  const GOALKEEPER_WIDTH = 70;
  const GOALKEEPER_HEIGHT = 100;
  
  // Load images
  const goalkeeperImg = new Image();
  goalkeeperImg.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0iI2ZmOTgwMCIgZD0iTTEyLDRBNCw0IDAgMCwxIDE2LDhBNCw0IDAgMCwxIDEyLDEyQTQsNCAwIDAsMSA4LDhBNCw0IDAgMCwxIDEyLDRNMTIsMTRDMTYuNDIsMTQgMjAsMTUuNzkgMjAsMThWMjBIMTYuNVYxOUMxNi41LDE5IDE2LjY3LDE3LjcyIDEyLDE3LjcyVjE0TTE0LjM3LDE0Ljc1QzEzLjAzLDE1LjA5IDEyLjUsMTUuNyAxMi41LDE1LjdDMTIuNSwxNS43IDEyLjgxLDE2IDE0LDE2QzE0LjE0LDE2IDE0LjM3LDE0Ljc1IDE0LjM3LDE0Ljc1TTExLjYzLDE0Ljc1QzExLjYzLDE0Ljc1IDExLjg2LDE2IDE0LjgsMTYuMThDMTMuMTksMTYgMTMuNSwxNS43IDEzLjUsMTUuN0MxMy41LDE1LjcgMTIuOTcsMTUuMDkgMTEuNjMsMTQuNzVNNy43NSwxOUgzLjVWMThDMy41LDE1Ljc5IDcuMDgsMTQgMTEuNSwxNFYxNy43MkMxMC44MywxNy43MiA3Ljc1LDE5IDcuNzUsMTlaIiAvPjwvc3ZnPg==';
  
  const ballImg = new Image();
  ballImg.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0iI2ZmZmZmZiIgZD0iTTEyLDJBMTAsMTAgMCAwLDAgMiwxMkExMCwxMCAwIDAsMCAxMiwyMkExMCwxMCAwIDAsMCAyMiwxMkExMCwxMCAwIDAsMCAxMiwyTTEyLDRDMTMuOCw0IDE1LjUsNC44IDE2LjgsNkgxNC44QzEzLjksCTYuNCAxMyw2LjcgMTIsNi43QzExLDYuNyAxMC4xLDYuNCCA5LjIsNkg3LjJDOC41LDQuOCAxMC4yLDQgMTIsNE0xMiwxNy4wM0MxMS40NSwxNy4wMyAxMSwxNi41OCAxMSwxNkMxMSwxNS40MiAxMS40NSwxNC45OCAxMiwxNC45OEMxMi41NSwxNC45OCAxMywxNS40MiAxMywxNkMxMywxNi41OCAxMi41NSwxNy4wMyAxMiwxNy4wM00xNC44LDExSDE4LjgxQzE4LjkzLDExLjMyIDE5LDExLjY2IDE5LDEyQzE5LDEyLjM0IDE4LjkzLDEyLjY4IDE4LjgxLDEzSDE0LjhDMTQuOSwxMi42OCAxNSwxMi4zNCAxNSwxMkMxNSwxMS42NiAxNC45LDExLjMyIDE0LjgsMTFNNS4xOSwxMUg5LjJDOS4xLDExLjMyIDksMTEuNjYgOSwxMkM5LDEyLjM0IDkuMSwxMi42OCA5LjIsMTNINS4xOUM1LjA3LDEyLjY4IDUsMTIuMzQgNSwxMkM1LDExLjY2IDUuMDcsMTEuMzIgNS4xOSwxMU05LjIsOEgxNC44QzE0LjksNy42NiAxNSw3LjMyIDE1LDdDMTUsNi42OCAxNC45LDYuMzQgMTQuOCw2SDkuMkM5LjEsNi4zNCA5LDYuNjggOSw3QzksNy4zMiA5LjEsNy42NiA5LjIsOE05LjIsMTZDOS4xLDE2LjM0IDksMTYuNjggOSwxN0M5LDE3LjMyIDkuMSwxNy42NiA5LjIsMThIMTQuOEMxNC45LDE3LjY2IDE1LDE3LjMyIDE1LDE3QzE1LDE2LjY4IDE0LjksMTYuMzQgMTQuOCwxNkg5LjJNNy4yLDE4SDkuMkMxMC4xLDE3LjYgMTEsMTcuMyAxMiwxNy4zQzEzLDE3LjMgMTMuOSwxNy42IDE0LjgsMThIMTYuOEMxNS41LDE5LjIgMTMuOCwyMCAxMiwyMEMxMC4yLDIwIDguNSwxOS4yIDcuMiwxOFoiIC8+PC9zdmc+';
  
  // Initialize game
  function init() {
    // Make sure images are loaded
    let imagesLoaded = 0;
    const totalImages = 2;
    
    function onImageLoad() {
      imagesLoaded++;
      if (imagesLoaded === totalImages) {
        // All images loaded, now draw game
        drawGameScene();
      }
    }
    
    goalkeeperImg.onload = onImageLoad;
    ballImg.onload = onImageLoad;
    
    // If images are cached and already loaded
    if (goalkeeperImg.complete) onImageLoad();
    if (ballImg.complete) onImageLoad();
    
    // Event listeners
    aimButton.addEventListener('click', startAiming);
    kickButton.addEventListener('click', kickBall);
    aimer.addEventListener('mousemove', updateAimerPosition);
    aimer.addEventListener('click', setTarget);
    
    // Display initial message
    messageElement.textContent = "Welcome to Penalty Kicker! Click 'Aim Shot' to begin.";
  }
  
  // Draw the game scene
  function drawGameScene() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw grass field
    ctx.fillStyle = '#78c278';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw goal area
    drawGoal();
    
    // Draw goalkeeper
    drawGoalkeeper();
    
    // Draw ball
    drawBall();
  }
  
  // Draw the goal posts and net
  function drawGoal() {
    const goalX = (canvas.width - GOAL_WIDTH) / 2;
    const goalY = 50;
    
    // Draw net (grid pattern)
    ctx.fillStyle = '#f5f5f5';
    ctx.fillRect(goalX, goalY, GOAL_WIDTH, GOAL_HEIGHT);
    
    // Draw net pattern
    ctx.strokeStyle = '#cccccc';
    ctx.lineWidth = 1;
    
    // Vertical lines
    for (let x = goalX; x <= goalX + GOAL_WIDTH; x += 20) {
      ctx.beginPath();
      ctx.moveTo(x, goalY);
      ctx.lineTo(x, goalY + GOAL_HEIGHT);
      ctx.stroke();
    }
    
    // Horizontal lines
    for (let y = goalY; y <= goalY + GOAL_HEIGHT; y += 20) {
      ctx.beginPath();
      ctx.moveTo(goalX, y);
      ctx.lineTo(goalX + GOAL_WIDTH, y);
      ctx.stroke();
    }
    
    // Draw goal posts
    ctx.fillStyle = '#ffffff';
    // Left post
    ctx.fillRect(goalX - GOAL_POST_WIDTH, goalY - GOAL_POST_WIDTH, GOAL_POST_WIDTH, GOAL_HEIGHT + GOAL_POST_WIDTH);
    // Right post
    ctx.fillRect(goalX + GOAL_WIDTH, goalY - GOAL_POST_WIDTH, GOAL_POST_WIDTH, GOAL_HEIGHT + GOAL_POST_WIDTH);
    // Top post
    ctx.fillRect(goalX - GOAL_POST_WIDTH, goalY - GOAL_POST_WIDTH, GOAL_WIDTH + (GOAL_POST_WIDTH * 2), GOAL_POST_WIDTH);
  }
  
  // Draw the goalkeeper
  function drawGoalkeeper(x, diving = null) {
    const goalX = (canvas.width - GOAL_WIDTH) / 2;
    const goalY = 50;
    const goalkeeperY = goalY + GOAL_HEIGHT - GOALKEEPER_HEIGHT;
    
    // Center goalkeeper if not specified
    if (x === undefined) {
      x = canvas.width / 2;
    }
    
    // Adjust for diving animation
    if (diving) {
      // Draw diving goalkeeper
      ctx.save();
      ctx.translate(x, goalkeeperY + GOALKEEPER_HEIGHT / 2);
      
      if (diving === 'left') {
        ctx.rotate(-Math.PI / 4); // Rotate 45 degrees left
      } else if (diving === 'right') {
        ctx.rotate(Math.PI / 4); // Rotate 45 degrees right
      }
      
      ctx.drawImage(
        goalkeeperImg, 
        -GOALKEEPER_WIDTH / 2, 
        -GOALKEEPER_HEIGHT / 2, 
        GOALKEEPER_WIDTH, 
        GOALKEEPER_HEIGHT
      );
      ctx.restore();
    } else {
      // Draw standing goalkeeper
      ctx.drawImage(
        goalkeeperImg, 
        x - GOALKEEPER_WIDTH / 2, 
        goalkeeperY, 
        GOALKEEPER_WIDTH, 
        GOALKEEPER_HEIGHT
      );
    }
  }
  
  // Draw the ball
  function drawBall(x = canvas.width / 2, y = canvas.height - 50) {
    ctx.drawImage(
      ballImg, 
      x - BALL_RADIUS, 
      y - BALL_RADIUS, 
      BALL_RADIUS * 2, 
      BALL_RADIUS * 2
    );
  }
  
  // Start aiming process
  function startAiming() {
    if (isAnimating) return;
    
    isAiming = true;
    aimer.classList.remove('hidden');
    kickButton.disabled = false;
    aimButton.disabled = true;
    instruction.textContent = "Click anywhere on the goal to aim";
    messageElement.textContent = "Aim your shot carefully!";
    
    // Show aimer dot initially at center of goal
    const goalX = (canvas.width - GOAL_WIDTH) / 2;
    const goalY = 50;
    aimerDot.style.left = (goalX + GOAL_WIDTH/2) + 'px';
    aimerDot.style.top = (goalY + GOAL_HEIGHT/2) + 'px';
    aimerDot.style.display = 'block';
  }
  
  // Update aimer position based on mouse movement
  function updateAimerPosition(e) {
    if (!isAiming) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Constrain to goal area
    const goalX = (canvas.width - GOAL_WIDTH) / 2;
    const goalY = 50;
    
    // Only show aimer if mouse is over the goal area
    if (x >= goalX && x <= goalX + GOAL_WIDTH && 
        y >= goalY && y <= goalY + GOAL_HEIGHT) {
      aimerDot.style.left = x + 'px';
      aimerDot.style.top = y + 'px';
      aimerDot.style.display = 'block';
    } else {
      aimerDot.style.display = 'none';
    }
  }
  
  // Set the target point when clicking
  function setTarget(e) {
    if (!isAiming) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Constrain to goal area
    const goalX = (canvas.width - GOAL_WIDTH) / 2;
    const goalY = 50;
    
    if (x >= goalX && x <= goalX + GOAL_WIDTH && 
        y >= goalY && y <= goalY + GOAL_HEIGHT) {
      targetX = x;
      targetY = y;
      
      // Update UI
      messageElement.textContent = "Target set! Click 'Kick!' to shoot.";
      instruction.textContent = "Click 'Kick!' to take your shot";
      
      // Hide aimer after selecting
      isAiming = false;
      aimer.classList.add('hidden');
    }
  }
  
  // Kick the ball to the target
  function kickBall() {
    console.log("Kick function called");
    
    if (isAnimating) {
      console.log("Already animating, ignoring kick");
      return;
    }
    
    if (!targetX || !targetY) {
      console.log("No target set, setting default");
      // If no target set, use center of goal
      const goalX = (canvas.width - GOAL_WIDTH) / 2;
      const goalY = 50;
      targetX = goalX + GOAL_WIDTH / 2;
      targetY = goalY + GOAL_HEIGHT / 2;
    }
    
    console.log(`Starting kick animation to target (${targetX}, ${targetY})`);
    
    isAnimating = true;
    attempts++;
    attemptsElement.textContent = attempts;
    kickButton.disabled = true;
    aimButton.disabled = true;
    
    // Determine goalkeeper's dive direction
    const goalX = (canvas.width - GOAL_WIDTH) / 2;
    const goalWidth = GOAL_WIDTH;
    const randomDive = Math.random();
    let goalkeeperX;
    let diveDirection;
    
    // 70% chance goalkeeper dives in right direction, 30% wrong direction
    if (targetX < canvas.width / 2 - 50) {
      // Shot going left
      if (randomDive < 0.7) {
        goalkeeperX = targetX + (Math.random() * 50 - 25); // Dive left with some variance
        diveDirection = 'left';
      } else {
        goalkeeperX = canvas.width / 2 + (Math.random() * 100); // Dive wrong way (right)
        diveDirection = 'right';
      }
    } else if (targetX > canvas.width / 2 + 50) {
      // Shot going right
      if (randomDive < 0.7) {
        goalkeeperX = targetX + (Math.random() * 50 - 25); // Dive right with some variance
        diveDirection = 'right';
      } else {
        goalkeeperX = canvas.width / 2 - (Math.random() * 100); // Dive wrong way (left)
        diveDirection = 'left';
      }
    } else {
      // Shot going center
      if (randomDive < 0.5) {
        goalkeeperX = targetX + (Math.random() * 40 - 20); // Stay near center
        diveDirection = null;
      } else if (randomDive < 0.75) {
        goalkeeperX = targetX - 50; // Dive left
        diveDirection = 'left';
      } else {
        goalkeeperX = targetX + 50; // Dive right
        diveDirection = 'right';
      }
    }
    
    // Constrain goalkeeper to goal area
    goalkeeperX = Math.max(goalX + GOALKEEPER_WIDTH / 2, Math.min(goalX + goalWidth - GOALKEEPER_WIDTH / 2, goalkeeperX));
    
    // Animate the penalty kick
    let ballX = canvas.width / 2;
    let ballY = canvas.height - 50;
    const startTime = Date.now();
    const animationDuration = 1000; // 1 second
    
    function animate() {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / animationDuration, 1);
      
      // Ball movement path (quadratic curve)
      ballX = canvas.width / 2 + (targetX - canvas.width / 2) * progress;
      ballY = canvas.height - 50 - (canvas.height - 50 - targetY) * progress * (2 - progress);
      
      // Redraw scene
      drawGameScene();
      
      // Draw goalkeeper diving after half the animation
      if (progress > 0.5) {
        drawGoalkeeper(goalkeeperX, diveDirection);
      } else {
        drawGoalkeeper(canvas.width / 2 + (goalkeeperX - canvas.width / 2) * (progress * 2));
      }
      
      // Draw ball at current position
      drawBall(ballX, ballY);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        // Animation completed, check if goal is scored
        checkGoal(goalkeeperX, diveDirection);
      }
    }
    
    // Start the animation
    console.log("Starting animation");
    requestAnimationFrame(animate);
  }
  
  // Check if goal is scored
  function checkGoal(goalkeeperX, diveDirection) {
    console.log("Checking goal");
    
    // Determine if goalkeeper saved the shot
    const goalX = (canvas.width - GOAL_WIDTH) / 2;
    const goalY = 50;
    
    // Check if ball is within goalkeeper's reach
    const goalkeeperReach = GOALKEEPER_WIDTH * (diveDirection ? 1.2 : 0.7); // Longer reach when diving
    const distanceToGoalkeeper = Math.sqrt(
      Math.pow(targetX - goalkeeperX, 2) + 
      Math.pow(targetY - (goalY + GOAL_HEIGHT - GOALKEEPER_HEIGHT / 2), 2)
    );
    
    const isGoal = distanceToGoalkeeper > goalkeeperReach;
    
    if (isGoal) {
      // Goal scored!
      score++;
      scoreElement.textContent = score;
      messageElement.textContent = "GOAL! 🎉 Great shot!";
      messageElement.classList.add('celebrate');
      setTimeout(() => messageElement.classList.remove('celebrate'), 1000);
    } else {
      // Save by goalkeeper
      messageElement.textContent = "Saved by the goalkeeper! 🧤 Try again!";
    }
    
    // Update stats
    const accuracy = Math.round((score / attempts) * 100) || 0;
    const saveRate = Math.round(((attempts - score) / attempts) * 100) || 0;
    accuracyElement.textContent = accuracy;
    saveRateElement.textContent = saveRate;
    
    // Reset for next shot
    console.log("Resetting for next shot");
    setTimeout(() => {
      isAnimating = false;
      aimButton.disabled = false;
      kickButton.disabled = true;
      targetX = 0;
      targetY = 0;
      instruction.textContent = "Click 'Aim Shot' to take another penalty";
      drawGameScene();
      console.log("Reset complete");
    }, 2000);
  }
  
  // Initialize the game
  console.log("Initializing game");
  init();
});