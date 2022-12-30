class EventEmitter {
    constructor() {
        this._events = {};
    }

    emit(type, payload) {
        process.nextTick(() => {
            if (!this._events[type]) return;

            this._events[type].forEach(callback => {
                callback(payload);
            });
        })
    }

    removeListener(event, handler) {
        process.nextTick(() => {
            if (!this._events[event]) return;

            this._events[event] = this._events[event].filter(_handler => _handler !== handler);
        });
    }

    on(type, handler) {
        process.nextTick(() => {
            if (!this._events[type]) {
                this._events[type] = [];
            }

            this._events[type].push(handler);
        })
    }
}
const globalEventBus = new EventEmitter();

const handler = (payload) => {
    console.log(payload.key);
};

globalEventBus.on("event_1", handler);

globalEventBus.emit("event_1", { key: "value" });

globalEventBus.removeListener("event_1", handler);

globalEventBus.emit("event_1", { key: "value" });
