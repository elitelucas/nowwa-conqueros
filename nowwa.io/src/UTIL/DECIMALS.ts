import Decimal from "decimal.js";

class DECIMALS {
  public static plus(a: any, b: any): Number {
    let aa = new Decimal(a);
    let bb = new Decimal(b);
    let cc = aa.plus(bb);
    return cc.toNumber();
  }

  public static minus(a: any, b: any): Number {
    let aa = new Decimal(a);
    let bb = new Decimal(b);
    let cc = aa.minus(bb);
    return cc.toNumber();
  }
}

export var plus = DECIMALS.plus;
export var minus = DECIMALS.minus;

export default DECIMALS;
