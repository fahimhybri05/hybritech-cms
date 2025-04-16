import { Deserializable } from '@app/shared/interfaces/deserializable';

export class JobApplication implements Deserializable {
  id?: number;
  is_active?: boolean;
  full_name: string = '';
  email: string = '';
  number: string = '';
  designation: string = '';
  experience: string = '';
  created_at?: string | Date;
  [key: string]: any;
  constructor(data?: Partial<JobApplication>) {
    if (data) {
      Object.assign(this, data);
    }
  }
  deserialize(input: any): this {
    Object.assign(this, input);

    if (input.created_at) {
      this.created_at = new Date(input.created_at);
    }

    return this;
  }

  serialize(): any {
    return {
      id: this.id,
      is_active: this.is_active,
      full_name: this.full_name,
      email: this.email,
      number: this.number,
      designation: this.designation,
      experience: this.experience,
      created_at: this.created_at,
    };
  }
}
