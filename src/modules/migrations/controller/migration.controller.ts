import {Controller, Param, Put} from '@nestjs/common';
import {MigrationsConnectorService} from "../sc-connector/migrations.connector.service";

@Controller('migrations')
export class MigrationController {

    constructor(private readonly migrationsConnectorService: MigrationsConnectorService) {}


    @Put("setCompleted/:completed")
    public setCompleted(@Param("completed") completed: number){
        this.migrationsConnectorService.setCompleted(completed);
    }
}
