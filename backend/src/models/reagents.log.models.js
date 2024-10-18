const mongoose = require("mongoose");

const reagentsLogSchema = new mongoose.Schema(
  {
    item: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ChemistryReagents',  // Reference to the Chemical model
      required: true,
    },
    issued_quantity: {
      type: Number,
      required: true,
      min: 0,
    },
    date_issued: {
        type: Date,
        default: Date.now,
        required: true,
      },
    user_email: {
      type: String,
      required: true,
      trim: true,
    }
  },
  {
    timestamps: true,
  }
);

const ReagentsLogModel = mongoose.model("ChemistryReagentsLogs", reagentsLogSchema);

module.exports = ReagentsLogModel;
