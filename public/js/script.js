console.log('Script loaded');

const form = document.querySelector('form');
const button = document.querySelector('button[type="submit"]');

if (!form || !button) {
  console.error('Form or button not found!');
} else {
  form.addEventListener('submit', (e) => {
    e.preventDefault(); // Prevent default form submission
    console.log('Form submitted');

    // Send the form data to the server using AJAX or the Fetch API
    //...

    // Display a success message
    const successMessage = document.createElement('p');
    successMessage.textContent = 'Thank you for your message!';
    form.appendChild(successMessage);
    button.disabled = true; // Disable the button to prevent multiple submissions
  });
}