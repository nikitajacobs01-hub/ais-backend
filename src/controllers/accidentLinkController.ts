import { FastifyRequest, FastifyReply } from 'fastify';
import { generateToken } from '../utils/generateToken';
import AccidentLink from '../models/accidentLinkModel';

export const createAccidentLink = async (
    req: FastifyRequest<{ Body: { name: string; email?: string; phone: string } }>,
    res: FastifyReply
) => {
    const { name, email, phone } = req.body;
    const token = generateToken();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    const link = await AccidentLink.create({ token, clientName: name, clientEmail: email, clientPhone: phone, expiresAt });

    const formUrl = `https://iasmag.vercel.app/accident-form?token=${link.token}`;
    const waLink = `https://wa.me/${phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hi ${name}, please fill your accident info here: ${formUrl}`)}`;

    res.send({ waLink, token });
};

export const validateAccidentLink = async (
    req: FastifyRequest<{ Params: { token: string } }>,
    res: FastifyReply
) => {
    const { token } = req.params;
    const link = await AccidentLink.findOne({ token });

    if (!link || link.used || link.expiresAt < new Date()) {
        return res.status(403).send({ message: "Invalid or expired token" });
    }

    res.send({
        valid: true,
        clientName: link.clientName,
        clientPhone: link.clientPhone,
        clientEmail: link.clientEmail,
    });
};
