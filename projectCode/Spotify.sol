pragma solidity ^0.4.18; //We have to specify what version of the compiler this code will use

contract Spotify
{

	//make this indexed? Why?
	event Status(uint statusCode);

	struct media
	{
		bytes32 NameOfMedia;
		uint individualCost;
		uint CompanyCost;
		address[] stakeHolders; //creator is the stake holder at zero index
		uint[] sharesPerPerson;
		bytes32 encryptedUrl;
	}

	function bytesToAddr (bytes b) constant returns (address) 
	{
	  uint result = 0;
	  for (uint i = b.length-1; i+1 > 0; i--) {
	    uint c = uint(b[i]);
	    uint to_inc = c * ( 16 ** ((b.length - i-1) * 2));
	    result += to_inc;
	  }
	  return address(result);
	}


	//Taken from ethereum.stackexchange
  	function toBytes(address a) constant public returns (bytes b)
  	{
   		assembly 
   		{
	        let m := mload(0x40)
	        mstore(add(m, 20), xor(0x140000000000000000000000000000000000000000, a))
	        mstore(0x40, add(m, 52))
	        b := m
	    }
	}

	function bytes32ToBytes(bytes32 data) internal pure returns (bytes) 
	{
	    uint i = 0;
	    while (i < 32 && uint(data[i]) != 0) 
	    {
	        ++i;
	    }
	    bytes memory result = new bytes(i);
	    i = 0;
	    while (i < 32 && data[i] != 0) 
	    {
	        result[i] = data[i];
	        ++i;
	    }
	    return result;
	}


  	//This function is taken from "https://ethereum.stackexchange.com/questions/8346/convert-address-to-string"
  	function toString(address x) public returns (string) 
  	{
	    bytes memory b = new bytes(20);
	    for (uint i = 0; i < 20; i++)
	        b[i] = byte(uint8(uint(x) / (2**(8*(19 - i)))));
	    return string(b);
	}

	struct personalInfo
	{
		uint typeCustomer;	// 3 for Creator,1 for individual and 2 for Company
		bytes32[] BoughtMediaName;
		bytes32[] BoughtMediaEncryptedUrl;
	}

	uint public totalShares; //represents total shares of any media


    address ownerAddress;

	media[] public mediaList;
	mapping (address => personalInfo) public personalInfoList;
	mapping (bytes32 => uint) public indexOfMedia;
	

	function assignRole(uint assignedType,address currAddress) public
	{
		// if(msg.sender!=ownerAddress)
		// {
		// 	emit Status(101);
		// 	//You are not the owner who can assign roles! Back Off dude!
		// 	return;
		// }
		require(msg.sender==ownerAddress);
		personalInfoList[currAddress].typeCustomer=assignedType;

	} 

	function Spotify(uint totalSharesForAnyMedia) public 
	{
    	totalShares = totalSharesForAnyMedia;
    	ownerAddress=msg.sender;
  	}


  	function createMedia(address[] stakeHoldersAddresses,uint[] stakeHoldersShares, bytes32 mediaName, uint compCost, uint indCost) public
  	{

  		uint sharesOfOtherUsers = 0;
  		for(uint i = 0; i < stakeHoldersShares.length; i++) 
  		{
      		sharesOfOtherUsers += stakeHoldersShares[i];
    	}
    	// creator can't have negative shares
    	require(sharesOfOtherUsers <= totalShares);

    	// fooStruct myStruct = fooStruct({foo:1, fighter:2});
    	
    	//make Stake Numbers List
    	uint[] memory sharesPerPersonTemp= new uint[]((stakeHoldersShares.length+1));
    	sharesPerPersonTemp[0]=(totalShares-sharesOfOtherUsers);
    	
    	for(uint j = 0; j < stakeHoldersShares.length; j++) 
  		{
  			sharesPerPersonTemp[j+1]=(stakeHoldersShares[j]);
    	}

    	//Make Stake Holder Address List
    	address[] memory stakeHoldersAddressesTemp= new address[]((stakeHoldersShares.length+1));
    	stakeHoldersAddressesTemp[0]=(msg.sender);
    	for(uint k = 0; k < stakeHoldersAddresses.length; k++) 
  		{
  			stakeHoldersAddressesTemp[k+1]=(stakeHoldersAddresses[k]);
    	}

    	//todo: Use Public Key
    	media memory myStruct = media({NameOfMedia:mediaName, individualCost:indCost,CompanyCost:compCost ,
    	 stakeHolders:stakeHoldersAddressesTemp, sharesPerPerson: sharesPerPersonTemp, encryptedUrl:mediaName });

    	indexOfMedia[mediaName]=mediaList.length;

    	mediaList.push(myStruct);
  	}

  	

  	function buyMedia(bytes32 mediaWantToBuy) payable public
  	{
  		//msg.sender wants to buy
  		
  		//Check if already Bought??
  		uint foundInBought=(100);
  		bytes32[] memory alreadyBoughtMedia=personalInfoList[msg.sender].BoughtMediaName;
  		for(uint j=0;j< alreadyBoughtMedia.length;j++)
  		{
  			if(alreadyBoughtMedia[j]==mediaWantToBuy)
  			{
  				foundInBought=1;
  				break;
  			}
  		}
  		require(foundInBought==(100));

  		//Check if Media with this name exists
  		uint mediaExists=(100);
  		for(uint k=0;k< mediaList.length;k++)
  		{
  			if(mediaList[k].NameOfMedia==mediaWantToBuy)
  			{
  				mediaExists=1;
  				break;
  			}
  		}
  		require(mediaExists==(1));

  		uint buyerType=getType(msg.sender);
  		//buyer should be a consumer
  		require(buyerType!=3);



  		uint mediaIndex= indexOfMedia[mediaWantToBuy];


  		uint amountPaid=msg.value;
  		//send exact amount, don't want no tips!
  		uint costForBuyer=mediaList[mediaIndex].individualCost*(10**18);
  		if(buyerType==2)
  		{
  			costForBuyer=mediaList[mediaIndex].CompanyCost*(10**18);
  		}
  		require(costForBuyer<=amountPaid);
  		// if(costForBuyer>amountPaid)
  		// {
  		// 	emit Status(102);//Paid Less Money, You Thief!
  		// }
  		// if(costForBuyer==amountPaid)
  		// {
  		// 	emit Status(103);//Paid Equal Money! -_-
  		// }
  		// if(costForBuyer<amountPaid)
  		// {
  		// 	emit Status(104);//Paid More Money! You Richie Rich! :)
  		// }

  		
  		distributeMoney(mediaWantToBuy);

  		personalInfoList[msg.sender].BoughtMediaName.push(mediaWantToBuy);
  		//todo: Change This and get by adding a function
  		personalInfoList[msg.sender].BoughtMediaEncryptedUrl.push(mediaList[mediaIndex].encryptedUrl);
  	}


  	function distributeMoney(bytes32 mediaName) public 
  	{
  		address myAddress = this;
    	uint moneyLeft=myAddress.balance;
    	uint amountPaid=myAddress.balance;
    	uint mediaIndex= indexOfMedia[mediaName];
    	for(uint i=0; i<mediaList[mediaIndex].sharesPerPerson.length;i++)
  		{
  			uint currFraction=mediaList[mediaIndex].sharesPerPerson[i];
  			uint fracMoney=((amountPaid*currFraction)/totalShares);
  			moneyLeft-=fracMoney;
  			mediaList[mediaIndex].stakeHolders[i].transfer(fracMoney);
  		}
  		mediaList[mediaIndex].stakeHolders[0].transfer(moneyLeft);
  	}

  	function mediaAvailableToBuy(address currAddress) view public returns (bytes32[])
  	{
  		//Creator Can't Buy Anything
  		if(personalInfoList[currAddress].typeCustomer==3)
  		{
  			bytes32[] memory ansListEmpty;
  			return ansListEmpty;
  		}
  		bytes32[] memory ansList=new bytes32[](mediaList.length-personalInfoList[currAddress].BoughtMediaName.length);
  		uint counterVar=0;
  		for(uint i = 0; i < mediaList.length; i++) 
  		{
  			uint found=(100);
      		for(uint j=0;j< personalInfoList[currAddress].BoughtMediaName.length;j++)
      		{
      			if(personalInfoList[currAddress].BoughtMediaName[j]==mediaList[i].NameOfMedia)
      			{
      				found=1;
      				break;
      			}
      		}
      		if(found==(100))
      		{
      			ansList[counterVar]=(mediaList[i].NameOfMedia);
      			counterVar+=1;
      		}
    	}
    	return ansList;
  	}

  	function mediaAvailableOnPlatform(address currAddress) view public returns (bytes32[])
  	{
  		//Creator Can only call this!
  		require(personalInfoList[msg.sender].typeCustomer==3);
  		bytes32[] memory ansList=new bytes32[](mediaList.length);
  		uint counterVar=0;
  		for(uint i = 0; i < mediaList.length; i++) 
  		{
      			ansList[counterVar]=(mediaList[i].NameOfMedia);
      			counterVar+=1;
    	}
    	return ansList;
  	}

  	function getPersonalInformation(address currAddress) view public returns(uint,bytes32[],bytes32[])
  	{
  		return(personalInfoList[currAddress].typeCustomer,personalInfoList[currAddress].BoughtMediaName,
  			personalInfoList[currAddress].BoughtMediaEncryptedUrl);
  	}

  	function getMediaInformation(bytes32 currName) view public returns(bytes32,uint,uint,address[],uint[],bytes32 encryptedUrl)
  	{
  		//Check if Media with this name exists
  		uint mediaExists=(100);
  		for(uint k=0;k< mediaList.length;k++)
  		{
  			if(mediaList[k].NameOfMedia==currName)
  			{
  				mediaExists=1;
  				break;
  			}
  		}
  		require(mediaExists==(1));

  		uint indexC=indexOfMedia[currName];
  		return (mediaList[indexC].NameOfMedia,mediaList[indexC].individualCost,mediaList[indexC].CompanyCost,
  			mediaList[indexC].stakeHolders,mediaList[indexC].sharesPerPerson,mediaList[indexC].encryptedUrl);
  	}

  	function showBoughtMedia(address currAddress) view public returns (bytes32[])
  	{
  		//Creator Can't Buy Anything
  		if(personalInfoList[currAddress].typeCustomer==3)
  		{
  			bytes32[] memory ansList;
  			return ansList;
  		}
  		return personalInfoList[currAddress].BoughtMediaName;
  	}

  	function getTypeSender() view public returns (uint)
  	{
    	return personalInfoList[msg.sender].typeCustomer;
  	}

  	function getType(address currAddress) view public returns (uint)
  	{
  		return personalInfoList[currAddress].typeCustomer;
  	}

  	function getIndexOfMedia(bytes32 mediaName) view public returns (uint) 
  	{
    	return (indexOfMedia[mediaName]);
  	}

}