import React, {useEffect, useState, useCallback} from 'react'
import { websocketClient} from '../../webSocketConnection/WebSocketClient';
import {connect} from 'react-redux';
import styled from 'styled-components';
import { saveOrderBookData } from '../../actions/asyncActions';
import {throttle } from 'lodash';


const OrderBook = connect( state => ({orderBook : state.orderBook}))((props) => {
    const { orderBook } = props
    const { bids, asks } = orderBook
    const PRECESION = ["P0", "P1"];
  
    const saveBook   = useCallback(throttle((b) => props.dispatch(saveOrderBookData(b)), 500))
  
    const [precesion, setPrecision] = useState(0)
    const [scale, setScale] = useState(1.0)
  
    const incPrecision = () => precesion < 4 && setPrecision((precesion + 1) % PRECESION.length)
    const decScale = () => setScale(scale + 0.1)
    const incScale = () => setScale(scale - 0.1)
  
    const [connectionStatus, setConnectionStatus] = useState(true)
  
    const startConnection = () => !connectionStatus && setConnectionStatus(true)
    const stopConnection = () => connectionStatus && setConnectionStatus(false)
  
    const prec = precesion % PRECESION.length
    useEffect(() => {
        websocketClient({orderBook, saveBook, setConnectionStatus, connectionStatus})
    }, [connectionStatus])
  
    const _asks = asks && Object.keys(asks).slice(0,21).reduce((acc,k,i) => { 
          const total = Object.keys(asks).slice(0,i+1).reduce((t,i) => {
            t = t + asks[i].amount
            return t
          },0)
          const item = asks[k]
          acc[k] = {...item, total}
          return acc
    },{})
    const maxAskAggregate = Object.keys(_asks).reduce((t,i) => {
      if(t < _asks[i].total) { 
        return _asks[i].total}
      else { 
        return t 
      }
    },0)
    const _bids = bids && Object.keys(bids).slice(0,21).reduce((acc,k,i) => { 
          const total = Object.keys(bids).slice(0,i+1).reduce((t,i) => {
            t = t + bids[i].amount
            return t
          },0)
          const item = bids[k]
          acc[k] = {...item, total}
          return acc
    },{})
    const maxBidsSum = Object.keys(_bids).reduce((t,i) => {
      if(t < _bids[i].total) { 
        return _bids[i].total}
      else { 
        return t 
      }
    },0)
  
    return(
      <div>
        <Panel>
  
          <Bar>
        <h3>Order Book <span>BTC/USD</span></h3>
        <Tools>
        { !connectionStatus && <Icon onClick={ startConnection }> Connect </Icon> }
        { connectionStatus && <Icon onClick={ stopConnection }> Disconnect </Icon> }
        <Icon onClick={ incPrecision }> precesion </Icon>
        <Icon onClick={ decScale }></Icon>
        <Icon onClick={ incScale }></Icon>
        </Tools>
      </Bar>
        <Sides>
        <Side>
          <thead>
          <Row>
            <Col className="count">Count</Col>
            <Col>Amount</Col>
            <Col className="total">Total</Col>
            <Col>Price</Col>
          </Row>
        </thead>
        <tbody>
        {_bids && Object.keys(_bids).map((k,i) => {
          const item = _bids[k]
          const {cnt, amount, price, total} = item
          const percentage = ((total * 100) / (maxBidsSum * scale))
          return(
            <Row 
              key={`book-${cnt}${amount}${price}${total}`}
              >
              <Col className="count">{ cnt }</Col>
              <Col>{ amount.toFixed(2) }</Col>
              <Col className="total">{ total.toFixed(2) }</Col>
              <Col>{ price.toFixed(prec) }</Col>
            </Row>
          )
        })}
      </tbody>
        </Side>
        <Side>
          <thead>
          <Row>
            <Col>Price</Col>
            <Col className="total">Total</Col>
            <Col>Amount</Col>
            <Col className="count">Count</Col>
          </Row>
        </thead>
        <tbody>
        {_asks && Object.keys(_asks).map((k,i) => {
          const item = _asks[k]
          const {cnt, amount, price, total} = item
          const percentage = (total * 100) / (maxAskAggregate * scale)
          return(
            <Row>
              <Col>{ price.toFixed(prec) }</Col>
              <Col className="total">{ total.toFixed(2) }</Col>
              <Col>{ amount.toFixed(2) }</Col>
              <Col className="count">{ cnt }</Col>
            </Row>
          )
        })}
      </tbody>
        </Side>
      </Sides>
    </Panel>
    </div>
    )
})

export const Panel = styled.div`
  background-color: #1b262d;
  flex-grow:0;
  display: flex;
  flex-flow: column;
  width:800px;
  margin:10px;
  padding:5px;
  box-sizing:border-box;
  -webkit-touch-callout: none;
    -webkit-user-select: none;
     -khtml-user-select: none;
       -moz-user-select: none;
        -ms-user-select: none;
            user-select: none;
`;

export const Sides = styled.div`
  display:flex;
  flex-basis:100%;
  flex-flow:row nowrap;
`;
export const Side = styled.table`
border-spacing:0px;
flex-basis:50%;
width:calc(50% - 2px);
box-sizing:border-box;
margin:0px 1px;
thead {
  td {
    text-transform:uppercase;
    font-size:12px;
    color:#aaa!important;
  }
}
`;

export const Row = styled.tr`
  background-repeat:no-repeat;
  background-size:100% 100%;
  display: flex;
  td.count{
    text-align:center;
  }
`;
export const Col = styled.td`
  color:#F0F0f0;
  padding:1px 10px;
  flex:1;
  font:normal 14px Arial;
  text-align:right;
            `;

export const Bar = styled.div`
  display:flex;
  flex-flow:row;
  justify-content:space-between;
  align-items:start;
  border-bottom:1px solid #555;
  height:30px;
  padding-bottom:5px;
  margin-bottom:10px;
  h3 {
    padding:10px 0px 0px 20px;
    margin:0px;
    font:normal 16px Arial!important;
    font-weight:normal;
    justify-self:flex-start;
    span {
      color:#888;
      font-size:16px;
    }
  }
`;
export const Tools = styled.div`
display:flex;
flex-flow:row;
justify-content: flex-end;
`;
export const Icon = styled.div`
  display:flex;
  flex-grow:0;
  padding:10px;
  font:normal 15px Arial; 
  svg {
    font-size:20px;
  }
`;

export default OrderBook
