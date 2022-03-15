/** @category Utility */
class EventHandler {
    /**
     * Stores a callback and an identifier.
     * For use on an EventTarget.
     * An instance can be used multiple times and on different EventTargets.
     */
    constructor(handler, bindScope) {
        this.id = String(EventHandler._nextID++);
        if (bindScope)
            handler = handler.bind(bindScope);
        this.handler = handler;
    }
}
EventHandler._nextID = 0;

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

function __await(v) {
    return this instanceof __await ? (this.v = v, this) : new __await(v);
}

function __asyncGenerator(thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
    function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
}

/** @category Utility */
class EventTarget {
    constructor() {
        this._events = {};
    }
    /**
     * @param eventName A case-sensitive string representing the event type to listen for.
     */
    addListener(eventName, handler) {
        if (!this._events[eventName])
            this._events[eventName] = {};
        this._events[eventName][handler.id] = handler;
    }
    removeListener(eventName, handler) {
        if (this._events[eventName]) {
            delete this._events[eventName][handler.id];
            let counter = 0;
            for (const key in this._events) {
                counter++;
            }
            if (counter === 0)
                delete this._events[eventName];
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
    getAsyncGenerator(eventName) {
        return __asyncGenerator(this, arguments, function* getAsyncGenerator_1() {
            let resolve;
            const handler = new EventHandler((...args) => {
                this.removeListener(eventName, handler);
                resolve(args);
            });
            this.addListener(eventName, handler);
            try {
                while (true) {
                    yield yield __await(yield __await(new Promise((r) => (resolve = r))));
                }
            }
            finally {
                this.removeListener(eventName, handler);
            }
        });
    }
    getEvents() {
        return this._events;
    }
}

export { EventHandler, EventTarget };
