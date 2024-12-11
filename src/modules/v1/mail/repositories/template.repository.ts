import { Model } from "mongoose";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Template, TemplateDocument } from "../entities/template.entity";
import { TemplateRepositoryInterface } from "../interfaces/template.interface";
import { BaseRepositoryAbstract } from "@common/mongo/base/repositories/base.abstract.repository";


@Injectable()
export class TemplateRepository
    extends BaseRepositoryAbstract<Template>
    implements TemplateRepositoryInterface {
    constructor(
        @InjectModel(Template.name)
        private readonly templateModel: Model<TemplateDocument>
    ) {
        super(templateModel)
    }
}