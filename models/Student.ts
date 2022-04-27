import mongoose, { Schema } from "mongoose";
import { Student } from "../types";

const Student = new Schema({
  studentID: { type: String, required: true },
  name: { type: String, required: true },
  paternalSurname: { type: String, required: true },
  maternalSurname: { type: String, required: true },
  email: { type: String, required: true },
  telephone: { type: String, required: true },
  password: { type: String, required: true },
  pendingReport: { type: Boolean, required: true, default: false },
  schedule: [{ type: Schema.Types.ObjectId, ref: "Lesson", default: [] }],
});

export default mongoose.model<Student>("Student", Student);
