import { Deserializable } from '@app/shared/interfaces/deserializable';

export class EmailList implements Deserializable {
  id?: number;
  is_email_sent?: boolean;
  name: string = '';
  email: string = '';
  designation: string = '';
  address: string = '';
  interview_date: string | Date = '';
  created_at?: string | Date;
  [key: string]: any;
  constructor(data?: Partial<EmailList>) {
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
      is_email_sent: this.is_email_sent,
      name: this.name,
      email: this.email,
      designation: this.designation,
      address: this.address,
      interview_date: this.interview_date,
      created_at: this.created_at,
    };
  }
}
