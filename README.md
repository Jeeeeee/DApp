# DApp
| An electronic check management system based on blockchain and smart contract |

WHY THIS SYSTEM?
This project introduces an electronic check management system that is based on blockchain and smart contract. but first let's explain why do we need such a system?
you know well about usage of checks in financial businesses. currently most of check exchanges are based on paper; when you issue a check, you write the specifications of the check and give it to someone. as a reciever of a check, if you lose paper of check, there is no way to take your money back. so it is abvious that this physical exchange of checks have some major issues. as a solution, an electronic check system has beeen proposed. in this manner, your issued/recieved check information are stored in banks' databases. but these electronic systems have some other issues; they're CENTRALIZED. financial exchanges are so cruical, it's about MONEY so it is important to find more secure and reliable solutions. but what are issues of centralized systems?
in centralized systems, if the centralized component goes down, the whole system goes down. in a check system, if the centralized component (for example storage) got in trouble, all checks information would be lost. as a solution, a DISTRIBUTED check system can be proposed.
Here i developed a distributed check management system based on blockchain and smart contract. blockchain offers trust and we need much of trust in financial businesses so what we need in here is BLOCKCHAIN. 

COMPONENTS
* Smart Contract: This is the brain and kernel of the system. it is written in SOLIDITY language.
* Digital Wallet (MetaMask is used in this project)
* Front-End GUI: This is where users interact with the system. it is written in JAVASCRIPT language.

COMPONENTS RELATIONSHIP
Users can see their issued/recieved checks information on the webpage (the front-end component). every time users load the webpage, checks information are fetched from the blockchain. every time users want to issue a new check, entered specifications of the check are stored into the blockchain. this connection between webpage and blockchain is established through the digital wallet (MetaMask is used in this project). fetching information from blockchain is gas-free but writing to it needs gas. 
I've implemented kernel of the system in a smart contract and it is stored inside a blockchain. in this project i've used a blockchain simulation environment named Ganache.
