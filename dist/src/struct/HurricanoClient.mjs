import { Client } from "eris";
import { CommandManager } from "./CommandManager.mjs";
export class HurricanoClient extends Client {
    commands;
    aliases;
    config;
    constructor({ config }) {
        super(config.token, { intents: 32767 });
        this.commands = new CommandManager({
            client: this,
            path: "./src/commands",
        });
        this.aliases = this.commands.aliases;
        this.config = config;
    }
}
