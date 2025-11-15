import { cn } from "~/lib/utils";

export default function HeroImage({
    src,
    alt,
    className,
}: {
    src?: string | null | undefined;
    alt?: string;
    className?: string;
}) {
    if (!src) {
        return (
            <div
                className={cn(
                    "w-full h-[672px] bg-[#F2F2F2] flex justify-center items-center",
                    className
                )}
            >
                <h1 className="text-4xl text-[#C39F45]">No Image Available</h1>
            </div>
        );
    }

    return (
        <img
            src={src}
            alt={alt}
            className={cn("object-cover w-full h-[672px]", className)}
        />
    );
}
