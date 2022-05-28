import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { connectDB, send } from "../global-functions";
import { Response } from "../types";
import Report from "../models/Report";

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<Response> {
  context.log("Get Reports request.");
  const connected = await connectDB();
  if (!connected) {
    return send(503, "Database Unavailable");
  }
  const reports = await Report.find({},{studentID:1, date: 1, hasTest: 1, sinceDay: 1, symptoms: 1})
  return send(200, reports);
};

export default httpTrigger;
