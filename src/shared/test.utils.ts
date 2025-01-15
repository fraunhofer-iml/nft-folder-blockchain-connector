/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

export function areMethodsEqual(transactionA: any, transactionB: any) {
  return (
    transactionA._method.name == transactionB._method.name &&
    transactionA.arguments.toString() == transactionB.arguments.toString()
  );
}
