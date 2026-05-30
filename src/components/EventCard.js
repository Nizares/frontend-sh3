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
    <div className="flex flex-col items-center rounded-2xl bg-white w-full max-w-sm">
      <Image
        src={img}
        alt="image"
        width={250}
        height={250}
        className="w-full object-cover rounded-t-2xl"
      />
      <div className="flex flex-col w-full gap-4 p-8">
        <div className="text-2xl font-bold font-young">{title}</div>
        <div className="text-lg">{concateDate(start_date, end_date)}</div>
        <div className="flex flex-col justify-between w-full md:flex-row gap-8">
          <div className="text-xl font-semibold">{category}</div>
          <Link
            href={isOngoing ? `/events/upcoming?id=${id}` : `/events/past?id=${id}`}
            className={`text-white px-5 py-2.5 rounded-full font-medium transition-colors
              ${isOngoing ? "bg-tertiary-bg hover:bg-tertiary-bg-hover active:bg-tertiary-bg-active" : "bg-secondary-bg hover:bg-secondary-bg-hover active:bg-secondary-bg-active"}`}
          >
            {isOngoing ? "Daftar" : "Detail"}
          </Link>
        </div>
      </div>
    </div>
  )
}