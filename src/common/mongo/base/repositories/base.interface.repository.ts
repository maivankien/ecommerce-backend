import { FilterQuery, ProjectionType, QueryOptions, PopulateOptions, UpdateQuery } from 'mongoose';

export interface BaseRepositoryInterface<T> {
    create(dto: T): Promise<T>

    createMany(dtoList: T[]): Promise<T[]>

    findOneById(
        id: string,
        projection?: ProjectionType<T>,
        options?: QueryOptions<T>
    ): Promise<T>

    findOneAndUpdate(filter: FilterQuery<T>, update: UpdateQuery<T>, options?: QueryOptions<T>): Promise<T>

    findOne(
        condition: FilterQuery<T>,
        projection?: ProjectionType<T>,
        options?: QueryOptions<T>,
        populate?: PopulateOptions | PopulateOptions[]
    ): Promise<T>

    findOneByCondition(
        condition?: FilterQuery<T>,
        projection?: ProjectionType<T>,
        populate?: PopulateOptions | PopulateOptions[]
    ): Promise<T>

    find(
        condition: FilterQuery<T>,
        projection?: ProjectionType<T>,
        options?: QueryOptions<T>,
        populate?: PopulateOptions | PopulateOptions[]
    ): Promise<T[]>

    findAll(
        condition: FilterQuery<T>,
        options?: QueryOptions<T>,
        populate?: PopulateOptions | PopulateOptions[]
    ): Promise<T[]>

    update(id: string, dto: UpdateQuery<T>): Promise<T>

    updateMany(filter: FilterQuery<T>, dto: UpdateQuery<T>)

    updateOne(filter: FilterQuery<T>, dto: UpdateQuery<T>)

    deleteMany(filter: FilterQuery<T>): Promise<boolean>

    softDelete(id: string): Promise<boolean>

    permanentlyDelete(id: string): Promise<boolean>

    aggregate(pipeline: object[]): Promise<T[] | any[]>
}
