/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
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
