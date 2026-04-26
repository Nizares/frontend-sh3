import Container from "@/components/Container";
import Image from "next/image";
import Link from "next/link";
import { ArrowLongLeftIcon } from "@heroicons/react/24/outline";


export default function Events(){
    return(
        <Container className="flex flex-col gap-y-32">

            <div className="flex flex-row items-center justify-between w-full">
                <h1 className="text-4xl font-bold">
                    Borneo Nash Hash 2027
                </h1>
                <Link href="/">
                    <ArrowLongLeftIcon className="w-16 h-16 md:w-8 md:h-8" />
                </Link>

            </div>

            {/* <Image
            src="/assets/images/poster2027.jpg"
            alt="Logo"
            width={600}
            height={450}
            className="
            h-48 max-w-306
            flex
            object-cover rounded-lg
            "
            /> */}
        </Container>
    )
}