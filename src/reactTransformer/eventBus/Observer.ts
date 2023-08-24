export enum EventType {
  SELECT_WIDGET = "Select_Widget",
  DE_SELECT_WIDGET = "De_Select_Widget",
  FILL_WIDGET = "Fill_Widget",
}

class Observer {
  subscribers: any;
  propsUpdateSubscribers: any;
  constructor() {
    this.subscribers = {
      [EventType.SELECT_WIDGET]: [],
      [EventType.DE_SELECT_WIDGET]: [],
      [EventType.FILL_WIDGET]: [],
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
  notifyPropsUpdate(
    id: string,
    widgetPath: string,
    newProps: any,
    info?: { path: string; value: any }
  ) {
    this.propsUpdateSubscribers[
      `${id}:${widgetPath || ""}:propsUpdate`
    ]?.forEach((fn: Function) => {
      fn(newProps, info);
    });
  }

  clearPropsUpdate() {
    this.propsUpdateSubscribers = {};
  }
}

export default new Observer();
