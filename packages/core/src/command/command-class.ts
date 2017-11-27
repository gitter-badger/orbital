import { Executable } from './executable';

export type CommandClass = Orbital.Constructor<Executable> & typeof Executable;
