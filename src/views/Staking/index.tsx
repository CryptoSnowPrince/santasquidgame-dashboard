import React, { useEffect, useState, useCallback } from 'react'
import styled from 'styled-components'
import { Button, Input, useToast, useMatchBreakpoints, Flex } from '@pancakeswap/uikit'
import { StyledConnectButton } from '@pancakeswap/uikit/src/components/Button/StyledButton'
import { ethers } from 'ethers'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useCustomTokenContract, useCustomStakingContract, useCustomReferralContract } from 'hooks/useContract'
import { useBNBBusdPrice, useSSGBNBPrice } from 'hooks/useBUSDPrice'
import { getStakingAddress } from 'utils/addressHelpers'
import { multiplyPriceByAmount } from 'utils/prices'
import {
  claimRewards,
  getAllowance,
  getPendingReward,
  getRewardPerBlock,
  getTokenBalance,
  getPoolInfo,
  getUserInfo,
  stake,
  tokenApprove,
  TOKEN_DECIMALS,
  withdraw,
  getPendingRefReward,
  getTotalRefReward,
} from 'utils/contractHelpers';
import { ADMIN_ACCOUNT, REF_PREFIX } from 'config/constants'
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

const InputStakeAmount = styled(Input) <{ textAlign?: string }>`
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

const InputUnstakeAmount = styled(Input) <{ textAlign?: string }>`
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

const ShowReferral = styled(Input) <{ textAlign?: string }>`
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

export default function Staking() {
  // const [isOpen, setOpen] = useState(false);
  const { account, chainId } = useActiveWeb3React()
  const { toastError, toastSuccess } = useToast()
  const { isMobile } = useMatchBreakpoints()

  const [isUpdating, setIsUpdating] = useState(false);

  const queryString = window.location.search;
  const parameters = new URLSearchParams(queryString);
  const newReferral = parameters.get('ref');

  const tokenContract = useCustomTokenContract();
  const stakingContract = useCustomStakingContract();
  const referralContract = useCustomReferralContract()

  const [apy, setAPY] = useState("0");
  const [totalStaked, setTotalStaked] = useState("0");

  const [stakeInputValue, setStakeInputValue] = useState('0');
  const [unstakeInputValue, setUnStakeInputValue] = useState('0');
  const [pendingTx, setPendingTx] = useState(false);

  const [refLink, setRefLink] = useState(`${REF_PREFIX}0x0000000000000000000000000000000000000000`);

  const [isApproved, setIsApproved] = useState(false);

  const [userBalance, setUserBalance] = useState("0");

  const [stakedAmount, setStakedAmount] = useState("0");
  const [pendingReward, setPendingReward] = useState("0");
  const [claimedReward, setClaimedReward] = useState("0");
  const [totalReferralAmount, setTotalReferralAmount] = useState("0");
  const [pendingReferralAmount, setPendingReferralAmount] = useState("0");

  const ssgPriceBNB = useSSGBNBPrice({ forceMainnet: true })
  const bnbPriceUsd = useBNBBusdPrice({ forceMainnet: true })

  const totalStakedUSD = useCallback(() => {
    const ssgPriceUSD = multiplyPriceByAmount(ssgPriceBNB, multiplyPriceByAmount(bnbPriceUsd, 1))
    const val = parseFloat(displayUnits(totalStaked, 9)) * ssgPriceUSD;
    return Number.isNaN(val) ? 0 : val;
  }, [ssgPriceBNB, bnbPriceUsd, totalStaked])

  const userStakedUSD = useCallback(() => {
    const ssgPriceUSD = multiplyPriceByAmount(ssgPriceBNB, multiplyPriceByAmount(bnbPriceUsd, 1))
    const val = parseFloat(displayUnits(stakedAmount, 9)) * ssgPriceUSD;
    return Number.isNaN(val) ? 0 : val;
  }, [ssgPriceBNB, bnbPriceUsd, stakedAmount])

  const userShare = useCallback(() => {
    const val = parseFloat(totalStaked) > 0 && !Number.isNaN(parseFloat(totalStaked)) ? parseFloat(stakedAmount) / parseFloat(totalStaked) : 0;
    return Number.isNaN(val) ? 0 : val;
  }, [totalStaked, stakedAmount])


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

  let timerId: NodeJS.Timeout;

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
  }, [tokenContract, stakingContract, referralContract, account]);

  const updateParameters = async () => {
    console.log("updateParameters isUpdating=", isUpdating);
    try {
      setIsUpdating(true);

      const resPoolInfo = await getPoolInfo(stakingContract);
      setTotalStaked(resPoolInfo?.amount.toString())

      const resRewardPerBlock = await getRewardPerBlock(stakingContract);
      setAPY(resPoolInfo?.amount.gt(0) ? resRewardPerBlock.mul(288 * 365).div(resPoolInfo?.amount).toString() : '0');

      if (!account) {
        setAPY("0");
        setUserBalance("0");
        setStakedAmount("0");
        setPendingReward("0");
        setClaimedReward("0");
        return;
      }

      const resUserBalance = await getTokenBalance(tokenContract, account);
      console.log('[PRINCE](userBalance): ', resUserBalance)
      setUserBalance(resUserBalance.toString());

      const _allowance = await getAllowance(tokenContract, account, getStakingAddress(chainId));
      if (_allowance.lt(ethers.utils.parseUnits(stakeInputValue, TOKEN_DECIMALS)))
        setIsApproved(false);
      else
        setIsApproved(true);

      const resUserInfo = await getUserInfo(stakingContract, account);
      setStakedAmount(resUserInfo?.amount.toString())
      setClaimedReward(resUserInfo?.rewardDebt.toString());

      const resPendingReward = await getPendingReward(stakingContract, account);
      setPendingReward(resPendingReward.toString());

      const resPendingRefReward = await getPendingRefReward(referralContract, account);
      setPendingReferralAmount(resPendingRefReward.toString())

      const resTotalRefReward = await getTotalRefReward(referralContract, account);
      setTotalReferralAmount(resTotalRefReward.toString())
    } catch (err) {
      console.log("error = ", err)
    }
    console.log("updateParameters isUpdating=", "pass");
    setIsUpdating(false);
  }

  const onClickStakeMax = () => {
    setStakeInputValue(userBalance);
  }

  const onChangeStakeInputValue = (e) => {
    e.preventDefault();
    setStakeInputValue(e.target.value);
  }

  const onStake = async () => {
    if (stakingContract && account) {
      if (!(parseInt(stakeInputValue) <= parseInt(userBalance))) {
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
              {apy === '0' || Number.isNaN(apy) ? '--%' : `${displayFixed(apy, 2, 9)}%`}
            </div>
          </div>
          <div className="vault-info">
            <div className="vault-title">Total Staked:</div>
            <div className="vault-value">
              {displayFixed(totalStaked, 2, 9)} SSG
            </div>
          </div>
          <div className="vault-info">
            <div className="vault-title">Total Staked (USD):</div>
            <div className="vault-value">
              {`$ ${displayFixedNumber(totalStakedUSD(), 2)}`}
            </div>
          </div>
        </div>
        <div style={{ margin: '0.8rem 0px' }}>
          <h5 className="title-6" style={{ fontSize: '1.2em', fontWeight: '300' }}>
            STAKE YOUR TOKENS, EARN REWARDS
          </h5>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#c5c6d1', fontSize: '15px' }}>
              Your tokens:
              {displayFixed(userBalance, 2, 9)} SSG
            </span>
            <button type='button'
              style={{ color: '#c5c6d1', fontSize: '15px', cursor: 'pointer', border: 0, padding: 0, background: "transparent" }}
              onClick={onClickStakeMax}
            >
              Max
            </button>
          </div>
          <InputStakeAmount
            placeholder="0"
            value={stakeInputValue}
            min='0'
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
              {displayFixed(stakedAmount, 2, 9)} SSG
            </div>
          </div>
          <div className="vault-info">
            <div className="vault-title">Your Stake (USD):</div>
            <div className="vault-value">
              {`$ ${displayFixedNumber(userStakedUSD(), 2)}`}
            </div>
          </div>
          <div className="vault-info">
            <div className="vault-title">Your Share:</div>
            <div className="vault-value">
              {`${displayFixedNumber(userShare(), 2)}%`}
            </div>
          </div>
          <div className="vault-info">
            <div className="vault-title">Your Claimed Rewards:</div>
            <div className="vault-value">
              {displayFixed(claimedReward, 2, 9)} SSG
            </div>
          </div>
          <div className="vault-info">
            <div className="vault-title">Your Pending Rewards:</div>
            <div className="vault-value">
              {displayFixed(pendingReward, 2, 9)} SSG
            </div>
          </div>
          <StyledContentButton style={{ padding: '11px 22px', fontSize: '16px', marginTop: '10px' }}
            onClick={onClaimRewards}
          >
            CLAIM EARNINGS
          </StyledContentButton>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '15px' }}>
            <span style={{ color: '#c5c6d1', fontSize: '15px' }}>
              {`Staked Tokens: ${stakedAmount} SSG`}
            </span>
            <button type='button'
              style={{ color: '#c5c6d1', fontSize: '15px', cursor: 'pointer', border: 0, padding: 0, background: "transparent" }}
              onClick={onClickUnStakeMax}
            >
              Max
            </button>
          </div>
          <InputUnstakeAmount placeholder="0"
            value={unstakeInputValue}
            min='0'
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
        </div>
      </StyledContentContainer>
      <StyledContentContainer style={{ marginLeft: isMobile ? '20px' : '100px', marginTop: '50px' }}>
        <div style={{ margin: '1rem 0px' }}>
          <h5 className="title-6">REFERRAL REWARDS</h5>
          <div className="vault-info">
            <div className="vault-title">Total Referral Rewards:</div>
            <div className="vault-value">
              {displayFixed(totalReferralAmount, 2, 9)} SSG
            </div>
          </div>
          <div className="vault-info">
            <div className="vault-title">Pending Referral Rewards:</div>
            <div className="vault-value">
              {displayFixed(pendingReferralAmount, 2, 9)} SSG
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '15px', color: '#c5c6d1', fontSize: '15px' }}>
            Share your referral link to earn 10% of Rewards
          </div>
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', position: "relative", marginTop: '10px', marginBottom: '20px' }}>
            <ShowReferral
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
        <p className="fee-title">
          This application is decentralized and is provided with no guarantees or warranties of any kind.
        </p>
      </StyledContentContainer>
    </>
  )
}
