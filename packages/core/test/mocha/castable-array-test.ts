import {
  CastingContext,
  Context,
  buildCastingContext,
  cast,
} from '../../src/object/';

import { Validation } from '../../';
import { array } from '../../src/castable/array/array';

const context = new Context({
  cwd: __dirname,
  commands: ['clime'],
});

class CastableFoo {
  private constructor(
    public source: string,
  ) { }

  static cast(source: string, context: CastingContext<CastableFoo>): CastableFoo {
    return new CastableFoo(source);
  }
}

class Bar {
  constructor(
    public source: string,
  ) { }
}

const CastableBar = {
  cast(source: string, context: CastingContext<Bar>): Bar {
    return new Bar(source);
  },
};

describe('Castable Array', () => {
  it('should cast primitive values', async () => {
    let castingContext = buildCastingContext(context, {
      name: 'test',
      validators: [],
      default: false,
    });

    await cast('foo, bar', Array(String), castingContext)
      .should.eventually.deep.equal(['foo', 'bar']);

    await cast('123, 456', array(Number), castingContext)
      .should.eventually.deep.equal([123, 456]);

    await cast('true, false', array(Boolean), castingContext)
      .should.eventually.deep.equal([true, false]);
  });

  it('should cast string-castable values', async () => {
    let castingContext = buildCastingContext(context, {
      name: 'test',
      validators: [],
      default: false,
    });

    await cast('yo, ha', array(CastableFoo), castingContext)
      .should.eventually.deep.equal([
        { source: 'yo' },
        { source: 'ha' },
      ]);

    await cast('yo, ha', array(CastableBar), castingContext)
      .should.eventually.deep.equal([
        { source: 'yo' },
        { source: 'ha' },
      ]);
  });

  it('should cast nested Array values', async () => {
    let castingContext = buildCastingContext(context, {
      name: 'test',
      validators: [],
      default: false,
    });

    let type = array(array(String, { trim: false, empty: true }), { separator: ';' });

    await cast('yo,, ha ; biu, pia', type, castingContext)
      .should.eventually.deep.equal([
        ['yo', '', ' ha'],
        ['biu', ' pia'],
      ]);
  });

  it('should validate Array values', async () => {
    let castingContext = buildCastingContext(context, {
      name: 'test',
      validators: [],
      default: false,
    });

    let typeA = array(Number, {
      validators: [Validation.integer, Validation.range(10, 20)],
    });

    await cast('1, 15', typeA, castingContext)
      .should.be.rejectedWith('Value (1) of "element of test" is not within the range of [10, 20)');

    await cast('10, 15.5', typeA, castingContext)
      .should.be.rejectedWith('Value (15.5) of "element of test" is not an integer');

    let typeB = array(Number, {
      validator: /^1\d$/,
    });

    await cast('11, 22, 13', typeB, castingContext)
      .should.be.rejectedWith('Invalid value for "element of test"');
  });
});
