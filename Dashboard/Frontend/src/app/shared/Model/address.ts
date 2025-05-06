import { Deserializable } from '@app/shared/interfaces/deserializable';

export class Address implements Deserializable {
  id?: number;
  address: string = '';
  email: string = '';
  phone: string = '';
  created_at?: string;
  updated_at?: string;
  constructor(data?: any) {
    if (data) {
      this.address = data.address || '';
      this.email = data.email || '';
      this.phone = data.phone || '';
    }
  }
  deserialize(input: any): this {
    if (input) {
      Object.assign(this, input);
    }
    return this;
  }

  toOdata(): Object {
    return {
        address: this.address,
        email: this.email,
        phone: this.phone,
      created_at: undefined,
      updated_at: undefined,
    };
  }
}
