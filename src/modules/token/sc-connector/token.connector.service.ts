import {TokenMintDto} from "../../../dto/TokenMint.dto";
import {BlockchainConnectorService} from "../../blockchain-connector/blockchain-connector.service";
import {ApiConfigService} from "../../../settings/ApiConfigService";
import {Injectable} from "@nestjs/common";
import {TokenAbi} from "./token.abi";

@Injectable()
export class TokenConnectorService {

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

    public approve(to: string, tokenId: number){
        return this.blockchainConnectorService.sendTransaction(this.contract.methods.approve(to, tokenId));

    }

    public burn(tokenId: number){
        return this.blockchainConnectorService.sendTransaction(this.contract.methods.burn(tokenId));

    }

    public removeTokenFromSegment(tokenId: number, segmentAddress: string){
        return this.blockchainConnectorService.sendTransaction(this.contract.methods.removeTokenFromSegment(tokenId, segmentAddress));

    }

    public renounceOwnership(){
        return this.blockchainConnectorService.sendTransaction(this.contract.methods.renounceOwnership());
    }

    public safeMint(tokenMintDto: TokenMintDto){

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

    public safeTransferFrom(from: string, to: string, tokenId: number){
        return this.blockchainConnectorService.sendTransaction(this.contract.methods.safeTransferFrom(from, to, tokenId));

    }

    public setApprovalForAll(operator: string, approved: boolean){
        return this.blockchainConnectorService.sendTransaction(this.contract.methods.setApprovalForAll(operator, approved));

    }

    public transferFrom(from: string, to: string, tokenId: boolean){
        return this.blockchainConnectorService.sendTransaction(this.contract.methods.transferFrom(from, to, tokenId));

    }

    public transferOwnership(newOwner: string){
        return this.blockchainConnectorService.sendTransaction(this.contract.methods.transferOwnership(newOwner));

    }

    public balanceOf(ownerAddress: string){
        return this.blockchainConnectorService.call(this.contract.methods.balanceOf(ownerAddress));

    }

    public getAdditionalInformation(tokenId: number){
        return this.blockchainConnectorService.call(this.contract.methods.getAdditionalInformation(tokenId));
    }

    public getApproved(tokenId: number){
        return this.blockchainConnectorService.call(this.contract.methods.getApproved(tokenId));

    }
    public getAssetHash(tokenId: number){
        return this.blockchainConnectorService.call(this.contract.methods.getAssetHash(tokenId));
    }
    public getAssetUri(tokenId: number){
        return this.blockchainConnectorService.call(this.contract.methods.getAssetUri(tokenId));
    }

    public getIndexForTokenAtSegment(tokenId: number, segmentAddress: string){
        return this.blockchainConnectorService.call(this.contract.methods.getIndexForTokenAtSegment(tokenId, segmentAddress));

    }

    public getMetadataHash(tokenId: number){
        return this.blockchainConnectorService.call(this.contract.methods.getMetadataHash(tokenId));
    }

    public getSegmentCountByToken(tokenId: number){
        return this.blockchainConnectorService.call(this.contract.methods.getSegmentCountByToken(tokenId));
    }

    public getSegmentForTokenAtSegmentIndex(tokenId: number, segmentIndex: string){
        return this.blockchainConnectorService.call(this.contract.methods.getSegmentForTokenAtSegmentIndex(tokenId, segmentIndex));
    }

    public isApprovedForAll(owner: string, operator: string){
        return this.blockchainConnectorService.call(this.contract.methods.isApprovedForAll(owner, operator));
    }

    public isTokenInSegment(tokenId: number, segmentAddress: string){
        return this.blockchainConnectorService.call(this.contract.methods.isTokenInSegment(tokenId, segmentAddress));
    }



    public name(){
        return this.blockchainConnectorService.call(this.contract.methods.name());
    }

    public owner(){
        return this.blockchainConnectorService.call(this.contract.methods.owner());
    }

    public ownerOf(tokenId: number){
        return this.blockchainConnectorService.call(this.contract.methods.ownerOf(tokenId));
    }

    public supportsInterface(interfaceId: string){
        return this.blockchainConnectorService.call(this.contract.methods.supportsInterface(interfaceId));
    }

    public symbol(){
        return this.blockchainConnectorService.call(this.contract.methods.symbol());
    }

    public getTokenURI(tokenId: number){
        return this.blockchainConnectorService.call(this.contract.methods.tokenURI(tokenId));
    }


    public setMetadata(tokenId: number, tokenUri: string, metadataHash: string){
        return this.blockchainConnectorService.sendTransaction(this.contract.methods.setMetadata(tokenId, tokenUri, metadataHash));
    }

}