import {Controller, Put} from '@nestjs/common';
import {MigrationsConnectorService} from "../sc-connector/migrations.connector.service";

@Controller('migrations')
export class MigrationController {

    constructor(private readonly migrationsConnectorService: MigrationsConnectorService) {}


    @Put("setCompleted")
    public setCompleted(completed: number){
        this.migrationsConnectorService.setCompleted(completed);
    }
}
