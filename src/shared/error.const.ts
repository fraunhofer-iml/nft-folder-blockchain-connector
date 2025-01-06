/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

export const NOT_FOUND_CUSTOM_ERRORS: string[] = [
  'IndexExceedsTokenInformationLength',
  'NoSegmentsAvailable',
  'RemoteIdDoesNotExist',
  'TokenDoesNotExist',
  'TokenDoesNotExistInSegment',
  'ERC721NonexistentToken',
];
export const ALREADY_EXISTS_CUSTOM_ERRORS: string[] = ['RemoteIdExists', 'TokenExistsInSegment'];
export const NOT_ALLOWED_CUSTOM_ERRORS: string[] = [
  'SenderIsNotContainer',
  'SenderIsNotSegment',
  'OwnableUnauthorizedAccount',
  'ERC721InsufficientApproval',
  'ERC721InvalidOwner',
  'ERC721IncorrectOwner',
  'ERC721InvalidSender',
  'ERC721InvalidReceiver',
  'ERC721InsufficientApproval',
  'ERC721InvalidApprover',
  'ERC721InvalidOperator',
];
