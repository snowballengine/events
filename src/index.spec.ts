import { EventHandler, EventTarget, listen } from "./index";

type Events = { change: [data: number]; mutate: [thing: number] };

describe("events", () => {
    const expected = Math.random();

    it("should add and remove listener from an EventTarget and dispatch events", () => {
        class TestEventTarget extends EventTarget<Events> {}
        const instance = new TestEventTarget();

        const fn = jest.fn();
        const handler = new EventHandler(fn);

        instance.addListener("change", handler);
        expect(fn).toBeCalledTimes(0);

        instance.dispatchEvent("change", expected);
        expect(fn).toBeCalledTimes(1);
        expect(fn).toBeCalledWith(expected);

        instance.removeListener("change", handler);

        instance.dispatchEvent("change", expected);
        expect(fn).toBeCalledTimes(1);
    });

    it("should add a listener using the 'listen' decorator", () => {
        const fn = jest.fn();

        class TestEventTarget extends EventTarget<Events> {
            @listen()
            @listen("mutate")
            onChange(data: number) {
                fn(data);
            }
        }

        const instance = new TestEventTarget();
        expect(fn).toBeCalledTimes(0);

        instance.dispatchEvent("change", expected);
        expect(fn).toBeCalledTimes(1);
        expect(fn).toBeCalledWith(expected);

        instance.dispatchEvent("mutate", expected);
        expect(fn).toBeCalledTimes(2);
    });
});
