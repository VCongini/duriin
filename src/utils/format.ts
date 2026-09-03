const DATE_ONLY_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;

export const parseDate = (value: string) => {
    const match = DATE_ONLY_PATTERN.exec(value);

    return match
        ? new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]))
        : new Date(value);
};

export const formatDate = (iso: string, opts?: Intl.DateTimeFormatOptions) => {
    const options: Intl.DateTimeFormatOptions = opts ?? { month: 'short', day: '2-digit' };
    return parseDate(iso).toLocaleDateString('en-US', options);
};
