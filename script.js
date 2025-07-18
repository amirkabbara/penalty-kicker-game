document.addEventListener('DOMContentLoaded', () => {
  // Game elements
  const goalZones = document.querySelectorAll('.goal-zone');
  const kickButton = document.getElementById('kick-button');
  const resetButton = document.getElementById('reset-button');
  const message = document.getElementById('message');
  const scoreElement = document.getElementById('score');
  const attemptsElement = document.getElementById('attempts');
  const accuracyElement = document.getElementById('accuracy');
  const saveRateElement = document.getElementById('save-rate');
  const goalkeeper = document.getElementById('goalkeeper');
  const ball = document.getElementById('ball');
  
  // Game state
  let score = 0;
  let attempts = 0;
  let selectedZone = null;
  let isAnimating = false;
  
  // Initialize game
  function initGame() {
    // Add event listeners to goal zones
    goalZones.forEach(zone => {
      zone.addEventListener('click', () => selectZone(zone));
    });
    
    // Add event listeners to buttons
    kickButton.addEventListener('click', kickBall);
    resetButton.addEventListener('click', resetGame);
    
    // Set initial message
    message.textContent = "Select a zone to aim your shot!";
  }
  
  // Handle zone selection
  function selectZone(zone) {
    if (isAnimating) return;
    
    // Clear previous selection
    goalZones.forEach(z => z.classList.remove('selected'));
    
    // Set new selection
    zone.classList.add('selected');
    selectedZone = zone.dataset.zone;
    
    // Enable kick button
    kickButton.disabled = false;
    
    // Update message
    message.textContent = "Zone selected! Click KICK! to shoot.";
  }
  
  // Handle kick action
  function kickBall() {
    if (!selectedZone || isAnimating) return;
    
    isAnimating = true;
    attempts++;
    attemptsElement.textContent = attempts;
    
    // Disable buttons during animation
    kickButton.disabled = true;
    resetButton.disabled = true;
    goalZones.forEach(zone => zone.style.pointerEvents = 'none');
    
    // Determine goalkeeper action
    const goalkeeperAction = determineGoalkeeperAction(selectedZone);
    
    // Get target position based on selected zone
    const targetPosition = getTargetPosition(selectedZone);
    
    // Animate goalkeeper
    animateGoalkeeper(goalkeeperAction);
    
    // Animate ball
    animateBall(targetPosition, () => {
      // After animation completes, check if goal scored
      const isGoal = checkGoal(selectedZone, goalkeeperAction);
      
      if (isGoal) {
        score++;
        scoreElement.textContent = score;
        message.textContent = "GOAL! 🎉";
        message.classList.add('celebrate');
      } else {
        message.textContent = "Saved by the goalkeeper! 🧤";
      }
      
      // Update stats
      updateStats();
      
      // Enable reset after a short delay
      setTimeout(() => {
        resetButton.disabled = false;
        goalZones.forEach(zone => zone.style.pointerEvents = 'auto');
        message.classList.remove('celebrate');
        isAnimating = false;
      }, 1500);
    });
  }
  
  // Determine goalkeeper action based on selected zone
  function determineGoalkeeperAction(zone) {
    // Create columns and rows from zone
    const [row, column] = zone.split('-');
    
    // 70% chance goalkeeper goes in the right direction
    // 30% chance goalkeeper goes in wrong direction
    const randomValue = Math.random();
    
    if (randomValue < 0.7) {
      // Goalkeeper makes the right decision
      if (column === 'left') return 'dive-left';
      if (column === 'right') return 'dive-right';
      return 'dive-center';
    } else {
      // Goalkeeper makes the wrong decision
      if (column === 'left') return 'dive-right';
      if (column === 'right') return 'dive-left';
      
      // If shot is center, randomly dive left or right
      return Math.random() < 0.5 ? 'dive-left' : 'dive-right';
    }
  }
  
  // Get ball target position based on selected zone
  function getTargetPosition(zone) {
    // Calculate position based on zone
    const [row, column] = zone.split('-');
    
    let leftPosition;
    if (column === 'left') leftPosition = '25%';
    else if (column === 'center') leftPosition = '50%';
    else leftPosition = '75%';
    
    let bottomPosition;
    if (row === 'top') bottomPosition = '170px';
    else if (row === 'middle') bottomPosition = '120px';
    else bottomPosition = '70px';
    
    return { left: leftPosition, bottom: bottomPosition };
  }
  
  // Animate goalkeeper based on action
  function animateGoalkeeper(action) {
    goalkeeper.style.animation = 'none';
    
    // Trigger reflow
    void goalkeeper.offsetWidth;
    
    // Set animation based on dive direction
    if (action === 'dive-left') {
      goalkeeper.style.animation = 'goalkeeperDiveLeft 0.5s forwards';
    } else if (action === 'dive-right') {
      goalkeeper.style.animation = 'goalkeeperDiveRight 0.5s forwards';
    } else {
      goalkeeper.style.animation = 'goalkeeperDiveCenter 0.5s forwards';
    }
  }
  
  // Animate ball to target position
  function animateBall(position, callback) {
    // Reset ball position first
    ball.style.animation = 'none';
    ball.style.bottom = '30px';
    ball.style.left = '50%';
    
    // Trigger reflow
    void ball.offsetWidth;
    
    // Set target position
    ball.style.bottom = position.bottom;
    ball.style.left = position.left;
    
    // Add animation
    ball.style.transition = 'all 0.8s cubic-bezier(0.2, 0.8, 0.2, 1)';
    
    // Call callback after animation completes
    setTimeout(callback, 800);
  }
  
  // Check if goal is scored
  function checkGoal(selectedZone, goalkeeperAction) {
    const [row, column] = selectedZone.split('-');
    
    // If goalkeeper dives in the right direction
    if ((column === 'left' && goalkeeperAction === 'dive-left') ||
        (column === 'right' && goalkeeperAction === 'dive-right') ||
        (column === 'center' && goalkeeperAction === 'dive-center')) {
      
      // 20% chance to score even if goalkeeper dives correctly (for more fun)
      return Math.random() < 0.2;
    }
    
    // If goalkeeper dives in the wrong direction, 90% chance to score
    return Math.random() < 0.9;
  }
  
  // Update game statistics
  function updateStats() {
    const accuracy = Math.round((score / attempts) * 100) || 0;
    const saveRate = Math.round(((attempts - score) / attempts) * 100) || 0;
    
    accuracyElement.textContent = accuracy;
    saveRateElement.textContent = saveRate;
  }
  
  // Reset the game for a new kick
  function resetGame() {
    // Reset selections
    goalZones.forEach(zone => zone.classList.remove('selected'));
    selectedZone = null;
    
    // Reset goalkeeper and ball positions
    goalkeeper.style.animation = 'none';
    goalkeeper.style.transform = 'translateX(-50%)';
    
    ball.style.transition = 'none';
    ball.style.bottom = '30px';
    ball.style.left = '50%';
    
    // Reset UI
    kickButton.disabled = true;
    message.textContent = "Select a zone to aim your shot!";
    
    // Reset animation flag
    isAnimating = false;
  }
  
  // Initialize the game
  initGame();
});