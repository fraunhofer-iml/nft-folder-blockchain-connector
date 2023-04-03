export class TokenMintDto{
    public receiver: string;
    public assetUri: string;
    public assetHash: string;
    public metadataUri: string;
    public metadataHash: string;
    public additionalInformation: string;


    constructor(receiver: string,
                assetUri: string,
                assetHash: string,
                metadataUri: string,
                metadataHash: string,
                additionalInformation?: string) {
    this.receiver = receiver;
        this.assetUri = assetUri;
        this.assetHash = assetHash;
        this.metadataUri = metadataUri;
        this.metadataHash = metadataHash;
        this.additionalInformation = additionalInformation;
    }

}