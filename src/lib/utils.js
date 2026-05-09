const now = new Date();
export function dateConverted(date) {
    const formattedDate = new Date(date).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
    return formattedDate;
}

export function concateDate(start, end) {
    const startDate = new Date(start);

    if (startDate > now) {
        return `${dateConverted(start)} - ${dateConverted(end)}`
    } else {
        return dateConverted(start);
    }
}

export function formatRupiah (angka) {
    return new Intl.NumberFormat("id-ID").format(angka)
}