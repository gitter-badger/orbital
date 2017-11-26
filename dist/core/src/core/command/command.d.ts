import { HelpInfo } from '.';
/**
 * Options for command.
 */
export interface CommandOptions {
    /** Shown on usage as subcommand description. */
    brief?: string;
    /** Shown on usage as the description of current command. */
    description?: string;
}
/**
 * Options for context.
 */
export interface ContextOptions {
    /** Current working directory. */
    cwd: string;
    /** Commands sequence including entry and subcommands. */
    commands: string[];
}
/**
 * Command context.
 */
export declare class Context {
    /** Current working directory. */
    cwd: string;
    /** Commands sequence including entry and subcommands. */
    commands: string[];
    constructor({cwd, commands}: ContextOptions);
}
/**
 * Validation context.
 */
export interface ValidationContext {
    /** A descriptive name of the validation target. */
    name: string;
    /** The source string of the value before being casted. */
    source: string;
}
/**
 * Validator interface for parameters or options.
 */
export interface Validator<T> {
    /**
     * A method that validates a value.
     * It should throw an error (usually an instance of `ExpectedError`) if the
     * validation fails.
     * @param value - Value to be validated.
     * @param name - Name of the parameter or option, used for generating error
     * message.
     */
    validate(value: T, context: ValidationContext): void;
}
/**
 * A function that validates a value.
 * It should throw an error (usually an instance of `ExpectedError`) if the
 * validation fails.
 * @param value - Value to be validated.
 * @param name - Name of the parameter or option, used for generating error
 * message.
 */
export declare type ValidatorFunction<T> = (value: T, context: ValidationContext) => void;
export declare type GeneralValidator<T> = ValidatorFunction<T> | Validator<T> | RegExp;
/**
 * The abstract `Command` class to be extended.
 */
export declare abstract class Command {
    /**
     * @returns A promise or normal value.
     */
    abstract execute(...args: any[]): Promise<any> | any;
    /**
     * Get the help object of current command.
     */
    static getHelp(): Promise<HelpInfo>;
}
export declare type CommandClass = Orbital.Constructor<Command> & typeof Command;
/**
 * The `command()` decorator that decorates concrete class of `Command`.
 */
export declare function command(options?: CommandOptions): (target: typeof Command) => void;
/**
 * The `metadata` decorator does nothing at runtime. It is only used to have
 * TypeScript emits type metadata for `execute` method that has no other
 * decorators.
 */
export declare const metadata: MethodDecorator;