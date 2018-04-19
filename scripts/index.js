
var accounts;
var contractInstance;
var currentAccount = 0;
var web3;
var total_stakeholders = 0;
var user_types = {}
var private_keys = []
var public_keys = []

function connect() {
	web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
	abiDefinition = JSON.parse('[{"constant":true,"inputs":[{"name":"mediaName","type":"bytes32"}],"name":"getMyPurchasedMediaURL","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"bytes32"}],"name":"indexOfMedia","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"stakeHoldersAddresses","type":"address[]"},{"name":"stakeHoldersShares","type":"uint256[]"},{"name":"mediaName","type":"bytes32"},{"name":"compCost","type":"uint256"},{"name":"indCost","type":"uint256"},{"name":"encryptedURLwithCreatorPublicKeyArg","type":"string"}],"name":"createMedia","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"mediaAvailableToBuy","outputs":[{"name":"","type":"bytes32[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"myPubKey","type":"bytes32"}],"name":"addMyPublicKey","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalShares","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"bytes32"}],"name":"doesMediaExists","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"currName","type":"bytes32"}],"name":"getMediaInformation","outputs":[{"name":"","type":"bytes32"},{"name":"","type":"uint256"},{"name":"","type":"uint256"},{"name":"","type":"address[]"},{"name":"","type":"uint256[]"},{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"showBoughtMedia","outputs":[{"name":"","type":"bytes32[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"assignedType","type":"uint256"},{"name":"currAddress","type":"address"}],"name":"assignRole","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"currAddr","type":"address"}],"name":"getPublicKey","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"publicKeyHash","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"mediaName","type":"bytes32"}],"name":"doesMediaExistsFunc","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"mediaName","type":"bytes32"}],"name":"getIndexOfMedia","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"mediaList","outputs":[{"name":"NameOfMedia","type":"bytes32"},{"name":"individualCost","type":"uint256"},{"name":"CompanyCost","type":"uint256"},{"name":"encryptedURLwithCreatorPublicKey","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"purEncryptUrl","type":"string"},{"name":"nameMedia","type":"bytes32"},{"name":"purchaser","type":"address"}],"name":"creatorAddPurchasedURL","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"mediaAvailableOnPlatform","outputs":[{"name":"","type":"bytes32[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getTypeSender","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"mediaWantToBuy","type":"bytes32"}],"name":"buyMedia","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"personalInfoList","outputs":[{"name":"typeCustomer","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"currAddress","type":"address"}],"name":"getType","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getPersonalInformation","outputs":[{"name":"","type":"uint256"},{"name":"","type":"bytes32[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"mediaName","type":"bytes32"}],"name":"distributeMoney","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[{"name":"totalSharesForAnyMedia","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"statusCode","type":"uint256"}],"name":"Status","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"mediaName","type":"bytes32"},{"indexed":false,"name":"creator","type":"address"},{"indexed":false,"name":"consumer","type":"address"}],"name":"wantsToBuy","type":"event"}]')
	SpotifyContract = web3.eth.contract(abiDefinition);
	contractInstance = SpotifyContract.at("0x3ded7d9bee5b46c1bf57f0a2321547394033bd21");
	// contractInstance = SpotifyContract.at($("#address").val());
	bitcore = require('bitcore-lib');
	ecies = require('bitcore-ecies');
	
	accounts = web3.eth.accounts;
	
	
	//assign creator(3) role to 0,1,2,3 
	contractInstance.assignRole(3,accounts[0],{from:web3.eth.accounts[0],gas:900000})
	contractInstance.assignRole(3,accounts[1],{from:web3.eth.accounts[0],gas:900000})
	contractInstance.assignRole(3,accounts[2],{from:web3.eth.accounts[0],gas:900000})
	contractInstance.assignRole(3,accounts[3],{from:web3.eth.accounts[0],gas:900000})
	//assign individual(1) role to 4,5,6,7
	contractInstance.assignRole(1,accounts[4],{from:web3.eth.accounts[0],gas:900000})
	contractInstance.assignRole(1,accounts[5],{from:web3.eth.accounts[0],gas:900000})
	contractInstance.assignRole(1,accounts[6],{from:web3.eth.accounts[0],gas:900000})
	contractInstance.assignRole(1,accounts[7],{from:web3.eth.accounts[0],gas:900000})
	//assign company(2) role to 8,9
	contractInstance.assignRole(2,accounts[8],{from:web3.eth.accounts[0],gas:900000})
	contractInstance.assignRole(2,accounts[9],{from:web3.eth.accounts[0],gas:900000})
	
	private_keys[0] = new bitcore.PrivateKey('f62eba8db33a5953298013bb49feffdeba4c9efe5859e8a38923bbe0e1b043ae');
	private_keys[1] = new bitcore.PrivateKey('40603268b53379c36f0618ec0945713165870060a18897d35d5a0c75be1f5a89');
	private_keys[2] = new bitcore.PrivateKey('0033a032b926e3a1a20d6c8e3015e8a3c3fc8eb37e061d1097f333532bf114fb');
	private_keys[3] = new bitcore.PrivateKey('79bd1cf491fb9158012e619cc55a5fa8170fbc738496a3c84f4b1a7c18dfd434');
	private_keys[4] = new bitcore.PrivateKey('9592afa29228116bd1d37b4d4636606eb403e57e72217fb6c4e8e75867f0b231');
	private_keys[5] = new bitcore.PrivateKey('8caad55e18d33b37b7d695ecc51d7a11448c3f4501c3097b37b5b08f0c293b37');
	private_keys[6] = new bitcore.PrivateKey('948fdccab8db00334479342214e5940c89add326cd4e50e69af4bfeb9048a1db');
	private_keys[7] = new bitcore.PrivateKey('4c5a461724c455b9c27a24fe5763bbfacd25bcf42b66c1b399b311a30ad80444');
	private_keys[8] = new bitcore.PrivateKey('d7a81513a1765c97bf3ff7c64cff038eec70f6c46661cd42d3035b7163b7c2e4');
	private_keys[9] = new bitcore.PrivateKey('324717001660251b8bcb028b21e11a0038f07e0ab26419fe8b4034bfd3123409');
	
	for(var i=0; i<10; i++) {
		public_keys[i] = bitcore.PublicKey(private_keys[i])
	}
	
	$('#status').css({"color":"green"});
	$("#status").text("Connected");
	
	var add_options = '';
	var creators = 0;
	var indiv_consum = 0;
	var company_consum = 0;
	for(var i=0; i<10; i++) {
		acc_type = contractInstance.getType(web3.eth.accounts[i],{from:web3.eth.accounts[0],gas:900000})
		if(acc_type=="3") {
			add_options += '<option value="'+(i+1)+'">Creator '+(creators+1)+'</option>';
			creators++;
		}
		else if(acc_type=="1") {
			add_options += '<option value="'+(i+1)+'">Individual Consumer '+(indiv_consum+1)+'</option>';
			indiv_consum++;
		}
		else if(acc_type=="2") {
			add_options += '<option value="'+(i+1)+'">Company Consumer '+(company_consum+1)+'</option>';
			company_consum++;
		}
	}
	$('#user_type').html(add_options);
	
	$('#login').removeAttr('disabled');
	
}

function initListeners() {
	//set buy event listener
	var buyEvent = contractInstance.wantsToBuy();
	buyEvent.watch(function(error, result) {
		if (!error) {
			var media_name = result.args.mediaName;
			var creator = result.args.creator;
			var consumer = result.args.consumer;
			var encrypted_url = contractInstance.getMediaInformation(media_name,{from:web3.eth.accounts[currentAccount],gas: 900000})[5];
			var urlBuffer = new bitcore.deps.Buffer(encrypted_url, 'hex');
			// console.log(accounts.indexOf(creator) + "\n"+accounts.indexOf(consumer)+'\n'+private_keys[accounts.indexOf(creator)]+'\n'+urlBuffer+'\n'+encrypted_url);
			var decrypted_url = ecies().privateKey(private_keys[accounts.indexOf(creator)]).decrypt(urlBuffer);
			// console.log(decrypted_url.toString('ascii'));
			encrypted_url = ecies().privateKey(private_keys[accounts.indexOf(consumer)]).publicKey(public_keys[accounts.indexOf(consumer)]).encrypt(decrypted_url);
			encrypted_url = encrypted_url.toString('hex');
			console.log(encrypted_url);
			
			contractInstance.creatorAddPurchasedURL(encrypted_url,media_name,consumer,{from:creator,gas: 900000})
		} else {
			alert("Error in buy listener");
		}
	});
}

function display_information() {
	$('#logged_in').text("Logged in as: "+accounts[currentAccount]);
	$('#balance').text(parseFloat(web3.fromWei(web3.eth.getBalance(web3.eth.accounts[currentAccount]))));
	var acc_type = contractInstance.getPersonalInformation({from:web3.eth.accounts[currentAccount],gas:900000})[0]['c'][0];
	if(acc_type=='3') {
		var medias = contractInstance.mediaAvailableOnPlatform({from:web3.eth.accounts[currentAccount],gas: 900000});
		if(medias.length >0) {
			media_list = ""
			for(var i=0; i<medias.length; i++) {
				media = web3.toAscii(medias[i]);
				media_info = contractInstance.getMediaInformation(media,{from:web3.eth.accounts[currentAccount],gas: 900000})
				if(media_info[3][0]==accounts[currentAccount]) {
					media_trimmed = media.replace(/\0/g, '')
					media_list += "<div style=\"margin:10px;\">Name: "+media_trimmed+"<br>Individual Cost: "+media_info[1]['c'][0]+"<br>Company Cost: "+media_info[2]['c'][0]+"<br>Encrypted Url: "+media_info[5]+"</div>"
				}
			}
			if(media_list=='')
				media_list = "None";
			$('#media_data').html(media_list);
		}
	}
	else if(acc_type=='1' || acc_type=='2') {
		//media bought
		var medias = contractInstance.showBoughtMedia({from:web3.eth.accounts[currentAccount],gas: 900000})
		media_list = ""
		for(var i=0; i<medias.length; i++) {
			media = web3.toAscii(medias[i]);
			media_trimmed = media.replace(/\0/g, '');
			media_info = contractInstance.getMediaInformation(media,{from:web3.eth.accounts[currentAccount],gas: 900000});
			my_media_url = contractInstance.getMyPurchasedMediaURL(media,{from:web3.eth.accounts[currentAccount],gas: 900000})
			console.log('kk'+my_media_url)
			var urlBuffer = new bitcore.deps.Buffer(my_media_url, 'hex');
			var decrypted_url = ecies().privateKey(private_keys[currentAccount]).decrypt(urlBuffer).toString('ascii');
			media_list += "<div style=\"margin:10px;\">Name: "+media_trimmed+"<br>Cost: "+media_info[parseInt(acc_type)]['c'][0]+"<br>Url: "+decrypted_url+"</div>"
		}
		if(media_list=='')
			media_list = "None";
		$('#media_bought').html(media_list);
		
		var medias = contractInstance.mediaAvailableToBuy({from:web3.eth.accounts[currentAccount],gas: 900000});
		//media available
		media_list = ""
		for(var i=0; i<medias.length; i++) {
			media = web3.toAscii(medias[i]);
			media_trimmed = media.replace(/\0/g, '');
			media_info = contractInstance.getMediaInformation(media,{from:web3.eth.accounts[currentAccount],gas: 900000});
			media_list += "<div style=\"margin:10px;\">Name: "+media_trimmed+"<br>Cost: "+media_info[parseInt(acc_type)]['c'][0]+"<br>Encrypted Url: "+media_info[5]+"</div>"
		}
		if(media_list=='')
			media_list = "None";
		$('#media_data_available').html(media_list);
	}
	else {
		alert("Invalid user");
	}
	
}

$('#user_type').on('click',function() {
	if( $("#status").text() == "Connected") {
		selected_user = $(this).val();
		$("#user_num").val(selected_user);
		acc_type = contractInstance.getType(web3.eth.accounts[selected_user-1],{from:web3.eth.accounts[0],gas:900000})
		if(acc_type=='1' || acc_type=='2') {
			$('#account_form').attr('action', 'consumer.html')
		}
		else if(acc_type=='3') {
			$('#account_form').attr('action', 'creator.html')
		}
		else {
			alert("Invalid User");
		}
	}
	
	
});

function create_media() {
	var media_name = $("#media_name").val();
	var stakeholders = [];
	for(var i=0; i<total_stakeholders; i++) {
		stakeholders.push(web3.eth.accounts[parseInt($("#stake_name"+i).val())-1]);
	}
	var shares = [];
	for(var i=0; i<total_stakeholders; i++) {
		shares.push($("#share_amount"+i).val());
	}
	
	var individual_cost = $("#indiv_cost").val();
	var company_cost = $("#company_cost").val();
	var url = $('#url').val();
	// url_buffer= new bitcore.deps.Buffer(url, 'hex');
	
	var encrypted_url = ecies().privateKey(private_keys[currentAccount]).publicKey(public_keys[currentAccount]).encrypt(url);
	encrypted_url = encrypted_url.toString('hex');
	console.log(encrypted_url);
	
	contractInstance.createMedia(stakeholders,shares,media_name,company_cost,individual_cost, encrypted_url,{from:web3.eth.accounts[currentAccount],gas: 5000000});
	alert("Media created Successfully.");
	clear_stakeholders();
	total_stakeholders = 0;
	display_information();
}

function buy_media() {
	var media_name = $("#media_name").val();
	var media_info = contractInstance.getMediaInformation(media_name,{from:web3.eth.accounts[currentAccount],gas: 900000});
	var acc_type = contractInstance.getPersonalInformation({from:web3.eth.accounts[currentAccount],gas:900000})[0]['c'][0];
	var cost;
	var success=0;
	if(acc_type=='1' || acc_type=='2') {
		cost=parseInt(media_info[parseInt(acc_type)]['c'][0]);
		// alert(media_name + "  " + currentAccount + "  " + cost);
		contractInstance.buyMedia(media_name,{from:web3.eth.accounts[currentAccount],value:web3.toWei(cost, 'ether'),gas: 900000})
		success=1;
	}
	else {
		alert("Invalid User");
	}
	if(success==1)
		setTimeout(function(){alert("Media bought Successfully."); display_information();},2000);
}


function clear_stakeholders() {
	for(var i=0; i<total_stakeholders; i++) {
		$("#stake"+i).remove();
	}
	total_stakeholders = 0;
}

function create_stakeholder_field() {
	var add_options = '';
	var creators = 0;
	for(var i=0; i<10; i++) {
		var acc_type = contractInstance.getType(web3.eth.accounts[i],{from:web3.eth.accounts[0],gas:900000});
		if(acc_type=="3") {
			add_options += '<option value="'+(i+1)+'">Creator '+(creators+1)+'</option>';
			creators++;
		}
	}
	
	$("<div id=\"stake"+ total_stakeholders +"\" style=\"margin-bottom:6px;\"><span> \
		<b>Stakeholder "+(total_stakeholders+1)+":  </b></span> \
		<select id=\"stake_name"+ total_stakeholders +"\" class=\"form-control\" style=\"width:auto; display:inline\">"+add_options+"</select>\
		<b>Share: </b><input type=\"text\" placeholder=\"Share amount\" id=\"share_amount"+total_stakeholders+"\"> \
		</div>").insertBefore($("#create_media_button"));
	total_stakeholders++;
}
