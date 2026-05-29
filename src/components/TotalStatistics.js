export default function TotalStatistic() {
    return (
        <div className="flex flex-col items-center gap-x-8 p-6 text-white bg-text-oranges md:flex-row md:justify-around left-0">
            <div className="flex flex-row items-center">
                <div className="flex flex-col gap-2">
                    <p className="font-semibold text-xl md:text-3xl">2381</p>
                    <p className="font-normal text-base md:text-lg">Total Runs</p>
                </div>
            </div>
            <div className="flex flex-row items-center ">
                <div className="flex flex-col gap-2">
                    <p className="font-semibold text-xl md:text-3xl">4.200+</p>
                    <p className="font-normal text-base md:text-lg">Total Member Terdaftar</p>
                </div>
            </div>
            <div className="flex flex-row items-center">
                <div className="flex flex-col gap-2">
                    <p className="font-semibold text-xl md:text-3xl">250+</p>
                    <p className="font-normal text-base md:text-lg">Active Runner Per Week</p>
                </div>
            </div>
            <div className="flex flex-row items-center">
                <div className="flex flex-col gap-2">
                    <p className="font-semibold text-xl md:text-3xl">ON ON</p>
                    <p className="font-normal text-base md:text-lg">Per Week</p>
                </div>
            </div>
        </div>
    )
}