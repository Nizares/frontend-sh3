"use client"

import Image from "next/image";
import Link from "next/link";
import Form from "next/form";

import Container from "@/src/components/Container";
import SelectInput from "@/src/components/SelectInput";
import InputType from "@/src/components/Inputs";
import ImageUpload from "@/src/components/ImageUpload";

import { ArrowLongLeftIcon } from "@heroicons/react/24/outline";
import { MapPinIcon } from "@heroicons/react/24/solid";
import { ChevronUpIcon } from "@heroicons/react/24/solid";
import { useState } from "react";

import useSearchDataMembers from "@/src/hooks/useSearchDataMembers";

import { concateDate } from "@/src/lib/utils";
import { formatRupiah } from "@/src/lib/utils";


const dummyEvents = [
    {
        id: "1",
        title: "Borneo Nash Hash 2027",
        start_date: "2027-10-23",
        end_date: "2027-10-24",
        category: "Long Run",
        img: "/assets/images/poster2027.jpg",
        status: "ongoing",
        eventog: "Samarinda Hash House Harriers",

        price: 900000,
        slot: 300
    },
]

const orderDetail = [
    {
        order_id: "EVE0001"
    }
]

const paymentOptions = [
    { value: "bca", label: "Bank Transfer BCA", NoRek: "0273178314", nama: "Muhammad Nizar", image: "/assets/icon/bca.png" },
    { value: "Mandiri", label: "Bank Transfer Mandiri", NoRek: "14400000011", nama: "Muhammad Nizar", image: "/assets/icon/mandiri.png" },
    { value: "bri", label: "Bank Transfer BRI", NoRek: "14400000011", nama: "Muhammad Nizar", image: "/assets/icon/bri.png" },
    { value: "dana", label: "DANA", NoRek: "08123456789", nama: "Muhammad Nizar", image: "/assets/icon/dana.png" },
    { value: "ovo", label: "OVO", NoRek: "08123456789", nama: "Muhammad Nizar", image: "/assets/icon/ovo.png" },
    { value: "gopay", label: "GoPay", NoRek: "08123456789", nama: "Muhammad Nizar", image: "/assets/icon/gopay.png" },
]

export default function RegisterEvent() {
    const event = dummyEvents[0];
    const ordDetail = orderDetail[0];
    const [payOptions, setPayOptions] = useState("");

    const selectedBank = paymentOptions.find((payment) => payment.value === payOptions);

    const {loading, id, setId, userData, error, checkTheID } = useSearchDataMembers()

    function submitPembayaran(e) {
        e.preventDefault();
        console.log("Submit pembayaran:", { id, ...userData });
    }

    // const [gender, setGender] = useState("");
    return (
        <Container className="flex flex-col gap-y-4 w-full">
            <Link href="/events" className="static md:absolute">
                <ArrowLongLeftIcon className="w-8 h-8 md:w-16 md:h-16" />
            </Link>
            <div className="flex items-center justify-center w-full">
                <h1 className="text-4xl font-bold ">
                    {event.title}
                </h1>
            </div>

            <div className="flex flex-row justify-between gap-x-2">
                <div className="flex flex-row justify-center gap-x-2">
                    <MapPinIcon className="w-8 h-8" />
                    <div className="text-lg font-bold">Samarinda, Kalimantan Timur</div>
                </div>
                <div className="flex flex-row gap-x-2">
                    <div className="text-lg font-bold"> {concateDate(event.start_date, event.end_date)}</div>
                </div>
            </div>
            <Image
                src={event.img}
                alt="Logo"
                width={600}
                height={450}
                className="
            h-128 w-full
            flex 
            object-cover rounded-lg
            "
            />
            <div className="text-5xl font-bold p-8">
                TICKET #{ordDetail.order_id}
            </div>
            <div className="flex justify-center gap-8 flex-col md:flex-row">
                <div className="bg-card-bg rounded-lg p-4 w-full">
                    <div className="flex flex-col">
                        <h3 className="text-2xl font-bold">
                            Early Bid
                        </h3>
                        <div className="text-sm line-through">
                            Rp. 1.400.000
                        </div>
                        <div className="text-lg font-bold">
                            Rp. {formatRupiah(event.price)}/person
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <ol className="list-decimal list-inside p-2">

                            <li>2-Day Hash Trails</li>
                            <li>Welcome Pack & Jersey</li>
                            <li>Welcome Dinner</li>
                            <li>Circle & Down-Down</li>
                            <li>Bisa dicicil</li>
                        </ol>
                        <div className="text-xl font-bold">
                            Event Organizer
                        </div>
                        <div className="text-lg font-semibold">
                            {event.eventog}
                        </div>
                    </div>
                </div>
                <div className="flex flex-col items-center justify-center bg-card-bg rounded-lg p-4 w-full">
                    <div className="font-bold text-3xl">
                        Slot Tersisa:
                    </div>
                    <div className="font-bold text-5xl">
                        {event.slot}
                    </div>
                </div>
            </div>

            <Form onSubmit={submitPembayaran} className="flex flex-col gap-8">
                <div className="flex flex-col bg-card-bg rounded-lg p-4 gap-4">
                    <div className="flex justify-between">
                        <div className="text-2xl font-bold">
                            Customer Information
                        </div>
                        <ChevronUpIcon className="w-4 h-4 md:w-8 md:h-8" />
                    </div>
                    <hr className="border-t-2 border-text-colors" />
                    <div className="grid grid-cols-2 w-full items-center md:grid-cols-3 gap-8">
                        <InputType
                            label="ID Hash"
                            id="hashid"
                            type="text"
                            name="idhash"
                            required
                            placeholder="HASH000001"
                            className="flex flex-col gap-2 col-span-1 md:col-span-2"
                            onChange={e => setId(e.target.value)}
                            value={id}
                        />
                        <button className={`flex justify-center items-center rounded-2xl ${loading ? "bg-gray-500" : "bg-btn-green-normal hover:to-btn-green-hover"}  active:bg-green-400 font-bold text-xl text-white md:text-2xl w-full h-full`}
                            type="button"
                            disabled={loading}
                            onClick={checkTheID}
                        >Check ID</button>
                    </div>
                    {error && <p className="text-red-500 font-medium text-3xl">{error}</p>}

                    {userData && (
                        <>
                            <InputType
                                label="Full Name"
                                id="name"
                                required
                                type="text"
                                name="fullname"
                                placeholder="John Doe"
                                className="flex flex-col gap-2"
                                value={userData.name}
                                readOnly
                            />
                            <InputType
                                label="Email"
                                id="email"
                                required
                                type="email"
                                name="email"
                                placeholder="you@example.com"
                                className="flex flex-col gap-2"
                                value={userData.email}
                                readOnly
                            />
                            <InputType
                                label="Nomor Telepon/WA"
                                type="text"
                                id="telpnumber"
                                required
                                name="telpnumber"
                                placeholder="08123456789"
                                className="flex flex-col gap-2"
                                value={userData.telp_number}
                                readOnly
                            />
                        </>

                    )}



                </div>
                <div className="flex flex-col bg-card-bg rounded-lg p-4 gap-4">
                    <div className="flex justify-between">
                        <div className="text-2xl font-bold">
                            Payment Details
                        </div>
                        <ChevronUpIcon className="w-4 h-4 md:w-8 md:h-8" />
                    </div>
                    <hr className="border-t-2 border-text-colors" />
                    <div className="flex justify-between">
                        <div className="text-xl font-medium">
                            Event Name
                        </div>
                        <div className="text-xl font-medium">
                            {event.title}
                        </div>
                    </div>
                    <div className="flex justify-between">
                        <div className="text-xl font-medium">
                            Event Price
                        </div>
                        <div className="text-xl font-medium">
                            Rp. {formatRupiah(event.price)}
                        </div>
                    </div>
                    <div className="flex justify-between">
                        <div className="text-xl font-bold">
                            Total
                        </div>
                        <div className="text-2xl font-bold text-orange-400">
                            Rp. {formatRupiah(event.price)}
                        </div>
                    </div>
                </div>

                <div className="flex flex-col bg-card-bg rounded-lg p-4 gap-4">
                    <div className="flex justify-between">
                        <div className="text-2xl font-bold">
                            Payment Process
                        </div>
                        <ChevronUpIcon className="w-4 h-4 md:w-8 md:h-8" />
                    </div>
                    <hr className="border-t-2 border-text-colors" />
                    <SelectInput
                        id="payoption"
                        name="payoption"
                        label="Payment Options"
                        options={paymentOptions}
                        value={payOptions}
                        placehold="Pilih Pembayaran..."
                        onChange={(e) => setPayOptions(e.target.value)}
                    />
                    <div className="flex flex-col items-center justify-center p-8">
                        {
                            selectedBank && (
                                <div className="flex flex-row gap-8">
                                    <Image
                                        src={selectedBank.image}
                                        alt={selectedBank.nama}
                                        width={150}
                                        height={100}
                                        className="
                                        flex 
                                        object-contain rounded-lg
                                        "
                                    />
                                    <div className="flex flex-col">
                                        <div className="font-semibold text-lg">
                                            {selectedBank.nama}
                                        </div>
                                        <div className="font-semibold text-lg">
                                            {selectedBank.NoRek}
                                        </div>
                                    </div>

                                </div>

                            )
                        }
                        <div className="text-2xl font-bold m-8">
                            atau
                        </div>
                        <Image
                            src="/assets/images/qris.jpeg"
                            alt="Logo"
                            width={450}
                            height={600}
                            className="
                            flex 
                            object-cover rounded-lg
                            items-center justify-center
                            "
                        />
                    </div>

                    <div className="text-2xl font-bold">
                        Upload Proof of Payment
                    </div>
                    <ImageUpload id="paymentproof" label="Payment Proof" required />
                    <button className="flex justify-center items-center rounded-2xl bg-btn-green-normal hover:to-btn-green-hover active:bg-green-400 h-16 font-bold text-xl text-white m-10 md:text-3xl"
                        type="submit"
                    >Confirm Payment</button>
                </div>
            </Form>

        </Container>
    )
}