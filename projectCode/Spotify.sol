pragma solidity ^0.4.18; //We have to specify what version of the compiler this code will use

contract Spotify
{

	//make this indexed? Why?
	event Status(uint statusCode);

	event wantsToBuy(bytes32 mediaName, address creator, address consumer);

	struct media
	{
		bytes32 NameOfMedia;
		uint individualCost;
		uint CompanyCost;
		address[] stakeHolders; //creator is the stake holder at zero index
		uint[] sharesPerPerson;
		string encryptedURLwithCreatorPublicKey;
		mapping (address => string) encryptedurlforpurchasers;
	}

	modifier creatorOnly() 
	{
		require(personalInfoList[msg.sender].typeCustomer == 3);
		_;
	}

	modifier consumerOnly() 
	{
		require(personalInfoList[msg.sender].typeCustomer == 2 || personalInfoList[msg.sender].typeCustomer == 1);
		_;
	}

	modifier contractCreatorOnly() 
	{
		require(msg.sender == ownerAddress);
		_;
	}

	struct personalInfo
	{
		uint typeCustomer;	// 3 for Creator,1 for individual and 2 for Company
		bytes32[] BoughtMediaName;
	}

	uint public totalShares; // represents total shares of any media
    address ownerAddress;	// One who deployed this contract
	media[] public mediaList;	// List of Information
	mapping (address => personalInfo) public personalInfoList;	// mapping of personalInfo struct which stores type of customer and list of her purchased media 
	mapping (bytes32 => uint) public indexOfMedia;	// index of a Media in the List
	mapping (bytes32 => bool) public doesMediaExists;
	mapping (address => bytes32) public publicKeyHash;	// hash for getting publicKeyHash from address of a person
	

	function addMyPublicKey(bytes32 myPubKey) public 
	{
		publicKeyHash[msg.sender]=myPubKey;
	}

	function doesMediaExistsFunc(bytes32 mediaName) view public returns (bool)
	{
		return doesMediaExists[mediaName];
	}
	

	function creatorAddPurchasedURL(string purEncryptUrl, bytes32 nameMedia, address purchaser) public creatorOnly
	{
		//Check if Media with this name exists
		require(doesMediaExistsFunc(nameMedia)==true);

		//check if msg.sender is creator!
		require(mediaList[indexOfMedia[nameMedia]].stakeHolders[0]==msg.sender);

		//send the media!
		mediaList[indexOfMedia[nameMedia]].encryptedurlforpurchasers[purchaser]=purEncryptUrl;

	}

	function assignRole(uint assignedType,address currAddress) public contractCreatorOnly
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

	//Constructor
	function Spotify(uint totalSharesForAnyMedia) public 
	{
    	totalShares = totalSharesForAnyMedia;
    	ownerAddress=msg.sender;
  	}

  	function createMedia(address[] stakeHoldersAddresses,uint[] stakeHoldersShares, 
  		bytes32 mediaName, uint compCost, uint indCost,
  		string encryptedURLwithCreatorPublicKeyArg) public creatorOnly
  	{
  		//Such a Media Name should not exist
  		require(doesMediaExistsFunc(mediaName)==false);
  		//length should be the same obviously!
  		require(stakeHoldersAddresses.length==stakeHoldersShares.length);
  		//length should be less than 5 as mentioned in assignment statement
  		require(stakeHoldersAddresses.length<6);

  		uint sharesOfOtherUsers = 0;
  		for(uint i = 0; i < stakeHoldersShares.length; i++) 
  		{
      		sharesOfOtherUsers += stakeHoldersShares[i];
    	}
    	// creator can't have negative shares
    	require(sharesOfOtherUsers <= totalShares);
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
    	media memory myStruct = media({NameOfMedia:mediaName, individualCost:indCost,CompanyCost:compCost ,
    	 stakeHolders:stakeHoldersAddressesTemp, sharesPerPerson: sharesPerPersonTemp, encryptedURLwithCreatorPublicKey:encryptedURLwithCreatorPublicKeyArg });

    	indexOfMedia[mediaName]=mediaList.length;
    	doesMediaExists[mediaName]=true;
    	mediaList.push(myStruct);
  	}

  	function buyMedia(bytes32 mediaWantToBuy) payable public consumerOnly
  	{
  		//msg.sender wants to buy
  		
  		//Check if Media with this name exists
  		require(doesMediaExistsFunc(mediaWantToBuy)==true);
  		
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

  		uint buyerType=getType(msg.sender);

  		uint mediaIndex= indexOfMedia[mediaWantToBuy];

  		uint amountPaid=msg.value;
  		uint costForBuyer=mediaList[mediaIndex].individualCost*(10**18);
  		if(buyerType==2)
  		{
  			costForBuyer=mediaList[mediaIndex].CompanyCost*(10**18);
  		}
  		require(costForBuyer<=amountPaid);
  		
  		distributeMoney(mediaWantToBuy);

  		emit wantsToBuy(mediaWantToBuy, mediaList[indexOfMedia[mediaWantToBuy]].stakeHolders[0], msg.sender);
  		
  		personalInfoList[msg.sender].BoughtMediaName.push(mediaWantToBuy);
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

  	function getPublicKey(address currAddr) view public returns (bytes32)
	{
		return publicKeyHash[currAddr];
	}

  	function mediaAvailableToBuy() view public returns (bytes32[])
  	{
  		//Creator Can't Buy Anything
  		if(personalInfoList[msg.sender].typeCustomer==3)
  		{
  			bytes32[] memory ansListEmpty;
  			return ansListEmpty;
  		}
  		bytes32[] memory ansList=new bytes32[](mediaList.length-personalInfoList[msg.sender].BoughtMediaName.length);
  		uint counterVar=0;
  		for(uint i = 0; i < mediaList.length; i++) 
  		{
  			uint found=(100);
      		for(uint j=0;j< personalInfoList[msg.sender].BoughtMediaName.length;j++)
      		{
      			if(personalInfoList[msg.sender].BoughtMediaName[j]==mediaList[i].NameOfMedia)
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

  	function mediaAvailableOnPlatform() view public creatorOnly returns (bytes32[])
  	{
  		//Creators only can call this!
  		bytes32[] memory ansList=new bytes32[](mediaList.length);
  		uint counterVar=0;
  		for(uint i = 0; i < mediaList.length; i++) 
  		{
      			ansList[counterVar]=(mediaList[i].NameOfMedia);
      			counterVar+=1;
    	}
    	return ansList;
  	}

  	function getPersonalInformation() view public returns(uint,bytes32[])
  	{
  		return(personalInfoList[msg.sender].typeCustomer,personalInfoList[msg.sender].BoughtMediaName);
  	}

  	function getMediaInformation(bytes32 currName) view public returns(bytes32,uint,uint,address[],uint[],string )
  	{
  		//media Should Exist!
  		require(doesMediaExistsFunc(currName)==true);

  		uint indexC=indexOfMedia[currName];
  		return (mediaList[indexC].NameOfMedia,mediaList[indexC].individualCost,mediaList[indexC].CompanyCost,
  			mediaList[indexC].stakeHolders,mediaList[indexC].sharesPerPerson,mediaList[indexC].encryptedURLwithCreatorPublicKey);
  	}

  	function showBoughtMedia() view public returns (bytes32[])
  	{
  		//Creator Can't Buy Anything
  		if(personalInfoList[msg.sender].typeCustomer==3)
  		{
  			bytes32[] memory ansList;
  			return ansList;
  		}
  		return personalInfoList[msg.sender].BoughtMediaName;
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

  	function getMyPurchasedMediaURL(bytes32 mediaName) view public returns (string)
	{
		//Check if Media with this name exists
  		require(doesMediaExistsFunc(mediaName)==true);
		return mediaList[indexOfMedia[mediaName]].encryptedurlforpurchasers[msg.sender];
	}

}