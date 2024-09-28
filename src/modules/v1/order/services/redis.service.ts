import { Redis } from "ioredis";
import { Inject, Injectable } from "@nestjs/common";
import { convertToObjectId } from "@common/utils/common.util";
import { InventoryService } from "@modules/v1/product/services/inventory.service";
import { RedisSetOptions } from "@common/enums/redis.enum";

@Injectable()
export class RedisOrderService {
    constructor(
        @Inject('REDIS_CLIENT')
        private readonly redisClient: Redis,

        private readonly inventoryService: InventoryService,
    ) { }

    private async reservationInventory(cartId: string, productId: string, quantity: number) {
        const query = {
            inven_stock: { $gte: quantity },
            inven_product_id: convertToObjectId(productId),
        }

        const updatpSet = {
            $inc: { inven_stock: -quantity },
            $push: {
                inven_reservations: {
                    quantity: quantity,
                    created_at: new Date(),
                    cart_id: convertToObjectId(cartId),
                }
            }
        }

        return await this.inventoryService.updateOne(query, updatpSet)
    }

    async acquireLock(cartId: string, productId: string, quantity: number) {
        const value = "1"
        const retryTimes = 10
        const exprireTime = 3000
        const key = `lock_v2023_${productId}`

        for (let i = 0; i < retryTimes; i++) {
            const result = await this.redisClient.set(key, value, RedisSetOptions.EXPIRE_IN_MILLISECONDS, exprireTime, RedisSetOptions.ONLY_IF_NOT_EXISTS)

            console.log('result', result)

            if (result) {
                const isReservation = await this.reservationInventory(cartId, productId, quantity)

                console.log('isReservation', isReservation)

                if (isReservation?.modifiedCount) {
                    await this.redisClient.pexpire(key, exprireTime)
                    return key
                }

                return null
            }
            await new Promise(resolve => setTimeout(resolve, 50))
        }
    }

    async releaseLock(key: string) {
        return await this.redisClient.del(key)
    }
}