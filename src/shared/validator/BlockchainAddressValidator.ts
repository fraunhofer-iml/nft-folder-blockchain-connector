/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
  ValidationOptions,
  registerDecorator,
} from 'class-validator';
import { isAddress } from 'web3-utils';

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
