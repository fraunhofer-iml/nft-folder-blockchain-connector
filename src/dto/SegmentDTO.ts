import { TokenInformationDTO } from './TokenInformationDTO';
import {TokenLocationInSegmentDTO} from "./TokenLocationInSegmentDTO";

export class SegmentDTO{
    private name: string;
    private container: string;
    private tokenInformation: TokenInformationDTO[];
}