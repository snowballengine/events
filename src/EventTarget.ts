import { EventHandler } from "./EventHandler";
import { EventType } from "./EventType";
import { registerDecoratorListeners } from "./listen";

export class EventTarget<T extends EventType> {
    private readonly _events: {
        [U in keyof T & string]?: { [id: string]: EventHandler<T[U]> };
    };

    public constructor() {
        this._events = {};

        registerDecoratorListeners<EventTarget<T>>(this);
    }

    public addListener<U extends keyof T & string>(
        eventName: U,
        handler: EventHandler<T[U]>
    ): void {
        this._events[eventName] ??= {};
        (this._events[eventName] as any)[handler.id] = handler;
    }

    public removeListener<U extends keyof T & string>(
        eventName: U,
        handler: EventHandler<T[U]>
    ): void {
        if (this._events[eventName]) {
            delete this._events[eventName]![handler.id];

            if (Object.keys(this._events).length === 0) {
                delete this._events[eventName];
            }
        }
    }

    public dispatchEvent<U extends keyof T & string>(eventName: U, ...args: T[U]): void {
        if (this._events[eventName]) {
            for (const id in this._events[eventName]) {
                this._events[eventName]![id].handler(...args);
            }
        }
    }

    /**
     * Creates a promise wrapper for an eventhandler.
     * Returns a promise which will resolve when the event is dispatched.
     */
    public getEventPromise<U extends keyof T & string>(eventName: U): Promise<T[U]> {
        return new Promise((resolve) => {
            const handler = new EventHandler<T[U]>((...args) => {
                this.removeListener(eventName, handler);
                resolve(args);
            });

            this.addListener(eventName, handler);
        });
    }

    public getEvents(): {
        readonly [U in keyof T & string]?: {
            readonly [id: number]: Readonly<EventHandler<T[U]>>;
        };
    } {
        return this._events;
    }
}
