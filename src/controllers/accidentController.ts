// src/controllers/accidentController.ts
import { FastifyRequest, FastifyReply } from "fastify";
import { MultipartFile } from "@fastify/multipart";
import Accident from "../models/accidentModel";
import AccidentLink from "../models/accidentLinkModel";
import cloudinary from "../config/cloudinary";

export const submitAccidentForm = async (req: FastifyRequest, res: FastifyReply) => {
  try {
    const parts = req.parts(); // async iterator for fields + files

    let fields: Record<string, any> = {};
    let carRegistrationImageUrl: string | undefined;
    let accidentImagesUrls: string[] = [];

    for await (const part of parts) {
      console.log("Received part:", part.fieldname, (part as any).file ? "file" : "field");

      // If it's a file
      if ((part as any).file) {
        const filePart = part as any;

        if (filePart.fieldname === "carRegistrationImage") {
          const upload = await new Promise<any>((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
              { folder: "accidents/registration" },
              (err, result) => (err ? reject(err) : resolve(result))
            );
            filePart.file.pipe(stream);
          });
          carRegistrationImageUrl = upload.secure_url;
          console.log("Car registration image uploaded:", carRegistrationImageUrl);
        }

        if (filePart.fieldname === "accidentImages") {
          const upload = await new Promise<any>((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
              { folder: "accidents/images" },
              (err, result) => (err ? reject(err) : resolve(result))
            );
            filePart.file.pipe(stream);
          });
          accidentImagesUrls.push(upload.secure_url);
          console.log("Accident image uploaded:", upload.secure_url);
        }
      } else {
        // Otherwise it's a normal field
        fields[part.fieldname] = (part as any).value; // string values
      }
    }

    console.log("All normal fields:", fields);

    const { token, vehicleMake, vehicleModel, lat, lng, address, insuranceCompany, description } = fields;

    // Validate token
    const link = await AccidentLink.findOne({ token });
    if (!link || link.used || link.expiresAt < new Date()) {
      return res.status(403).send({ error: "Invalid or expired token" });
    }

    // Create accident entry
    const accident = await Accident.create({
      clientName: link.clientName,
      clientEmail: link.clientEmail,
      clientPhone: link.clientPhone,
      vehicleMake,
      vehicleModel,
      accidentLocation: { lat: Number(lat), lng: Number(lng), address },
      insuranceCompany,
      description,
      carRegistrationImage: carRegistrationImageUrl,
      accidentImages: accidentImagesUrls,
    });

    console.log("Accident saved with ID:", accident._id);

    // Mark token as used
    link.used = true;
    await link.save();

    res.send({ success: true, accidentId: accident._id });
  } catch (err) {
    console.error("Submit accident error:", err);
    res.status(500).send({ error: "Server error", details: (err as Error).message });
  }
};

// Fetch all accidents
export const getAllAccidents = async (_req: FastifyRequest, reply: FastifyReply) => {
  try {
    const accidents = await Accident.find().sort({ createdAt: -1 });
    reply.send({ success: true, accidents });
  } catch (err) {
    console.error(err);
    reply.status(500).send({ success: false, message: "Server error" });
  }
};

// Get single accident by ID
export const getAccidentById = async (
  req: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) => {
  try {
    const accident = await Accident.findById(req.params.id);
    if (!accident) return reply.status(404).send({ message: "Accident not found" });
    reply.send(accident);
  } catch (err) {
    console.error(err);
    reply.status(500).send({ message: "Server error" });
  }
};

// Assign tow company and update status
// Assign tow company and update status
export const assignTowCompany = async (
  req: FastifyRequest<{ Params: { id: string }; Body: { towCompany: string; towWhatsapp?: string } }>,
  reply: FastifyReply
) => {
  const { id } = req.params;
  const { towCompany, towWhatsapp } = req.body;

  if (!towCompany) return reply.status(400).send({ message: "Tow company required" });
  if (!towWhatsapp) return reply.status(400).send({ message: "Tow company WhatsApp number required" });

  try {
    const accident = await Accident.findById(id);
    if (!accident) return reply.status(404).send({ message: "Accident not found" });

    // Assign tow company and update status
    accident.towCompanyAssigned = towCompany;
    accident.status = "assigned";
    await accident.save();

    // Construct WhatsApp message
    const message = `
Hello ${towCompany} 🚨

A new accident has been reported:

Client: ${accident.clientName}
Phone: ${accident.clientPhone}
Vehicle: ${accident.vehicleMake} ${accident.vehicleModel}
Location: ${accident.accidentLocation.address}
Description: ${accident.description || "N/A"}

Please respond to this message to confirm assistance.
`;

    // Encode message for URL
    const encodedMessage = encodeURIComponent(message);
    const waLink = `https://wa.me/${towWhatsapp.replace(/\D/g, "")}?text=${encodedMessage}`;

    // Return wa.me link to frontend (frontend can open in new tab)
    reply.send({
      success: true,
      accident,
      waLink,
      note: "Status set to 'assigned'. Images are not sent via WhatsApp."
    });
  } catch (err) {
    console.error(err);
    reply.status(500).send({ message: "Server error" });
  }
};
