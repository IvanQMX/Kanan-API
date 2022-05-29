import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import mongoose from "mongoose";
import { connectDB, send } from "../global-functions";
import Report from "../models/Report";
import { Response } from "../types";

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<Response> {
  context.log("Delete Report request.");
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
  await Report.findByIdAndDelete(id);
  return send(200, "Report Deleted");
};

export default httpTrigger;
