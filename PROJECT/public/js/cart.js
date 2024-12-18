document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded and parsed'); // Checkpoint 1

    const incrementButtons = document.querySelectorAll('.increment');
    const decrementButtons = document.querySelectorAll('.decrement');
    const removeButtons = document.querySelectorAll('.remove');
    const orderButton = document.getElementById('order');

    console.log('Increment, Decrement, Remove, and Order buttons initialized'); // Checkpoint 2

    // Attach event listeners to increment buttons
    incrementButtons.forEach(button => {
        button.addEventListener('click', handleIncrement);
    });

    // Attach event listeners to decrement buttons
    decrementButtons.forEach(button => {
        button.addEventListener('click', handleDecrement);
    });

    // Attach event listeners to remove buttons
    removeButtons.forEach(button => {
        button.addEventListener('click', handleRemove);
    });

    // Attach event listener to order button
    if (orderButton) {
        orderButton.addEventListener('click', handleOrder);
    } else {
        console.warn('Order button not found on the page'); // Checkpoint 13
    }
});

/**
 * Handles incrementing item quantity.
 */
async function handleIncrement(e) {
    const itemName = e.target.dataset.name;
    console.log(`Increment button clicked for item: ${itemName}`); // Checkpoint 3
    try {
        await updateCart(itemName, 'increment');
    } catch (error) {
        console.error('Error incrementing item:', error); // Checkpoint 4
    }
}

/**
 * Handles decrementing item quantity.
 */
async function handleDecrement(e) {
    const itemName = e.target.dataset.name;
    console.log(`Decrement button clicked for item: ${itemName}`); // Checkpoint 5
    try {
        await updateCart(itemName, 'decrement');
    } catch (error) {
        console.error('Error decrementing item:', error); // Checkpoint 6
    }
}

/**
 * Handles removing an item from the cart.
 */
async function handleRemove(e) {
    const itemName = e.target.dataset.name; // Get the product name from data attribute
    console.log(`Remove button clicked for item: ${itemName}`); // Debugging log
    try {
        const response = await fetch('http://localhost:3000/home/cart/items', {
            method: 'DELETE', // DELETE request to the backend
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: itemName }) // Send item name in the request body
        });

        const data = await response.json(); // Parse the response as JSON
        console.log('Delete item response:', data); // Debugging log for response

        if (data.success) {
            console.log(`Item ${itemName} successfully removed from cart`); // Success log
            location.reload(); // Reload the page to reflect the updated cart
        } else {
            console.error(`Error removing item ${itemName}:`, data.message); // Error log
            alert('Error removing item: ' + data.message);
        }
    } catch (error) {
        console.error('Error with remove item request:', error); // Log for request error
        alert('An error occurred while removing the item from the cart. Please try again.');
    }
}


async function handleOrder() {
    console.log('Order button clicked'); // Checkpoint 9
    try {
        const response = await fetch('cart/order', { method: 'POST' });
        const data = await response.json();
        console.log('Order response:', data); // Checkpoint 10

        if (data.success) {
            alert('Order placed successfully!');
            window.location.href = 'http://localhost:3000/home/burger';
        } else {
            console.error('Error placing order:', data.message); // Checkpoint 11
        }
    } catch (error) {
        console.error('Error with order request:', error); // Checkpoint 12
        alert('Error placing order. Please try again.');
    }
}


/* Updates the cart with a specified action (increment, decrement, or remove).*/
async function updateCart(itemName, action) {
    console.log(`updateCart called with itemName: ${itemName}, action: ${action}`); // Checkpoint 14
    try {
        const response = await fetch('http://localhost:3000/home/cart/items', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: itemName, action: action })
        });

        const data = await response.json();
        console.log('Update cart response:', data); // Checkpoint 15

        if (data.success) {
            console.log(`Cart updated successfully for ${itemName} with action ${action}`); // Checkpoint 16
            location.reload(); // Reload the page to reflect updated cart
        } else {
            console.error(`Error updating cart for ${itemName}:`, data.message); // Checkpoint 17
            alert('Error updating cart: ' + data.message);
        }
    } catch (error) {
        console.error('Error with updateCart request:', error); // Checkpoint 18
        alert('An error occurred while updating the cart. Please try again.');
    }
}
