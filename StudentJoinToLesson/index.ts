import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { connectDB, send } from "../global-functions";
import { Response } from "../types";
import Lesson from "../models/Lesson";
import Student from "../models/Student";

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<Response> {
  context.log("Student Join To Lesson request.");
  const connected = await connectDB();
  if (!connected) {
    return send(503, "Database Unavailable");
  }
  const group = req.body && req.body.group;
  const subject = req.body && req.body.subject;
  const studentID = req.body && req.body.studentID;
  if (!group || !subject || !studentID) {
    return send(400, "Invalid request. Structure must be:\n{\n\tgroup,\n\tsubject,\n\tstudentID\n}");
  }
  const lesson = await Lesson.findOne({ group, subject });
  if (!lesson) {
    return send(200, "Couldn't find lesson");
  }
  const student = await Student.findOneAndUpdate({ studentID }, { $addToSet: { schedule: lesson._id } });
  if (!student) {
    return send(200, "Couldn't find student");
  }
  await Lesson.findOneAndUpdate({ group, subject }, { $addToSet: { students: student._id } });
  return send(200, `Student added to lesson`);
};

export default httpTrigger;
