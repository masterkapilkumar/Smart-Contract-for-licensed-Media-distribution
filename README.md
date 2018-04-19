# Smart-Contract-for-licensed-Media-distribution
## For Running Code
Soldity contract named Spotify is in **projectCode/Spotify.sol**.  
Unit tests were run on Nodejs Command line, tests are provided in **projectCode/codeInWeb3.txt**.
Deploying constructor takes a uint as argument which is basically total number of shares in a song.  
Creator is put at zero index in the shareHolders List of a Song.  
Shares of Creator are kept so as to make total shares sum as 1000.  


## Lines to be run on Web3 before starting UI  
Web3 = require('web3')  
web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));  
web3.eth.accounts  
code = fs.readFileSync('projectCode/Spotify.sol').toString()  
solc = require('solc')  
compiledCode = solc.compile(code)  
abiDefinition = JSON.parse(compiledCode.contracts[':Spotify'].interface)  
SpotifyContract = web3.eth.contract(abiDefinition)  
byteCode = compiledCode.contracts[':Spotify'].bytecode  
deployedContract = SpotifyContract.new( 1000 ,{data: byteCode, from: web3.eth.accounts[0], gas: 4700000})  
deployedContract.address  
contractInstance = SpotifyContract.at(deployedContract.address)  




## Assignment Information
**The above code can be run on ganache local server and can also be deployed to testnet. The backend is fully secure and can be deployed as a smart contract considering the honest Creators.** 


1. Every user in the contract can act as a Creator or a Consumer.Two types of consumers are available: Individual or Company (You can randomly choose a consumer to be an Individual consumer or a Company ). Only creator should be able to add an entry for the licensed media.

**Any User can only be This is implemented in our code using assignRole() function and this role assignment can only be done by the deployer of the contract. In real life, he may get requests and assign roles to users accordingly.Yes, A Modifier check has been written in createMedia function for checking that only creator can add media.**

3. A creator should be able to add a licensed media to the contract (You have to come up with an appropriate data structure to represent a media in the contract.). The exact url of media should not be added to the contract. The creator should also set the cost for the media license for individual and Company as consumers.The media or media url is not accessible by the consumers until they pay for the license.

**Yes, Creator can add a licensed Media. He can also set the cost of Media for Indvidual and Company. A struct for media is created which contains Name of Media, individual Cost, Company Cost. An enccrypted URL using owns public key, which only creator can decrypt(off-chain), also exists. He may or may not wish to update this.**

4. The consumers should be able to view all the media entries available to buy. Whenever a consumer wants to buy some media, consumer should initiate a transaction, and contract should internally invoke a function to transfer the license amount to creator (and stakeholders discussed later). You should ensure that the amount paid for the license depends upon the type of consumer.The payment should be in Ether. (You would get to know how to add ether as you go
through the tutorials)

**Consumer can see media available to buy using function mediaAvailableToBuy(). The amount paid depends on the type of consumer and this check is also implemented in buyMedia() function where he/she can specify which media they wish to buy. They need to pay atleast as much amount as specified and can also send more money (as tip :p ). A function called distributeMoney() is made which transfers amounts to share holders accordingly. In case less money is sent, all the money is reverted back to sender and he isn't able to buy this media.**

5. Whenever a consumer buys any media, creator should create a new encrypted url (encrypted using consumers public key ) of the media. Encryption can’t be done on-chain. You have to find a method to do encryption/decryption off-chain. The creator
will add the encrypted url in the contract (assume creator to be honest). Now, for a consumer to access the media, he needs to decrypt the url and use it. Once paid for a particular media, a buy option should not appear for the consumer anymore, for that media.

**When creator creates a media, its url is encrypted using creators public key. When any consumer buys a media, an event gets fired which will invoke a listener in creator's account, listener will first decrypt the stored url using his own private key and then encrypt using buyers public key (which is publicly available to all) and then store it in media's mapping (this can only be done by that media's creator and that url is accessible to only buyer). We are using "bitcore-lib" library to generate public from private keys and "bitcore-ecies" to encrypt and decrypt url."**

6.The revenue obtained from the media license (by the creator) should be divided among other stakeholders(eg. Production company) of the media. (Number of stakeholders can range from 0 to maximum of 5). The creator should be able to specify the stakeholders and corresponding share of each stakeholder while creating the media entry. The division of revenue (generated from each media license buying / selling) among the stakeholders should happen on-chain by a contract function.

**distributeMoney() is the function which distributes revenue in accordance with shares. The shares need to be specified by creator while creating media. We have taken shares for any media to be 1000. So revenue is distributed at 0.1% precision. This distribution happens onchain as required.**

## Some Things Learnt
- Making a variable as memory or storage; memory variable disappear. Also we need to set the size of a memory variable beforehand  
- We can't initialize more than around 10 variables in a function as it starts giving stack too deep errors which can be removed using more functions  
- Usage of Pure, View  
- Usage of Public,Private  
- Usage of Modifiers makes checks better readable  
- Require reverts the function fully! Even in a payable function, its like a transaction in a database  
- mapping aren't iterable  
- events can be thrown for debugging and can be listened using some console.log() or by Javascript  
- We need to add gas for each function calling using web3js  
- Running "node_modules/.bin/ganache-cli" on one terminal runs a server, we get 10 unlocked accounts with 100 ethers each  
- using "node" on another terminal, we can make a web3 object which can listen to that port   
- msg.value gives money in Some lower unit(perhaps finney), which is 10^18 times an ether  
- Cant return a string of lists in Solidity, yet
- web3.toAscii() is helpful in reading byte32 Strings 
