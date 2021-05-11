// Smart Contract of a Cheque Issuance System

pragma solidity 0.4.20;
pragma experimental ABIEncoderV2;

contract ChequeIssuance {

    struct Chequebook {
        uint serialNumber;
        uint numberOfCheques;
        string issuanceDate;
        string owner;
        bool valid;
    }
    
	struct Cheque {
	    uint chequebookSerialNumber;
	    uint id;
		string issuer;
		string recipient;
		uint amount;
		string issuanceDate;
		string dueDate;
		uint dueDateSeconds;
		string status;
		bool valid;
	}
	
	struct Customer {
	    string accountAddress;
	    string name;
	    string phoneNumber;
	    bool valid;
	}
	
	mapping(string => Customer) private customersDB;         // Customers Database: Stores customers information
	mapping(string => uint[]) private customerChequebooks;
	mapping(uint => Chequebook) private chequebooksDB;        // Chequebooks Database: Stores all issued chequebooks for all customers
	mapping(string => uint[]) private issuedCheques;
	mapping(string => uint[]) private carryingCheques;
	mapping(uint => Cheque) private issuanceDB;                 // Issued Cheques Database: Stores all issued cheques by all customers

    mapping(string => uint256) private balances;

	uint private snCounter;                                 // Determine new issued chequebook's serial number
	
	function ChequeIssuance() public {
	    snCounter = 0;
	}
	
	function chequebookRequest(string sender, string memory date) public {
	    customerChequebooks[sender].push(++snCounter);
	    chequebooksDB[snCounter] = Chequebook(snCounter, 10, date, sender, true);
	}

	function issue(string issuer, string recipient, uint chequebookSerialNumber, uint amount, string memory issuanceDate, string memory dueDate, uint dueDateSeconds) public {
	    Chequebook chBook = chequebooksDB[chequebookSerialNumber];
	    require(chBook.numberOfCheques > 0);
	    //require(dueDateSeconds > block.timestamp);
	    uint issuanceID = (chequebookSerialNumber * 100) + (11 - chBook.numberOfCheques);
	    issuanceDB[issuanceID] = Cheque(chequebookSerialNumber, issuanceID, issuer, recipient, amount, issuanceDate, dueDate, dueDateSeconds, "TIME LEFT", true);
	    issuedCheques[issuer].push(issuanceID);
	    carryingCheques[recipient].push(issuanceID);
	    chequebooksDB[chequebookSerialNumber].numberOfCheques--;
	    if(chequebooksDB[chequebookSerialNumber].numberOfCheques == 0)  chequebooksDB[chequebookSerialNumber].valid = false;
	}
	
	function getCustomerChequebooks(string memory accountAddress) public returns(uint[] memory, uint[] memory, string[] memory, string[] memory, bool[] memory) {
	    uint[] memory chBook = customerChequebooks[accountAddress];
	    uint[] memory chequebookSerialNumbers = new uint[](chBook.length);
	    uint[] memory numberOfCheques = new uint[](chBook.length);
 	    string[] memory issuanceDates = new string[](chBook.length); 
	    string[] memory owner = new string[](chBook.length);
	    bool[] memory valid = new bool[](chBook.length);
	    
	    for(uint i=0; i<chBook.length; i++){
	        chequebookSerialNumbers[i] = chequebooksDB[chBook[i]].serialNumber;  
	        numberOfCheques[i] = chequebooksDB[chBook[i]].numberOfCheques;
	        issuanceDates[i] = chequebooksDB[chBook[i]].issuanceDate;
	        owner[i] = chequebooksDB[chBook[i]].owner;
	        valid[i] = chequebooksDB[chBook[i]].valid;
	    }
	    return (chequebookSerialNumbers, numberOfCheques, issuanceDates, owner, valid);
	}
	
	function getCustomerIssuedCheques(string accountAddress) public returns(uint[] memory, string[] memory, uint[] memory, string[] memory, string[] memory, string[] memory) {
	    uint[] memory cheques = issuedCheques[accountAddress];
	    uint[] memory id = new uint[](cheques.length);
	    string[] memory recipient = new string[](cheques.length);
 	    uint[] memory amount= new uint[](cheques.length); 
	    string[] memory issuanceDate = new string[](cheques.length);
	    string[] memory dueDate = new string[](cheques.length);
	    string[] memory status = new string[](cheques.length);
	    
	    for(uint i=0; i<cheques.length; i++){
	        id[i] = issuanceDB[cheques[i]].id;
	        recipient[i] = issuanceDB[cheques[i]].recipient;
	        amount[i] = issuanceDB[cheques[i]].amount;
	        issuanceDate[i] = issuanceDB[cheques[i]].issuanceDate;
	        dueDate[i] = issuanceDB[cheques[i]].dueDate;
	        if(issuanceDB[cheques[i]].valid) {
	            if(issuanceDB[cheques[i]].dueDateSeconds <= block.timestamp)   status[i] = "NOT PASSED";
	            else    status[i] = "TIME LEFT";
	        }
	        else    status[i] = "PASSED";
	    }
	    return (id, recipient, amount, issuanceDate, dueDate, status);
	}

	function getCustomerCarryingCheques(string accountAddress) public returns(uint[] memory, string[] memory, uint[] memory, string[] memory, string[] memory, string[] memory) {
	    uint[] memory cheques = carryingCheques[accountAddress];
	    uint[] memory id = new uint[](cheques.length);
	    string[] memory issuer = new string[](cheques.length);
 	    uint[] memory amount= new uint[](cheques.length); 
	    string[] memory issuanceDate = new string[](cheques.length);
	    string[] memory dueDate = new string[](cheques.length);
	    string[] memory status = new string[](cheques.length);
	    
	    for(uint i=0; i<cheques.length; i++){
	        id[i] = issuanceDB[cheques[i]].id;
	        issuer[i] = issuanceDB[cheques[i]].issuer;
	        amount[i] = issuanceDB[cheques[i]].amount;
	        issuanceDate[i] = issuanceDB[cheques[i]].issuanceDate;
	        dueDate[i] = issuanceDB[cheques[i]].dueDate;
	        if(issuanceDB[cheques[i]].valid && ((issuanceDB[cheques[i]].dueDateSeconds) <= block.timestamp)) {
	            issuanceDB[cheques[i]].status = "NOT PASSED";
	            status[i] = "NOT PASSED";
	        }
	        else    status[i] = issuanceDB[cheques[i]].status;
	    }
	    return (id, issuer, amount, issuanceDate, dueDate, status);
	}
	
	function balanceOf(string account) public returns (uint256) {
	    return balances[account];
	}
	
	function payME(uint chequeID) public {
	    require((issuanceDB[chequeID].valid == true) && ((issuanceDB[chequeID].dueDateSeconds) <= block.timestamp));
	    require(balances[issuanceDB[chequeID].issuer] >= issuanceDB[chequeID].amount);
	    balances[issuanceDB[chequeID].issuer] -= issuanceDB[chequeID].amount;
	    balances[issuanceDB[chequeID].recipient] += issuanceDB[chequeID].amount;
	    issuanceDB[chequeID].status = "PASSED";
	    issuanceDB[chequeID].valid = false;
	}
	
	function deposit(string account) payable public {
	    require(msg.value > 0);
	    balances[account] += msg.value;
	}
	
	function withdraw(string account, uint amount) public {
	    require(balances[account] >= amount);
	    balances[account] -= amount;
	    msg.sender.transfer(amount);
	}

}
