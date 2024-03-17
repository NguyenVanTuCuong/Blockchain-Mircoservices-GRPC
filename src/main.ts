import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.GRPC,
      options: {
        url: "localhost:5001",
        package: 'nft',
        protoPath: join(process.cwd(), "protos", 'nft.proto'),
      },
    },
  );

  await app.listen();
}
bootstrap();
