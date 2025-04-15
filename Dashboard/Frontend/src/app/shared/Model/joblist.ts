import { Deserializable } from '@app/shared/interfaces/deserializable';

export class Joblist implements Deserializable {
  id?: number;
  title: string = '';
  header_description: string = '';
  job_description: string = '';
  is_active: boolean = false;
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
