"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Purchase = exports.PurchaseStatus = void 0;
var PurchaseStatus;
(function (PurchaseStatus) {
    PurchaseStatus["PENDING"] = "pending";
    PurchaseStatus["COMPLETED"] = "completed";
    PurchaseStatus["FAILED"] = "failed";
    PurchaseStatus["REFUNDED"] = "refunded";
})(PurchaseStatus || (exports.PurchaseStatus = PurchaseStatus = {}));
class Purchase {
    id;
    userId;
    agentId;
    amount;
    currency;
    status;
    createdAt;
    updatedAt;
}
exports.Purchase = Purchase;
//# sourceMappingURL=purchase.entity.js.map