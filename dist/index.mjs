class EventHandler {
    /**
     * Stores a callback and an identifier.
     * For use on an EventTarget.
     * An instance can be used multiple times and on different EventTargets.
     */
    constructor(handler, bindScope) {
        this.id = String(EventHandler._nextID++);
        this.handler = bindScope ? handler.bind(bindScope) : handler;
    }
}
EventHandler._nextID = 0;

const EVENT_DATA_SYMBOL = Symbol("eventData");
/**
 * Decorator to add an listener to a EventTarget method.
 */
function listen(...eventNames) {
    return function (target, propertyKey, descriptor) {
        var _a;
        var _b;
        const handlerFn = descriptor.value;
        if (!eventNames.length) {
            if (propertyKey.slice(0, 2) === "on") {
                const cen = propertyKey.slice(2);
                eventNames = [(cen[0].toLowerCase() + cen.slice(1))];
            }
            else {
                throw new Error("no eventName provided");
            }
        }
        (_a = (_b = target)[EVENT_DATA_SYMBOL]) !== null && _a !== void 0 ? _a : (_b[EVENT_DATA_SYMBOL] = []);
        target[EVENT_DATA_SYMBOL].push({ eventNames, handlerFn });
    };
}
function registerDecoratorListeners(eventTarget) {
    for (const { eventNames, handlerFn } of eventTarget[EVENT_DATA_SYMBOL]) {
        const handler = new EventHandler(handlerFn, eventTarget);
        for (const eventName of eventNames) {
            eventTarget.addListener(eventName, handler);
        }
    }
}

class EventTarget {
    constructor() {
        this._events = {};
        registerDecoratorListeners(this);
    }
    addListener(eventName, handler) {
        var _a;
        var _b;
        (_a = (_b = this._events)[eventName]) !== null && _a !== void 0 ? _a : (_b[eventName] = {});
        this._events[eventName][handler.id] = handler;
    }
    removeListener(eventName, handler) {
        if (this._events[eventName]) {
            delete this._events[eventName][handler.id];
            let counter = 0;
            for (const key in this._events) {
                counter++;
            }
            if (counter === 0) {
                delete this._events[eventName];
            }
        }
    }
    dispatchEvent(eventName, ...args) {
        if (this._events[eventName]) {
            for (const id in this._events[eventName]) {
                this._events[eventName][id].handler(...args);
            }
        }
    }
    /**
     * Creates a promise wrapper for an eventhandler.
     * Returns a promise which will resolve when the event is dispatched.
     */
    getEventPromise(eventName) {
        return new Promise((resolve) => {
            const handler = new EventHandler((...args) => {
                this.removeListener(eventName, handler);
                resolve(args);
            });
            this.addListener(eventName, handler);
        });
    }
    getEvents() {
        return this._events;
    }
}

export { EventHandler, EventTarget, listen };
