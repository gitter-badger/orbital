import 'source-map-support/register';

import {
  Command,
  Executable,
  ExpectedError,
  Option,
  Options,
  Param,
} from '../../../packages/core';

// tslint:disable-next-line:no-unbound-method
const hasOwnProperty = Object.prototype.hasOwnProperty;

const messageMap: {
  [key: string]: string;
} = {
  en: 'Hello, {name}!',
  zh: '你好, {name}!',
};

export class GreetingOptions extends Options {
  @Option({
    flag: 'l',
    default: 'en',
    description: 'Language of greeting message',
  })
  lang: string;
}

@Command({
  description: 'This is a command that prints greeting message',
})
export default class extends Executable {
  execute(
    @Param({
      name: 'yourName',
      required: true,
      description: 'Your loud name',
    })
    name: string,

    options: GreetingOptions,
  ) {
    let lang = options.lang;

    if (hasOwnProperty.call(messageMap, lang)) {
      return messageMap[lang].replace('{name}', name);
    } else {
      throw new ExpectedError(`Language "${lang}" is not supported`);
    }
  }
}
