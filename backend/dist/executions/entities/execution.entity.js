"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Execution = exports.ExecutionStatus = void 0;
var ExecutionStatus;
(function (ExecutionStatus) {
    ExecutionStatus["PENDING"] = "pending";
    ExecutionStatus["RUNNING"] = "running";
    ExecutionStatus["COMPLETED"] = "completed";
    ExecutionStatus["FAILED"] = "failed";
})(ExecutionStatus || (exports.ExecutionStatus = ExecutionStatus = {}));
class Execution {
    id;
    userId;
    agentId;
    input;
    output;
    status;
    errorMessage;
    startedAt;
    completedAt;
    createdAt;
}
exports.Execution = Execution;
//# sourceMappingURL=execution.entity.js.map