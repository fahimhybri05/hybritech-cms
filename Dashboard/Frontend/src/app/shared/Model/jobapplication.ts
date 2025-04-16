
import { Deserializable } from '@app/shared/interfaces/deserializable';

export class JobApplication implements Deserializable {

  id: number;
  is_active: boolean;
  full_name: string;
  email: string;
  number: string;
  designation: string;
  experience: string;
  created_at: string; // Keep as string (API returns ISO format)

  constructor(data: any = {}) {
    this.id = data.id || 0;
    this.is_active = Boolean(data.is_active);
    this.full_name = data.full_name || '';
    this.email = data.email || '';
    this.number = data.number || '';
    this.designation = data.designation || '';
    this.experience = data.experience || '';
    this.created_at = data.created_at || new Date().toISOString();
  }

  // Simple deserialize method for table compatibility




  // Simple deserialize method that matches what your table expects
  deserialize(input: any): this {
    Object.assign(this, input);
    return this;
  }
}