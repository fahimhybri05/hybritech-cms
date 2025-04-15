import { Deserializable } from '@app/shared/interfaces/deserializable';

export class Services implements Deserializable {
  id?: number;
  title: string = '';
  description: string = '';
  imageUrl?: string;
  media?: { original_url: string }[];
  created_at?: string;
  updated_at?: string;

  deserialize(input: any): this {
    if (input) {
      Object.assign(this, input);
    }
    if (this.media && this.media.length > 0) {
      this.imageUrl = this.media[0].original_url;
    }
    return this;
  }

  toOdata(): Object {
    return {
      ...this,
      imageUrl: undefined,
      media: undefined,
      created_at: undefined,
      updated_at: undefined,
    };
  }
}
