const mongoose = require('mongoose');

const chemistryRequisitionSchema = new mongoose.Schema({
    item_name: { type: String, required: true },
    quantity_required: { type: Number, required: true },
    date_of_requirement: { type: Date, required: true },
    purpose: { type: String, required: true },
    faculty_email: { type: String, required: true }, // Faculty's email
    status: { type: String, enum: ['Pending', 'Approved', 'Rejected','Issued'], default: 'Pending' }, // Request status
    approved_by: { type: String }, // Admin email
   issued_by: { type: String  }, // Admin email
    approved_at: { type: Date },
    remark:{type:String}
}, {
    timestamps: true
});



const ChemistryRequisitionModel = mongoose.model("ChemistryRequisition", chemistryRequisitionSchema);

module.exports = ChemistryRequisitionModel;
