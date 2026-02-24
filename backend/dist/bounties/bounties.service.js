"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BountiesService = void 0;
const common_1 = require("@nestjs/common");
const bounty_entity_1 = require("./entities/bounty.entity");
const query_bounty_dto_1 = require("./dto/query-bounty.dto");
const crypto_1 = require("crypto");
let BountiesService = class BountiesService {
    bounties = new Map();
    async create(dto, creatorId) {
        const now = new Date();
        const bounty = {
            id: (0, crypto_1.randomUUID)(),
            title: dto.title,
            description: dto.description,
            reward: dto.reward,
            currency: dto.currency || 'USD',
            status: bounty_entity_1.BountyStatus.OPEN,
            creatorId,
            deadline: new Date(dto.deadline),
            category: dto.category,
            requirements: dto.requirements,
            deliverables: dto.deliverables,
            applications: [],
            createdAt: now,
            updatedAt: now,
        };
        this.bounties.set(bounty.id, bounty);
        return bounty;
    }
    async findAll(query) {
        let results = Array.from(this.bounties.values());
        if (query.q) {
            const keyword = query.q.toLowerCase();
            results = results.filter((b) => b.title.toLowerCase().includes(keyword) ||
                b.description.toLowerCase().includes(keyword));
        }
        if (query.category) {
            results = results.filter((b) => b.category === query.category);
        }
        if (query.status) {
            results = results.filter((b) => b.status === query.status);
        }
        if (query.minReward) {
            const min = parseFloat(query.minReward);
            results = results.filter((b) => b.reward >= min);
        }
        if (query.maxReward) {
            const max = parseFloat(query.maxReward);
            results = results.filter((b) => b.reward <= max);
        }
        results = this.sortBounties(results, query.sort);
        const page = parseInt(query.page || '1');
        const limit = parseInt(query.limit || '20');
        const total = results.length;
        const data = results.slice((page - 1) * limit, page * limit);
        return {
            data,
            pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
        };
    }
    async findOne(id) {
        const bounty = this.bounties.get(id);
        if (!bounty) {
            throw new common_1.NotFoundException(`Bounty ${id} not found`);
        }
        return bounty;
    }
    async apply(id, dto, applicantId) {
        const bounty = await this.findOne(id);
        if (bounty.status !== bounty_entity_1.BountyStatus.OPEN) {
            throw new common_1.BadRequestException('Bounty is not open for applications');
        }
        if (bounty.creatorId === applicantId) {
            throw new common_1.BadRequestException('Cannot apply to your own bounty');
        }
        if (bounty.applications.some((a) => a.applicantId === applicantId)) {
            throw new common_1.BadRequestException('You have already applied');
        }
        const application = {
            id: (0, crypto_1.randomUUID)(),
            bountyId: id,
            applicantId,
            proposal: dto.proposal,
            estimatedDays: dto.estimatedDays,
            status: 'pending',
            createdAt: new Date(),
        };
        bounty.applications.push(application);
        bounty.updatedAt = new Date();
        return application;
    }
    async acceptApplication(bountyId, applicationId, userId) {
        const bounty = await this.findOne(bountyId);
        if (bounty.creatorId !== userId) {
            throw new common_1.ForbiddenException('Only creator can accept applications');
        }
        if (bounty.status !== bounty_entity_1.BountyStatus.OPEN) {
            throw new common_1.BadRequestException('Bounty is not open');
        }
        const application = bounty.applications.find((a) => a.id === applicationId);
        if (!application) {
            throw new common_1.NotFoundException('Application not found');
        }
        bounty.applications.forEach((a) => {
            a.status = a.id === applicationId ? 'accepted' : 'rejected';
        });
        bounty.assigneeId = application.applicantId;
        bounty.status = bounty_entity_1.BountyStatus.IN_PROGRESS;
        bounty.updatedAt = new Date();
        return bounty;
    }
    async deliver(id, dto, userId) {
        const bounty = await this.findOne(id);
        if (bounty.assigneeId !== userId) {
            throw new common_1.ForbiddenException('Only assignee can deliver');
        }
        if (bounty.status !== bounty_entity_1.BountyStatus.IN_PROGRESS) {
            throw new common_1.BadRequestException('Bounty is not in progress');
        }
        const delivery = {
            id: (0, crypto_1.randomUUID)(),
            bountyId: id,
            deliverables: dto.deliverables,
            attachments: dto.attachments,
            notes: dto.notes,
            submittedAt: new Date(),
        };
        bounty.delivery = delivery;
        bounty.status = bounty_entity_1.BountyStatus.DELIVERED;
        bounty.updatedAt = new Date();
        return bounty;
    }
    async complete(id, userId) {
        const bounty = await this.findOne(id);
        if (bounty.creatorId !== userId) {
            throw new common_1.ForbiddenException('Only creator can complete bounty');
        }
        if (bounty.status !== bounty_entity_1.BountyStatus.DELIVERED) {
            throw new common_1.BadRequestException('Bounty must be delivered first');
        }
        bounty.status = bounty_entity_1.BountyStatus.COMPLETED;
        bounty.updatedAt = new Date();
        return bounty;
    }
    async cancel(id, userId) {
        const bounty = await this.findOne(id);
        if (bounty.creatorId !== userId) {
            throw new common_1.ForbiddenException('Only creator can cancel bounty');
        }
        if (bounty.status === bounty_entity_1.BountyStatus.COMPLETED ||
            bounty.status === bounty_entity_1.BountyStatus.DELIVERED) {
            throw new common_1.BadRequestException('Cannot cancel completed or delivered bounty');
        }
        bounty.status = bounty_entity_1.BountyStatus.CANCELLED;
        bounty.updatedAt = new Date();
        return bounty;
    }
    async getMyBounties(userId, role) {
        const all = Array.from(this.bounties.values());
        if (role === 'creator') {
            return all.filter((b) => b.creatorId === userId);
        }
        return all.filter((b) => b.assigneeId === userId);
    }
    sortBounties(bounties, sort) {
        switch (sort) {
            case query_bounty_dto_1.BountySortBy.REWARD_HIGH:
                return bounties.sort((a, b) => b.reward - a.reward);
            case query_bounty_dto_1.BountySortBy.REWARD_LOW:
                return bounties.sort((a, b) => a.reward - b.reward);
            case query_bounty_dto_1.BountySortBy.DEADLINE:
                return bounties.sort((a, b) => a.deadline.getTime() - b.deadline.getTime());
            case query_bounty_dto_1.BountySortBy.NEWEST:
            default:
                return bounties.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        }
    }
};
exports.BountiesService = BountiesService;
exports.BountiesService = BountiesService = __decorate([
    (0, common_1.Injectable)()
], BountiesService);
//# sourceMappingURL=bounties.service.js.map