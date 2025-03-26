import { Deserializable } from "../interfaces/deserializable";


export class Faq implements Deserializable {
	id?: number;
	question?: string;
	answer?: string;
	certificate_id?: number;
	is_multiple_answer?: boolean;
	created_by?: number;
	updated_by?: number;
	created_at?: string;
	updated_at?: string;

	deserialize(input: any): this {
		Object.assign(this, input);

		if (input.answers) {
			this.answer = input.answers[0].answer;
		}
		return this;
	}

	toOdata(): Object {
		return {
			...this,
			created_at: undefined,
			updated_at: undefined,
		};
	}
}
