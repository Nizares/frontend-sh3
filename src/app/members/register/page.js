"use client";
import Container from "@/src/components/Container";
import InputType from "@/src/components/Inputs";
import SelectInput from "@/src/components/SelectInput";
import { useState } from "react";
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


  function handleFormChange(e) {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

  async function handleRegister(e) {
    e.preventDefault();

    setSubmitLoading(true);
    try {
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
                style="
                    background:none;
                    border:1px solid #00973D;
                    border-radius:8px;
                    padding:4px 8px;
                    cursor:pointer;
                    color:#00973D;
                    font-size:0.8rem;
                    transition:all 0.2s;
                "
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

      setFormData({ name: "", email: "", phone: "", birthdate: "" });
      setGender("");
    } catch (err) {

      if (!formData.name || !formData.email || !formData.birthdate) {
        Swal.fire({ icon: "warning", title: "Pastikan Datanya terisi semua!" });
        return;
      }
      if (!gender) {
        Swal.fire({ icon: "warning", title: "Pilih gender dulu!" });
        return;
      }
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
    <Container className="flex flex-col gap-y-8 w-full px-4 md:px-0 max-w-306 mx-auto">
      <RevealSection direction="up">
        <div className="flex flex-col flex-1 items-center justify-center p-8">
          <h1 className="text-neutral-normal text-5xl font-bold font-young">
            Ayo jadi bagian dari kami!
          </h1>
        </div>

        <div className="flex flex-col gap-x-16 md:grid md:grid-cols-3">
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
              required
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
              className={`flex justify-center items-center rounded-2xl ${submitLoading ? "bg-neutral-bg" : "bg-secondary-bg hover:bg-secondary-bg-hover"} active:bg-secondary-bg-active h-16 font-bold text-xl text-white m-10 md:text-3xl font-young`}
              type="submit"
              disabled={submitLoading}
            >
              {submitLoading ? "Memproses..." : "Registrasi Member"}
            </button>
          </form>

          <div className="bg-primary-light rounded-lg gap-x-4 p-4 h-fit border-neutral-normal border-2">
            <div className="flex flex-col">
              <h3 className="text-2xl font-bold font-young text-neutral-normal">Benefits Member</h3>
            </div>
            <div className="flex flex-col">
              <ol className="list-decimal list-outside p-2 pl-8 text-2xl text-neutral-normal">
                <li className="mt-2">Mendapatkan Informasi yang Up-to-Date</li>
                <li className="mt-2">Mendapatkan teman yang banyak</li>
                <li className="mt-2">Sesi Down-Down setiap event.</li>
                <li className="mt-2">Lorem Ipsu dolor sir amet.</li>
                <li className="mt-2">Lorem Ipsu dolor sir amet.</li>
              </ol>
            </div>
          </div>
        </div>
      </RevealSection>
    </Container>
  );
}