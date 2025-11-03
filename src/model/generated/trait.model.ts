import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_, StringColumn as StringColumn_} from "@subsquid/typeorm-store"
import {NFT} from "./nft.model"

@Entity_()
export class Trait {
    constructor(props?: Partial<Trait>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Index_()
    @ManyToOne_(() => NFT, {nullable: true})
    nft!: NFT

    @Index_()
    @StringColumn_({nullable: false})
    traitType!: string

    @Index_()
    @StringColumn_({nullable: false})
    value!: string
}
