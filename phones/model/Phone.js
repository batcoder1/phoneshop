const mongoose = require("mongoose");

const phoneSchema = new mongoose.Schema({

    name: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    imageurl: {
      type: String,
      required: false
    },
    price: {
      type: Number,
      required: true
    }

  }, {
    timestamps: {
      createdAt: 'created_at'
    }
  }

)


module.exports = mongoose.model("Phone", phoneSchema)