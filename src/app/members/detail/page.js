"use client"
import useSearchMembers from "@/src/hooks/useSearchMembers";
import InputType from "@/src/components/Inputs";
import { RevealSection } from "@/src/components/RevealSection";
import Swal from "sweetalert2";
import { useState } from "react";

export default function Members() {
    const [submitLoading, setSubmitLoading] = useState(false);
    const { loading, searchId, setSearchId, handleSearch, handleChange } = useSearchMembers();

    return (
        <RevealSection direction="up">
            {/* Cek Member */}
            <div className="flex items-center justify-center w-full mt-8">
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
    )
}

