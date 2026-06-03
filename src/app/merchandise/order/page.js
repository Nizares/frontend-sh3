"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import Container from "@/src/components/Container"
import SelectInput from "@/src/components/SelectInput"
import InputType from "@/src/components/Inputs"
import InvoiceMerch from "@/src/components/InvoiceMerch"
import { RevealSection } from "@/src/components/RevealSection"
import { ArrowLongLeftIcon } from "@heroicons/react/24/outline"
import { ChevronUpIcon } from "@heroicons/react/24/solid"
import { merchandiseService } from "@/src/services/merchandiseService"
import { formatRupiah } from "@/src/lib/utils"
import { useRouter } from "next/navigation"
import Swal from "sweetalert2"

export default function MerchandiseOrderPage() {
    const [item, setItem] = useState(null)
    const [qty, setQty] = useState(1)
    const [selectedSize, setSelectedSize] = useState("")
    const [selectedColor, setSelectedColor] = useState("")
    const [shippingAddress, setShippingAddress] = useState("")
    const [shippingPhone, setShippingPhone] = useState("")
    const [submitLoading, setSubmitLoading] = useState(false)
    const [orderResult, setOrderResult] = useState(null)
    const [userData, setUserData] = useState(null)
    const router = useRouter()

    useEffect(() => {
        // Cek login dulu — kalau belum, redirect ke halaman login
        const token = localStorage.getItem("token")
        if (!token) {
            Swal.fire({
                icon: "warning",
                title: "Belum login!",
                text: "Kamu harus login dulu untuk memesan merchandise.",
                confirmButtonText: "Login Sekarang",
            }).then(() => router.push("/members/detail"))
            return
        }

        const params = new URLSearchParams(window.location.search)
        const id = params.get("id")
        if (!id) return

        merchandiseService.getById(id)
            .then(res => setItem(res.data.data))
            .catch(err => console.error(err))

        const user = localStorage.getItem("user")
        if (user) setUserData(JSON.parse(user))
    }, [])

    const totalPrice = item ? item.price * qty : 0

    async function submitOrder(e) {
        e.preventDefault()

        if (!userData) {
            Swal.fire({ icon: "warning", title: "Belum login!", text: "Kamu harus login terlebih dahulu." })
            return
        }
        if (item.sizes?.length > 0 && !selectedSize) {
            Swal.fire({ icon: "warning", title: "Pilih ukuran dulu!" })
            return
        }
        if (item.colors?.length > 0 && !selectedColor) {
            Swal.fire({ icon: "warning", title: "Pilih warna dulu!" })
            return
        }
        if (!shippingAddress) {
            Swal.fire({ icon: "warning", title: "Isi alamat pengiriman dulu!" })
            return
        }
        if (!shippingPhone) {
            Swal.fire({ icon: "warning", title: "Isi nomor HP pengiriman dulu!" })
            return
        }

        setSubmitLoading(true)
        try {
            const orderRes = await merchandiseService.createOrder({
                merchandise_id: item.id,
                quantity: qty,
                size: selectedSize || null,
                color: selectedColor || null,
                shipping_address: shippingAddress,
                shipping_phone: shippingPhone,
            })

            const order = orderRes.data.data
            setOrderResult({
                order_id: order.order_id,
                invoice_number: order.invoice_number,
                payment_instructions: order.payment_instructions,
            })

            // Scroll ke invoice
            setTimeout(() => {
                document.getElementById("invoice-section")?.scrollIntoView({ behavior: "smooth" })
            }, 300)

        } catch (err) {
            console.error("Error detail:", err.response?.data)
            Swal.fire({
                icon: "error",
                title: "Gagal!",
                text: err.response?.data?.message || "Terjadi kesalahan, coba lagi.",
            })
        } finally {
            setSubmitLoading(false)
        }
    }

    if (!item) return <div className="flex justify-center p-16 text-2xl">Loading...</div>

    const sizeOptions = item.sizes?.map(s => ({ value: s, label: s })) ?? []
    const colorOptions = item.colors?.map(c => ({ value: c, label: c })) ?? []

    return (
        <Container className="flex flex-col gap-y-4 w-full px-4 md:px-0 max-w-306 mx-auto">
            <RevealSection direction="up">
                <div className="flex flex-col gap-y-4 mt-8">
                    <Link href="/merchandise" className="static md:absolute">
                        <ArrowLongLeftIcon className="w-8 h-8 md:w-16 md:h-16" />
                    </Link>
                    <div className="flex items-center justify-center w-full">
                        <h1 className="text-4xl font-bold font-young">{item.name}</h1>
                    </div>
                </div>
            </RevealSection>

            <RevealSection direction="up">
                {item.image_url ? (
                    <img
                        src={item.image_url}
                        alt={item.name}
                        className="h-80 w-full object-cover"
                    />
                ) : (
                    <div className="h-80 w-full bg-neutral-bg flex items-center justify-center text-5xl font-bold font-young">
                        {item.name.slice(0, 2).toUpperCase()}
                    </div>
                )}
            </RevealSection>

            <RevealSection direction="up">
                <div className="flex justify-center gap-8 flex-col md:flex-row">
                    <div className="bg-primary-light border-2 border-neutral-normal p-4 w-full">
                        <h3 className="text-2xl font-bold font-young mb-2">{item.name}</h3>
                        <div className="text-sm text-neutral-dark mb-4">{item.description}</div>
                        <div className="text-lg font-bold text-secondary-bg">
                            Rp. {formatRupiah(item.price)} / pcs
                        </div>
                        {item.category && (
                            <div className="text-sm mt-1">Kategori: <span className="font-medium">{item.category}</span></div>
                        )}
                    </div>
                    <div className="flex flex-col items-center justify-center bg-primary-light border-neutral-normal border-2 p-4 w-full">
                        <div className="font-bold text-3xl">Stok Tersisa</div>
                        <div className={`font-bold text-5xl font-young ${item.stock === 0 ? "text-red-500" : ""}`}>
                            {item.stock === 0 ? "Habis" : item.stock}
                        </div>
                    </div>
                </div>
            </RevealSection>

            {item.stock === 0 ? (
                <div className="flex justify-center items-center h-32 bg-neutral-bg text-white font-bold text-2xl font-young">
                    Stok Habis
                </div>
            ) : (
                <form onSubmit={submitOrder} className="flex flex-col gap-8">

                    {/* Detail Order */}
                    <RevealSection direction="up">
                        <div className="flex flex-col bg-primary-light p-4 gap-4 border-neutral-normal border-2">
                            <div className="flex justify-between">
                                <div className="text-2xl font-bold font-young">Detail Order</div>
                                <ChevronUpIcon className="w-4 h-4 md:w-8 md:h-8" />
                            </div>
                            <hr className="border-t-2 border-text-colors" />

                            {/* Qty */}
                            <div className="flex flex-col gap-2">
                                <label className="font-medium text-xl">
                                    Jumlah <span className="text-red-500">*</span>
                                </label>
                                <div className="flex items-center gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setQty(q => Math.max(1, q - 1))}
                                        className="w-10 h-10 bg-neutral-normal text-white font-bold text-xl hover:bg-neutral-dark transition-colors"
                                    >
                                        −
                                    </button>
                                    <span className="text-2xl font-bold w-8 text-center">{qty}</span>
                                    <button
                                        type="button"
                                        onClick={() => setQty(q => Math.min(item.stock, q + 1))}
                                        className="w-10 h-10 bg-secondary-bg text-white font-bold text-xl hover:bg-secondary-bg-hover transition-colors"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>

                            {/* Size */}
                            {sizeOptions.length > 0 && (
                                <SelectInput
                                    id="size"
                                    name="size"
                                    label="Ukuran"
                                    required
                                    placehold="Pilih ukuran..."
                                    options={sizeOptions}
                                    value={selectedSize}
                                    onChange={e => setSelectedSize(e.target.value)}
                                />
                            )}

                            {/* Color */}
                            {colorOptions.length > 0 && (
                                <SelectInput
                                    id="color"
                                    name="color"
                                    label="Warna"
                                    required
                                    placehold="Pilih warna..."
                                    options={colorOptions}
                                    value={selectedColor}
                                    onChange={e => setSelectedColor(e.target.value)}
                                />
                            )}
                        </div>
                    </RevealSection>

                    {/* Shipping Info */}
                    <RevealSection direction="up">
                        <div className="flex flex-col bg-primary-light border-neutral-normal border-2 p-4 gap-4">
                            <div className="flex justify-between">
                                <div className="text-2xl font-bold font-young">Shipping Info</div>
                                <ChevronUpIcon className="w-4 h-4 md:w-8 md:h-8" />
                            </div>
                            <hr className="border-t-2 border-text-colors" />
                            <InputType
                                label="Shipping Address"
                                id="shippingaddress"
                                required
                                type="text"
                                name="shippingaddress"
                                placeholder="Jl. Contoh No. 1, Kota"
                                className="flex flex-col gap-2"
                                value={shippingAddress}
                                onChange={e => setShippingAddress(e.target.value)}
                            />
                            <InputType
                                label="Shipping Phone"
                                id="shippingphone"
                                required
                                type="text"
                                name="shippingphone"
                                placeholder="08123456789"
                                className="flex flex-col gap-2"
                                value={shippingPhone}
                                onChange={e => setShippingPhone(e.target.value)}
                            />
                        </div>
                    </RevealSection>

                    {/* Payment Details */}
                    <RevealSection direction="up">
                        <div className="flex flex-col bg-primary-light border-neutral-normal border-2 p-4 gap-4">
                            <div className="flex justify-between">
                                <div className="text-2xl font-bold font-young">Payment Details</div>
                                <ChevronUpIcon className="w-4 h-4 md:w-8 md:h-8" />
                            </div>
                            <hr className="border-t-2 border-text-colors" />
                            <div className="flex justify-between">
                                <div className="text-xl font-medium">Merchandise</div>
                                <div className="text-xl font-medium">{item.name}</div>
                            </div>
                            <div className="flex justify-between">
                                <div className="text-xl font-medium">Harga Satuan</div>
                                <div className="text-xl font-medium">Rp. {formatRupiah(item.price)}</div>
                            </div>
                            <div className="flex justify-between">
                                <div className="text-xl font-medium">Jumlah</div>
                                <div className="text-xl font-medium">{qty} pcs</div>
                            </div>
                            <hr className="border-t border-neutral-normal" />
                            <div className="flex justify-between">
                                <div className="text-xl font-bold">Total</div>
                                <div className="text-2xl font-bold">Rp. {formatRupiah(totalPrice)}</div>
                            </div>

                            {/* Instruksi bayar */}
                            <div className=" bg-primary-light-active border border-neutral-normal p-4 text-sm text-neutral-dark">
                                <div className="flex flex-col items-center">
                                    <div className="font-bold mb-1">Cara Pembayaran:</div>
                                    <div>Setelah order dikonfirmasi, silakan transfer ke rekening berikut:</div>
                                    <div className="mt-2 font-semibold">BCA 1234567890 a.n SH3 Event</div>
                                    <div className="mt-1">Atau scan QRIS di bawah ini:</div>
                                    <Image
                                        src="/assets/images/qris.jpeg"
                                        alt="QRIS"
                                        width={300}
                                        height={300}
                                        className="mt-2 object-contain"
                                    />
                                </div>

                            </div>
                        </div>
                    </RevealSection>

                    {/* Submit */}
                    <RevealSection direction="up">
                        <button
                            className={`flex justify-center font-young items-center ${submitLoading ? "bg-neutral-bg" : "bg-secondary-bg hover:bg-secondary-bg-hover active:bg-secondary-bg-active"} h-16 font-bold text-xl text-white md:text-3xl w-full`}
                            type="submit"
                            disabled={submitLoading}
                        >
                            {submitLoading ? "Memproses..." : "Confirm Order"}
                        </button>
                    </RevealSection>
                </form>
            )}

            {/* Invoice setelah order berhasil */}
            {orderResult && userData && (
                <RevealSection direction="up">
                    <div id="invoice-section">
                        <InvoiceMerch
                            name={userData.name}
                            email={userData.email}
                            hash_id={userData.id}
                            invoice_id={orderResult.invoice_number}
                            merch_name={item.name}
                            merch_price={formatRupiah(item.price)}
                            merch_qty={qty}
                            merch_size={selectedSize}
                            merch_color={selectedColor}
                            total_price={formatRupiah(totalPrice)}
                        />
                    </div>
                </RevealSection>
            )}
        </Container>
    )
}