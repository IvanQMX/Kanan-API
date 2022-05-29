import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { connectDB, send } from "../global-functions";
import Report from "../models/Report";
import { Response } from "../types";

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<Response> {
  context.log("Create Report request.");
  const connected = await connectDB();
  if (!connected) {
    return send(503, "Database Unavailable");
  }
  const studentID = req.body && req.body.studentID;
  const hasTestPhoto = req.body && req.body.hasTestPhoto;
  const testPhoto = req.body && req.body.testPhoto;
  const sinceDay = req.body && req.body.sinceDay;
  const symptoms = req.body && req.body.symptoms;
  const attendedSchool = req.body && req.body.attendedSchool;
  const lessonsAttended = req.body && req.body.lessonsAttended;
  if (
    !studentID ||
    hasTestPhoto === undefined ||
    testPhoto === undefined ||
    !sinceDay ||
    !symptoms ||
    attendedSchool === undefined ||
    !lessonsAttended
  ) {
    return send(
      400,
      "Invalid request. Structure must be:\n{\n\tstudentID,\n\thasTestPhoto,\n\ttestPhoto,\n\tsinceDay,\n\tsymptoms,\n\tattendedSchool,\n\tlessonsAttended\n}"
    );
  }
  if (!Array.isArray(symptoms)) {
    return send(400, "Invalid request. Symptoms must be an array");
  }
  if (!Array.isArray(lessonsAttended)) {
    return send(400, "Invalid request. LessonsAttended must be an array");
  }
  const symptomsName = symptoms.map(({ name }) => name);
  const lessons = lessonsAttended.map(({ _id, days }) => {
    const daysDate = days.map(({ date }) => date);
    return { lesson: _id, days: daysDate };
  });
  const report = {
    date: new Date(),
    studentID,
    hasTestPhoto,
    testPhoto,
    sinceDay,
    symptoms: symptomsName,
    attendedSchool,
    lessonsAttended: lessons,
  };
  const newReport = new Report(report);
  await newReport.save();
  return send(201, `Report saved - ${newReport._id}`);
};

export default httpTrigger;
