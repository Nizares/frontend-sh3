"use client"
import Container from "@/components/Container";
import Form from 'next/form'
import InputType from "@/components/Inputs";
import SelectInput from "@/components/SelectInput";
import { useState } from "react"
import Swal from "sweetalert2";

const dummyUsers = [
    { id: "SH3ID000001", name: "Sukoshi Dake", telp_number: "081245121313", email: "sukouko12@gmail.com" },
    { id: "SH3ID000002", name: "Afureru Antze", telp_number: "081245121445", email: "afureru32@gmail.com" },
    { id: "SH3ID000003", name: "Ryo Yamada", telp_number: "081245121071", email: "ryobassist67@gmail.com"  },
]

const genderOptions = [
    { value: "male", label: "Laki-laki" },
    { value: "female", label: "Perempuan" },
]

export default function UpcomingEvents() {
    const [isOpen, setIsOpen] = useState(false)
    const [gender, setGender] = useState("")

    const [searchId, setSearchId] = useState("");
    const [submittedId, setSubmittedId] = useState("");

    const resultid = "HASH06767"

    const filtered = dummyUsers.filter((item) =>
        item.id.toUpperCase() === submittedId.toUpperCase()
    );

    // const handleSearch = () => {
    //     setSubmittedId(searchId);
    // };

    const handleSearch = () => {
        const result = dummyUsers.find(
            (item) => item.id.toUpperCase() === searchId.toUpperCase()
        );

        if (result) {
            Swal.fire({
                icon: "success",
                title: "Data ditemukan!",
                html: `
                    <p>ID: ${result.id}</p>
                    <p>Nama: ${result.name}</p>
                    <p>Telp: ${hidePhone(result.telp_number, 4)}</p>
                `,
            });
        } else {
            Swal.fire({
                icon: "error",
                title: "Data tidak ditemukan",
                text: "Pastikan ID yang kamu masukkan sudah benar.",
            });
        }
    };

    function hidePhone(number, shownNumber = 4) {
        // return number.slice(0, shownNumber) + '*'.repeat(number.length - shownNumber); // 4 nomor diawal
        return '*'.repeat(number.length - shownNumber) + number.slice(-shownNumber); // 4 nomor diakhir
    }

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
            <Form action="" formMethod="get" className="flex flex-col justify-center items-center">
                <InputType
                    label="Masukkan ID Hash Kamu"
                    id="hashid"
                    type="text"
                    name="cariid"
                    placeholder="HASH000001"
                    className="flex flex-col gap-2"
                    value={searchId}
                    onChange={(e) => setSearchId(e.target.value)}
                />
                <button className="flex justify-center items-center rounded-2xl p-8 bg-btn-green-normal hover:to-btn-green-hover active:bg-green-400 h-16 font-bold text-xl text-white m-10 md:text-3xl"
                    type="button"
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