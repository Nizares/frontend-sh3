import Link from "next/link"
import Image from "next/image"

export default function Footer() {
    return (
        <div className="flex items-center justify-center w-full bg-primary-dark h-auto">
            <div className="flex flex-col md:flex-row gap-8">
                <Image
                    src="/assets/images/batik2.png" 
                    width={250}
                    height={250}
                    className="w-3/10"
                    alt="Batik 1"
                />
                <div className="flex flex-col justify-center w-full md:w-lg gap-4">
                    <div className="flex items-center gap-2">
                        <span className="text-4xl font-bold text-primary-text font-young">#</span>
                        <div>
                            <p className="font-bold text-white leading-tight font-young">Samarinda Hash</p>
                            <p className="text-xs text-white">House Harriers</p>
                        </div>
                    </div>
                    <div className="text-sm font-medium text-wrap md:text-lg text-white">
                        Lorem ipsum dolor sit amet, consectetur
                        adipiscing elit. Donec sit amet sollicitudin
                        velit. Nunc vel libero facilisis, condimentum
                        velit in, commodo neque. Suspendisse
                        ullamcorper at nulla sed pellentesque.
                    </div>
                </div>
                <div className="flex flex-col justify-center gap-4 w-64">
                    <div className="font-bold text-lg text-white">
                        Tautan Cepat
                    </div>
                    <ol className="list-none flex flex-col gap-1 text-white">
                        <li>
                            <Link href="/about" className="hover:text-white">
                                Tentang SH3
                            </Link>
                        </li>
                        <li>
                            <Link href="/members" className="hover:text-white">
                                Member
                            </Link>
                        </li>
                        <li>
                            <Link href="/gallery" className="hover:text-white">
                                Gallery
                            </Link>
                        </li>
                        <li>
                            <Link href="/event" className="hover:text-white">
                                Events
                            </Link>
                        </li>
                    </ol>
                </div>
                <div className="flex flex-col justify-center gap-4 w-64">
                    <div className="font-bold text-lg text-white">
                        Hubungi Kami
                    </div>
                    <ol className="list-none flex flex-col gap-1 text-white">
                        <li>
                            <Link href="#" className="hover:text-white">
                                Email
                            </Link>
                        </li>
                        <li>
                            <Link href="#" className="hover:text-white">
                                Phone
                            </Link>
                        </li>
                        <li>
                            <Link href="#" className="hover:text-white">
                                Address
                            </Link>
                        </li>
                    </ol>
                </div>

                <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.6722277791782!2d117.15034347582339!3d-0.4903164352759345!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2df67f6cf7d346a5%3A0x48179c10cdd6f405!2sJl.%20A.M.%20Sangaji%20No.10%2C%20Bandara%2C%20Kec.%20Sungai%20Pinang%2C%20Kota%20Samarinda%2C%20Kalimantan%20Timur%2075242!5e0!3m2!1sen!2sid!4v1782145994021!5m2!1sen!2sid"
                 height="250" loading="lazy" referrerPolicy="no-referrer-when-downgrade" 
                 className="w-full md:w-100 p-8"></iframe>
            </div>

        </div>
    )
}