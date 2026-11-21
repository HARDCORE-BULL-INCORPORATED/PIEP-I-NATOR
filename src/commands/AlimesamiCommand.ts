/**
 * Alimesami command - Queue all preset links from config with one command
 */
import { BasePresetLinksCommand } from "./base/BasePresetLinksCommand.js";

/**
 * Alimesami command - Play every link in the configured preset list
 */
export class AlimesamiCommand extends BasePresetLinksCommand {
    public constructor() {
        super({
            name: "alimesami",
            descriptionKey: "commands:CONFIG_ALIMESAMI_DESCRIPTION",
            usageKey: "commands:CONFIG_ALIMESAMI_USAGE",
        });
    }
}
