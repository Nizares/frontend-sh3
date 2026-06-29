const now = new Date();

export function dateConverted(date) {
    const formattedDate = new Date(date).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
    return formattedDate;
}

// Fungsi baru: tanggal bahasa Indonesia + jam WITA
export function dateConvertedWITA(dateString) {
    // Buang 'Z' di akhir agar tidak dianggap UTC
    const localString = dateString.replace('Z', '');
    const date = new Date(localString);

    const formattedDate = date.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });

    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${formattedDate}, ${hours}:${minutes} WITA`;
    // Output: "24 Mei 2026, 14:30 WITA" ✅
}

export function concateDate(start, end, isOngoing) {
    const startDate = new Date(start);

    if (startDate > now || isOngoing == true) {
        return `${dateConvertedWITA(start)} - ${dateConvertedWITA(end)}`
    } else {
        return dateConvertedWITA(start);
    }
}

export function formatRupiah(angka) {
    return new Intl.NumberFormat("id-ID").format(angka);
}