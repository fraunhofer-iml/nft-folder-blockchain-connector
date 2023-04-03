import { Module } from '@nestjs/common';
import { ContainerController } from './controller/container.controller';
import {BlockchainConnectorModule} from "../blockchain-connector/blockchain-connector.module";
import {ContainerConnectorService} from "./sc-connector/container.connector.service";

@Module({
  controllers: [ContainerController],
  providers: [ContainerConnectorService],
  imports: [BlockchainConnectorModule]
})
export class ContainerModule {}
