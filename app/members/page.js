import Container from "@/components/Container";
import Image from "next/image";
import Link from "next/link";
import { ArrowLongLeftIcon } from "@heroicons/react/24/outline";
import { MapPinIcon } from "@heroicons/react/24/solid";
import Form from 'next/form'


export default function UpcomingEvents() {
    return (
        <Container className="flex flex-col gap-y-4 w-full">
            <div className="flex items-center justify-center w-full">
                <h1 className="text-4xl font-bold ">
                    Ayo! Jadi bagian kami!
                </h1>
            </div>
            <div className="grid grid-rows-1 gap-x-16 md:grid-cols-3">
                <div className="col-span-1 flex flex-col md:col-span-2 gap-4">
                    <div className="flex flex-col gap-2">
                        <label>
                            <span className="text-gray-700 after:ml-0.5 after:text-red-500 after:content-['*'] font-medium text-2xl">Full Name</span>
                        </label>
                        <input type="email" name="email" className="outline-2 rounded-2xl p-2" placeholder="John Doe" />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label>
                            <span className="text-gray-700 after:ml-0.5 after:text-red-500 after:content-['*'] font-medium text-2xl">Email</span>
                        </label>
                        <input type="email" name="email" className="outline-2 rounded-2xl p-2" placeholder="you@example.com" />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label>
                            <span className="text-gray-700 after:ml-0.5 after:text-red-500 after:content-['*'] font-medium text-2xl">Nomor Telepon/WA</span>
                        </label>
                        <input type="email" name="email" className="outline-2 rounded-2xl p-2" placeholder="08123456789" />
                    </div>
                    <Link href="/regismember">
                        <div className="flex justify-center items-center rounded-2xl bg-[#00973D] h-16 font-bold text-xl text-white hover:bg-green-400 m-10 md:text-3xl active:bg-green-400">
                            Registrasi Member
                        </div>
                    </Link>
                </div>
                <div className="bg-[#F6DDB2] rounded-lg gap-x-4 p-4">
                    <div className="flex flex-col">
                        <h3 className="text-2xl font-bold">
                            Benefits Member
                        </h3>
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

        </Container>
    )
}