import {
  Command,
  Executable,
  Param
} from '../../../../..';

@Command({
  description: 'Foo bar',
})
export default class extends Executable {
  execute(
    @Param()
    error: boolean,

    @Param({
      default: true,
    })
    stack: boolean,
  ) {
    if (error) {
      let error = new Error('Instance of Error');

      if (stack) {
        throw error;
      } else {
        delete error.stack;
        throw error;
      }
    } else {
      // tslint:disable-next-line:no-string-throw
      throw 'Some meaningless string';
    }
  }
}
