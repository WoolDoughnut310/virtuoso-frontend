import { useMutation } from "@tanstack/react-query";
import { type Control, Controller, useFormState } from "react-hook-form";
import { type ConcertUpdate } from "~/client";
import { uploadConcertImageConcertsConcertIdImagePostMutation } from "~/client/@tanstack/react-query.gen";
import HeroImage from "./HeroImage";
import { Upload } from "lucide-react";
import { useId } from "react";
import { toast } from "sonner";

interface ImageUploaderProps {
    control: Control<ConcertUpdate>;
    concert_id: number;
}

export function ImageUploader({ control, concert_id }: ImageUploaderProps) {
    const { errors } = useFormState({ control });
    const uploadImage = useMutation({
        ...uploadConcertImageConcertsConcertIdImagePostMutation()
    });

    const fileInputId = useId();

    return (
        <Controller
            name="cover_image_url"
            control={control}
            render={({ field }) => {
                const displayUrl = field.value;

                const handleFileChange = async (
                    event: React.ChangeEvent<HTMLInputElement>
                ) => {
                    console.log("handling");
                    const file = event.target.files?.[0];
                    if (!file) return;

                    const toastId = toast.loading("Uploading image...");

                    try {
                        const result = await uploadImage.mutateAsync({
                            body: { file },
                            path: { concert_id },
                        });

                        toast.success("Image uploaded successfully!", {
                            id: toastId,
                        });

                        field.onChange(result.cover_image_url);
                        event.target.value = "";
                    } catch (e) {
                        toast.error("Image upload failed. Please try again.", {
                            id: toastId,
                        });
                        console.error("Upload error:", e);
                    }
                };

                return (
                    <div className="w-full h-full flex flex-col items-center">
                        <label
                            htmlFor={fileInputId}
                            className="w-full h-full relative overflow-hidden bg-[#F2F2F2] border border-[#C39F45]/50 rounded-lg cursor-pointer transition-opacity duration-200 hover:opacity-80"
                        >
                            {displayUrl ? (
                                <HeroImage
                                    src={displayUrl}
                                    alt="Concert Hero Preview"
                                />
                            ) : (
                                <div className="w-full h-full flex justify-center items-center flex-col text-[#C39F45]/80">
                                    <Upload className="h-10 w-10 mb-2" />
                                    <span className="text-sm">
                                        Click to upload image
                                    </span>
                                </div>
                            )}
                        </label>
                        <input
                            type="file"
                            id={fileInputId}
                            accept="image/*"
                            onChange={handleFileChange}
                            className="hidden"
                            disabled={uploadImage.isPending}
                        />
                        {errors.cover_image_url && (
                            <p className="text-red-500 text-sm mt-1">
                                *{errors.cover_image_url.message}
                            </p>
                        )}
                        <input
                            type="hidden"
                            {...field}
                            value={field.value ?? ""}
                        />
                    </div>
                );
            }}
        />
    );
}
