import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { connectDB, send } from "../global-functions";
import { Response } from "../types";
import Report from "../models/Report";
import Student from "../models/Student";
import mongoose from "mongoose";
import Mailjet from "node-mailjet";

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<Response> {
  context.log("Approve Report request.");
  const MailjetPublicKey = process.env.MailjetPublicKey;
  const MailjetPrivateKey = process.env.MailjetPrivateKey;
  const connected = await connectDB();
  if (!connected) {
    return send(503, "Database Unavailable");
  }
  const id = req.body && req.body.id;
  const studentID = req.body && req.body.studentID;
  if (!id || !studentID) {
    return send(400, "Invalid request. Structure must be:\n{\n\tid\n\tstudentID\n}");
  }
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return send(400, "Invalid request. Id must be an Mongoose Object ID");
  }
  const report = await Report.findByIdAndUpdate(id, { approved: true }).populate({
    path: "lessonsAttended.lesson",
    select: "subject students",
    model: "Lesson",
    populate: [{ path: "students", select: "name email studentID", model: "Student" }],
  });
  if (!report.attendedSchool) {
    send(200, "Report Approved");
  }
  const mailjet = Mailjet.connect(MailjetPublicKey, MailjetPrivateKey);
  for (const lessonReference of report.lessonsAttended) {
    const { subject, students } = lessonReference.lesson as any;
    const days = lessonReference.days.map((day)=>day.toLocaleDateString()).join(", ");
    const receivers: any[] = students
      .filter((student) => student.studentID !== studentID)
      .map((student) => {
        return { Name: student.name, Email: student.email };
      });
    if (receivers.length !== 0) {
      await mailjet.post("send", { version: "v3.1" }).request({
        Messages: [
          {
            From: {
              Email: "registro@aigaminglatam.org",
              Name: "Kanan",
            },
            To: receivers,
            TemplateID: 3967461,
            TemplateLanguage: true,
            Subject: "Alerta Kanan",
            Variables: { Subject: subject, Days: days },
          },
        ],
      });
    }
  }
  return send(200, "Report Approved");
};

export default httpTrigger;
