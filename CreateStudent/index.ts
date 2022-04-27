import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { connectDB, send } from "../global-functions";
import { Response } from "../types";
import Student from "../models/Student";

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<Response> {
  context.log("Create User request.");
  const connected = await connectDB();
  if (!connected) {
    return send(503, "Database Unavailable");
  }
  const studentID = req.body && req.body.studentID;
  const name = req.body && req.body.name;
  const paternalSurname = req.body && req.body.paternalSurname;
  const maternalSurname = req.body && req.body.maternalSurname;
  const email = req.body && req.body.email;
  const telephone = req.body && req.body.telephone;
  const password = req.body && req.body.password;
  if (!studentID || !name || !paternalSurname || !maternalSurname || !email || !telephone || !password) {
    return send(
      400,
      "Invalid request. Structure must be:\n{\n\tstudentID,\n\tname,\n\tpaternalSurname,\n\tmaternalSurname,\n\temail,\n\ttelephone,\n\tpassword\n}"
    );
  }
  const student = {
    studentID,
    name,
    paternalSurname,
    maternalSurname,
    email,
    telephone,
    password,
  };
  const newStudent = new Student(student);
  await newStudent.save();
  return send(201, `Student saved - ${newStudent._id}`);
};

export default httpTrigger;
