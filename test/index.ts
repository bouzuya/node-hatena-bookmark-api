import { Test, group, run } from "./helpers";
import { tests as clientTests } from "./client";
import { tests as credentialsTests } from "./credentials";
import { tests as operationTests } from "./operation";
import { tests as requestTests } from "./request";

const tests: Test[] = group("/", [
  ...clientTests,
  ...credentialsTests,
  ...operationTests,
  ...requestTests,
]);

run(tests).catch(() => process.exit(1));
