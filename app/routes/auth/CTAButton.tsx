export default function CTAButton({
    onClick,
    label,
}: {
    onClick?: () => Promise<void>;
    label: string;
}) {
    return (
        <button
            type="button"
            className="flex flex-row justify-center rounded-2xl text-white shadow-[4px_4px_4px_0_rgba(0,0,0,0.08)] bg-[#ccac54] hover:bg-[#b2994a] hover:cursor-pointer w-80 py-11 font-playfair-display font-semibold text-5xl transition-colors duration-200"
            onClick={onClick}
        >
            {label}
        </button>
    );
}
