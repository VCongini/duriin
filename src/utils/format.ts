export const formatDate = (iso: string, opts?: Intl.DateTimeFormatOptions) => {
    const options: Intl.DateTimeFormatOptions = opts ?? { month: 'short', day: '2-digit' };
    return new Date(iso).toLocaleDateString('en-US', options);
};
