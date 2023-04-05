import {TokenMintDto} from "../../../dto/TokenMint.dto";
import {BlockchainConnectorService} from "../../blockchain-connector/blockchain-connector.service";
import {ApiConfigService} from "../../../settings/ApiConfigService";
import {Injectable} from "@nestjs/common";
import {TokenAbi} from "./token.abi";
import {Observable} from "rxjs";
import {ErrorDto} from "../../../dto/Error.dto";

@Injectable()
export class TokenConnectorService {

    private contract: any;

    constructor(private readonly blockchainConnectorService: BlockchainConnectorService, private apiConfigService: ApiConfigService) {
        this.contract = new this.blockchainConnectorService.web3.eth.Contract(TokenAbi, apiConfigService.TOKEN_SC_ADDRESS);
    }

    public addTokenToSegment(tokenId: number, segmentAddress: string): Observable<any | ErrorDto>{
        return this.blockchainConnectorService.sendTransaction(this.contract.methods.addTokenToSegment(tokenId, segmentAddress));

    }

    public approve(to: string, tokenId: number): Observable<any | ErrorDto>{
        return this.blockchainConnectorService.sendTransaction(this.contract.methods.approve(to, tokenId));

    }

    public burn(tokenId: number): Observable<any | ErrorDto>{
        return this.blockchainConnectorService.sendTransaction(this.contract.methods.burn(tokenId));

    }

    public removeTokenFromSegment(tokenId: number, segmentAddress: string): Observable<any | ErrorDto>{
        return this.blockchainConnectorService.sendTransaction(this.contract.methods.removeTokenFromSegment(tokenId, segmentAddress));

    }

    public renounceOwnership(): Observable<any | ErrorDto>{
        return this.blockchainConnectorService.sendTransaction(this.contract.methods.renounceOwnership());
    }

    public safeMint(tokenMintDto: TokenMintDto): Observable<any | ErrorDto>{

            const transaction = (tokenMintDto.additionalInformation) ?
                this.contract.methods.safeMint(
                    tokenMintDto.receiver,
                    tokenMintDto.assetUri,
                    tokenMintDto.assetHash,
                    tokenMintDto.metadataUri,
                    tokenMintDto.metadataHash,
                    tokenMintDto.additionalInformation)
                :
                this.contract.methods.safeMint(
                    tokenMintDto.receiver,
                    tokenMintDto.assetUri,
                    tokenMintDto.assetHash,
                    tokenMintDto.metadataUri,
                    tokenMintDto.metadataHash)
            return this.blockchainConnectorService.sendTransaction(transaction);
    }

    public safeTransferFrom(from: string, to: string, tokenId: number): Observable<any | ErrorDto>{
        return this.blockchainConnectorService.sendTransaction(this.contract.methods.safeTransferFrom(from, to, tokenId));

    }

    public setApprovalForAll(operator: string, approved: boolean): Observable<any | ErrorDto>{
        return this.blockchainConnectorService.sendTransaction(this.contract.methods.setApprovalForAll(operator, approved));

    }

    public transferFrom(from: string, to: string, tokenId: boolean): Observable<any | ErrorDto>{
        return this.blockchainConnectorService.sendTransaction(this.contract.methods.transferFrom(from, to, tokenId));

    }

    public transferOwnership(newOwner: string): Observable<any | ErrorDto>{
        return this.blockchainConnectorService.sendTransaction(this.contract.methods.transferOwnership(newOwner));

    }

    public balanceOf(ownerAddress: string): Observable<any | ErrorDto>{
        return this.blockchainConnectorService.call(this.contract.methods.balanceOf(ownerAddress));

    }

    public getAdditionalInformation(tokenId: number): Observable<any | ErrorDto>{
        return this.blockchainConnectorService.call(this.contract.methods.getAdditionalInformation(tokenId));
    }

    public getApproved(tokenId: number): Observable<any | ErrorDto>{
        return this.blockchainConnectorService.call(this.contract.methods.getApproved(tokenId));

    }
    public getAssetHash(tokenId: number): Observable<any | ErrorDto>{
        return this.blockchainConnectorService.call(this.contract.methods.getAssetHash(tokenId));
    }
    public getAssetUri(tokenId: number): Observable<any | ErrorDto>{
        return this.blockchainConnectorService.call(this.contract.methods.getAssetUri(tokenId));
    }

    public getIndexForTokenAtSegment(tokenId: number, segmentAddress: string): Observable<any | ErrorDto>{
        return this.blockchainConnectorService.call(this.contract.methods.getIndexForTokenAtSegment(tokenId, segmentAddress));

    }

    public getMetadataHash(tokenId: number): Observable<any | ErrorDto>{
        return this.blockchainConnectorService.call(this.contract.methods.getMetadataHash(tokenId));
    }

    public getSegmentCountByToken(tokenId: number): Observable<any | ErrorDto>{
        return this.blockchainConnectorService.call(this.contract.methods.getSegmentCountByToken(tokenId));
    }

    public getSegmentForTokenAtSegmentIndex(tokenId: number, segmentIndex: string): Observable<any | ErrorDto>{
        return this.blockchainConnectorService.call(this.contract.methods.getSegmentForTokenAtSegmentIndex(tokenId, segmentIndex));
    }

    public isApprovedForAll(owner: string, operator: string): Observable<any | ErrorDto>{
        return this.blockchainConnectorService.call(this.contract.methods.isApprovedForAll(owner, operator));
    }

    public isTokenInSegment(tokenId: number, segmentAddress: string): Observable<any | ErrorDto>{
        return this.blockchainConnectorService.call(this.contract.methods.isTokenInSegment(tokenId, segmentAddress));
    }

    public name(): Observable<any | ErrorDto>{
        return this.blockchainConnectorService.call(this.contract.methods.name());
    }

    public owner(): Observable<any | ErrorDto>{
        return this.blockchainConnectorService.call(this.contract.methods.owner());
    }

    public ownerOf(tokenId: number): Observable<any | ErrorDto>{
        return this.blockchainConnectorService.call(this.contract.methods.ownerOf(tokenId));
    }

    public supportsInterface(interfaceId: string): Observable<any | ErrorDto>{
        return this.blockchainConnectorService.call(this.contract.methods.supportsInterface(interfaceId));
    }

    public symbol(): Observable<any | ErrorDto>{
        return this.blockchainConnectorService.call(this.contract.methods.symbol());
    }

    public getTokenURI(tokenId: number): Observable<any | ErrorDto>{
        return this.blockchainConnectorService.call(this.contract.methods.tokenURI(tokenId));
    }


    public setMetadata(tokenId: number, tokenUri: string, metadataHash: string): Observable<any | ErrorDto>{
        return this.blockchainConnectorService.sendTransaction(this.contract.methods.setMetadata(tokenId, tokenUri, metadataHash));
    }

}