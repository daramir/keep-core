const fs = require('fs');
const Web3 = require('web3');
const HDWalletProvider = require("@truffle/hdwallet-provider");

// ETH host info
const contractOwnerProvider = new HDWalletProvider("EBAE221D3C6A4707B1B00927CE9DD6F866DC426658842CE3CFF5EBDAC2BF6000", "https://ropsten.infura.io/v3/59fb36a36fa4474b890c13dd30038be5")
const keepClient0Provider = new HDWalletProvider("0E893CECFCC4550F0DC55C8B50CAB4B074673F2DF5B24ADE715469F209BBEF08", "https://ropsten.infura.io/v3/59fb36a36fa4474b890c13dd30038be5")
const keepClient1Provider = new HDWalletProvider("BF147D10C30A441C0600CD232F299224BC9A59CB26E97031E2C7D077EA283EB4", "https://ropsten.infura.io/v3/59fb36a36fa4474b890c13dd30038be5")
const keepClient2Provider = new HDWalletProvider("1C10F2150DBC9FAB06A5FEC2A056BF6FA3CDC782E81D186513FFCC8F8A9D90EE", "https://ropsten.infura.io/v3/59fb36a36fa4474b890c13dd30038be5")
const keepClient3Provider = new HDWalletProvider("074A1D8574ACBDFC6B36A323E22A1427CF21BDD56AC487D119C7E13BAACDD372", "https://ropsten.infura.io/v3/59fb36a36fa4474b890c13dd30038be5")
const keepClient4Provider = new HDWalletProvider("61942DCCEFD8D279555B998F2D45C931E51E7EB39424116A4B335049C4947EC8", "https://ropsten.infura.io/v3/59fb36a36fa4474b890c13dd30038be5")
const ethNetworkId = '3';
/*
We override transactionConfirmationBlocks and transactionBlockTimeout because they're
25 and 50 blocks respectively at default.  The result of this on small private testnets
is long wait times for scripts to execute.
*/
const web3_options = {
    defaultBlock: 'latest',
    defaultGas: 4712388,
    transactionBlockTimeout: 25,
    transactionConfirmationBlocks: 3,
    transactionPollingTimeout: 480
};

const web3Operator = new Web3(keepClient4Provider, null, web3_options);
const web3 = new Web3(contractOwnerProvider, null, web3_options);

const assignedAccounts = [
//  '0x7fb43a257bf74904a41506fe38c87d32d91a77ae',
// '0xb6eb060a8d82a0bec265298aaccbf3577c2a5825',
// '0x4050aa55ae9bd11b7ea42d44dab3a6a1874dd751',
 //'0x186ab1ed890e341c9c882ba20459fd4f6ef18a30',
 '0x75353501e93ca9c9f48cb8ae82a7a218f1483267'
  ]

/*
Each <contract.json> file is sourced directly from the InitContainer.  Files are generated by
Truffle during contract and copied to the InitContainer image via Circle.
*/

// TokenStaking
const tokenStakingContractJsonFile = '../TokenStaking.json';
const tokenStakingContractParsed = JSON.parse(fs.readFileSync(tokenStakingContractJsonFile));
const tokenStakingContractAbi = tokenStakingContractParsed.abi;
const tokenStakingContractAddress = tokenStakingContractParsed.networks[ethNetworkId].address;
const tokenStakingContract = new web3.eth.Contract(tokenStakingContractAbi, tokenStakingContractAddress);

// KeepToken
const keepTokenContractJsonFile = '../KeepToken.json';
const keepTokenContractParsed = JSON.parse(fs.readFileSync(keepTokenContractJsonFile));
const keepTokenContractAbi = keepTokenContractParsed.abi;
const keepTokenContractAddress = keepTokenContractParsed.networks[ethNetworkId].address;
const keepTokenContract = new web3.eth.Contract(keepTokenContractAbi, keepTokenContractAddress);

async function stakeOperatorAccount(operator, contractOwner) {

  let ethAccountPassword = 'doughnut_armenian_parallel_firework_backbite_employer_singlet';

  //await web3.eth.personal.unlockAccount(operator, ethAccountPassword, 150000);
  //await web3.eth.personal.unlockAccount(contractOwner, ethAccountPassword, 150000);


  let magpie = contractOwner;
  let contractOwnerSigned = await web3Operator.eth.sign(web3.utils.soliditySha3(contractOwner), operator);

  /*
  This is really a bit stupid.  The return from web3.eth.sign is different depending on whether or not
  the signer is a local or remote ETH account.  We use web3.eth.sign to set contractOwnerSigned. Here
  the bootstrap peer account already exists and is hosted on an ETH node.
  */

  let signature = Buffer.from(contractOwnerSigned.substr(2), 'hex');
  let delegation = '0x' + Buffer.concat([Buffer.from(magpie.substr(2), 'hex'), signature]).toString('hex');

  console.log('Staking 2000000 KEEP tokens on operator account ' + operator);

  await keepTokenContract.methods.approveAndCall(
    tokenStakingContract.address,
    formatAmount(20000000, 18),
    delegation).send({from: contractOwner})

  console.log('Account ' + operator + ' staked!');
};

function formatAmount(amount, decimals) {
  return '0x' + web3.utils.toBN(amount).mul(web3.utils.toBN(10).pow(web3.utils.toBN(decimals))).toString('hex');
};

assignedAccounts.forEach(account =>
  stakeOperatorAccount(account, '0x0396457c928e58ae32bf28d7f3132d66653ccf5d').catch(error => {
  console.error(error);
  process.exit(1);
  })
);