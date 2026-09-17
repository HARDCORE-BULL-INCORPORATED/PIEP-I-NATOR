/**
 * Strip common YouTube title noise such as "[OFFICIAL VIDEO]",
 * "(Official Audio)", "(Lyrics)", quality tags like "[HD]", and
 * trailing separator fragments left after removal.
 * Falls back to the trimmed original when cleaning removes everything.
 */
export function cleanTrackTitle(text: string): string {
    // Remove bracketed/parenthesized tags: official, music, lyric, hd, hq, 4k, video, audio, lyrics
    const tagPattern = /[\[\(]\s*(?:official\s*)?(?:music\s*)?(?:hd\s*|hq\s*|4k\s*)?(?:lyric\s*)?(?:video|audio|lyrics?)(?:\s*(?:hd|hq|4k))?\s*[\]\)]/gi;
    let cleaned = text.replace(tagPattern, '');

    // Remove standalone quality tags: [HD], [HQ], [4K], (HD), (HQ), (4K)
    cleaned = cleaned.replace(/[\[\(]\s*(?:hd|hq|4k)\s*[\]\)]/gi, '');

    // Remove "(Audio Only)" and similar patterns
    cleaned = cleaned.replace(/[\[\(]\s*audio\s*only\s*[\]\)]/gi, '');

    // Remove trailing "| Official Video", "- Official Audio", etc.
    cleaned = cleaned.replace(/\s*[|\-]\s*official\s*(?:music\s*)?(?:hd\s*)?(?:lyric\s*)?(?:video|audio|lyrics?)\s*$/i, '');

    // Trim leftover trailing separators and whitespace
    cleaned = cleaned.replace(/[\s\-|]+$/, '').trim();

    return cleaned || text.trim();
}
