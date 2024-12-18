const express = require('express');
const router = express.Router();
const { User, Cart, Order, Notification, Query } = require('../models/usersModel');

router.get('/', (req, res) => {
    res.render("adminDashboard"); // Render admin.ejs with usersdata
});
// adminUsersPage Route
router.get('/users', (req, res) => {
    res.render("adminUsers"); // Render adminDashboard.ejs with usersdata
});

//-----------------------------//Handling Orders
//pagination
//searching
//filtering
//sorting

router.get('/orders', async (req, res) => {
    try {
        // Extract query parameters
        const { page = 1, search = '', status = '', sort = 'asc' } = req.query;
        const limit = 5; // Items per page
        const skip = (page - 1) * limit;

        // Build the query for searching and filtering
        let query = {};
        if (search) {
            query['userName'] = { $regex: search, $options: 'i' }; // Case-insensitive search
        }
        if (status) {
            query['orderStatus'] = status;
        }

        // Fetch orders with total price calculation from purchases directly in the Order collection
        const ordersWithTotalPrice = await Order.aggregate([
            {
                $match: query // Apply search and filter query
            },
            {
                $addFields: {
                    totalPrice: {
                        $sum: {
                            $map: {
                                input: '$purchases',
                                as: 'purchase',
                                in: { $multiply: ['$$purchase.totalPrice', '$$purchase.quantity'] } // Calculate total price for each purchase
                            }
                        }
                    }
                }
            },
            {
                $sort: { totalPrice: sort === 'asc' ? 1 : -1 } // Sort by total price
            },
            {
                $skip: skip // Pagination
            },
            {
                $limit: limit // Limit the number of results
            }
        ]);

        // Get the total number of orders for pagination
        const totalOrders = await Order.countDocuments(query);
        const totalPages = Math.ceil(totalOrders / limit);

        res.render('adminOrders', { orders: ordersWithTotalPrice, totalPages, currentPage: page });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error fetching orders');
    }
});

router.post('/orders/update-status', async (req, res) => {
    const { orderId, status } = req.body;

    try {
        const order = await Order.findById(orderId).populate('userId');
        if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

        // Update order status
        order.orderStatus = status;
        await order.save();

        // If status is "Delivered", create a notification
        if (status === 'Delivered') {
            const message = `Your order of ₹${order.purchases.reduce((sum, p) => sum + p.totalPrice, 0)} has been delivered.`;
            const notification = new Notification({
                userId: order.userId._id,
                message,
            });
            await notification.save();
        }

        res.json({ success: true, message: 'Order status updated successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Failed to update order status' });
    }
});

// adminProducts Page Route
router.get('/products', (req, res) => {
    res.render("adminProducts"); // Render adminDashboard.ejs with usersdata
});
// adminCategory Page Route
router.get('/category', (req, res) => {
    res.render("adminCategory"); // Render adminDashboard.ejs with usersdata
});
// adminDeliveredItems Page Route
router.get('/deliveries', (req, res) => {
    res.render("adminDeliveredItems"); // Render adminDashboard.ejs with usersdata
});
// adminQueries Page Route
router.get('/queries', (req, res) => {
    res.render("adminQueries"); // Render adminDashboard.ejs with usersdata
});
// adminSoldItems Page Route
router.get('/soldItems', (req, res) => {
    res.render("adminSoldItems"); // Render adminDashboard.ejs with usersdata
});

module.exports = router;
