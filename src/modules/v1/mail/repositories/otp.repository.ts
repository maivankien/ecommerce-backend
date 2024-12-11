import { Model } from "mongoose";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Otp, OtpDocument } from "../entities/otp.entity";
import { OtpRepositoryInterface } from "../interfaces/otp.interface";
import { BaseRepositoryAbstract } from "@common/mongo/base/repositories/base.abstract.repository";


@Injectable()
export class OtpRepository
    extends BaseRepositoryAbstract<Otp>
    implements OtpRepositoryInterface {
    constructor(
        @InjectModel(Otp.name)
        private readonly otpModel: Model<OtpDocument>
    ) {
        super(otpModel)
    }
}