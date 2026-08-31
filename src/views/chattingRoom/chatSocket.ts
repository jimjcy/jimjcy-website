import { io, Socket } from 'socket.io-client';
import { EventCenter } from './eventCenter';

type Callback = (...args: any[]) => void;

interface SocketConfig {
  addr: string;
  path: string;
  successCode?: string[];
  failCode?: string[];
}

interface SendType {
  event: string;
  data: Record<any, any>;
}

interface RequestType {
  event: string;
  requestId: string;
  data: Record<any, any>;
}

interface ResponseType {
  code: string;
  requestId?: string;
  status?: string;
  msg?: string;
  event?: string;
  data: Record<any, any>;
}

interface PushType {
  event: string;
  data: Record<any, any>;
}

function generateRequestId(): string {
  return +Date.now().toString(36) + Math.random().toString(36).substring(2, 15);
}

class UnknownCodeError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'UnknownCodeError';
  }
}

class SocketClient {
  protected config: SocketConfig | undefined;
  protected socket: Socket;
  protected callbacks: Map<string, PromiseWithResolvers<ResponseType>> = new Map();
  protected eventCenter: EventCenter = new EventCenter();
  constructor(config?: SocketConfig | undefined) {
    this.config = config;
    this.socket = io(config?.addr || '', {
      path: config?.path || '/socket.io',
      transports: ['websocket'],
    });
  }
  /**
   * 连接
   */
  public connect(): void {
    this.socket.connect();
    this.socket.on('respond', this.respond);
    this.socket.on('push', this.push);
  }
  /**
   * 断连
   */
  public disconnect(): void {
    this.socket.removeAllListeners();
    this.socket.disconnect();
  }
  /**
   * 连接状态
   */
  public get isConnect(): boolean {
    return this.socket.connected;
  }
  /**
   * 发送单向消息
   * @param eventName 事件名称
   * @param ...args 事件参数
   */
  public send(eventName: string, ...args: any[]): void {
    this.socket.emit('request', {
      event: eventName,
      data: args,
    } as SendType);
  }
  /**
   * 发送双向消息
   * 类http请求，即有请求有相应
   * @param eventName 事件名称
   * @param ...args 事件参数
   * @return Promise<ResponseType> 返回一个Promise<ResponseType>
   */
  public request(eventName: string, ...args: any[]): Promise<ResponseType> {
    const currentRequestId = generateRequestId();
    const { promise, resolve, reject } = Promise.withResolvers<ResponseType>();
    this.socket.emit('request', {
      event: eventName,
      requestId: currentRequestId,
      data: args,
    } as RequestType);
    this.callbacks.set(currentRequestId, { promise, resolve, reject });
    return promise;
  }
  /**
   * 响应请求
   */
  protected respond(response: ResponseType): void {
    const { code, status, msg, event, requestId, data } = response;
    const { promise, resolve, reject } = this.callbacks.get(requestId!)!;
    if (this.config?.successCode?.findIndex(() => code) !== -1) {
      resolve(response);
    } else if (this.config?.failCode?.findIndex(() => code) !== -1) {
      reject(response);
    } else {
      reject(response);
      throw new UnknownCodeError(`Unknown code: ${code}`);
    }
  }
  /**
   * 同事件中心
   */
  public on(eventName: string, callback: Callback): void {
    this.eventCenter.on(eventName, callback);
  }
  /**
   * 同事件中心
   */
  public off(eventName: string): void {
    this.eventCenter.off(eventName);
  }
  /**
   * 同事件中心
   */
  protected emit(eventName: string, ...args: any[]): void {
    this.eventCenter.emit(eventName, ...args);
  }
  /**
   * 推送消息
   */
  protected push(result: PushType): void {
    const { event, data } = result;
    this.emit(event, data);
  }
}

export {
  SocketClient,
  type Callback,
  type SocketConfig,
  type SendType,
  type RequestType,
  type ResponseType,
  type PushType,
};
