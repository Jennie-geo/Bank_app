import mongoose from 'mongoose'

const Schema = mongoose.Schema;

const createAcctSchema = new Schema({

    senderAccount_nr: {
        type: String,
        require: true
    },
    amount: {
        type: Number,
        require: true
    },
    receiverAccount_nr: {
        type: String,
        require: true
    }, 
    transactionDesc: {
        type: String,
        require: true
    }
    
}, { timestamps: true});

const Balance_Detail = mongoose.model('balance', createAcctSchema );

module.exports = Balance_Detail;