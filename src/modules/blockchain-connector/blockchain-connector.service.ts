import {Inject, Injectable, Logger} from "@nestjs/common";
import {catchError, defer, from, of, tap} from "rxjs";
import {ApiConfigService} from "../../settings/ApiConfigService";

@Injectable()
export class BlockchainConnectorService{

    private logger = new Logger(BlockchainConnectorService.name);

    constructor(
        @Inject("Web3Service") public readonly web3: any,
        private apiConfigService: ApiConfigService) {
        }

    private convertWalletKey(walletKey: string) {
        try {
            return this.web3.eth.accounts.privateKeyToAccount("0x" + walletKey);
        } catch (e) {
            this.logger.error(e);
            return undefined;
        }
    }

    public sendTransaction(transaction){
        console.log(transaction)
        const ownAccount = this.convertWalletKey(this.apiConfigService.PRIVATE_KEY);
        const transactionParameters = {
            gas: 6721975,
            gasPrice: 0,
            to: transaction._parent._address,
            from: ownAccount.address,
            data: transaction.encodeABI(),
        }
        return defer(() => from(this.web3.eth.sendTransaction(transactionParameters
        ))).pipe(catchError(err => {
            this.logger.log(err, "sendSigned@send");
            return of(err)
        }), tap((res) => {
            this.logger.log("after send ... ", res)
            return res;
        }))
    }

    public call(transaction){
        return defer(() => from(transaction.call()))
            .pipe(catchError(err => {
            return of(err)
        }), tap((res) => {
            return res;
        }))
    }

}