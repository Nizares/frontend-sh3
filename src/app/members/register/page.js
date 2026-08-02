"use client";
import Container from "@/src/components/Container";
import InputType from "@/src/components/Inputs";
import SelectInput from "@/src/components/SelectInput";
import { useState } from "react";
import { memberService } from "@/src/services/memberService";
import ImageUpload from "@/src/components/ImageUpload";
import PasswordInput from "@/src/components/passwordInput";
import Swal from "sweetalert2";
import { RevealSection } from "@/src/components/RevealSection";
import BatikOverlay from "@/src/components/BatikOverlay";

const genderOptions = [
    { value: "male", label: "Laki-laki" },
    { value: "female", label: "Perempuan" },
];

const bloodTypeOptions = [
    { value: "A", label: "A" },
    { value: "B", label: "B" },
    { value: "AB", label: "AB" },
    { value: "O", label: "O" },
];

const jerseySizeOptions = [
    { value: "XS", label: "XS" },
    { value: "S", label: "S" },
    { value: "M", label: "M" },
    { value: "L", label: "L" },
    { value: "XL", label: "XL" },
    { value: "XXL", label: "XXL" },
];

export default function Members() {
    const [gender, setGender] = useState("");
    const [bloodType, setBloodType] = useState("");
    const [jerseySize, setJerseySize] = useState("");
    const [submitLoading, setSubmitLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        date_of_birth: "",
        address: "",
        emergency_contact: "",
        emergency_phone: "",
        medical_conditions: "",
    });

    function handleFormChange(e) {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    }

    async function handleRegister(e) {
        e.preventDefault();

        if (!formData.name || !formData.email || !formData.phone) {
            Swal.fire({ icon: "warning", title: "Pastikan data wajib terisi semua!" });
            return;
        }
        if (!gender) {
            Swal.fire({ icon: "warning", title: "Pilih gender dulu!" });
            return;
        }

        setSubmitLoading(true);
        try {
            const payload = {
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                gender: gender,
            };

            // Tambah field opsional kalau diisi
            if (formData.date_of_birth) payload.date_of_birth = formData.date_of_birth;
            if (formData.address) payload.address = formData.address;
            if (formData.emergency_contact) payload.emergency_contact = formData.emergency_contact;
            if (formData.emergency_phone) payload.emergency_phone = formData.emergency_phone;
            if (formData.medical_conditions) payload.medical_conditions = formData.medical_conditions;
            if (bloodType) payload.blood_type = bloodType;
            if (jerseySize) payload.jersey_size = jerseySize;

            const res = await memberService.register(payload);
            const { user, token } = res.data;

            // Simpan token langsung
            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(user));

            Swal.fire({
                icon: "success",
                title: "Registrasi Berhasil!",
                html: `
                    <p>Selamat datang, <strong>${user.name}</strong>!</p>
                    <p>Email kamu:</p>
                    <h2 style="font-size:1.5rem;font-weight:bold;color:#00973D;margin:8px 0">
                        ${user.email}
                    </h2>
                    <p style="font-size:0.8rem;color:gray">Gunakan email ini untuk login.</p>
                `,
            });

            // Reset form
            setFormData({
                name: "",
                email: "",
                phone: "",
                date_of_birth: "",
                address: "",
                emergency_contact: "",
                emergency_phone: "",
                medical_conditions: "",
            });
            setGender("");
            setBloodType("");
            setJerseySize("");

        } catch (err) {
            const message = err.response?.data?.message || "Terjadi kesalahan, coba lagi.";
            const errors = err.response?.data?.errors;
            Swal.fire({
                icon: "error",
                title: "Registrasi Gagal!",
                text: errors ? Object.values(errors).flat().join(", ") : message,
            });
        } finally {
            setSubmitLoading(false);
        }
    }

    return (
        <Container className="flex flex-col w-full">
            <div className="relative bg-linear-to-b from-primary-light to-primary-light-hover">
                <BatikOverlay />
                <div className="gap-y-8 px-4 md:px-0 max-w-306 mx-auto">
                    <RevealSection direction="up">
                        <div className="flex flex-col flex-1 items-center justify-center p-8">
                            <h1 className="text-primary-darker text-5xl font-bold font-young mt-16">
                                Ayo jadi bagian dari kami!
                            </h1>
                        </div>

                        <div className="flex flex-col gap-x-16 md:grid md:grid-cols-3">
                            <form onSubmit={handleRegister} className="col-span-1 flex flex-col md:col-span-2 gap-4">

                                {/* Data Dasar */}
                                <h3 className="text-xl font-bold font-young">Data Diri</h3>
                                <InputType label="Nama Lengkap" id="name" required type="text" name="name"
                                    placeholder="John Doe" className="flex flex-col gap-2"
                                    value={formData.name} onChange={handleFormChange} />
                                <InputType label="Email" id="email" required type="email" name="email"
                                    placeholder="you@example.com" className="flex flex-col gap-2"
                                    value={formData.email} onChange={handleFormChange} />
                                <InputType label="Nomor Telepon/WA" type="text" id="phone" required name="phone"
                                    placeholder="08123456789" className="flex flex-col gap-2"
                                    value={formData.phone} onChange={handleFormChange} />
                                <InputType label="Tanggal Lahir" type="date" id="date_of_birth" name="date_of_birth"
                                    className="flex flex-col gap-2"
                                    value={formData.date_of_birth} onChange={handleFormChange} />
                                <SelectInput id="gender" name="gender" label="Gender" required
                                    options={genderOptions} value={gender} placehold="Pilih Gender..."
                                    onChange={(e) => setGender(e.target.value)} />
                                <SelectInput id="blood_type" name="blood_type" label="Golongan Darah"
                                    options={bloodTypeOptions} value={bloodType} placehold="Pilih Golongan Darah..."
                                    onChange={(e) => setBloodType(e.target.value)} />
                                <SelectInput id="jersey_size" name="jersey_size" label="Ukuran Jersey"
                                    options={jerseySizeOptions} value={jerseySize} placehold="Pilih Ukuran Jersey..."
                                    onChange={(e) => setJerseySize(e.target.value)} />
                                <InputType label="Alamat" type="text" id="address" name="address"
                                    placeholder="Jl. Merdeka No. 1, Samarinda"
                                    className="flex flex-col gap-2"
                                    value={formData.address} onChange={handleFormChange} />

                                {/* Kontak Darurat */}
                                <hr className="border-t-2 border-neutral-normal mt-2" />
                                <h3 className="text-xl font-bold font-young">Kontak Darurat</h3>
                                <InputType label="Nama Kontak Darurat" id="emergency_contact" type="text"
                                    name="emergency_contact" placeholder="Nama keluarga/teman"
                                    className="flex flex-col gap-2"
                                    value={formData.emergency_contact} onChange={handleFormChange} />
                                <InputType label="Nomor Kontak Darurat" id="emergency_phone" type="text"
                                    name="emergency_phone" placeholder="08123456789"
                                    className="flex flex-col gap-2"
                                    value={formData.emergency_phone} onChange={handleFormChange} />

                                {/* Info Kesehatan */}
                                <hr className="border-t-2 border-neutral-normal mt-2" />
                                <h3 className="text-xl font-bold font-young">Info Kesehatan</h3>
                                <div className="flex flex-col gap-2">
                                    <label className="text-xl font-medium">Kondisi Medis / Alergi</label>
                                    <textarea
                                        name="medical_conditions"
                                        placeholder="Contoh: alergi debu, asma, dll (isi jika ada)"
                                        className="border-tertiary-normal p-3 text-lg bg-white border-2 rounded-md"
                                        rows={3}
                                        value={formData.medical_conditions}
                                        onChange={handleFormChange}
                                    />
                                </div>

                                <button
                                    className={`flex justify-center items-center mb-8 rounded-md ${submitLoading ? "bg-neutral-bg" : "bg-secondary-bg hover:bg-secondary-bg-hover"} active:bg-secondary-bg-active h-16 font-bold text-xl text-white mt-4 md:text-3xl font-young`}
                                    type="submit"
                                    disabled={submitLoading}
                                >
                                    {submitLoading ? "Memproses..." : "Daftar Sekarang"}
                                </button>
                            </form>

                            <div className="bg-primary-light rounded-lg gap-x-4 p-4 h-fit border-primary-normal border-2">
                                <div className="flex flex-col">
                                    <h3 className="text-2xl font-bold font-young text-primary-normal">Benefits Member</h3>
                                </div>
                                <div className="flex flex-col">
                                    <ol className="list-decimal list-outside p-2 pl-8 text-2xl text-primary-normal">
                                        <li className="mt-2">Mendapatkan Informasi yang Up-to-Date</li>
                                        <li className="mt-2">Mendapatkan teman yang banyak</li>
                                        <li className="mt-2">Sesi Down-Down setiap event.</li>
                                    </ol>
                                </div>
                            </div>
                        </div>
                    </RevealSection>
                </div>
            </div>
        </Container>
    );
}