import mongoose, { Schema } from "mongoose";
import { Lesson } from "../types";

const Report = new Schema({
  student: { type: Schema.Types.ObjectId, ref: "Student", required: true },
  hasTest: { type: Boolean, required: true },
  testPhoto: { type: String },
  sinceDay: { type: Date, required: true },
  symptoms: [{ type: String, required: true }],
  attendedSchool: { type: Boolean, required: true },
  lessonsSelected: [
    {
      lesson: { type: Schema.Types.ObjectId, ref: "Lesson", required: true },
      days: [{ type: Date, required: true }],
    },
  ],
  approved: { type: Boolean, required: true, default: false },
});

export default mongoose.model<Lesson>("Report", Report);
