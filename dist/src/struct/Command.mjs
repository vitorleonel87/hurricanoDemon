import { CommandError } from "./CommandError.mjs";
export class Command {
    name;
    description;
    aliases = [];
    cooldown;
    type;
    path;
    client;
    constructor(client, options) {
        Command.validateOptions(client, options);
        const { name, description, aliases, cooldown, type, path } = options;
        this.client = client;
        this.name = name;
        this.description = description;
        if (aliases)
            for (const ali of aliases) {
                this.aliases.push(ali);
                this.client.commands.aliases.set(ali, name);
            }
        this.cooldown = cooldown ?? 3;
        if (type)
            this.type = type;
        if (path)
            this.path = path;
    }
    setPath(path, OnlyIfExists) {
        if (OnlyIfExists)
            this.path ??= path;
        else
            this.path = path;
        return true;
    }
    setType(type, OnlyIfExists) {
        if (OnlyIfExists)
            this.type ??= type;
        else
            this.type = type;
        return true;
    }
    static validateOptions(client, { name, description, aliases, type, path }) {
        if (!name)
            throw new CommandError({
                name: "name",
                type: "NoParameter",
                expected: "String",
            });
        if (typeof name !== "string")
            throw new CommandError({
                name: "name	",
                type: "InvalidCommandParameter",
                expected: "String",
                received: name,
            });
        const commandName = name;
        if (!description)
            throw new CommandError({
                name: "description",
                type: "NoParameter",
                expected: "String",
                commandName,
            });
        if (typeof description !== "string")
            throw new CommandError({
                name: "description",
                type: "InvalidCommandParameter",
                expected: "String",
                received: description,
                commandName,
            });
        if (aliases) {
            if (!Array.isArray(aliases))
                throw new CommandError({
                    name: "aliases",
                    type: "InvalidCommandParameter",
                    expected: "Array<string>",
                    received: aliases,
                    commandName,
                });
            for (const ali of aliases)
                if (typeof ali !== "string")
                    throw new CommandError({
                        name: "aliases[0]",
                        type: "InvalidCommandParameter",
                        expected: "String",
                        received: ali,
                        commandName,
                    });
        }
        if (type && typeof type !== "string")
            throw new CommandError({
                name: "type",
                type: "InvalidCommandParameter",
                expected: "String",
                received: type,
                commandName,
            });
        if (path && typeof path !== "string")
            throw new CommandError({
                name: "path",
                type: "InvalidCommandParameter",
                expected: "String",
                received: path,
                commandName,
            });
    }
}
