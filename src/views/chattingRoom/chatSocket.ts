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
  data: Record<string, any>;
}

interface RequestType {
  event: string;
  requestId: string;
  data: Record<string, any>;
}

interface ResponseType {
  code: string;
  requestId?: string;
  status?: string;
  msg?: string;
  event?: string;
  data: Record<string, any>;
}

interface PushType {
  event: string;
  data: Record<string, any>;
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

class SocketClient extends EventCenter<{
  [key: string]: PushType['data'];
  // request: RequestType['data'] | SendType['data'];
}> {
  protected config: SocketConfig | undefined;
  protected socket: Socket;
  protected callbacks: Map<string, PromiseWithResolvers<ResponseType>> = new Map();
  constructor(config?: SocketConfig | undefined) {
    super();
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
    this.socket.on('respond', this.respond.bind(this));
    this.socket.on('push', this.push.bind(this));
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
  public send(eventName: string, data: SendType['data'], ...args: any[]): void {
    this.socket.emit('request', {
      event: eventName,
      data: data,
    } as SendType);
  }
  /**
   * 发送双向消息
   * 类http请求，即有请求有相应
   * @param eventName 事件名称
   * @param ...args 事件参数
   * @return Promise<ResponseType> 返回一个Promise<ResponseType>
   */
  public request(
    eventName: string,
    data: RequestType['data'],
    ...args: any[]
  ): Promise<ResponseType> {
    const currentRequestId = generateRequestId();
    const { promise, resolve, reject } = Promise.withResolvers<ResponseType>();
    this.socket.emit('request', {
      event: eventName,
      requestId: currentRequestId,
      data: data,
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
