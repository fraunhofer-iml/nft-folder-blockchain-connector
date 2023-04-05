import {Injectable} from '@nestjs/common';
import {ConfigService} from '@nestjs/config';
import {ConfigObject} from './entity/configObject';

@Injectable()
export class ApiConfigService {
    private configurationOverwrite: ConfigObject[] = [];

    constructor(private configService: ConfigService) {
    }

    get PRIVATE_KEY(): string {
        return this.getConfig<string>('PRIVATE_KEY', '');
    }

    get MNEMONIC_PASS_PHRASE(): string {
        return this.getConfig<string>('MNEMONIC_PASS_PHRASE', '');
    }

    get BLOCKCHAIN_URL(): string {
        return this.getConfig<string>('BLOCKCHAIN_URL', '');
    }
    get CONTAINER_SC_ADDRESS(): string {
        return this.getConfig<string>('CONTAINER_SC_ADDRESS', '');
    }
    get MIGRATIONS_SC_ADDRESS(): string {
        return this.getConfig<string>('MIGRATIONS_SC_ADDRESS', '');
    }
    get SEGMENT_SC_ADDRESS(): string {
        return this.getConfig<string>('SEGMENT_SC_ADDRESS', '');
    }

    get TOKEN_SC_ADDRESS(): string {
        return this.getConfig<string>('TOKEN_SC_ADDRESS', '');
    }


    public setConfig(tag: string, value: string) {
        this.configurationOverwrite.push(new ConfigObject(tag, value));
    }

    private getConfig<T>(tag: string, alternative: T): T {
        let config: any = this.configurationOverwrite.find((el) => el.name === tag);
        if (!config) {
            config = this.configService.get<T>(tag, alternative);
        } else {
            config = config.value;
        }
        return config;
    }
}
