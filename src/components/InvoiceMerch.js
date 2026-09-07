"use client";

import dynamic from "next/dynamic";

const PDFDownloadLink = dynamic(
    () => import("@react-pdf/renderer").then((mod) => mod.PDFDownloadLink),
    { ssr: false }
);
import InvoiceMerchPDF from "./InvoiceMerchPDF";

export default function InvoiceMerch({
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
    points_used = 0,        // 🔥 Tambahan
    discount_amount = 0,    // 🔥 Tambahan
}) {
    return (
        <div className="flex flex-col gap-4">
            <div className="flex justify-end">
                <PDFDownloadLink
                    document={
                        <InvoiceMerchPDF
                            name={name}
                            email={email}
                            hash_id={hash_id}
                            invoice_id={invoice_id}
                            merch_name={merch_name}
                            merch_price={merch_price}
                            merch_qty={merch_qty}
                            merch_size={merch_size}
                            merch_color={merch_color}
                            total_price={total_price}
                            points_used={points_used}
                            discount_amount={discount_amount}
                        />
                    }
                    fileName={`Invoice-${invoice_id}.pdf`}
                >
                    {({ loading }) => (
                        <button className="rounded-md bg-secondary-bg hover:bg-secondary-bg-hover active:bg-secondary-bg-active text-white font-bold py-2 px-6 transition-colors">
                            {loading ? "Menyiapkan PDF..." : "Download PDF"}
                        </button>
                    )}
                </PDFDownloadLink>
            </div>

            <div className="flex flex-col bg-primary-light p-8 border-2 border-neutral-normal rounded-md">
                <div className="flex flex-col items-center p-8">
                    <img
                        src="/assets/images/sh3logo.png"
                        alt="Logo"
                        className="w-20 h-20 md:w-32 md:h-32 object-cover"
                    />
                </div>

                <div className="font-bold text-3xl md:text-5xl text-center">INVOICE</div>

                <div className="flex flex-col md:flex-row mt-8 md:mt-16">
                    <div className="flex flex-col w-full md:w-1/2 px-4 md:px-16 text-lg">
                        <div>To : {name}</div>
                        <div>Email : {email}</div>
                        <div>Hash ID : {hash_id}</div>
                    </div>
                    <div className="flex flex-col items-center w-full md:w-1/2 px-8 mt-4 md:mt-0">
                        <div className="font-bold text-xl">
                            Invoice : {invoice_id}
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto my-8 md:my-16">
                    <table className="border border-neutral-dark table-auto divide-y w-full">
                        <thead>
                            <tr className="divide-neutral-dark divide-x bg-secondary-bg text-white">
                                <th className="p-4">Qty</th>
                                <th className="p-4">Description</th>
                                <th className="p-4">Price</th>
                                <th className="p-4">Total</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-dark">
                            <tr className="text-right divide-neutral-dark divide-x">
                                <td className="text-center p-4">{merch_qty}</td>
                                <td className="text-left p-4">
                                    {merch_name}
                                    {merch_size && <span className="text-sm text-gray-500"> — Size: {merch_size}</span>}
                                    {merch_color && <span className="text-sm text-gray-500"> — Color: {merch_color}</span>}
                                </td>
                                <td className="p-4">Rp. {merch_price}</td>
                                <td className="p-4">Rp. {total_price}</td>
                            </tr>

                            {/* 🔥 Diskon Poin */}
                            {discount_amount > 0 && (
                                <tr className="text-right divide-neutral-dark divide-x bg-green-50">
                                    <td className="text-center p-4" colSpan="2">
                                        <span className="text-green-600 font-medium">Diskon Poin</span>
                                    </td>
                                    <td className="p-4 text-green-600">-</td>
                                    <td className="p-4 text-green-600 font-bold">
                                        - Rp. {new Intl.NumberFormat('id-ID').format(discount_amount)}
                                    </td>
                                </tr>
                            )}

                            <tr className="divide-neutral-dark divide-x bg-secondary-bg text-white">
                                <th></th>
                                <th></th>
                                <th className="p-4">Total</th>
                                <th className="p-4">Rp. {total_price}</th>
                            </tr>

                            {/* 🔥 Poin yang digunakan */}
                            {points_used > 0 && (
                                <tr className="text-right divide-neutral-dark divide-x bg-amber-50">
                                    <td className="text-center p-4" colSpan="4">
                                        <span className="text-amber-600 font-medium">
                                            {points_used} poin digunakan
                                        </span>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="text-red-500 text-center">
                    Tolong hubungin Admin jika ada pertanyaan terkait pembayaran atau hal yang lain!
                </div>
            </div>
        </div>
    );
}