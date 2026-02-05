import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Reading {
    id: bigint;
    value: number;
    timestamp: Time;
}
export type Time = bigint;
export interface backendInterface {
    addReading(value: number): Promise<Reading>;
    getAllReadings(): Promise<Array<Reading>>;
    getLatestReading(): Promise<Reading>;
    sayHello(name: string): Promise<string>;
}
