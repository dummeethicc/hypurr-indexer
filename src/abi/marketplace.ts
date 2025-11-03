import * as p from '@subsquid/evm-codec'
import { event, fun, viewFun, indexed, ContractBase } from '@subsquid/evm-abi'
import type { EventParams as EParams, FunctionArguments, FunctionReturn } from '@subsquid/evm-abi'

export const events = {
    Listed: event("0x50955776c5778c3b7d968d86d8c51fb6b29a7a74c20866b533268e209fc08343", "Listed(uint256,address,uint256)", {"tokenId": indexed(p.uint256), "seller": indexed(p.address), "price": p.uint256}),
    Unlisted: event("0x398bd90ce129393b9155d48dccffb325e671f45c4250de457462a019268ff1f0", "Unlisted(uint256,address)", {"tokenId": indexed(p.uint256), "seller": indexed(p.address)}),
    Sold: event("0xa70b1a854695e7921b122988e216d3a6cd10ed799017c67b1ff231967e6bf56d", "Sold(uint256,address,address,uint256,uint256)", {"tokenId": indexed(p.uint256), "seller": indexed(p.address), "buyer": indexed(p.address), "price": p.uint256, "fee": p.uint256}),
}

export class Contract extends ContractBase {
}

/// Event types
export type ListedEventArgs = EParams<typeof events.Listed>
export type UnlistedEventArgs = EParams<typeof events.Unlisted>
export type SoldEventArgs = EParams<typeof events.Sold>
