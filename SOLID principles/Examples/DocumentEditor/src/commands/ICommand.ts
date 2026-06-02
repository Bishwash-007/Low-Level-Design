// Command Interface - All operations implement this (OCP)
// Enables undo/redo, queuing, and extensibility

export interface ICommand {
	execute(): void;
	undo(): void;
	getDescription(): string;
}
