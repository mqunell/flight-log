import { default as airportsJson } from '../data/airports.json';
import { default as statesJson } from '../data/states.json';

export interface Airport {
	code: string; // IATA code
	name: string;
	city: string;
	state: string;
}

export interface State {
	name: string;
	abbr: string;
}

export const airports = airportsJson;
export const states = statesJson;
