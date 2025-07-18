console.log('script.js is loading...');
// Main application script
document.addEventListener('DOMContentLoaded', () => {
  const app = document.getElementById('app');
  
  // Create a welcome message
  const welcomeMessage = document.createElement('div');
  welcomeMessage.innerHTML = '<h2>Hello from JavaScript!</h2>';
  welcomeMessage.innerHTML += '<p>This project was created with PaprChat</p>';
  
  // Add a button
  const button = document.createElement('button');
  button.textContent = 'Click me!';
  button.style.padding = '8px 16px';
  button.style.margin = '20px 0';
  button.style.backgroundColor = '#4CAF50';
  button.style.color = 'white';
  button.style.border = 'none';
  button.style.borderRadius = '4px';
  button.style.cursor = 'pointer';
  
  button.addEventListener('click', () => {
    alert('Button clicked!');
  });
  
  // Append elements to the app
  app.appendChild(welcomeMessage);
  app.appendChild(button);
  
  console.log('Application initialized');
});