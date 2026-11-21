/**
 * SoundcloudMesami command - Queue only the preset SoundCloud links from config
 */
import { BasePresetLinksCommand } from './base/BasePresetLinksCommand.js';

/**
 * SoundcloudMesami command - Play the SoundCloud links in the configured preset list
 */
export class SoundcloudMesamiCommand extends BasePresetLinksCommand {
    public constructor() {
        super({
            name: 'soundcloudmesami',
            descriptionKey: 'commands:CONFIG_SOUNDCLOUDMESAMI_DESCRIPTION',
            usageKey: 'commands:CONFIG_SOUNDCLOUDMESAMI_USAGE',
            platform: 'soundcloud',
        });
    }
}
