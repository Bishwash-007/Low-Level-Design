// Formatter Interface - All formatters implement this (LSP)
// Enables swappable text formatting strategies

export interface IFormatter {
	format(text: string): string;
	getType(): string;
}
