import { EventTarget } from "./EventTarget";
declare const EVENT_DATA_SYMBOL: unique symbol;
declare type HanderFn = (...args: unknown[]) => void;
declare type EventListenerData = {
    eventNames: string[];
    handlerFn: HanderFn;
};
declare type DecoratedEventTarget<T extends EventTarget<any>> = T & {
    [EVENT_DATA_SYMBOL]: EventListenerData[];
};
/**
 * Decorator to add an listener to a EventTarget method.
 */
export declare function listen<Target extends EventTarget<any>, TargetWithData extends DecoratedEventTarget<Target>, TargetEventType extends Target extends EventTarget<infer Type> ? Type : never, EventName extends keyof TargetEventType & string, Callback extends (...args: TargetEventType[EventName]) => void>(...eventNames: EventName[]): (target: Target, propertyKey: string, descriptor: TypedPropertyDescriptor<Callback>) => void;
export declare function registerDecoratorListeners<T extends EventTarget<any>>(eventTarget: T): void;
export {};
