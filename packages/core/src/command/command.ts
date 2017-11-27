import { CommandOptions } from './command-options';
import { Context } from '../object/context';
import { Executable } from './executable';
import { Options } from '../option/options';

/**
 * The `Command()` decorator that decorates concrete class of `Command`.
 */
export function Command(options: CommandOptions = {}) {
  return (target: typeof Executable) => {
    target.brief = options.brief;
    target.description = options.description;

    // Validate param definitions.
    let paramDefinitions = target.paramDefinitions || [];
    let paramsDefinition = target.paramsDefinition;
    let variadicParamsRequired = paramsDefinition && paramsDefinition.required;

    if (paramDefinitions.length) {
      let hasOptional = false;

      for (let i = 0; i < paramDefinitions.length; i++) {
        let definition = paramDefinitions[i];

        if (!definition) {
          throw new Error(`Expecting parameter definition at position ${i}`);
        }

        if (hasOptional) {
          if (definition.required) {
            throw new Error('Required parameter cannot follow optional ones');
          }
        } else {
          if (definition.required) {
            target.requiredParamsNumber++;
          } else {
            if (variadicParamsRequired) {
              throw new Error('Parameter cannot be optional if variadic parameters are required');
            }

            hasOptional = true;
          }
        }
      }
    }

    if (paramsDefinition && paramsDefinition.index !== paramDefinitions.length) {
      throw new Error('Expecting variadic parameters to be adjacent to other parameters');
    }

    // Prepare option definitions.
    let types = Reflect.getMetadata('design:paramtypes', target.prototype, 'execute') as Orbital.Constructor<any>[];

    if (!types) {
      throw new Error('No parameter type information found, please add `@Metadata` decorator to method `execute` \
if no other decorator applied');
    }

    let optionsConstructorCandidateIndex = paramDefinitions.length + (target.paramsDefinition ? 1 : 0);
    let optionsConstructorCandidate = types[optionsConstructorCandidateIndex];

    let contextConstructorCandidateIndex: number;

    if (optionsConstructorCandidate && optionsConstructorCandidate.prototype instanceof Options) {
      target.optionsConstructor = optionsConstructorCandidate;
      target.optionDefinitions = (optionsConstructorCandidate as any as typeof Options).definitions;

      contextConstructorCandidateIndex = optionsConstructorCandidateIndex + 1;
    } else {
      contextConstructorCandidateIndex = optionsConstructorCandidateIndex;
    }

    let contextConstructorCandidate = types[contextConstructorCandidateIndex];

    if (
      contextConstructorCandidate && (
        contextConstructorCandidate === Context ||
        contextConstructorCandidate.prototype instanceof Context
      )
    ) {
      target.contextConstructor = contextConstructorCandidate;
    }

    target.decorated = true;
  };
}

/**
 * The `metadata` decorator does nothing at runtime. It is only used to have
 * TypeScript emits type metadata for `execute` method that has no other
 * decorators.
 */
export const Metadata: MethodDecorator = () => { };
