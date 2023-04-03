import {Body, Controller, Get, Param, Post} from '@nestjs/common';
import {ContainerConnectorService} from "../sc-connector/container.connector.service";

@Controller('container')
export class ContainerController {

    constructor(private readonly containerConnectorService: ContainerConnectorService) {}


    //TODO: implement container deployment
    @Post("deployNewContainer")
    public deployNewContainer(@Body() name: any,){
        return this.containerConnectorService.deployNewContainer(name);
    }

    @Post("createSegment")
    public createSegment(@Body() nameInput: any,){
        return this.containerConnectorService.createSegment(nameInput.name);
    }

    @Get("getName")
    public getName(){
        return this.containerConnectorService.getName();

    }

    @Get("getSegmentCount")
    public getSegmentCount(){
        return this.containerConnectorService.getSegmentCount();

    }

    @Get("getSegmentAtIndex/:index")
    public getSegmentAtIndex(@Param("index") index: number){
        return this.containerConnectorService.getSegmentAtIndex(index);

    }

    @Get("isSegmentInContainer/:segment")
    public isSegmentInContainer(@Param("segment") segment: string){
        return this.containerConnectorService.isSegmentInContainer(segment);

    }
}
