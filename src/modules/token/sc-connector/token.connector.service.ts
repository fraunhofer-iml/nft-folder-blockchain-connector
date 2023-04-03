import {TokenMintDto} from "../../../dto/TokenMint.dto";
import {BlockchainConnectorService} from "../../blockchain-connector/blockchain-connector.service";
import {ApiConfigService} from "../../../settings/ApiConfigService";
import {containerAbi} from "../../container/sc-connector/container.abi";
import {Injectable} from "@nestjs/common";
import {TokenAbi} from "./token.abi";

@Injectable()
export class TokenConnectorService {

    private contract: any;

    constructor(
        private readonly blockchainConnectorService: BlockchainConnectorService,
        private apiConfigService: ApiConfigService
    ) {
        this.contract = new this.blockchainConnectorService.web3.eth.Contract(
            TokenAbi,
            apiConfigService.TOKEN_SC_ADDRESS
        );
    }


    public safeMint(tokenMintDto: TokenMintDto){

            const transaction = (tokenMintDto.additionalInformation) ?
                this.contract.methods.safeMint(
                    tokenMintDto.receiver,
                    tokenMintDto.assetUri,
                    tokenMintDto.assetHash,
                    tokenMintDto.metadataUri,
                    tokenMintDto.metadataHash,
                    tokenMintDto.additionalInformation)
                :
                this.contract.methods.safeMint(
                    tokenMintDto.receiver,
                    tokenMintDto.assetUri,
                    tokenMintDto.assetHash,
                    tokenMintDto.metadataUri,
                    tokenMintDto.metadataHash)
            return this.blockchainConnectorService.sendTransaction(transaction);
    }

    public getTokenURI(tokenId: number){
        console.log(this.contract)
        return this.blockchainConnectorService.call(this.contract.methods.tokenURI(tokenId));
    }

    public getAdditionalInformation(tokenId: number){
        return this.blockchainConnectorService.call(this.contract.methods.getAdditionalInformation(tokenId));
    }

    public getAssetHash(tokenId: number){
        return this.blockchainConnectorService.call(this.contract.methods.getAssetHash(tokenId));
    }

    public getMetadataHash(tokenId: number){
        return this.blockchainConnectorService.call(this.contract.methods.getMetadataHash(tokenId));
    }

    public setMetadata(tokenId: number, tokenUri: string, metadataHash: string){
        return this.blockchainConnectorService.sendTransaction(this.contract.methods.setMetadata(tokenId, tokenUri, metadataHash));
    }
}