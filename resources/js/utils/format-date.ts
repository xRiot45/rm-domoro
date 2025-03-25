export const formatDate = (dateString: string, locale: string = 'id-ID', options: Intl.DateTimeFormatOptions = {}): string => {
    const date = new Date(dateString);

    if (isNaN(date.getTime())) {
        throw new Error(`Invalid date: ${dateString}`);
    }

    const defaultOptions: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
    };

    return new Intl.DateTimeFormat(locale, { ...defaultOptions, ...options }).format(date);
};

export const formattedDateForInput = (date: Date | null) => {
    if (!date) return null;
    return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().split('T')[0];
};
