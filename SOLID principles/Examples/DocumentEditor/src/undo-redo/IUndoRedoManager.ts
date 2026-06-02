import { ICommand } from '../commands/ICommand';

// Undo/Redo Manager Interface - Manages command history (SRP)
// Maintains undo and redo stacks
// No business logic, pure history management

export interface IUndoRedoManager {
	executeCommand(command: ICommand): void;
	undo(): void;
	redo(): void;
	canUndo(): boolean;
	canRedo(): boolean;
	getHistory(): ICommand[];
}
