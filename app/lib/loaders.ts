import { redirect } from "react-router";
import { currentUserQuery } from "./queries";
import queryClient from "./queryClient";

const UNAUTHORISED_DETAIL = "Could not validate credentials";

export const guestOnlyLoader = async () => {
    try {
        await queryClient.ensureQueryData(currentUserQuery());
        throw redirect("/");
    } catch (err: any) {
        if (err.detail === UNAUTHORISED_DETAIL) return;
        throw err;
    }
};

export const memberOnlyLoader = async () => {
    try {
        return await queryClient.ensureQueryData(currentUserQuery());
    } catch (err: any) {
        if (err.detail == UNAUTHORISED_DETAIL) throw redirect("/login");
        throw err;
    }
};

export const artistOnlyLoader = async () => {
    const user = await memberOnlyLoader();
    if (!user.artist_id) {
        throw new Response("You are not an artist", { status: 403 });
    }
    return { artist_id: user.artist_id };
};
