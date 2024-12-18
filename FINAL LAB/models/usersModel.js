const mongoose = require("mongoose");

// Define the User Schema
const UserSchema = new mongoose.Schema({
    fullname: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});

// Define the Cart Schema
const CartSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    products: [
        {
            name: { type: String, required: true },  // Product name for quick access
            quantity: { type: Number, default: 0 },
            price: { type: Number },
            totalPrice: { type: Number, default: 0 },
        }
    ],
    totalBill: { type: Number, default: 0 },
    updatedAt: { type: Date, default: Date.now }
});

const OrderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    userName: { type: String, required: true }, // Store the name of the user
    addresses: [
        {
            street: { type: String, required: true },
            city: { type: String, required: true },
            postalCode: { type: String, required: true }
        }
    ],
    purchases: [
        {
            productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
            name: { type: String, required: true },  // Store product name
            quantity: { type: Number, required: true },
            purchaseDate: { type: Date, default: Date.now },
            totalPrice: { type: Number, required: true }
        }
    ],
    orderStatus: {
        type: String,
        enum: ['Pending', 'Shipped', 'Delivered', 'Cancelled'],
        default: 'Pending'
    },
    createdAt: { type: Date, default: Date.now },
});

// Define the Notifications Schema
const NotificationSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
});

// Define the Queries Schema
const QuerySchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    queries: [
        {
            queryText: { type: String, required: true },
            response: { type: String, default: null },  // Response to the query
            queryDate: { type: Date, default: Date.now },
            responseDate: { type: Date }
        }
    ]
});

// Models
const User = mongoose.model('User', UserSchema);
const Cart = mongoose.model('Cart', CartSchema);
const Order = mongoose.model('Order', OrderSchema);
const Notification = mongoose.model('Notification', NotificationSchema);
const Query = mongoose.model('Query', QuerySchema);

// Export Models
module.exports = {
    User,
    Cart,
    Order,
    Notification,
    Query
};
