import { BaseServiceInterface } from "./base.interface.service";
import { BaseMongoDBEntity } from "../base.mongo.entity";
import { BaseRepositoryInterface } from "../repositories/base.interface.repository";
import { FilterQuery, PopulateOptions, ProjectionType, QueryOptions, UpdateQuery } from "mongoose";


export abstract class BaseServiceAbstract<T extends BaseMongoDBEntity>
    implements BaseServiceInterface<T> {
    constructor(private readonly repository: BaseRepositoryInterface<T>) { }

    async create(input: T): Promise<T> {
        return await this.repository.create(input)
    }

    async findOneAndUpdate(filter: FilterQuery<T>, update: UpdateQuery<T>, options?: QueryOptions<T>): Promise<T> {
        return await this.repository.findOneAndUpdate(filter, update, options)
    }

    async find(
        filter: FilterQuery<T>,
        projection?: ProjectionType<T>,
        options?: QueryOptions<T>,
        populate?: PopulateOptions | PopulateOptions[]): Promise<T[]> {
        return await this.repository.find(filter, projection, options, populate)
    }

    async findAll(filter?: Partial<T>, options?: object, populate?: PopulateOptions | PopulateOptions[]): Promise<T[]> {
        return await this.repository.findAll(filter, options, populate)
    }

    async findOneById(id: string, projection?: ProjectionType<T>, options?: QueryOptions<T>): Promise<T> {
        return await this.repository.findOneById(id, projection, options)
    }

    async findOneByCondition(filter: FilterQuery<T>, projection?: ProjectionType<T>, populate?: PopulateOptions | PopulateOptions[]): Promise<T> {
        return await this.repository.findOneByCondition(filter, projection, populate)
    }

    async update(id: string, input: UpdateQuery<T>): Promise<T> {
        return await this.repository.update(id, input)
    }

    async updateOne(filter: FilterQuery<T>, input: UpdateQuery<T>) {
        return await this.repository.updateOne(filter, input)
    }

    async remove(id: string): Promise<boolean> {
        return await this.repository.softDelete(id)
    }

    async aggregate(pipeline: object[]): Promise<T[]> {
        return await this.repository.aggregate(pipeline)
    }
}
