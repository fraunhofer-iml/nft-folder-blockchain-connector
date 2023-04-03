import { Module } from '@nestjs/common';
import { TokenController } from './controller/token.controller';
import {TokenConnectorService} from "./sc-connector/token.connector.service";
import {BlockchainConnectorModule} from "../blockchain-connector/blockchain-connector.module";
import {ApiConfigService} from "../../settings/ApiConfigService";
import {SegmentAllocationConnectorService} from "./sc-connector/segment-allocation.connector.service";
import {SegmentAllocationController} from "./controller/segment-allocation.controller";
import {ConfigModule} from "@nestjs/config";

@Module({
  controllers: [TokenController, SegmentAllocationController],
  providers: [TokenConnectorService, SegmentAllocationConnectorService, ApiConfigService],
  imports: [
      BlockchainConnectorModule,
      ConfigModule]
})
export class TokenModule {}
