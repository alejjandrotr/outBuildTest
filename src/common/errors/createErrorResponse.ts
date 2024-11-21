export function createErrorResponse(error: unknown) {
  const errorData = error as Error;

  const errorResponse = {
    message: errorData.message || 'Unexpected Error',
    name: errorData.name || 'UnexpectedError',
  };
  return errorResponse;
}
