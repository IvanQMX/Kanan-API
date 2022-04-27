import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { connectDB, send } from "../global-functions";
import { Response } from "../types";
import Student from "../models/Student";

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<Response> {
  context.log("Get Schedule request.");
  const connected = await connectDB();
  if (!connected) {
    return send(503, "Database Unavailable");
  }
  const studentID = req.body && req.body.studentID;
  const student = await Student.findOne({ studentID }).populate("schedule");
  if (student) {
    return send(200, student.schedule);
  } else {
    return send(200, "Not found");
  }
};

export default httpTrigger;
