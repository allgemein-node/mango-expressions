import {expect} from 'chai';
import {suite, test} from '@testdeck/mocha';
import * as _ from 'lodash';
import {AbstractCompare, IMangoWalker, MangoExpression, MultiArgs, PAst, PValue} from '../../src';
import {Project} from '../../src/operators/stage/Project';
import {AndDesc} from '../../src/operators/logic/AndDesc';
import {OrDesc} from '../../src/operators/logic/OrDesc';
import {Not} from '../../src/operators/logic/Not';
import {NotYetImplementedError} from '@allgemein/base/browser';
import {LookupWalker} from '../../src/walker/lookup/LookupWalker';


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


  onOperator(ast: PAst<any>, value: any): any {
    // console.log('onOperator ' + ClassUtils.getClassName(ast as any) + ' ' + ast.key);
    if (ast instanceof AbstractCompare) {
      if (value instanceof PValue) {
        return ast.getKeyString() + ' ' + ast.op + ' ' + (<PValue>value).value;
      } else if (ast.value instanceof PValue) {
        return ast.getKeyString() + ' ' + ast.op + ' ' + (<PValue>ast.value).value;
      } else if (value instanceof MultiArgs) {
        return ast.getKeyString() + ' ' + ast.op + ' ' + JSON.stringify((<MultiArgs>value).args);
      } else if (_.isString(value)) {
        return ast.getKeyString() + ' ' + ast.op + ' ' + value;
      } else {
        throw new NotYetImplementedError('on operator ' + JSON.stringify(ast) + ' ' + value);
      }

    }
    return null;
  }

  visitOperator(ast: PAst<any>): any {
    // console.log('visitOperator ' + ClassUtils.getClassName(ast as any) + ' ' + ast.key);
    return {};
  }

  leaveOperator(res: any, ast: PAst<any>): any {
    // console.log('leaveOperator ' + ClassUtils.getClassName(ast as any) + ' ' + ast.key);
    if (ast instanceof AndDesc) {
      return {and: res};
    } else if (ast instanceof OrDesc) {
      return {or: res};
    } else if (ast instanceof Not) {
      return 'not ' + res;
    }
    return res;
  }


  visitArray(ast: PAst<any>): any[] {
    // console.log('visitArray ' + ClassUtils.getClassName(ast as any) + ' ' + ast.key);
    return [];
  }

  leaveArray(res: any[], ast: PAst<any>): any {
    // console.log('leaveArray ' + ClassUtils.getClassName(ast as any) + ' ' + ast.key);
    return res;
  }

  visitObject(ast: PAst<any>): any {
    // console.log('visitObject ' + ClassUtils.getClassName(ast as any) + ' ' + ast.key);
    return {};
  }

  leaveObject(res: any, ast: PAst<any>): any {
    // console.log('leaveObject ' + ClassUtils.getClassName(ast as any) + ' ' + ast.key);
    if (_.keys(res).length > 1) {
      return {
        and: res
      };
    }
    return res;
  }
};


@suite('functional/compare_operators')
class CompareOperatorsSpec {


  @test
  async 'eq operator - implicit use if not concret'() {
    const exp = new MangoExpression({id: 1});
    const json = exp.toJson();
    expect(json).to.be.deep.eq({id: {$eq: 1}});
  }

  @test.only
  async 'eq operator - date'() {
    const d = new Date('2012-09-01T10:10:20.000Z');
    const exp = new MangoExpression({since: d});
    const json = exp.toJson();
    expect(json).to.be.deep.eq({since: {$eq: d}});
  }

  @test
  async 'eq operator - explicit declared'() {
    const exp = new MangoExpression({id: {$eq: 1}});
    const json = exp.toJson();
    expect(json).to.be.deep.eq({id: {$eq: 1}});
  }

  @test
  async 'eq operator - get validate function'() {
    const exp = new MangoExpression({id: {$eq: 1}});
    const fn = exp.visit(new LookupWalker());
    expect(fn({id: 1})).to.be.true;
    expect(fn({id: 2})).to.be.false;
  }

  @test
  async 'eq operator - get validate function with reference'() {
    const exp = new MangoExpression({id: {$eq: '$_id'}});
    const fn = exp.visit(new LookupWalker({_id: 4}));
    expect(fn({id: 4})).to.be.true;
    expect(fn({id: 2})).to.be.false;
  }

  @test
  async 'eq operator - get validate function with reference or passing value'() {
    const exp = new MangoExpression({id: {$eq: '$_id'}});
    const fn = exp.visit(new LookupWalker());
    const passing = {_id: 4};

    expect(() => fn({id: 4})).to.throws('Need second argument for getting referenced value to compare.')
    expect(fn({id: 4}, passing)).to.be.true;
    expect(fn({id: 2}, passing)).to.be.false;
  }

  @test
  async 'multiple eq operators'() {
    const exp = new MangoExpression({$and: [{id: {$eq: 1}},{name: {$eq: 'test'}}]});
    const fn = exp.visit(new LookupWalker());

    expect(fn({id: 1, name: 'test'})).to.be.true;
    expect(fn({id: 1, name: 'test', test: 'name'})).to.be.true;

    expect(fn({id: 2, name: 'test'})).to.be.false;
    expect(fn({id: 1, name: 'test2'})).to.be.false;
    expect(fn({id: 2, name: 'test2'})).to.be.false;
  }

  // TODO build programmatically
  @test.skip
  async 'eq operator - build programmatically'() {
  }// import {suite, test} from '@testdeck/mocha';
//
// import {expect} from 'chai';
// // import {AndDesc, Eq, Key, OrDesc, Value} from "../../src";
// // import {Expressions} from "../../src/libs/expressions/Expressions";
//
//
// @suite('functional/expressions')
// class ExpressionsSpec {
//
//
//   @test
//   async 'source and target keys'() {
//
//     const cond_01 = And(Eq('tableName', Value('condition_keeper')), Eq('tableId', Key('id')));
//     let source_keys = cond_01.getSourceKeys();
//     expect(source_keys).to.deep.eq(['tableName', 'tableId']);
//
//     let target_keys = cond_01.getTargetKeys();
//     expect(target_keys).to.deep.eq(['id']);
//
//
//   }
//
//   //
//   // @test
//   // async 'source and target keys are uniq'() {
//   //
//   //   const cond_01 = AndDesc(Eq('table', Key('test')), Eq('table', Key('test')));
//   //   let source_keys = cond_01.getSourceKeys();
//   //   expect(source_keys).to.deep.eq(['table']);
//   //
//   //   let target_keys = cond_01.getTargetKeys();
//   //   expect(target_keys).to.deep.eq(['test']);
//   //
//   //
//   //   const cond_02 = OrDesc(Eq('table', Key('test')), Eq('table', Key('test')));
//   //   source_keys = cond_01.getSourceKeys();
//   //   expect(source_keys).to.deep.eq(['table']);
//   //
//   //   target_keys = cond_01.getTargetKeys();
//   //   expect(target_keys).to.deep.eq(['test']);
//   //
//   // }
//   //
//   // @test
//   // async 'get map'() {
//   //   const cond_02 = AndDesc(Eq('tableNameWrong', Value('condition_keeper')), Eq('tableId', Key('id')));
//   //   let map = cond_02.getMap();
//   //   expect(map).to.be.deep.eq({tableNameWrong: '\'condition_keeper\'', tableId: 'id'});
//   // }
//   //
//   //
//   // @test
//   // async 'to and from json for "and" expression'() {
//   //   const cond_02 = AndDesc(Eq('tableNameWrong', Value('condition_keeper')), Eq('tableId', Key('id')));
//   //   let json = cond_02.toJson();
//   //   let cond_parsed = Expressions.fromJson(json);
//   //   let json2 = cond_parsed.toJson();
//   //   expect(json).to.deep.eq(json2);
//   //
//   // }
//   //
//   // @test
//   // async 'from json for simple equal expression'() {
//   //   const json_src_full = {
//   //     test: {$eq: 'hallo'}
//   //   };
//   //   const json_src = {
//   //     test: 'hallo'
//   //   };
//   //   let cond_parsed = Expressions.fromJson(json_src);
//   //   let json2 = cond_parsed.toJson();
//   //   expect(json2).to.deep.eq(json_src_full);
//   //
//   //   cond_parsed = Expressions.fromJson(json_src_full);
//   //   json2 = cond_parsed.toJson();
//   //   expect(json2).to.deep.eq(json_src_full);
//   //
//   // }
//   //
//   //
//   // @test
//   // async 'from json for implicit and expression'() {
//   //   const json_src_full = {
//   //     $and: [
//   //       {test: {$eq: 'hallo'}},
//   //       {test2: {$eq: 2}},
//   //     ]
//   //
//   //   };
//   //   const json_src = {
//   //     test: 'hallo',
//   //     test2: 2
//   //   };
//   //   let cond_parsed = Expressions.fromJson(json_src);
//   //   let json2 = cond_parsed.toJson();
//   //   expect(json2).to.deep.eq(json_src_full);
//   //
//   //   cond_parsed = Expressions.fromJson(json_src_full);
//   //   json2 = cond_parsed.toJson();
//   //   expect(json2).to.deep.eq(json_src_full);
//   //
//   // }
//   //
//   //
//   // @test
//   // async 'from json for multiple and | or combined expression'() {
//   //   const json_src_full = {
//   //     $and: [
//   //       {test: {$eq: 'hallo'}},
//   //       {test2: {$eq: 2}},
//   //       {
//   //         $or: [
//   //           {welt: {$eq: 'test'}}, {welt: {$eq: 2}}
//   //         ]
//   //       }
//   //     ]
//   //   };
//   //
//   //
//   //   let cond_parsed = Expressions.fromJson(json_src_full);
//   //   let json2 = cond_parsed.toJson();
//   //   expect(json2).to.deep.eq(json_src_full);
//   //
//   //   const json_src_full2 = {
//   //     $and: [
//   //       {
//   //         $or: [
//   //           {welt: {$eq: 'test'}}, {welt: {$eq: '2'}}
//   //         ]
//   //       },
//   //       {
//   //         $or: [
//   //           {welt2: {$eq: 'test'}}, {welt2: {$eq: 2}}
//   //         ]
//   //       }
//   //
//   //     ]
//   //   };
//   //
//   //
//   //   cond_parsed = Expressions.fromJson(json_src_full2);
//   //   json2 = cond_parsed.toJson();
//   //   expect(json2).to.deep.eq(json_src_full2);
//   //
//   // }
//   //
//   //
//   // @test
//   // async 'from json support for "in" expression'() {
//   //   const json_src_full2 = {
//   //     welt: {$in: ['test', 2]}
//   //   };
//   //
//   //
//   //   let cond_parsed = Expressions.fromJson(json_src_full2);
//   //   let json2 = cond_parsed.toJson();
//   //   expect(json2).to.deep.eq(json_src_full2);
//   // }
// }
//


  // @test
  // async 'eq operator - visitor'() {
  // const matchExp = exp.getByKeyString('$match');
  // console.log(inspect(exp, false, 10));

  // const result = exp.getRoot().visit(visitor);
  // // console.log(result);
  // expect(exp.getRoot()).to.be.instanceOf(PObject);
  // expect(result).to.be.deep.eq({id: 'id = 1'});
  // }

  //
  // @test
  // async '$match'() {
  //   const exp = new MangoExpression({$match: {test: {$lt: 1}}});
  //   const matchExp = exp.getByKey('$match');
  //   // console.log(inspect(exp, false, 10));
  //
  //   const result = matchExp.visit(visitor);
  //   // console.log(result);
  //   expect(matchExp).to.be.instanceOf(Match);
  //   expect(result).to.be.deep.eq({test: 'test < 1'});
  // }
  //
  // @test
  // async 'multiple value query'() {
  //   const exp = new MangoExpression({id: 1, role: 'Good', owner: 'Hans'});
  //   // const matchExp = exp.getByKeyString('$match');
  //   // console.log(inspect(exp, false, 10));
  //
  //   const result = exp.getRoot().visit(visitor);
  //   // console.log(result);
  //   expect(exp.getRoot()).to.be.instanceOf(PObject);
  //   expect(result).to.be.deep.eq({
  //     'and': {
  //       'id': 'id = 1',
  //       'owner': 'owner = Hans',
  //       'role': 'role = Good'
  //     }
  //   });
  // }
  //
  //
  // @test
  // async '$match query without command - $lt'() {
  //   const exp = new MangoExpression({test: {$lt: 1}});
  //   // console.log(inspect(exp, false, 10));
  //   const result = exp.visit(visitor);
  //   expect(result).to.be.deep.eq({test: 'test < 1'});
  // }
  //
  // @test
  // async '$match query without command - $eq'() {
  //   const exp = new MangoExpression({test: {$eq: 1}});
  //   // console.log(inspect(exp, false, 10));
  //   const result = exp.visit(visitor);
  //   expect(result).to.be.deep.eq({test: 'test = 1'});
  // }
  //
  // @test
  // async '$match query without command - $eq (indirect)'() {
  //   const exp = new MangoExpression({test: 1});
  //   // console.log(inspect(exp, false, 10));
  //   const result = exp.visit(visitor);
  //   expect(result).to.be.deep.eq({test: 'test = 1'});
  // }
  //
  //
  // @test
  // async '$match in array'() {
  //   const exp = new MangoExpression([{$match: {test: {$lt: 1}}}]);
  //   const matchExp = exp.getByKey('$match');
  //   // console.log(inspect(exp, false, 10));
  //   // console.log(inspect(matchExp, false, 10));
  //
  //   const result = matchExp.visit(visitor);
  //   // console.log(result);
  //   expect(matchExp).to.be.instanceOf(Match);
  //   expect(result).to.be.deep.eq({test: 'test < 1'});
  // }
  //
  // @test
  // async '$and conditions'() {
  //   const exp = new MangoExpression({$and: [{test: {$lt: 1}}, {hallo: 'welt'}]});
  //   const matchExp = exp.getRoot();
  //   // console.log(inspect(matchExp, false, 10));
  //
  //   const result = matchExp.visit(visitor);
  //   // console.log(inspect(result, false, 10));
  //   expect(matchExp).to.be.instanceOf(AndDesc);
  //   expect(result).to.be.deep.eq({and: [{test: 'test < 1'}, {hallo: 'hallo = welt'}]});
  // }
  //
  //
  // @test
  // async '$project - with field enabled)'() {
  //   const exp = new MangoExpression({$project: {test: 1}});
  //   // console.log(inspect(exp, false, 10));
  //   const result = exp.visit(visitor);
  //   expect(result).to.be.deep.eq({test: 'test_projected'});
  // }
  //
  //
  // @test
  // async '$regex'() {
  //   const exp = new MangoExpression({stg: {$regex: '.*849.*'}});
  //   const result = exp.visit(visitor);
  //   expect(exp.getRoot()).to.be.instanceOf(PObject);
  //   expect(result).to.be.deep.eq({stg: 'stg regexp [".*849.*"]'});
  // }
  //
  // @test
  // async '$regex with $options'() {
  //   const exp = new MangoExpression({stg: {$regex: '.*849.*', $options: 'i'}});
  //   expect(exp.getRoot()).to.be.instanceOf(PObject);
  //   const result = exp.visit(visitor);
  //   expect(result).to.be.deep.eq({stg: 'stg regexp [".*849.*","i"]'});
  // }
  //
  // @test
  // async 'use chained operators'() {
  //   const exp = new MangoExpression({field: {$not: {$eq: 1}}});
  //   // console.log(inspect(exp, false, 10));
  //   const result = exp.visit(visitor);
  //   expect(result).to.be.deep.eq({field: 'not field = 1'});
  // }
  //
  //
  // @test
  // async 'use multiple expressions on same key field => {and chain}'() {
  //   const exp = new MangoExpression({field: {$not: {$eq: 1}}});
  //   // console.log(inspect(exp, false, 10));
  //   const result = exp.visit(visitor);
  //   expect(result).to.be.deep.eq({field: 'not field = 1'});
  // }
  //
  // @test
  // async 'date'() {
  //   const date = new Date();
  //   const exp = new MangoExpression({date: {$eq: date}});
  //   const matchExp = exp.getRoot();
  //   // console.log(inspect(matchExp, false, 10));
  //
  //   const result = matchExp.visit(visitor);
  //   // console.log(inspect(result, false, 10));
  //   // expect(matchExp).to.be.instanceOf(EqualDesc);
  //   expect(result).to.be.deep.eq({date: 'date = ' + date.toString()});
  // }

}

