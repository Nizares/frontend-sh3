import Image from "next/image";
import Link from "next/link";

import Container from "@/components/Container";

export default function Gallery(){
    return (
        <Container className="flex flex-col gap-y-4 w-full">
            <h1 className="text-5xl font-bold text-center p-8">Cerita Kami saat Berlari!</h1>
        </Container>
    )
}