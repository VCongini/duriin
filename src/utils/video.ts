export const normalizeYouTubeEmbedUrl = (url: string) =>
    url.replace(
        /^https?:\/\/(?:www\.)?youtube\.com(?=\/embed\/)/i,
        'https://www.youtube-nocookie.com'
    );
