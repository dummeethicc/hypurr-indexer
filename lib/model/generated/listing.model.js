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
exports.Listing = void 0;
const typeorm_store_1 = require("@subsquid/typeorm-store");
const nft_model_1 = require("./nft.model");
let Listing = class Listing {
    constructor(props) {
        Object.assign(this, props);
    }
};
exports.Listing = Listing;
__decorate([
    (0, typeorm_store_1.PrimaryColumn)(),
    __metadata("design:type", String)
], Listing.prototype, "id", void 0);
__decorate([
    (0, typeorm_store_1.Index)({ unique: true }),
    (0, typeorm_store_1.OneToOne)(() => nft_model_1.NFT, { nullable: true }),
    (0, typeorm_store_1.JoinColumn)(),
    __metadata("design:type", nft_model_1.NFT)
], Listing.prototype, "nft", void 0);
__decorate([
    (0, typeorm_store_1.Index)(),
    (0, typeorm_store_1.StringColumn)({ nullable: false }),
    __metadata("design:type", String)
], Listing.prototype, "seller", void 0);
__decorate([
    (0, typeorm_store_1.BigIntColumn)({ nullable: false }),
    __metadata("design:type", BigInt)
], Listing.prototype, "price", void 0);
__decorate([
    (0, typeorm_store_1.Index)(),
    (0, typeorm_store_1.BooleanColumn)({ nullable: false }),
    __metadata("design:type", Boolean)
], Listing.prototype, "active", void 0);
__decorate([
    (0, typeorm_store_1.DateTimeColumn)({ nullable: false }),
    __metadata("design:type", Date)
], Listing.prototype, "listedAt", void 0);
__decorate([
    (0, typeorm_store_1.DateTimeColumn)({ nullable: true }),
    __metadata("design:type", Object)
], Listing.prototype, "soldAt", void 0);
exports.Listing = Listing = __decorate([
    (0, typeorm_store_1.Entity)(),
    __metadata("design:paramtypes", [Object])
], Listing);
//# sourceMappingURL=listing.model.js.map