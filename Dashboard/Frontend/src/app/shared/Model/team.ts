import { Deserializable } from '@app/shared/interfaces/deserializable';

export class Team implements Deserializable {
  id?: number;
  name?: string;
  designation?: string;
  created_at?: string | Date;
  is_active?: boolean =true;
  imageUrl?: string;
   media?: { original_url: string }[];
  constructor(data?: Partial<Team>) {
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
    ...this,
    media: undefined, 
    deserialize: undefined, 
  };
}
}
