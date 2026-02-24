"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bounty = exports.BountyDelivery = exports.BountyApplication = exports.BountyStatus = void 0;
var BountyStatus;
(function (BountyStatus) {
    BountyStatus["OPEN"] = "open";
    BountyStatus["IN_PROGRESS"] = "in_progress";
    BountyStatus["DELIVERED"] = "delivered";
    BountyStatus["COMPLETED"] = "completed";
    BountyStatus["CANCELLED"] = "cancelled";
})(BountyStatus || (exports.BountyStatus = BountyStatus = {}));
class BountyApplication {
    id;
    bountyId;
    applicantId;
    proposal;
    estimatedDays;
    status;
    createdAt;
}
exports.BountyApplication = BountyApplication;
class BountyDelivery {
    id;
    bountyId;
    deliverables;
    attachments;
    notes;
    submittedAt;
}
exports.BountyDelivery = BountyDelivery;
class Bounty {
    id;
    title;
    description;
    reward;
    currency;
    status;
    creatorId;
    assigneeId;
    deadline;
    category;
    requirements;
    deliverables;
    applications;
    delivery;
    createdAt;
    updatedAt;
}
exports.Bounty = Bounty;
//# sourceMappingURL=bounty.entity.js.map