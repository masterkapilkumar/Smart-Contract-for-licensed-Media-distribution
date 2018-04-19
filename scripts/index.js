
var accounts;
var contractInstance;
var currentAccount = 0;
var web3;
var total_stakeholders = 0;
var user_types = {}

function connect() {
	web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
	abiDefinition = JSON.parse('[{"constant":true,"inputs":[{"name":"mediaName","type":"bytes32"}],"name":"getMyPurchasedMediaURL","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"bytes32"}],"name":"indexOfMedia","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"mediaAvailableToBuy","outputs":[{"name":"","type":"bytes32[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"myPubKey","type":"bytes32"}],"name":"addMyPublicKey","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"stakeHoldersAddresses","type":"address[]"},{"name":"stakeHoldersShares","type":"uint256[]"},{"name":"mediaName","type":"bytes32"},{"name":"compCost","type":"uint256"},{"name":"indCost","type":"uint256"},{"name":"encryptedURLwithCreatorPublicKeyArg","type":"bytes32"}],"name":"createMedia","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalShares","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"bytes32"}],"name":"doesMediaExists","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"currName","type":"bytes32"}],"name":"getMediaInformation","outputs":[{"name":"","type":"bytes32"},{"name":"","type":"uint256"},{"name":"","type":"uint256"},{"name":"","type":"address[]"},{"name":"","type":"uint256[]"},{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"showBoughtMedia","outputs":[{"name":"","type":"bytes32[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"assignedType","type":"uint256"},{"name":"currAddress","type":"address"}],"name":"assignRole","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"currAddr","type":"address"}],"name":"getPublicKey","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"publicKeyHash","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"mediaName","type":"bytes32"}],"name":"doesMediaExistsFunc","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"mediaName","type":"bytes32"}],"name":"getIndexOfMedia","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"mediaList","outputs":[{"name":"NameOfMedia","type":"bytes32"},{"name":"individualCost","type":"uint256"},{"name":"CompanyCost","type":"uint256"},{"name":"encryptedURLwithCreatorPublicKey","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"purEncryptUrl","type":"bytes32"},{"name":"nameMedia","type":"bytes32"},{"name":"purchaser","type":"address"}],"name":"creatorAddPurchasedURL","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"mediaAvailableOnPlatform","outputs":[{"name":"","type":"bytes32[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getTypeSender","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"mediaWantToBuy","type":"bytes32"}],"name":"buyMedia","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"personalInfoList","outputs":[{"name":"typeCustomer","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"currAddress","type":"address"}],"name":"getType","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getPersonalInformation","outputs":[{"name":"","type":"uint256"},{"name":"","type":"bytes32[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"mediaName","type":"bytes32"}],"name":"distributeMoney","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[{"name":"totalSharesForAnyMedia","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"statusCode","type":"uint256"}],"name":"Status","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"mediaName","type":"bytes32"},{"indexed":false,"name":"creator","type":"address"},{"indexed":false,"name":"consumer","type":"address"}],"name":"wantsToBuy","type":"event"}]')
	SpotifyContract = web3.eth.contract(abiDefinition);
	contractInstance = SpotifyContract.at("0xd40aea513dfe6f86dacbccc8bb221f091e847978");
	// contractInstance = SpotifyContract.at($("#address").val());

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
					media_list += "<div style=\"margin:10px;\">Name: "+media_trimmed+"<br>Individual Cost: "+media_info[1]['c'][0]+"<br>Company Cost: "+media_info[2]['c'][0]+"<br>Url: "+media_info[5]+"</div>"
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
			media_list += "<div style=\"margin:10px;\">Name: "+media_trimmed+"<br>Cost: "+media_info[parseInt(acc_type)]['c'][0]+"<br>Url: "+media_info[5]+"</div>"
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
			media_list += "<div style=\"margin:10px;\">Name: "+media_trimmed+"<br>Cost: "+media_info[parseInt(acc_type)]['c'][0]+"<br>Url: "+media_info[5]+"</div>"
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
	
	contractInstance.createMedia(stakeholders,shares,media_name,company_cost,individual_cost, url,{from:web3.eth.accounts[currentAccount],gas: 900000});
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
	if(acc_type=='1' || acc_type=='2') {
		cost=parseInt(media_info[parseInt(acc_type)]['c'][0]);
		// alert(media_name + "  " + currentAccount + "  " + cost);
		contractInstance.buyMedia(media_name,{from:web3.eth.accounts[currentAccount],value:web3.toWei(cost, 'ether'),gas: 900000})
		alert("Media bought Successfully.");
	}
	else {
		alert("Invalid User");
	}
	display_information();
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
