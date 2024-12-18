const express = require('express');
const router = express.Router();
const userSessionMiddleware = require("../middlewares/site-middleware");
const { User, Cart, Order, Notification, Query } = require('../models/usersModel');


// Home Page Route
router.get('/', userSessionMiddleware,
    async (req, res) => {
        res.render("home", { user: res.locals.user });
    });
router.get('/navbar', userSessionMiddleware,
    async (req, res) => {
        res.render("navbar", { user: res.locals.user });
    });
// Burger Page Route
router.get('/burger', userSessionMiddleware,
    (req, res) => {
        res.render("burger", { user: res.locals.user })
    });
// pizza Page Route
router.get('/pizza', userSessionMiddleware,
    (req, res) => {
        res.render("pizza", { user: res.locals.user })
    });
// drinks Page Route
router.get('/desi', userSessionMiddleware,
    (req, res) => {
        res.render("desi", { user: res.locals.user })
    });
// coffee Page Route
router.get('/coffee', userSessionMiddleware,
    (req, res) => {
        res.render("coffee", { user: res.locals.user });
    });
// desserts Page Route
router.get('/desserts', userSessionMiddleware,
    (req, res) => {
        res.render("desserts", { user: res.locals.user });
    });
// Register Page Route
router.get('/register', (req, res) => {
    res.render("register");
});
// LOGIN Page Route
router.get('/login', (req, res) => {
    res.render("login");
});

//------------------------//Register a new user

router.post("/register/users", async (req, res) => {
    const { fullname, email, password, phone, address } = req.body;

    try {
        // Create a new user using the userModel by passing to constructor
        const newUser = new User({ fullname, email, password, phone, address });
        // Save user to MongoDB
        await newUser.save();

        res.status(201).json({ message: "User registered successfully!", user: newUser });
    } catch (error) {
        console.error("Error during registration:", error.message);

        // Handle unique email constraint error
        if (error.code === 11000) {
            return res.status(400).json({ message: "Email already exists!" });
        }

        res.status(500).json({ message: "Error registering user", error: error.message });
    }
});
router.get('/register/users', (req, res) => {
    res.send(User);
})

//-------------------------//Login a user

router.post("/login/users", async (req, res) => {
    const { email, password } = req.body;
    // Save user details to session


    try {
        // Find the user by email
        const existingUser = await User.findOne({ email: email });
        if (!existingUser) {
            // If no user is found
            return res.status(404).json({ message: "User not found!" });
        }

        // Check if the password matches
        if (existingUser.password !== password) {
            return res.status(401).json({ message: "Incorrect password!" });
        }
        console.log("Before data entered in session")
        req.session.user = { email: existingUser.email }; // Store only necessary fields
        console.log("data entered in session")
        // If authentication succeeds
        res.status(200).json({ message: "Login successful!", user: existingUser });
    } catch (error) {
        console.error("Error during login:", error.message);
        res.status(500).json({ message: "Error during login", error: error.message });
    }
});

//------------------------//Adding items to cart

router.post('/cart/items', userSessionMiddleware, async (req, res) => {
    console.log("Request entered in /cart/items route");

    const { name, price } = req.body; // Extract product name and price from request body
    console.log({ name, price });

    try {
        // Get the logged-in user's email from the session
        const userEmail = req.session.user.email;

        // Find the user by email
        const user = await User.findOne({ email: userEmail });
        if (!user) {
            return res.status(404).json({ message: "User not found!" });
        }

        // Find the user's cart
        let cart = await Cart.findOne({ userId: user._id });

        if (!cart) {
            // If the user doesn't have a cart, create one
            cart = new Cart({
                userId: user._id,
                products: [],
                totalBill: 0,
            });
        }

        // Check if the product is already in the cart
        const existingItem = cart.products.find(item => item.name === name);

        if (existingItem) {
            // If the item exists, update its quantity and total price
            existingItem.quantity += 1;
            existingItem.totalPrice = existingItem.quantity * price;
        } else {
            // If the item does not exist, add it to the cart
            cart.products.push({
                name,
                quantity: 1, // Start with 1 quantity
                price,
                totalPrice: price, // Total price for this item
            });
        }

        // Recalculate the total bill for the cart
        cart.totalBill = cart.products.reduce((sum, item) => sum + item.totalPrice, 0);

        // Save the updated cart
        await cart.save();

        res.status(200).json({ message: "Item added to cart!", cart: cart.products });
    } catch (error) {
        console.error("Error adding item to cart:", error.message);
        res.status(500).json({ message: "Error adding item to cart", error: error.message });
    }
});
//-----------------------//Cart related Routes

// Route to get cart items for the logged-in user
router.get('/cart', userSessionMiddleware, async (req, res) => {
    try {
        // Find the user based on the session email
        const user = await User.findOne({ email: req.session.user.email });

        if (!user) {
            return res.status(404).json({ message: "User not found!" });
        }

        // Find the user's cart using the user's ID
        const cart = await Cart.findOne({ userId: user._id });

        if (!cart) {
            return res.status(404).json({ message: "Cart not found!" });
        }
        res.render("cart", { user: res.locals.user, cart: cart.products });

        // Respond with the products in the user's cart
        // res.status(200).json({ products: cart.products });
    } catch (error) {
        console.error("Error retrieving cart items:", error.message);
        res.status(500).json({ message: "Error retrieving cart items", error: error.message });
    }
});

router.patch('/cart/items', userSessionMiddleware, async (req, res) => {
    const { name, action } = req.body;

    try {
        const userEmail = req.session.user.email;

        // Find the user and cart
        const user = await User.findOne({ email: userEmail });
        if (!user) {
            return res.status(404).json({ message: "User not found!" });
        }
        const cart = await Cart.findOne({ userId: user._id });
        if (!cart) {
            return res.status(404).json({ message: "Cart not found!" });
        }

        const existingItem = cart.products.find(item => item.name === name);
        if (!existingItem) {
            return res.status(404).json({ message: "Item not found in cart!" });
        }

        if (action === 'increment') {
            existingItem.quantity += 1;
            existingItem.totalPrice = existingItem.quantity * existingItem.price; // Correct totalPrice
        } else if (action === 'decrement') {
            if (existingItem.quantity > 1) {
                existingItem.quantity -= 1;
                existingItem.totalPrice = existingItem.quantity * existingItem.price; // Correct totalPrice
            } else {
                // Remove item if quantity drops to 0
                cart.products = cart.products.filter(item => item.name !== name);
            }
        } else if (action === 'remove') {
            cart.products = cart.products.filter(item => item.name !== name);
        } else {
            return res.status(400).json({ message: "Invalid action!" });
        }

        // Save updated cart
        await cart.save();
        res.status(200).json({ success: true, cart: cart.products });
    } catch (error) {
        console.error("Error updating cart items:", error.message);
        res.status(500).json({ message: "Error updating cart items", error: error.message });
    }
});

// Route to delete an item from the cart
router.delete('/cart/items', userSessionMiddleware, async (req, res) => {
    const { name } = req.body; // Get the item name from the request body

    try {
        const userEmail = req.session.user.email;

        // Find the user
        const user = await User.findOne({ email: userEmail });
        if (!user) {
            return res.status(404).json({ message: "User not found!" });
        }

        // Find the user's cart
        const cart = await Cart.findOne({ userId: user._id });
        if (!cart) {
            return res.status(404).json({ message: "Cart not found!" });
        }

        // Check if the item exists in the cart
        const existingItem = cart.products.find(item => item.name === name);
        if (!existingItem) {
            return res.status(404).json({ message: "Item not found in cart!" });
        }

        // Remove the item from the cart
        cart.products = cart.products.filter(item => item.name !== name);

        // Save the updated cart
        await cart.save();

        res.status(200).json({ success: true, message: "Item removed successfully", cart: cart.products });
    } catch (error) {
        console.error("Error deleting item from cart:", error.message);
        res.status(500).json({ message: "Error deleting item from cart", error: error.message });
    }
});

// -------------------------// Profile Page Route

router.get('/profile', userSessionMiddleware, async (req, res) => {
    try {
        // Get the logged-in user's email from the session
        const userEmail = req.session.user.email;

        // Find the user by email
        const user = await User.findOne({ email: userEmail });
        if (!user) {
            return res.status(404).json({ message: "User not found!" });
        }

        // Fetch purchase history for the user
        const purchaseHistory = await PurchaseHistory.find({ userId: user._id }); // Corrected to use PurchaseHistory model

        // Render the profile page with user data and purchase history
        res.render('profile', {
            user: user, // Pass the whole user object to access fullname and other details
            purchaseHistory: purchaseHistory // Pass the purchaseHistory directly
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

router.get("/logout", async (req, res) => {
    req.session.user = null;
    console.log("session clear");
    res.redirect("http://localhost:3000/home/login");
});

router.get('/checkout', userSessionMiddleware, async (req, res) => {
    res.render("Checkout", { user: res.locals.user });
});


router.post('/cart/order', async (req, res) => {
    try {
        // Ensure session contains user details
        if (!req.session || !req.session.user) {
            return res.status(401).json({ message: "Unauthorized. Please log in." });
        }

        const userEmail = req.session.user.email;

        // Find the user by email
        const user = await User.findOne({ email: userEmail });
        if (!user) {
            return res.status(404).json({ message: "User not found!" });
        }

        const { street, city, postalCode } = req.body;

        // Validate incoming data
        if (!street || !city || !postalCode) {
            return res.status(400).json({ success: false, message: 'All address fields are required.' });
        }

        // Extract userId from the authenticated session
        const userId = user._id; // `req.user` replaced with session-based `user`

        // Fetch the user's cart
        const userCart = await Cart.findOne({ userId });
        if (!userCart || userCart.products.length === 0) {
            return res.status(400).json({ success: false, message: 'Your cart is empty. Add items to the cart first.' });
        }

        // Create the new address object
        const newAddress = {
            street,
            city,
            postalCode,
        };

        // Prepare order data
        const newOrder = {
            userId: userId,
            userName: user.fullname, // Assuming the `User` schema has `fullname`
            addresses: [newAddress],
            purchases: userCart.products.map(product => ({
                productId: product.productId, // Ensure Cart schema uses `productId`
                name: product.name,
                quantity: product.quantity,
                purchaseDate: new Date(),
                totalPrice: product.totalPrice,
            })),
            totalBill: userCart.totalBill, // Copy the total bill from the cart
        };

        // Insert into Order collection
        const createdOrder = new Order(newOrder);
        await createdOrder.save();

        // Clear the user's cart after the order is placed
        await Cart.deleteOne({ userId });

        // Respond with success
        res.status(200).json({
            success: true,
            message: 'Order placed successfully.',
            order: createdOrder
        });
    } catch (error) {
        console.error('Error processing order:', error);
        res.status(500).json({ success: false, message: 'Internal server error.' });
    }
});

module.exports = router;

//---------------------//NOTIFICATIONS
router.get('/notifications', userSessionMiddleware, async (req, res) => {
    try {
        const user = await User.findOne({ email: req.session.user.email });
        if (!user) return res.status(404).json({ message: "User not found!" });

        // Fetch notifications for the logged-in user
        const notifications = await Notification.find({ userId: user._id }).sort({ createdAt: -1 });

        res.render('notifications', { notifications });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching notifications');
    }
});

module.exports = router;



