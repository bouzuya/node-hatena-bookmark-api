import assert from "assert";
import { Test, run } from "beater";
import { name, named } from "beater-helpers";

const group = (groupName: string, tests: Test[]): Test[] =>
  tests.map(test => named(groupName + name(test), test));

export { Test, assert, group, run, named as test };
