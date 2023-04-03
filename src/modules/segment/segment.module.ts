import { Module } from '@nestjs/common';
import { SegmentController } from './controller/segment.controller';
import {SegmentConnectorService} from "./sc-connector/segment.connector.service";
import {BlockchainConnectorModule} from "../blockchain-connector/blockchain-connector.module";

@Module({
  controllers: [SegmentController],
  providers: [SegmentConnectorService],
  imports: [BlockchainConnectorModule]
})
export class SegmentModule {}
