import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule)

    const port = process.env.APP_PORT
    await app.init()

    await app.listen(port)
}

bootstrap()
