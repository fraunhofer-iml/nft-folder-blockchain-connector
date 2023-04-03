import {Injectable} from "@nestjs/common";
import {containerAbi} from "./container.abi";
import {BlockchainConnectorService} from "../../blockchain-connector/blockchain-connector.service";
import {ApiConfigService} from "../../../settings/ApiConfigService";

@Injectable()
export class ContainerConnectorService{

    private contract: any;

    constructor(
        private readonly blockchainConnectorService: BlockchainConnectorService,
        private apiConfigService: ApiConfigService
    ) {
        this.contract = new this.blockchainConnectorService.web3.eth.Contract(
            containerAbi,
            apiConfigService.CONTAINER_SC_ADDRESS
        );
    }

    public deployNewContainer(name: string){
        console.log(this.contract)
    }

    public createSegment(name: string){
        return this.blockchainConnectorService.sendTransaction(this.contract.methods.createSegment(name));
    }

    public getName(){
        return this.blockchainConnectorService.call(this.contract.methods.getName())
    }

    public getSegmentCount(){
        return this.blockchainConnectorService.call(this.contract.methods.getSegmentCount())

    }

    public getSegmentAtIndex(index: number){
        return this.blockchainConnectorService.call(this.contract.methods.getSegmentAtIndex(index))

    }

    public isSegmentInContainer(segment: string){
        return this.blockchainConnectorService.call(this.contract.methods.isSegmentInContainer(segment))
    }

}