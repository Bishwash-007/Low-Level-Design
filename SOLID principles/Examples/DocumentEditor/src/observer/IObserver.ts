// Observer Pattern - React to document changes
// Decouples document from UI/other listeners

export interface IObserver {
	update(changes: DocumentChanges): void;
}

export interface DocumentChanges {
	type: 'content' | 'metadata';
	timestamp: Date;
	details?: any;
}

export interface IObservable {
	attach(observer: IObserver): void;
	detach(observer: IObserver): void;
	notify(changes: DocumentChanges): void;
}
