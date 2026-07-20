"use client";
import Container from "@/src/components/Container";
import InputType from "@/src/components/Inputs";
import SelectInput from "@/src/components/SelectInput";
import { useState } from "react";
import { memberService } from "@/src/services/memberService";
import ImageUpload from "@/src/components/ImageUpload";
import Swal from "sweetalert2";
import { RevealSection } from "@/src/components/RevealSection";
import PasswordInput from "@/src/components/passwordInput";
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

export default function Members() {
    const [gender, setGender] = useState("");
    const [bloodType, setBloodType] = useState("");
    const [photo, setPhoto] = useState(null);
    const [identityPhoto, setIdentityPhoto] = useState(null);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const [password, setPassword] = useState("");
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        birthdate: "",
        emergency_contact: "",
        emergency_phone: "",
        allergy_history: "",
        identity_number: "",
    });

    function handleFormChange(e) {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    }

    async function handleRegister(e) {
        e.preventDefault();

        if (!formData.name || !formData.email || !formData.phone || !formData.birthdate) {
            Swal.fire({ icon: "warning", title: "Pastikan data wajib terisi semua!" });
            return;
        }
        if (!gender) {
            Swal.fire({ icon: "warning", title: "Pilih gender dulu!" });
            return;
        }

        if (password !== passwordConfirm) {
            Swal.fire({ icon: "warning", title: "Password tidak cocok!" });
            return;
        }
        if (password.length < 6) {
            Swal.fire({ icon: "warning", title: "Password minimal 6 karakter!" });
            return;
        }

        setSubmitLoading(true);
        try {
            const form = new FormData();
            form.append("name", formData.name);
            form.append("email", formData.email);
            form.append("phone", formData.phone);
            form.append("birthdate", formData.birthdate);
            form.append("password", password);
            form.append("password_confirmation", passwordConfirm);
            form.append("gender", gender);
            if (bloodType) form.append("blood_type", bloodType);
            if (formData.emergency_contact) form.append("emergency_contact", formData.emergency_contact);
            if (formData.emergency_phone) form.append("emergency_phone", formData.emergency_phone);
            if (formData.allergy_history) form.append("allergy_history", formData.allergy_history);
            if (formData.identity_number) form.append("identity_number", formData.identity_number);
            if (photo) form.append("photo", photo);
            if (identityPhoto) form.append("identity_photo", identityPhoto);

            const res = await memberService.register(form);
            const { participant } = res.data.data;

            Swal.fire({
                icon: "success",
                title: "Registrasi Berhasil!",
                html: `
                    <p>Selamat datang, <strong>${participant.name}</strong>!</p>
                    <p>Hash ID kamu:</p>
                    <div style="display:flex; align-items:center; justify-content:center; gap:8px; margin:8px 0">
                        <h2 id="hash-id-text" style="font-size:2rem;font-weight:bold;color:#00973D;margin:0">
                            ${participant.hash_id}
                        </h2>
                        <button 
                            id="copy-btn"
                            style="background:none;border:1px solid #00973D;border-radius:8px;padding:4px 8px;cursor:pointer;color:#00973D;font-size:0.8rem;transition:all 0.2s;"
                        >
                            Copy
                        </button>
                    </div>
                    <p style="font-size:0.8rem;color:gray">Simpan Hash ID ini untuk login dan daftar event.</p>
                `,
                didOpen: () => {
                    const copyBtn = document.getElementById("copy-btn");
                    const hashIdText = document.getElementById("hash-id-text");
                    copyBtn.addEventListener("click", () => {
                        navigator.clipboard.writeText(hashIdText.innerText).then(() => {
                            copyBtn.innerText = "Copied!";
                            copyBtn.style.borderColor = "gray";
                            copyBtn.style.color = "gray";
                            setTimeout(() => {
                                copyBtn.innerText = "Copy";
                                copyBtn.style.borderColor = "#00973D";
                                copyBtn.style.color = "#00973D";
                            }, 2000);
                        });
                    });
                }
            });

            localStorage.setItem("token", res.data.data.token);
            localStorage.setItem("user", JSON.stringify(participant));

            // Reset form
            setFormData({ name: "", email: "", phone: "", birthdate: "", emergency_contact: "", emergency_phone: "", allergy_history: "", identity_number: "" });
            setGender("");
            setBloodType("");
            setPhoto(null);
            setIdentityPhoto(null);


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
        <Container className="flex flex-col  w-full ">
            <div className="relative bg-linear-to-br from-primary-light via-primary-light-active to-primary-light">
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
                                <InputType label="Full Name" id="name" required type="text" name="name"
                                    placeholder="John Doe" className="flex flex-col gap-2"
                                    value={formData.name} onChange={handleFormChange} />
                                <InputType label="Email" id="email" required type="email" name="email"
                                    placeholder="you@example.com" className="flex flex-col gap-2"
                                    value={formData.email} onChange={handleFormChange} />
                                <PasswordInput
                                    label="Password"
                                    id="password"
                                    required
                                    name="password"
                                    placeholder="••••••••"
                                    className="flex flex-col gap-2"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                />

                                <PasswordInput
                                    label="Konfirmasi Password"
                                    id="password_confirmation"
                                    required
                                    name="password_confirmation"
                                    placeholder="••••••••"
                                    className="flex flex-col gap-2"
                                    value={passwordConfirm}
                                    onChange={e => setPasswordConfirm(e.target.value)}
                                />
                                <InputType label="Nomor Telepon/WA" type="text" id="phone" required name="phone"
                                    placeholder="08123456789" className="flex flex-col gap-2"
                                    value={formData.phone} onChange={handleFormChange} />
                                <InputType label="Tanggal Lahir" type="date" id="birthdate" required name="birthdate"
                                    className="flex flex-col gap-2"
                                    value={formData.birthdate} onChange={handleFormChange} />
                                <SelectInput id="gender" name="gender" label="Gender" required
                                    options={genderOptions} value={gender} placehold="Pilih Gender..."
                                    onChange={(e) => setGender(e.target.value)} />
                                <SelectInput id="blood_type" name="blood_type" label="Golongan Darah" required
                                    options={bloodTypeOptions} value={bloodType} placehold="Pilih Golongan Darah..."
                                    onChange={(e) => setBloodType(e.target.value)} />

                                {/* Kontak Darurat */}
                                <hr className="border-t-2 border-neutral-normal mt-2" />
                                <h3 className="text-xl font-bold font-young">Kontak Darurat</h3>
                                <InputType label="Nama Kontak Darurat" id="emergency_contact" type="text" required
                                    name="emergency_contact" placeholder="Nama keluarga/teman"
                                    className="flex flex-col gap-2"
                                    value={formData.emergency_contact} onChange={handleFormChange} />
                                <InputType label="Nomor Kontak Darurat" id="emergency_phone" type="text" required
                                    name="emergency_phone" placeholder="08123456789"
                                    className="flex flex-col gap-2"
                                    value={formData.emergency_phone} onChange={handleFormChange} />

                                {/* Info Kesehatan */}
                                <hr className="border-t-2 border-neutral-normal mt-2" />
                                <h3 className="text-xl font-bold font-young">Info Kesehatan</h3>
                                <div className="flex flex-col gap-2">
                                    <label className="text-xl font-medium">Riwayat Alergi<span className="text-red-500 ml-0.5">*</span></label>
                                    <textarea
                                        name="allergy_history"
                                        placeholder="Contoh: alergi debu, makanan laut, dll"
                                        className="border-tertiary-normal p-3 text-lg bg-white border-2 rounded-md"
                                        rows={3}
                                        value={formData.allergy_history}
                                        onChange={handleFormChange}
                                    />
                                </div>

                                {/* Identitas */}
                                <hr className="border-t-2 border-neutral-normal mt-2" />
                                <h3 className="text-xl font-bold font-young">Identitas</h3>
                                <InputType label="Nomor KTP/Passport" id="identity_number" type="text" required
                                    name="identity_number" placeholder="3201234567890001"
                                    className="flex flex-col gap-2"
                                    value={formData.identity_number} onChange={handleFormChange} />
                                <ImageUpload id="identity_photo" label="Foto KTP/Passport" required
                                    onChange={file => setIdentityPhoto(file)} />

                                {/* Foto Profil */}
                                <hr className="border-t-2 border-neutral-normal mt-2" />
                                <h3 className="text-xl font-bold font-young">Foto Profil</h3>
                                <ImageUpload id="photo" label="Foto Profil"
                                    onChange={(file) => setPhoto(file)} />

                                <button
                                    className={`flex justify-center items-center mb-8 rounded-md ${submitLoading ? "bg-neutral-normal " : "bg-secondary-bg hover:bg-secondary-bg-hover"} active:bg-secondary-bg-active h-16 font-bold text-xl text-white mt-4 md:text-3xl font-young`}
                                    type="submit"
                                    disabled={submitLoading}
                                >
                                    {submitLoading ? "Memproses..." : "Registrasi Member"}
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