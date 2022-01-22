import { EventHandler } from "./EventHandler";
import { EventType } from "./EventType";
/** @category Utility */
export declare class EventTarget<T extends EventType> {
    private readonly _events;
    constructor();
    /**
     * @param eventName A case-sensitive string representing the event type to listen for.
     */
    addListener<U extends keyof T>(eventName: U, handler: EventHandler<T[U]>): void;
    removeListener<U extends keyof T>(eventName: U, handler: EventHandler<T[U]>): void;
    dispatchEvent<U extends keyof T>(eventName: U, ...args: T[U]): void;
    /**
     * Creates a promise wrapper for an eventhandler.
     * Returns a promise which will resolve when the event is dispatched.
     */
    getEventPromise<U extends keyof T>(eventName: U): Promise<T[U]>;
    getAsyncGenerator<U extends keyof T>(eventName: U): AsyncGenerator<T[U], void, unknown>;
    getEvents(): {
        readonly [U in keyof T]?: {
            readonly [id: number]: Readonly<EventHandler<T[U]>>;
        };
    };
}
