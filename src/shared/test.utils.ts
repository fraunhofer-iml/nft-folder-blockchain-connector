/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

export function areMethodsEqual(transactionA: any, transactionB: any) {
  return (
    transactionA._method.name == transactionB._method.name &&
    transactionA.arguments.toString() == transactionB.arguments.toString()
  );
}
