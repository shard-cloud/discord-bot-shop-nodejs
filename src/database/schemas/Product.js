const mongoose = require("mongoose");

const reqString = {
  type: String,
  required: true,
};

const Schema = new mongoose.Schema(
  {
    _id: String, // Product ID
    guild_id: reqString,
    name: reqString,
    description: reqString,
    price: { type: Number, required: true, min: 0 },
    stock: { type: Number, required: true, min: 0 },
    image_url: String,
    category: { type: String, default: "Geral" },
    is_active: { type: Boolean, default: true },
    created_by: reqString,
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

const Model = mongoose.model("products", Schema);

module.exports = {
  /**
   * @param {string} guildId
   * @param {string} productId
   */
  getProduct: async (guildId, productId) => {
    return Model.findOne({ _id: productId, guild_id: guildId });
  },

  /**
   * @param {string} guildId
   * @param {number} limit
   */
  getProducts: async (guildId, limit = 50) => {
    return Model.find({ guild_id: guildId, is_active: true }).sort({ created_at: -1 }).limit(limit).lean();
  },

  /**
   * @param {string} guildId
   * @param {string} category
   */
  getProductsByCategory: async (guildId, category) => {
    return Model.find({ guild_id: guildId, category: category, is_active: true }).sort({ created_at: -1 }).lean();
  },

  /**
   * @param {Object} productData
   */
  createProduct: async (productData) => {
    const product = new Model(productData);
    return product.save();
  },

  /**
   * @param {string} guildId
   * @param {string} productId
   * @param {Object} updateData
   */
  updateProduct: async (guildId, productId, updateData) => {
    return Model.findOneAndUpdate(
      { _id: productId, guild_id: guildId },
      { ...updateData, updated_at: new Date() },
      { new: true }
    );
  },

  /**
   * @param {string} guildId
   * @param {string} productId
   */
  deleteProduct: async (guildId, productId) => {
    return Model.findOneAndUpdate({ _id: productId, guild_id: guildId }, { is_active: false, updated_at: new Date() });
  },

  /**
   * @param {string} guildId
   * @param {string} productId
   * @param {number} quantity
   */
  updateStock: async (guildId, productId, quantity) => {
    return Model.findOneAndUpdate(
      { _id: productId, guild_id: guildId },
      {
        $inc: { stock: quantity },
        updated_at: new Date(),
      },
      { new: true }
    );
  },

  /**
   * @param {string} guildId
   */
  getCategories: async (guildId) => {
    return Model.distinct("category", { guild_id: guildId, is_active: true });
  },

  /**
   * Search product by name with exact and partial matching
   * @param {string} guildId
   * @param {string} identifier
   */
  findProductByName: async (guildId, identifier) => {
    const query = { guild_id: guildId, is_active: true };

    // Escape special regex characters
    const escapedIdentifier = identifier.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    // Try exact match first (case insensitive)
    let product = await Model.findOne({
      ...query,
      name: { $regex: `^${escapedIdentifier}$`, $options: "i" },
    });

    if (product) {
      return product;
    }

    // Try starts with match
    product = await Model.findOne({
      ...query,
      name: { $regex: `^${escapedIdentifier}`, $options: "i" },
    });

    return product;
  },

  /**
   * @param {string} guildId
   * @param {string} name
   */
  searchProductsByName: async (guildId, name) => {
    // Criar uma expressão regular para pesquisa case-insensitive
    const regex = new RegExp(name, "i");
    return Model.find({
      guild_id: guildId,
      is_active: true,
      name: regex,
    })
      .sort({ name: 1 })
      .limit(10)
      .lean();
  },
};
