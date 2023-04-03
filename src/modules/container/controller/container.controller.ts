import {Body, Controller, Get, Post} from '@nestjs/common';
import {ContainerConnectorService} from "../sc-connector/container.connector.service";

@Controller('container')
export class ContainerController {

    constructor(private readonly containerConnectorService: ContainerConnectorService) {}

    @Post("createSegment")
    public createSegment(@Body() name: any,){
        return this.containerConnectorService.createSegment(name);
    }

    @Get("getName")
    public getName(){
        return this.containerConnectorService.getName();

    }

    @Get("getSegmentCount")
    public getSegmentCount(){
        return this.containerConnectorService.getSegmentCount();

    }

    @Get("getSegmentAtIndex")
    public getSegmentAtIndex(index: number){
        return this.containerConnectorService.getSegmentAtIndex(index);

    }

    @Get("isSegmentInContainer")
    public isSegmentInContainer(segment: string){
        return this.containerConnectorService.isSegmentInContainer(segment);

    }
}
