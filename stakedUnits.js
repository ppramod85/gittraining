var materialExcel=[];
var consCompId;
var contractorId;
var exchangeId;
var listType;
var offset=1;
var limit=25;
var order=null;
var uploadId;
var contNmActl;
var caPrjId;
var contrTypeId;
var currentPrjId;
var matAjaxObj=null;
var matDeleteObj;
var checkAll=false;
function showAddConstructionCompany()
{
		
			$.ajax({
				  url: 'stakedUnit_addCompany',
				  cache: false,
				  data: {},
				  success: function(response) {
					  $('#popupbox').html(response);
					  showAddConstructionCompanyPopup();
				  }
				});
	
}
function showAddConstructionContractor(id)
{
			$.ajax({
				  url: 'stakedUnit_addContractor',
				  cache: false,
				  data: {inFrom:1},
				  success: function(response) {
					  $('#popupbox').html(response);
					  showAddContractorPopup(id);
				  }
				});
	
}
function showAddConstructionContractorList()
{

	order="CONTR_NM ASC";
			$.ajax({
				  url: 'getContractorsList',
				  cache: false,
				  data: {ivSearch:escapeSearchSplChar($('#searchConstructionContractor').val())||null,inOffset:offset,inLimit:999999,ivOrder:order,inFromSu:1},
				  success: function(response) {
					  $('#stakedUnitContractorsList').html(response);
				  }
				}); 
	
}
function showAddMaterial(id)
{
 	consCompId=$('div#pri_cmp_id').text();
 	contractorId=$('#'+id+'table.normal_table').attr("value");
 	exchangeId=$('div#exchange_id').text();
 	contrTypeId= $('#contrTypeId').val();
    currentPrjId= $('#staked_units_prj_id').val();
			$.ajax({
				  url: 'stakedUnit_addMaterialHome',
				  cache: false,
				  data: {inFrom:1},
				  success: function(response) {
					  $('#popupbox').html(response);
					  showAddMaterialPopup(id,consCompId);
					  //showAddMaterialList();
					 
				  }
				});
	
}
function showAddMaterialList()
{
	if(matAjaxObj!=null)
	{
		matAjaxObj.abort();
	}
	matAjaxObj = $.ajax({
				  url: 'addMaterial',
				  cache: false,
				   data: {searchParam:$("#searchEstimationMaterial").val(),consCompId:consCompId,contractorId:contractorId,exchangeId:exchangeId,listType:2,contrTypeId:contrTypeId,projectId:currentPrjId},
				  success: function(response) {
					  $('#units_table').html(response);
				  }
				});
	
}
function showUnitPriceIndicator(obj,matId)
{
	var matId=matId;
	consCompId=$('div#pri_cmp_id').text();
 	contractorId=$(obj).parents('table').attr("value");
 	exchangeId=$('div#exchange_id').text();
			$.ajax({
				  url: 'stakedUnit_priceindicator',
				  cache: false,
				  data: {matId:matId,consCompId:consCompId,contractorId:contractorId,exchangeId:exchangeId,listType:1,contrTypeId:contrTypeId,projectId:currentPrjId},
				  success: function(response) {
					  $('#popupbox').html(response);
					  showUnitPriceindicatorPopup();
				  }
				});
}
function changematerial()
{
	
	if( $('#ut_priority').prop('checked')==false)
		{
		$( ".priority" ).hide( );
		}
	else{
		$( ".priority" ).show();
	}
	if( $('#ut_custom').prop('checked')==false)
	{
	$( ".custom" ).hide( );
	}
else{
	
	$( ".custom" ).show();
}
	if( $('#ut_regular').prop('checked')==false)
	{
		$( ".regular" ).hide( );
	}
else{
		$( ".regular" ).show();
}
	}

function showUploadExcel(newUploadid)
{
	var inFrom=1;
	if(newUploadid != undefined)
	{
	uploadId = $(newUploadid).parent().attr("id"); 

	}
    
	//var comptable = $(uploadid).parent().find("fieldset").find("table");
	var conCompid = $('div#pri_cmp_id').text();
	var pjtName = $("#projectViewProjectName").text().trim();
	var contNm = $('#'+uploadId).children().eq(0).children().eq(0).text().trim();
	var caPrjId = $("#projectViewProjectId").text();
	
	var tableid = uploadId+"table";
	var contId = $('#'+tableid).attr('value');
	  
	  var data = {
			  consCompID: conCompid,
			  pjtNameAct : pjtName.trim(),
			  contNmActl : contNm,
			  contractorId : contId,
			  caPrjId : caPrjId.trim(),
			  inFrom:inFrom 
			  };
	
			$.ajax({
				  url: 'stakedUnit_uploadExcel',
				  cache: false,
				  data: data,
				  success: function(response) {
					  $('#popupbox').html(response);
					  showUploadExcelPopup(uploadId,inFrom);//inFrom shows whether the call is from asbuilt or staked units--inFrom-1-staked Units,inFrom-2-asbuilt
				  }
				});
}  

function showUploadExcelReset(conCompid)
{
	
	var conCompid1 = conCompid;
	//alert(conCompid1);
	var pjtName = $("#projectViewProjectName").text();
	  var data = {
			  consCompID: conCompid,
			  pjtNameAct : pjtName
			  }
	
			$.ajax({
				  url: 'stakedUnit_uploadExcel',
				  cache: false,
				  data: data,
				  success: function(response) {
					  $('#popupbox').html(response);
					  showUploadExcelPopup(conCompid1);
				  }
				});
	
}  

function showComparePanel(obj){
	 contractorId=$(obj).next().children("table").attr('value');
	 var plistId=$('#plistId').text();
	var qtyFlag=false;
	var qtyEle=$('#fieldsetnew div[group=conCmp] table tbody tr td[name=matQty] input ');
						
					
						$( qtyEle ).each(function() {
							if(!$( this ).val()=="")
							{	
								qtyFlag=true;
								return;
								}
							
							
							});
							if(qtyEle.length==0)
							{
	showConfirmationBox('Information','Please Add Atleast One Material.','hideConfirmationBox()',null,false,false,true,false);							
							}
		else if(plistId=0){
			showConfirmationBox('Information','Compare option is not available for custom materials','hideConfirmationBox()',null,false,false,true,false);
		}
	else if(qtyFlag)						
	{
	
	$.ajax({
				  url: 'comparePanel',
				  cache: false,
				  data: {},
				  success: function(response) {
					  $('#popupbox').html(response);
					  showComparePopup();
				  }
				});
	}
	else
	{
		showConfirmationBox('Information','Please Enter Value For Material Quantity.','hideConfirmationBox()',null,false,false,true,false);
	}

}
function showCompare()
{
	var tr=$('table[value='+contractorId+'] tbody tr');
	var stakedDtls=[];
	var matLength=tr.length;
	
	
	if(matLength>0)
	{
	for(var i=0;i<matLength;i++){
		var parent=$(tr[i]).parents().eq(1).attr("id");
		if($('#'+parent+' td[name=matQty] input')[i].value>0){
			var labPrice=$('#'+parent+' td[name=labor_price] ')[i].innerHTML.split(',').join('');
			var matPrice=$('#'+parent+' td[name=matrl_price] ')[i].innerHTML.split(',').join('');
			var qty=$('#'+parent+' td[name=matQty] input')[i].value.split(',').join('');
			stakedDtls.push({matId:$('#'+parent+' input[name=matId]')[i].value,materialQuantity:qty,laborPrice:labPrice,materialPrice:matPrice});
		}
	}
	}
	
	/*	$(tr).each(function() {
		debugger;
		 stakedDtls.push({matId:$('#'+$(this).parents().eq(1).attr("id")+ ' input[name=matId]').val(),dgnQty:t$('#'+parent+' td[name=matQty] input')[i].value,labPrice:$('#'+parent+' td[name=labor_price] ')[i].innerHTML,matPrice:$('#'+parent+' td[name=matrl_price] ')[i].innerHTML});
		
		})*/
	var data = {
   projectId : $('#staked_units_prj_id').val(),
   listType : listType,
    materialsCompareList : stakedDtls
}
			$.ajax({
				  url: 'stakedUnit_compare',
				  cache: false,
				  data: {compareData:JSON.stringify(data)},
				  success: function(response) {
					  $('#compareTable').html(response);
				  }
				});
	
	
}
function showConfirmDelete(obj){
	$('#confrmtn_fig').attr('class','delete');
	showConfirmationBox('Delete Material','Are you sure you want to delete the Material?','deleteRow("'+obj.id+'");','hideConfirmationBox()',null,null,true,true,false,false);
}
function showConfirmBulkDeleteMaterials(){
	
	$('#confrmtn_fig').attr('class','delete');
	showConfirmationBox('Delete Material','Are you sure you want to delete the Material(s)?','deleteMaterials();','hideConfirmationBox()',null,null,true,true,false,false);
}
function showConfirmDeleteTable(obj){
	var primaryContractor=$('#'+obj.id).parent().find("input[name=compNm]").attr("contractorType");
	if(primaryContractor==1){
		showConfirmationBox('Delete Construction Contractor','Primary contractor cannot be deleted',null,null,'hideConfirmationBox()',null,false,false,true,false);
	}
	else{
	       $('#confrmtn_fig').attr('class','delete');
	       showConfirmationBox('Delete Construction Contractor','Are you sure you want to delete the Construction Contractor?','deleteTable('+obj.id+');','hideConfirmationBox()',null,null,true,true,false,false);
	}
}
function showInfo(header ,message){
	$('#confrmtn_fig').attr('class','info');
	showConfirmationBox(header,message,null,null,'hideConfirmationBox()',null,false,false,true,false);
}
function deleteRow(rowId)
{
	
hideConfirmationBox();
var tableid=$('#'+rowId).parents().eq(3).attr("id");
$('#'+rowId).parents().eq(1).remove();

updateTotalLabour(tableid);
var chkbx= $('#'+tableid+' input[name=matChkBx]');
if(chkbx.length>0) { 
updateTotlabFiltered(chkbx[0]);

	}
	
	if( $('#'+tableid+' tbody input[type="checkbox"]').length==0)
		{
		$('#'+tableid+' thead input[type="checkbox"]').attr("disabled", true);
		}
	updateSerialNo(tableid);
}
function checkselectedMaterialsToDelete(obj){
	hideConfirmationBox();
	matDeleteObj=obj;
	var id=$(obj).parents().eq(2).attr("id");
	//var table1 = obj.parentElement;
	var tableid =id+"table";
	var checkedmaterials=$( '#'+tableid+" tbody input:checked" );

	var numChecked = $( '#'+tableid+" tbody input:checked" ).length;

	if(numChecked==0)
	{
	showInfo('No Row Selected','Please Select Atleast One Row');

	}
	else{
		showConfirmBulkDeleteMaterials();
	}
}
function deleteMaterials()
{
	//debugger;
hideConfirmationBox();
var id=$(matDeleteObj).parents().eq(2).attr("id");
//var table1 = obj.parentElement;
var tableid =id+"table";

if(checkAll){
	//debugger;
	var contrId=$( '#'+tableid).attr("value");
	$('table#filteredLabTab').find('tr#'+contrId).remove();
	$( '#'+tableid ).find('input[name=chekboxAll]').attr('checked',false)
	checkAll=false;
}
var checkedmaterials=$( '#'+tableid+" tbody input:checked" );

var numChecked = $( '#'+tableid+" tbody input:checked" ).length;


/*var chkbx= $('#'+tableid+' input[name=matChkBx]');
if(chkbx.length>0) { 
	updateTotlabFiltered(chkbx[0]);

		}
*/for (var i=0; i<numChecked; i++){
//debugger;
$('#'+checkedmaterials[i].id).parents().eq(1).remove();

}


updateTotalLabour(tableid);


/*if(chkbx.length>0) { 
updateTotlabFiltered(chkbx[0]);

	}
*/
//debugger;

var materials=$('#'+tableid+' tbody input[type="checkbox"]');
if(materials.length>0){
$( materials ).each(function() {
	//debugger;
	  updateTotlabFiltered(this);
  	});
}
else{
	//debugger;
	updateTotlabFiltered();
}

	if( $('#'+tableid+' tbody input[type="checkbox"]').length==0)
		{
		$('#'+tableid+' thead input[type="checkbox"]').attr("disabled", true);
		}
	updateSerialNo(tableid);
}
function deleteTable(obj)
{
	hideConfirmationBox();
	 var tableId=$('#'+$('#'+obj.id).parent().attr("id")+' table').attr('id');
	 var cntrId=$('#'+tableId).attr("value");
	$('table#attachmentContents tr#'+cntrId).remove();
	 $('#'+obj.id).parents().eq(1).remove();
	 $('table#filteredLabTab tr#'+cntrId).remove();
	 updateTotalLabour(tableId);
	
}
function updateSerialNo(tableId)
{
	
var totlRows=$('#'+tableId+' tbody td[name=rowNo]');
var i=1;
$( totlRows ).each(function() {
	$( this ).text(i);
i++;
	
	
	});
//alert(totlRows.length);

}
function changeUnits()
{
	if( $('#comp_state').prop('checked')==true)
		{
			
			listType=1;
			$(".units_st").show();
			$(".units_ex").hide();
			showCompare();
		}
	else if( $('#comp_exchange').prop('checked')==true)
	{
		listType=2;
		$(".units_st").hide();
		$(".units_ex").show();
		showCompare();
		}
	else if( $('#comp_all').prop('checked')==true)
	{
		listType=3;
		$(".units_ex").show();
		$(".units_st").show();	
		showCompare();
		}
	
	}
	
function checkAll(checkbox){

	if($('#'+checkbox.id).is(':checked')){
		$('[name="gridListCheckBox"]:checkbox:not(:disabled)').prop('checked',true);
	}else{		
		$('[name="gridListCheckBox"]:checkbox:not(:disabled)').prop('checked',false);
	}
}
	function checkAllMaterial(checkbox){
	//debugger;
	checkAll=true;
		var tableId= $(checkbox).parents().eq(4).attr("id");
		if($(checkbox).is(':checked')){
			
			$('#'+tableId+' tbody input[type="checkbox"]').prop('checked',true);
		}else{		
			$('#'+tableId+' tbody input[type="checkbox"]').prop('checked',false);
		}

		  updateTotlabFiltered(checkbox);
		
}
	
	function excelGeneration()
	{
		
			$.ajax({
					  url: 'stakedUnit_generateExcel',
					 cache: false,
					  data: {},
					success: function(response) {
					materialExcel.length = 0;
					//	alert(response.length());

						for (var index = 0; index < response.length; index++) {
							//materialExcel.push(response[index]);
							materialExcel.push(response[index]);
							//alert("upload1");
							addNewRow("stackedContents",materialExcel[index].serial_No,materialExcel[index].route,materialExcel[index].sheets,materialExcel[index].taxCode,materialExcel[index].unitDes,materialExcel[index].quantity,materialExcel[index].unitLab,materialExcel[index].unitMat,materialExcel[index].extLabor,materialExcel[index].extMat,materialExcel[index].totalLabMat);
						}
					
						
						
					  }
					});
		
	}

	
	function mandatoryCheck(obj)
	{
		if(obj.value!="")
			{
			$(obj).removeClass("error_field");
			}
	}
		
		
		 
	
	