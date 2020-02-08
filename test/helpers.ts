import assert from "assert";
import { Test, run } from "beater";
import { name, named } from "beater-helpers";
import nock from "nock";
import sinon from "sinon";

const group = (groupName: string, tests: Test[]): Test[] =>
  tests.map(test => named(groupName + name(test), test));

const test = (
  name: string,
  test: (context: { sandbox: sinon.SinonSandbox }) => void | Promise<void>
): Test => {
  return named(name, async () => {
    nock.disableNetConnect();
    const sandbox = sinon.createSandbox();
    try {
      await Promise.resolve().then(() => test({ sandbox }));
    } finally {
      nock.cleanAll();
      nock.enableNetConnect();
      sandbox.restore();
    }
  });
};

export { Test, assert, group, run, test };
