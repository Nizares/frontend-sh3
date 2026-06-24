import Image from "next/image"
import Link from "next/link"
import { concateDate } from "@/src/lib/utils";

export default function EventCard({
  id,        // ← tambah prop id
  title,
  start_date,
  end_date,
  category,
  img,
  status
}) {

  const isOngoing = status == "upcoming"
  console.log(status);

  return (
    <div className="flex flex-col shrink-0 basis-1/4 items-center bg-white h-full w-full max-w-sm">
      <Image
        src={img}
        alt="image"
        width={250}
        height={250}
        className="w-full object-cover"
      />
      <div className="flex flex-col gap-4 p-8 justify-between h-full">

        <div className="text-2xl font-bold font-young">{title}</div>
        <div className="text-lg">{concateDate(start_date, end_date)}</div>
        <div className="text-xl font-semibold">{category}</div>
        <Link
          href={isOngoing ? `/events/upcoming?id=${id}` : `/events/finished?id=${id}`}
          className={`text-white text-center px-5 py-2.5 font-medium transition-colors font-young shadow-md
              ${isOngoing ? "bg-primary-bg hover:bg-primary-bg-hover active:bg-primary-bg-active" : "bg-secondary-bg hover:bg-secondary-bg-hover active:bg-secondary-bg-active  "}`}
        >
          {isOngoing ? "Daftar" : "Detail"}
        </Link>
      </div>
    </div>
  )
}