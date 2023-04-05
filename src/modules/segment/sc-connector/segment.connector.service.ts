import {BlockchainConnectorService} from "../../blockchain-connector/blockchain-connector.service";
import {Injectable} from "@nestjs/common";
import {SegmentAbi} from "./segment.abi";
import {Observable} from "rxjs";
import {ErrorDto} from "../../../dto/Error.dto";

@Injectable()
export class SegmentConnectorService {

    constructor(private readonly blockchainConnectorService: BlockchainConnectorService) {
    }

    getSegmentContract(segmentAddress: string){ return new this.blockchainConnectorService.web3.eth.Contract(
            SegmentAbi,
            segmentAddress
        );
    }

    public addToken(token: string, tokenId: number, segmentAddress: string): Observable<any | ErrorDto>{
        return this.blockchainConnectorService.sendTransaction(this.getSegmentContract(segmentAddress).methods.addToken(token, tokenId));
    }

    public removeToken(token: string, tokenId: number, segmentAddress: string): Observable<any | ErrorDto>{
        return this.blockchainConnectorService.sendTransaction(this.getSegmentContract(segmentAddress).methods.removeToken(token, tokenId));
    }

    public getName(segmentAddress: string): Observable<any | ErrorDto>{
        return this.blockchainConnectorService.call(this.getSegmentContract(segmentAddress).methods.getName());
    }

    public getContainer(segmentAddress: string): Observable<any | ErrorDto>{
        return this.blockchainConnectorService.call(this.getSegmentContract(segmentAddress).methods.getContainer());
    }

    public getTokenInformation(segmentAddress: string): Observable<any | ErrorDto>{
        return this.blockchainConnectorService.call(this.getSegmentContract(segmentAddress).methods.getTokenInformation());
    }

    public getTokenLocationInSegment(token: string, tokenId: number, segmentAddress: string): Observable<any | ErrorDto>{
        return this.blockchainConnectorService.call(this.getSegmentContract(segmentAddress).methods.getTokenLocationInSegment(token, tokenId));
    }

    public isTokenInSegment(token: string, tokenId: number, segmentAddress: string): Observable<any | ErrorDto>{
        return this.blockchainConnectorService.call(this.getSegmentContract(segmentAddress).methods.isTokenInSegment(token, tokenId));
    }
}