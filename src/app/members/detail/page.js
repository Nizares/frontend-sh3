/* eslint-disable @next/next/no-img-element */
"use client";

import useSearchMembers from "@/src/hooks/useSearchMembers";
import InputType from "@/src/components/Inputs";
import SelectInput from "@/src/components/SelectInput";
import Container from "@/src/components/Container";
import ImageUpload from "@/src/components/ImageUpload";
import { RevealSection } from "@/src/components/RevealSection";
import { useState, useEffect } from "react";
import { profileService } from "@/src/services/profileService";
import { eventService } from "@/src/services/eventService";
import Link from "next/link";
import Swal from "sweetalert2";
import { dateConverted } from "@/src/lib/utils";
import BatikOverlay from "@/src/components/BatikOverlay";
import { useAuth } from "@/src/contexts/AuthContext";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { PencilIcon } from "@heroicons/react/24/outline";

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

export default function DetailMember() {
  const { user, logout, isLoggedIn } = useAuth();
  const [isMounted, setIsMounted] = useState(false);
  const {
    loading,
    searchId,
    setSearchId,
    password,
    handlePasswordChange,
    handleSearch,
    handleChange,
    userData,
    setUserData,
  } = useSearchMembers();

  const [showPassword, setShowPassword] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [avatar, setAvatar] = useState(null);
  const [isMember, setIsMember] = useState(false);
  const [myEvents, setMyEvents] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    gender: "",
    birthdate: "",
    blood_type: "",
    address: "",
    emergency_contact: "",
    emergency_phone: "",
    membership_type: "",
    medical_conditions: "",
    jersey_size: ""
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (userData) {
      setFormData({
        name: userData.name ?? "",
        email: userData.email ?? "",
        phone: userData.phone ?? "",
        gender: userData.gender ?? "",
        date_of_birth: userData.date_of_birth ?? "",
        membership_type: userData.membership_type ?? "",
        address: userData.address ?? "",
        blood_type: userData.blood_type ?? "",
        jersey_size: userData.jersey_size ?? "",
        emergency_contact: userData.emergency_contact ?? "",
        emergency_phone: userData.emergency_phone ?? "",
        medical_conditions: userData.medical_conditions ?? "",
      });
      const status = userData?.membership_type || "";
      setIsMember(status !== "none");
    }
  }, [userData]);

  useEffect(() => {
    if (user) {
      setUserData(user);
      setFormData({
        name: user.name ?? "",
        phone: user.phone ?? "",
        gender: user.gender ?? "",
        birthdate: user.birthdate ?? "",
        blood_type: user.blood_type ?? "",
        address: user.address ?? "",
        jersey_size: user.jersey_size ?? "",
        emergency_contact: user.emergency_contact ?? "",
        emergency_phone: user.emergency_phone ?? "",
        medical_conditions: user.medical_conditions ?? "",
        identity_number: user.identity_number ?? "",
      });
    }
  }, [user, setUserData]);

  // 🔥 Ambil Riwayat Event
  useEffect(() => {
    if (userData) {
      eventService
        .getMyEvents()
        .then((res) => setMyEvents(res.data.data))
        .catch(() => { });
    }
  }, [userData]);

  function handleFormChange(e) {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

  async function handleUpdateProfile(e) {
    e.preventDefault();
    setSubmitLoading(true);
    try {
      const payload = {};
      if (formData.name) payload.name = formData.name;
      if (formData.email) payload.email = formData.email;
      if (formData.phone) payload.phone = formData.phone;
      if (formData.gender) payload.gender = formData.gender;
      if (formData.address) payload.address = formData.address;
      if (formData.jersey_size) payload.jersey_size = formData.jersey_size;
      if (formData.birthdate || formData.date_of_birth)
        payload.date_of_birth = formData.date_of_birth || formData.birthdate;
      if (formData.blood_type) payload.blood_type = formData.blood_type;
      if (formData.emergency_contact)
        payload.emergency_contact = formData.emergency_contact;
      if (formData.emergency_phone)
        payload.emergency_phone = formData.emergency_phone;
      if (formData.medical_conditions)
        payload.medical_conditions = formData.medical_conditions;
      if (formData.identity_number)
        payload.identity_number = formData.identity_number;

      await profileService.update(payload);

      // 🔥 Upload avatar dengan field "photo" (sesuai Postman)
      if (avatar) {
        const avatarForm = new FormData();
        avatarForm.append("photo", avatar);
        await profileService.uploadPhoto(avatarForm);
      }

      const profileRes = await profileService.getProfile();
      const updatedUser = profileRes.data.data;
      setUserData(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));

      Swal.fire({
        icon: "success",
        title: "Profil Berhasil Diupdate!",
        text: "Data kamu sudah tersimpan.",
        timer: 2000,
        showConfirmButton: false,
      });
      setShowEditForm(false);
      setAvatar(null);
    } catch (err) {
      console.error("Update error:", err.response?.data);
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

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "Yakin mau logout?",
      text: "Kamu akan keluar dari sesi ini.",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, Logout!",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      logout();
      setSearchId("");
      setUserData(null);
      setShowEditForm(false);
      setFormData({
        name: "",
        email: "",
        phone: "",
        gender: "",
        date_of_birth: "",
        blood_type: "",
        emergency_contact: "",
        emergency_phone: "",
        medical_conditions: "",
        identity_number: "",
      });
      setMyEvents([]);

      Swal.fire({
        icon: "success",
        title: "Logout Berhasil!",
        text: "Sampai jumpa lagi!",
      });
    }
  };

  // Cek apakah user sudah login
  const isUserLoggedIn = isLoggedIn || userData;

  // 🔥 Ambil data dari userData
  const profileAvatar = userData?.avatar || "";
  const name = userData?.name || user?.name || "";
  const username = userData?.username || user?.username || "";

  return (
    <Container className="flex flex-col w-full">
      <div className="relative bg-linear-to-br from-primary-light via-primary-light-active to-primary-light">
        <BatikOverlay />
        <div className="gap-y-8 px-4 md:px-0 max-w-306 mx-auto min-h-screen">

          {/* ====== Cek Login Status ====== */}
          {isMounted && isUserLoggedIn ? (
            <RevealSection direction="up">
              <div className="flex flex-col items-center justify-center mt-24 mb-8">
                <div className="bg-primary-light p-8 rounded-lg shadow-lg text-center w-full border-2 border-neutral-normal">
                  <div className="flex flex-col items-center gap-4">
                    <h1 className="text-4xl font-bold font-young text-primary-darker">Selamat Datang!</h1>
                    <div className="w-32 h-32 rounded-full bg-secondary-bg flex items-center justify-center overflow-hidden border-4 border-secondary-bg mx-auto mb-4">
                      {profileAvatar ? (
                        <img
                          src={profileAvatar}
                          alt={name}
                          className="object-cover w-full h-full"
                          onError={(e) => {
                            e.target.style.display = "none";
                            e.target.parentElement.innerHTML = `
                              <span class="text-white font-bold text-4xl">
                                ${name ? name.charAt(0).toUpperCase() : "?"}
                              </span>
                            `;
                          }}
                        />
                      ) : (
                        <span className="text-white font-bold text-4xl">
                          {name ? name.charAt(0).toUpperCase() : "?"}
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="text-2xl font-semibold text-secondary-bg mt-4">{name}</p>
                  {/* 🔥 TAMPILKAN USERNAME */}
                  {username && (
                    <p className="text-sm text-gray-500 mt-1">
                      @{username}
                    </p>
                  )}
                  <p className="text-gray-600 mt-2">{userData?.email || user?.email}</p>
                  <div className="mt-6 flex gap-4 justify-center">
                    <button
                      onClick={handleLogout}
                      className="cursor-pointer px-8 py-3 border-red-500 hover:bg-red-600/10 active:bg-red-700/10 text-red-600 font-bold border-2 rounded-md transition-all"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            </RevealSection>
          ) : (
            <RevealSection direction="up">
              <div className="flex items-center justify-center w-full mt-8">
                <h1 className="text-4xl font-bold m-2 font-young mt-24">
                  Kamu sudah jadi Member?
                </h1>
              </div>
              <div className="flex flex-col justify-center items-center gap-4 w-full max-w-md mx-auto">
                <InputType
                  label="Username"
                  id="username"
                  type="text"
                  name="username"
                  placeholder="john_doe"
                  required
                  className="flex flex-col gap-2 w-full"
                  value={searchId}
                  onChange={handleChange}
                />

                <div className="flex flex-col gap-2 w-full">
                  <label className="font-medium text-xl">
                    Password <span className="text-red-500 ml-0.5">*</span>
                  </label>
                  <div className="relative w-full">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={handlePasswordChange}
                      placeholder="••••••••"
                      required
                      className="outline-2 p-3 bg-white outline-tertiary-normal rounded-md w-full pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none z-10"
                    >
                      {showPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <button
                  className={`flex justify-center items-center p-8 rounded-md w-full ${loading ? "bg-neutral-bg-active" : "bg-secondary-bg"
                    } hover:bg-secondary-bg-hover active:bg-secondary-bg-active h-16 font-bold text-xl text-white m-10 md:text-3xl`}
                  type="button"
                  disabled={loading}
                  onClick={handleSearch}
                >
                  {loading ? "Mencari..." : "Login"}
                </button>
              </div>
            </RevealSection>
          )}

          {/* ====== DATA MEMBER ====== */}
          {isMounted && userData && (
            <RevealSection direction="up">
              <div className="flex flex-col gap-4 bg-card-bg p-8 border-2 bg-primary-light border-neutral-normal rounded-md my-4">
                <h2 className="text-3xl font-bold font-young text-neutral-normal">Data Member</h2>
                <hr className="border-t-2 border-neutral-normal" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-lg">
                  <div>
                    <span className="font-semibold">Username: </span>
                    <span className="font-mono font-bold text-secondary-bg">
                      @{userData.username || "-"}
                    </span>
                  </div>
                  <div>
                    <span className="font-semibold">Status: </span>
                    <span className="font-mono">{userData.is_active === true ? "Aktif" : "Non Aktif"}</span>
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
                    <span className={`font-bold ${userData.membership_type === "none" ? "text-tertiary-bg" : "text-secondary-dark"}`}>
                      {userData.membership_type === "none" ? "Non Member" : "Member"}
                    </span>
                  </div>
                  <div>
                    <span className="font-semibold">Hash ID: </span>
                    <span className="font-mono">{userData.hash_id || "-"}</span>
                  </div>
                  {isMember ? (
                    <>
                      <div>
                        <span className="font-semibold">Membership mulai dari : </span>
                        <span className="font-bold text-secondary-bg">
                          {dateConverted(userData.membership_start_date)}
                        </span>
                      </div>
                      <div>
                        <span className="font-semibold">Membership berakhir pada : </span>
                        <span className="font-bold text-red-500">
                          {dateConverted(userData.membership_end_date)}
                        </span>
                      </div>
                    </>
                  ) : (
                    <div className="md:col-span-2">
                      <span className="font-semi-bold">
                        Anda bukan Member, Jika ingin berlangganan Membership silahkan Hubungi <a className="font-bold text-red-500" href="http://wa.me/+62811588338">disini</a>
                      </span>
                    </div>
                  )}
                </div>

                {!showEditForm && (
                  <div className="flex items-center">
                    <button
                      onClick={() => setShowEditForm(true)}
                      className="cursor-pointer flex justify-center items-center rounded-md bg-secondary-bg hover:bg-secondary-bg-hover active:bg-secondary-bg-active h-16 font-bold text-lg text-white mt-4 md:text-2xl font-young w-1/2 md:w-1/4"
                    >
                      <PencilIcon className="m-2" width={24} height={24} /> Edit Profil
                    </button>
                  </div>
                )}
              </div>
            </RevealSection>
          )}

          {/* ====== RIWAYAT EVENT ====== */}
          {isMounted && userData && myEvents.length > 0 && (
            <RevealSection direction="up">
              <div className="flex flex-col gap-4 bg-primary-light border-2 border-neutral-normal p-8 my-4 rounded-md">
                <h2 className="text-3xl font-bold font-young text-neutral-normal">Riwayat Event</h2>
                <hr className="border-t-2 border-neutral-normal" />
                <div className="flex flex-col gap-4">
                  {myEvents.map((event, i) => (
                    <div
                      key={i}
                      className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-neutral-normal pb-4 gap-2"
                    >
                      <div className="flex flex-col gap-1">
                        <div className="font-bold text-lg text-neutral-normal">{event.title}</div>
                        <div className="text-sm text-neutral-dark">{event.location}</div>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span
                          className={`text-sm font-bold px-3 py-1 rounded-md ${event.order?.status === "paid" || event.order?.status === "confirmed"
                              ? "bg-secondary-bg text-white"
                              : event.order?.status === "free"
                                ? "bg-secondary-bg text-white"
                                : event.order?.status === "pending"
                                  ? "bg-primary-normal text-white"
                                  : event.order?.status === "cancelled" || event.order?.status === "rejected"
                                    ? "bg-red-500 text-white"
                                    : "bg-neutral-bg text-white"
                            }`}
                        >
                          {event.order?.status === "paid" || event.order?.status === "confirmed"
                            ? "Lunas"
                            : event.order?.status === "free"
                              ? "Gratis"
                              : event.order?.status === "pending"
                                ? "Menunggu"
                                : event.order?.status === "cancelled"
                                  ? "Dibatalkan"
                                  : event.order?.status === "rejected"
                                    ? "Ditolak"
                                    : event.order?.status || "-"}
                        </span>

                        <Link
                          href={
                            event.status === "publish" || event.status === "ongoing"
                              ? `/events/upcoming?id=${event.id}`
                              : `/events/finished?id=${event.id}`
                          }
                          className={`text-white text-center px-5 py-2.5 font-medium transition-colors font-young shadow-md rounded-md
                            ${event.status === "publish" || event.status === "ongoing" ? "bg-primary-bg hover:bg-primary-bg-hover active:bg-primary-bg-active" : "bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-400"}`}
                        >
                          Detail
                        </Link>
                        <div className="text-xs font-mono text-neutral-dark">
                          {event.order?.invoice_number}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </RevealSection>
          )}

          {/* ====== FORM EDIT PROFILE ====== */}
          {isMounted && userData && showEditForm && (
            <RevealSection direction="up">
              <div className="flex flex-col gap-4 bg-card-bg p-8 border-2 border-neutral-normal bg-primary-light rounded-md my-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-3xl font-bold font-young text-neutral-normal">Edit Profil</h2>
                  <button
                    onClick={() => setShowEditForm(false)}
                    className="cursor-pointer font-medium px-8 py-2 rounded-md bg-transparent border-2 border-neutral-normal hover:border-transparent hover:bg-neutral-normal-active hover:text-white transition-all"
                  >
                    Batal
                  </button>
                </div>
                <hr className="border-t-2 border-neutral-normal" />

                {/* 🔥 Tampilkan avatar saat ini */}
                {userData.avatar && (
                  <div className="flex flex-col items-center gap-2">
                    <label className="text-lg font-medium">Avatar Saat Ini</label>
                    <img
                      src={userData.avatar}
                      alt="Avatar"
                      className="w-32 h-32 rounded-full object-cover border-2 border-gray-300"
                    />
                  </div>
                )}

                <form onSubmit={handleUpdateProfile} className="flex flex-col gap-4">
                  <h3 className="text-xl font-bold font-young">Data Diri</h3>

                  <InputType
                    label="Nama Lengkap"
                    id="name"
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
                    type="email"
                    name="email"
                    className="flex flex-col gap-2"
                    value={formData.email}
                    onChange={handleFormChange}
                    readOnly
                  />
                  <InputType
                    label="Nomor Telepon/WA"
                    id="phone"
                    type="text"
                    name="phone"
                    placeholder="08123456789"
                    className="flex flex-col gap-2"
                    value={formData.phone}
                    onChange={handleFormChange}
                  />
                  <InputType
                    label="Alamat"
                    id="address"
                    type="text"
                    name="address"
                    placeholder="Jalan ..."
                    className="flex flex-col gap-2"
                    value={formData.address}
                    onChange={handleFormChange}
                  />
                  <SelectInput
                    id="gender"
                    name="gender"
                    label="Gender"
                    options={genderOptions}
                    value={formData.gender}
                    placehold="Pilih Gender..."
                    onChange={(e) => setFormData(prev => ({ ...prev, gender: e.target.value }))}
                  />
                  <SelectInput
                    id="jersey_size"
                    name="jersey_size"
                    label="Jersey Size"
                    options={jerseySizeOptions}
                    value={formData.jersey_size}
                    placehold="Pilih Ukuran Jersey..."
                    onChange={(e) => setFormData(prev => ({ ...prev, jersey_size: e.target.value }))}
                  />
                  <InputType
                    label="Tanggal Lahir"
                    id="birthdate"
                    type="date"
                    name="birthdate"
                    className="flex flex-col gap-2"
                    value={formData.birthdate}
                    onChange={handleFormChange}
                  />
                  <SelectInput
                    id="blood_type"
                    name="blood_type"
                    label="Golongan Darah"
                    options={bloodTypeOptions}
                    value={formData.blood_type}
                    placehold="Pilih Golongan Darah..."
                    onChange={(e) => setFormData(prev => ({ ...prev, blood_type: e.target.value }))}
                  />

                  <hr className="border-t-2 border-neutral-normal" />
                  <h3 className="text-xl font-bold font-young">Kontak Darurat</h3>

                  <InputType
                    label="Nama Kontak Darurat"
                    id="emergency_contact"
                    type="text"
                    name="emergency_contact"
                    placeholder="Nama keluarga/teman"
                    className="flex flex-col gap-2"
                    value={formData.emergency_contact}
                    onChange={handleFormChange}
                  />
                  <InputType
                    label="Nomor Kontak Darurat"
                    id="emergency_phone"
                    type="text"
                    name="emergency_phone"
                    placeholder="08123456789"
                    className="flex flex-col gap-2"
                    value={formData.emergency_phone}
                    onChange={handleFormChange}
                  />

                  <hr className="border-t-2 border-neutral-normal" />
                  <h3 className="text-xl font-bold font-young">Info Kesehatan</h3>

                  <div className="flex flex-col gap-2">
                    <label className="text-xl font-medium">Riwayat Alergi</label>
                    <textarea
                      name="medical_conditions"
                      placeholder="Contoh: alergi debu, makanan laut, dll"
                      className="border-tertiary-normal p-3 text-lg bg-white border-2 rounded-md"
                      rows={3}
                      value={formData.medical_conditions}
                      onChange={handleFormChange}
                    />
                  </div>

                  <hr className="border-t-2 border-neutral-normal" />
                  <h3 className="text-xl font-bold mt-4 font-young">Avatar</h3>

                  <ImageUpload
                    id="avatar"
                    label="Upload Avatar Baru"
                    onChange={(file) => setAvatar(file)}
                  />

                  <div className="flex gap-4 mt-4">
                    <button
                      type="button"
                      onClick={() => setShowEditForm(false)}
                      className="cursor-pointer flex-1 flex justify-center items-center rounded-md h-16 font-bold text-xl font-young bg-transparent border-2 border-neutral-normal hover:border-transparent hover:bg-neutral-normal hover:text-white transition-all"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      disabled={submitLoading}
                      className={`flex-1 flex justify-center items-center ${submitLoading ? "bg-neutral-normal text-white cursor-not-allowed" : "bg-secondary-bg hover:bg-secondary-bg-hover cursor-pointer"
                        } active:bg-secondary-bg-active h-16 font-bold text-xl text-white font-young rounded-md`}
                    >
                      {submitLoading ? "Menyimpan..." : "Simpan Perubahan"}
                    </button>
                  </div>
                </form>
              </div>
            </RevealSection>
          )}
        </div>
      </div>
    </Container>
  );
}