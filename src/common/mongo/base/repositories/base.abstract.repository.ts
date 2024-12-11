import { BaseMongoDBEntity } from '../base.mongo.entity';
import { BaseRepositoryInterface } from './base.interface.repository';
import { FilterQuery, Model, PipelineStage, ProjectionType, QueryOptions, PopulateOptions, UpdateQuery } from 'mongoose';

export abstract class BaseRepositoryAbstract<T extends BaseMongoDBEntity>
    implements BaseRepositoryInterface<T> {
    protected constructor(private readonly model: Model<T>) {
        this.model = model
    }

    async create(dto: T): Promise<T> {
        const result = await this.model.create(dto)
        await result.save()
        return result
    }

    async findOneAndUpdate(filter: FilterQuery<T>, update: UpdateQuery<T>, options?: QueryOptions<T>): Promise<T> {
        return await this.model.findOneAndUpdate(filter, update, options).lean()
    }

    async findOneById(
        id: string,
        projection?: string,
        options?: QueryOptions<T>,
    ): Promise<T> {
        const item = await this.model.findById(id, projection, options).exec()
        return item?.deleted_at ? null : item
    }

    async findOne(
        condition: FilterQuery<T>,
        projection?: ProjectionType<T>,
        options?: QueryOptions<T>,
        populate?: PopulateOptions | PopulateOptions[]
    ): Promise<T> {
        const query = this.model.findOne({ ...condition, deleted_at: null }, projection, options)
        if (populate) {
            query.populate(populate)
        }
        return await query.lean()
    }

    async findOneByCondition(
        condition = {},
        projection?: string,
        populate?: PopulateOptions | PopulateOptions[]
    ): Promise<T> {
        const query = this.model.findOne({ ...condition, deleted_at: null }, projection)
        if (populate) {
            query.populate(populate)
        }
        return await query.lean()
    }

    async find(
        condition: FilterQuery<T>,
        projection?: ProjectionType<T>,
        options?: QueryOptions<T>,
        populate?: PopulateOptions | PopulateOptions[]
    ): Promise<T[]> {
        const query = this.model.find({ ...condition, deleted_at: null }, projection, options)
        if (populate) {
            query.populate(populate)
        }
        return await query.exec()
    }

    async findAll(
        condition: FilterQuery<T>,
        options?: QueryOptions<T>,
        populate?: PopulateOptions | PopulateOptions[]
    ): Promise<T[]> {
        const query = this.model.find({ ...condition, deleted_at: null }, options?.projection, options)
        if (populate) {
            query.populate(populate)
        }
        return await query.exec()
    }

    async updateMany(filter: FilterQuery<T>, dto: UpdateQuery<T>) {
        return await this.model.updateMany(filter, dto)
    }

    async update(id: string, dto: UpdateQuery<T>): Promise<T> {
        return await this.model.findOneAndUpdate(
            { _id: id, deleted_at: null },
            dto,
            { new: true },
        ).exec()
    }

    async updateOne(filter: FilterQuery<T>, input: UpdateQuery<T>) {
        return await this.model.updateOne(filter, input)
    }

    async deleteMany(filter: FilterQuery<T>): Promise<boolean> {
        return !!(await this.model.deleteMany(filter).exec())
    }

    async softDelete(id: string): Promise<boolean> {
        const delete_item = await this.model.findById(id)
        if (!delete_item) {
            return false
        }
        return !!(await this.model.findByIdAndUpdate<T>(id, { deleted_at: new Date() }).exec())
    }

    async permanentlyDelete(id: string): Promise<boolean> {
        const delete_item = await this.model.findById(id)
        if (!delete_item) {
            return false
        }
        return !!(await this.model.findOneAndDelete({ _id: id }).exec())
    }

    async aggregate(pipeline: PipelineStage[]): Promise<T[]> {
        return await this.model.aggregate(pipeline).exec()
    }
}
