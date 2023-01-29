import {PAst} from '../ast/PAst';
import {Match} from './stage/Match';
import {LessThen} from './compare/LessThen';
import {MangoExpression} from '../MangoExpression';
import {AndDesc} from './logic/AndDesc';
import {OrDesc} from './logic/OrDesc';
import {LessThenEqual} from './compare/LessThenEqual';
import {EqualDesc} from './compare/EqualDesc';
import {GreaterThen} from './compare/GreaterThen';
import {GreaterThenEqual} from './compare/GreaterThenEqual';
import {In} from './compare/In';
import {IsNotNull} from './compare/IsNotNull';
import {IsNull} from './compare/IsNull';
import {Like} from './compare/Like';
import {NotEqual} from './compare/NotEqual';
import {NotIn} from './compare/NotIn';
import {Project} from './stage/Project';
import {Year} from './date/Year';
import {Month} from './date/Month';
import {Day} from './date/Day';
import {Group} from './stage/Group';
import {Sum} from './arithmetic/Sum';
import {Min} from './arithmetic/Min';
import {Max} from './arithmetic/Max';
import {Avg} from './arithmetic/Avg';
import {Count} from './arithmetic/Count';
import {Limit} from './stage/Limit';
import {Skip} from './stage/Skip';
import {Sort} from './stage/Sort';
import {Date} from './date/Date';
import {Context} from '../ast/Context';
import {Not} from './logic/Not';
import {Multiply} from './arithmetic/Multiply';
import {Regex} from './compare/Regex';
import {AbstractOperator} from './AbstractOperator';

/**
 * Operators registry
 */
export class Operators {


  static registry: { [k: string]: Function } = {};


  static key(k: string) {
    return k.replace(/^\$/, '');
  }

  /**
   * Install new operator
   *
   * @param name
   * @param opertor
   */
  static install(name: string, opertor: Function) {
    const _name = this.key(name);
    Operators.registry[_name] = opertor;
  }

  /**
   * Create an operator instance
   *
   * @param name
   * @param e
   * @param p
   * @param ctxt
   */
  static create(name: string, e: MangoExpression, p?: PAst<any>, ctxt?: Context): AbstractOperator<any> {
    const _name = this.key(name);
    if (this.registry[_name]) {
      return Reflect.construct(this.registry[_name], [e, p, ctxt]);
    } else {
      throw new Error(`no such operator ${_name} defined`);
    }
  }

  /**
   * Check if operator is defined.
   *
   * @param name
   */
  static has(name: string) {
    return this.registry.hasOwnProperty(this.key(name));
  }
}

/*
 *  Logic registry
 */
Operators.install(AndDesc.NAME, AndDesc);
Operators.install(OrDesc.NAME, OrDesc);
Operators.install(Not.NAME, Not);
// TODO $nor


/*
 *  Stage registry
 */
Operators.install(Match.NAME, Match);
Operators.install(Project.NAME, Project);
Operators.install(Group.NAME, Group);
Operators.install(Limit.NAME, Limit);
Operators.install(Skip.NAME, Skip);
Operators.install(Sort.NAME, Sort);

/*
 *  Date registry
 */
Operators.install(Year.NAME, Year);
Operators.install(Month.NAME, Month);
Operators.install(Day.NAME, Day);
Operators.install(Date.NAME, Date);
// TODO $dateToString

/*
 *  Arithmetic registry
 */
Operators.install(Sum.NAME, Sum);
Operators.install(Min.NAME, Min);
Operators.install(Max.NAME, Max);
Operators.install(Avg.NAME, Avg);
Operators.install(Count.NAME, Count);
Operators.install(Multiply.NAME, Multiply);
// TODO $add
// TODO $subtract

/*
 *  Compare registry
 */
Operators.install(LessThen.NAME, LessThen);
Operators.install(LessThenEqual.NAME, LessThenEqual);
// backward compatibility
Operators.install('lte', LessThenEqual);
Operators.install(EqualDesc.NAME, EqualDesc);
Operators.install(GreaterThen.NAME, GreaterThen);
Operators.install(GreaterThenEqual.NAME, GreaterThenEqual);
// backward compatibility
Operators.install('gte', GreaterThenEqual);
Operators.install(In.NAME, In);
Operators.install(IsNotNull.NAME, IsNotNull);
Operators.install(IsNull.NAME, IsNull);
// sql special, cause no eqivalnet in mongo
Operators.install(Like.NAME, Like);
Operators.install(NotEqual.NAME, NotEqual);
Operators.install(NotIn.NAME, NotIn);
Operators.install(Regex.NAME, Regex);


/*
 *  String registry
 */
// Operators.install(Substr.NAME, Substr);
// Operators.install(ToUpper.NAME, ToUpper);
// Operators.install(ToLower.NAME, ToLower);
// Operators.install(ToInt.NAME, ToInt);
// Operators.install(ToFloat.NAME, ToFloat);

/*
 *  Array registry
 */
// Operators.install(Map.NAME, Map);
// Operators.install(First.NAME, First);
// Operators.install(Last.NAME, Last);
