import mongoose from "mongoose";


const pollSchema = new mongoose.Schema({
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref : 'users',
        required: true
    },
    question: {
        type: String,
        required: true
    },
    pollType : {
        type: String,
        enum: ['single', 'multi'],
        required: true
    },
    isAnonymous: {
        type: Boolean,
        required: true
    },
    options: [
        {
            text: {
                type: String,
                required: true
            },
            voted: [
                {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'users'
                }
            ]
        }
    ],
    expiry: {
        type: Date,
        required: true
    }
}, {timestamps : true});

const Poll = mongoose.models.polls || mongoose.model('polls', pollSchema);

export default Poll;