# Orbital
Command line framework in Typescript for nodejs. Orbital is a fork of the [Clime](https://github.com/vilic/clime) framework.
This is currently a work in progress.

## Motivations
We were not happy of the CLI framework we used while working on a [CLI](https://github.com/nestjs/nest-cli) for the [Nest](https://github.com/nestjs/nest) framework, so we decided to write one in Typescript with the new declarative/decorator syntax that arised along with angular and found about [Clime](https://github.com/vilic/clime). We're now in the process of refactoring it and moving the API towards what we want.

## What we're moving towards
```typescript
/// example.cli.ts
import { CLI, Executable } from '@orbital/core';

import { ExampleCommand } from './commands/example/example.command';
import { InfoCommand } from './commands/info.command';

@CLI({
   name: 'example',
   version: '1.0.0',
   commands: [
      ExampleCommand,
      InfoCommand
   ]
})
export class ExampleCLI implements Executable {
   execute() { }
}
```
```typescript
/// commands/example/example.command.ts
import { Parameter, Command, Executable, Option, UseOptions, VariadicParameter } from '@orbital/core';

import { ServiceCommand } from './service/service.command';

@Command({
    name: 'example',
    aliases: ['e'],
    brief: 'This is a one line description',
    description: `
      This is a long decription,
      It is split across multiple lines
    `,
    subCommands: [
        ServiceCommand
    ]
})
export class ExampleCommand implements Executable {

    @Option({
        flag: 'b',
        brief: '',
        description: '',
        validators: []
    })
    bar: string;

    constructor(
        @UseOptions(GenerateOptions) private options: GenerateOptions
    ) { }

    execute(
        @Parameter({
            brief: '',
            description: '',
            validators: []
        }) url: URL,

        @Parameter({
            brief: '',
            description: '',
            required: false,
            validators: []
        }) optional: string,

        @VariadicParameter({
            validators: []
        }) foo: string[]
    ) {
        // implementation
    }
}
```
