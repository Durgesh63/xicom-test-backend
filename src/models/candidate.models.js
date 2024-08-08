const mongoose = require('mongoose');
var aggregatePaginate = require("mongoose-aggregate-paginate-v2");

const candidateSchema = new mongoose.Schema({

    firstName: {
        type: String,
        require: [true, "firstname is required"],
        trim: true
    },
    lastName: {
        type: String,
        require: [true, "lastname is required"],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'email is required'],
        index: true,
        trim: true
    },
    residentialaddress: {
        street1: {
            type: String,
            require: [true, "steet1 is required"],
        },
        street2: {
            type: String,
            require: [true, "steet2 is required"],
        }
    },
    permanentaddress: {
        street1: {
            type: String,
        },
        street2: {
            type: String,
        }
    },
    documents: [
        {
            filename: {
                type: String,
                require: [true, 'file name is required']
            },
            filetype: {
                type: String,
                require: [true, 'file type is required']
            },
            fileurl: {
                type: String,
                require: [true, 'file url is required']
            }
        }
    ]

}, { timestamps: true });


candidateSchema.plugin(aggregatePaginate);

candidateSchema.methods.isUserExist = async function (email) {
    return await User.findOne({ email: email });
}

const Candidate = mongoose.model('Candidate', candidateSchema);

module.exports = {
    Candidate
}
