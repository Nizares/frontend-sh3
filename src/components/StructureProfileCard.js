import Image from "next/image"

export default function StructureProfileCard({
    images,
    name,
    position
}) {
    return (
        <div className="flex flex-col items-center bg-white h-full w-full max-w-sm">
            <Image
                src={images}
                alt="image"
                width={250}
                height={250}
                className="w-full object-cover"
            />
            <div className="flex flex-col w-full gap-4 p-8">
                <div className="text-2xl font-bold font-young">{name}</div>
                <div className="text-lg">{position}</div>
            </div>
        </div>
        
    )
}