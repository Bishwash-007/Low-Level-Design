# Document Editor App - SOLID Principles Guide

## Overview
Build a modular, maintainable document editor by applying SOLID principles. This guide walks you through design patterns and architectural decisions.

---

## SOLID Principles Applied

### 1. **Single Responsibility Principle (SRP)**
Each class should have one reason to change.

#### Application to Document Editor:
- **Document**: Manages document content and metadata (no formatting, no persistence)
- **Formatter**: Handles text formatting (bold, italic, etc.)
- **FileManager**: Handles file I/O (save, load, delete)
- **UndoManager**: Manages undo/redo operations
- **CommandExecutor**: Executes editing commands

**Why**: If document structure changes, you only modify the Document class. If persistence logic changes, you only modify FileManager.

---

### 2. **Open/Closed Principle (OCP)**
Classes should be open for extension, closed for modification.

#### Application to Document Editor:
- **Command Interface**: Create a common interface for all operations (Insert, Delete, Format, etc.)
- **New operations extend Command**: Don't modify existing command classes when adding new features
- **Plugin Architecture**: Allow formatters, exporters to be plugged in without changing core code

**Example**:
```typescript
interface ICommand {
  execute(): void;
  undo(): void;
}

class InsertTextCommand implements ICommand { }
class DeleteTextCommand implements ICommand { }
class BoldTextCommand implements ICommand { }
// Add new commands without modifying existing ones
```

---

### 3. **Liskov Substitution Principle (LSP)**
Subtypes must be substitutable for their base types.

#### Application to Document Editor:
- All formatters must follow the same contract (e.g., `applyFormat()` always works the same way)
- All exporters (PDF, Word, Text) must work interchangeably
- All storage backends (File, Cloud, Database) must have identical interfaces

**Why**: You can swap implementations without breaking client code.

```typescript
interface IExporter {
  export(document: Document): string;
}

class PDFExporter implements IExporter { }
class MarkdownExporter implements IExporter { }
// Both are interchangeable
```

---

### 4. **Interface Segregation Principle (ISP)**
Create smaller, focused interfaces rather than large, general ones.

#### Application to Document Editor:
```typescript
//  BAD: One bloated interface
interface IEditor {
  saveDocument(): void;
  loadDocument(): void;
  formatText(): void;
  undoAction(): void;
  exportToPDF(): void;
  shareDocument(): void;
}

//  GOOD: Segregated interfaces
interface IDocumentPersistence {
  save(doc: Document): void;
  load(path: string): Document;
}

interface ITextFormatter {
  applyBold(text: string): string;
  applyItalic(text: string): string;
}

interface IUndoRedo {
  undo(): void;
  redo(): void;
}

interface IExport {
  exportToPDF(): Buffer;
  exportToMarkdown(): string;
}
```

**Why**: Implementations only depend on what they actually need.

---

### 5. **Dependency Inversion Principle (DIP)**
High-level modules should not depend on low-level modules. Both should depend on abstractions.

#### Application to Document Editor:
```typescript
//  BAD: Direct dependency on FileManager
class Editor {
  private fileManager = new FileManager();
  save() {
    this.fileManager.save(this.document);
  }
}

//  GOOD: Depend on abstraction
interface IStorage {
  save(doc: Document): void;
  load(path: string): Document;
}

class Editor {
  constructor(private storage: IStorage) {}
  save() {
    this.storage.save(this.document);
  }
}

// Usage: Can inject any implementation
const fileStorage = new FileManager();
const cloudStorage = new CloudManager();
const editor = new Editor(fileStorage);
```

---

## Core Components & Responsibilities

### 1. **Document (SRP)**
- Stores document content and metadata
- No formatting logic
- No persistence logic

```typescript
interface IDocument {
  getContent(): string;
  updateContent(content: string): void;
  getMetadata(): Metadata;
}
```

### 2. **Command Pattern (OCP + SRP)**
All operations inherit from a command interface
- Enables undo/redo
- Each command is independent
- Easy to add new operations

```typescript
interface ICommand {
  execute(): void;
  undo(): void;
  getDescription(): string;
}
```

### 3. **Formatter (SRP + LSP)**
Handles all formatting operations
- Bold, Italic, Underline, Font Size, etc.
- All formatters implement same interface
- Can be swapped/extended

```typescript
interface ITextFormatter {
  format(text: string): string;
}
```

### 4. **Storage/Persistence (DIP + ISP)**
Abstract away storage mechanism
- File system
- Cloud storage
- Database
- All implement same interface

```typescript
interface IStorage {
  save(doc: Document): Promise<void>;
  load(id: string): Promise<Document>;
  delete(id: string): Promise<void>;
}
```

### 5. **Undo/Redo Manager (SRP)**
Manages command history
- Maintains undo stack
- Maintains redo stack
- No business logic

```typescript
interface IUndoRedoManager {
  executeCommand(cmd: ICommand): void;
  undo(): void;
  redo(): void;
}
```

### 6. **Editor/Application (Facade)**
Orchestrates all components
- Provides simple API to consumers
- Manages component interactions

---

## Design Patterns to Implement

### 1. **Command Pattern**
Each editing action = command object
- Better undo/redo support
- Can queue, delay, or schedule commands

### 2. **Observer Pattern**
Document notifies listeners of changes
- UI updates without tight coupling
- Multiple views of same document possible

### 3. **Strategy Pattern**
Different formatting/export strategies
- Choose algorithm at runtime
- Easy to add new strategies

### 4. **Factory Pattern**
Create commands, formatters, exporters
- Centralized creation logic
- Decouples creation from usage

### 5. **Composite Pattern**
Document structure (paragraphs, lines, words)
- Hierarchical text representation
- Enables complex operations

---

## File Structure

```
DocumentEditor/
├── src/
│   ├── core/
│   │   ├── Document.ts           // Core document model (SRP)
│   │   ├── IDocument.ts          // Document interface
│   │   └── Metadata.ts           // Document metadata
│   │
│   ├── commands/
│   │   ├── ICommand.ts           // Command interface (OCP)
│   │   ├── InsertCommand.ts
│   │   ├── DeleteCommand.ts
│   │   ├── ReplaceCommand.ts
│   │   ├── FormatCommand.ts
│   │   └── CommandFactory.ts
│   │
│   ├── formatting/
│   │   ├── IFormatter.ts         // Formatter interface (LSP)
│   │   ├── BoldFormatter.ts
│   │   ├── ItalicFormatter.ts
│   │   ├── UnderlineFormatter.ts
│   │   ├── FontSizeFormatter.ts
│   │   └── FormatterFactory.ts
│   │
│   ├── storage/
│   │   ├── IStorage.ts           // Storage interface (DIP)
│   │   ├── FileSystemStorage.ts
│   │   ├── CloudStorage.ts
│   │   └── DatabaseStorage.ts
│   │
│   ├── undo-redo/
│   │   ├── IUndoRedoManager.ts  // Undo/redo interface (SRP)
│   │   └── UndoRedoManager.ts
│   │
│   ├── export/
│   │   ├── IExporter.ts         // Exporter interface (LSP)
│   │   ├── PDFExporter.ts
│   │   ├── MarkdownExporter.ts
│   │   └── HTMLExporter.ts
│   │
│   ├── observer/
│   │   ├── IObserver.ts
│   │   ├── IObservable.ts
│   │   └── DocumentObserver.ts
│   │
│   ├── editor/
│   │   └── Editor.ts             // Main editor class (Facade)
│   │
│   └── index.ts                  // Public API exports
│
├── tests/
│   ├── commands.test.ts
│   ├── formatting.test.ts
│   ├── storage.test.ts
│   └── undo-redo.test.ts
│
├── examples/
│   └── basic-usage.ts            // Usage examples
│
├── package.json
├── tsconfig.json
└── guide.md
```

---

## Step-by-Step Implementation Guide

### Phase 1: Core Document (Foundation)
1. Create `IDocument` interface
2. Implement `Document` class
3. Add basic content management

### Phase 2: Command System (OCP + Undo/Redo)
1. Create `ICommand` interface
2. Implement `UndoRedoManager`
3. Create basic commands: Insert, Delete, Replace
4. Test undo/redo flow

### Phase 3: Formatting (LSP + ISP)
1. Create `IFormatter` interface
2. Implement individual formatters
3. Create `FormatCommand`
4. Test formatting operations

### Phase 4: Storage (DIP)
1. Create `IStorage` interface
2. Implement `FileSystemStorage`
3. Hook into `Editor` class
4. Test save/load operations

### Phase 5: Advanced Features
1. Add `IObserver` for change notifications
2. Implement exporters (`PDFExporter`, `MarkdownExporter`)
3. Add search/replace functionality
4. Implement multi-document support

### Phase 6: Testing & Refinement
1. Write unit tests for each module
2. Test interface boundaries
3. Verify LSP with polymorphism tests
4. Add integration tests

---

## Best Practices Checklist

- [ ] Each class has single responsibility
- [ ] All formatting/export types implement same interface (LSP)
- [ ] Commands are immutable and reusable
- [ ] Storage implementation is swappable (DIP)
- [ ] No circular dependencies
- [ ] Interfaces are segregated (ISP)
- [ ] Public API is stable and simple
- [ ] Tests verify interface contracts
- [ ] Documentation explains design choices
- [ ] New features extend, don't modify existing code (OCP)

---

## Example Usage Pattern

```typescript
// Dependency injection setup
const storage = new FileSystemStorage();
const undoManager = new UndoRedoManager();
const editor = new Editor(storage, undoManager);

// Create document
const doc = editor.createDocument();

// Execute commands (extensible)
const insertCmd = new InsertCommand(doc, "Hello ");
undoManager.executeCommand(insertCmd);

// Format text (swappable)
const formatter = new BoldFormatter();
editor.applyFormatter(formatter, 0, 5);

// Save (swappable storage)
await editor.save(doc);

// Undo operations
undoManager.undo();
```

---

## Common Pitfalls to Avoid

1. **Not using interfaces**: Always program to interfaces, not implementations
2. **God classes**: Don't let one class do too much
3. **Tight coupling**: Inject dependencies, don't instantiate directly
4. **Ignoring LSP**: Ensure all implementations truly can substitute for base type
5. **Large interfaces**: Keep interfaces focused and minimal
6. **Missing abstraction**: Create abstractions early for customization points

---

## Resources for Reference

- **SOLID Principles**: Martin, R. C. (Clean Code)
- **Design Patterns**: Gang of Four (Design Patterns book)
- **Command Pattern**: Excellent for undo/redo systems
- **Observer Pattern**: For reactive updates
- **Strategy Pattern**: For swappable algorithms (formatting, export)

