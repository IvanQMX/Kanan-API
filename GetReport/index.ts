import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { connectDB, send } from "../global-functions";
import { Response } from "../types";
import Report from "../models/Report";
import Student from "../models/Student";
import mongoose from "mongoose";

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<Response> {
  context.log("Get Report request.");
  const connected = await connectDB();
  if (!connected) {
    return send(503, "Database Unavailable");
  }
  const id = req.body && req.body.id;
  if (!id) {
    return send(400, "Invalid request. Structure must be:\n{\n\tid\n}");
  }
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return send(400, "Invalid request. Id must be an Mongoose Object ID");
  }
  const report = await Report.findById(id).populate("lessonsAttended.lesson", "subject group");
  if (!report) {
    return send(200, "Report doesn't exist");
  }
  const student = await Student.findOne({ studentID: report.studentID });
  const response = {
    date: report.date,
    fullName: `${student.paternalSurname} ${student.maternalSurname} ${student.name}`,
    studentID: student.studentID,
    email: student.email,
    telephone: student.telephone,
    hasTestPhoto: report.hasTestPhoto,
    testPhoto: report.testPhoto,
    sinceDay: report.sinceDay,
    symptoms: report.symptoms,
    attendedSchool: report.attendedSchool,
    lessonsAttended: report.lessonsAttended,
  };
  return send(200, response);
};

export default httpTrigger;
