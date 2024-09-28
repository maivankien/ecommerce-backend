import { Model } from "mongoose";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Order, OrderDocument } from "../entities/order.entity";
import { OrderRepositoryInterface } from "../interfaces/order.interface";
import { BaseRepositoryAbstract } from "@common/mongo/base/repositories/base.abstract.repository";


@Injectable()
export class OrderRepository
    extends BaseRepositoryAbstract<Order>
    implements OrderRepositoryInterface {
    constructor(
        @InjectModel(Order.name)
        private readonly orderModel: Model<OrderDocument>
    ) {
        super(orderModel)
    }
}