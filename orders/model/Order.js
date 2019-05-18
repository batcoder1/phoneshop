const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    customer: {
      name: {
        type: String,
        required: true
      },
      surname: {
        type: String,
        required: true
      },
      email: {
        type: String,
        required: true
      }

    },
    phones: [ String ],

    totalPrice: Number,
    status: {
      type: String,
      enum: ['open', 'completed', 'failed', 'cancelled', 'rejected'],
      default: 'open',
      required: true
    },
  }, {
    timestamps: {
      createdAt: 'created_at'
    }
  }

)

module.exports = mongoose.model("Order", orderSchema)