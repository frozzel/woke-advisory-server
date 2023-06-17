const mongoose = require('mongoose');// import mongoose
const bcrypt = require('bcrypt');// import bcrypt

const emailVerificationTokenSchema = new mongoose.Schema({// create a schema for token
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    token: {
        type: String,
        required: true
    },
    createAt: {
        type: Date,
        expires: 3600,
        default: Date.now(),
    }
});

emailVerificationTokenSchema.pre('save', async function(next){ // hash token before saving to database
    if(this.isModified('token')) {
     this.token = await bcrypt.hash(this.token, 10);
     
    }
    next();
})

emailVerificationTokenSchema.methods.compareToken = async function(token) {
    const result = await bcrypt.compare(token, this.token);
    return result;
}

module.exports = mongoose.model('EmailVerificationToken', emailVerificationTokenSchema);