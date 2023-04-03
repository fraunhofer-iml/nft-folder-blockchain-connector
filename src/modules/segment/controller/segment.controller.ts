import {Body, Controller, Delete, Get, Param, Post, Put} from '@nestjs/common';
import {SegmentConnectorService} from "../sc-connector/segment.connector.service";
import {AddTokenDto} from "../../../dto/AddToken.dto";

@Controller('segment')
export class SegmentController {

    constructor(private readonly segmentConnectorService: SegmentConnectorService) {}


    @Put("addToken")
    public addToken(@Body() tokenInput: AddTokenDto,){
        return this.segmentConnectorService.addToken(tokenInput.token, tokenInput.tokenId, tokenInput.segmentAddress);
    }

    @Put("removeToken")
    public removeToken(@Body() tokenInput: AddTokenDto){
        return this.segmentConnectorService.removeToken(tokenInput.token, tokenInput.tokenId, tokenInput.segmentAddress);
    }

    @Get("getName/:segmentAddress")
    public getName(@Param("segmentAddress") segmentAddress: string){
        return this.segmentConnectorService.getName(segmentAddress);

    }

    @Get("getContainer/:segmentAddress")
    public getContainer(@Param("segmentAddress") segmentAddress: string){
        return this.segmentConnectorService.getContainer(segmentAddress);

    }

    @Get("getTokenInformation/:segmentAddress")
    public getTokenInformation(@Param("segmentAddress") segmentAddress: string){
        return this.segmentConnectorService.getTokenInformation(segmentAddress);

    }

    @Get("getTokenLocationInSegment/:token/:tokenId/:segmentAddress")
    public getTokenLocationInSegment(@Param("token") token: string, @Param("tokenId") tokenId: number,@Param("segmentAddress") segmentAddress: string){
        return this.segmentConnectorService.getTokenLocationInSegment(token, tokenId,segmentAddress);

    }

    @Get("isTokenInSegment/:token/:tokenId/:segmentAddress")
    public isTokenInSegment( @Param("token") token: string, @Param("tokenId") tokenId: number, @Param("segmentAddress") segmentAddress: string){
        return this.segmentConnectorService.isTokenInSegment(token, tokenId, segmentAddress);

    }
}
