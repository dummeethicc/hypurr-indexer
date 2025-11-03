import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, IntColumn as IntColumn_, Index as Index_, StringColumn as StringColumn_, OneToMany as OneToMany_, DateTimeColumn as DateTimeColumn_, OneToOne as OneToOne_} from "@subsquid/typeorm-store"
import {Trait} from "./trait.model"
import {Listing} from "./listing.model"

@Entity_()
export class NFT {
    constructor(props?: Partial<NFT>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Index_()
    @IntColumn_({nullable: false})
    tokenId!: number

    @Index_()
    @StringColumn_({nullable: false})
    owner!: string

    @StringColumn_({nullable: true})
    metadata!: string | undefined | null

    @StringColumn_({nullable: true})
    name!: string | undefined | null

    @StringColumn_({nullable: true})
    image!: string | undefined | null

    @OneToMany_(() => Trait, e => e.nft)
    attributes!: Trait[]

    @DateTimeColumn_({nullable: false})
    createdAt!: Date

    @DateTimeColumn_({nullable: false})
    updatedAt!: Date

    @OneToOne_(() => Listing, e => e.nft)
    listing!: Listing | undefined | null
}
