import { FastifyRequest, FastifyReply } from 'fastify';
import Accident, { IAccident } from '../models/accidentModel';

interface AssignTowBody {
  accidentId: string;
  towCompanyName: string;
  towCompanyPhone: string;
}

export const assignTowCompany = async (
  req: FastifyRequest<{ Body: AssignTowBody }>,
  res: FastifyReply
) => {
  const { accidentId, towCompanyName, towCompanyPhone } = req.body;

  const accident = (await Accident.findById(accidentId)) as IAccident | null;
  if (!accident) return res.status(404).send({ error: 'Accident not found' });

  accident.towCompanyAssigned = towCompanyName;
  accident.status = 'assigned';
  await accident.save();

  const clientMsg = `Hi ${accident.clientName}, tow company ${towCompanyName} is on the way. Contact: ${towCompanyPhone}`;
  const towMsg = `New accident assigned. Client: ${accident.clientName}, Phone: ${accident.clientPhone}, Location: ${accident.accidentLocation.address}`;

  const clientWa = `https://wa.me/${accident.clientPhone.replace(/[^0-9]/g,'')}?text=${encodeURIComponent(clientMsg)}`;
  const towWa = `https://wa.me/${towCompanyPhone.replace(/[^0-9]/g,'')}?text=${encodeURIComponent(towMsg)}`;

  res.send({ clientWa, towWa });
};
