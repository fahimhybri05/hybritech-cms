// import { Deserializable } from '@app/shared/interfaces/deserializable';

// export class Role implements Deserializable {
//   id?: number;
//   name?: string;
//   guard_name?:string;
//   created_at?: string;
//   updated_at?: string;

//   deserialize(input: any): this {
//     if (input) {
//       Object.assign(this, input);
//     }
//     return this;
//   }

//   toOdata(): Object {
//     return {
//       ...this,
//       created_at: undefined,
//       updated_at: undefined,
//     };
//   }
// }

import { Deserializable } from '@app/shared/interfaces/deserializable';

// Define the Permission interface if it's not in a global types file
// It's good to define it where it's primarily used or in a shared types file.
// Assuming you have it already in rolelist.component.ts, let's keep it here for completeness
export interface Permission {
  id: number;
  name: string;
  guard_name: string;
  created_at: string;
  updated_at: string;
  pivot?: {
    role_id: number;
    permission_id: number;
  };
}

export class Role implements Deserializable {
  id?: number;
  name?: string;
  guard_name?: string;
  created_at?: string;
  updated_at?: string;
  // *** ADD THE PERMISSIONS PROPERTY HERE ***
  permissions?: Permission[]; // Make it an array of Permission objects, optional

  deserialize(input: any): this {
    if (input) {
      Object.assign(this, input);
      // If permissions also need deserialization into Permission class instances
      // (not just plain objects), you'd do more here.
      // For now, Object.assign will work if permissions are just plain objects.
      if (input.permissions && Array.isArray(input.permissions)) {
        this.permissions = input.permissions.map((p: any) => p as Permission);
      }
    }
    return this;
  }

  toOdata(): Object {
    return {
      ...this,
      created_at: undefined,
      updated_at: undefined,
      permissions: undefined, // Don't send permissions back in toOdata if not needed
    };
  }
}