import { randomInt } from "crypto";
import { Otp } from "../entities/otp.entity";
import { Inject, Injectable } from "@nestjs/common";
import { OtpRepositoryInterface } from "../interfaces/otp.interface";
import { BaseServiceAbstract } from "@common/mongo/base/services/base.abstract.service";


@Injectable()
export class OtpService extends BaseServiceAbstract<Otp> {
    constructor(
        @Inject("OtpRepositoryInterface")
        private readonly otpRepository: OtpRepositoryInterface
    ) {
        super(otpRepository)
    }

    private async generatorTokenRandom() {
        return randomInt(0, Math.pow(2, 32)).toString()
    }

    async createOtp(email: string) {
        const token = await this.generatorTokenRandom()

        const otp = await this.otpRepository.create({
            email,
            token
        } as Otp)

        return otp
    }
}