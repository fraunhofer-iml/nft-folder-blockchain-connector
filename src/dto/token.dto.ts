/**
 * Copyright 2023 Open Logistics Foundation
 *
 * Licensed under the Open Logistics License 1.0.
 * For details on the licensing terms, see the LICENSE file.
 */

export class TokenDto {
  public tokenAddress: string;
  public tokenId: number;
  public segmentIndex: string;

  constructor(token: string, tokenId: number, segmentAddress: string) {
    this.tokenAddress = token;
    this.tokenId = tokenId;
    this.segmentIndex = segmentAddress;
  }
}
