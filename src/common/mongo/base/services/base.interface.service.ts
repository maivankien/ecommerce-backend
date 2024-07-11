import { PopulateOptions, ProjectionType, QueryOptions } from 'mongoose'

export interface Write<T> {
    create(item: T): Promise<T>
    remove(id: string): Promise<boolean>
    update(id: string, item: Partial<T>): Promise<T>
}

export interface Read<T> {
    findOneById(id: string, projection?: ProjectionType<T>, options?: QueryOptions<T>): Promise<T>
    findOneByCondition(filter: Partial<T>, populate?: PopulateOptions | PopulateOptions[]): Promise<T>
    findAll(filter?: object, options?: object, populate?: PopulateOptions | PopulateOptions[]): Promise<T[]>
}

export interface BaseServiceInterface<T> extends Write<T>, Read<T> { }
