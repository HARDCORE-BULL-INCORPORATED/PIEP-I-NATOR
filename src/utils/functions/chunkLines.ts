/**
 * Split text lines into chunks that fit into a single embed field value.
 * Truncates a single line that is longer than the limit.
 * @param lines - Lines to split
 * @param maxLength - Maximum length of a chunk
 */
export const chunkLines = (lines: string[], maxLength: number): string[] => {
    const chunks: string[] = [];
    let chunk = '';

    for (const line of lines) {
        const normalizedLine = line.length > maxLength
            ? line.slice(0, maxLength - 3) + '...'
            : line;
        const candidate = chunk.length > 0 ? `${chunk}\n${normalizedLine}` : normalizedLine;

        if (chunk.length > 0 && candidate.length > maxLength) {
            chunks.push(chunk);
            chunk = normalizedLine;
        }
        else {
            chunk = candidate;
        }
    }

    if (chunk.length > 0) {
        chunks.push(chunk);
    }

    return chunks;
};
