import Image from "next/image"
import Link from "next/link"
export default function EventCard({
  title,
  date, 
  category, 
  img, 
  status
}){

  const isOngoing = status == "ongoing"

    return (
    <div className="flex flex-col items-center rounded-2xl bg-white w-full max-w-sm">
        <Image
            src={img}
            alt="image"
            width={250}
            height={250}
            className="
            w-full
            object-cover
            rounded-t-2xl
            "
        />
        <div className="flex flex-col  w-full gap-4 p-8">
          <div className="text-3xl font-bold">
              {title}
          </div>
          <div className="text-lg">
              {date}
          </div>
          <div className="flex flex-col justify-between w-full md:flex-row gap-8">
              <div className="text-xl font-semibold">
                {category}
              </div>
              <Link
                href={isOngoing ? "/events/upcoming" : "/events/past"}
                className={` text-white px-5 py-2.5 rounded-full font-medium transition-colors
                  ${isOngoing ? "bg-red-700 hover:bg-red-500 active:bg-red-500" : "hover:bg-btn-green-hover bg-btn-green-normal active:bg-btn-green-active"} `}
              >
                {isOngoing ? "Daftar" : "Detail"}
              </Link>
          </div>

        </div>
      </div>
    )
}

      