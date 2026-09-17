/** Hosts that serve YouTube video pages. */
const YOUTUBE_HOSTS = new Set([
    'youtube.com',
    'www.youtube.com',
    'm.youtube.com',
    'music.youtube.com',
    'youtube-nocookie.com',
    'www.youtube-nocookie.com',
]);

/** Path prefixes on youtube.com that carry a video id. */
const YOUTUBE_PATH_PATTERN = /^\/(?:shorts|live|embed|v)\/([^/?#]+)/;

/** YouTube video ids are 11 characters of the URL-safe base64 alphabet. */
const YOUTUBE_VIDEO_ID_PATTERN = /^[\w-]{11}$/;


/**
 * Normalize a track URL into a stable database key.
 *
 * YouTube links collapse to `https://www.youtube.com/watch?v=<videoId>` so
 * share links, playlist links, and shorts never create duplicate entries.
 * Unrecognized hosts are returned unchanged; their LavaLink URIs are already canonical.
 */
export function normalizeTrackUrl(url: string): string {
    const trimmed = url.trim();

    let parsed: URL;
    try {
        parsed = new URL(trimmed);
    } catch (_) {
        return trimmed;
    }

    const host = parsed.hostname.toLowerCase();
    let videoId: string | null = null;

    if (host === 'youtu.be' || host === 'www.youtu.be') {
        videoId = parsed.pathname.split('/').filter(Boolean)[0] ?? null;
    }
    else if (YOUTUBE_HOSTS.has(host)) {
        if (parsed.pathname === '/watch') {
            videoId = parsed.searchParams.get('v');
        }
        else {
            videoId = parsed.pathname.match(YOUTUBE_PATH_PATTERN)?.[1] ?? null;
        }
    }

    if (videoId && YOUTUBE_VIDEO_ID_PATTERN.test(videoId)) {
        return `https://www.youtube.com/watch?v=${videoId}`;
    }

    return trimmed;
}
