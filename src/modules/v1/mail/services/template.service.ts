import { Template } from "../entities/template.entity";
import { ConflictException, Inject, Injectable } from "@nestjs/common";
import { TemplateRepositoryInterface } from "../interfaces/template.interface";
import { BaseServiceAbstract } from "@common/mongo/base/services/base.abstract.service";


@Injectable()
export class TemplateService extends BaseServiceAbstract<Template> {
    constructor(
        @Inject("TemplateRepositoryInterface")
        private readonly templateRepository: TemplateRepositoryInterface
    ) {
        super(templateRepository)
    }

    async newTemplate(tem_id: number, name: string, html: string) {
        const template = await this.templateRepository.findOne({ name }, { name: 1 })

        if (template) {
            throw new ConflictException('Template already exists')
        }

        return await this.templateRepository.create({
            tem_id,
            name, // unique
            html,
        } as Template)
    }

    async getTemplate(name: string) {
        return await this.templateRepository.findOne({ name })
    }
}