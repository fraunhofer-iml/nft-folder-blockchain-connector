/**
 * Copyright 2023 Open Logistics Foundation
 *
 * Licensed under the Open Logistics License 1.0.
 * For details on the licensing terms, see the LICENSE file.
 */

import { BadRequestException, Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { TokenService } from '../service/token.service';
import { TokenMintDto } from '../../../dto/tokenMint.dto';
import { ApiBody, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { map } from 'rxjs';
import { ApprovalDto } from '../../../dto/approval.dto';
import { TransferDto } from '../../../dto/transfer.dto';

@ApiTags('NFT Token Controller')
@Controller('token')
export class TokenController {
  constructor(private readonly tokenConnectorService: TokenService) {}

  @Put('approve')
  @ApiBody({ type: ApprovalDto, description: 'Contains the information for a token approval' })
  @ApiOperation({ summary: 'Approve a token' })
  public approve(@Body() approvalDto: ApprovalDto) {
    if (!approvalDto.to || !approvalDto.tokenId) {
      throw new BadRequestException();
    }
    return this.tokenConnectorService.approve(approvalDto.to, approvalDto.tokenId).pipe(
      map((res) => {
        if (res.errorCode) {
          throw new BadRequestException(res.errorMessage);
        }
        return res;
      }),
    );
  }

  @Delete('burn/:tokenId')
  @ApiQuery({ name: 'tokenId', type: Number })
  @ApiOperation({ summary: 'Burn a token' })
  public burn(@Param('tokenId') tokenId: number) {
    return this.tokenConnectorService.burn(tokenId).pipe(
      map((res) => {
        if (res.errorCode) {
          throw new BadRequestException(res.errorMessage);
        }
        return res;
      }),
    );
  }

  @Put('renounceOwnership')
  @ApiOperation({ summary: 'Renounce ownership' })
  public renounceOwnership() {
    return this.tokenConnectorService.renounceOwnership().pipe(
      map((res) => {
        if (res.errorCode) {
          throw new BadRequestException(res.errorMessage);
        }
        return res;
      }),
    );
  }

  @Post('safeMint')
  @ApiQuery({ name: 'tokenMintDto', type: TokenMintDto })
  @ApiOperation({ summary: 'Mint the token' })
  public safeMint(@Body() tokenMintDto: TokenMintDto) {
    return this.tokenConnectorService.safeMint(tokenMintDto).pipe(
      map((res) => {
        if (res.errorCode) {
          throw new BadRequestException(res.errorMessage);
        }
        return res;
      }),
    );
  }

  @Put('safeTransferFrom')
  @ApiBody({ type: TransferDto, description: 'contains the necessary information about a token transfer' })
  @ApiOperation({ summary: '(Safe) Transfer token' })
  public safeTransferFrom(@Body() transferDto: TransferDto) {
    return this.tokenConnectorService.safeTransferFrom(transferDto.from, transferDto.from, transferDto.tokenId).pipe(
      map((res) => {
        if (res.errorCode) {
          throw new BadRequestException(res.errorMessage);
        }
        return res;
      }),
    );
  }

  @Put('setApprovalForAll/:operator/:approved')
  @ApiQuery({ name: 'operator', type: String })
  @ApiQuery({ name: 'approved', type: Boolean })
  @ApiOperation({ summary: 'Set Approval' })
  public setApprovalForAll(@Param('operator') operator: string, @Param('approved') approved: boolean) {
    return this.tokenConnectorService.setApprovalForAll(operator, approved).pipe(
      map((res) => {
        if (res.errorCode) {
          throw new BadRequestException(res.errorMessage);
        }
        return res;
      }),
    );
  }

  @Put('transferFrom')
  @ApiBody({ type: TransferDto, description: 'contains the necessary information about a token transfer' })
  @ApiOperation({ summary: 'Transfer token' })
  public transferFrom(@Body() transferDto: TransferDto) {
    return this.tokenConnectorService.transferFrom(transferDto.from, transferDto.to, transferDto.tokenId).pipe(
      map((res) => {
        if (res.errorCode) {
          throw new BadRequestException(res.errorMessage);
        }
        return res;
      }),
    );
  }

  @Put('transferOwnership/:newOwner')
  @ApiQuery({ name: 'newOwner', type: String })
  @ApiOperation({ summary: 'Transfer token ownership' })
  public transferOwnership(@Param('newOwner') newOwner: string) {
    return this.tokenConnectorService.transferOwnership(newOwner).pipe(
      map((res) => {
        if (res.errorCode) {
          throw new BadRequestException(res.errorMessage);
        }
        return res;
      }),
    );
  }

  @Get('balanceOf/:ownerAddress')
  @ApiQuery({ name: 'ownerAddress', type: String })
  @ApiOperation({ summary: 'Returns balance' })
  public balanceOf(@Param('ownerAddress') ownerAddress: string) {
    return this.tokenConnectorService.balanceOf(ownerAddress).pipe(
      map((res) => {
        if (res.errorCode) {
          throw new BadRequestException(res.errorMessage);
        }
        return res;
      }),
    );
  }

  @Get('getAdditionalInformation/:tokenId')
  @ApiQuery({ name: 'tokenId', type: Number })
  @ApiOperation({ summary: 'Returns additional info of token' })
  public getAdditionalInformation(@Param('tokenId') tokenId: number) {
    return this.tokenConnectorService.getAdditionalInformation(tokenId).pipe(
      map((res) => {
        if (res.errorCode) {
          throw new BadRequestException(res.errorMessage);
        }
        return res;
      }),
    );
  }

  @Get('getApproved/:tokenId')
  @ApiQuery({ name: 'tokenId', type: Number })
  @ApiOperation({ summary: 'Returns if the token is approved' })
  public getApproved(@Param('tokenId') tokenId: number) {
    return this.tokenConnectorService.getApproved(tokenId).pipe(
      map((res) => {
        if (res.errorCode) {
          throw new BadRequestException(res.errorMessage);
        }
        return res;
      }),
    );
  }

  @Get('getAssetHash/:tokenId')
  @ApiQuery({ name: 'tokenId', type: Number })
  @ApiOperation({ summary: 'Returns the token asset hash' })
  public getAssetHash(@Param('tokenId') tokenId: number) {
    return this.tokenConnectorService.getAssetHash(tokenId).pipe(
      map((res) => {
        if (res.errorCode) {
          throw new BadRequestException(res.errorMessage);
        }
        return res;
      }),
    );
  }

  @Get('getAssetUri/:tokenId')
  @ApiQuery({ name: 'tokenId', type: Number })
  @ApiOperation({ summary: 'Returns the token asset uri' })
  public getAssetUri(@Param('tokenId') tokenId: number) {
    return this.tokenConnectorService.getAssetUri(tokenId).pipe(
      map((res) => {
        if (res.errorCode) {
          throw new BadRequestException(res.errorMessage);
        }
        return res;
      }),
    );
  }

  @Get('getMetadataHash/:tokenId')
  @ApiQuery({ name: 'tokenId', type: Number })
  @ApiOperation({ summary: 'Returns the metadata hash of the token' })
  public getMetadataHash(@Param('tokenId') tokenId: number) {
    return this.tokenConnectorService.getMetadataHash(tokenId).pipe(
      map((res) => {
        if (res.errorCode) {
          throw new BadRequestException(res.errorMessage);
        }
        return res;
      }),
    );
  }

  @Get('isApprovedForAll/:owner/:operator')
  @ApiQuery({ name: 'owner', type: String })
  @ApiQuery({ name: 'operator', type: String })
  @ApiOperation({ summary: 'Returns if the owner is approved for all tokens' })
  public isApprovedForAll(@Param('owner') owner: string, @Param('operator') operator: string) {
    return this.tokenConnectorService.isApprovedForAll(owner, operator).pipe(
      map((res) => {
        if (res.errorCode) {
          throw new BadRequestException(res.errorMessage);
        }
        return res;
      }),
    );
  }

  @Get('name')
  @ApiOperation({ summary: 'Returns the name' })
  public name() {
    return this.tokenConnectorService.name().pipe(
      map((res) => {
        if (res.errorCode) {
          throw new BadRequestException(res.errorMessage);
        }
        return res;
      }),
    );
  }

  @Get('owner')
  @ApiOperation({ summary: 'Returns the owner' })
  public owner() {
    return this.tokenConnectorService.owner().pipe(
      map((res) => {
        if (res.errorCode) {
          throw new BadRequestException(res.errorMessage);
        }
        return res;
      }),
    );
  }

  @Get('ownerOf/:tokenId')
  @ApiQuery({ name: 'tokenId', type: Number })
  @ApiOperation({ summary: 'Returns if the owner of the token' })
  public ownerOf(@Param('tokenId') tokenId: number) {
    return this.tokenConnectorService.ownerOf(tokenId).pipe(
      map((res) => {
        if (res.errorCode) {
          throw new BadRequestException(res.errorMessage);
        }
        return res;
      }),
    );
  }

  @Get('supportsInterface/:interfaceId')
  @ApiQuery({ name: 'interfaceId', type: String })
  @ApiOperation({ summary: 'Returns if the interface is supported' })
  public supportsInterface(@Param('interfaceId') interfaceId: string) {
    return this.tokenConnectorService.supportsInterface(interfaceId).pipe(
      map((res) => {
        if (res.errorCode) {
          throw new BadRequestException(res.errorMessage);
        }
        return res;
      }),
    );
  }

  @Get('symbol')
  @ApiOperation({ summary: 'Returns the symbol' })
  public symbol() {
    return this.tokenConnectorService.symbol().pipe(
      map((res) => {
        if (res.errorCode) {
          throw new BadRequestException(res.errorMessage);
        }
        return res;
      }),
    );
  }

  @Get('getTokenURI/:tokenId')
  @ApiQuery({ name: 'tokenId', type: Number })
  @ApiOperation({ summary: 'Returns the token uri' })
  public getTokenURI(@Param('tokenId') tokenId: number) {
    return this.tokenConnectorService.getTokenURI(tokenId).pipe(
      map((res) => {
        if (res.errorCode) {
          throw new BadRequestException(res.errorMessage);
        }
        return res;
      }),
    );
  }
}
