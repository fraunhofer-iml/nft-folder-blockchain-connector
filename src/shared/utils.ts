/**
 * Copyright Open Logistics Foundation
 *
 * Licensed under the Open Logistics Foundation License 1.3.
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: OLFL-1.3
 */

export function areEndpointsEnabled(): boolean {
  return (
    process.env.ENDPOINTS_ENABLED &&
    typeof process.env.ENDPOINTS_ENABLED === 'string' &&
    process.env.ENDPOINTS_ENABLED.toLowerCase() === 'true'
  );
}
