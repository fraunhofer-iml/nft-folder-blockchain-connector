import {BlockchainConnectorService} from "../../blockchain-connector/blockchain-connector.service";
import {ApiConfigService} from "../../../settings/ApiConfigService";
import {MigrationsAbi} from "./migrations.abi";
import {Injectable} from "@nestjs/common";

@Injectable()
export class MigrationsConnectorService {

    private contract: any;

    constructor(
        private readonly blockchainConnectorService: BlockchainConnectorService,
        private apiConfigService: ApiConfigService
    ) {
        this.contract = new this.blockchainConnectorService.web3.eth.Contract(
            MigrationsAbi,
            this.apiConfigService.MIGRATIONS_SC_ADDRESS
        );
    }

    public setCompleted(completed: number){

        return this.blockchainConnectorService.sendTransaction(this.contract.methods.setCompleted(completed));
    }
}