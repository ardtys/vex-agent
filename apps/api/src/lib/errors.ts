export class VexError extends Error {
	constructor(
		message: string,
		public code: string,
		public statusCode: number = 500
	) {
		super(message);
		this.name = 'VexError';
	}
}

export class ValidationError extends VexError {
	constructor(message: string) {
		super(message, 'VALIDATION_ERROR', 400);
		this.name = 'ValidationError';
	}
}

export class AuthError extends VexError {
	constructor(message: string = 'Unauthorized') {
		super(message, 'AUTH_ERROR', 401);
		this.name = 'AuthError';
	}
}

export class RateLimitError extends VexError {
	constructor(message: string = 'Rate limit exceeded') {
		super(message, 'RATE_LIMIT_ERROR', 429);
		this.name = 'RateLimitError';
	}
}

export class ToolError extends VexError {
	constructor(
		message: string,
		public toolName: string
	) {
		super(message, 'TOOL_ERROR', 500);
		this.name = 'ToolError';
	}
}

export class ExternalServiceError extends VexError {
	constructor(
		message: string,
		public service: string
	) {
		super(message, 'EXTERNAL_SERVICE_ERROR', 502);
		this.name = 'ExternalServiceError';
	}
}

export function isVexError(error: unknown): error is VexError {
	return error instanceof VexError;
}

export function formatError(error: unknown): { message: string; code: string } {
	if (isVexError(error)) {
		return { message: error.message, code: error.code };
	}
	if (error instanceof Error) {
		return { message: error.message, code: 'UNKNOWN_ERROR' };
	}
	return { message: 'An unknown error occurred', code: 'UNKNOWN_ERROR' };
}
