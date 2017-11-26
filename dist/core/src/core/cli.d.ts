/// <reference types="node" />
import { CommandClass, Context, HelpInfo } from './command';

import { ExpectedError } from './error';
import { Printable } from './object';
export interface CommandRoot {
    label: string;
    path: string;
}
export declare type GeneralCommandRoot = string | CommandRoot;
export interface CommandModule {
    default?: CommandClass;
    brief?: string;
    description?: string;
    subcommands?: SubcommandDefinition[];
}
export interface SubcommandDefinition {
    name: string;
    alias?: string;
    aliases?: string[];
    brief?: string;
}
export interface CommandEntry {
    path: string;
    module: CommandModule | undefined;
}
export interface SubcommandSearchBaseResult {
    name: string;
    path?: string | undefined;
    module: CommandModule | undefined;
    searchBase: string | undefined;
}
export interface SubcommandSearchInProgressContext extends SubcommandSearchBaseResult {
    label: string;
}
export interface SubcommandSearchContext extends SubcommandSearchInProgressContext {
    searchBase: string;
}
/**
 * Clime command line interface.
 */
export declare class CLI {
    /** Command entry name. */
    name: string;
    roots: CommandRoot[];
    constructor(
        /** Command entry name. */
        name: string,
        /** Root directory of command modules. */
        roots: GeneralCommandRoot | GeneralCommandRoot[]);
    execute(argv: string[], cwd?: string): Promise<any>;
    execute(argv: string[], contextExtension: object, cwd?: string): Promise<any>;
    private preProcessSearchBase(searchBase, possibleCommandName, aliasMap);
    /**
     * Mapping the command line arguments to a specific command file.
     */
    private preProcessArguments(argv);
    private executeCommand(command, commandArgs, commandExtraArgs, commandOptions, context);
    private static findEntryBySearchBase(searchBase);
}
export interface ParsedArgs {
    args: any[];
    extraArgs?: any[];
    options?: Orbital.Dictionary<any>;
    context?: Context;
}
export interface HelpProvider {
    getHelp(): Promise<HelpInfo> | HelpInfo;
}
export declare class UsageError extends ExpectedError implements Printable {
    helpProvider: HelpProvider;
    constructor(message: string, helpProvider: HelpProvider);
    print(stdout: NodeJS.WritableStream, stderr: NodeJS.WritableStream): Promise<void>;
}
