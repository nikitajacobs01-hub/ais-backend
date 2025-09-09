import { FastifyInstance } from "fastify";
import {
  submitAccidentForm,
  getAllAccidents,
  getAccidentById,
  assignTowCompany,
} from "../controllers/accidentController";

export default async function (fastify: FastifyInstance) {
  fastify.post("/accident-form", submitAccidentForm);
  fastify.get("/accidents", getAllAccidents); 
  fastify.get("/accidents/:id", getAccidentById); // fetch single accident by ID
  fastify.patch("/accidents/:id/assign-tow", assignTowCompany); // assign tow company
}
