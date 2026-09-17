import path from 'path';
import { fileURLToPath } from 'url';

import { ShardingManager } from 'discord.js';
import * as dotenv from 'dotenv';


export class ShardingController {
    public readonly shardFilePath: string;
    public manager: ShardingManager;

    constructor() {
        dotenv.config({ quiet: true });

        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);

        // Bun runs the TypeScript sources directly, so shards are forked from src/
        this.shardFilePath = path.join(__dirname, './App.ts');

        this.manager = new ShardingManager(this.shardFilePath, {
            token: process.env.BOT_TOKEN
        });
    }


    public async spwan() {
        await this.manager.spawn();
    }
}
