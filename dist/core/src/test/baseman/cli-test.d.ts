/// <reference types="node" />
import { CLITest, CLITestCase } from 'baseman';
export declare class ClimeCLITestCase extends CLITestCase {
    readonly description: string;
    extractOutput(stdout: Buffer, stderr: Buffer): [string, string];
}
export declare class ClimeCLITest extends CLITest {
    generate(): Promise<ClimeCLITestCase[]>;
}
declare const _default: ClimeCLITest;
export default _default;
