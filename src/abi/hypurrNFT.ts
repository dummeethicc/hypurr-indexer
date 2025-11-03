import * as p from '@subsquid/evm-codec'
import { event, fun, viewFun, indexed, ContractBase } from '@subsquid/evm-abi'
import type { EventParams as EParams, FunctionArguments, FunctionReturn } from '@subsquid/evm-abi'

export const events = {
    Transfer: event("0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef", "Transfer(address,address,uint256)", {"from": indexed(p.address), "to": indexed(p.address), "tokenId": indexed(p.uint256)}),
}

export const functions = {
    ownerOf: viewFun("0x6352211e", "ownerOf(uint256)", {"tokenId": p.uint256}, p.address),
    tokenURI: viewFun("0xc87b56dd", "tokenURI(uint256)", {"tokenId": p.uint256}, p.string),
}

export class Contract extends ContractBase {

    ownerOf(tokenId: OwnerOfParams["tokenId"]) {
        return this.eth_call(functions.ownerOf, {tokenId})
    }

    tokenURI(tokenId: TokenURIParams["tokenId"]) {
        return this.eth_call(functions.tokenURI, {tokenId})
    }
}

/// Event types
export type TransferEventArgs = EParams<typeof events.Transfer>

/// Function types
export type OwnerOfParams = FunctionArguments<typeof functions.ownerOf>
export type OwnerOfReturn = FunctionReturn<typeof functions.ownerOf>

export type TokenURIParams = FunctionArguments<typeof functions.tokenURI>
export type TokenURIReturn = FunctionReturn<typeof functions.tokenURI>

