import {
	registerDecorator,
	type ValidationArguments,
	type ValidationOptions,
} from "class-validator";
import { parseEmoji } from "discord.js";
import { EmojiError } from "@/common/errors/Emoji.error";

export function IsEmoji(validationOptions?: ValidationOptions) {
	// biome-ignore lint/complexity/noBannedTypes: ~
	return (object: Object, propertyName: string) => {
		registerDecorator({
			name: "isEmoji",
			target: object.constructor,
			propertyName: propertyName,
			constraints: [propertyName],
			options: validationOptions,
			validator: {
				validate(_value: string, args: ValidationArguments) {
					const [relatedPropertyName] = args.constraints;
					const relatedValue = args.object[relatedPropertyName] as string;

					if (!validateEmoji(relatedValue)) {
						throw new EmojiError();
					}

					return true;
				},
			},
		});
	};
}

function validateEmoji(emoji: string) {
	if (parseEmoji(emoji).id) return true;

	return /\p{Extended_Pictographic}/u.test(emoji);
}
