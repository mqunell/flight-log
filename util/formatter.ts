/**
 * Format a number of minutes as "hh:mm"
 */
export function hoursMinutes(minutes: number): string {
	if (minutes < 0) return 'Invalid time';

	const h = Math.floor(minutes / 60);
	const m = (minutes % 60).toString().padStart(2, '0');

	return `${h}:${m}`;
}

/**
 * Format a number of minutes as "X days, Y hours, Z minutes"
 */
export function daysHoursMinutesText(minutes: number): string {
	if (minutes < 0) return 'Invalid time';

	const d = Math.floor(minutes / (60 * 24));
	minutes -= d * (60 * 24);
	const h = Math.floor(minutes / 60);
	const m = minutes % 60;

	return `${d} days, ${h} hours, ${m} minutes`;
}

/**
 * Format a number with commas, ex. 12345 as "12,345"
 */
export function withCommas(num: number): string {
	const numberFormatter = new Intl.NumberFormat();
	return numberFormatter.format(num);
}
