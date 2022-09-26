import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { AppHeader, AppBody } from '../../components/App'
import Page from '../Page'
import { Button, Input } from '@pancakeswap/uikit'
import { StyledConnectButton } from '@pancakeswap/uikit/src/components/Button/StyledButton'

const StyledContentButton = styled(StyledConnectButton)`
  padding: 10px 20px !important;
  font-size: 16px;
`

const StyledContentContainer = styled.div`
    display: flex;
    flex-direction: column;
    background-color: #302f30;
    width: calc(100% - 40px);
    max-width: 700px;
    // max-height: 840px;
    box-shadow: 0px 0px 14px 8px #cb5741;
    border-radius: 18px;
    padding: 30px;
    
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

const StyledInput = styled(Input)<{ textAlign?: string}>`
  --border-opacity: 1;
  border-color: rgb(167, 70, 61);
  border-width: 3px;
  margin-top: 10px;
  box-shadow: rgb(1 7 16 / 85%) 0px 5px 12px 0px;
  border-radius: 1rem;
  border-style: inset;
  background-color: rgb(123, 45, 33);
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

export default function Staking() {
  const [apy, setAPY] = useState('0')

  return (
    <>
      {/* <Overlay onClick={onHandleSideBar} isOpen={isOpen} /> */}
      <StyledContentContainer style={{ margin: '30px' }}>
        <div style={{ margin: '1rem 0px' }}>
          <h5 className="title-6">OUR STAKING PLATFORM</h5>
          <div className="vault-info">
            <div className="vault-title">APY:</div>
            <div className="vault-value">
              {apy === '0' || Number.isNaN(apy) ? '--%' : `${displayFixedNumber(apy, 2)}%`}
              4815
            </div>
          </div>
          <div className="vault-info">
            <div className="vault-title">Total BNB Claimed:</div>
            <div className="vault-value">
              {/*{displayFixed(totalBNBClaimed, 2, 18)}*/}
              418591
            </div>
          </div>
          <div className="vault-info">
            <div className="vault-title">Total Staked:</div>
            <div className="vault-value">
              {/*{displayFixed(totalStaked, 2, 9)}*/}
              45613
            </div>
          </div>
          <div className="vault-info">
            <div className="vault-title">Total Staked (USD):</div>
            <div className="vault-value">
              {/*{`$ ${displayFixedNumber(totalStakedUSD, 2)}`}*/}
              489
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
              {/*{balance}*/} 1561
            </span>
            <span
              style={{ color: '#c5c6d1', fontSize: '15px', cursor: 'pointer' }}
              // onClick={onClickStakeMax}
            >
              Max
            </span>
          </div>
          <StyledInput
            placeholder="0"
            // value={stakeInputValue}
            type="number"
            textAlign="left"
            //onChange={onChangeStakeInputValue}
          />
          <StyledContentButton
          // onClick={() => (connected ? (isApproved ? onStake() : onApprove()) : connect())}
          >
            {/*{connected ? (isApproved ? 'Stake' : 'Approve') : 'Connect Wallet'}*/}
            Connect
          </StyledContentButton>
        </div>
      </StyledContentContainer>
      <StyledContentContainer style={{ margin: '50px 20px 20px' }}>
        <div style={{ margin: '1rem 0px' }}>
          <h5 className="title-6">EARNINGS AND UNSTAKE TOKENS</h5>
          <div className="vault-info">
            <div className="vault-title">Your Staked:</div>
            <div className="vault-value">
            {/*{stakedAmount}*/}
            5743753
            </div>
          </div>
          <div className="vault-info">
            <div className="vault-title">Your Stake (USD):</div>
            <div className="vault-value">
             {/*{`$ ${displayFixedNumber(stakedUSD, 2)}`}*/}
            54612361
            </div>
          </div>
          <div className="vault-info">
            <div className="vault-title">Your Share:</div>
            <div className="vault-value">
            {/*{`${displayFixedNumber(share, 2)}%`}*/}
            436246
            </div>
          </div>
          <div className="vault-info">
            <div className="vault-title">Your Pending BNB Rewards:</div>
            <div className="vault-value">
            {/*{`${displayFixedNumber(pendingReward, 6)}`}*/}
            6543
            </div>
          </div>
          <div className="vault-info">
            <div className="vault-title">Your Claimed BNB Rewards:</div>
            <div className="vault-value">
            {/*{`${displayFixedNumber(claimedReward, 6)}`}*/}
            643264
            </div>
          </div>
          <StyledContentButton style={{ padding: '11px 22px', fontSize: '16px' }} 
          // onClick={onClaimRewards}
          >
            CLAIM EARNINGS
          </StyledContentButton>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '15px' }}>
            <span style={{ color: '#c5c6d1', fontSize: '15px' }}>
            {/*{`Staked Tokens: ${stakedAmount}`}*/}
            6543654
            </span>
            <span style={{ color: '#c5c6d1', fontSize: '15px', cursor: 'pointer' }} 
            // onClick={onClickUnStakeMax}
            >
              Max
            </span>
          </div>
          <StyledInput placeholder="0" 
          // value={unstakeInputValue}
           type="number"
           // onChange={onChangeUnStakeInputValue} 
           />

          <StyledContentButton style={{ padding: '11px 22px', fontSize: '16px' }} 
          // onClick={onUnstake}
          >
            UNSTAKE
          </StyledContentButton>
          <p className="fee-title" style={{ marginTop: '1rem' }}>
            This application is decentralized and is provided with no guarantees or warranties of any kind.
          </p>
        </div>
      </StyledContentContainer>
    </>
  )
}
