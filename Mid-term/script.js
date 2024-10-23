// Function to load description from the text file
function loadDescription(file) {
    const button = event.target;
    const descriptionContainer = button.nextElementSibling;

    // Toggle the description: If already visible, hide it
    if (descriptionContainer.style.display === 'block') {
        descriptionContainer.style.display = 'none';
        button.textContent = 'Show Description'; // Update button text back to 'Show Description'
        return;
    }

    // If description is hidden, check if it's already loaded
    if (descriptionContainer.innerHTML.trim() === "") {
        // Fetch the description from the provided text file
        fetch(file)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error fetching file');
                }
                return response.text();
            })
            .then(data => {
                // Update the content and display the description
                descriptionContainer.innerHTML = `<p>${data}</p>`;
                descriptionContainer.style.display = 'block';
                button.textContent = 'Hide Description'; // Change button text to 'Hide Description'
            })
            .catch(error => {
                // Handle errors gracefully
                descriptionContainer.innerHTML = `<p>Error loading description. Please try again later.</p>`;
                descriptionContainer.style.display = 'block';
            });
    } else {
        // If already loaded, simply display the description
        descriptionContainer.style.display = 'block';
        button.textContent = 'Hide Description';
    }
}
