import { ActivityType, ClientPresenceStatus } from 'discord.js';
import { LoginType, DJModeEnum, AdminModeEnum } from '../@types/index.js';


/**
 * Constants variables
 */
export const cst = {
    // Default config
    config: {
        bot: {
            textCommand             : true,                 // Whether to enable text command
            slashCommand            : true,                 // Whether to enable slash command
    
            /**
             * DYNAMIC mode: Server Administrator or Manage Guild permissions are checked dynamically
             * STATIC mode: Admin is determined by the config file (admin array)
             */
            adminMode               : AdminModeEnum.DYNAMIC,// Admin mode: 'STATIC' (config.js based) or 'DYNAMIC' (Discord Administrator/Manage Guild permission based)
            // OAUTH2 mode requires setting 'admin', 'clientSecret' value
            admin                   : [],                   // Admin users, It must be the user ID (string[])


            /**
             * DYNAMIC mode: The first user to execute a command becomes the DJ
             * STATIC mode: The DJ is determined by the config file
             */
            djMode                  : DJModeEnum.DYNAMIC,   // DJ mode: 'STATIC' (config.js based) or 'DYNAMIC' (first user to execute command based)
            dj                      : [],                   // DJ users, It must be the user ID (string[])
            djRoleId                : null,                 // DJ role ID, members with this role have DJ permissions
            djLeave: {
                mode: 'PLAY',       // 'PLAY' = next DJ on successful /play; 'COOLDOWN' = auto-assign after cooldown
                cooldown: 5000,     // Cooldown in ms, only used in COOLDOWN mode (default: 5000ms)
            },

            clientSecret            : '',
    
            name                    : 'Music Disc',
            prefix                  : '+',
            status                  : ('online' as ClientPresenceStatus),       // 'online' | 'idle' | 'dnd'
            activity: {
                type                : ActivityType.Playing,                     // https://discord.com/developers/docs/topics/gateway-events#activity-object-activity-types
                name                : '+help | music',
                state               : undefined,
                url                 : undefined,
            },
            embedsColors: {
                message             : '#FFFFFF',            // Message embed color
                success             : '#FFFFFF',            // Success embed color
                error               : '#FF0000',            // Error embed color
                warning             : '#FFFF00',            // Warning embed color
            },
            volume: {
                default             : 50,
                max                 : 100,
            },
            // Auto leave channel settings
            autoLeave: {
                enabled             : true,
                cooldown            : 5000,         // ms
            },
            // Show voice channel updates
            displayVoiceState       : true,

            // Specify the text channel for receiving commands.
            // If this value is set, text messages from other channels will not be processed.
            specifyMessageChannel   : null,         // Text channel ID

            // Specify the voice channel to join.
            // If this value is set, other voice channels will not be joined.
            specifyVoiceChannel     : null,         // Vioce channel ID

            // After starting the Bot, it will automatically join the specified voice channel and wait.
            // The specifyVoiceChannel value needs to be set, otherwise it will be invalid.
            startupAutoJoin         : false,

            // Language settings
            i18n: {
                localePath          : '../../locales',
                defaultLocale       : 'en-US'
            },

            // Max queued songs per user settings
            maxQueuedSongs: {
                enabled             : true,                                 // Enable/disable this feature
                global              : 100,                                  // Global maximum queue size
                default             : 5,                                    // Default limit for users without special roles
                djs                 : 50,                                   // Limit for DJ role users
                roles               : {}                                    // Custom limits per role ID
            },

            fairQueue               : false,

            // Voice channel status emojis
            voiceStatusEmojis       : ['🎵'],

            // Voice channel status idle text
            voiceStatusIdleText     : ''
        },

        // Lavalink node list
        nodeList: [
            {
                id: 'Node 1',
                hostname: 'localhost',
                port: 2333,
                password: 'youshallnotpass'
            }
        ],

        spotify: {
            clientId: null,             // If you want to use Spotify to play songs, you need to set up Spotify credentials.
            clientSecret: null          // https://developer.spotify.com/documentation/web-api
        },

        blacklist               : [],           // It must be the user ID (string[])

        // Preset links queued by the alimesami command
        presetLinks             : [],           // It must be a URL (string[])

        // Web dashboard settings
        webDashboard: {
            enabled                 : true,
            port                    : 33333,
            loginType               : ('USER' as LoginType),    // 'USER' | 'OAUTH2'
    
            // USER mode settings
            user: {
                username            : 'admin',
                password            : 'password',
            },
    
            // OAUTH2 mode settings
            oauth2: {
                link                : '',
                redirectUri         : 'http://localhost:33333/login',
            },
    
            // SessionManager config
            sessionManager: {
                validTime           : 10 * 60 * 1000,           // Session validity time (ms) (default: 10 minutes)
                cleanupInterval     : 5 * 60 * 1000             // Timing cleaner time (ms) (default: 5 minutes)
            },
            // IPBlocker config
            ipBlocker: {
                retryLimit              : 5,                    // Maximum number of retries (default: 5)
                unlockTimeoutDuration   : 5 * 60 * 1000,        // Blocking time (ms) (default: 5 minutes)
                cleanupInterval         : 5 * 60 * 1000         // Timing cleaner time (ms) (default: 5 minutes)
            }
        },
    
        // Local Lavalink node
        localNode: {
            enabled             : false,
            autoRestart         : true,
            downloadLink        : 'https://github.com/lavalink-devs/Lavalink/releases/download/4.2.2/Lavalink.jar'
        },

        // Command permission settings
        command: {
            disableCommand      : [],                                   // Disabled commands, all enabled by default
            adminCommand        : ['language', 'server', 'status', 'volume-default'], // Admin commands, only Admin role user can use
            djCommand           : ['dj'],                               // DJ commands, only DJ role user can use


            requesterOnly       : ['skip'],                              // Commands restricted to the song requester
            requesterDjBypass   : ['skip']                              // Commands DJs can bypass requesterOnly on
        },

        queuePersistence: {
            enabled             : false
        },

        playlist: {
            enabled             : true
        },

        database: {
            path                : './data/database.db'
        }
    },

    // Console color
    color: {
        cyan    : '\x1B[36m',
        green   : '\x1B[32m',
        grey    : '\x1B[2m',
        red     : '\x1B[31m',
        white   : '\x1B[0m',
        yellow  : '\x1B[33m'
    },
    // Dashboard button icon
    button: {
        emoji: {
            play        : '<:w_play:1106270709644271656>',
            pause       : '<:w_pause:1106270708243386428>',
            skip        : '<:w_skip:1106270714664849448>',
            back        : '<:w_back:1106270704049061928>',
            stop        : '<:w_stop:1106272001909346386>',
            loop        : '<:w_loop:1106270705575792681>',
            shuffle     : '<:w_shuffle:1106270712542531624>',
            prev        : '<:w_prev:1153665768093921280>',
            next        : '<:w_next:1153665809990815874>',
        },
        label: {
            delete      : 'commands:LABEL_DELETE_MESSAGE',
            clear       : 'commands:LABEL_CLEAR_QUEUE'
        }
    },
    // Logger
    logger: {
        format      : 'YYYY-MM-DD HH:mm:ss',            // Time format 'YYYY-MM-DD HH(hh):mm:ss.l'
        logDir      : './logs'
    },
    cacheExpiration : 30 * 60 * 1000            // stats cache validity time (default: 30 minutes)
};
