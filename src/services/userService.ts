import User, { IUser } from '../models/userModel'

class UserService {
  async getAllUsers(): Promise<IUser[]> {
    return await User.find().lean()
  }

  async createUser(data: { name: string; email: string; password: string }): Promise<IUser> {
    // Pass an object, not a string
    const user = new User({
      name: data.name,
      email: data.email,
      password: data.password
    })
    console.log('Creating user with data:', data)
    return await user.save()
  }
}

export default new UserService()
