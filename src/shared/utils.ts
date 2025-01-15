/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

export function areEndpointsEnabled(): boolean {
  return (
    process.env.BCC_ENDPOINTS_ENABLED &&
    typeof process.env.BCC_ENDPOINTS_ENABLED === 'string' &&
    process.env.BCC_ENDPOINTS_ENABLED.toLowerCase() === 'true'
  );
}
