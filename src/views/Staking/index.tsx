import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Button, Input, useToast, useMatchBreakpoints, Flex } from '@pancakeswap/uikit'
import { StyledConnectButton } from '@pancakeswap/uikit/src/components/Button/StyledButton'
import { ethers } from 'ethers'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useCustomTokenContract, useCustomStakingContract, useCustomReferralContract } from 'hooks/useContract'
import { getStakingAddress } from 'utils/addressHelpers'
import {
  claimRewards,
  getAllowance,
  getClaimedReward,
  getPendingReward,
  getRewardPerBlock,
  getTokenBalance,
  getTotalBNBClaimedRewards,
  getTotalStaked,
  getUserInfo,
  stake,
  tokenApprove,
  TOKEN_DECIMALS,
  withdraw
} from 'utils/contractHelpers';
import { CopyButton } from 'components/CopyButton'
import { displayEther, displayFixed, displayFixedNumber, displayUnits, getBNBPrice, getTokenPrice, isAddress } from '../../utils'
import ConnectWalletButton from '../../components/ConnectWalletButton'
import { AppHeader, AppBody } from '../../components/App'
import Page from '../Page'

const StyledContentButton = styled(StyledConnectButton)`
  padding: 10px 20px !important;
  font-size: 16px;
`

const StyledContentContainer = styled.div`
    display: flex;
    flex-direction: column;
    background-color: #302f30;
    width: calc(100% - 40px);
    max-width: 850px;
    // max-height: 840px;
    box-shadow: 0px 0px 14px 8px #cb5741;
    border-radius: 18px;
    padding: 15px;
    
    .title-6 {
      --text-opacity: 1;
      color: rgba(255,255,255,var(--text-opacity));
      font-weight: 600;
      padding-top: 10px;
      text-align: center;
      margin-top: -20px;
      margin-bottom: 15px;
      text-transform: uppercase;
      font-size: 1.8em;
      line-height: 1.4em;
    }

    .vault-info {
      color: #787849;
      display: flex;
      font-size: 1.55rem;
      text-shadow: 2px 2px 4px #181616;
    }

    @media (max-width: 576px) {

      .vault-info {
        flex-wrap : wrap;
      }

    }

    .vault-value {
      margin-left: 15px;
      color: #ddd0d0;
      font-size: 1.6rem;
      font-weight: bold;
    }

    .fee-title {
      /* color: #c75442; */
      color: #787849;
      text-align: center;
    }

    .copyright {
      padding-right: 15px;
      font-size: 0.8571em;
      line-height: 1.8;
    }
}
`

const StyledInput = styled(Input) <{ textAlign?: string }>`
  --border-opacity: 1;
  border-color: rgb(167, 70, 61);
  border-width: 3px;
  margin-top: 10px;
  box-shadow: rgb(1 7 16 / 85%) 0px 5px 12px 0px;
  border-radius: 1rem;
  border-style: inset;
  background-color: rgb(20 0 12);
  --text-opacity: 1;
  color: white;
  width: 100%;
  padding: 20px 10px;
  font-size: 1.1rem;
  font-weight: 500;
  outline: none;
  margin-bottom: 20px;

  &:focus:not(:disabled) {
    box-shadow: rgb(1 7 16 / 85%) 0px 5px 12px 0px;
  }

  &::placeholder {
    color: white;
  }
`

const StyledInput1 = styled(Input) <{ textAlign?: string }>`
  --border-opacity: 1;
  border-color: rgb(167, 70, 61);
  border-width: 3px;
  margin-top: 10px;
  box-shadow: rgb(1 7 16 / 85%) 0px 5px 12px 0px;
  border-radius: 1rem;
  border-style: inset;
  background-color: rgb(58 0 41);
  --text-opacity: 1;
  color: white;
  width: 100%;
  padding: 20px 10px;
  font-size: 1.1rem;
  font-weight: 500;
  outline: none;
  margin-bottom: 20px;

  &:focus:not(:disabled) {
    box-shadow: rgb(1 7 16 / 85%) 0px 5px 12px 0px;
  }

  &::placeholder {
    color: white;
  }
`

const StyledReferral = styled(Input) <{ textAlign?: string }>`
  --border-opacity: 1;
  border-color: rgb(167, 70, 61);
  border-width: 3px;
  margin-right: 10px;
  box-shadow: rgb(1 7 16 / 85%) 0px 5px 12px 0px;
  border-radius: 1rem;
  border-style: inset;
  background-color: rgb(58 0 41);
  --text-opacity: 1;
  color: white;
  width: (100% - 20px);
  padding: 20px 10px;
  font-size: 1rem;
  font-weight: 500;
  outline: none;

  &:focus:not(:disabled) {
    box-shadow: rgb(1 7 16 / 85%) 0px 5px 12px 0px;
  }

  &::placeholder {
    color: white;
  }
`

export const PUBLIC_URL = "https://poochain-swap-fork.web.app"
export const REF_PREFIX = `${PUBLIC_URL}/?ref=`
export const ADMIN_ACCOUNT = '0x2Cc4467e7a94D55497B704a0acd90ACd1BF9A5af'

export default function Staking() {
  // const [isOpen, setOpen] = useState(false);
  const { account, chainId } = useActiveWeb3React()

  const queryString = window.location.search;
  const parameters = new URLSearchParams(queryString);
  const newReferral = parameters.get('ref');

  useEffect(() => {
    const referral = window.localStorage.getItem("REFERRAL")

    if (!isAddress(referral)) {
      if (isAddress(newReferral)) {
        window.localStorage.setItem("REFERRAL", newReferral);
      } else {
        window.localStorage.setItem("REFERRAL", ADMIN_ACCOUNT);
      }
    }
    console.log("[PRINCE](referral): ", referral);
  }, [newReferral])

  const tokenContract = useCustomTokenContract();
  const stakingContract = useCustomStakingContract();
  const referralContract = useCustomReferralContract()

  const [bnbPriceUSD, setBNBPrice] = useState("0");
  const [tokenPriceUSD, setTokenPrice] = useState("0");

  const [apy, setAPY] = useState("0");
  const [totalBNBClaimed, setTotalBNBClaimed] = useState("0");
  const [totalStaked, setTotalStaked] = useState("0");
  const [totalStakedUSD, setTotalStakedUSD] = useState("0");
  const [balance, setBalance] = useState("0");
  const [stakeInputValue, setStakeInputValue] = useState('0');
  const [isApproved, setIsApproved] = useState(false);

  const [stakedAmount, setStakedAmount] = useState("0");
  const [totalReferralAmount, setTotalReferralAmount] = useState("0");
  const [pendingReferralAmount, setPendingReferralAmount] = useState("0");
  const [refLink, setRefLink] = useState(`${REF_PREFIX}0x0000000000000000000000000000000000000000`);
  const [stakedUSD, setStakedUSD] = useState("0");
  const [share, setShare] = useState("0");
  const [pendingReward, setPendingReward] = useState("0");
  const [claimedReward, setClaimedReward] = useState("0");
  const [unstakeInputValue, setUnStakeInputValue] = useState('0');

  const { toastError, toastSuccess } = useToast()
  const { isMobile } = useMatchBreakpoints()

  const [isUpdating, setIsUpdating] = useState(false);
  let timerId: NodeJS.Timeout;

  useEffect(() => {
    getPriceInfo();
  }, [])

  useEffect(() => {
    if (account) {
      const refLinkVal = `${REF_PREFIX}${account}`;
      setRefLink(refLinkVal);
    } else {
      setRefLink(`${REF_PREFIX}0x0000000000000000000000000000000000000000`);
    }

    if (tokenContract && stakingContract)
      updateParameters();

    timerId = setInterval(() => {
      if (tokenContract && stakingContract && account) {
        updateParameters();
      }
    }, 10000);
    console.log("timerId = ", timerId)
    return () => {
      clearInterval(timerId)
    }
  }, [tokenContract, stakingContract, account, bnbPriceUSD, tokenPriceUSD]);

  const getPriceInfo = async () => {
    const { success: bnbSuccess, bnbPrice: _bnbPrice } = await getBNBPrice();
    const { success: tokenSuccess, tokenPrice: _tokenPrice } = await getTokenPrice(chainId);
    if (!(bnbSuccess && tokenSuccess)) {
      // showToast("Please check your network status!", "error");
      toastError('Error', 'Please check your network status!')
      return;
    }
    setBNBPrice(_bnbPrice);
    setTokenPrice(_tokenPrice);
  }

  const updateParameters = async () => {
    console.log("updateParameters isUpdating=", isUpdating);
    try {
      // get Pool info first
      // const [ bnbPrice, setBNBPrice ] = useState(0);
      // const [ tokenPrice, setTokenPrice ] = useState(0);
      setIsUpdating(true);
      const resTotalBNBClaimed = await getTotalBNBClaimedRewards(stakingContract);
      setTotalBNBClaimed(resTotalBNBClaimed.toString());
      const resTotalStaked = await getTotalStaked(stakingContract);
      setTotalStaked(resTotalStaked.toString());
      if (bnbPriceUSD === "0" && tokenPriceUSD === "0") {
        // showToast("Please check your network status!", "error");
        getPriceInfo();
        return;
      }

      const _totalStakedUSD = parseFloat(displayUnits(resTotalStaked, 9)) * parseFloat(tokenPriceUSD);
      setTotalStakedUSD(_totalStakedUSD.toString());

      // const [ apy, setAPY ] = useState("0");
      const resRewardPerBlock = await getRewardPerBlock(stakingContract);
      const _perBlock = parseFloat(displayEther(resRewardPerBlock));
      const rewardPerYear = _perBlock * 28800 * 365;
      const rewardPerYearUSD = rewardPerYear * parseFloat(bnbPriceUSD);
      const _apy = rewardPerYearUSD / _totalStakedUSD * 100;
      setAPY(_apy.toString());

      if (!account) {
        setAPY("0");
        setBalance("0");
        setStakedAmount("0");
        setStakedUSD("0");
        setShare("0");
        setPendingReward("0");
        setClaimedReward("0");
        return;
      }
      const resBal = await getTokenBalance(tokenContract, account);
      const _bal = displayFixed(resBal, 0);
      setBalance(_bal);

      const _allowance = await getAllowance(tokenContract, account, getStakingAddress(chainId));
      if (_allowance.lt(ethers.utils.parseUnits(stakeInputValue, TOKEN_DECIMALS)))
        setIsApproved(false);
      else
        setIsApproved(true);

      const resUserInfo = await getUserInfo(stakingContract, account);
      const _stakedBal = displayFixed(resUserInfo.amount, 0);
      setStakedAmount(_stakedBal);

      // const [ stakedUSD, setStakedUSD ] = useState("0");
      // const [ share, setShare ] = useState("0");
      const _stakedUSD = parseFloat(stakedAmount) * parseFloat(tokenPriceUSD);
      setStakedUSD(_stakedUSD.toString());
      const _share = parseFloat(_stakedBal) / parseFloat(resTotalStaked.toString());
      setShare(_share.toString());
      console.log("_share", _share);

      const resPendingReward = await getPendingReward(stakingContract, account);
      setPendingReward(displayEther(resPendingReward));
      const resClaimedReward = await getClaimedReward(stakingContract, account);
      setClaimedReward(displayEther(resClaimedReward));
    } catch (err) {
      console.log("error = ", err)
    }
    setIsUpdating(false);
  }

  const onClickStakeMax = () => {
    setStakeInputValue(balance);
  }

  const onChangeStakeInputValue = (e) => {
    e.preventDefault();
    setStakeInputValue(e.target.value);
  }

  const onStake = async () => {
    if (stakingContract && account) {
      if (!(parseInt(stakeInputValue) <= parseInt(balance))) {
        // showToast("Input stake amount correctly!", "error");
        toastError('Error', 'Input stake amount correctly!')
        return;
      }
      const res = await stake(stakingContract, account, stakeInputValue);
      // console.log("stake res=", res);
      // showToast(res.message, res.success ? "success" : "error");
      if (res.success) {
        toastSuccess('Success', res.message)
      } else {
        toastError('Error', res.message)
      }
    }
  }

  const onApprove = async () => {
    if (tokenContract && account) {
      const res = await tokenApprove(tokenContract, account, chainId);
      // console.log("approve res=", res);
      // showToast(res.message, res.success ? "success" : "error");
      if (res.success) {
        toastSuccess('Success', res.message)
      } else {
        toastError('Error', res.message)
      }
    }
  }

  const onClickUnStakeMax = () => {
    setUnStakeInputValue(stakedAmount);
  }

  const onChangeUnStakeInputValue = (e) => {
    e.preventDefault();
    setUnStakeInputValue(e.target.value);
  }

  const onClaimRewards = async () => {
    if (stakingContract && account) {
      const res = await claimRewards(stakingContract, account);
      // showToast(res.message, res.success ? "success" : "error");
      if (res.success) {
        toastSuccess('Success', res.message)
      } else {
        toastError('Error', res.message)
      }
    }
  }

  const onUnstake = async () => {
    if (stakingContract && account) {
      if (!(parseInt(unstakeInputValue) <= parseInt(stakedAmount))) {
        // showToast("Input unstake amount correctly!", "error");
        toastError('Error', 'Input unstake amount correctly!')
        return;
      }
      const res = await withdraw(stakingContract, account, unstakeInputValue);
      // showToast(res.message, res.success ? "success" : "error");
      if (res.success) {
        toastSuccess('Success', res.message)
      } else {
        toastError('Error', res.message)
      }
    }
  }

  return (
    <>
      {/* <Overlay onClick={onHandleSideBar} isOpen={isOpen} /> */}
      <StyledContentContainer style={{ marginLeft: isMobile ? '20px' : '100px', marginTop: '50px' }}>
        <div style={{ margin: '1rem 0px' }}>
          <h5 className="title-6">OUR STAKING PLATFORM</h5>
          <div className="vault-info">
            <div className="vault-title">APY:</div>
            <div className="vault-value">
              {apy === '0' || Number.isNaN(apy) ? '--%' : `${displayFixedNumber(apy, 2)}%`}
            </div>
          </div>
          <div className="vault-info">
            <div className="vault-title">Total Staked:</div>
            <div className="vault-value">
              {displayFixed(totalStaked, 2, 9)}
            </div>
          </div>
          <div className="vault-info">
            <div className="vault-title">Total Staked (USD):</div>
            <div className="vault-value">
              {`$ ${displayFixedNumber(totalStakedUSD, 2)}`}
            </div>
          </div>
        </div>
        <div style={{ margin: '1rem 0px' }}>
          <h5 className="title-6" style={{ fontSize: '1.2em', fontWeight: '300' }}>
            STAKE YOUR TOKENS, EARN REWARDS
          </h5>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#c5c6d1', fontSize: '15px' }}>
              Your tokens:
              {balance}
            </span>
            <button type='button'
              style={{ color: '#c5c6d1', fontSize: '15px', cursor: 'pointer', border: 0, padding: 0, background: "transparent" }}
              onClick={onClickStakeMax}
            >
              Max
            </button>
          </div>
          <StyledInput
            placeholder="0"
            value={stakeInputValue}
            type="number"
            textAlign="left"
            onChange={onChangeStakeInputValue}
          />
          {account ? (
            <StyledContentButton
              onClick={() => (isApproved ? onStake() : onApprove())}
            >
              {(isApproved ? 'Stake' : 'Approve')}
            </StyledContentButton>
          ) : (
            <ConnectWalletButton />
          )}
        </div>
      </StyledContentContainer>
      <StyledContentContainer style={{ marginLeft: isMobile ? '20px' : '100px', marginTop: '50px' }}>
        <div style={{ margin: '1rem 0px' }}>
          <h5 className="title-6">EARNINGS AND UNSTAKE TOKENS</h5>
          <div className="vault-info">
            <div className="vault-title">Your Staked:</div>
            <div className="vault-value">
              {stakedAmount}
            </div>
          </div>
          <div className="vault-info">
            <div className="vault-title">Your Stake (USD):</div>
            <div className="vault-value">
              {`$ ${displayFixedNumber(stakedUSD, 2)}`}
            </div>
          </div>
          <div className="vault-info">
            <div className="vault-title">Your Share:</div>
            <div className="vault-value">
              {`${displayFixedNumber(share, 2)}%`}
            </div>
          </div>
          <div className="vault-info">
            <div className="vault-title">Your Pending BNB Rewards:</div>
            <div className="vault-value">
              {`${displayFixedNumber(pendingReward, 6)}`}
            </div>
          </div>
          <div className="vault-info">
            <div className="vault-title">Your Claimed BNB Rewards:</div>
            <div className="vault-value">
              {`${displayFixedNumber(claimedReward, 6)}`}
            </div>
          </div>
          <StyledContentButton style={{ padding: '11px 22px', fontSize: '16px' }}
            onClick={onClaimRewards}
          >
            CLAIM EARNINGS
          </StyledContentButton>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '15px' }}>
            <span style={{ color: '#c5c6d1', fontSize: '15px' }}>
              {`Staked Tokens: ${stakedAmount}`}
            </span>
            <button type='button'
              style={{ color: '#c5c6d1', fontSize: '15px', cursor: 'pointer', border: 0, padding: 0, background: "transparent" }}
              onClick={onClickUnStakeMax}
            >
              Max
            </button>
          </div>
          <StyledInput1 placeholder="0"
            value={unstakeInputValue}
            type="number"
            onChange={onChangeUnStakeInputValue}
          />
          {account ? (
            <StyledContentButton style={{ padding: '11px 22px', fontSize: '16px' }}
              onClick={onUnstake}
            >
              UNSTAKE
            </StyledContentButton>
          ) : (
            <ConnectWalletButton />
          )}
          <p className="fee-title" style={{ marginTop: '1rem' }}>
            This application is decentralized and is provided with no guarantees or warranties of any kind.
          </p>
        </div>
      </StyledContentContainer>
      <StyledContentContainer style={{ marginLeft: isMobile ? '20px' : '100px', marginTop: '50px' }}>
        <div style={{ margin: '1rem 0px' }}>
          <h5 className="title-6">REFERRAL REWARDS</h5>
          <div className="vault-info">
            <div className="vault-title">Total Referral Rewards:</div>
            <div className="vault-value">
              {totalReferralAmount}
            </div>
          </div>
          <div className="vault-info">
            <div className="vault-title">Pending Referral Rewards:</div>
            <div className="vault-value">
              {pendingReferralAmount}
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '15px', color: '#c5c6d1', fontSize: '15px' }}>
            Share your referral link to earn 10% of Rewards
          </div>
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', position: "relative", marginTop: '10px', marginBottom: '20px' }}>
            <StyledReferral
              readOnly
              value={refLink}
              onClick={() => {
                if (navigator.clipboard) {
                  navigator.clipboard.writeText(refLink)
                }
              }}
            />
            <CopyButton width="30px" text={refLink} tooltipMessage='Copied!' tooltipTop={-30} tooltipRight={-15} />
          </div>
          {account ? (
            <StyledContentButton style={{ fontSize: '16px' }}
              onClick={onUnstake}
            >
              CLAIM REFERRAL REWARDS
            </StyledContentButton>
          ) : (
            <ConnectWalletButton />
          )}
        </div>
      </StyledContentContainer>
    </>
  )
}
