import Link from "next/link"

export default function Footer() {
    return (
        <div className="flex items-center justify-center w-full bg-primary-light h-auto p-8 mt-8">
            <div className="flex flex-col md:flex-row max-w-306 gap-8">
                <div className="flex flex-col justify-center w-full md:w-lg gap-4">
                    <div className="flex items-center gap-2">
                        <span className="text-4xl font-bold text-secondary-text">#</span>
                        <div>
                            <p className="font-bold text-gray-800 leading-tight">Samarinda Hash</p>
                            <p className="text-xs text-gray-500">House Harriers</p>
                        </div>
                    </div>
                    <div className="text-sm font-medium text-wrap md:text-lg">
                        Lorem ipsum dolor sit amet, consectetur
                        adipiscing elit. Donec sit amet sollicitudin
                        velit. Nunc vel libero facilisis, condimentum
                        velit in, commodo neque. Suspendisse
                        ullamcorper at nulla sed pellentesque.
                    </div>
                </div>
                <div className="flex flex-col justify-center gap-4 w-64">
                    <div className="font-bold text-lg">
                        Tautan Cepat
                    </div>
                    <ol className="list-none flex flex-col gap-1">
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
                    <div className="font-bold text-lg">
                        Hubungi Kami
                    </div>
                    <ol className="list-none flex flex-col gap-1">
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

                <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d249.3541589853959!2d117.15283152526433!3d-0.49976383279465536!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2df67ff17b9cdaf1%3A0x1b786f8e75e8bad3!2sKoding%20Next%20Samarinda!5e0!3m2!1sid!2sid!4v1777470276530!5m2!1sid!2sid"
                 height="250" loading="lazy" referrerPolicy="no-referrer-when-downgrade" 
                 className="rounded-4xl w-full md:w-100"></iframe>
            </div>

        </div>
    )
}