import mongoose, { Schema } from "mongoose";
import { Report } from "../types";

const Report = new Schema({
  date: {type: Date, default: new Date()},
  studentID: { type: String, required: true },
  hasTestPhoto: { type: Boolean, required: true },
  testPhoto: { type: String },
  sinceDay: { type: Date, required: true },
  symptoms: [{ type: String, required: true }],
  attendedSchool: { type: Boolean, required: true },
  lessonsAttended: [
    {
      lesson: { type: Schema.Types.ObjectId, ref: "Lesson", required: true },
      days: [{ type: Date, required: true }],
    },
  ],
  approved: { type: Boolean, required: true, default: false },
});

export default mongoose.model<Report>("Report", Report);
