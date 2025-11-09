export function formatUpcoming(datetimeStr: string): string {
    const date = new Date(datetimeStr);
    const now = new Date();

    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);

    const isToday = date.toDateString() === now.toDateString();

    if (diffMs > 0) {
        // Past
        if (isToday) {
            if (diffMin < 1) return "just now";
            if (diffMin < 60) return `${diffMin} min. ago`;
            return `${diffHour} hr. ago`;
        } else {
            return date.toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
            });
        }
    } else {
        // Future
        if (isToday) {
            const diffMinAbs = Math.ceil(Math.abs(diffMs) / 1000 / 60);
            const diffHourAbs = Math.ceil(diffMinAbs / 60);
            if (diffMinAbs < 60) return `in ${diffMinAbs} min.`;
            return `in ${diffHourAbs} hr.`;
        } else {
            return date.toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
            });
        }
    }
}
