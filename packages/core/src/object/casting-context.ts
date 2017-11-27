import { CastingContextExtension } from './casting-context-extension';
import { Context } from './context';

export interface CastingContext<T> extends CastingContextExtension<T>, Context { }
