import React from 'react';
import './App.scss';
// import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'
import BankContract from './abis/Bank.json';
import TokenContract from './abis/ERC20.json';
import Web3 from 'web3'

class App extends React.Component {

    async componentDidMount(){
        await this.loadWeb3()
        await this.loadBlockchainData()
      }

    async loadBlockchainData(){
        const web3 = new Web3(Web3.givenProvider || "http://localhost:8545");
        const netId = await web3.eth.net.getId()
        const accounts = await web3.eth.getAccounts();
        this.setState({ account: accounts[0]});

        const bankContractData = BankContract.networks[netId]
        const tokenContractData = TokenContract.networks[netId]

        if(bankContractData){
            const bankAbi = new web3.eth.Contract(BankContract.abi, bankContractData.address)
            const tokenAbi = new web3.eth.Contract(TokenContract.abi, tokenContractData.address)
            this.setState({ bankAbi })
            this.setState({ tokenAbi })
        }else{
            window.alert('Lotery smart contract has not been deployed to detected network')
        }

        try{
            let currentBalanceMetamask = await web3.eth.getBalance(this.state.account);
            currentBalanceMetamask = web3.utils.fromWei(currentBalanceMetamask, 'ether')
            this.setState({currentBalanceMetamask})

            let currentBalanceBank = await this.state.bankAbi.methods.getBalance().call()
            currentBalanceBank = web3.utils.fromWei(currentBalanceBank, 'ether')
            this.setState({currentBalanceBank})

            let currentBalanceToken = await this.state.tokenAbi.methods.balanceOf().call()
            this.setState({ currentBalanceToken })

            // let test = await this.state.tokenAbi.methods.buyToken().send({ from: this.state.account, value: 1000000000000000000})
            // console.log(test)

            this.setState({ loading: false })
        } catch(e){
            console.log("ERROR HERE : " + e)
            console.log(e.message)
        }
    }

    async loadWeb3(){
        if(window.ethereum){
          window.web3 = new Web3(window.ethereum)
          await window.ethereum.enable()
        } else if(window.web3){
          window.web3 = new Web3(window.web3.currentProvider)
        } else {
          window.alert('Non-Ethereum browser detected. Please download Metamask')
        }
    }

    constructor(props){
        super(props);
        this.state = { 
            account:'',
            currentBalanceMetamask: 0,
            currentBalanceBank: 0,
            currentBalanceToken: 0,
            loading: true,
            depositAmount: 0,
            withDrawAmount: 0,
            bankAbi: {},
            tokenAbi: {},
            TransferTo: '0x0',
            TransferAmount: 0,
            BuyingToken: 0,
            SellingToken: 0
        }

        this.onInputchangeDeposit = this.onInputchangeDeposit.bind(this);
        this.onInputchangeWithDraw = this.onInputchangeWithDraw.bind(this);

        this.onInputchangeSell = this.onInputchangeSell.bind(this);
        this.onInputchangeBuy = this.onInputchangeBuy.bind(this);
        this.onInputchangeTransferTo = this.onInputchangeTransferTo.bind(this);
        this.onInputchangeTransferAmount = this.onInputchangeTransferAmount.bind(this);
    }

    onInputchangeDeposit(event) {
        const validity = (event.target.validity.valid) ? event.target.value : this.state.depositAmount;
        
        if(validity != 0){
            this.setState({depositAmount: event.target.value * 1000000000000000000});
        }
        else{
            event.target.value = ''
            alert("Please insert valid value !")
        }
    }

    onInputchangeWithDraw(event) {
        const validity = (event.target.validity.valid) ? event.target.value : this.state.withDrawAmount;
        
        if(validity != 0){
            this.setState({withDrawAmount: event.target.value * 1000000000000000000});
        }
        else{
            event.target.value = ''
            alert("Please insert valid value !")
        }
    }

    onInputchangeSell(event) {
        const validity = (event.target.validity.valid) ? event.target.value : this.state.SellingToken;
        
        if(validity != 0){
            this.setState({SellingToken: event.target.value});
        }
        else{
            event.target.value = ''
            alert("Please insert valid value !")
        }
    }

    onInputchangeBuy(event) {
        const validity = (event.target.validity.valid) ? event.target.value : this.state.BuyingToken;
        
        if(validity != 0){
            this.setState({BuyingToken: event.target.value * 1000000000000000000});
        }
        else{
            event.target.value = ''
            alert("Please insert valid value !")
        }
    }

    onInputchangeTransferTo(event) { 
        this.setState({
            TransferTo: event.target.value
        });
    }

    onInputchangeTransferAmount(event) {
        const validity = (event.target.validity.valid) ? event.target.value : this.state.TransferAmount;
        
        if(validity != 0){
            this.setState({TransferAmount: event.target.value });
        }
        else{
            event.target.value = ''
            alert("Please insert valid value !")
        }
    }

    render(){
    return (
        <div id="WalletManagement">
        <h3 id="Title1">... Your bank ...</h3>
        <br/><br/><br/>
        <h3 id="loadedAccount">Loaded Metamask Account : {this.state.account}</h3>
        <h3 id="loadedAccountBalance">Balance on metamask: {this.state.currentBalanceMetamask} eth</h3>
        <h3 id="loadedAccountBalance">Balance on bank account: {this.state.currentBalanceBank} eth</h3>
            <div id="formulaireBank">
                <form id="form_Deposit" >
                    <div className="form__group field" style={{ display: "inline" }}>
                        <input type="text" pattern="[0-9]*" className="form__field" id='Deposit_amount'  onChange={ this.onInputchangeDeposit } required />
                        <label htmlFor="amount" className="form__label">Deposit Amount</label>
                        <button id="form_buttonDeposit" className="pulse" onClick={async () => {await this.state.bankAbi.methods.stockMoney().send({ from: this.state.account, value: this.state.depositAmount})}}>Deposit</button>
                    </div>
                </form>
                <br/><br/><br/>
                <form id="form_Withdraw" >
                    <div className="form__group field" style={{ display: "inline" }}>
                        <input type="text" pattern="[0-9]*" className="form__field" id='Withdraw_amount' onChange={ this.onInputchangeWithDraw }  required />
                        <label htmlFor="amount" className="form__label">Withdraw Amount</label>
                        <button id="form_buttonWithDraw" className="pulse" onClick={async () => {await this.state.bankAbi.methods.withdrawMoney(this.state.withDrawAmount.toString()).send({ from: this.state.account })}}>Withdraw</button>
                    </div>
                </form>
            </div>

            <br/><br/><br/>
            <h3 id="Title2">... Token Bank ...</h3>
            <br/><br/><br/>
            <h3 id="loadedAccount">Loaded Metamask Account : {this.state.account}</h3>
            <h3 id="loadedAccountBalance">Balance on metamask: {this.state.currentBalanceMetamask} eth</h3>
            <h3 id="loadedAccountBalance">Balance of token: {this.state.currentBalanceToken} srk</h3>

            <div id="formulaireToken">
                <form id="form_Buy" >
                    <div className="form__group field" style={{ display: "inline" }}>
                        <input type="text" pattern="[0-9]*" className="form__field" id='Eth_amount'  onChange={ this.onInputchangeBuy } required />
                        <label htmlFor="amountBuying" className="form__label">Amount of Ether to buy token</label>
                        <button id="form_buttonBuy" className="pulse" onClick={async () => {await this.state.tokenAbi.methods.buyToken().send({ from: this.state.account, value: this.state.BuyingToken})}}>Buy Token</button>
                    </div>
                </form>
                <br/><br/><br/>
                <form id="form_Sell" >
                    <div className="form__group field" style={{ display: "inline" }}>
                        <input type="text" pattern="[0-9]*" className="form__field" id='tokenAmount' onChange={ this.onInputchangeSell }  required />
                        <label htmlFor="amountSelling" className="form__label">Selling Amount</label>                        
                        <button id="form_buttonSell" className="pulse" onClick={async () => {await this.state.tokenAbi.methods.sellToken(this.state.SellingToken.toString()).send({ from: this.state.account })}}>Sell Token</button>
                    </div>
                </form>
                <br/><br/><br/>
                <form id="form_Transfer" >
                    <div className="form__group field" style={{ display: "inline" }}>
                        <input type="input" className="form__field" id='AdrressTo' onChange={ this.onInputchangeTransferTo }  required />
                        <label htmlFor="addrTo" className="form__label">Address To Send Token</label>
                    </div>
                    <br />
                    <br />
                    <div className="form__group field" style={{ display: "inline" }}>
                        <input type="input" className="form__field" id='token_amount' onChange={ this.onInputchangeTransferAmount }  required />
                        <label htmlFor="amountTokenToTransfer" className="form__label">Token Amount</label>
                        <button id="form_buttonTransfer" className="pulse" onClick={async () => {await this.state.tokenAbi.methods.transfer(this.state.TransferTo, this.state.TransferAmount.toString()).send({ from: this.state.account })}}>Transfer Token</button>
                    </div>
                </form>
            </div>
        </div>
        );
    }
    
}

export default App;