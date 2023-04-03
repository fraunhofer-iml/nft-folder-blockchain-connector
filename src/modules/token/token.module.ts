import { Module } from '@nestjs/common';
import { TokenController } from './controller/token.controller';
import {TokenConnector} from "./sc-connector/token.connector";
import {BlockchainConnectorModule} from "../blockchain-connector/blockchain-connector.module";

@Module({
  controllers: [TokenController],
  providers: [TokenConnector],
  imports: [BlockchainConnectorModule]
})
export class TokenModule {}
