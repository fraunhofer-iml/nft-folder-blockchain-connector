export class AddTokenDto{
    public token: string;
    public tokenId: number;
    public segmentAddress: string;

    constructor(token: string,
                tokenId: number,
                segmentAddress: string) {
        this.token = token;
        this.tokenId = tokenId;
        this.segmentAddress = segmentAddress;
    }

}