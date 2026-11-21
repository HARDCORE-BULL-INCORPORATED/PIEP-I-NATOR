/**
 * Youtubemesami command - Queue only the preset YouTube links from config
 */
import { BasePresetLinksCommand } from './base/BasePresetLinksCommand.js';

/**
 * Youtubemesami command - Play the YouTube links in the configured preset list
 */
export class YoutubemesamiCommand extends BasePresetLinksCommand {
    public constructor() {
        super({
            name: 'youtubemesami',
            descriptionKey: 'commands:CONFIG_YOUTUBEMESAMI_DESCRIPTION',
            usageKey: 'commands:CONFIG_YOUTUBEMESAMI_USAGE',
            platform: 'youtube',
        });
    }
}
