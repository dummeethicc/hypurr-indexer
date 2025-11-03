module.exports = class Data1762149931666 {
    name = 'Data1762149931666'

    async up(db) {
        await db.query(`CREATE TABLE "trait" ("id" character varying NOT NULL, "trait_type" text NOT NULL, "value" text NOT NULL, "nft_id" character varying, CONSTRAINT "PK_c5d145e577199fe58afbf2a1b2d" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_40183b8e2b4251df46308ea163" ON "trait" ("nft_id") `)
        await db.query(`CREATE INDEX "IDX_a6f281053850e68f809092890f" ON "trait" ("trait_type") `)
        await db.query(`CREATE INDEX "IDX_e6a852253624537bc65e269fbf" ON "trait" ("value") `)
        await db.query(`CREATE TABLE "listing" ("id" character varying NOT NULL, "seller" text NOT NULL, "price" numeric NOT NULL, "active" boolean NOT NULL, "listed_at" TIMESTAMP WITH TIME ZONE NOT NULL, "sold_at" TIMESTAMP WITH TIME ZONE, "nft_id" character varying, CONSTRAINT "REL_af6aca779d09c30e0731578ad7" UNIQUE ("nft_id"), CONSTRAINT "PK_381d45ebb8692362c156d6b87d7" PRIMARY KEY ("id"))`)
        await db.query(`CREATE UNIQUE INDEX "IDX_af6aca779d09c30e0731578ad7" ON "listing" ("nft_id") `)
        await db.query(`CREATE INDEX "IDX_bbbc07961f986a801979d8fdcc" ON "listing" ("seller") `)
        await db.query(`CREATE INDEX "IDX_539dde2bbd45d2081dff6bd095" ON "listing" ("active") `)
        await db.query(`CREATE TABLE "nft" ("id" character varying NOT NULL, "token_id" integer NOT NULL, "owner" text NOT NULL, "metadata" text, "name" text, "image" text, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL, "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL, CONSTRAINT "PK_8f46897c58e23b0e7bf6c8e56b0" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_7e215df412b248db3731737290" ON "nft" ("token_id") `)
        await db.query(`CREATE INDEX "IDX_78260787a2eb44fb414dd6b961" ON "nft" ("owner") `)
        await db.query(`CREATE TABLE "sale" ("id" character varying NOT NULL, "token_id" integer NOT NULL, "seller" text NOT NULL, "buyer" text NOT NULL, "price" numeric NOT NULL, "timestamp" TIMESTAMP WITH TIME ZONE NOT NULL, CONSTRAINT "PK_d03891c457cbcd22974732b5de2" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_53aae73a92bcdefd80d4bb94e7" ON "sale" ("token_id") `)
        await db.query(`CREATE INDEX "IDX_3cd3366d2c0c6e1484ebb3520b" ON "sale" ("seller") `)
        await db.query(`CREATE INDEX "IDX_52a5d0b75a305496a326d4f2f6" ON "sale" ("buyer") `)
        await db.query(`CREATE INDEX "IDX_8ac00a610840894296c6f32fd2" ON "sale" ("timestamp") `)
        await db.query(`ALTER TABLE "trait" ADD CONSTRAINT "FK_40183b8e2b4251df46308ea1632" FOREIGN KEY ("nft_id") REFERENCES "nft"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
        await db.query(`ALTER TABLE "listing" ADD CONSTRAINT "FK_af6aca779d09c30e0731578ad75" FOREIGN KEY ("nft_id") REFERENCES "nft"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
    }

    async down(db) {
        await db.query(`DROP TABLE "trait"`)
        await db.query(`DROP INDEX "public"."IDX_40183b8e2b4251df46308ea163"`)
        await db.query(`DROP INDEX "public"."IDX_a6f281053850e68f809092890f"`)
        await db.query(`DROP INDEX "public"."IDX_e6a852253624537bc65e269fbf"`)
        await db.query(`DROP TABLE "listing"`)
        await db.query(`DROP INDEX "public"."IDX_af6aca779d09c30e0731578ad7"`)
        await db.query(`DROP INDEX "public"."IDX_bbbc07961f986a801979d8fdcc"`)
        await db.query(`DROP INDEX "public"."IDX_539dde2bbd45d2081dff6bd095"`)
        await db.query(`DROP TABLE "nft"`)
        await db.query(`DROP INDEX "public"."IDX_7e215df412b248db3731737290"`)
        await db.query(`DROP INDEX "public"."IDX_78260787a2eb44fb414dd6b961"`)
        await db.query(`DROP TABLE "sale"`)
        await db.query(`DROP INDEX "public"."IDX_53aae73a92bcdefd80d4bb94e7"`)
        await db.query(`DROP INDEX "public"."IDX_3cd3366d2c0c6e1484ebb3520b"`)
        await db.query(`DROP INDEX "public"."IDX_52a5d0b75a305496a326d4f2f6"`)
        await db.query(`DROP INDEX "public"."IDX_8ac00a610840894296c6f32fd2"`)
        await db.query(`ALTER TABLE "trait" DROP CONSTRAINT "FK_40183b8e2b4251df46308ea1632"`)
        await db.query(`ALTER TABLE "listing" DROP CONSTRAINT "FK_af6aca779d09c30e0731578ad75"`)
    }
}
