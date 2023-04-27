/**
 * Copyright 2023 Open Logistics Foundation
 *
 * Licensed under the Open Logistics License 1.0.
 * For details on the licensing terms, see the LICENSE file.
 */

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Transport } from '@nestjs/microservices';
import { Logger } from '@nestjs/common';
import { ApiConfigService } from './settings/apiConfig.service';

async function bootstrap() {
  const logger = new Logger('Main.ts');
  const app = await NestFactory.create(AppModule);
  const configService = app.get<ApiConfigService>(ApiConfigService);

  if (configService.USE_AMQP) {
    const app = await NestFactory.createMicroservice(AppModule, {
      transport: Transport.RMQ,
      options: {
        urls: [configService.AMQP_URL],
        queue: configService.AMQP_BASE_QUEUE,
        noAck: false,
        queueOptions: {
          durable: false,
        },
      },
    });
    app.listen().then(() => logger.log(`Server started and listening`));
  } else {
    const config = new DocumentBuilder()
      .setTitle('Blockchain Connector')
      .setDescription('How to manage Token, Segment and Container')
      .setVersion('1.0')
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);
    await app.listen(3000);
  }
}

bootstrap();
