import { Module } from '@nestjs/common';
import { SegmentController } from './controller/segment.controller';
import {SegmentConnectorService} from "./sc-connector/segment.connector.service";
import {BlockchainConnectorModule} from "../blockchain-connector/blockchain-connector.module";
import {ApiConfigService} from "../../settings/ApiConfigService";
import {ConfigModule} from "@nestjs/config";

@Module({
  controllers: [SegmentController],
  providers: [SegmentConnectorService, ApiConfigService],
  imports: [
      BlockchainConnectorModule,
      ConfigModule]
})
export class SegmentModule {}
