import type { Message, Guild, Channel } from "eris";
import Yargs, { Argv } from "yargs";
import type {
	ArgumentOptions,
	ArgumentResolver,
	ArgumentContent,
	ArgumentFlags,
} from "../types/index.mjs";
import { DefaultArgumentParsers } from "./index.mjs";
import { HurricanoClient } from "../struct/index.mjs";
import { Regexes } from "../util/index.mjs";

const { CodeBlocks, UnescapedQuotes } = Regexes;

export class Arguments {
	public yargs!: Argv;
	public content: ArgumentContent;
	public parsers!: ArgumentOptions["parsers"];
	public flags!: Record<string, ArgumentFlags>;
	public client!: HurricanoClient;
	public message!: Message;
	public guild?: Guild;
	public flagTypes!: Record<string, string>;
	public channel!: Channel;
	private promise!: Promise<void>;

	public constructor({
		content,
		parsers,
		client,
		message,
		guild,
		flagTypes = {},
		channel,
	}: ArgumentOptions) {
		Object.defineProperties(this, {
			yargs: {
				enumerable: false,
				value: Yargs(),
			},
			client: {
				enumerable: false,
				value: client,
			},
			parsers: {
				enumerable: false,
				value: this.makeParsers(parsers),
			},
			message: {
				enumerable: false,
				value: message,
			},
			guild: {
				enumerable: false,
				value: guild,
			},
			flagTypes: {
				enumerable: false,
				value: flagTypes,
			},
			channel: {
				enumerable: false,
				value: channel,
			},
		});

		const parsed = this.yargs.parseSync(
			// eslint-disable-next-line quotes
			content.replace(CodeBlocks, '"$1$2"'),
		);

		this.content = parsed["_"].map((x) =>
			String(x).replace(new RegExp(UnescapedQuotes, "g"), "$0"),
		) as any as ArgumentContent;

		Object.defineProperty(this.content, "raw", {
			enumerable: false,
			value: content,
		});

		Object.defineProperty(this, "promise", {
			enumerable: false,
			value: new Promise<void>(async (resolve) => {
				await this.makeFlags(
					Object.fromEntries(
						Object.keys(parsed)
							.filter((x) => !["$0", "_"].includes(x))
							.map((x) => [x, String(parsed[x])]),
					) as Record<string, string>,
				);

				resolve();
			}),
		});
	}
	private makeParsers(otherParsers?: ArgumentOptions["parsers"]) {
		const parsers: Record<string, typeof ArgumentResolver> =
			otherParsers ?? {};

		for (const defaultParser of Object.keys(DefaultArgumentParsers))
			parsers[defaultParser] ??= DefaultArgumentParsers[defaultParser];

		return parsers;
	}
	private async makeFlags(obj: Record<string, string>): Promise<void> {
		const flags: Record<string, any> = {};

		for (const key of Object.keys(obj)) {
			if (!(key in this.flagTypes)) {
				flags[key] = obj[key];

				continue;
			}

			flags[key] = {
				name: key,
				value: await this.parsers![this.flagTypes[key]]({
					arg: obj[key],
					content: this.content.raw,
					flagTypes: this.flagTypes,
					message: this.message,
					guild: this.guild as undefined,
					client: this.client,
					channel: this.channel,
				}),
			};
		}

		this.flags = flags;
	}
	public wait(): Promise<void> {
		return this.promise;
	}
	public async pick<T>(
		type: string,
		{ fetch }: { fetch?: boolean },
	): Promise<T | null> {
		const parser = this.parsers![type]!;

		for (const arg of this.content) {
			const value = await parser({
				arg,
				content: this.content.raw,
				flagTypes: this.flagTypes,
				message: this.message,
				guild: this.guild as undefined,
				client: this.client,
				channel: this.channel,
				fetch,
			});

			if (value?.constructor.name === "False") return value;
		}

		return null;
	}
}
