import {expect} from 'chai';
import {suite, test} from 'mocha-typescript';
import * as _ from 'lodash';
import {AbstractCompare, IMangoWalker, MangoExpression, MultiArgs, PAst, PObject, PValue} from '../../src';
import {Project} from '../../src/operators/stage/Project';
import {And} from '../../src/operators/logic/And';
import {Or} from '../../src/operators/logic/Or';
import {Not} from '../../src/operators/logic/Not';
import {Match} from '../../src/operators/stage/Match';
import {NotYetImplementedError} from 'commons-base';


const visitor = new class implements IMangoWalker {
  onValue(ast: PValue): any {
    // console.log('onValue ' + ClassUtils.getClassName(ast as any) + ' ' + ast.key);
    const isProject = ast.backwardCall(x => x instanceof Project);
    if (isProject) {
      return ast.value + '_projected';
    } else {
      return ast.value;
    }

  }


  onOperator(ast: PAst, value: any): any {
    // console.log('onOperator ' + ClassUtils.getClassName(ast as any) + ' ' + ast.key);
    if (ast instanceof AbstractCompare) {
      if (value instanceof PValue) {
        return ast.key + ' ' + ast.op + ' ' + (<PValue>value).value;
      } else if (ast.value instanceof PValue) {
        return ast.key + ' ' + ast.op + ' ' + (<PValue>ast.value).value;
      } else if (value instanceof MultiArgs) {
        return ast.key + ' ' + ast.op + ' ' + JSON.stringify((<MultiArgs>value).args);
      } else if (_.isString(value)) {
        return ast.key + ' ' + ast.op + ' ' + value;
      } else {
        throw new NotYetImplementedError('on operator ' + JSON.stringify(ast) + ' ' + value);
      }

    }
    return null;
  }

  visitOperator(ast: PAst): any {
    // console.log('visitOperator ' + ClassUtils.getClassName(ast as any) + ' ' + ast.key);
    return {};
  }

  leaveOperator(res: any, ast: PAst): any {
    // console.log('leaveOperator ' + ClassUtils.getClassName(ast as any) + ' ' + ast.key);
    if (ast instanceof And) {
      return {and: res};
    } else if (ast instanceof Or) {
      return {or: res};
    } else if (ast instanceof Not) {
      return 'not ' + res;
    }
    return res;
  }


  visitArray(ast: PAst): any[] {
    // console.log('visitArray ' + ClassUtils.getClassName(ast as any) + ' ' + ast.key);
    return [];
  }

  leaveArray(res: any[], ast: PAst): any {
    // console.log('leaveArray ' + ClassUtils.getClassName(ast as any) + ' ' + ast.key);
    return res;
  }

  visitObject(ast: PAst): any {
    // console.log('visitObject ' + ClassUtils.getClassName(ast as any) + ' ' + ast.key);
    return {};
  }

  leaveObject(res: any, ast: PAst): any {
    // console.log('leaveObject ' + ClassUtils.getClassName(ast as any) + ' ' + ast.key);
    if (_.keys(res).length > 1) {
      return {
        and: res
      };
    }
    return res;
  }
};


@suite('functional/expressions/mango_expressions')
class InjectSpec {


  @test
  async '$match'() {
    const exp = new MangoExpression({$match: {test: {$lt: 1}}});
    const matchExp = exp.getKey('$match');
    // console.log(inspect(exp, false, 10));

    const result = matchExp.visit(visitor);
    // console.log(result);
    expect(matchExp).to.be.instanceOf(Match);
    expect(result).to.be.deep.eq({test: 'test < 1'});
  }

  @test
  async 'single query'() {
    const exp = new MangoExpression({id: 1});
    // const matchExp = exp.getKey('$match');
    // console.log(inspect(exp, false, 10));

    const result = exp.getRoot().visit(visitor);
    // console.log(result);
    expect(exp.getRoot()).to.be.instanceOf(PObject);
    expect(result).to.be.deep.eq({id: 'id = 1'});
  }


  @test
  async 'multiple value query'() {
    const exp = new MangoExpression({id: 1, role: 'Good', owner: 'Hans'});
    // const matchExp = exp.getKey('$match');
    // console.log(inspect(exp, false, 10));

    const result = exp.getRoot().visit(visitor);
    // console.log(result);
    expect(exp.getRoot()).to.be.instanceOf(PObject);
    expect(result).to.be.deep.eq({
      'and': {
        'id': 'id = 1',
        'owner': 'owner = Hans',
        'role': 'role = Good'
      }
    });
  }


  @test
  async '$match query without command - $lt'() {
    const exp = new MangoExpression({test: {$lt: 1}});
    // console.log(inspect(exp, false, 10));
    const result = exp.visit(visitor);
    expect(result).to.be.deep.eq({test: 'test < 1'});
  }

  @test
  async '$match query without command - $eq'() {
    const exp = new MangoExpression({test: {$eq: 1}});
    // console.log(inspect(exp, false, 10));
    const result = exp.visit(visitor);
    expect(result).to.be.deep.eq({test: 'test = 1'});
  }

  @test
  async '$match query without command - $eq (indirect)'() {
    const exp = new MangoExpression({test: 1});
    // console.log(inspect(exp, false, 10));
    const result = exp.visit(visitor);
    expect(result).to.be.deep.eq({test: 'test = 1'});
  }


  @test
  async '$match in array'() {
    const exp = new MangoExpression([{$match: {test: {$lt: 1}}}]);
    const matchExp = exp.getKey('$match');
    // console.log(inspect(exp, false, 10));
    // console.log(inspect(matchExp, false, 10));

    const result = matchExp.visit(visitor);
    // console.log(result);
    expect(matchExp).to.be.instanceOf(Match);
    expect(result).to.be.deep.eq({test: 'test < 1'});
  }

  @test
  async '$and conditions'() {
    const exp = new MangoExpression({$and: [{test: {$lt: 1}}, {hallo: 'welt'}]});
    const matchExp = exp.getRoot();
    // console.log(inspect(matchExp, false, 10));

    const result = matchExp.visit(visitor);
    // console.log(inspect(result, false, 10));
    expect(matchExp).to.be.instanceOf(And);
    expect(result).to.be.deep.eq({and: [{test: 'test < 1'}, {hallo: 'hallo = welt'}]});
  }


  @test
  async '$project - with field enabled)'() {
    const exp = new MangoExpression({$project: {test: 1}});
    // console.log(inspect(exp, false, 10));
    const result = exp.visit(visitor);
    expect(result).to.be.deep.eq({test: 'test_projected'});
  }


  @test
  async '$regex'() {
    const exp = new MangoExpression({stg: {$regex: '.*849.*'}});
    const result = exp.visit(visitor);
    expect(exp.getRoot()).to.be.instanceOf(PObject);
    expect(result).to.be.deep.eq({ stg: 'stg regexp [".*849.*"]' });
  }

  @test
  async '$regex with $options'() {
    const exp = new MangoExpression({stg: {$regex: '.*849.*', $options: 'i'}});
    expect(exp.getRoot()).to.be.instanceOf(PObject);
    const result = exp.visit(visitor);
    expect(result).to.be.deep.eq({ stg: 'stg regexp [".*849.*","i"]' });
  }

  @test
  async 'use chained operators'() {
    const exp = new MangoExpression({field: {$not: {$eq: 1}}});
    // console.log(inspect(exp, false, 10));
    const result = exp.visit(visitor);
    expect(result).to.be.deep.eq({field: 'not field = 1'});
  }


  @test
  async 'use multiple expressions on same key field => {and chain}'() {
    const exp = new MangoExpression({field: {$not: {$eq: 1}}});
    // console.log(inspect(exp, false, 10));
    const result = exp.visit(visitor);
    expect(result).to.be.deep.eq({field: 'not field = 1'});
  }

  @test
  async 'date'() {
    const date = new Date();
    const exp = new MangoExpression({date: {$eq: date}});
    const matchExp = exp.getRoot();
    // console.log(inspect(matchExp, false, 10));

    const result = matchExp.visit(visitor);
    // console.log(inspect(result, false, 10));
    // expect(matchExp).to.be.instanceOf(Equal);
    expect(result).to.be.deep.eq({date: 'date = ' + date.toString()});
  }

}

