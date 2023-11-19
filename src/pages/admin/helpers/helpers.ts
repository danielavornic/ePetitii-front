export function formatDateString(dateStr: string): string {
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    // Parse the date string
    const dateObj = new Date(dateStr);

    // Format the date
    const year = dateObj.getFullYear();
    const month = months[dateObj.getMonth()];
    const day = dateObj.getDate();
    const hours = dateObj.getHours();
    const minutes = dateObj.getMinutes();

    // Pad minutes with leading zero if needed
    const paddedMinutes = minutes.toString().padStart(2, '0');

    return `${month} ${day}, ${year}, ${hours}:${paddedMinutes}`;
}

// Example usage
const dateStr = "2023-08-18T23:00:00.000+00:00";
console.log(formatDateString(dateStr));
