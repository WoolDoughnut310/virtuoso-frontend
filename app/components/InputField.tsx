import type { HTMLAttributes } from "react";
import type {
    RegisterOptions,
    UseFormRegister,
    FieldError,
} from "react-hook-form";
import {
    HoverCardTrigger,
    HoverCard,
    HoverCardContent,
} from "~/components/ui/hover-card";

function toTitleCase(str: string) {
    return str
        .toLowerCase()
        .split(/[_\s-]+/) // split on underscores, spaces, or dashes
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
}

interface InputFieldProps {
    name: string;
    register: UseFormRegister<any>;
    options?: RegisterOptions<any, string>;
    error?: FieldError;
    className?: HTMLAttributes<HTMLDivElement>["className"];
}

export default function InputField({
    name,
    register,
    options,
    error,
    className,
}: InputFieldProps) {
    const errorClassName =
        "text-red-500 text-sm ml-4 font-medium absolute -bottom-5";

    return (
        <div
            className={`flex flex-col justify-end items-start relative z-0 ${className ?? ""}`}
        >
            <HoverCard>
                <HoverCardTrigger asChild>
                    <label
                        className={`ml-5 text-4xl font-montserrat ${!!error ? "error-underline" : ""}`}
                    >
                        {toTitleCase(name)}
                    </label>
                </HoverCardTrigger>
                <HoverCardContent className="z-50">
                    <div className="flex flex-col">
                        {error?.types ? (
                            Object.values(error.types).map((msg, i) => (
                                <p key={i} className={errorClassName}>
                                    {msg}
                                </p>
                            ))
                        ) : error?.type ? (
                            <p className={errorClassName}>
                                {toTitleCase(error.type)}
                            </p>
                        ) : (
                            error?.message && (
                                <p className={errorClassName}>{error.message}</p>
                            )
                        )}
                    </div>
                </HoverCardContent>
            </HoverCard>
            <input
                type="text"
                className="rounded-3xl bg-transparent border-[#dcd2be] hover:outline-none focus:outline-none border-2 w-96 h-16 px-4"
                aria-invalid={error ? "true" : "false"}
                {...register(name, options)}
            />
        </div>
    );
}
