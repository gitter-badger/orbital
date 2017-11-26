import { Context, GeneralValidator } from './command';

/// <reference types="node" />
import { Resolvable } from 'villa';
export interface Printable {
    print(stdout: NodeJS.WritableStream, stderr: NodeJS.WritableStream): Promise<void> | void;
}
export declare function isPrintable(object: any): object is Printable;
export interface StringCastable<T> {
    cast(source: string, context: CastingContext<T>): Resolvable<T>;
}
export declare function isStringCastable<T>(object: object): object is StringCastable<T>;
export declare type CastableType<T> = Orbital.Constructor<T> | StringCastable<T>;
export declare function cast<T>(source: string, type: CastableType<T>, context: CastingContext<T>): Promise<T>;
export interface CastingContextExtension<T> {
    name: string;
    validators: GeneralValidator<T>[];
    default: boolean;
    upper?: CastingContext<any>;
}
export interface CastingContext<T> extends CastingContextExtension<T>, Context {
}
export declare function buildCastingContext<T>(context: Context, extension: CastingContextExtension<T>): CastingContext<T>;