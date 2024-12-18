const { User, Cart, PurchaseHistory, Notification, Query } = require('../models/usersModel');

module.exports = async function (req, res, next) {
    try {
        // Ensure there is a user in the session
        const email = req.session?.user?.email;
        if (!email) {
            return res.redirect('/home/login'); // Redirect to login if no session exists
        }

        // Fetch user data from the database
        const defaultUser = await User.findOne({ email });

        if (!defaultUser) {
            return res.redirect('/home/login'); // Redirect if user not found
        }

        // Make user data available globally
        req.session.user = defaultUser; // Update session with the latest user data
        res.locals.user =req.session.user // Make user available for templates
        req.user = defaultUser; // Attach user to req for downstream middleware

        next(); // Proceed to the next middleware
    } catch (error) {
        console.error('Error in middleware:', error.message);
        res.status(500).send('Internal Server Error');
    }
};
