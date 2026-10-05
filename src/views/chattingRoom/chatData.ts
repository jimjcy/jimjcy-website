import { type ChatRow } from './types';

type HandleConfig = Record<string, (data: any) => any>;
export class DataCenter<DataType extends { [key: string]: any } = Record<string, unknown>> {
  protected data: DataType = {} as DataType;
  protected readonly handles: HandleConfig = {};
  constructor(initData: DataType, handleFunction: HandleConfig) {
    this.data = initData;
    this.handles = handleFunction;
  }
  protected get(keyName: keyof DataType): DataType[keyof DataType] {
    if (this.handles[keyName as string]) {
      return this.handles[keyName as string]!(this.data[keyName]);
    }
    return this.data[keyName];
  }
  protected set(keyName: keyof DataType, value: DataType[keyof DataType]): void {
    this.data[keyName] = value;
  }
}

export class ChatDataCenter extends DataCenter<ChatRow> {}
