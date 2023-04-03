import { Module } from '@nestjs/common';
import { ContainerController } from './controller/container.controller';
import {BlockchainConnectorModule} from "../blockchain-connector/blockchain-connector.module";
import {ContainerConnectorService} from "./sc-connector/container.connector.service";
import {ConfigModule} from "@nestjs/config";
import {ApiConfigService} from "../../settings/ApiConfigService";

@Module({
  controllers: [ContainerController],
  providers: [ContainerConnectorService, ApiConfigService],
  imports: [
      BlockchainConnectorModule,
      ConfigModule]
})
export class ContainerModule {}
