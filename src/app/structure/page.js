"use client";
import Container from "@/src/components/Container";
import { RevealSection } from "@/src/components/RevealSection";
import TotalStatistic from "@/src/components/TotalStatistics";
import Image from "next/image";
import StructureProfileCard from "@/src/components/StructureProfileCard";
import BatikOverlay from "@/src/components/BatikOverlay";
import { useState, useEffect } from "react";
import { organisationService } from "@/src/services/organisationService";

export default function About() {
  const [tree, setTree] = useState([]);
  const [years, setYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Ambil available years
    organisationService
      .getYears()
      .then((res) => setYears(res.data.data))
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    setLoading(true);
    organisationService
      .getTree(selectedYear)
      .then((res) => {
        console.log("Tree response:", res.data); // ← tambah ini
        console.log("Tree data:", res.data.data.tree); // ← tambah ini
        setTree(res.data.data.tree);
      })
      .catch((err) => console.error("Error:", err)) // ← tambah ini
      .finally(() => setLoading(false));
  }, [selectedYear]);

  return (
    <Container className="flex flex-col">
      <div className="relative bg-linear-to-b from-primary-light to-primary-light-hover">
        <BatikOverlay />

        {/* Header */}
        <div className="flex flex-col flex-1 items-center justify-center text-primary-dark-active p-8 mt-16">
          <h1 className="text-5xl font-bold font-young">About</h1>
        </div>

        {/* Struktur Organisasi dari API */}
        <RevealSection direction="up">
          <div className="p-8">
            <div className="flex flex-col max-w-306 mx-auto w-full gap-8">
              <div className="flex flex-col md:flex-row justify-between items-center">
                <div className="font-bold text-4xl font-young md:p-4 text-primary-dark-active">
                  Struktur Organisasi
                </div>

                {/* Filter Tahun */}
                {years.length > 0 && (
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    className="border-2 border-neutral-normal bg-primary-light px-4 py-2 font-young text-lg"
                  >
                    {years.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {loading ? (
                <div className="flex justify-center p-8 text-xl">
                  Loading...
                </div>
              ) : tree.length === 0 ? (
                <div className="flex justify-center p-8 text-xl text-neutral-dark">
                  Tidak ada data struktur organisasi.
                </div>
              ) : (
                // Render per level
                tree.map((node, i) => (
                  <RevealSection key={i} direction="up">
                    <div className="flex flex-col gap-4">
                      {/* Nama posisi level ini */}
                      <div className="flex flex-wrap justify-center gap-6">
                        {/* Card posisi utama */}
                        {node.holders?.map((holder, j) => (
                          <StructureProfileCard
                            key={j}
                            images={
                              holder.photo_url ??
                              "/assets/images/contohfotopejabat.png"
                            }
                            name={holder.name}
                            position={node.position_name}
                          />
                        ))}
                        {/* Kalau tidak ada holder, tampilkan posisi kosong */}
                        {node.holders?.length === 0 && (
                          <StructureProfileCard
                            images="/assets/images/contohfotopejabat.png"
                            name="Kosong"
                            position={node.position_name}
                          />
                        )}
                      </div>

                      {/* Children (sub-posisi) */}
                      {node.children_list?.length > 0 && (
                        <div className="flex flex-wrap justify-center gap-6 mt-4">
                          {node.children_list.map((child, k) =>
                            child.holders?.map((holder, l) => (
                              <StructureProfileCard
                                key={`${k}-${l}`}
                                images={
                                  holder.photo_url ??
                                  "/assets/images/contohfotopejabat.png"
                                }
                                name={holder.name}
                                position={child.position_name}
                              />
                            )),
                          )}
                        </div>
                      )}
                    </div>
                  </RevealSection>
                ))
              )}
            </div>
          </div>
        </RevealSection>

        <RevealSection direction="up">
          <div className="w-full">
            <TotalStatistic />
          </div>
        </RevealSection>
      </div>
    </Container>
  );
}
