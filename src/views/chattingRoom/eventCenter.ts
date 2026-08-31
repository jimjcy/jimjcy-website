type Callback = (...args: any[]) => void;

class EventNotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'EventNotFoundError';
  }
}

class EventCenter {
  protected events: Map<string, Callback> = new Map();
  /**
   * 注册一个事件
   * @param eventName 事件名称
   * @param callback 回调函数
   * @returns void
   */
  public on(eventName: string, callback: Callback): void {
    this.events.set(eventName, callback);
  }
  /**
   * 触发事件
   * @param eventName 事件名称
   * @param args 附加参数
   * @returns void
   */
  public emit(eventName: string, ...args: any[]): void {
    if (this.events.has(eventName)) {
      this.events.get(eventName)!(...args);
      return;
    }
    throw new EventNotFoundError(`Event "${eventName}" not found.`);
  }
  /**
   * 注销一个事件
   * @param eventName 事件名称
   * @returns void
   */
  public off(eventName: string): void {
    if (this.events.has(eventName)) {
      this.events.delete(eventName);
      return;
    }
  }
}

export { EventCenter };
