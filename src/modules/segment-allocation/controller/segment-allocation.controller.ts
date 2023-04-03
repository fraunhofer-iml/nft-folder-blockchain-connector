import {Controller, Delete, Get, Post} from '@nestjs/common';
import {SegmentAllocationConnectorService} from "../sc-controller/segment-allocation.connector.service";

@Controller('segment-allocation')
export class SegmentAllocationController {

    constructor(private readonly segmentAllocationConnectorService: SegmentAllocationConnectorService) {}

    @Post("addTokenToSegment")
    public addTokenToSegment(tokenId: number, segmentAddress: string){
        this.segmentAllocationConnectorService.addTokenToSegment(tokenId, segmentAddress);
    }


    @Delete("removeSegment")
    public removeSegment(tokenId: number, segmentAddress: string){
        this.segmentAllocationConnectorService.removeSegment(tokenId, segmentAddress);
    }

    @Get("getSegmentCount")
    public getSegmentCount(tokenId: number){
        this.segmentAllocationConnectorService.getSegmentCount(tokenId);

    }

    @Get("getSegmentAtIndex")
    public getSegmentAtIndex(tokenId: number, segmentIndex: number){
        this.segmentAllocationConnectorService.getSegmentAtIndex(tokenId, segmentIndex);

    }

    @Get("getIndexForSegment")
    public getIndexForSegment(tokenId: number, segmentAddress: string){
        this.segmentAllocationConnectorService.getIndexForSegment(tokenId, segmentAddress);

    }

    @Get("isTokenInSegment")
    public isTokenInSegment(tokenId: number, segmentAddress: string){
        this.segmentAllocationConnectorService.isTokenInSegment(tokenId, segmentAddress);

    }

}
