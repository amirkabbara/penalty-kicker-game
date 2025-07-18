document.addEventListener('DOMContentLoaded', () => {
  console.log('Game initialized');
  
  // Game elements
  const ball = document.getElementById('ball');
  const goalkeeper = document.getElementById('goalkeeper');
  const kickButton = document.getElementById('kick-button');
  const messageElement = document.getElementById('message');
  const scoreElement = document.getElementById('score');
  const attemptsElement = document.getElementById('attempts');
  
  // Direction buttons
  const topLeftBtn = document.getElementById('top-left-btn');
  const topRightBtn = document.getElementById('top-right-btn');
  const centerBtn = document.getElementById('center-btn');
  const bottomLeftBtn = document.getElementById('bottom-left-btn');
  const bottomRightBtn = document.getElementById('bottom-right-btn');
  
  // Target areas
  const targets = {
    'top-left': document.getElementById('top-left'),
    'top-right': document.getElementById('top-right'),
    'center': document.getElementById('center'),
    'bottom-left': document.getElementById('bottom-left'),
    'bottom-right': document.getElementById('bottom-right')
  };
  
  // Game state
  let score = 0;
  let attempts = 0;
  let selectedTarget = null;
  let isAnimating = false;
  
  // Reset ball position
  function resetBall() {
    ball.style.left = '50%';
    ball.style.bottom = '-40px';
    ball.classList.remove('ball-kick');
    isAnimating = false;
  }
  
  // Move goalkeeper to random position
  function moveGoalkeeper() {
    const positions = ['20%', '35%', '50%', '65%', '80%'];
    const randomPosition = positions[Math.floor(Math.random() * positions.length)];
    goalkeeper.style.left = randomPosition;
  }
  
  // Check if goal is scored based on goalkeeper and ball positions
  function isGoalScored(targetId) {
    const goalkeeperLeft = parseInt(goalkeeper.style.left) || 50;
    
    // Calculate if goalkeeper blocks the shot
    switch(targetId) {
      case 'center':
        return Math.abs(goalkeeperLeft - 50) > 15;
      case 'top-left':
      case 'bottom-left':
        return goalkeeperLeft > 40;
      case 'top-right':
      case 'bottom-right':
        return goalkeeperLeft < 60;
      default:
        return false;
    }
  }
  
  // Clear all active targets
  function clearActiveTargets() {
    Object.values(targets).forEach(target => {
      target.classList.remove('active');
    });
  }
  
  // Select target when direction button is clicked
  function selectTarget(targetId) {
    clearActiveTargets();
    selectedTarget = targetId;
    targets[targetId].classList.add('active');
    messageElement.textContent = `Aiming at ${targetId.replace('-', ' ')}`;
  }
  
  // Button event listeners for selecting directions
  topLeftBtn.addEventListener('click', () => selectTarget('top-left'));
  topRightBtn.addEventListener('click', () => selectTarget('top-right'));
  centerBtn.addEventListener('click', () => selectTarget('center'));
  bottomLeftBtn.addEventListener('click', () => selectTarget('bottom-left'));
  bottomRightBtn.addEventListener('click', () => selectTarget('bottom-right'));
  
  // Kick the ball
  kickButton.addEventListener('click', () => {
    if (isAnimating) return;
    
    if (!selectedTarget) {
      messageElement.textContent = 'Select a direction first!';
      return;
    }
    
    isAnimating = true;
    attempts++;
    attemptsElement.textContent = attempts;
    
    // Move ball to target
    const target = targets[selectedTarget];
    const targetRect = target.getBoundingClientRect();
    const goalRect = document.getElementById('goal').getBoundingClientRect();
    
    // Calculate relative position
    const leftPosition = ((targetRect.left + targetRect.width/2) - goalRect.left) / goalRect.width * 100;
    ball.style.left = `${leftPosition}%`;
    
    // Animate ball
    ball.classList.add('ball-kick');
    
    // Move goalkeeper
    moveGoalkeeper();
    
    // Check if goal is scored
    setTimeout(() => {
      const goalScored = isGoalScored(selectedTarget);
      
      if (goalScored) {
        score++;
        scoreElement.textContent = score;
        messageElement.textContent = 'GOAL! 🎉';
      } else {
        messageElement.textContent = 'Saved by the goalkeeper! 🧤';
      }
      
      // Reset after animation
      setTimeout(resetBall, 1000);
      
      // Clear selected target
      clearActiveTargets();
      selectedTarget = null;
    }, 500);
  });
  
  // Initialize goalkeeper position
  moveGoalkeeper();
});