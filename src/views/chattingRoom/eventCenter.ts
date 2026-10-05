type EventCallback<E, T> = (eventName: E, data: T) => void;

class EventNotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'EventNotFoundError';
  }
}

class EventCenter<T extends { [key: string]: unknown } = Record<string, unknown>> {
  protected events: {
    [key in keyof T]?: EventCallback<key, T[key]>[];
  } = {};
  /**
   * 注册一个事件
   * @param eventName 事件名称
   * @param callback 回调函数
   * @returns void
   */
  public on<E extends keyof T>(eventName: E, callback: EventCallback<E, T[E]>): ()=>void {
    if (!this.events[eventName]) {
      this.events[eventName] = [];
    }
    this.events[eventName].push(callback);
    return () => {
      this.off(eventName, callback);
    }
  }
  /**
   * 触发事件
   * @param eventName 事件名称
   * @param args 附加参数
   * @returns void
   */
  public emit<E extends keyof T>(eventName: E, data: T[E]): void { 
    if (this.events[eventName]) {
      this.events[eventName].forEach(callback => callback(eventName, data));
      return;
    }
    throw new EventNotFoundError(`Event "${String(eventName)}" not found.`);
  }
  /**
   * 注销一个事件
   * @param eventName 事件名称
   * @returns void
   */
  public off<E extends keyof T>(eventName: E, callback: EventCallback<E, T[E]>): void {
    if (this.events[eventName]) {
      this.events[eventName] = this.events[eventName]!.filter(cb => cb !== callback);
      return;
    }
  }
}

export { EventCenter };
