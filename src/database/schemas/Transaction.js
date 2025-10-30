const mongoose = require("mongoose");

const reqString = {
  type: String,
  required: true,
};

const Schema = new mongoose.Schema(
  {
    _id: String, // Transaction ID
    guild_id: reqString,
    buyer_id: reqString,
    product_id: reqString,
    product_name: { type: String, required: true }, // Store product name for history
    quantity: { type: Number, required: true, min: 1 },
    total_price: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ["pending", "completed", "cancelled", "refunded"],
      default: "pending",
    },
    created_at: { type: Date, default: Date.now },
    completed_at: Date,
    cancelled_at: Date,
    refunded_at: Date,
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: false,
    },
  }
);

const Model = mongoose.model("transactions", Schema);

module.exports = {
  /**
   * @param {Object} transactionData
   */
  createTransaction: async (transactionData) => {
    const transaction = new Model(transactionData);
    return transaction.save();
  },

  /**
   * @param {string} transactionId
   * @param {string} status
   */
  updateTransactionStatus: async (transactionId, status) => {
    const updateData = { status };

    if (status === "completed") {
      updateData.completed_at = new Date();
    } else if (status === "cancelled") {
      updateData.cancelled_at = new Date();
    } else if (status === "refunded") {
      updateData.refunded_at = new Date();
    }

    return Model.findOneAndUpdate({ _id: transactionId }, updateData, { new: true });
  },

  /**
   * @param {string} guildId
   * @param {string} buyerId
   * @param {number} limit
   */
  getUserTransactions: async (guildId, buyerId, limit = 20) => {
    return Model.find({ guild_id: guildId, buyer_id: buyerId }).sort({ created_at: -1 }).limit(limit).lean();
  },

  /**
   * @param {string} guildId
   * @param {number} limit
   */
  getGuildTransactions: async (guildId, limit = 50) => {
    return Model.find({ guild_id: guildId }).sort({ created_at: -1 }).limit(limit).lean();
  },

  /**
   * @param {string} transactionId
   */
  getTransaction: async (transactionId) => {
    return Model.findById(transactionId);
  },
};
