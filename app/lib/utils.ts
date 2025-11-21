import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { logoutLogoutPost } from "~/client";
import queryClient from "./queryClient";
import { readUsersMeMeGetQueryKey } from "~/client/@tanstack/react-query.gen";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function pick<T extends object, K extends keyof T>(
    obj: T,
    keys: readonly K[]
): Pick<T, K> {
    return keys.reduce(
        (acc, key) => {
            acc[key] = obj[key];
            return acc;
        },
        {} as Pick<T, K>
    );
}

export async function logout() {
    await logoutLogoutPost();
    queryClient.invalidateQueries({ queryKey: readUsersMeMeGetQueryKey() });
}
