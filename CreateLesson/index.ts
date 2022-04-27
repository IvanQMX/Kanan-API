import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { connectDB, send } from "../global-functions";
import { Response } from "../types";
import Lesson from "../models/Lesson";

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<Response> {
  context.log("Create User request.");
  const connected = await connectDB();
  if (!connected) {
    return send(503, "Database Unavailable");
  }
  const group = req.body && req.body.group;
  const subject = req.body && req.body.subject;
  const days = req.body && req.body.days;
  if (!group || !subject || !days) {
    return send(400, "Invalid request. Structure must be:\n{\n\tgroup,\n\tsubject,\n\tdays\n}");
  }
  if (!Array.isArray(days)) {
    return send(400, "Invalid request. Days must be an array");
  }
  if (days.length != 5) {
    return send(400, "Invalid request. Days must be an array of five elements");
  }
  const lesson = {
    group,
    subject,
    days,
  };
  const newLesson = new Lesson(lesson);
  await newLesson.save();
  return send(201, `Lesson saved - ${newLesson._id}`);
};

export default httpTrigger;
