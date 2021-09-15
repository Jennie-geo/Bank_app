import mongoose from 'mongoose'

const Schema = mongoose.Schema;

const transactionSchema = new Schema({

    accountNumber: {
        type: String,
        require: true
    },
    amount: {
        type: Number,
        require: true
    },
    
}, { timestamps: true});

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;