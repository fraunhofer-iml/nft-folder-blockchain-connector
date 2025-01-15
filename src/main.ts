/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

import { INestApplication, Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ConfigurationService } from './configuration/configuration.service';

async function setUpSwagger(app: INestApplication, swaggerPath: string) {
  const config = new DocumentBuilder()
    .setTitle('Blockchain Connector')
    .setDescription('This web API provides endpoints to manage Segments and Tokens.')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(swaggerPath, app, document);
}

async function bootstrap() {
  const app: INestApplication = await NestFactory.create(AppModule);
  const blockchainConfiguration = app.get(ConfigurationService).getBlockchainConfiguration();

  setUpSwagger(app, blockchainConfiguration.swaggerPath);

  app.useGlobalPipes(new ValidationPipe());
  app.useLogger(blockchainConfiguration.logLevels);

  await app.listen(blockchainConfiguration.port);

  const url = `http://localhost:${blockchainConfiguration.port}/${blockchainConfiguration.swaggerPath}`;
  Logger.log(`🔗 Blockchain Connector API available at: ${url}`);
}

bootstrap().catch((error) => {
  Logger.error('❌ Error starting Blockchain Connector', error);
  process.exit(1);
});
