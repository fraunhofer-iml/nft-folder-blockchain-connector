import {BadRequestException, Body, Controller, Get, Param, Post} from '@nestjs/common';
import {TokenConnectorService} from "../sc-connector/token.connector.service";
import {TokenMintDto} from "../../../dto/TokenMint.dto";
import {ApiOperation, ApiQuery, ApiTags} from "@nestjs/swagger";
import {map} from "rxjs";

@ApiTags("NFT Token Controller")
@Controller('token')
export class TokenController {

    constructor(private readonly tokenConnectorService: TokenConnectorService) {}

    @Post("approve/:to/:tokenId")
    @ApiQuery({ name: "to", type: String })
    @ApiQuery({ name: "tokenId", type: Number })
    @ApiOperation({ summary: "Approve a token" })
    public approve(
        @Param("to") to: string,
        @Param("tokenId") tokenId: number){
        if(!to || !tokenId){
            throw new BadRequestException();
        }
        return this.tokenConnectorService.approve(to, tokenId)
            .pipe(map(res => {
                if(res.errorCode){
                    throw new BadRequestException(res.errorMessage);
                }
                return res;
            }));
    }

    @Post("burn/:tokenId")
    @ApiQuery({ name: "tokenId", type: Number })
    @ApiOperation({ summary: "Burn a token" })
    public burn(
        @Param("tokenId") tokenId: number){
        return this.tokenConnectorService.burn(tokenId)
            .pipe(map(res => {
                if(res.errorCode){
                    throw new BadRequestException(res.errorMessage);
                }
                return res;
            }));
    }

    @Post("removeTokenFromSegment/:tokenId/:segmentAddress")
    @ApiQuery({ name: "tokenId", type: Number })
    @ApiOperation({ summary: "Remove a token from segment" })
    public removeTokenFromSegment(
        @Param("tokenId") tokenId: number,
        @Param("segmentAddress") segmentAddress: string){
        return this.tokenConnectorService.removeTokenFromSegment(tokenId, segmentAddress)
            .pipe(map(res => {
                if(res.errorCode){
                    throw new BadRequestException(res.errorMessage);
                }
                return res;
            }));
    }

    @Post("renounceOwnership")
    @ApiOperation({ summary: "Renounce ownership" })
    public renounceOwnership(){
        return this.tokenConnectorService.renounceOwnership()
            .pipe(map(res => {
                if(res.errorCode){
                    throw new BadRequestException(res.errorMessage);
                }
                return res;
            }));
    }

    @Post("safeMint")
    @ApiQuery({ name: "tokenMintDto", type: TokenMintDto })
    @ApiOperation({ summary: "Mint the token" })
    public safeMint(@Body() tokenMintDto: TokenMintDto){
        return this.tokenConnectorService.safeMint(tokenMintDto)
            .pipe(map(res => {
                if(res.errorCode){
                    throw new BadRequestException(res.errorMessage);
                }
                return res;
            }));
    }

    @Post("safeTransferFrom/:from/:to/:tokenId")
    @ApiQuery({ name: "from", type: String })
    @ApiQuery({ name: "to", type: String })
    @ApiQuery({ name: "tokenId", type: Number })
    @ApiOperation({ summary: "(Safe) Transfer token" })
    public safeTransferFrom(
        @Param("from") from: string,
        @Param("to") to: string,
        @Param("tokenId") tokenId: number){
        return this.tokenConnectorService.safeTransferFrom(from, to, tokenId)
            .pipe(map(res => {
                if(res.errorCode){
                    throw new BadRequestException(res.errorMessage);
                }
                return res;
            }));

    }

    @Post("setApprovalForAll/:operator/:approved")
    @ApiQuery({ name: "operator", type: String })
    @ApiQuery({ name: "approved", type: Boolean })
    @ApiOperation({ summary: "Set Approval" })
    public setApprovalForAll(
        @Param("operator") operator: string,
        @Param("approved") approved: boolean){
        return this.tokenConnectorService.setApprovalForAll(operator, approved)
            .pipe(map(res => {
                if(res.errorCode){
                    throw new BadRequestException(res.errorMessage);
                }
                return res;
            }));

    }

    @Post("transferFrom/:from/:to/:tokenId")
    @ApiQuery({ name: "from", type: String })
    @ApiQuery({ name: "to", type: String })
    @ApiQuery({ name: "tokenId", type: Boolean })
    @ApiOperation({ summary: "Transfer token" })
    public transferFrom(
        @Param("from") from: string,
        @Param("to") to: string,
        @Param("tokenId")  tokenId: boolean){
        return this.tokenConnectorService.transferFrom(from, to, tokenId)
            .pipe(map(res => {
                if(res.errorCode){
                    throw new BadRequestException(res.errorMessage);
                }
                return res;
            }));

    }

    @Post("transferOwnership/:newOwner")
    @ApiQuery({ name: "newOwner", type: String })
    @ApiOperation({ summary: "Transfer token ownership" })
    public transferOwnership(@Param("newOwner") newOwner: string){
        return this.tokenConnectorService.transferOwnership(newOwner)
            .pipe(map(res => {
                if(res.errorCode){
                    throw new BadRequestException(res.errorMessage);
                }
                return res;
            }));

    }

    @Get("balanceOf/:ownerAddress")
    @ApiQuery({ name: "ownerAddress", type: String })
    @ApiOperation({ summary: "Returns balance" })
    public balanceOf(@Param("ownerAddress") ownerAddress: string){
        return this.tokenConnectorService.balanceOf(ownerAddress)
            .pipe(map(res => {
                if(res.errorCode){
                    throw new BadRequestException(res.errorMessage);
                }
                return res;
            }));

    }

    @Get("getAdditionalInformation/:tokenId")
    @ApiQuery({ name: "tokenId", type: Number })
    @ApiOperation({ summary: "Returns additional info of token" })
    public getAdditionalInformation(@Param("tokenId") tokenId: number){
        return this.tokenConnectorService.getAdditionalInformation(tokenId)
            .pipe(map(res => {
                if(res.errorCode){
                    throw new BadRequestException(res.errorMessage);
                }
                return res;
            }));
    }

    @Get("getApproved/:tokenId")
    @ApiQuery({ name: "tokenId", type: Number })
    @ApiOperation({ summary: "Returns if the token is approved" })
    public getApproved(@Param("tokenId") tokenId: number){
        return this.tokenConnectorService.getApproved(tokenId)
            .pipe(map(res => {
                if(res.errorCode){
                    throw new BadRequestException(res.errorMessage);
                }
                return res;
            }));

    }

    @Get("getAssetHash/:tokenId")
    @ApiQuery({ name: "tokenId", type: Number })
    @ApiOperation({ summary: "Returns the token asset hash" })
    public getAssetHash(@Param("tokenId") tokenId: number){
        return this.tokenConnectorService.getAssetHash(tokenId)
            .pipe(map(res => {
                if(res.errorCode){
                    throw new BadRequestException(res.errorMessage);
                }
                return res;
            }));

    }

    @Get("getAssetUri/:tokenId")
    @ApiQuery({ name: "tokenId", type: Number })
    @ApiOperation({ summary: "Returns the token asset uri" })
    public getAssetUri(@Param("tokenId") tokenId: number){
        return this.tokenConnectorService.getAssetUri(tokenId)
            .pipe(map(res => {
                if(res.errorCode){
                    throw new BadRequestException(res.errorMessage);
                }
                return res;
            }));
    }

    @Get("getIndexForTokenAtSegment/:tokenId/:segmentAddress")
    @ApiQuery({ name: "tokenId", type: Number })
    @ApiQuery({ name: "segmentAddress", type: String })
    @ApiOperation({ summary: "Returns the index of the token within the segment" })
    public getIndexForTokenAtSegment(
        @Param("tokenId") tokenId: number,
        @Param("segmentAddress") segmentAddress: string){
        return this.tokenConnectorService.getIndexForTokenAtSegment(tokenId, segmentAddress)
            .pipe(map(res => {
                if(res.errorCode){
                    throw new BadRequestException(res.errorMessage);
                }
                return res;
            }));

    }

    @Get("getMetadataHash/:tokenId")
    @ApiQuery({ name: "tokenId", type: Number })
    @ApiOperation({ summary: "Returns the metadata hash of the token" })
    public getMetadataHash(@Param("tokenId") tokenId: number,){
        return this.tokenConnectorService.getMetadataHash(tokenId)
            .pipe(map(res => {
                if(res.errorCode){
                    throw new BadRequestException(res.errorMessage);
                }
                return res;
            }));

    }

    @Get("getSegmentCountByToken/:tokenId")
    @ApiQuery({ name: "tokenId", type: Number })
    @ApiOperation({ summary: "Returns the segment count by token" })
    public getSegmentCountByToken(@Param("tokenId") tokenId: number){
        return this.tokenConnectorService.getSegmentCountByToken(tokenId)
            .pipe(map(res => {
                if(res.errorCode){
                    throw new BadRequestException(res.errorMessage);
                }
                return res;
            }));
    }

    @Get("getSegmentForTokenAtSegmentIndex/:tokenId/:segmentAddress")
    @ApiQuery({ name: "tokenId", type: Number })
    @ApiQuery({ name: "segmentAddress", type: String })
    @ApiOperation({ summary: "Returns the segment of the token" })
    public getSegmentForTokenAtSegmentIndex(
        @Param("tokenId") tokenId: number,
        @Param("segmentAddress") segmentIndex: string){
        return this.tokenConnectorService.getSegmentForTokenAtSegmentIndex(tokenId, segmentIndex)
            .pipe(map(res => {
                if(res.errorCode){
                    throw new BadRequestException(res.errorMessage);
                }
                return res;
            }));
    }

    @Get("isApprovedForAll/:owner/:operator")
    @ApiQuery({ name: "owner", type: String })
    @ApiQuery({ name: "operator", type: String })
    @ApiOperation({ summary: "Returns if the owner is approved for all tokens" })
    public isApprovedForAll(
        @Param("owner") owner: string,
        @Param("operator") operator: string){
        return this.tokenConnectorService.isApprovedForAll(owner, operator)
            .pipe(map(res => {
                if(res.errorCode){
                    throw new BadRequestException(res.errorMessage);
                }
                return res;
            }));
    }

    @Get("isTokenInSegment/:tokenId/:segmentAddress")
    @ApiQuery({ name: "tokenId", type: Number })
    @ApiQuery({ name: "segmentAddress", type: String })
    @ApiOperation({ summary: "Returns if the token is in the segment" })
    public isTokenInSegment(
        @Param("tokenId") tokenId: number,
        @Param("segmentAddress") segmentAddress: string){
        return this.tokenConnectorService.isTokenInSegment(tokenId, segmentAddress)
            .pipe(map(res => {
                if(res.errorCode){
                    throw new BadRequestException(res.errorMessage);
                }
                return res;
            }));
    }

    @Get("name")
    @ApiOperation({ summary: "Returns the name" })
    public name(){
        return this.tokenConnectorService.name()
            .pipe(map(res => {
                if(res.errorCode){
                    throw new BadRequestException(res.errorMessage);
                }
                return res;
            }));
    }

    @Get("owner")
    @ApiOperation({ summary: "Returns the owner" })
    public owner(){
        return this.tokenConnectorService.owner()
            .pipe(map(res => {
                if(res.errorCode){
                    throw new BadRequestException(res.errorMessage);
                }
                return res;
            }));
    }

    @Get("ownerOf/:tokenId")
    @ApiQuery({ name: "tokenId", type: Number })
    @ApiOperation({ summary: "Returns if the owner of the token" })
    public ownerOf(@Param("tokenId") tokenId: number){
        return this.tokenConnectorService.ownerOf(tokenId)
            .pipe(map(res => {
                if(res.errorCode){
                    throw new BadRequestException(res.errorMessage);
                }
                return res;
            }));
    }

    @Get("supportsInterface/:interfaceId")
    @ApiQuery({ name: "interfaceId", type: String })
    @ApiOperation({ summary: "Returns if the interface is supported" })
    public supportsInterface(@Param("interfaceId") interfaceId: string){
        return this.tokenConnectorService.supportsInterface(interfaceId)
            .pipe(map(res => {
                if(res.errorCode){
                    throw new BadRequestException(res.errorMessage);
                }
                return res;
            }));
    }

    @Get("symbol")
    @ApiOperation({ summary: "Returns the symbol" })
    public symbol(){
        return this.tokenConnectorService.symbol()
            .pipe(map(res => {
                if(res.errorCode){
                    throw new BadRequestException(res.errorMessage);
                }
                return res;
            }));
    }

    @Get("getTokenURI/:tokenId")
    @ApiQuery({ name: "tokenId", type: Number })
    @ApiOperation({ summary: "Returns the token uri" })
    public getTokenURI(@Param("tokenId") tokenId: number){
        return this.tokenConnectorService.getTokenURI(tokenId)
            .pipe(map(res => {
                if(res.errorCode){
                    throw new BadRequestException(res.errorMessage);
                }
                return res;
            }));
    }


    @Post("setMetadata/:tokenId/:tokenUri/:metadataHash")
    @ApiQuery({ name: "tokenId", type: Number })
    @ApiQuery({ name: "tokenUri", type: String })
    @ApiQuery({ name: "metadataHash", type: String })
    @ApiOperation({ summary: "Set the metadata of a token" })
    public setMetadata(
        @Param("tokenId") tokenId: number,
        @Param("tokenUri") tokenUri: string,
        @Param("metadataHash") metadataHash: string){
        return this.tokenConnectorService.setMetadata(tokenId, tokenUri,metadataHash)
            .pipe(map(res => {
                if(res.errorCode){
                    throw new BadRequestException(res.errorMessage);
                }
                return res;
            }));

    }

}
