const FALLBACK_BASE = 'https://placeholder.local';

const createUrlWithParams = (imageUrl: string, width: number, format?: string): string => {
    try {
        const url = new URL(imageUrl, FALLBACK_BASE);
        url.searchParams.set('auto', 'format');
        url.searchParams.set('fit', 'crop');
        url.searchParams.set('q', '80');
        url.searchParams.set('w', String(width));

        if (format) {
            url.searchParams.set('fm', format);
        }

        const absoluteUrl = url.toString();
        return imageUrl.startsWith('http') ? absoluteUrl : absoluteUrl.replace(FALLBACK_BASE, '');
    } catch (error) {
        console.warn('[images] Failed to build responsive source for', imageUrl, error);
        return imageUrl;
    }
};

export type ResponsiveImageSources = {
    defaultSrc: string;
    width: number;
    height: number;
    srcSet: string;
    webpSrcSet: string;
};

const DEFAULT_WIDTHS = [480, 768, 1024, 1440];
const DEFAULT_ASPECT_RATIO = 9 / 16;

export const buildResponsiveImageSources = (
    imageUrl: string,
    widths: number[] = DEFAULT_WIDTHS,
    aspectRatio = DEFAULT_ASPECT_RATIO
): ResponsiveImageSources => {
    const validWidths = widths.length ? widths : DEFAULT_WIDTHS;
    const defaultWidth = validWidths[Math.min(2, validWidths.length - 1)];
    const height = Math.round(defaultWidth * aspectRatio);

    const srcSet = validWidths
        .map((width) => `${createUrlWithParams(imageUrl, width)} ${width}w`)
        .join(', ');
    const webpSrcSet = validWidths
        .map((width) => `${createUrlWithParams(imageUrl, width, 'webp')} ${width}w`)
        .join(', ');

    return {
        defaultSrc: createUrlWithParams(imageUrl, defaultWidth),
        width: defaultWidth,
        height,
        srcSet,
        webpSrcSet,
    };
};
