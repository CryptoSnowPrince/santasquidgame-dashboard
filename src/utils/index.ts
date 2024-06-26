import type { Signer } from '@ethersproject/abstract-signer'
import { getAddress } from '@ethersproject/address'
import { BigNumber } from '@ethersproject/bignumber'
import { AddressZero } from '@ethersproject/constants'
import { Contract } from '@ethersproject/contracts'
import type { Provider } from '@ethersproject/providers'
import { ethers } from 'ethers';
import { ChainId, Currency } from '@pancakeswap/sdk'
import { bsc } from '@pancakeswap/wagmi/chains'
import memoize from 'lodash/memoize'
import { TokenAddressMap } from '@pancakeswap/tokens'
import { BASE_BSC_SCAN_URLS } from '../config'
import { chains } from './wagmi'
import { getTokenAddress } from './addressHelpers'

// returns the checksummed address if the address is valid, otherwise returns false
export const isAddress = memoize((value: any): string | false => {
  try {
    return getAddress(value)
  } catch {
    return false
  }
})

export function getBlockExploreLink(
  data: string | number,
  type: 'transaction' | 'token' | 'address' | 'block' | 'countdown',
  chainIdOverride?: number,
): string {
  const chainId = chainIdOverride || ChainId.BSC
  const chain = chains.find((c) => c.id === chainId)
  if (!chain) return bsc.blockExplorers.default.url
  switch (type) {
    case 'transaction': {
      return `${chain.blockExplorers.default.url}/tx/${data}`
    }
    case 'token': {
      return `${chain.blockExplorers.default.url}/token/${data}`
    }
    case 'block': {
      return `${chain.blockExplorers.default.url}/block/${data}`
    }
    case 'countdown': {
      return `${chain.blockExplorers.default.url}/block/countdown/${data}`
    }
    default: {
      return `${chain.blockExplorers.default.url}/address/${data}`
    }
  }
}

export function getBlockExploreName(chainIdOverride?: number) {
  const chainId = chainIdOverride || ChainId.BSC
  const chain = chains.find((c) => c.id === chainId)

  return chain?.blockExplorers?.default.name || 'BscScan'
}

export function getBscScanLinkForNft(collectionAddress: string, tokenId: string): string {
  return `${BASE_BSC_SCAN_URLS[ChainId.BSC]}/token/${collectionAddress}?a=${tokenId}`
}

// add 10%
export function calculateGasMargin(value: BigNumber, margin = 1000): BigNumber {
  return value.mul(BigNumber.from(10000).add(BigNumber.from(margin))).div(BigNumber.from(10000))
}

// account is optional
export function getContract(address: string, ABI: any, signer?: Signer | Provider): Contract {
  if (!isAddress(address) || address === AddressZero) {
    throw Error(`Invalid 'address' parameter '${address}'.`)
  }

  return new Contract(address, ABI, signer)
}

export function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') // $& means the whole matched string
}

export function isTokenOnList(defaultTokens: TokenAddressMap, currency?: Currency): boolean {
  if (currency?.isNative) return true
  return Boolean(currency?.isToken && defaultTokens[currency.chainId]?.[currency.address])
}

export const displayEther = (price) => {
  return ethers.utils.formatEther(price);
}

export const displayUnits = (price, number) => {
  return ethers.utils.formatUnits(price, number);
}

export const displayFixed = (value, fixed, number = 9) => {
  return Number(displayUnits(value, number)).toFixed(fixed);
}

export const displayFixedNumber = (value, fixed = 0) => {
  return Number(value).toFixed(fixed);
}

export const getBNBPrice = async () => {
  try {
    const apiUrl = `https://api.dexscreener.io/latest/dex/tokens/0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c`;
    const resVal = await fetch(apiUrl).then(res => res.json())
    return {
      success: true,
      bnbPrice: resVal.pairs[0].priceUsd
    }
  } catch (err) {
    // console.log("err = ", err);
    return {
      success: false,
      // message: err.message
      message: err
    }
  }
}

export const getTokenPrice = async (chainId: number) => {
  try {
    const apiUrl = `https://api.dexscreener.io/latest/dex/tokens/${getTokenAddress(chainId)}`;
    const resVal = await fetch(apiUrl).then(res => res.json())
    return {
      success: true,
      tokenPrice: resVal.pairs[0].priceUsd
    }
  } catch (err) {
    // console.log("err = ", err);
    return {
      success: false,
      // message: err.message
      message: err
    }
  }
}
