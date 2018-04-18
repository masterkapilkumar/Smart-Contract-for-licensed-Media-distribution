# Smart-Contract-for-licensed-Media-distribution
## Running Code
Soldity contract named Spotify is in **projectCode/Spotify.sol**.  
Unit tests were run on Nodejs Command line, tests are provided in **projectCode/codeInWeb3.txt**.

## Assignment Information
**The above code can be run on ganache local server and can also be deployed to testnet. The backend is fully secure and can be deployed as a smart contract considering the honest Creators.** 


1. Every user in the contract can act as a Creator or a Consumer.Two types of consumers are available: Individual or Company (You can randomly choose a consumer to be an Individual consumer or a Company ). Only creator should be able to add an entry for the licensed media.

**Any User can only be This is implemented in our code using assignRole() function and this role assignment can only be done by the deployer of the contract. In real life, he may get requests and assign roles to users accordingly.Yes, A require check has been written in createMedia function for checking that only creator can add media.**

3. A creator should be able to add a licensed media to the contract (You have to come up with an appropriate data structure to represent a media in the contract.). The exact url of media should not be added to the contract. The creator should also set the cost for the media license for individual and Company as consumers.The media or media url is not accessible by the consumers until they pay for the license.

**Yes, Creator can add a licensed Media. He can also set the cost of Media for Indvidual and Company. A struct for media is created which contains Name of Media, individual Cost, Company Cost. An enccrypted URL using owns public key, which only creator can decrypt(off-chain), also exists. He may or may not wish to update this.**

4. The consumers should be able to view all the media entries available to buy. Whenever a consumer wants to buy some media, consumer should initiate a transaction, and contract should internally invoke a function to transfer the license amount to creator (and stakeholders discussed later). You should ensure that the amount paid for the license depends upon the type of consumer.The payment should be in Ether. (You would get to know how to add ether as you go
through the tutorials)

**Consumer can see media available to buy using function mediaAvailableToBuy(). The amount paid depends on the type of consumer and this check is also implemented in buyMedia() function where he/she can specify which media they wish to buy. They need to pay atleast as much amount as specified and can also send more money (as tip :p ). A function called distributeMoney() is made which transfers amounts to share holders accordingly. In case less money is sent, all the money is reverted back to sender and he isn't able to buy this media.**

5. Whenever a consumer buys any media, creator should create a new encrypted url (encrypted using consumers public key ) of the media. Encryption can’t be done on-chain. You have to find a method to do encryption/decryption off-chain. The creator
will add the encrypted url in the contract (assume creator to be honest). Now, for a consumer to access the media, he needs to decrypt the url and use it. Once paid for a particular media, a buy option should not appear for the consumer anymore, for that media.

**More about this soon**

6.The revenue obtained from the media license (by the creator) should be divided among other stakeholders(eg. Production company) of the media. (Number of stakeholders can range from 0 to maximum of 5). The creator should be able to specify the stakeholders and corresponding share of each stakeholder while creating the media entry. The division of revenue (generated from each media license buying / selling) among the stakeholders should happen on-chain by a contract function.

**distributeMoney() is the function which distributes revenue in accordance with shares. The shares need to be specified by creator while creating media. We have taken shares for any media to be 1000. So revenue is distributed at 0.1% precision. This distribution happens onchain as required.**

