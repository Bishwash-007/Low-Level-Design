// Public API - Export only what consumers need

// Core
export { IDocument, Metadata } from './core/IDocument';
export { Document } from './core/Document';

// Commands
export { ICommand } from './commands/ICommand';
export { InsertCommand } from './commands/InsertCommand';
export { DeleteCommand } from './commands/DeleteCommand';
export { ReplaceCommand } from './commands/ReplaceCommand';

// Formatting
export { IFormatter } from './formatting/IFormatter';
export { BoldFormatter } from './formatting/BoldFormatter';
export { ItalicFormatter } from './formatting/ItalicFormatter';
export { UnderlineFormatter } from './formatting/UnderlineFormatter';

// Storage
export { IStorage } from './storage/IStorage';
export { FileSystemStorage } from './storage/FileSystemStorage';

// Undo/Redo
export { IUndoRedoManager } from './undo-redo/IUndoRedoManager';
export { UndoRedoManager } from './undo-redo/UndoRedoManager';

// Export
export { IExporter } from './export/IExporter';
export { MarkdownExporter } from './export/MarkdownExporter';
export { HTMLExporter } from './export/HTMLExporter';

// Observer
export { IObserver, DocumentChanges, IObservable } from './observer/IObserver';

// Editor
export { Editor } from './editor/Editor';
