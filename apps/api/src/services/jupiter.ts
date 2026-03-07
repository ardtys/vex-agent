import { ExternalServiceError } from '../lib/errors.js';
import type { SwapQuote } from '@vex/shared';

const JUPITER_API_URL = 'https://quote-api.jup.ag/v6';

const SOL_MINT = 'So11111111111111111111111111111111111111112';

function normalizeMint(mint: string): string {
	if (mint.toUpperCase() === 'SOL') return SOL_MINT;
	return mint;
}

export interface QuoteResponse {
	inputMint: string;
	inAmount: string;
	outputMint: string;
	outAmount: string;
	otherAmountThreshold: string;
	swapMode: string;
	slippageBps: number;
	platformFee: null;
	priceImpactPct: string;
	routePlan: Array<{
		swapInfo: {
			ammKey: string;
			label: string;
			inputMint: string;
			outputMint: string;
			inAmount: string;
			outAmount: string;
			feeAmount: string;
			feeMint: string;
		};
		percent: number;
	}>;
}

export async function getQuote(
	inputMint: string,
	outputMint: string,
	amount: number,
	slippageBps: number = 300
): Promise<QuoteResponse> {
	const normalizedInput = normalizeMint(inputMint);
	const normalizedOutput = normalizeMint(outputMint);

	const params = new URLSearchParams({
		inputMint: normalizedInput,
		outputMint: normalizedOutput,
		amount: amount.toString(),
		slippageBps: slippageBps.toString(),
		swapMode: 'ExactIn'
	});

	const response = await fetch(`${JUPITER_API_URL}/quote?${params}`) as globalThis.Response;

	if (!response.ok) {
		const error = await response.text();
		throw new ExternalServiceError(`Jupiter quote failed: ${error}`, 'jupiter');
	}

	return (await response.json()) as QuoteResponse;
}

export async function buildSwapTransaction(
	quote: QuoteResponse,
	userPublicKey: string
): Promise<{ swapTransaction: string; lastValidBlockHeight: number }> {
	const response = await fetch(`${JUPITER_API_URL}/swap`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({
			quoteResponse: quote,
			userPublicKey,
			wrapAndUnwrapSol: true,
			dynamicComputeUnitLimit: true,
			prioritizationFeeLamports: 'auto'
		})
	}) as globalThis.Response;

	if (!response.ok) {
		const error = await response.text();
		throw new ExternalServiceError(`Jupiter swap build failed: ${error}`, 'jupiter');
	}

	return (await response.json()) as { swapTransaction: string; lastValidBlockHeight: number };
}

export function formatQuoteForDisplay(quote: QuoteResponse): SwapQuote {
	return {
		inputMint: quote.inputMint,
		outputMint: quote.outputMint,
		inAmount: quote.inAmount,
		outAmount: quote.outAmount,
		priceImpactPct: parseFloat(quote.priceImpactPct),
		slippageBps: quote.slippageBps,
		routePlan: quote.routePlan
	};
}

export async function executeSwap(
	inputMint: string,
	outputMint: string,
	amount: number,
	userPublicKey: string,
	slippageBps: number = 300
): Promise<{
	quote: SwapQuote;
	transaction: string;
	lastValidBlockHeight: number;
}> {
	// Get quote
	const quoteResponse = await getQuote(inputMint, outputMint, amount, slippageBps);

	// Build transaction
	const { swapTransaction, lastValidBlockHeight } = await buildSwapTransaction(
		quoteResponse,
		userPublicKey
	);

	return {
		quote: formatQuoteForDisplay(quoteResponse),
		transaction: swapTransaction,
		lastValidBlockHeight
	};
}
