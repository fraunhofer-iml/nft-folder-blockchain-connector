/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { isAddress } from 'ethers';

@ValidatorConstraint({ name: 'IsValidBlockchainAddress', async: false })
export class BlockchainAddressValidator implements ValidatorConstraintInterface {
  validate(value: string) {
    return isAddress(value);
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.property} is not a valid blockchain address`;
  }
}

export function IsValidBlockchainAddress(validationOptions?: ValidationOptions) {
  return function (object: NonNullable<unknown>, propertyName: string) {
    registerDecorator({
      name: 'IsValidBlockchainAddress',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: BlockchainAddressValidator,
    });
  };
}
