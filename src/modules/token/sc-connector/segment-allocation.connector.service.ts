import {BlockchainConnectorService} from "../../blockchain-connector/blockchain-connector.service";
import {ApiConfigService} from "../../../settings/ApiConfigService";
import {Injectable} from "@nestjs/common";
import {containerAbi} from "../../container/sc-connector/container.abi";
import {TokenAbi} from "./token.abi";

@Injectable()
export class SegmentAllocationConnectorService {

    private contract: any;

    constructor(
        private readonly blockchainConnectorService: BlockchainConnectorService,
        private apiConfigService: ApiConfigService
    ) {
        this.contract = new this.blockchainConnectorService.web3.eth.Contract(
            TokenAbi,
            apiConfigService.TOKEN_SC_ADDRESS
        );
    }


    public addTokenToSegment(tokenId: number, segmentAddress: string){
        return this.blockchainConnectorService.sendTransaction(this.contract.methods.addTokenToSegment(tokenId, segmentAddress));
    }

    public removeSegment(tokenId: number, segmentAddress: string){
        return this.blockchainConnectorService.sendTransaction(this.contract.methods.removeSegment(tokenId, segmentAddress));
    }

    public getSegmentCount(tokenId: number){
        return this.blockchainConnectorService.call(this.contract.methods.getSegmentCount(tokenId));
    }

    public getSegmentAtIndex(tokenId: number, segmentIndex: number){
        return this.blockchainConnectorService.call(this.contract.methods.addTokenToSegment(tokenId, segmentIndex));

    }

    public getIndexForSegment(tokenId: number, segmentAddress: string){
        return this.blockchainConnectorService.call(this.contract.methods.addTokenToSegment(tokenId, segmentAddress));

    }

    public isTokenInSegment(tokenId: number, segmentAddress: string){
        return this.blockchainConnectorService.call(this.contract.methods.addTokenToSegment(tokenId, segmentAddress));

    }


}