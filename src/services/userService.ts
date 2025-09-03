import User, { IUser } from "../models/userModel";
import bcrypt from "bcrypt";

class UserService {
    async getAllUsers(): Promise<IUser[]> {
        return await User.find().lean();
    }

    async createUser(data: { name: string; email: string; password: string }): Promise<IUser> {
        const hashedPassword = await bcrypt.hash(data.password, 10); // hash password
        const user = new User({
            name: data.name,
            email: data.email,
            password: hashedPassword, // save hashed password
            status: "pending", // default
            role: "user",      // default
        });
        return await user.save();
    }

    async findUserByEmail(email: string): Promise<IUser | null> {
        return await User.findOne({ email });
    }

    async validateUser(email: string, password: string): Promise<IUser | null> {
        const user = await this.findUserByEmail(email);
        if (!user) return null;

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return null;

        return user;
    }
}

export default new UserService();
