import { FastifyReply, FastifyRequest } from "fastify";
import UserService from "../services/userService";

interface RegisterBody {
    name: string;
    email: string;
    password: string;
}

interface LoginBody {
    email: string;
    password: string;
}

export const register = async (req: FastifyRequest<{ Body: RegisterBody }>, reply: FastifyReply) => {
    const { name, email, password } = req.body;

    const existing = await UserService.findUserByEmail(email);
    if (existing) return reply.status(400).send({ error: "User already exists" });

    const user = await UserService.createUser({ name, email, password });

    // Fast fix: return user object instead of token
    return { user, message: "User registered successfully" };
};

export const login = async (req: FastifyRequest<{ Body: LoginBody }>, reply: FastifyReply) => {
    const { email, password } = req.body;

    const user = await UserService.validateUser(email, password);
    if (!user) return reply.status(401).send({ error: "Invalid credentials" });

    return { user, message: "Login successful" };
};
