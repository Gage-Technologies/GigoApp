/**
 * Returns a promise that when awaited sleeps for the specified time in millis
 * @param millis time in millis to sleep
 */
export async function sleep(millis: number) {
    return new Promise<void>(resolve => setTimeout(resolve, millis));
}

export async function createHash(input: string) {
    const encoder = new TextEncoder();
    const data = encoder.encode(input);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer)); // convert buffer to byte array
     // convert bytes to hex string
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export function simpleHash(input: string) {
    let hash = 0;
    for (let i = 0; i < input.length; i++) {
        const char = input.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash |= 0; // Convert to 32bit integer
    }
    return hash.toString();
}

export function getTextColor(backgroundColor: string) {
    const color = backgroundColor.substring(1);
    const rgb = parseInt(color, 16);
    const r = (rgb >> 16) & 0xff;
    const g = (rgb >> 8) & 0xff;
    const b = (rgb >> 0) & 0xff;
    const brightness = 0.299 * r + 0.587 * g + 0.114 * b;
    return brightness > 186 ? '#000000' : '#FFFFFF';
  };