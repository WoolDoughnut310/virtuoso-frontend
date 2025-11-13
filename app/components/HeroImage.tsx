export default function HeroImage({
    src,
    alt,
}: {
    src?: string | null | undefined;
    alt?: string;
}) {
    if (!src) {
        return (
            <div className="w-full h-full bg-[#F2F2F2] flex justify-center items-center">
                <h1 className="text-4xl text-[#C39F45]">No Image Available</h1>
            </div>
        );
    }

    return <img src={src} alt={alt} className="object-cover w-full h-[672px]" />;
}
