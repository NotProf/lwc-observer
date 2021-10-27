let observer;
let replyObserver;

function getObserverInstance() {
  if (!observer) {
    observer = new Observer();
  }

  return observer;
}

function getReplyObserverInstance() {
  if (!replyObserver) {
    replyObserver = new ReplyObserver();
  }

  return replyObserver;
}

class Observer {

  #subscribers = [];
  #eventMap = new Map();

  subscribe(eventName, callback = () => {
  }, error = () => {
  }) {
    try {
      const subscriber = new Subscriber(++this.#subscribers.length, callback);
      this.#saveEventSubscriber(eventName, subscriber);
      return subscriber;
    } catch (e) {
      error(e);
    }
  }

  publish(eventName, data = undefined) {
    this.#eventMap.get(eventName)?.forEach((subscriber) => {
      subscriber.callback(data);
    });
  }

  unsubscribe(subscriber) {
    this.#subscribers = this.#subscribers.filter((item) => item.id !== subscriber?.id);
  }

  #saveEventSubscriber = (eventName, subscriber) => {
    try {
      const event = this.#eventMap.get(eventName);
      console.log(event);

      if (event) {
        event.push(subscriber);
        return;
      }
      this.#eventMap.set(eventName, [subscriber]);
      console.log(this.#eventMap);
    } catch (e) {
      console.log(e);
    }
  }
}

class ReplyObserver extends Observer {
  #savedActions = [];

  publish(data = undefined) {
    super.publish(data);
    this.#savedActions.push(data);
  }

  subscribe(eventName,callback) {
    this.#playAllActions(callback);
    return super.subscribe(eventName, callback);
  }

  clearActions() {
    this.#savedActions = [];
  }

  #playAllActions = (callback) => {
    this.#savedActions.forEach((data) => {
      callback(data);
    });
  };
}

class Subscriber {
  id;
  callback;

  constructor(id, callback) {
    this.id = id;
    this.callback = callback;
  }
}

export { getReplyObserverInstance, getObserverInstance };
