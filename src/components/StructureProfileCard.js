export default function StructureProfileCard({ images, name, position }) {
    return (
        <div className="flex flex-col items-center bg-primary-light h-full w-full max-w-sm border-2 border-neutral-normal">
            <Image
                src={images}
                alt="image"
                width={150}
                height={150}
                className="w-full object-cover"
            />
            <div className="flex flex-col w-full gap-4 p-8">
                <div className="text-2xl font-bold font-young text-neutral-normal">{name}</div>
                <div className="text-lg text-neutral-dark">{position}</div>
            </div>
        </div>
    )
}