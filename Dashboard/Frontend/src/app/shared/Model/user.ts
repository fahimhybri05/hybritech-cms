import { Deserializable } from '@app/shared/interfaces/deserializable';

export class User implements Deserializable {
  id?: number;
  name?: string;
  full_name: string = '';
  email: string = '';
  password?: string;
  img_url?: string;
  position: string = '';
  created_at?: string | Date;
  [key: string]: any;
  constructor(data?: Partial<User>) {
    if (data) {
      Object.assign(this, data);
    }
  }
  deserialize(input: any): this {
    Object.assign(this, input);

    if (input.name) {
      this.full_name = input.name;
    }

    if (input.created_at) {
      this.created_at = new Date(input.created_at);
    }

    return this;
  }

  serialize(): any {
    return {
      id: this.id,
      full_name: this.full_name,
      email: this.email,
      password: this.password,
      img_url: this.img_url,
      position: this.position,
      created_at: this.created_at,
    };
  }
}
