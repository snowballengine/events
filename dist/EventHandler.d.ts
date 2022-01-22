/** @category Utility */
export declare class EventHandler<Args extends unknown[], Handler extends (...args: Args) => void = (...args: Args) => void> {
    private static _nextID;
    readonly id: string;
    readonly handler: Handler;
    /**
     * Stores a callback and an identifier.
     * For use on an EventTarget.
     * An instance can be used multiple times and on different EventTargets.
     */
    constructor(handler: Handler, bindScope?: ThisParameterType<Handler>);
}
