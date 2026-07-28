// components/InvoiceEventPDF.js
import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";

const styles = StyleSheet.create({
    page: { padding: 40, backgroundColor: '#ffffff' },
    header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20, borderBottom: '1px solid #ccc', paddingBottom: 10 },
    logo: { width: 60, height: 60 },
    title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 10 },
    statusBadge: { 
        backgroundColor: '#fef3c7', 
        color: '#d97706', 
        padding: '4px 12px', 
        borderRadius: 20,
        fontSize: 12,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
    },
    row: { flexDirection: 'row', marginBottom: 4 },
    label: { width: 100, fontSize: 12, color: '#666' },
    value: { fontSize: 12, fontWeight: 'bold' },
    table: { marginTop: 20, border: '1px solid #333' },
    tableHeader: { flexDirection: 'row', backgroundColor: '#00973D', padding: 8 },
    tableHeaderText: { color: '#fff', fontSize: 12, fontWeight: 'bold', flex: 1, textAlign: 'center' },
    tableRow: { flexDirection: 'row', borderBottom: '1px solid #ccc', padding: 8 },
    tableCell: { fontSize: 11, flex: 1, textAlign: 'center' },
    totalRow: { flexDirection: 'row', backgroundColor: '#00973D', padding: 8 },
    totalText: { color: '#fff', fontSize: 12, fontWeight: 'bold', flex: 1, textAlign: 'center' },
    note: { marginTop: 20, fontSize: 10, color: '#ef4444', textAlign: 'center' },
    statusMessage: { marginTop: 10, fontSize: 12, textAlign: 'center', color: '#d97706' },
});

export default function InvoiceEventPDF({ 
    name, 
    email, 
    hash_id, 
    invoice_id, 
    event_title, 
    event_price, 
    event_qty,
    status = "paid" 
}) {
    const isPending = status === "pending";

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* Header */}
                <View style={styles.header}>
                    <Image src="/assets/images/sh3logo.png" style={styles.logo} />
                    <Text style={{ fontSize: 16, fontWeight: 'bold' }}>INVOICE #{invoice_id}</Text>
                </View>

                {/* Title & Status */}
                <Text style={styles.title}>INVOICE</Text>
                {isPending && (
                    <View style={styles.statusBadge}>
                        <Text>Menunggu Konfirmasi</Text>
                    </View>
                )}

                {/* Customer Info */}
                <View style={{ marginTop: 20 }}>
                    <View style={styles.row}><Text style={styles.label}>Nama:</Text><Text style={styles.value}>{name}</Text></View>
                    <View style={styles.row}><Text style={styles.label}>Email:</Text><Text style={styles.value}>{email}</Text></View>
                    <View style={styles.row}><Text style={styles.label}>Hash ID:</Text><Text style={styles.value}>{hash_id}</Text></View>
                </View>

                {/* Table */}
                <View style={styles.table}>
                    <View style={styles.tableHeader}>
                        <Text style={styles.tableHeaderText}>Qty</Text>
                        <Text style={styles.tableHeaderText}>Description</Text>
                        <Text style={styles.tableHeaderText}>Price</Text>
                        <Text style={styles.tableHeaderText}>Total</Text>
                    </View>
                    <View style={styles.tableRow}>
                        <Text style={styles.tableCell}>{event_qty}</Text>
                        <Text style={styles.tableCell}>{event_title} Ticket</Text>
                        <Text style={styles.tableCell}>Rp. {event_price}</Text>
                        <Text style={styles.tableCell}>Rp. {event_price}</Text>
                    </View>
                    <View style={styles.totalRow}>
                        <Text style={styles.totalText}></Text>
                        <Text style={styles.totalText}></Text>
                        <Text style={styles.totalText}>Total</Text>
                        <Text style={styles.totalText}>Rp. {event_price}</Text>
                    </View>
                </View>

                {/* Status Message */}
                {isPending ? (
                    <Text style={styles.statusMessage}>
                        Pembayaran sedang diverifikasi oleh admin. QR Code akan aktif setelah dikonfirmasi.
                    </Text>
                ) : (
                    <Text style={{ ...styles.statusMessage, color: '#22c55e' }}>
                        Pembayaran telah dikonfirmasi. QR Code aktif!
                    </Text>
                )}

                <Text style={styles.note}>
                    Tolong hubungi Admin jika ada pertanyaan terkait pembayaran atau hal yang lain!
                </Text>
            </Page>
        </Document>
    );
}