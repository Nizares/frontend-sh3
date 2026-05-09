"use client"
import Container from "@/src/components/Container";
import Form from 'next/form';
import InputType from "@/src/components/Inputs";
import SelectInput from "@/src/components/SelectInput";
import { useState } from "react";
import useSearchMembers from "@/src/hooks/useSearchMembers";

const genderOptions = [
    { value: "male", label: "Laki-laki" },
    { value: "female", label: "Perempuan" },
]

export default function UpcomingEvents() {
    const [isOpen, setIsOpen] = useState(false)
    const [gender, setGender] = useState("")

    const {loading, searchId, setSearchId, handleSearch, handleChange} = useSearchMembers()


    const resultid = "HASH06767"



    return (
        <Container className="flex flex-col gap-y-8 w-full">
            <div className="flex flex-col flex-1 items-center justify-center p-8">
                <h1 className="text-text-colors text-5xl font-bold">Ayo jadi bagian Kami!</h1>
            </div>
            <div className="grid grid-rows-1 gap-x-16 md:grid-cols-3">
                <Form action="" className="col-span-1 flex flex-col md:col-span-2 gap-4">
                    <InputType
                        label="Full Name"
                        id="name"
                        required
                        type="text"
                        name="fullname"
                        placeholder="John Doe"
                        className="flex flex-col gap-2"
                    />
                    <InputType
                        label="Email"
                        id="email"
                        required
                        type="email"
                        name="email"
                        placeholder="you@example.com"
                        className="flex flex-col gap-2"
                    />
                    <InputType
                        label="Nomor Telepon/WA"
                        type="text"
                        id="telpnumber"
                        required
                        name="telpnumber"
                        placeholder="08123456789"
                        className="flex flex-col gap-2"
                    />
                    <InputType
                        label="Tanggal Lahir"
                        type="date"
                        id="birthdate"
                        required
                        name="birthdate"
                        placeholder="01 / 01 / 2001"
                        className="flex flex-col gap-2"
                    />
                    <SelectInput
                        id="gender"
                        name="gender"
                        label="Gender"
                        options={genderOptions}
                        value={gender}
                        placehold="Pilih Gender..."
                        onChange={(e) => setGender(e.target.value)}
                    />
                    <button className="flex justify-center items-center rounded-2xl bg-btn-green-normal hover:to-btn-green-hover active:bg-green-400 h-16 font-bold text-xl text-white m-10 md:text-3xl"
                        type="submit"
                        onClick={() => setIsOpen(!isOpen)}
                    >Registrasi Member</button>
                </Form>
                <div className="bg-card-bg rounded-lg gap-x-4 p-4 h-96">
                    <div className="flex flex-col">
                        <h3 className="text-2xl font-bold">
                            Benefits Member
                        </h3>
                    </div>
                    <div className="flex flex-col">
                        <ol className="list-decimal list-inside p-2 text-2xl">

                            <li>Mendapatkan Informasi yang Up-to-Date</li>
                            <li>Mendapatkan teman yang banyak</li>
                            <li>Sesi Down-Down setiap event.</li>
                            <li>Lorem Ipsu dolor sir amet.</li>
                            <li>Lorem Ipsu dolor sir amet.</li>
                        </ol>
                    </div>
                </div>
            </div>
            <div className={`flex items-center justify-center rounded-2xl text-5xl font-bold 
                ${isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}
                `}>
                HASH ID KAMU : {resultid}
            </div>
            <div className="flex items-center justify-center w-full">
                <h1 className="text-4xl font-bold m-2">
                    Kamu sudah jadi Member?
                </h1>
            </div>
            <Form action="" className="flex flex-col justify-center items-center">
                <InputType
                    label="Masukkan ID Hash Kamu"
                    id="hashid"
                    type="text"
                    name="cariid"
                    placeholder="HASH000001"
                    className="flex flex-col gap-2"
                    value={searchId}
                    onChange={handleChange}
                />
                <button className={`flex justify-center items-center rounded-2xl p-8 ${loading? "bg-gray-500 ":"bg-btn-green-normal" } hover:to-btn-green-hover active:bg-green-400 h-16 font-bold text-xl text-white m-10 md:text-3xl `} 
                    type="button"
                    disabled={loading}
                    onClick={handleSearch}

                >Cek Member</button>
            </Form>
            {/* <div className="flex items-center justify-center rounded-2xl text-3xl font-bold">
                {submittedId && (
                    <div className="flex flex-col gap-2 items-center justify-center rounded-3xl ">

                        {filtered.length > 0 ? (
                            filtered.map((item) => (
                                <div key={item.id} className="text-center bg-card-bg p-8 rounded-lg">
                                    <div className="text-4xl font-bold">
                                        Data ditemukan!
                                    </div>
                                    <p>ID Kamu : {item.id}</p>
                                    <p>Nama Kamu : {item.name}</p>
                                    <p>Nomor Telpon kamu : {hidePhone(item.telp_number, 4)}</p>
                                </div>
                            ))
                        ) : (
                            <p className="text-red-800">Data tidak ditemukan</p>
                        )}
                    </div>
                )}
            </div> */}


        </Container>
    )
}