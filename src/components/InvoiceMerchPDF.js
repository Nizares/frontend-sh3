// src/components/InvoiceMerchPDF.jsx
"use client";

import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";

const styles = StyleSheet.create({
    page: {
        padding: 40,
        fontFamily: "Helvetica",
    },
    header: {
        flexDirection: "row",
        justifyContent: "center",
        marginBottom: 20,
    },
    logo: {
        width: 80,
        height: 80,
        objectFit: "cover",
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 20,
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 10,
    },
    infoLeft: {
        flexDirection: "column",
        width: "50%",
    },
    infoRight: {
        flexDirection: "column",
        alignItems: "center",
        width: "50%",
    },
    label: {
        fontSize: 14,
        fontWeight: "bold",
    },
    value: {
        fontSize: 14,
        marginBottom: 4,
    },
    table: {
        marginVertical: 20,
        borderWidth: 1,
        borderColor: "#000",
    },
    tableRow: {
        flexDirection: "row",
        borderBottomWidth: 1,
        borderBottomColor: "#000",
    },
    tableRowHeader: {
        flexDirection: "row",
        backgroundColor: "#1a4d8f",
        borderBottomWidth: 1,
        borderBottomColor: "#000",
    },
    tableCellQty: {
        padding: 10,
        width: "15%",
        textAlign: "center",
        borderRightWidth: 1,
        borderRightColor: "#000",
        fontSize: 12,
    },
    tableCellDesc: {
        padding: 10,
        width: "40%",
        textAlign: "left",
        borderRightWidth: 1,
        borderRightColor: "#000",
        fontSize: 12,
    },
    tableCellPrice: {
        padding: 10,
        width: "20%",
        textAlign: "right",
        borderRightWidth: 1,
        borderRightColor: "#000",
        fontSize: 12,
    },
    tableCellTotal: {
        padding: 10,
        width: "25%",
        textAlign: "right",
        fontSize: 12,
    },
    tableCellHeader: {
        padding: 10,
        color: "#fff",
        fontWeight: "bold",
        fontSize: 12,
    },
    // 🔥 Diskon Poin
    discountRow: {
        flexDirection: "row",
        backgroundColor: "#f0fdf4",
        borderBottomWidth: 1,
        borderBottomColor: "#000",
    },
    discountCell: {
        padding: 10,
        width: "55%",
        textAlign: "left",
        fontSize: 12,
        color: "#16a34a",
        fontWeight: "medium",
    },
    discountCellPrice: {
        padding: 10,
        width: "45%",
        textAlign: "right",
        fontSize: 12,
        color: "#16a34a",
        fontWeight: "bold",
    },
    totalRow: {
        flexDirection: "row",
        backgroundColor: "#1a4d8f",
    },
    totalCell: {
        padding: 10,
        width: "75%",
        textAlign: "right",
        color: "#fff",
        fontWeight: "bold",
        fontSize: 14,
    },
    totalCellPrice: {
        padding: 10,
        width: "25%",
        textAlign: "right",
        color: "#fff",
        fontWeight: "bold",
        fontSize: 14,
    },
    // 🔥 Poin Used
    pointsRow: {
        flexDirection: "row",
        backgroundColor: "#fffbeb",
        borderBottomWidth: 1,
        borderBottomColor: "#000",
    },
    pointsCell: {
        padding: 10,
        width: "100%",
        textAlign: "center",
        fontSize: 12,
        color: "#d97706",
        fontWeight: "medium",
    },
    footer: {
        marginTop: 20,
        textAlign: "center",
        color: "#ef4444",
        fontSize: 12,
    },
});

export default function InvoiceMerchPDF({
    name,
    email,
    hash_id,
    invoice_id,
    merch_name,
    merch_price,
    merch_qty,
    merch_size,
    merch_color,
    total_price,
    points_used = 0,
    discount_amount = 0,
}) {
    const formattedPrice = new Intl.NumberFormat("id-ID").format(discount_amount || 0);

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* Header */}
                <View style={styles.header}>
                    <Image src="/assets/images/sh3logo.png" style={styles.logo} />
                </View>
                <Text style={styles.title}>INVOICE</Text>

                {/* Customer Info */}
                <View style={styles.row}>
                    <View style={styles.infoLeft}>
                        <Text style={styles.value}>To : {name}</Text>
                        <Text style={styles.value}>Email : {email}</Text>
                        <Text style={styles.value}>Hash ID : {hash_id}</Text>
                    </View>
                    <View style={styles.infoRight}>
                        <Text style={styles.label}>Invoice : {invoice_id}</Text>
                    </View>
                </View>

                {/* Table */}
                <View style={styles.table}>
                    {/* Header */}
                    <View style={styles.tableRowHeader}>
                        <View style={[styles.tableCellQty, styles.tableCellHeader]}>Qty</View>
                        <View style={[styles.tableCellDesc, styles.tableCellHeader]}>Description</View>
                        <View style={[styles.tableCellPrice, styles.tableCellHeader]}>Price</View>
                        <View style={[styles.tableCellTotal, styles.tableCellHeader]}>Total</View>
                    </View>

                    {/* Item Row */}
                    <View style={styles.tableRow}>
                        <View style={styles.tableCellQty}>{merch_qty}</View>
                        <View style={styles.tableCellDesc}>
                            {merch_name}
                            {merch_size && ` — Size: ${merch_size}`}
                            {merch_color && ` — Color: ${merch_color}`}
                        </View>
                        <View style={styles.tableCellPrice}>Rp. {merch_price}</View>
                        <View style={styles.tableCellTotal}>Rp. {total_price}</View>
                    </View>

                    {/* 🔥 Diskon Poin */}
                    {discount_amount > 0 && (
                        <View style={styles.discountRow}>
                            <View style={styles.discountCell}>Diskon Poin</View>
                            <View style={styles.discountCellPrice}>- Rp. {formattedPrice}</View>
                        </View>
                    )}

                    {/* Total Row */}
                    <View style={styles.totalRow}>
                        <View style={styles.totalCell}>Total</View>
                        <View style={styles.totalCellPrice}>Rp. {total_price}</View>
                    </View>

                    {/* 🔥 Poin Used */}
                    {points_used > 0 && (
                        <View style={styles.pointsRow}>
                            <View style={styles.pointsCell}>{points_used} poin digunakan</View>
                        </View>
                    )}
                </View>

                {/* Footer */}
                <Text style={styles.footer}>
                    Tolong hubungin Admin jika ada pertanyaan terkait pembayaran atau hal yang lain!
                </Text>
            </Page>
        </Document>
    );
}