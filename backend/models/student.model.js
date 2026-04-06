import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    gender: { type: String, enum: ["Male", "Female"], required: true },
    dob: { type: Date, required: true },
    email: { type: String, required: true },
    feesPaid: { type: Number, required: true },

    class: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      required: true,
    },
    role: {
      type: String,
      default: "student",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Student", studentSchema);
