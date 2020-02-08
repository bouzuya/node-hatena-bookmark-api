import { Test, group, run } from "./helpers";
import { tests as operationTests } from "./operation";

const tests: Test[] = group("/", [...operationTests]);

run(tests).catch(() => process.exit(1));
