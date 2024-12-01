import { Module } from "@nestjs/common";
import { OrderedService } from "./ordered.service";


@Module({
    imports: [],
    controllers: [],
    providers: [OrderedService],
})
export class OrderedModule {}