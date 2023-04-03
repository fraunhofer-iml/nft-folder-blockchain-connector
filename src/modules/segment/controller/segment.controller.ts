import {Controller, Delete, Get, Post} from '@nestjs/common';
import {SegmentConnectorService} from "../sc-connector/segment.connector.service";

@Controller('segment')
export class SegmentController {

    constructor(private readonly segmentConnectorService: SegmentConnectorService) {}


    @Post("addToken")
    public addToken(token: string, tokenId: number){
        this.segmentConnectorService.addToken(token, tokenId);
    }

    @Delete("removeToken")
    public removeToken(token: string, tokenId: number){
        this.segmentConnectorService.removeToken(token, tokenId);

    }

    @Get("getName")
    public getName(){
        this.segmentConnectorService.getName();

    }

    @Get("getContainer")
    public getContainer(){
        this.segmentConnectorService.getContainer();

    }

    @Get("getTokenInformation")
    public getTokenInformation(){
        this.segmentConnectorService.getTokenInformation();

    }

    @Get("getTokenLocationInSegment")
    public getTokenLocationInSegment(){
        this.segmentConnectorService.getTokenLocationInSegment();

    }

    @Get("isTokenInSegment")
    public isTokenInSegment(token: string, tokenId: number){
        this.segmentConnectorService.isTokenInSegment(token, tokenId);

    }
}
