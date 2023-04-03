import { Module } from '@nestjs/common';
import {BlockchainConnectorService} from "./blockchain-connector.service";
import {ApiConfigService} from "../../settings/ApiConfigService";
import {ConfigService} from "@nestjs/config";

const Web3Service = {
    provide: 'Web3Service',
    useFactory: async (apiConfigService: ConfigService) => {
        const Web3 = require('web3');
        console.log(apiConfigService)
        return new Web3(apiConfigService.get<string>('BLOCKCHAIN_URL'));
    }, inject: [ConfigService]
}

@Module({
    providers: [BlockchainConnectorService, Web3Service, ApiConfigService],
    exports: [BlockchainConnectorService, Web3Service]
})
export class BlockchainConnectorModule {}
