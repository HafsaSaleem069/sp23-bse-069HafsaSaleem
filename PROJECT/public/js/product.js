// Select all buttons with the class "add"
document.querySelectorAll(".add").forEach(button => {
    button.addEventListener("click", async (event) => { // Mark as async
        // Extract name and price from the button's parent card
        const card = button.closest(".burger1");
        const name = card.querySelector(".name1").innerText.trim();
        const price = card.querySelector(".price1").innerText.match(/\d+/)[0]; // Extract only numeric price

        // Log name and price
        console.log(`Added to Cart: ${name}  ${price}/-`);
        try {
            // Making POST request to add item to the cart
            console.log("sending POST(insertion) request to http://localhost:3000/home/cart/items");
            
            const response = await fetch('http://localhost:3000/home/cart/items', { // Use await here
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, price }) // Sending name and price
            });

            console.log("Response received:", response); // Debugging log

            if (response.ok) {
                const responseData = await response.json(); // Await the JSON response
                console.log("Item added to cart:", responseData); // Log the success response
                alert("Added Item to cart/items");
            } else {
                // Log and handle server error response
                const errorMessage = await response.text(); // Await JSON for error message
                console.error("Server responded with an error:", errorMessage); 
            }
        } catch (error) {
            // Log and handle network errors
            console.error("Error occurred during fetch:", error); // Debugging log
           
        }
    });
});
