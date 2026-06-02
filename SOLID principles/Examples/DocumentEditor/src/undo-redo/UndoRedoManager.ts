import { IUndoRedoManager } from './IUndoRedoManager';
import { ICommand } from '../commands/ICommand';

// TODO: Implement UndoRedoManager
// - Maintain undo stack (array of executed commands)
// - Maintain redo stack (array of undone commands)
// - Execute command, add to undo stack, clear redo stack
// - Undo: pop from undo, call undo(), push to redo
// - Redo: pop from redo, call execute(), push to undo

export class UndoRedoManager implements IUndoRedoManager {
	private undoStack: ICommand[] = [];
	private redoStack: ICommand[] = [];

	executeCommand(command: ICommand): void {
		// TODO: Implement
		throw new Error('Method not implemented.');
	}

	undo(): void {
		// TODO: Implement
		throw new Error('Method not implemented.');
	}

	redo(): void {
		// TODO: Implement
		throw new Error('Method not implemented.');
	}

	canUndo(): boolean {
		// TODO: Implement
		throw new Error('Method not implemented.');
	}

	canRedo(): boolean {
		// TODO: Implement
		throw new Error('Method not implemented.');
	}

	getHistory(): ICommand[] {
		// TODO: Implement
		throw new Error('Method not implemented.');
	}
}
