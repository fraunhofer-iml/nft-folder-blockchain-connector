import { Module } from '@nestjs/common';
import {BlockchainConnectorService} from "./blockchain-connector.service";
import {ApiConfigService} from "../../settings/ApiConfigService";
import {ConfigService} from "@nestjs/config";
const Web3 = require('web3');
var HDWalletProvider = require("truffle-hdwallet-provider");

const Web3Service = {
    provide: 'Web3Service',
    useFactory: async (apiConfigService: ConfigService) => {

        //ToDo: fix provider error: handleRevert does not work, if the provider is used for initialisation
        var provider = new HDWalletProvider(
            apiConfigService.get<string>('MNEMONIC_PASS_PHRASE'),
            apiConfigService.get<string>('BLOCKCHAIN_URL'),
            0, 10);

        let web3 =  new Web3(apiConfigService.get<string>('BLOCKCHAIN_URL'));
        web3.eth.handleRevert = true;
        return web3;
    }, inject: [ConfigService]
}

@Module({
    providers: [BlockchainConnectorService, Web3Service, ApiConfigService],
    exports: [BlockchainConnectorService, Web3Service]
})
export class BlockchainConnectorModule {}
