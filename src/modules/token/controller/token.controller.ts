import {Body, Controller, Get, Param, Post} from '@nestjs/common';
import {TokenConnectorService} from "../sc-connector/token.connector.service";
import {TokenMintDto} from "../../../dto/TokenMint.dto";

@Controller('token')
export class TokenController {

    constructor(private readonly tokenConnectorService: TokenConnectorService) {}


    @Post("safeMint")
    public safeMint(@Body() tokenMintDto: TokenMintDto){
        return this.tokenConnectorService.safeMint(tokenMintDto);
    }

    @Get("getTokenURI/:tokenId")
    public getTokenURI(@Param("tokenId") tokenId: number){
        return this.tokenConnectorService.getTokenURI(tokenId);
    }

    @Get("getAdditionalInformation/:tokenAddress")
    public getAdditionalInformation(tokenId: number, @Param("tokenAddress") tokenAddress: string){
        return this.tokenConnectorService.getAdditionalInformation(tokenId);

    }

    @Get("getAssetHash/:tokenAddress")
    public getAssetHash(tokenId: number, @Param("tokenAddress") tokenAddress: string){
        return this.tokenConnectorService.getAssetHash(tokenId);

    }

    @Get("getMetadataHash/:tokenAddress")
    public getMetadataHash(tokenId: number, @Param("tokenAddress") tokenAddress: string){
        return this.tokenConnectorService.getMetadataHash(tokenId);

    }

    @Post("setMetadata/:tokenAddress")
    public setMetadata(tokenId: number, tokenUri: string, metadataHash: string, @Param("tokenAddress") tokenAddress: string){
        return this.tokenConnectorService.setMetadata(tokenId, tokenUri,metadataHash);

    }

}
