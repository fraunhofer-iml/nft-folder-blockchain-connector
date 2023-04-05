import {Injectable} from "@nestjs/common";
import {containerAbi} from "./container.abi";
import {BlockchainConnectorService} from "../../blockchain-connector/blockchain-connector.service";
import {ApiConfigService} from "../../../settings/ApiConfigService";
import {Observable} from "rxjs";
import {ErrorDto} from "../../../dto/Error.dto";

@Injectable()
export class ContainerConnectorService{

    private contract: any;

    constructor(private readonly blockchainConnectorService: BlockchainConnectorService, private apiConfigService: ApiConfigService) {
        this.contract = new this.blockchainConnectorService.web3.eth.Contract(
            containerAbi,
            apiConfigService.CONTAINER_SC_ADDRESS
        );
    }

    public createSegment(name: string): Observable<any | ErrorDto>{
        return this.blockchainConnectorService.sendTransaction(this.contract.methods.createSegment(name));
    }

    public getName(): Observable<any | ErrorDto>{
        return this.blockchainConnectorService.call(this.contract.methods.getName())
    }

    public getSegmentCount(): Observable<any | ErrorDto>{
        return this.blockchainConnectorService.call(this.contract.methods.getSegmentCount())

    }

    public getSegmentAtIndex(index: number): Observable<any | ErrorDto>{
        return this.blockchainConnectorService.call(this.contract.methods.getSegmentAtIndex(index))

    }

    public isSegmentInContainer(segment: string): Observable<any | ErrorDto>{
        return this.blockchainConnectorService.call(this.contract.methods.isSegmentInContainer(segment))
    }

}