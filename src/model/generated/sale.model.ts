import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, IntColumn as IntColumn_, Index as Index_, StringColumn as StringColumn_, BigIntColumn as BigIntColumn_, DateTimeColumn as DateTimeColumn_} from "@subsquid/typeorm-store"

@Entity_()
export class Sale {
    constructor(props?: Partial<Sale>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Index_()
    @IntColumn_({nullable: false})
    tokenId!: number

    @Index_()
    @StringColumn_({nullable: false})
    seller!: string

    @Index_()
    @StringColumn_({nullable: false})
    buyer!: string

    @BigIntColumn_({nullable: false})
    price!: bigint

    @Index_()
    @DateTimeColumn_({nullable: false})
    timestamp!: Date
}
