import InputField from "~/components/InputField";
import { useForm, type SubmitHandler } from "react-hook-form";
import type { BodyLoginUserTokenPost } from "~/client";
import { loginUserTokenPostMutation } from "~/client/@tanstack/react-query.gen";
import { useMutation } from "@tanstack/react-query";
import CTAButton from "./CTAButton";
import { useNavigate } from "react-router";
import { guestOnlyLoader } from "~/lib/loaders";

export const clientLoader = guestOnlyLoader;

export default function Login() {
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<BodyLoginUserTokenPost>();
    const logIn = useMutation({
        ...loginUserTokenPostMutation(),
        onSuccess: () => {
            navigate("/");
        },
    });

    const onSubmit: SubmitHandler<BodyLoginUserTokenPost> = (data) => {
        logIn.mutate({
            body: data,
        });
    };

    return (
        <div className="flex flex-row gap-4 justify-around grow">
            <title>Log In to Virtuoso</title>
            <div className="flex flex-col justify-start py-20">
                <h2 className="font-playfair-display text-7xl font-medium px-12">
                    Enter
                </h2>
            </div>
            <div className="flex flex-col justify-start items-center gap-6 py-40">
                <InputField
                    name="username"
                    register={register}
                    error={errors.username}
                    options={{ required: true }}
                />
                <InputField
                    name="password"
                    register={register}
                    error={errors.password}
                    options={{ required: true }}
                />
            </div>
            <div className="flex flex-col justify-end py-20">
                <CTAButton onClick={handleSubmit(onSubmit)} label="Access" />
            </div>
        </div>
    );
}
