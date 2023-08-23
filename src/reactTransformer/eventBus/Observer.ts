export enum EventType {
  SELECT_WIDGET = "Select_Widget",
  DE_SELECT_WIDGET = "De_Select_Widget",
  //   Canvas_Update = "Canvas_Update",
  PROPS_UPDATE = "Props_Update",
}

class Observer {
  subscribers: any;
  propsUpdateSubscribers: any;
  constructor() {
    this.subscribers = {
      [EventType.SELECT_WIDGET]: [],
      //   [EventType.Canvas_Update]: [],
      //   [EventType.PROPS_UPDATE]: [],
      [EventType.DE_SELECT_WIDGET]: [],
    };

    this.propsUpdateSubscribers = {};
  }

  subscribe(eventType: EventType, fn: Function) {
    this.subscribers[eventType].push(fn);
    // this.subscribers.push(fn);
  }

  clear() {
    this.subscribers = {
      [EventType.SELECT_WIDGET]: [],
      //   [EventType.Canvas_Update]: [],
      [EventType.PROPS_UPDATE]: [],
      [EventType.DE_SELECT_WIDGET]: [],
    };
  }

  notify(eventType: EventType, data: any) {
    this.subscribers[eventType].forEach((fn: Function) => {
      fn(data);
    });
  }
  subscribePropsUpdate(id: string, path: string, fn: Function) {
    if (
      this.propsUpdateSubscribers[`${id}:${path || ""}:propsUpdate`]?.length
    ) {
      this.propsUpdateSubscribers[`${id}:${path || ""}:propsUpdate`].push(fn);
    } else {
      this.propsUpdateSubscribers[`${id}:${path || ""}:propsUpdate`] = [fn];
    }
  }
  notifyPropsUpdate(id: string, widgetPath: string, valuePath, value) {
    this.propsUpdateSubscribers[
      `${id}:${widgetPath || ""}:propsUpdate`
    ]?.forEach((fn: Function) => {
      fn(valuePath, value);
    });
  }

  clearPropsUpdate(id, path) {
    this.propsUpdateSubscribers = {};
  }
}

export default new Observer();
