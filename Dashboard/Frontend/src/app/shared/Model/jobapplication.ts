import { Deserializable } from '@app/shared/interfaces/deserializable';

export class JobApplication implements Deserializable {
  id?: number;
  is_active?: boolean;
  is_selected?: boolean;
  isemail_sent?: boolean;
  full_name: string = '';
  email: string = '';
  number: string = '';
  designation: string = '';
  experience: string = '';
  selected_at?: string | Date;
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
      is_selected: this.is_selected,
      isemail_sent: this.isemail_sent,
      full_name: this.full_name,
      email: this.email,
      number: this.number,
      designation: this.designation,
      experience: this.experience,
      selected_at: this.selected_at,
      created_at: this.created_at,
    };
  }
}
