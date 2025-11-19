import type { Route } from "./+types/concert";
import ConcertSkeleton from "~/components/ConcertSkeleton";
import { useConcertData } from "~/lib/useConcertData";
import { useIsOwner } from "~/lib/useIsOwner";
import { Calendar } from "lucide-react";
import { type ConcertUpdate } from "~/client";
import { formatUpcoming } from "~/lib/formatDateTime";
import { ConcertDTPicker } from "../components/ConcertDTPicker";
import { type SubmitHandler, Controller, useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import {
    deleteConcertConcertsConcertIdDeleteMutation,
    updateConcertConcertsConcertIdPatchMutation,
} from "~/client/@tanstack/react-query.gen";
import { ImageUploader } from "../components/ImageUploader";
import HeroImage from "../components/HeroImage";
import { useIsEditing } from "~/lib/useIsEditing";
import { useIsLive } from "~/lib/useIsLive";
import { useCallback } from "react";
import { useNavigate } from "react-router";
import queryClient from "~/lib/queryClient";
import { concertDataQuery } from "~/lib/queries";

export const clientLoader = async ({ params }: Route.ClientLoaderArgs) => {
    await queryClient.ensureQueryData(concertDataQuery(params.concert_id));
};

export default function Concert({ params }: Route.ComponentProps) {
    const concert_id = Number(params.concert_id)!;
    const navigate = useNavigate();
    const data = useConcertData(concert_id);

    const isOwner = useIsOwner(concert_id);
    const isLive = useIsLive(concert_id);

    const [isEditing, setIsEditing] = useIsEditing();
    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm<ConcertUpdate>({
        defaultValues: {
            start_time: data?.start_time,
            cover_image_url: data?.cover_image_url,
        },
    });
    const updateConcert = useMutation({
        ...updateConcertConcertsConcertIdPatchMutation(),
        onSuccess: () => {
            setIsEditing(false);
        },
    });
    const deleteConcert = useMutation({
        ...deleteConcertConcertsConcertIdDeleteMutation(),
        onSuccess: () => {
            navigate("/artist/dashboard");
        },
    });

    const onSubmit: SubmitHandler<ConcertUpdate> = (data) => {
        updateConcert.mutate({
            body: data,
            path: {
                concert_id,
            },
        });
    };

    const handleDelete = useCallback(async () => {
        if (
            !confirm(
                "Are you sure you want to permanently delete this concert?"
            )
        ) {
            return;
        }

        deleteConcert.mutate({ path: { concert_id } });
    }, [concert_id]);

    const isEditingMode = isOwner && isEditing;

    const baseButtonClass =
        "mt-5 hover:cursor-pointer transition transform hover:scale-105 rounded-2xl shadow-[0px_6px_12px_0px_rgba(0,0,0,0.15)] w-72 font-semibold flex justify-center items-center text-white font-playfair-display text-4xl px-3 py-10";
    const baseInputClass =
        "bg-transparent focus:outline-none border-b-[#c39f45] border-b-2 focus:border-b-[3px]";

    return (
        <div className="overflow-y-scroll">
            <title>{data.artist.name}: {data.name} - Virtuoso</title>
            <div className="flex flex-row min-h-[calc(100vh-132px)] px-16 py-[75px]">
                <div className="flex basis-3/5 pr-8 border-r-2 border-[#C39F45]/80">
                    {isEditingMode ? (
                        <ImageUploader
                            control={control}
                            concert_id={concert_id}
                        />
                    ) : (
                        <div className="w-full h-full relative overflow-hidden bg-[#F2F2F2] rounded-lg">
                            <HeroImage
                                src={data.cover_image_url}
                                alt={`Hero image for ${data.artist.name} concert`}
                            />
                        </div>
                    )}
                </div>
                <div className="flex basis-2/5 flex-col justify-start items-end py-4">
                    <h2 className="text-5xl font-medium font-playfair-display uppercase text-right">
                        {data.artist.name}
                    </h2>
                    {isEditingMode ? (
                        <input
                            type="text"
                            className={`text-2xl font-normal font-ibm-plex-sans text-right ${baseInputClass}`}
                            placeholder="Enter Concert Name"
                            defaultValue={data.name}
                            {...register("name")}
                        />
                    ) : (
                        <h3 className="text-2xl font-normal font-ibm-plex-sans">
                            {data.name}
                        </h3>
                    )}
                    <div className="flex flex-col justify-center items-center bg-[#F2F2F2] gap-8 w-72 rounded-4xl py-4 mt-16">
                        {isEditingMode ? (
                            <div className="flex flex-row items-center text-2xl font-ibm-plex-sans text-[#C39F45]">
                                <span className="mr-1">$</span>
                                <input
                                    type="text"
                                    defaultValue={data.ticket_price}
                                    className={`w-20 text-center ${baseInputClass} border-b-2 border-transparent focus:border-[#c39f45]`}
                                    placeholder="0.00"
                                    {...register("ticket_price", {
                                        valueAsNumber: true,
                                    })}
                                />
                            </div>
                        ) : (
                            <span className="text-2xl font-ibm-plex-sans bg-linear-to-b from-[#e0c279] to-[#a67c00] bg-clip-text text-transparent">
                                ${data.ticket_price}
                            </span>
                        )}
                        <div className="flex flex-col justify-center items-center gap-5 text-lg font-ibm-plex-sans text-[#282828]">
                            {isEditingMode ? (
                                <input
                                    type="number"
                                    defaultValue={data.max_capacity}
                                    className={`small-caps w-20 text-right ${baseInputClass}`}
                                    {...register("max_capacity", {
                                        valueAsNumber: true,
                                    })}
                                />
                            ) : (
                                <span className="small-caps">
                                    Sold 35 / {data.max_capacity}
                                </span>
                            )}
                            <div
                                className="flex flex-row gap-2 items-center"
                                title={data.start_time}
                            >
                                {isEditingMode ? (
                                    <Controller
                                        control={control}
                                        name="start_time"
                                        render={({ field }) => {
                                            const dateValue = field.value
                                                ? new Date(field.value)
                                                : new Date();

                                            return (
                                                <ConcertDTPicker
                                                    value={dateValue}
                                                    onChange={(
                                                        dateObject: Date
                                                    ) => {
                                                        field.onChange(
                                                            dateObject.toISOString()
                                                        );
                                                    }}
                                                />
                                            );
                                        }}
                                    />
                                ) : (
                                    <>
                                        <Calendar size={24} />
                                        {formatUpcoming(data.start_time!)}
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                    {isEditingMode ? (
                        <div className="flex flex-col gap-4 mt-8 w-full items-end">
                            <button
                                type="button"
                                className={`${baseButtonClass} bg-[#C39F45] hover:bg-[#A88C3E]`}
                                onClick={handleSubmit(onSubmit)}
                            >
                                Save Changes
                            </button>
                            <button
                                type="button"
                                className={`${baseButtonClass} bg-red-700 hover:bg-red-800 text-sm py-2 px-4`}
                                onClick={handleDelete}
                            >
                                Delete Concert
                            </button>
                        </div>
                    ) : isOwner ? (
                        // --- OWNER'S BUTTON ---
                        <button
                            type="button"
                            className={`${baseButtonClass} ${isLive ? "bg-red-600 hover:bg-red-700" : "bg-[#282828] hover:bg-[#4a4a4a]"}`}
                            onClick={() => {
                                // Navigate owner to the stream management or live dashboard
                                console.log(
                                    "Navigating to Owner Management/Stream Page..."
                                );
                                // navigate(`/concerts/${concert_id}/manage`);
                            }}
                        >
                            {isLive ? "MANAGE LIVE STREAM" : "MANAGE CONCERT"}
                        </button>
                    ) : (
                        // --- STANDARD BUYER'S BUTTON ---
                        <button
                            type="button"
                            className={`${baseButtonClass} ${isLive ? "bg-red-600 hover:bg-red-700" : "bg-[#ccac54FF] hover:bg-[#c39f45]"}`}
                            onClick={() => {
                                // Handle Listen In or Buy Access action
                                console.log(
                                    isLive
                                        ? "Navigating to live stream!"
                                        : "Initiating purchase flow..."
                                );
                            }}
                        >
                            {isLive ? "LISTEN IN" : "Buy Access"}
                        </button>
                    )}
                </div>
            </div>
            <div className="flex flex-col px-48 py-16 gap-3">
                <h4 className="font-playfair-display text-[#c39f45] font-medium text-2xl uppercase">
                    The Story
                </h4>
                {isEditingMode ? (
                    <textarea
                        defaultValue={data.description || ""}
                        rows={6}
                        {...register("description")}
                        className={`text-[#282828] text-lg leading-normal font-normal ${baseInputClass} border-2 border-[#e0e0e0] p-3 rounded-lg focus:border-[#C39F45]`}
                        placeholder="Describe the concert experience, including the mood and theme."
                    />
                ) : (
                    <p className="text-[#282828] text-lg leading-normal font-normal">
                        {data.description ||
                            `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                    do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                    ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    Duis aute irure dolor in reprehenderit in voluptate velit
                    esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
                    occaecat cupidatat non proident, sunt in culpa qui officia
                    deserunt mollit anim id est laborum.`}
                    </p>
                )}
            </div>
        </div>
    );
}
