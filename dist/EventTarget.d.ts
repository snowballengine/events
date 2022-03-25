import { EventHandler } from "./EventHandler";
import { EventType } from "./EventType";
export declare class EventTarget<T extends EventType> {
    private readonly _events;
    constructor();
    addListener<U extends keyof T & string>(eventName: U, handler: EventHandler<T[U]>): void;
    removeListener<U extends keyof T & string>(eventName: U, handler: EventHandler<T[U]>): void;
    dispatchEvent<U extends keyof T & string>(eventName: U, ...args: T[U]): void;
    /**
     * Creates a promise wrapper for an eventhandler.
     * Returns a promise which will resolve when the event is dispatched.
     */
    getEventPromise<U extends keyof T & string>(eventName: U): Promise<T[U]>;
    getEvents(): {
        readonly [U in keyof T & string]?: {
            readonly [id: number]: Readonly<EventHandler<T[U]>>;
        };
    };
}
