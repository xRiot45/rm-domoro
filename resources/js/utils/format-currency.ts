export const formatCurrency = (value: number) => {
    return (
        'Rp. ' +
        new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        })
            .format(value)
            .replace('Rp', '')
            .trim()
    );
};
