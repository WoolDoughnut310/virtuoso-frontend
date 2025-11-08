import InputField from "~/components/InputField";
import { useForm, type SubmitHandler } from "react-hook-form";
import type { UserCreate } from "~/client";
import { registerUserRegisterPostMutation } from "~/client/@tanstack/react-query.gen";
import { useMutation } from "@tanstack/react-query";
import CTAButton from "./CTAButton";

interface SignupForm extends UserCreate {
    confirm_password: string;
}

export default function Register() {
    const {
        register,
        handleSubmit,
        formState: { errors },
        setError,
    } = useForm<SignupForm>();
    const registerUser = useMutation({
        ...registerUserRegisterPostMutation(),
    });

    const onSubmit: SubmitHandler<SignupForm> = (data) => {
        if (data.password != data.confirm_password) {
            setError("confirm_password", { message: "Passwords do not match" });
            return;
        }
        registerUser.mutate({
            body: data,
        });
    };

    return (
        <div className="flex flex-row gap-4 justify-around grow">
            <div className="flex flex-col justify-start py-20">
                <h2 className="font-playfair-display text-7xl font-medium leading-tight">
                    Join the<br />Experience
                </h2>
            </div>
            <div className="flex flex-col justify-start items-center gap-6 py-24">
                <InputField
                    name="full_name"
                    register={register}
                    error={errors.full_name}
                    options={{ required: true }}
                />
                <InputField
                    name="email"
                    register={register}
                    error={errors.email}
                    options={{ required: true }}
                />
                <InputField
                    name="password"
                    register={register}
                    error={errors.password}
                    options={{ required: true }}
                />
                <InputField
                    name="confirm_password"
                    register={register}
                    error={errors.confirm_password}
                    options={{ required: true }}
                    className="mt-11"
                />
            </div>
            <div className="flex flex-col justify-end py-20">
                <CTAButton onClick={handleSubmit(onSubmit)} label="Continue" />
            </div>
        </div>
    );
}
