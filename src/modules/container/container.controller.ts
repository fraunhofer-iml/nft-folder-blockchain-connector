import {Body, Controller, Post} from '@nestjs/common';

@Controller('container')
export class ContainerController {

    @Post()
    public createSegment(@Body() name: any,){
        return name.name + " angelegt.";
    }

    public getName(){

    }

    public getSegmentCount(){

    }

    public getSegmentAtIndex(index: number){

    }

    public isSegmentInContainer(segment: string){

    }
}
