import { ClassSerializerInterceptor, UseInterceptors } from '@nestjs/common';
import { Exclude, Expose } from 'class-transformer';
import { Output } from './output.decorator';

class Test {
  propA: string;
  propB: string;
  propC: string;

  constructor(body: Partial<Test>) {
    Object.assign(this, body);
  }
}

class TestVm {
  @Expose()
  propA: string;

  @Exclude()
  propC: string;
}

@UseInterceptors(ClassSerializerInterceptor)
class TestController {

  @Output(TestVm)
  test() {
    return new Test({ propA: 'a', propB: 'b', propC: 'c' });
  }

  @Output([TestVm])
  tests() {
    return [
      new Test({ propA: 'a', propB: 'b' }),
      new Test({ propA: 'c', propB: 'd' }),
    ];
  }

  @Output(TestVm)
  async waitTest(): Promise<Test> {
    return new Test({ propA: 'a', propB: 'b' });
  }
}

describe('Output Decorator', () => {
  let ctrl;

  beforeAll(() => {
    ctrl = new TestController();
  });

  it('should return an instance of the view model', async function() {
    const res = await ctrl.test();
    expect(res).toBeInstanceOf(TestVm);
    expect(res).not.toHaveProperty('propB');
    expect(res).not.toHaveProperty('propC');
    expect(res.propA).toBe('a');
  });

  it('should return an array of the view model when given an array', async function() {
    const res = await ctrl.tests();
    expect(res).toHaveLength(2);
    expect(res[0]).toBeInstanceOf(TestVm);
    expect(res[0]).not.toHaveProperty('propB');
  });

  it('should work with promises', async function() {
    const res = await ctrl.waitTest();
    expect(res).toBeInstanceOf(TestVm);
    expect(res).not.toHaveProperty('propB');
    expect(res.propA).toBe('a');
  });

});
