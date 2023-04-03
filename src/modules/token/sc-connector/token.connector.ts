import {TokenMintDto} from "../../../dto/TokenMint.dto";

export class TokenConnector{

    public safeMint(tokenMintDto: TokenMintDto,){
        if(tokenMintDto.additionalInformation){
            /*
            const transaction = this.contract.methods.safeMint(
                tokenMintDto.receiver,
                tokenMintDto.assetUri,
                tokenMintDto.assetHash,
                tokenMintDto.metadataUri,
                tokenMintDto.metadataHash,
                tokenMintDto.additionalInformation
                );
                */
        }
        else{
            /*
                const transaction = this.contract.methods.safeMint(
                    tokenMintDto.receiver,
                    tokenMintDto.assetUri,
                    tokenMintDto.assetHash,
                    tokenMintDto.metadataUri,
                    tokenMintDto.metadataHash
                    );
    */
        }

    }

    public getTokenURI(tokenId: number){
        //const transaction = this.contract.methods.getTokenURI(tokenId);

    }

    public getAdditionalInformation(tokenId: number){
        //const transaction = this.contract.methods.getAdditionalInformation(tokenId);
    }

    public getAssetHash(tokenId: number){
        //const transaction = this.contract.methods.getAssetHash(tokenId);
    }

    public getMetadataHash(tokenId: number){
        //const transaction = this.contract.methods.getMetadataHash(tokenId);
    }

    public setMetadata(tokenId: number, tokenUri: string, metadataHash: string){
        //const transaction = this.contract.methods.setMetadata(tokenId, tokenUri, metadataHash);
    }
}