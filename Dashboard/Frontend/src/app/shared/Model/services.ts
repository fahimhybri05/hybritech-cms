import { Deserializable } from '@app/shared/interfaces/deserializable';

export class Services implements Deserializable {
  id?: number;
  title?: string;
  description?: string;
  created_at?: string | Date;
  is_active?: boolean;
	imageUrl?: string;
	media?: { original_url: string }[];
  constructor(data?: Partial<Services>) {
    if (data) {
      Object.assign(this, data);
    }
  }
  deserialize(input: any): this {
    Object.assign(this, input);

    if (input.created_at) {
      this.created_at = new Date(input.created_at);
    }
    if (this.media && this.media.length > 0) {
      this.imageUrl = this.media[0].original_url;
    }
    return this;
  }

  serialize(): any {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      created_at: this.created_at,
      is_active: this.is_active,
      imageUrl: this.imageUrl
    };
  }
}
