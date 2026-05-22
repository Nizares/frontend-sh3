"use client";
import Container from "@/src/components/Container";
import InputType from "@/src/components/Inputs";
import SelectInput from "@/src/components/SelectInput";
import { useState } from "react";
import useSearchMembers from "@/src/hooks/useSearchMembers";
import { memberService } from "@/src/services/memberService";
import ImageUpload from "@/src/components/ImageUpload";
import Swal from "sweetalert2";
import { RevealSection } from "@/src/components/RevealSection";

const genderOptions = [
  { value: "male", label: "Laki-laki" },
  { value: "female", label: "Perempuan" },
];

export default function Members() {
  const [gender, setGender] = useState("");
  const [photo, setPhoto] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    birthdate: "",
  });

  const { loading, searchId, setSearchId, handleSearch, handleChange } =
    useSearchMembers();

  function handleFormChange(e) {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

  async function handleRegister(e) {
    e.preventDefault();

    if (!gender) {
      Swal.fire({ icon: "warning", title: "Pilih gender dulu!" });
      return;
    }

    setSubmitLoading(true);
    try {
      // Pakai FormData karena ada kemungkinan upload photo
      const form = new FormData();
      form.append("name", formData.name);
      form.append("email", formData.email);
      form.append("phone", formData.phone);
      form.append("birthdate", formData.birthdate);
      form.append("gender", gender);
      if (photo) {
        form.append("photo", photo);
      }

      const res = await memberService.register(form);
      const { participant } = res.data.data; // ← sesuai response backend

      Swal.fire({
        icon: "success",
        title: "Registrasi Berhasil!",
        html: `
                <p>Selamat datang, <strong>${participant.name}</strong>!</p>
                <p>Hash ID kamu:</p>
                <h2 style="font-size:2rem;font-weight:bold;color:#00973D">${participant.hash_id}</h2>
                <p style="font-size:0.8rem">Simpan Hash ID ini untuk login dan daftar event.</p>
            `,
      });

      // Simpan token langsung supaya user tidak perlu login lagi
      localStorage.setItem("token", res.data.data.token);
      localStorage.setItem("user", JSON.stringify(participant));

      // Reset form
      setFormData({ name: "", email: "", phone: "", birthdate: "" });
      setGender("");
    } catch (err) {
      const message =
        err.response?.data?.message || "Terjadi kesalahan, coba lagi.";
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
    <Container className="flex flex-col gap-y-8 w-full">
      <RevealSection direction="up">
        <div className="flex flex-col flex-1 items-center justify-center p-8">
          <h1 className="text-text-colors text-5xl font-bold">
            Ayo jadi bagian Kami!
          </h1>
        </div>

        <div className="grid grid-rows-1 gap-x-16 md:grid-cols-3">
          <form
            onSubmit={handleRegister}
            className="col-span-1 flex flex-col md:col-span-2 gap-4"
          >
            <InputType
              label="Full Name"
              id="name"
              required
              type="text"
              name="name"
              placeholder="John Doe"
              className="flex flex-col gap-2"
              value={formData.name}
              onChange={handleFormChange}
            />
            <InputType
              label="Email"
              id="email"
              required
              type="email"
              name="email"
              placeholder="you@example.com"
              className="flex flex-col gap-2"
              value={formData.email}
              onChange={handleFormChange}
            />
            <InputType
              label="Nomor Telepon/WA"
              type="text"
              id="phone"
              required
              name="phone"
              placeholder="08123456789"
              className="flex flex-col gap-2"
              value={formData.phone}
              onChange={handleFormChange}
            />
            <InputType
              label="Tanggal Lahir"
              type="date"
              id="birthdate"
              required
              name="birthdate"
              className="flex flex-col gap-2"
              value={formData.birthdate}
              onChange={handleFormChange}
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
            <ImageUpload
              id="photo"
              label="Foto Profil"
              onChange={(file) => setPhoto(file)}
            />
            <button
              className={`flex justify-center items-center rounded-2xl ${submitLoading ? "bg-gray-500" : "bg-btn-green-normal hover:bg-btn-green-hover"} active:bg-green-400 h-16 font-bold text-xl text-white m-10 md:text-3xl`}
              type="submit"
              disabled={submitLoading}
            >
              {submitLoading ? "Memproses..." : "Registrasi Member"}
            </button>
          </form>

          <div className="bg-card-bg rounded-lg gap-x-4 p-4 h-96">
            <div className="flex flex-col">
              <h3 className="text-2xl font-bold">Benefits Member</h3>
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
      </RevealSection>

      <RevealSection direction="up">
        {/* Cek Member */}
        <div className="flex items-center justify-center w-full">
          <h1 className="text-4xl font-bold m-2">Kamu sudah jadi Member?</h1>
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
            className={`flex justify-center items-center rounded-2xl p-8 ${loading ? "bg-gray-500" : "bg-btn-green-normal"} hover:bg-btn-green-hover active:bg-green-400 h-16 font-bold text-xl text-white m-10 md:text-3xl`}
            type="button"
            disabled={loading}
            onClick={handleSearch}
          >
            {loading ? "Mencari..." : "Cek Member"}
          </button>
        </div>
      </RevealSection>
    </Container>
  );
}
