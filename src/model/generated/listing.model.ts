import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, OneToOne as OneToOne_, Index as Index_, JoinColumn as JoinColumn_, StringColumn as StringColumn_, BigIntColumn as BigIntColumn_, BooleanColumn as BooleanColumn_, DateTimeColumn as DateTimeColumn_} from "@subsquid/typeorm-store"
import {NFT} from "./nft.model"

@Entity_()
export class Listing {
    constructor(props?: Partial<Listing>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Index_({unique: true})
    @OneToOne_(() => NFT, {nullable: true})
    @JoinColumn_()
    nft!: NFT

    @Index_()
    @StringColumn_({nullable: false})
    seller!: string

    @BigIntColumn_({nullable: false})
    price!: bigint

    @Index_()
    @BooleanColumn_({nullable: false})
    active!: boolean

    @DateTimeColumn_({nullable: false})
    listedAt!: Date

    @DateTimeColumn_({nullable: true})
    soldAt!: Date | undefined | null
}
