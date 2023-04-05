import {BlockchainConnectorService} from "../../blockchain-connector/blockchain-connector.service";
import {ApiConfigService} from "../../../settings/ApiConfigService";
import {Injectable} from "@nestjs/common";
import {TokenAbi} from "./token.abi";
import {Observable} from "rxjs";
import {ErrorDto} from "../../../dto/Error.dto";

@Injectable()
export class SegmentAllocationConnectorService {

    private contract: any;

    constructor(private readonly blockchainConnectorService: BlockchainConnectorService, private apiConfigService: ApiConfigService) {
        this.contract = new this.blockchainConnectorService.web3.eth.Contract(TokenAbi,apiConfigService.TOKEN_SC_ADDRESS);
    }

    public removeTokenFromSegment(tokenId: number, segmentAddress: string): Observable<any | ErrorDto>{
        return this.blockchainConnectorService.sendTransaction(this.contract.methods.removeTokenFromSegment(tokenId, segmentAddress));
    }

    public getSegmentCountByToken(tokenId: number): Observable<any | ErrorDto>{
        return this.blockchainConnectorService.call(this.contract.methods.getSegmentCountByToken(tokenId));
    }

    public getSegmentForTokenAtSegmentIndex(tokenId: number, segmentIndex: number): Observable<any | ErrorDto>{
        return this.blockchainConnectorService.call(this.contract.methods.getSegmentForTokenAtSegmentIndex(tokenId, segmentIndex));
    }

    public getIndexForTokenAtSegment(tokenId: number, segmentAddress: string): Observable<any | ErrorDto>{
        return this.blockchainConnectorService.call(this.contract.methods.getIndexForTokenAtSegment(tokenId, segmentAddress));
    }

    public isTokenInSegment(tokenId: number, segmentAddress: string): Observable<any | ErrorDto>{
        return this.blockchainConnectorService.call(this.contract.methods.isTokenInSegment(tokenId, segmentAddress));
    }

}