import { EventTarget } from "./EventTarget";
import { EventHandler } from "./EventHandler";

const EVENT_DATA_SYMBOL: unique symbol = Symbol("eventData");

type HanderFn = (...args: unknown[]) => void;
type EventListenerData = {
    eventNames: string[];
    handlerFn: HanderFn;
};
type DecoratedEventTarget<T extends EventTarget<any>> = T & {
    [EVENT_DATA_SYMBOL]: EventListenerData[];
};

/**
 * Decorator to add an listener to a EventTarget method.
 */
export function listen<
    Target extends EventTarget<any>,
    TargetWithData extends DecoratedEventTarget<Target>,
    TargetEventType extends Target extends EventTarget<infer Type> ? Type : never,
    EventName extends keyof TargetEventType & string,
    Callback extends (...args: TargetEventType[EventName]) => void
>(...eventNames: EventName[]) {
    return function (
        target: Target,
        propertyKey: string,
        descriptor: TypedPropertyDescriptor<Callback>
    ) {
        const handlerFn: HanderFn = descriptor.value!;

        if (!eventNames.length) {
            if (propertyKey.slice(0, 2) === "on") {
                const cen = propertyKey.slice(2);
                eventNames = [(cen[0].toLowerCase() + cen.slice(1)) as EventName];
            } else {
                throw new Error("no eventName provided");
            }
        }

        (target as TargetWithData)[EVENT_DATA_SYMBOL] ??= [];
        (target as TargetWithData)[EVENT_DATA_SYMBOL].push({ eventNames, handlerFn });
    };
}

export function registerDecoratorListeners<T extends EventTarget<any>>(eventTarget: T) {
    for (const { eventNames, handlerFn } of (eventTarget as DecoratedEventTarget<T>)[
        EVENT_DATA_SYMBOL
    ]) {
        const handler = new EventHandler(handlerFn, eventTarget);

        for (const eventName of eventNames) {
            eventTarget.addListener(eventName, handler);
        }
    }
}
