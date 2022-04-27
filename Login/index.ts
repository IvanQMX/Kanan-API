import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { connectDB, send } from "../global-functions";
import { Response } from "../types";
import Student from "../models/Student";

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<Response> {
  context.log("Login request.");
  const connected = await connectDB();
  if (!connected) {
    return send(503, "Database Unavailable");
  }
  const studentID = req.body && req.body.studentID;
  const password = req.body && req.body.password;
  const test = await Student.findOne({ studentID, password });
  return send(200, test ? true : false);
};

export default httpTrigger;
