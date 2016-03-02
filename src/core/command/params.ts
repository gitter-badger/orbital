import {
    Command,
    GeneralValidator
} from './command';

import {
    Reflection,
} from '../../utils';

export interface ParamsOptions<T> {
    name?: string;
    type: Clime.Constructor<T>;
    required?: boolean;
    validator?: GeneralValidator<T>;
    validators?: GeneralValidator<T>[];
    description?: string;
}

export interface ParamsDefinition<T> {
    name: string;
    index: number;
    type: Clime.Constructor<T>;
    required: boolean;
    validators: GeneralValidator<T>[];
    description: string;
}

export function params<T>(
    {
        name: paramName,
        type,
        required,
        validator,
        validators,
        description
    }: ParamsOptions<T>
) {
    if (!validators) {
        validators = validator ? [validator] : [];
    }

    return (target: Command, name: 'execute', index: number) => {
        let constructor = target.constructor as typeof Command;

        if (constructor.paramsDefinition) {
            throw new Error('Can only define one `params` parameter');
        }

        let paramDefinitions = constructor.paramDefinitions || [];

        type = type ||
            Reflect.getMetadata('design:paramtypes', target, 'execute')[index] as Clime.Constructor<T>;

        paramName = paramName || Reflection.getFunctionParameterName(target.execute, index);

        constructor.paramsDefinition = {
            name: paramName,
            index,
            type,
            required,
            validators,
            description
        };
    };
}

let x: Clime.Constructor<any>;