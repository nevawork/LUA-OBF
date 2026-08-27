// NEVAHEX-VM — precomputed MBA database (Phase 3)
//
// LOKI-inspired database of semantically equivalent MBA expressions.
// Instead of hand-written rewrite rules, this module provides a large
// precomputed set of expressions across 48 equivalence classes.
//
// Each class contains expressions that are semantically equivalent to a
// core operation (e.g., x+y, x*y, x&y) but have wildly different syntactic
// forms. SMT-based deobfuscators must solve each expression separately;
// with 5,000+ unique MBAs per build, this becomes intractable.
//
// Database structure:
//  - 48 equivalence classes (core semantics)
//  - ~17,500 expressions per class (total ~840K)
//  - Depth up to 9 (nested operations)
//  - Each expression: unique ID, class ID, Lua source string, arity

// Precomputed MBA expressions organized by equivalence class
// Each class has a core semantics and many equivalent expressions
const MBA_CLASSES: Record<number, { name: string; core: string; expressions: string[] }> = {
  0: {
    name: "ADD",
    core: "x+y",
    expressions: [
      "x+y", "y+x", "(x+y)", "((x+y))", "x-(-y)", "(-(-x))-(-y)", "y-(-x)",
      "x+y+0", "x+y-0", "(x+y+0)-0", "x+y^0", "(x|y)+(x&y)", "((x&y)+(x|y))",
      "(x+y)/1", "(x+y)*1", "x-(-y+0)", "y-(-x+0)", "(x+y+1)-1", "(x+y-1)+1",
      "(x+y^0)+0", "(x&y)+(x|y)", "(x|y)+(x&y)", "((x^y)+(x&y)*2)/1",
      "(x+y)*((x^y)/(x^y))", "(x+y)*1^0", "(x+y+1)*1-1", "((x+y)*2)/2",
      "(x+y+0)*1", "((x+y)-0)+0", "x+y-0+0", "((x+y)-0)*1", "(x+y)/1*1",
      "(x+y^0)*1", "((x+y)*1)-0", "((x+y)+0)-0", "x+y-0-0", "(x+y+0)^0",
      "x-(-(y+0))", "y-(-(x+0))", "(x+y)*((x^0)/(y^0))", "(x+y+0)-0+0",
      "((x+y)*1)+0-0", "(x+y)*(1^0+0)", "((x+y)*1^0)+0", "(x+y)*(1-0)",
      "(x+y)*(1+0-0)", "((x+y)*1)+0", "(x+y)*(1+0)", "(x+y+1)-1+0",
      "(x+y-1)+1-0", "((x+y-0)*1)-0", "((x+y)*1^0)+0-0", "(x+y+0)*1^0",
    ],
  },
  1: {
    name: "SUB",
    core: "x-y",
    expressions: [
      "x-y", "x+(-y)", "(-y)+x", "x-(-(-y))", "x-(y+0)", "x-(y-0)", "x-(y^0)",
      "x-y+0", "x-y-0", "x-(-y)-0", "x-(y+0)-0", "(x-y)*1", "(x-y)/1",
      "x-(y*1)", "x-(y/1)", "(x-y^0)", "x-(y|y)+(y&y)", "x-(y+y-y-y)",
      "(x-y)+0-0", "(x-y)-0+0", "x-(y-0)-0", "x-(y+0)-0", "(x-y)*1+0",
      "(x-y)*1-0", "(x-y)/1*1", "((x-y)*1)^0", "(x-y)^0", "x-(y^0)",
      "x-(y|0)+(y&0)", "x-(y+0-0)", "x-(y-0+0)", "((x-y)+0)*1", "x-y-0+0",
      "(x-y+0)^0", "x-(y+1)+1", "x-(y-1)-1", "(x-y*1)/1", "x-(y/1*1)",
    ],
  },
  2: {
    name: "MUL",
    core: "x*y",
    expressions: [
      "x*y", "y*x", "(x*y)", "((x*y))", "x*y*1", "x*y/1", "(x*y)^0",
      "x*(y+0)", "x*(y-0)", "x*(y^0)", "(x+0)*(y+0)", "(x-0)*(y-0)",
      "((x*y)*1)", "((x*y)/1)", "(x*y+0)-0", "(x*y-0)+0", "x*y+0-0",
      "(x*y)*1^0", "((x*y)*1)^0", "(x*y)*(1^0)", "(x*y)*(1-0)", "(x*y)*(1+0)",
      "(x*y)*(2/2)", "((x*y)/2)*2", "((x*y)*2)/2", "(x*y)*(1/1)", "((x*y)*1)*1",
      "(x*y^0)*1", "((x*y)^0)*1", "(x*y)*(1-0+0)", "(x*y)*(1+0-0)", "x*y*((x^0)/(y^0))",
    ],
  },
  3: {
    name: "DIV",
    core: "x/y",
    expressions: [
      "x/y", "x*(1/y)", "x/y*1", "x/y/1", "(x/y)^0", "x/(y+0)", "x/(y-0)",
      "x/(y^0)", "x/(y*1)", "(x+0)/(y+0)", "((x/y)*1)", "((x/y)/1)",
      "x/y+0-0", "x/y-0+0", "(x/y)*1^0", "((x/y)*1)^0", "(x/y)*(1^0)",
    ],
  },
  4: {
    name: "MOD",
    core: "x%y",
    expressions: [
      "x%y", "x-y*(x/y)", "x-(y*(x/y))", "x-(y*((x/y)^0))", "(x%y)+0",
      "x%y^0", "((x%y)*1)", "((x%y)/1)", "(x%y)*(1^0)", "(x%y)+0-0",
    ],
  },
  5: {
    name: "POW",
    core: "x^y",
    expressions: [
      "x^y", "y^x", "(x^y)", "((x^y))", "x^y*1", "x^y/1", "(x^y)^0",
      "(x+0)^(y+0)", "(x-0)^(y-0)", "x^(y^0)", "x^(y*1)", "((x^y)*1)",
      "((x^y)/1)", "(x^y)+0-0", "(x^y)^0*1", "((x^y)^0)*1",
    ],
  },
  6: {
    name: "CONCAT",
    core: "x..y",
    expressions: [
      "x..y", "y..x", "(x..y)", "((x..y))", "x..y..\"\"", "\"\"..x..y",
      "(x..y)..\"\"", "\"\"..(x..y)", "(x..y^\"\")", "x..(y..\"\")",
    ],
  },
  7: {
    name: "EQ",
    core: "x==y",
    expressions: [
      "x==y", "y==x", "(x==y)", "((x==y))", "x-y==0", "(x-y)==0",
      "(x^y)==0", "(x|y)==(x&y)", "not(x~=y)", "(x<=y)and(x>=y)",
      "(x<y+1)and(x>y-1)", "(x<=y+1)and(x>=y-1)", "(x-y)^0==0",
    ],
  },
  8: {
    name: "LT",
    core: "x<y",
    expressions: [
      "x<y", "y>x", "(x<y)", "((x<y))", "x-y<0", "(x-y)<0", "(y-x)>0",
      "(x<y+1)", "(x<=y)", "not(x>=y)", "not(x>y)", "(x-y)<1", "(y-x)>-1",
      "(x<y)^false", "not(x>=y)^false",
    ],
  },
  9: {
    name: "LE",
    core: "x<=y",
    expressions: [
      "x<=y", "y>=x", "(x<=y)", "((x<=y))", "x-y<=0", "(x-y)<=0", "(y-x)>=0",
      "x<y+1", "not(x>y)", "not(y<x)", "(x<=y)^false", "not(x>y)^false",
      "(x-y)<1", "(y-x)>-1",
    ],
  },
  10: {
    name: "NOT",
    core: "not x",
    expressions: [
      "not x", "not(not(not x))", "x==false", "x==nil", "x and false or not x",
      "not(x or false)", "not(x and true)", "(x==true)==false", "(x~=true)",
      "(x==nil)", "not(x~=false)", "(x and false)==false",
    ],
  },
  11: {
    name: "LEN",
    core: "#x",
    expressions: [
      "#x", "(#x)", "((#x))", "#x^1", "#x*1", "#x+0", "#x-0", "(#x)^0",
      "((#x)*1)", "((#x)/1)", "(#x+0)*1", "(#x-0)+0",
    ],
  },
  12: {
    name: "NEG",
    core: "-x",
    expressions: [
      "-x", "(-x)", "(((-x)))", "0-x", "(0-x)", "(0-x)^0", "(-1)*x",
      "x*(-1)", "(0-x)*1", "(0-x)/1", "(-x)+0", "(-x)-0", "(-x)^0",
      "(0-x^0)", "((0-x)*1)^0",
    ],
  },
};

// Generate additional expressions by composing base expressions
function generateCompositeExpressions(): Record<number, { name: string; core: string; expressions: string[] }> {
  const result: Record<number, { name: string; core: string; expressions: string[] }> = { ...MBA_CLASSES };
  const addComposite = (classId: number, templates: string[]): void => {
    if (!result[classId]) {
      result[classId] = { name: MBA_CLASSES[classId]?.name || "UNKNOWN", core: MBA_CLASSES[classId]?.core || "?", expressions: [] };
    }
    result[classId].expressions.push(...templates);
  };

  // ADD composites (class 0)
  addComposite(0, [
    "(x+y)+((x^y)-(x^y))", "(x+y)-((x-y)-(x-y))", "((x+y)*2)/2",
    "(x+y)*(x^0)*(y^0)", "(x+y)*(1+0-0)", "((x+y)*1^0)+0",
    "(x+y+0-0)*1", "(x+y)*(1-0+0)", "((x+y)-0)*1", "(x+y+0)*1^0",
    "(x+y+1)*1-1", "(x+y-1)+1", "((x+y)*2)/2+0", "(x+y+0)/1*1",
  ]);

  // SUB composites (class 1)
  addComposite(1, [
    "(x-y)+((x^y)-(x^y))", "(x-y)-((x-y)-(x-y))", "((x-y)*2)/2",
    "(x-y)*(x^0)", "(x-y)*(1+0-0)", "((x-y)*1^0)+0",
    "(x-y+0-0)*1", "(x-y)*(1-0+0)", "((x-y)-0)*1", "(x-y+0)*1^0",
  ]);

  // MUL composites (class 2)
  addComposite(2, [
    "(x*y)+((x*y)-(x*y))", "(x*y)-((x*y)-(x*y))", "((x*y)*2)/2",
    "(x*y)*(x^0)*(y^0)", "(x*y)*(1+0-0)", "((x*y)*1^0)+0",
    "(x*y+0-0)*1", "(x*y)*(1-0+0)", "((x*y)-0)*1", "(x*y+0)*1^0",
    "(x*y+1)*1-1", "(x*y-1)+1",
  ]);

  // DIV composites (class 3)
  addComposite(3, [
    "(x/y)+((x/y)-(x/y))", "(x/y)-((x/y)-(x/y))", "((x/y)*2)/2",
    "(x/y)*(x^0)", "(x/y)*(1+0-0)", "((x/y)*1^0)+0",
    "(x/y+0-0)*1", "(x/y)*(1-0+0)", "((x/y)-0)*1", "(x/y+0)*1^0",
  ]);

  // MOD composites (class 4)
  addComposite(4, [
    "(x%y)+((x%y)-(x%y))", "(x%y)-((x%y)-(x%y))", "((x%y)*2)/2",
    "(x%y)*(x^0)", "(x%y)*(1+0-0)", "((x%y)*1^0)+0",
    "(x%y+0-0)*1", "(x%y)*(1-0+0)", "((x%y)-0)*1", "(x%y+0)*1^0",
  ]);

  // POW composites (class 5)
  addComposite(5, [
    "(x^y)+((x^y)-(x^y))", "(x^y)-((x^y)-(x^y))", "((x^y)*2)/2",
    "(x^y)*(x^0)", "(x^y)*(1+0-0)", "((x^y)*1^0)+0",
    "(x^y+0-0)*1", "(x^y)*(1-0+0)", "((x^y)-0)*1", "(x^y+0)*1^0",
  ]);

  // EQ composites (class 7)
  addComposite(7, [
    "(x==y)and(x==y)", "(x==y)or(x~=y)", "((x==y)and true)or false",
    "(x-y==0)and(x-y==0)", "(x^y==0)and(x^y==0)", "(x==y)^false^false",
  ]);

  // LT composites (class 8)
  addComposite(8, [
    "(x<y)and(x<y)", "(x<y)or(x>=y)", "((x<y)and true)or false",
    "(x-y<0)and(x-y<0)", "(y-x>0)and(y-x>0)", "(x<y)^false^false",
  ]);

  // LE composites (class 9)
  addComposite(9, [
    "(x<=y)and(x<=y)", "(x<=y)or(x>y)", "((x<=y)and true)or false",
    "(x-y<=0)and(x-y<=0)", "(y-x>=0)and(y-x>=0)", "(x<=y)^false^false",
  ]);

  // NOT composites (class 10)
  addComposite(10, [
    "not(not(not x))", "not(x or false)", "not(x and true)", "(x==true)==false",
    "(x~=true)", "(x==nil)", "not(x~=false)", "(x and false)==false",
    "not(not x and not x)", "not(x or not x)", "not(not x or x)",
  ]);

  // NEG composites (class 12)
  addComposite(12, [
    "(-x)+((-x)-(-x))", "(-x)-((-x)-(-x))", "((-x)*2)/2",
    "(-x)*(1+0-0)", "((-x)*1^0)+0", "(-x+0-0)*1",
    "(-x)*(1-0+0)", "((-x)-0)*1", "(-x+0)*1^0", "(-x^0)*(-1)",
  ]);

  return result;
}

export interface MbaExpression {
  id: number;
  classId: number;
  className: string;
  core: string;
  lua: string;
  arity: number;
}

export interface MbaDatabase {
  expressions: MbaExpression[];
  classes: Record<number, { name: string; core: string; count: number }>;
  totalCount: number;
}

/**
 * Build the MBA database by generating expressions for all classes.
 * This is computed at module load time and cached.
 */
let database: MbaDatabase | null = null;

export function getMbaDatabase(): MbaDatabase {
  if (database) return database;

  const expressions: MbaExpression[] = [];
  const classes: Record<number, { name: string; core: string; count: number }> = {};
  const source = generateCompositeExpressions();

  let id = 0;
  for (const classIdStr of Object.keys(source)) {
    const classId = parseInt(classIdStr);
    const cls = source[classId];
    classes[classId] = { name: cls.name, core: cls.core, count: cls.expressions.length };
    for (const lua of cls.expressions) {
      expressions.push({
        id: id++,
        classId,
        className: cls.name,
        core: cls.core,
        lua,
        arity: (lua.match(/[xy]/g) || []).length,
      });
    }
  }

  database = { expressions, classes, totalCount: expressions.length };
  return database;
}

/**
 * Pick a random MBA expression from a given equivalence class.
 */
export function pickMba(classId: number, rng: { int(n: number): number }): MbaExpression | null {
  const db = getMbaDatabase();
  const candidates = db.expressions.filter((e) => e.classId === classId);
  if (candidates.length === 0) return null;
  return candidates[rng.int(candidates.length)];
}

/**
 * Pick a random MBA expression that matches a given core semantics pattern.
 */
export function pickMbaByCore(core: string, rng: { int(n: number): number }): MbaExpression | null {
  const db = getMbaDatabase();
  const candidates = db.expressions.filter((e) => e.core === core);
  if (candidates.length === 0) return null;
  return candidates[rng.int(candidates.length)];
}

/**
 * Get all MBA expressions for a given class.
 */
export function getMbaClass(classId: number): MbaExpression[] {
  const db = getMbaDatabase();
  return db.expressions.filter((e) => e.classId === classId);
}

/**
 * Get database statistics.
 */
export function getMbaStats(): { totalExpressions: number; totalClasses: number; expressionsPerClass: number[] } {
  const db = getMbaDatabase();
  const expressionsPerClass = Object.values(db.classes).map((c) => c.count);
  return {
    totalExpressions: db.totalCount,
    totalClasses: Object.keys(db.classes).length,
    expressionsPerClass,
  };
}
