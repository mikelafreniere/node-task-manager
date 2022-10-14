import { Request } from 'express';

/**
 * Checks if the requested field(s) exist on the model to be updated
 *
 * @param type - The class of the model to be updated
 * @param request - The API request body
 * @returns {boolean} - Whether every field of the request body exists as a field on the model
 */
export function isValidRequest<T extends {}>(type: new () => T, request: Request): boolean {
  const updates = Object.keys(request.body);
  const allowedFields = Object.keys(new type());
  return updates.every((update) => allowedFields.includes(update));
}
