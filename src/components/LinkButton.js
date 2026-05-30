import Link from "next/link";
export default function LinkButton({
    destination,
    text
}) {
    return (
        <Link
        href={destination}
        className="bg-secondary-bg text-white px-6 py-2.5 m-5 font-medium hover:bg-secondary-bg-hover active:bg-secondary-bg-active font-young shadow-md transition-all hover:shadow-md-interact hover:-translate-x-1 hover:-translate-y-1  active:shadow-md-interact active:-translate-x-1 active:-translate-y-1 focus:shadow-md-interact focus:-translate-x-1 focus:-translate-y-1"
        >
        {text}
        </Link>
    )
}