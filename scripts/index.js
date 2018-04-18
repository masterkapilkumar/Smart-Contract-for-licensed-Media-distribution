
var accounts;
var contractInstance;
var currentAccount = 0;
var web3;
var total_stakeholders = 0;


function connect() {
	web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
	abiDefinition = JSON.parse('[{"constant":true,"inputs":[{"name":"","type":"bytes32"}],"name":"indexOfMedia","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"totalShares","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"stakeHoldersAddresses","type":"address[]"},{"name":"stakeHoldersShares","type":"uint256[]"},{"name":"mediaName","type":"bytes32"},{"name":"compCost","type":"uint256"},{"name":"indCost","type":"uint256"}],"name":"createMedia","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"currAddress","type":"address"}],"name":"showBoughtMedia","outputs":[{"name":"","type":"bytes32[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"currAddress","type":"address"}],"name":"getPersonalInformation","outputs":[{"name":"","type":"uint256"},{"name":"","type":"bytes32[]"},{"name":"","type":"bytes32[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"x","type":"address"}],"name":"toString","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"a","type":"address"}],"name":"toBytes","outputs":[{"name":"b","type":"bytes"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"b","type":"bytes"}],"name":"bytesToAddr","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"currName","type":"bytes32"}],"name":"getMediaInformation","outputs":[{"name":"","type":"bytes32"},{"name":"","type":"uint256"},{"name":"","type":"uint256"},{"name":"","type":"address[]"},{"name":"","type":"uint256[]"},{"name":"encryptedUrl","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"assignedType","type":"uint256"},{"name":"currAddress","type":"address"}],"name":"assignRole","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"currAddress","type":"address"}],"name":"mediaAvailableToBuy","outputs":[{"name":"","type":"bytes32[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"mediaName","type":"bytes32"}],"name":"getIndexOfMedia","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"mediaList","outputs":[{"name":"NameOfMedia","type":"bytes32"},{"name":"individualCost","type":"uint256"},{"name":"CompanyCost","type":"uint256"},{"name":"encryptedUrl","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"currAddress","type":"address"}],"name":"mediaAvailableOnPlatform","outputs":[{"name":"","type":"bytes32[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getTypeSender","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"mediaWantToBuy","type":"bytes32"}],"name":"buyMedia","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"personalInfoList","outputs":[{"name":"typeCustomer","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"currAddress","type":"address"}],"name":"getType","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"mediaName","type":"bytes32"}],"name":"distributeMoney","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[{"name":"totalSharesForAnyMedia","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"statusCode","type":"uint256"}],"name":"Status","type":"event"}]')
	SpotifyContract = web3.eth.contract(abiDefinition);
	contractInstance = SpotifyContract.at("0x327ceaf8e45550db6861e63e7a97a433039884c1");
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

function display_information(user_num) {
	currentAccount = user_num - 1;
	$('#logged_in').text("Logged in as: "+accounts[currentAccount]);
	$('#balance').text(parseFloat(web3.fromWei(web3.eth.getBalance(web3.eth.accounts[currentAccount]))));
	
	if(user_num<=4) {
		var medias = contractInstance.mediaAvailableOnPlatform(web3.eth.accounts[currentAccount],{from:web3.eth.accounts[currentAccount],gas: 900000});
		if(medias.length >0) {
			media_list = ""
			for(var i=0; i<medias.length-1; i++) {
				media = web3.toAscii(medias[i]);
				if(contractInstance.getMediaInformation(media,{from:web3.eth.accounts[currentAccount],gas: 900000})[3][0]==accounts[currentAccount]) {
					media_trimmed = media.replace(/\0/g, '')
					media_list += media_trimmed + ', ';
				}
			}
			var i = medias.length-1;
			media = web3.toAscii(medias[i]);
			if(contractInstance.getMediaInformation(media,{from:web3.eth.accounts[currentAccount],gas: 900000})[3][0]==accounts[currentAccount]) {
				media_trimmed = media.replace(/\0/g, '')
				media_list += media_trimmed;
			}
			if(media_list=='')
				media_list = "None";
			$('#media_data').text(media_list);
		}
	}
	else {
		var medias = contractInstance.mediaAvailableToBuy(web3.eth.accounts[currentAccount],{from:web3.eth.accounts[currentAccount],gas: 900000});
		alert(medias)
		if(medias.length >0) {
			media_list = ""
			for(var i=0; i<medias.length-1; i++) {
				media = web3.toAscii(medias[i]);
				media_trimmed = media.replace(/\0/g, '')
				media_list += media_trimmed + ', ';
			}
			media = web3.toAscii(medias[medias.length-1]);
			media_trimmed = media.replace(/\0/g, '')
			media_list += media_trimmed;
			if(media_list=='')
				media_list = "None";
			$('#media_data').text(media_list);
		}
	}
	
	
}

$('#user_type').on('click',function() {
	if( $("#status").text() == "Connected") {
		$("#user_num").val($(this).val());
		if(parseInt($(this).val())>4) {
			$('#account_form').attr('action', 'consumer.html')
			$("#CO_user_num").text($(this).val()-4);
		}
		else {
			$('#account_form').attr('action', 'creator.html')
			$("#CR_user_num").text($(this).val());
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
	
	contractInstance.createMedia(stakeholders,shares,media_name,company_cost,individual_cost,{from:web3.eth.accounts[currentAccount],gas: 900000});
	alert("Media created Successfully.");
	clear_stakeholders();
	total_stakeholders = 0;
	display_information(currentAccount+1);
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
		acc_type = contractInstance.getType(web3.eth.accounts[i],{from:web3.eth.accounts[0],gas:900000})
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

// $(document).ready(function() {
	// $(document).ready(function() {
		// $("#user_num").text(window.location.search.substr(6));
	// });
	// web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
	
// });
