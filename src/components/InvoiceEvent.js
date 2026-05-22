"use client"
import Image from "next/image"

export default function InvoiceEvent({
    name,
    email,
    hash_id,
    invoice_id,
    event_title,
    event_price,
    event_qty
}) {
    return (
        <div className="flex flex-col bg-card-bg p-8 rounded-lg">
            <div className="flex flex-col items-center p-8">
                <Image
                    src="/assets/images/sh3logo.png"
                    alt="Logo"
                    width={125}
                    height={125}
                    className="w-20 h-20 md:w-32 md:h-32 lg:w-32 lg:h-32 object-cover rounded-lg"
                />
            </div>

            <div className="text-text-colors font-bold text-5xl text-center">INVOICE</div>

            <div className="flex flex-row mt-16">
                <div className="flex flex-col w-1/2 px-16 text-lg">
                    <div>
                        To : {name}
                    </div>
                    <div>
                        Email : {email}
                    </div>
                    <div>
                        Hash ID : {hash_id}
                    </div>
                </div>
                <div className="flex flex-col items-center w-1/2 px-8">
                    <div className="font-bold text-xl">
                        Invoice : {invoice_id}
                    </div>               
                </div>
            </div>
            
            <table className="border border-text-colors table-auto divide-y my-16">
                <thead>
                    <tr className="divide-text-colors divide-x bg-amber-500">
                        <th className="p-4">Qty</th>
                        <th className="p-4">Description</th>
                        <th className="p-4">Price</th>
                        <th className="p-4">Total</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-text-colors">
                    <tr className="text-right divide-text-colors divide-x">
                        <td className="text-center p-4">{event_qty}</td>
                        <td className="text-left p-4">{event_title} Ticket</td>
                        <td className="p-4">Rp. {event_price}</td>
                        <td className="p-4">Rp. {event_price}</td>
                    </tr>
                    <tr className="divide-text-colors divide-x bg-amber-500">
                        <th></th>
                        <th></th>
                        <th className="p-4">Total</th>
                        <th className="p-4">Rp. {event_price}</th>
                    </tr>
                </tbody>
            </table>
            <div className="text-red-500 text-center">Tolong hubungin Admin jika ada pertanyaan terkait pembayaran atau hal yang lain!</div>
        </div>
    )
}