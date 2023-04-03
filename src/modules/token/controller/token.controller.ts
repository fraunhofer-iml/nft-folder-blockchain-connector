import {Body, Controller, Get, Post} from '@nestjs/common';

@Controller('token')
export class TokenController {

    @Post("safeMint")
    public safeMint(@Body() input: any,){

    }

    @Post("safeMintWithInfo")
    public safeMintWithInfo(@Body() input: any,){

    }

    @Get("getTokenURI")
    public getTokenURI(tokenId: number){

    }

    @Get("getAdditionalInformation")
    public getAdditionalInformation(tokenId: number){

    }

    @Get("getAssetHash")
    public getAssetHash(tokenId: number){

    }

    @Get("getMetadataHash")
    public getMetadataHash(tokenId: number){

    }

    @Post("setMetadata")
    public setMetadata(tokenId: number, tokenUri: string, metadataHash: string){

    }

}
