pragma solidity >=0.4.22 <0.8.0;

contract Bank {

    mapping(address=> uint)public balances;

    //  FUNCTIONS
    function stockMoney() public payable{
        balances[msg.sender] += msg.value;
    }
    
    function withdrawMoney(uint amount) public payable{
        require(amount <= balances[msg.sender], "NOT ENOUGH MONEY IN STOCK !");
        balances[msg.sender] -= amount;
        msg.sender.transfer(amount);
    }
    
    
    function getBalance() public view returns (uint) {
        return balances[msg.sender];
    }

}

contract ERC20  {

    mapping (address => uint256) private _balances;

    uint256 private _totalSupply;

    string private _name;
    string private _symbol;
    uint8 private _decimals;

    constructor () public {
        _name = 'SerinkanToken';
        _symbol = 'srk';
        _decimals = 18;
    }

    function name() public view returns (string memory) {
        return _name;
    }

    function symbol() public view returns (string memory) {
        return _symbol;
    }

    function decimals() public view returns (uint8) {
        return _decimals;
    }

    function totalSupply() public view returns (uint256) {
        return _totalSupply;
    }
   
    function balanceOf() public view returns (uint256) {
        return _balances[msg.sender];
    }

    function transfer(address _to, uint256 amount) public {
        require(msg.sender != address(0), "ERC20: transfer from the zero address");
        require(_to != address(0), "ERC20: transfer to the zero address");
        require(amount <= _balances[msg.sender], "ERC20: cannot send token that you don't have");
        
        _balances[msg.sender] = _balances[msg.sender] - amount;
        _balances[_to] = _balances[_to] + amount;
    }

    
    function buyToken() public  payable {
        msg.sender.transfer(msg.value);
        uint amount = msg.value * 4;
        _balances[msg.sender] = _balances[msg.sender] + amount;
    }
    
    function sellToken(uint256 amount) public payable {
        _balances[msg.sender] = _balances[msg.sender] - amount;
        uint value = amount / 5;
        msg.sender.transfer(value);

    }


}