"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NFT = void 0;
const typeorm_store_1 = require("@subsquid/typeorm-store");
const trait_model_1 = require("./trait.model");
const listing_model_1 = require("./listing.model");
let NFT = class NFT {
    constructor(props) {
        Object.assign(this, props);
    }
};
exports.NFT = NFT;
__decorate([
    (0, typeorm_store_1.PrimaryColumn)(),
    __metadata("design:type", String)
], NFT.prototype, "id", void 0);
__decorate([
    (0, typeorm_store_1.Index)(),
    (0, typeorm_store_1.IntColumn)({ nullable: false }),
    __metadata("design:type", Number)
], NFT.prototype, "tokenId", void 0);
__decorate([
    (0, typeorm_store_1.Index)(),
    (0, typeorm_store_1.StringColumn)({ nullable: false }),
    __metadata("design:type", String)
], NFT.prototype, "owner", void 0);
__decorate([
    (0, typeorm_store_1.StringColumn)({ nullable: true }),
    __metadata("design:type", Object)
], NFT.prototype, "metadata", void 0);
__decorate([
    (0, typeorm_store_1.StringColumn)({ nullable: true }),
    __metadata("design:type", Object)
], NFT.prototype, "name", void 0);
__decorate([
    (0, typeorm_store_1.StringColumn)({ nullable: true }),
    __metadata("design:type", Object)
], NFT.prototype, "image", void 0);
__decorate([
    (0, typeorm_store_1.OneToMany)(() => trait_model_1.Trait, e => e.nft),
    __metadata("design:type", Array)
], NFT.prototype, "attributes", void 0);
__decorate([
    (0, typeorm_store_1.DateTimeColumn)({ nullable: false }),
    __metadata("design:type", Date)
], NFT.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_store_1.DateTimeColumn)({ nullable: false }),
    __metadata("design:type", Date)
], NFT.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_store_1.OneToOne)(() => listing_model_1.Listing, e => e.nft),
    __metadata("design:type", Object)
], NFT.prototype, "listing", void 0);
exports.NFT = NFT = __decorate([
    (0, typeorm_store_1.Entity)(),
    __metadata("design:paramtypes", [Object])
], NFT);
//# sourceMappingURL=nft.model.js.map