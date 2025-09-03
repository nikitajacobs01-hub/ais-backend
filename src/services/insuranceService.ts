import Insurance, { IInsurance } from '../models/insuranceModel'

class InsuranceService {
  async getAllInsurances(): Promise<IInsurance[]> {
    return await Insurance.find().lean()
  }

  async createInsurance(data: Partial<IInsurance>): Promise<IInsurance> {
    const insurance = new Insurance(data)
    return await insurance.save()
  }
}

export default new InsuranceService()
