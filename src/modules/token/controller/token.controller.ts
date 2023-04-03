import {Body, Controller, Get, Param, Post} from '@nestjs/common';
import {TokenConnectorService} from "../sc-connector/token.connector.service";
import {TokenMintDto} from "../../../dto/TokenMint.dto";

@Controller('token')
export class TokenController {

    constructor(private readonly tokenConnectorService: TokenConnectorService) {}

    @Post("addTokenToSegment")
    public addTokenToSegment(tokenId: number, segmentAddress: string){
        return this.tokenConnectorService.addTokenToSegment(tokenId, segmentAddress);
    }

    @Post("approve")
    public approve(to: string, tokenId: number){
        return this.tokenConnectorService.approve(to, tokenId);
    }

    @Post("burn")
    public burn(tokenId: number){
        return this.tokenConnectorService.burn(tokenId);
    }

    @Post("removeTokenFromSegment")
    public removeTokenFromSegment(tokenId: number, segmentAddress: string){
        return this.tokenConnectorService.removeTokenFromSegment(tokenId, segmentAddress);
    }

    @Post("renounceOwnership")
    public renounceOwnership(){
        return this.tokenConnectorService.renounceOwnership();
    }

    @Post("safeMint")
    public safeMint(@Body() tokenMintDto: TokenMintDto){
        return this.tokenConnectorService.safeMint(tokenMintDto);
    }

    @Post("safeTransferFrom")
    public safeTransferFrom(from: string, to: string, tokenId: number){
        return this.tokenConnectorService.safeTransferFrom(from, to, tokenId);

    }

    @Post("setApprovalForAll")
    public setApprovalForAll(operator: string, approved: boolean){
        return this.tokenConnectorService.setApprovalForAll(operator, approved);

    }

    @Post("transferFrom")
    public transferFrom(from: string, to: string, tokenId: boolean){
        return this.tokenConnectorService.transferFrom(from, to, tokenId);

    }

    @Post("transferOwnership")
    public transferOwnership(newOwner: string){
        return this.tokenConnectorService.transferOwnership(newOwner);

    }

    @Post("balanceOf")
    public balanceOf(ownerAddress: string){
        return this.tokenConnectorService.balanceOf(ownerAddress);

    }

    @Get("getAdditionalInformation/:tokenAddress")
    public getAdditionalInformation(tokenId: number, @Param("tokenAddress") tokenAddress: string){
        return this.tokenConnectorService.getAdditionalInformation(tokenId);

    }

    @Post("getApproved")
    public getApproved(tokenId: number){
        return this.tokenConnectorService.getApproved(tokenId);

    }

    @Get("getAssetHash/:tokenAddress")
    public getAssetHash(tokenId: number, @Param("tokenAddress") tokenAddress: string){
        return this.tokenConnectorService.getAssetHash(tokenId);

    }

    @Post("getAssetUri")
    public getAssetUri(tokenId: number){
        return this.tokenConnectorService.getAssetUri(tokenId);
    }

    @Post("getIndexForTokenAtSegment")
    public getIndexForTokenAtSegment(tokenId: number, segmentAddress: string){
        return this.tokenConnectorService.getIndexForTokenAtSegment(tokenId, segmentAddress);

    }

    @Get("getMetadataHash/:tokenAddress")
    public getMetadataHash(tokenId: number, @Param("tokenAddress") tokenAddress: string){
        return this.tokenConnectorService.getMetadataHash(tokenId);

    }

    @Post("getSegmentCountByToken")
    public getSegmentCountByToken(tokenId: number){
        return this.tokenConnectorService.getSegmentCountByToken(tokenId);
    }

    @Post("getSegmentForTokenAtSegmentIndex")
    public getSegmentForTokenAtSegmentIndex(tokenId: number, segmentIndex: string){
        return this.tokenConnectorService.getSegmentForTokenAtSegmentIndex(tokenId, segmentIndex);
    }

    @Post("isApprovedForAll")
    public isApprovedForAll(owner: string, operator: string){
        return this.tokenConnectorService.isApprovedForAll(owner, operator);
    }

    @Post("isTokenInSegment")
    public isTokenInSegment(tokenId: number, segmentAddress: string){
        return this.tokenConnectorService.isTokenInSegment(tokenId, segmentAddress);
    }

    @Post("name")
    public name(){
        return this.tokenConnectorService.name();
    }

    @Post("owner")
    public owner(){
        return this.tokenConnectorService.owner();
    }

    @Post("ownerOf")
    public ownerOf(tokenId: number){
        return this.tokenConnectorService.ownerOf(tokenId);
    }

    @Post("supportsInterface")
    public supportsInterface(interfaceId: string){
        return this.tokenConnectorService.supportsInterface(interfaceId);
    }

    @Post("symbol")
    public symbol(){
        return this.tokenConnectorService.symbol();
    }

    @Get("getTokenURI/:tokenId")
    public getTokenURI(@Param("tokenId") tokenId: number){
        return this.tokenConnectorService.getTokenURI(tokenId);
    }


    @Post("setMetadata/:tokenAddress")
    public setMetadata(tokenId: number, tokenUri: string, metadataHash: string, @Param("tokenAddress") tokenAddress: string){
        return this.tokenConnectorService.setMetadata(tokenId, tokenUri,metadataHash);

    }

}
