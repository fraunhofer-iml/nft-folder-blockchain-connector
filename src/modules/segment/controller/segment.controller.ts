import {BadRequestException, Body, Controller, Get, Param, Put} from '@nestjs/common';
import {SegmentConnectorService} from "../sc-connector/segment.connector.service";
import {AddTokenDto} from "../../../dto/AddToken.dto";
import {ApiOperation, ApiQuery, ApiTags} from "@nestjs/swagger";
import {map} from "rxjs";

@ApiTags("NFT Segment")
@Controller('segment')
export class SegmentController {

    constructor(private readonly segmentConnectorService: SegmentConnectorService) {}


    @Put("addToken")
    @ApiQuery({ name: "tokenInput", type: AddTokenDto })
    @ApiOperation({ summary: "Add a token to the segment" })
    public addToken(@Body() tokenInput: AddTokenDto,){
        return this.segmentConnectorService.addToken(tokenInput.token, tokenInput.tokenId, tokenInput.segmentAddress)
            .pipe(map(res => {
                if(res.errorCode){
                    throw new BadRequestException(res.errorMessage);
                }
            }));
    }

    @Put("removeToken")
    @ApiQuery({ name: "tokenInput", type: AddTokenDto })
    @ApiOperation({ summary: "Remove a token from the segment" })
    public removeToken(@Body() tokenInput: AddTokenDto){
        return this.segmentConnectorService.removeToken(tokenInput.token, tokenInput.tokenId, tokenInput.segmentAddress)
            .pipe(map(res => {
                if(res.errorCode){
                    throw new BadRequestException(res.errorMessage);
                }
            }));
    }

    @Get("getName/:segmentAddress")
    @ApiQuery({ name: "segmentAddress", type: String })
    @ApiOperation({ summary: "Returns the name of the segment address" })
    public getName(@Param("segmentAddress") segmentAddress: string){
        return this.segmentConnectorService.getName(segmentAddress)
            .pipe(map(res => {
                if(res.errorCode){
                    throw new BadRequestException(res.errorMessage);
                }
            }));

    }

    @Get("getContainer/:segmentAddress")
    @ApiQuery({ name: "segmentAddress", type: String })
    @ApiOperation({ summary: "Returns the container of the segment address" })
    public getContainer(@Param("segmentAddress") segmentAddress: string){
        return this.segmentConnectorService.getContainer(segmentAddress)
            .pipe(map(res => {
                if(res.errorCode){
                    throw new BadRequestException(res.errorMessage);
                }
            }));

    }

    @Get("getTokenInformation/:segmentAddress")
    @ApiQuery({ name: "segmentAddress", type: String })
    @ApiOperation({ summary: "Returns the token info of the segment address" })
    public getTokenInformation(@Param("segmentAddress") segmentAddress: string){
        return this.segmentConnectorService.getTokenInformation(segmentAddress)
            .pipe(map(res => {
                if(res.errorCode){
                    throw new BadRequestException(res.errorMessage);
                }
            }));

    }

    @Get("getTokenLocationInSegment/:token/:tokenId/:segmentAddress")
    @ApiQuery({ name: "token", type: String })
    @ApiQuery({ name: "tokenId", type: Number })
    @ApiQuery({ name: "segmentAddress", type: String })
    @ApiOperation({ summary: "Returns the token location within the segment" })
    public getTokenLocationInSegment(
        @Param("token") token: string,
        @Param("tokenId") tokenId: number,
        @Param("segmentAddress") segmentAddress: string){
        return this.segmentConnectorService.getTokenLocationInSegment(token, tokenId,segmentAddress)
            .pipe(map(res => {
                if(res.errorCode){
                    throw new BadRequestException(res.errorMessage);
                }
            }));

    }

    @Get("isTokenInSegment/:token/:tokenId/:segmentAddress")
    @ApiQuery({ name: "token", type: String })
    @ApiQuery({ name: "tokenId", type: Number })
    @ApiQuery({ name: "segmentAddress", type: String })
    @ApiOperation({ summary: "Returns if the token is in the segment" })
    public isTokenInSegment(
        @Param("token") token: string,
        @Param("tokenId") tokenId: number,
        @Param("segmentAddress") segmentAddress: string){
        return this.segmentConnectorService.isTokenInSegment(token, tokenId, segmentAddress)
            .pipe(map(res => {
                if(res.errorCode){
                    throw new BadRequestException(res.errorMessage);
                }
            }));

    }
}
