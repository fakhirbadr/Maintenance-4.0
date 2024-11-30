import mongoose from "mongoose";

const vaccinTypeSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId },
  name: { type: String, required: true },
  createdAt: { type: Date },
  updatedAt: { type: Date },
  __v: { type: Number },
});

const regionSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId },
  created: { type: Date },
  name: { type: String, required: true },
  __v: { type: Number },
});

const provinceSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId },
  name: { type: String, required: true },
  lat: { type: Number },
  lng: { type: Number },
  createdAt: { type: Date },
  updatedAt: { type: Date },
  deviceCounter: { type: Number },
  region: { type: mongoose.Schema.Types.ObjectId, ref: "Region" },
  abbreviation: { type: String },
  __v: { type: Number },
});

const alerteSchema = new mongoose.Schema({
  alertedAt: { type: Date, required: true },
  type: { type: String, required: true },
  stateDevice: { type: Number, required: true },
  serial: { type: String, required: true },
  value: { type: Number, required: true },
  level: { type: String, required: true },
  name: { type: String },
  ref: { type: String },
  marque: { type: String },
  thermostat: { type: String },
  vaccinTypes: [vaccinTypeSchema],
  region: regionSchema,
  province: provinceSchema,
});

const Alert = mongoose.model("Alert", alerteSchema);

export default Alert;
