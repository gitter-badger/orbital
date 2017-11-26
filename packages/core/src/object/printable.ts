export interface Printable {
  print(stdout: NodeJS.WritableStream, stderr: NodeJS.WritableStream): Promise<void> | void;
}
