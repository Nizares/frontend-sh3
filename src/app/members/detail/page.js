"use client"
import useSearchMembers from "@/src/hooks/useSearchMembers";
import InputType from "@/src/components/Inputs";
import SelectInput from "@/src/components/SelectInput";
import ImageUpload from "@/src/components/ImageUpload";
import { RevealSection } from "@/src/components/RevealSection";
import { useState, useEffect } from "react";
import { profileService } from "@/src/services/profileService";
import Swal from "sweetalert2";

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

export default function DetailMember() {
    const { loading, searchId, handleChange, handleSearch, userData } = useSearchMembers();
    const [showEditForm, setShowEditForm] = useState(false);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [photo, setPhoto] = useState(null);
    const [identityPhoto, setIdentityPhoto] = useState(null);
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        gender: "",
        birthdate: "",
        blood_type: "",
        emergency_contact: "",
        emergency_phone: "",
        allergy_history: "",
        identity_number: "",
    });

    // Auto isi form ketika userData berhasil didapat
    useEffect(() => {
        if (userData) {
            setShowEditForm(false); // reset form kalau cek ID baru
            setFormData({
                name: userData.name ?? "",
                phone: userData.phone ?? "",
                gender: userData.gender ?? "",
                birthdate: userData.birthdate ?? "",
                blood_type: userData.blood_type ?? "",
                emergency_contact: userData.emergency_contact ?? "",
                emergency_phone: userData.emergency_phone ?? "",
                allergy_history: userData.allergy_history ?? "",
                identity_number: userData.identity_number ?? "",
            });
        }
    }, [userData]);

    function handleFormChange(e) {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    }

    async function handleUpdateProfile(e) {
        e.preventDefault();
        setSubmitLoading(true);
        try {
            // Hanya kirim field yang terisi saja
            const payload = {};
            if (formData.name) payload.name = formData.name;
            if (formData.phone) payload.phone = formData.phone;
            if (formData.gender) payload.gender = formData.gender;
            if (formData.birthdate) payload.birthdate = formData.birthdate;
            if (formData.blood_type) payload.blood_type = formData.blood_type;
            if (formData.emergency_contact) payload.emergency_contact = formData.emergency_contact;
            if (formData.emergency_phone) payload.emergency_phone = formData.emergency_phone;
            if (formData.allergy_history) payload.allergy_history = formData.allergy_history;
            if (formData.identity_number) payload.identity_number = formData.identity_number;

            await profileService.update(payload);

            // Upload foto profil kalau ada
            if (photo) {
                const photoForm = new FormData();
                photoForm.append("photo", photo);
                await profileService.uploadPhoto(photoForm);
            }

            Swal.fire({
                icon: "success",
                title: "Profil Berhasil Diupdate!",
                text: "Data kamu sudah tersimpan.",
            });
            setShowEditForm(false);

        } catch (err) {
            const message = err.response?.data?.message || "Terjadi kesalahan, coba lagi.";
            const errors = err.response?.data?.errors;
            Swal.fire({
                icon: "error",
                title: "Gagal Update!",
                text: errors ? Object.values(errors).flat().join(", ") : message,
            });
        } finally {
            setSubmitLoading(false);
        }
    }

    return (
        <div className="flex flex-col gap-y-8 w-full px-4 md:px-0 max-w-306 mx-auto">

            {/* Section Cek Hash ID */}
            <RevealSection direction="up">
                <div className="flex items-center justify-center w-full mt-8">
                    <h1 className="text-4xl font-bold m-2 font-young">Kamu sudah jadi Member?</h1>
                </div>
                <div className="flex flex-col justify-center items-center gap-4">
                    <InputType
                        label="Masukkan ID Hash Kamu"
                        id="hashid"
                        type="text"
                        name="cariid"
                        placeholder="SH3ID000001"
                        className="flex flex-col gap-2"
                        value={searchId}
                        onChange={handleChange}
                    />
                    <button
                        className={`flex justify-center items-center p-8 ${loading ? "bg-neutral-bg-active" : "bg-secondary-bg"} hover:bg-secondary-bg-hover active:bg-secondary-bg-active h-16 font-bold text-xl text-white m-10 md:text-3xl font-young`}
                        type="button"
                        disabled={loading}
                        onClick={handleSearch}
                    >
                        {loading ? "Mencari..." : "Cek Member"}
                    </button>
                </div>
            </RevealSection>

            {/* Data User — muncul setelah ditemukan */}
            {userData && (
                <RevealSection direction="up">
                    <div className="flex flex-col gap-4 bg-card-bg p-8 border-2 bg-primary-light border-neutral-normal">
                        <h2 className="text-3xl font-bold font-young text-neutral-normal">Data Member</h2>
                        <hr className="border-t-2 border-neutral-normal" />

                        {/* Tampilan data user */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-lg">
                            <div>
                                <span className="font-semibold">Hash ID: </span>
                                <span className="font-mono">{userData.hash_id}</span>
                            </div>
                            <div>
                                <span className="font-semibold">Nama: </span>
                                <span>{userData.name}</span>
                            </div>
                            <div>
                                <span className="font-semibold">Email: </span>
                                <span>{userData.email}</span>
                            </div>
                            <div>
                                <span className="font-semibold">Tipe: </span>
                                <span className={`font-bold ${userData.participant_type === 'member' ? 'text-secondary-dark' : 'text-tertiary-bg'}`}>
                                    {userData.participant_type === 'member' ? 'Member' : 'Non Member'}
                                </span>
                            </div>
                        </div>

                        {/* Tombol Edit Profil */}
                        {!showEditForm && (
                            <button
                                onClick={() => setShowEditForm(true)}
                                className="flex justify-center items-center bg-secondary-bg hover:bg-secondary-bg-hover active:bg-secondary-bg-active h-16 font-bold text-xl text-white mt-4 md:text-2xl font-young"
                            >
                                Edit Profil
                            </button>
                        )}
                    </div>
                </RevealSection>
            )}

            {/* Form Edit Profile — muncul setelah klik tombol */}
            {userData && showEditForm && (
                <RevealSection direction="up">
                    <div className="flex flex-col gap-4 bg-card-bg p-8 border-2 border-neutral-normal bg-primary-light">
                        <div className="flex justify-between items-center">
                            <h2 className="text-3xl font-bold font-young text-neutral-normal">Edit Profil</h2>
                            <button
                                onClick={() => setShowEditForm(false)}
                                className="font-medium px-8 py-2  text-secondary-bg bg-transparent border-2 border-secondary-bg hover:border-transparent hover:bg-secondary-bg hover:text-white active:border-transparent active:bg-secondary-bg active:text-white focus:border-transparent focus:bg-secondary-bg focus:text-white transition-all"
                            >
                                Batal
                            </button>
                        </div>
                        <hr className="border-t-2 border-neutral-normal" />

                        <form onSubmit={handleUpdateProfile} className="flex flex-col gap-4">

                            <h3 className="text-xl font-bold font-young">Data Diri</h3>
                            <InputType label="Nama Lengkap" id="name" type="text" name="name"
                                placeholder="John Doe" className="flex flex-col gap-2"
                                value={formData.name} onChange={handleFormChange} />
                            <InputType label="Nomor Telepon/WA" id="phone" type="text" name="phone"
                                placeholder="08123456789" className="flex flex-col gap-2"
                                value={formData.phone} onChange={handleFormChange} />
                            <SelectInput id="gender" name="gender" label="Gender"
                                options={genderOptions} value={formData.gender}
                                placehold="Pilih Gender..."
                                onChange={e => setFormData(prev => ({ ...prev, gender: e.target.value }))} />
                            <InputType label="Tanggal Lahir" id="birthdate" type="date" name="birthdate"
                                className="flex flex-col gap-2"
                                value={formData.birthdate} onChange={handleFormChange} />
                            <SelectInput id="blood_type" name="blood_type" label="Golongan Darah"
                                options={bloodTypeOptions} value={formData.blood_type}
                                placehold="Pilih Golongan Darah..."
                                onChange={e => setFormData(prev => ({ ...prev, blood_type: e.target.value }))} />
                            <hr className="border-t-2 border-neutral-normal" />
                            <h3 className="text-xl font-bold font-young">Kontak Darurat</h3>
                            <InputType label="Nama Kontak Darurat" id="emergency_contact" type="text"
                                name="emergency_contact" placeholder="Nama keluarga/teman"
                                className="flex flex-col gap-2"
                                value={formData.emergency_contact} onChange={handleFormChange} />
                            <InputType label="Nomor Kontak Darurat" id="emergency_phone" type="text"
                                name="emergency_phone" placeholder="08123456789"
                                className="flex flex-col gap-2"
                                value={formData.emergency_phone} onChange={handleFormChange} />

                            <hr className="border-t-2 border-neutral-normal" />
                            <h3 className="text-xl font-bold font-young">Info Kesehatan</h3>
                            <div className="flex flex-col gap-2">
                                <label className="text-xl font-medium">Riwayat Alergi</label>
                                <textarea
                                    name="allergy_history"
                                    placeholder="Contoh: alergi debu, makanan laut, dll"
                                    className="border-tertiary-normal p-3 text-lg bg-white border-2"
                                    rows={3}
                                    value={formData.allergy_history}
                                    onChange={handleFormChange}
                                />
                            </div>
                            <hr className="border-t-2 border-neutral-normal" />
                            <h3 className="text-xl font-bold font-young">Identitas</h3>
                            <InputType label="Nomor KTP/Passport" id="identity_number" type="text"
                                name="identity_number" placeholder="3201234567890001"
                                className="flex flex-col gap-2"
                                value={formData.identity_number} onChange={handleFormChange} />
                            <ImageUpload id="identity_photo" label="Foto KTP/Passport"
                                onChange={file => setIdentityPhoto(file)} />

                            <hr className="border-t-2 border-neutral-normal" />
                            <h3 className="text-xl font-bold mt-4 font-young">Foto Profil</h3>
                            <ImageUpload id="photo" label="Foto Profil"
                                onChange={file => setPhoto(file)} />

                            <div className="flex gap-4 mt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowEditForm(false)}
                                    className="flex-1 flex justify-center items-center h-16 font-bold text-xl font-young text-secondary-bg bg-transparent border-2 border-secondary-bg hover:border-transparent hover:bg-secondary-bg hover:text-white active:border-transparent active:bg-secondary-bg active:text-white focus:border-transparent focus:bg-secondary-bg focus:text-white transition-all"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitLoading}
                                    className={`flex-1 flex justify-center items-center ${submitLoading ? "bg-neutral-bg" : "bg-secondary-bg hover:bg-secondary-bg-hover"} active:bg-secondary-bg-active h-16 font-bold text-xl text-white font-young`}
                                >
                                    {submitLoading ? "Menyimpan..." : "Simpan Perubahan"}
                                </button>
                            </div>
                        </form>
                    </div>
                </RevealSection>
            )}
        </div>
    );
}