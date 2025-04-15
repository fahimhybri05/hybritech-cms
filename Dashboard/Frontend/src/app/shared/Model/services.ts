import { Deserializable } from '@app/shared/interfaces/deserializable';

export class Services implements Deserializable {
  id?: number;
  title: string = '';
  description: string = '';
  image_path: string = '';
  created_at?: string;
  updated_at?: string;

  deserialize(input: any): this {
    if (input) {
      Object.assign(this, input);
    }
    return this;
  }

  toOdata(): Object {
    return {
      ...this,
      created_at: undefined,
      updated_at: undefined,
    };
  }
}
