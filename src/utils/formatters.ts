import type Decimal from 'decimal.js';

type FormatCurrencyOptions = {
	locale?: string;
	currency?: string;
	minimumFractionDigits?: number;
	maximumFractionDigits?: number;
};

export function formatCurrency(
	value: Decimal,
	options: FormatCurrencyOptions = {}
): string {
	const {
		locale,
		currency = 'USD',
		minimumFractionDigits,
		maximumFractionDigits,
	} = options;

	return new Intl.NumberFormat(locale, {
		style: 'currency',
		currency,
		minimumFractionDigits,
		maximumFractionDigits,
	}).format(value.toNumber());
}
