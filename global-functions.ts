import mongoose from "mongoose";
import { Response } from "./types";

const URI = process.env.AzureCosmosDBURI;

export const send = (status: number, body: any): Response => {
  return {
    status,
    body,
  };
};

export const connectDB = () =>
  mongoose
    .connect(URI)
    .then(() => true)
    .catch((e) => {
      console.log(e);
      return false;
    });
