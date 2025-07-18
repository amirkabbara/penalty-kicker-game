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
  const difficultyButtons = document.querySelectorAll('.difficulty-btn');
  
  // Game state
  let score = 0;
  let attempts = 0;
  let selectedZone = null;
  let isAnimating = false;
  let currentDifficulty = 'easy'; // Default difficulty
  
  // Difficulty settings (goalkeeper save chance when diving correctly)
  const difficultySaveChances = {
    'easy': 0.3,     // 30% chance to save when diving in the correct zone
    'medium': 0.6,   // 60% chance to save when diving in the correct zone
    'hard': 0.85     // 85% chance to save when diving in the correct zone
  };
  
  // Difficulty settings (goalkeeper correct direction chance)
  const difficultyCorrectDirectionChances = {
    'easy': 0.3,     // 30% chance goalkeeper goes to the right zone
    'medium': 0.5,   // 50% chance goalkeeper goes to the right zone
    'hard': 0.7      // 70% chance goalkeeper goes to the right zone
  };
  
  // Initialize game
  function initGame() {
    // Add event listeners to goal zones
    goalZones.forEach(zone => {
      zone.addEventListener('click', () => selectZone(zone));
    });
    
    // Add event listeners to buttons
    kickButton.addEventListener('click', kickBall);
    resetButton.addEventListener('click', resetGame);
    
    // Add event listeners to difficulty buttons
    difficultyButtons.forEach(button => {
      button.addEventListener('click', () => setDifficulty(button.dataset.difficulty));
    });
    
    // Set initial message
    message.textContent = "Select a zone to aim your shot!";
  }
  
  // Set game difficulty
  function setDifficulty(difficulty) {
    currentDifficulty = difficulty;
    
    // Update UI
    difficultyButtons.forEach(button => {
      button.classList.remove('active');
      if (button.dataset.difficulty === difficulty) {
        button.classList.add('active');
      }
    });
    
    message.textContent = `Difficulty set to ${difficulty.toUpperCase()}. Select a zone to aim your shot!`;
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
    
    // Determine goalkeeper action based on difficulty
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
  
  // Determine goalkeeper action based on selected zone and difficulty
  function determineGoalkeeperAction(zone) {
    // Extract direction from zone
    const [row, column] = zone.split('-');
    
    // Get chance of goalkeeper going in the right direction based on difficulty
    const correctDirectionChance = difficultyCorrectDirectionChances[currentDifficulty];
    
    // Decide if goalkeeper makes the right decision based on difficulty
    if (Math.random() < correctDirectionChance) {
      // Goalkeeper makes the right decision
      if (column === 'left') return 'dive-left';
      if (column === 'right') return 'dive-right';
      return 'dive-center';
    } else {
      // Goalkeeper makes the wrong decision
      // Generate a random direction that's not the correct one
      const directions = ['left', 'center', 'right'];
      const correctDirection = column;
      const incorrectDirections = directions.filter(dir => dir !== correctDirection);
      
      // Randomly select from incorrect directions
      const randomIndex = Math.floor(Math.random() * incorrectDirections.length);
      const randomDirection = incorrectDirections[randomIndex];
      
      return `dive-${randomDirection}`;
    }
  }
  
  // Get ball target position based on selected zone
  function getTargetPosition(zone) {
    // Calculate position based on zone
    const [row, column] = zone.split('-');
    
    // More precise positioning
    let leftPosition;
    if (column === 'left') leftPosition = '25%';
    else if (column === 'center') leftPosition = '50%';
    else leftPosition = '75%';
    
    let bottomPosition;
    if (row === 'top') bottomPosition = '150px';
    else if (row === 'middle') bottomPosition = '100px';
    else bottomPosition = '50px';
    
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
    ball.style.transition = 'none';
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
    const goalkeepDirection = goalkeeperAction.split('-')[1];
    
    // If goalkeeper dives in the right direction
    if (column === goalkeepDirection) {
      // Chance to save based on difficulty
      const saveChance = difficultySaveChances[currentDifficulty];
      return Math.random() > saveChance; // Goal if random is higher than save chance
    }
    
    // If goalkeeper dives in the wrong direction, high chance to score
    return Math.random() < 0.95; // 95% chance to score if goalkeeper dives wrong
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