import {Controller, Delete, Get, Param, Post} from '@nestjs/common';
import {SegmentAllocationConnectorService} from "../sc-connector/segment-allocation.connector.service";

@Controller('segment-allocation')
export class SegmentAllocationController {

    constructor(private readonly segmentAllocationConnectorService: SegmentAllocationConnectorService) {}

    @Post("addTokenToSegment/:tokenId/:segmentAddress")
    public addTokenToSegment(
        @Param("tokenId")tokenId: number,
        @Param("segmentAddress")segmentAddress: string,){
        this.segmentAllocationConnectorService.addTokenToSegment(tokenId, segmentAddress);
    }


    @Delete("removeSegment/:tokenId/:segmentAddress/:tokenAddress")
    public removeSegment(@Param("tokenId")tokenId: number,
                         @Param("segmentAddress")segmentAddress: string,){
        this.segmentAllocationConnectorService.removeSegment(tokenId, segmentAddress);
    }

    @Get("getSegmentCount/:tokenId")
    public getSegmentCount(@Param("tokenId")tokenId: number,){
        this.segmentAllocationConnectorService.getSegmentCount(tokenId);

    }

    @Get("getSegmentAtIndex/:tokenId/:segmentIndex")
    public getSegmentAtIndex(
        @Param("tokenId")tokenId: number,
        @Param("segmentIndex")segmentIndex: number){
        this.segmentAllocationConnectorService.getSegmentAtIndex(tokenId, segmentIndex);

    }

    @Get("getIndexForSegment/:tokenId/:segmentAddress")
    public getIndexForSegment(@Param("tokenId")tokenId: number,
                              @Param("segmentAddress")segmentAddress: string,){
        this.segmentAllocationConnectorService.getIndexForSegment(tokenId, segmentAddress);

    }

    @Get("isTokenInSegment/:tokenId/:segmentAddress/:tokenAddress")
    public isTokenInSegment(@Param("tokenId")tokenId: number,
                            @Param("segmentAddress")segmentAddress: string){
        this.segmentAllocationConnectorService.isTokenInSegment(tokenId, segmentAddress);

    }

}
