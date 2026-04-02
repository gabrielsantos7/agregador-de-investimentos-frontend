import type Decimal from 'decimal.js';

type FormatCurrencyOptions = {
	locale?: string;
	currency?: string;
	minimumFractionDigits?: number;
	maximumFractionDigits?: number;
};

export function formatCurrency(
	value: Decimal | number,
	options: FormatCurrencyOptions = {}
): string {
	const {
		locale = 'en-US',
		currency = 'USD',
		minimumFractionDigits = 2,
		maximumFractionDigits,
	} = options;

	return new Intl.NumberFormat(locale, {
		style: 'currency',
		currency,
		minimumFractionDigits,
		maximumFractionDigits,
	}).format(typeof value === 'number' ? value : value.toNumber());
}
