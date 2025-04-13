import { Deserializable } from '@app/shared/interfaces/deserializable';

export class Forms implements Deserializable {
  id?: number;
  title: string = '';
  is_read: boolean = false;
  full_name: string = '';
  email: string = '';
  number: string = '';
  subject: string = '';
  description: string = '';
  project_name: string = ''; 
  project_type: string = ''; 
  project_budget: string = ''; 
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
      is_read: this.is_read,
      id: this.id,
      title: undefined,
      full_name: undefined,
      email: undefined,
      number: undefined,
      subject: undefined,
      description: undefined,
      project_name: undefined,
      project_type: undefined,
      project_budget: undefined,
      created_at: undefined,
      updated_at: undefined,
    };
  }
}
