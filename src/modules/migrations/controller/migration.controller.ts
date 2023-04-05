import {BadRequestException, Controller, Param, Put} from '@nestjs/common';
import {MigrationsConnectorService} from "../sc-connector/migrations.connector.service";
import {ApiOperation, ApiQuery, ApiTags} from "@nestjs/swagger";
import {map} from "rxjs";

@ApiTags("NFT Migration")
@Controller('migrations')
export class MigrationController {

    constructor(private readonly migrationsConnectorService: MigrationsConnectorService) {}


    @Put("setCompleted/:completed")
    @ApiQuery({ name: "completed", type: Number })
    @ApiOperation({ summary: "Set the last completed migration number" })
    public setCompleted(@Param("completed") completed: number){
        this.migrationsConnectorService.setCompleted(completed)
            .pipe(map(res => {
                if(res.errorCode){
                    throw new BadRequestException(res.errorMessage);
                }
                return res;
            }));
    }
}
