const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://sagarverma5185:Sagar1234@cluster0.hvu5e.mongodb.net/paytm');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        minLength: 3,
        maxLength: 30
    },
    password: {
        type: String,
        required: true,
        minLength: 6
    },
    firstname: {
        type: String,
        required: true,
        trim: true,
        maxLength: 50
    },
    lastname: {
        type: String,
        required: true,
        trim: true,
        maxLength:50
    }
});

const User = new mongoose.model("User", userSchema); 


const accountSchema = new mongoose.Schema({
    userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: User,
    required: true
},
balance: {
    type: Number,
    required: true
}
});

const Account = new mongoose.model("Account",accountSchema);


module.exports = {
    User,
    Account
};