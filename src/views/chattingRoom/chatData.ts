import { type ChatRow } from './types';

type HandleConfig = Record<string, (data: any) => any>;
export class DataCenter<DataType extends { [key: string]: any } = Record<string, unknown>> {
  protected storageData: DataType = {} as DataType;
  protected readonly handles: HandleConfig = {};
  constructor(initData: DataType, handleFunction: HandleConfig) {
    this.storageData = initData;
    this.handles = handleFunction;
  }
  protected get<K extends keyof DataType | keyof HandleConfig>(keyName: K): DataType[K] {
    if (this.handles[keyName as string]) {
      return this.handles[keyName as string]!(this.storageData[keyName]);
    }
    return this.storageData[keyName];
  }
  protected set<K extends keyof DataType | keyof HandleConfig>(
    keyName: K,
    value: DataType[K],
  ): void {
    this.storageData[keyName] = value;
  }
}

export class ChatDataCenter extends DataCenter<ChatRow> {
  get id(): number {
    return this.get('id');
  }
  get username(): string {
    return this.get('username');
  }
  get type(): string {
    return this.get('type');
  }
  get content(): string {
    return this.get('content');
  }
  get date(): string {
    return this.get('date');
  }
  get day(): string {
    return this.date.split(' ')[0]!;
  }
  get time(): string {
    return this.date.split(' ')[1]!;
  }
}
