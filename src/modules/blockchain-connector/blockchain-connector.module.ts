import { Module } from '@nestjs/common';


const blockchain_url = "";
const Web3Service = {
    provide: 'Web3Service',
    useFactory: async () => {
        const Web3 = require('web3');
        return new Web3(blockchain_url);
        //return new Web3(env.get<string>('BLOCKCHAIN_URL'));
    }
}

@Module({})
export class BlockchainConnectorModule {}
