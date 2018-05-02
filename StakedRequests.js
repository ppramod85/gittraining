var currentProjectId;
var stakedUnitsProjectView = [];
var taxCodeList = [];
var offset=1;
var limit=25;
var currentCalcId=46;//Calculator Id in lookup table for staked units
var tdOptions;
var cEObj=null;
var noMaterial = 0;
var addRowObj=null;
function viewHomeProject(i)
{
	taxCodePopulated=false;
	var project = stakedUnitsProjectListData[i];
	if (stakedUnitsProjectListData[0]) {
	currentProjectId=project.id;
	preloaderMask(true);
	var showDetails = function(readOnly){
		$.ajax({
			  url: 'projectView',
			  cache: false,
			  data:{prjId:currentProjectId,offset:offset,limit:99999,calcId:currentCalcId},
			  success: function(response) {
				  $('#ifrView').html(response);
				  var proceed = checkAuthority('PM_DESTU_EDT_'
							+ currentMainTabName);
					proceed.success(function(data) {
								if (Boolean(data)) {
									if(project.ospContrId!=0)
									{	
									$('#addConstructionComp').removeClass('hidden');
									$('#saveStakedUnit').removeClass('hidden');
									}
									$('#prcdToOvrhds').removeClass('hidden');
								}
							});
							
				  if(readOnly){
				  	$('#ifrView header aside').html('Project is in \''+project.statusDesc+'\' phase, cannot be edited.');
					$('#addConstructionComp').hide();
					$('#saveStakedUnit').hide();
					$('#prcdToOvrhds').hide();
				  }
				  preloaderMask(false);
		  }
		});
		$('figure.active').removeClass('active');
		$('#projectListUnit'+project.id).addClass('active');	
	};
		switch(project.statusId){
		case '1' :
		showDetails(false);
		break;
		
		case '2' :
		showDetails(false);
		break;
		
		case '3' :
		showDetails(true);
		break;
		
		case '4' :
		showDetails(true);
		break;
		
		case '7' :
		showDetails(true);
		break;
		
		case '98' :
		showDetails(true);
		break;
		
		case '99' :
		showDetails(true);
		break;
		
		default :
		showDetails(false);
		break;
	}
	
}
}
function addNewRowPreFn(id)
{
	var addDualFlg= 0;
	var addDualUnit = 0;
	var dualImg=$("#"+id).find("span.dual-unit a").length;
	if(dualImg>0) {
		if($("#"+id).find("span.dual-unit a").hasClass("selected")) {
			 addDualFlg= 1;
			 addDualUnit =1;
		} else {
			addDualFlg = 0;
			addDualUnit =0;
		}
	} else {
		addDualFlg = 0;
		addDualUnit =0;
	}

	addRowObj={
				totCntr:$('div#fieldsetnew div[group=conCmp]').length,
				addDualFlg:addDualFlg,
				addDualUnit:addDualUnit,
				tableid:id+"table"
		};
}
function addNewRowPostFn(id)
{
	tableid=id+"table";
    if($( "#"+tableid+"   input" ).attr("disabled")=="disabled"){
    	$( "#"+tableid+" thead input"  ).removeAttr("disabled");
	}
    $('td[name=matQty] input').numeric({
	    	allowMinus          : false,
			maxPreDecimalPlaces : 7,
			maxDecimalPlaces    : 2
		});
	    $('td[name=labor_price] input,td[name=matrl_price] input,td[name=labor_price_add] input,td[name=matrl_price_add] input').numeric({
	    	allowMinus          : false,
			maxPreDecimalPlaces : 7,
			maxDecimalPlaces    : 2
		});	
	    
    findMaxDualNumber(id);
	showLoMo(true);
	updateTotalLabour(tableid);
}
function addNewRow(id,matId,materialName,laborPrice,materialPrice,bomId,bomPrimary,bomQty,bomCd,plistId,priceInd,consCompId,materialType,customFlag,matserial_No,route,sheets,taxCode,quantity,extLabor,extMat,totalLabMat,taxCdId, capitalExpense,maxDualGroupNo,addDualUnit,dualGroupNo,lomo,unit_add_lbr,unit_add_mtrl)
{   
		
	var str = id;
	var tab_no = str.charAt(str.length-1);
	if(tab_no == "s" )
		tab_no = 0;
	//tableid =id+"table";
	tableid =addRowObj.tableid;
	//var totCntr=$('div#fieldsetnew div[group=conCmp]').length;
	var totCntr=addRowObj.totCntr;
	var rowCount = $('#'+tableid+' tbody tr').length;
	var rowCount=rowCount+1;
	//var rowObject = $( '#'+tableid+" tbody input:checkbox" );
	//var totalRow = $( '#'+tableid+" tbody input:checkbox" ).length;
	//var dualImg = $("#"+id).find("span.dual-unit a").length;
	var addDualFlg= addRowObj.addDualFlg;
	var addDualUnit =addRowObj.addDualUnit;
	/*var addDualFlg= 0;
	var addDualUnit = 0;
	if(dualImg>0) {
		if($("#"+id).find("span.dual-unit a").hasClass("selected")) {
			 addDualFlg= 1;
			 addDualUnit =1;
		} else {
			addDualFlg = 0;
			addDualUnit =0;
		}
	} else {
		addDualFlg = 0;
		addDualUnit =0;
	}*/

	var totalLabMat=$.formatNumber(totalLabMat, {format:"#,##0.00", locale:"us"})
	if (quantity == undefined) {
		quantity = "";
	}
	if (extLabor == undefined || (addDualUnit==1 && customFlag==0)) {
		extLabor = "";
	} else if (extLabor == undefined && (addDualUnit==1 && customFlag==1)) {
		extLabor = "";
	}
	if (extMat == undefined ||  (addDualUnit==1 && customFlag==0)) {
		extMat = "";
	} else if (extMat == undefined && (addDualUnit==1 && customFlag==1)) {
		extMat = "";
	}
	if (totalLabMat == undefined ||  (addDualUnit==1 && customFlag==0)) {
		totalLabMat = "";
	} else if (totalLabMat == undefined && (addDualUnit==1 && customFlag==1)) {
		totalLabMat = "";
	}
	if (route == undefined) {
		route = "";
	}
	if (sheets == undefined) {
		sheets = "";
	}

	if (bomId == null) {
		bomId = 0;
	}
	if (bomPrimary == null) {
		bomPrimary = 0;
	}
	if(maxDualGroupNo==null) {
		maxDualGroupNo=0;
	}
	if(maxDualGroupNo==undefined) {
		maxDualGroupNo=0;
	}
	if(maxDualGroupNo==undefined) {
		maxDualGroupNo=0;
	}
	  if(laborPrice == undefined)
	  {
		  laborPrice = "";
	  }
	  if(materialPrice == undefined)
	  {
		  materialPrice = "";
	  }
	  if(lomo == undefined)
	  {
		  lomo = 0;
	  }
	  if(dualGroupNo == undefined)
	  {
		  dualGroupNo = "";
	  }
	  if(unit_add_lbr == undefined)
	  {
		  unit_add_lbr = "";
	  }
	  if(unit_add_mtrl == undefined)
	  {
		  unit_add_mtrl = "";
	  }
	var html;
	html = '<tr>';
   	html += '<td  class="chkbx"> <input type="checkbox"  id="chkbox'+"tab"+tab_no+"_" + rowCount + '" name="matChkBx" onclick="updateTotlabFiltered(this);"><input type="text" name="matId" class="hidden" value='+matId+'></td> ';
   	html += '<td><div class="remove-row" id="stakedUnitsCreateDiv0'+"tab"+tab_no+"_" + rowCount + '"  alt="Delete" title="Delete" onclick=" showConfirmDelete(stakedUnitsCreateDiv0'+"tab"+tab_no+"_" + rowCount + ')"></div></td>';
    html += '<td class="number" name="rowNo">' + rowCount + '</td>';
    html += '<td align="center"> <input type="text" style=" width:52px !important" size="7" id="route1'+"tab"+tab_no+"_" + rowCount + '" name="staked_route"onchange="mandatoryCheck(this);" maxlength="25" onfocus="autoFillRouteValue(this);"  value ="'+route+'" ></td> ';
    html += '<td align="center"> <input type="text" style=" width:52px !important" size="7" id="sheet1'+"tab"+tab_no+"_" + rowCount + '" name="staked_sheet" onchange="mandatoryCheck(this);" maxlength="25" onfocus="autoFillSheetValue(this);" value = "'+sheets+'" ></td>';
    html += '<td align="center" id="capital_expense'+"tab"+tab_no+"_" + rowCount + '" name="capital_expense">';
    html += '<select  name="capital_expense" style="width:73px;"><option value="0">Select</option>';

    for (var index = 0; index < cEObj.length; index++) {
    	if(capitalExpense != "" && capitalExpense != 0 && capitalExpense ==cEObj[index].capExpId)
		 {
    		 html += '<option selected value='
					+ cEObj[index].capExpId + '>'
					+ cEObj[index].codeNm
					+ '</option>';
		 }	
    	else
    		{
    		html += '<option value='
					+ cEObj[index].capExpId + '>'
					+ cEObj[index].codeNm
					+ '</option>';
    		}
		}
		 html += '</select></td>';
	  	if(capitalExpense != "" )
		 {
		
		 }	

    html += '<td align="center" id="taxCode'+"tab"+tab_no+"_" + rowCount + '" name="tax_code"><select  name="taxCode" style="width:73px;">  </select></td>';// <option value="0">Select</option>
    html += '<td class="hidden" name="lomo">'+lomo+'</td>';
    html += '<td  name="dualGroupNo" align="center">'+dualGroupNo+'</td>';
  
    if(priceInd==1){
       	html += '<td align="center" id="unitDes'+"tab"+tab_no+"_" + rowCount + '" name="unit_des" class="x-grid-cell lm_only"  width="32px !important"  align="right" title="High Price" alt="High Price" onclick="showUnitPriceIndicator(this,'+matId+');">';
       	if (customFlag==0){
       		html += '<div class="x-grid-cell-inner" align="center" ><span class="content">'+materialName+'</span>' ;
       	}else{
       		html += '<div class="x-grid-cell-inner" align="center" ><span class="content custommat">'+materialName+'</span>' ;
       	}
       	html += '<span class="price-red"></span></div></td>';
    }else{
       	html += '<td align="center" id="unitDes'+"tab"+tab_no+"_" + rowCount + '" name="unit_des" class="x-grid-cell lm_only"  width="32px !important"  align="right" title="Low Price" alt="Low Price" >';
       	if (customFlag==0){
       		html += '<div class="x-grid-cell-inner" align="center" ><span class="content">'+materialName+'</span>' ;
       	}else{
       		html += '<div class="x-grid-cell-inner" align="center" ><span class="content custommat">'+materialName+'</span>' ;
       	}
       	
       	html += '</div></td>';
	}
    
 
    html += '<td align="center" id="quantity'+"tab"+tab_no+"_" + rowCount +totCntr+ '" name="matQty" > <input type="text" name="matQty" style="text-align: right; width:52px !important" size="7" id="quantity'+rowCount+totCntr+'"  onChange="updateLabour(this,unitLabourtab'+tab_no+'_' + rowCount +totCntr+ ',unitMaterialtab'+tab_no+'_' + rowCount+totCntr+',exLabortab'+tab_no+'_' + rowCount+totCntr+',exMaterialtab'+tab_no+'_' + rowCount+totCntr+',totLaborMaterialtab'+tab_no+'_' + rowCount+totCntr+')"  value = '+$.formatNumber(quantity, {format:"###0.00", locale:"us"})+'></input></td>';
	if(laborPrice=="" || customFlag==1){
		html += '<td id="unitLabour'+"tab"+tab_no+"_" + rowCount + totCntr+'" name="labor_price" align="right"><input class="number" type="text" style="text-align: right; width:52px !important" size="7"  name="labor_price" value = "'+(laborPrice==""?0.00:laborPrice)+'" onChange="updateLabour(quantity'+rowCount+totCntr+',unitLabourtab'+tab_no+'_' + rowCount +totCntr+ ',unitMaterialtab'+tab_no+'_' + rowCount+totCntr+',exLabortab'+tab_no+'_' + rowCount+totCntr+',exMaterialtab'+tab_no+'_' + rowCount+totCntr+',totLaborMaterialtab'+tab_no+'_' + rowCount+totCntr+')"></td>';
	}else{
		if(addDualFlg==1) {
			html += '<td id="unitLabour'+"tab"+tab_no+"_" + rowCount + totCntr+'" name="labor_price_add" align="right"><input class="number" type="text" style="text-align: right; width:52px !important" size="7"  name="labor_price_add" value = "'+(unit_add_lbr==""?0.00:unit_add_lbr)+'" onChange="updateLabour(quantity'+rowCount+totCntr+',unitLabourtab'+tab_no+'_' + rowCount +totCntr+ ',unitMaterialtab'+tab_no+'_' + rowCount+totCntr+',exLabortab'+tab_no+'_' + rowCount+totCntr+',exMaterialtab'+tab_no+'_' + rowCount+totCntr+',totLaborMaterialtab'+tab_no+'_' + rowCount+totCntr+')"></td>';
			html += '<td class="hidden" id="unitLabour'+"tab"+tab_no+"_" + rowCount + totCntr+'" name="labor_price" align="right">'+$.formatNumber(laborPrice, {format:"#,##0.00", locale:"us"})+'</td>';

		} else {	
			html += '<td  class="hidden" id="unitLabour'+"tab"+tab_no+"_" + rowCount + totCntr+'" name="labor_price_add" align="right"><input class="number" type="text" style="text-align: right; width:52px !important" size="7"  name="labor_price_add" value = "'+(unit_add_lbr==""?0.00:unit_add_lbr)+'" onChange="updateLabour(quantity'+rowCount+totCntr+',unitLabourtab'+tab_no+'_' + rowCount +totCntr+ ',unitMaterialtab'+tab_no+'_' + rowCount+totCntr+',exLabortab'+tab_no+'_' + rowCount+totCntr+',exMaterialtab'+tab_no+'_' + rowCount+totCntr+',totLaborMaterialtab'+tab_no+'_' + rowCount+totCntr+')"></td>';
			html += '<td id="unitLabour'+"tab"+tab_no+"_" + rowCount + totCntr+'" name="labor_price" align="right">'+$.formatNumber(laborPrice, {format:"#,##0.00", locale:"us"})+'</td>';
		}
	}
	if(materialPrice=="" || customFlag==1){
		html += '<td id="unitMaterial'+"tab"+tab_no+"_" + rowCount +totCntr+ '" name="matrl_price" align="right"><input class="number" type="text" style="text-align: right; width:52px !important" size="7"  name="matrl_price" value = "'+(materialPrice==""?0.00:materialPrice)+'" onChange="updateLabour(quantity'+rowCount+totCntr+',unitLabourtab'+tab_no+'_' + rowCount +totCntr+ ',unitMaterialtab'+tab_no+'_' + rowCount+totCntr+',exLabortab'+tab_no+'_' + rowCount+totCntr+',exMaterialtab'+tab_no+'_' + rowCount+totCntr+',totLaborMaterialtab'+tab_no+'_' + rowCount+totCntr+')"></td>';
	}else{
		
			if(addDualFlg==1) {
				html += '<td id="unitMaterial'+"tab"+tab_no+"_" + rowCount +totCntr+ '" name="matrl_price_add" align="right"><input class="number" type="text" style="text-align: right; width:52px !important" size="7"  name="matrl_price_add" value = "'+(unit_add_mtrl==""?0.00:unit_add_mtrl)+'" onChange="updateLabour(quantity'+rowCount+totCntr+',unitLabourtab'+tab_no+'_' + rowCount +totCntr+ ',unitMaterialtab'+tab_no+'_' + rowCount+totCntr+',exLabortab'+tab_no+'_' + rowCount+totCntr+',exMaterialtab'+tab_no+'_' + rowCount+totCntr+',totLaborMaterialtab'+tab_no+'_' + rowCount+totCntr+')"></td>';
				html += '<td class="hidden"  id="unitMaterial'+"tab"+tab_no+"_" + rowCount +totCntr+ '" name="matrl_price" align="right">'+$.formatNumber(materialPrice, {format:"#,##0.00", locale:"us"})+'</td>';
	
			} else {	
				html += '<td class="hidden" id="unitMaterial'+"tab"+tab_no+"_" + rowCount +totCntr+ '" name="matrl_price_add" align="right"><input class="number" type="text" style="text-align: right; width:52px !important" size="7"  name="matrl_price_add" value = "'+(unit_add_mtrl==""?0.00:unit_add_mtrl)+'" onChange="updateLabour(quantity'+rowCount+totCntr+',unitLabourtab'+tab_no+'_' + rowCount +totCntr+ ',unitMaterialtab'+tab_no+'_' + rowCount+totCntr+',exLabortab'+tab_no+'_' + rowCount+totCntr+',exMaterialtab'+tab_no+'_' + rowCount+totCntr+',totLaborMaterialtab'+tab_no+'_' + rowCount+totCntr+')"></td>';
	
				html += '<td id="unitMaterial'+"tab"+tab_no+"_" + rowCount +totCntr+ '" name="matrl_price" align="right">'+$.formatNumber(materialPrice, {format:"#,##0.00", locale:"us"})+'</td>';
			}
		
	}
	//For additional dual unit
//	html += '<td  class="hidden" id="unitLabour'+"tab"+tab_no+"_" + rowCount + totCntr+'" name="labor_price_add" align="right"><input class="number" type="text" style="text-align: right; width:52px !important" size="7"  name="labor_price_add" value = '+$.formatNumber(laborPrice, {format:"#,##0.00", locale:"us"})+' onChange="updateLabour(quantity'+rowCount+totCntr+',unitLabourtab'+tab_no+'_' + rowCount +totCntr+ ',unitMaterialtab'+tab_no+'_' + rowCount+totCntr+',exLabortab'+tab_no+'_' + rowCount+totCntr+',exMaterialtab'+tab_no+'_' + rowCount+totCntr+',totLaborMaterialtab'+tab_no+'_' + rowCount+totCntr+')"></td>';
//	html += '<td class="hidden" id="unitMaterial'+"tab"+tab_no+"_" + rowCount +totCntr+ '" name="matrl_price_add" align="right"><input class="number" type="text" style="text-align: right; width:52px !important" size="7"  name="matrl_price_add" value = '+$.formatNumber(materialPrice, {format:"#,##0.00", locale:"us"})+' onChange="updateLabour(quantity'+rowCount+totCntr+',unitLabourtab'+tab_no+'_' + rowCount +totCntr+ ',unitMaterialtab'+tab_no+'_' + rowCount+totCntr+',exLabortab'+tab_no+'_' + rowCount+totCntr+',exMaterialtab'+tab_no+'_' + rowCount+totCntr+',totLaborMaterialtab'+tab_no+'_' + rowCount+totCntr+')"></td>';
	
	html += '<td class="hidden" id="Qty_Id_'+"tab"+tab_no+"_" + rowCount +totCntr+ '" name="Qty_Id" align="right"><input class="number" type="text" style="text-align: right; width:52px !important" size="7"  name="Qty_Id" value = "quantity'+rowCount+totCntr+'" ></td>';
	//For additional dual unit
	html += '<td id="exLabor'+"tab"+tab_no+"_" + rowCount +totCntr+ '" align="right" name="extlab">'+$.formatNumber((extLabor==""?0.00:extLabor), {format:"#,##0.00", locale:"us"})+'</td>';
    html += '<td id="exMaterial'+"tab"+tab_no+"_" + rowCount +totCntr+ '" align="right" name="extmat">'+$.formatNumber((extMat==""?0.00:extMat), {format:"#,##0.00", locale:"us"})+'</td>';      
    html += '<td id="totLaborMaterial'+"tab"+tab_no+"_" + rowCount +totCntr+ '" align="right" name="totalLabMat">'+totalLabMat+'</td>';
    html += '<td class="hidden" name="bomId">'+bomId+'</td>';
    html += '<td class="hidden" name="bomPrimary">'+bomPrimary+'</td>';
    html += '<td class="hidden" name="bomCd">'+bomCd+'</td>';
    html += '<td class="hidden" name="plistId">'+plistId+'</td>';
    html += '<td class="hidden" name="priceInd">'+priceInd+'</td>';
    html += '<td class="hidden" name="conQty">0</td>';
    html += '<td class="hidden" name="materialType">'+materialType+'</td>';
    html += '<td class="hidden" name="isCustom">'+customFlag+'</td>';
    html += '<td class="hidden" name="maxDualGroupNo">0</td>';
    html += '<td class="hidden" name="addDualUnit">'+addDualUnit+'</td></tr>';
    $("#"+tableid).append(html);
    getTaxCode("taxCodetab"+tab_no+"_" + rowCount, taxCdId);

/*    if($( "#"+tableid+"   input" ).attr("disabled")=="disabled"){
    	$( "#"+tableid+" thead input"  ).removeAttr("disabled");
	}
    getTaxCode("taxCodetab"+tab_no+"_" + rowCount, taxCdId);
      	  
    if(quantity!=""){
    	updateTotalLabour(tableid);
	}
    findMaxDualNumber(id);*/
}

function getTaxCode(id, taxCdId)
{

	var data={
			prjId:$('#staked_units_prj_id').val()
			
		}
	if(taxCdId=="")
	{
		taxCdId=0;
	}
	if(taxCodePopulated)
		{
		$('#'+id+' select')
		.append(tdOptions);
		}
	else
	{
		$.ajax({
		  url: 'get_td',
		  cache: false,
		  async:false,
		  data:data,
		  success: function(response) {
			  taxCodeList.length = 0;
			  $('#'+id+' select')
				.append('<option value="0" selected>Select</option>');
				for (var index = 0; index < response.length; index++) {
					taxCodeList.push(response[index]);
					$('#'+id+' select')
					.append('<option value='
							+ response[index].tdId + '>'
							+ response[index].tdNm
							+ '</option>');
					tdOptions=	$('#'+id+' select').html();
					taxCodePopulated=true;
				}
			  	
		  }
		});
	}
	if(taxCdId != "" )
	 {
	$('#'+id+' select').val(taxCdId);
	 }
}
function updateLabour(qty,unitLab,unitMat,extLab,extmat,total)
{

	mandatoryCheck(qty);
	var qtyVal,unitlabVal,unitmatVal,extLabVal,extMatVal,tableId;
	tableId=$(qty).parents("table").attr("id");
	qtyVal=$('#'+tableId+' input#'+$(qty).attr("id")).val();
	var dualImg =  $("#"+$(qty).parents("table").parents("div").attr("id")).find("span.dual-unit a").length;
	var addDualFlg= 0;
	if(dualImg>0) {
		if($("#"+$(qty).parents("table").parents("div").attr("id")).find("span.dual-unit a").hasClass("selected")) {
			 addDualFlg= 1;
		} else {
			addDualFlg = 0;
		}
	} else {
		addDualFlg = 0;
	}


	if(qtyVal==""){
		qtyVal=0;
		unitlabVal=0;
		unitmatVal=0;
	}else{
		qtyVal=parseFloat(qtyVal);
				
		if (($(qty).parents("tr").find('td[name=isCustom]').text()==0) && addDualFlg==0){
			unitlabVal = parseFloat(($(qty).parents("tr").find('td[name=labor_price]').text()).replace(/,/g, ''));
			unitmatVal=parseFloat(($(qty).parents("tr").find('td[name=matrl_price]').text()).replace(/,/g, ''));
		}else{
			unitlabVal=parseFloat((($('#'+tableId+' #'+$(unitLab).attr("id")+' input').val()== undefined)?$(unitLab).text():$('#'+tableId+' #'+$(unitLab).attr("id")+' input').val()).replace(/,/g, ''));	
			unitmatVal=parseFloat((($('#'+tableId+' #'+$(unitMat).attr("id")+' input').val()== undefined)?$(unitMat).text():$('#'+tableId+' #'+$(unitMat).attr("id")+' input').val()).replace(/,/g, ''));
		}
	}	

	var lomo = $(qty).parents('tr').find('td[name=lomo]').text();

	if(lomo==1){
		unitmatVal=0;
	}else if(lomo==2){
		unitlabVal=0;
	}


	extLabVal=qtyVal*unitlabVal;
	extMatVal=qtyVal*unitmatVal;

	$('#'+tableId+' td#'+$(extLab).attr("id")).text($.formatNumber(extLabVal, {format:"#,##0.00", locale:"us"}));
	$('#'+tableId+' td#'+$(extmat).attr("id")).text($.formatNumber(extMatVal, {format:"#,##0.00", locale:"us"}));
	$('#'+tableId+' td#'+$(total).attr("id")).text($.formatNumber(extLabVal+extMatVal, {format:"#,##0.00", locale:"us"}));
 

	var tableId=$(qty).parents("table").attr("id");
	updateTotalLabour(tableId);
	var chkbx= $(qty).parent().siblings("td.chkbx").children("input[name=matChkBx]");
	if($(chkbx).prop('checked')) { 
		updateTotlabFiltered(chkbx);
	}
}

function updateTotalLabour(tableId)
{
var extLabElements=$('#'+tableId+' td[name=extlab]');
var extMatElements=$('#'+tableId+' td[name=extmat]');
var totalLabMat=$('#'+tableId+' td[name=totalLabMat]');
var extLabTot=0;
var extMatTot=0;
var totLabMat=0;
var cmpId=$('#'+tableId).attr('value');

$( extLabElements ).each(function() {
	if($( this ).text()!="")
	{	
		extLabTot=extLabTot+=parseFloat(($( this ).text()).replace(/,/g, ''));
		}
	
	
	});
$('table#attachmentContents tr#'+cmpId+' td[name=extlab]').text($.formatNumber(extLabTot, {format:"#,##0.00", locale:"us"}));
$( extMatElements ).each(function() {
	if($( this ).text()!="")
	{	extMatTot=extMatTot+=parseFloat(($( this ).text()).replace(/,/g, ''));
		}
	
	
	});
	


$('table#attachmentContents tr#'+cmpId+' td[name=extmat]').text($.formatNumber(extMatTot, {format:"#,##0.00", locale:"us"}));

$( totalLabMat ).each(function() {
	if($( this ).text()!="")
	{	totLabMat=totLabMat+=parseFloat(($( this ).text()).replace(/,/g, ''));
		}
	
	
	});
	


$('#'+tableId+' + div.grand_sum_total span.number').text($.formatNumber(totLabMat, {format:"#,##0.00", locale:"us"}));
$('table#attachmentContents tr#'+cmpId+' td[name=totlabour]').text($.formatNumber(totLabMat, {format:"#,##0.00", locale:"us"}));

var grandTotalEle=$('table#attachmentContents td[name=totlabour]');

var grandtot=0;
$( grandTotalEle ).each(function() {
	if($( this ).text()!="")
	{	grandtot=grandtot+=parseFloat(($( this ).text()).replace(/,/g, ''));
		}
	
	
	});
$('div#tot_labour_div div span.number').text($.formatNumber(grandtot, {format:"#,##0.00", locale:"us"}));

}

function addStackedTable(cntrId,cntrNm) {

	var elements = $('div#fieldsetnew span[group=conCmp]');
	  var nextId = elements.length+1;
	  var htmlHeader ='<div id="stackedContentsTable'+cntrId+'" width="100%" group="conCmp" ><div class="fieldset_wrapper wrapper" id="stackedContents'+cntrId+'" ><span class="head_text" group="conCmp"><a name="cmpName"><i class="fa fa-building-o"></i><label id="contrNm'+nextId+'"></label></a></span>';
	  htmlHeader += '<span class="left"><input type="button" class="action"  onclick=showAddMaterial("stackedContents'+cntrId+'");  value="Add Material" id="addMaterialButton'+cntrId+'">';
	
	  //FOR LO_MO
	  htmlHeader += '&nbsp;<input type="button"  class="action" value="Labor Only" id="laborOnlyButton" onclick="setLabourOrMaterialOnly(1,'+cntrId+')"> <input type="button"  class="action" value="Material Only" id="materialOnlyButton"  onclick="setLabourOrMaterialOnly(2,'+cntrId+')"> <input type="button"  class="action" value="Labor & Material" id="bothPricesButton"  onclick="setLabourOrMaterialOnly(0,'+cntrId+')">';
	  htmlHeader += '<span class="dual-unit"><a><i class="fa fa-cubes" onclick=showAdditionalDualUnit("stackedContents'+cntrId+'"); title="Click to Enable Additional Dual Unit" name="addDualUnit"></i></a></span>';
	  htmlHeader += '<input type="button" class="action hidden" style="margin-left: 3px;" value="Add Contractor" id="addContractorButton'+cntrId+'" onclick="showAddContractor(stackedContentsTable'+cntrId+');">';
	  htmlHeader += '<span class="link-unlink right"><a><i class="fa fa-chain-broken" onclick=unlinkConfirmationAdditionalDualUnit("stackedContents'+cntrId+'"); title="Click to UnLink Additional Dual Unit" name="addDualUnit"></i></a></span>';
	  htmlHeader += '<span class="link-unlink right"><a><i class="fa fa-link" onclick=linkAdditionalDualUnit("stackedContents'+cntrId+'"); title="Click to Link Additional Dual Unit" name="addDualUnit"></i></a></span>';
	  htmlHeader += '</span><input type="button" class="action fright" value="Delete" id="deleteButton'+cntrId+'" onclick="showConfirmDeleteTable(this);">';
	  htmlHeader += '<input type="button" class="action fright" value="Upload" id="uploadButton'+cntrId+'"" onclick="showUploadExcel(this);" >';
	  htmlHeader += '<input type="button" class="fright" name="compareButton" value="Compare" id="compareButton'+cntrId+'" onclick="javascript:showComparePanel(this);">';
	  htmlHeader += '<fieldset class="fieldset-view">';
	  htmlHeader += '<input type="text" name="cmpName" class="hidden" value="'+escape(cntrNm)+'">';
	  htmlHeader += '<table width="100%" cellspacing="0" id="stackedContents'+cntrId+'table" class="normal_table" value='+cntrId+'>';
	  htmlHeader += '<thead id="tableHeading'+cntrId+'"><tr align="center" class="contentHead_tr">';
	  htmlHeader += '<th  class="small-width"><a href="#"><input id="checkbox'+cntrId+'" name="chekboxAll"  type="checkbox" disabled="true" title="Select all materials" onclick="checkAllMaterial(this);"></a></th>';
	  htmlHeader += '<th class="small-width" id="delete'+cntrId+'"  ></th>';
	  htmlHeader += '<th id="Sn'+cntrId+'" title="S/N" align="right"class="small-width">S/N</th>';
	  htmlHeader += '<th class="mandatory medium-width" id="route'+cntrId+'" class="mandatory" title="Route"   onchange="mandatoryCheck(this);" maxlength="25">Route<span></span></th>';
	  htmlHeader += '<th class="mandatory medium-width" id="sheet'+cntrId+'" class="mandatory" title="Sheet"   onchange="mandatoryCheck(this);" maxlength="25">Sheet<span></span></th>';
	  htmlHeader += '<th class="mandatory medium-width" id="capital/expense'+cntrId+'" title="Capital/Expense">Capital/Expense<span></span></th>';
	  htmlHeader += '<th id="taxCode'+cntrId+'" title="Tax Code"  class="medium-width">Tax Code</th>';
	  htmlHeader += '<th id="dualUnit'+cntrId+'" title="Dual Unit"  class="medium-width">Dual Unit</th>';
	  htmlHeader += '<th id="Description'+cntrId+'" title="Unit Description" class="large-width">Unit Description</th>';
	  htmlHeader += '<th class="mandatory medium-width" id="quantity'+cntrId+'" class="mandatory" title="Quantity">Quantity<span></span></th>';
	  htmlHeader += '<th class="medium-width" id="unitLabour'+cntrId+'" title="Unit Labor" align="right" >Unit Labor($)</th>';
	  htmlHeader += '<th class="medium-width" id="unitMaterial'+cntrId+'" title="Unit Material" align="right" >Unit Material($)</th>';
	  htmlHeader += '<th class="medium-width2" id="exLabor'+cntrId+'"  title="Extended Labor" align="right">Extended Labor($)</th>';
	  htmlHeader += '<th class="medium-width2" id="exMaterial'+cntrId+'"  title="Extended Material" align="right">Extended Material($)</th>';
	  htmlHeader += '<th class="medium-width2" id="totLaborMaterial'+cntrId+'" title="Total Labor and Material"  align="right" >Total Labor &amp; Material($)</th></tr></thead><tbody>';
	  htmlHeader += '</tbody></table>';
	  htmlHeader += '<div class="grand_sum_total"><div class="copy-row" id="copyDiv0" alt="copy Material" title="copy Material" onclick=showCopy(this);></div><div class="remove-row2" id="deleteDiv0"  alt="Delete Material" title="Delete Material" onclick="checkselectedMaterialsToDelete(this);"></div>Total :<span class="number">0.00</span></div>';
	  htmlHeader += '</fieldset></div></div></fieldset>';
	  $("#fieldsetnew").append(htmlHeader);
	  var contractor=cntrNm;
	  $('#contrNm'+nextId+'').text(contractor);
	  addTotalLaborRow(cntrId,cntrNm);
}


function addTotalLaborRow(cntrId,cntrNm)
{
	
	 $("#attachmentContents").append('<tr id='+cntrId+'><td name='+cntrId+'Name>'+cntrNm+'</td>	<td class="number" name="extlab">0.00</td><td class="number" name="extmat">0.00</td><td class="number" name="totlabour">0.00</td></tr>');
	// $("#filteredLabTab").append('<tr id='+cmpId+'><td>'+cmpName+'</td>	<td class="number" name="extlab">0.00</td><td class="number" name="extmat">0.00</td><td class="number" name="totlabour">0.00</td></tr>');
	 $("#attachmentContents").find("td[name="+cntrId+"Name]").text(cntrNm);
}


function showCopy(obj) {
	var id=$(obj).parents().eq(2).attr("id");
	//var table1 = obj.parentElement;
	tableid =id+"table";
	var checkedmaterials=$( "#"+tableid+" input[name='matChkBx']:checked").parents('tr');

	var numChecked = $( '#'+tableid+" tbody input:checked" ).length;
	getCaptialExpense();
	var rowObject = $( '#'+tableid+" tbody input:checkbox" );
	var totalRow = $( '#'+tableid+" tbody input:checkbox" ).length;
	
	var maxVal = $('#'+rowObject[0].id).parents().eq(1).children("td[name='dualGroupNo']").text();
	var nextVal;
	if(totalRow>1) {
		for (var i=1; i<totalRow; i++){	
			
			nextVal = $('#'+rowObject[i].id).parents().eq(1).children("td[name='dualGroupNo']").text();
			if(nextVal>maxVal) {
				maxVal =  nextVal;
			}
		}
	}
	if(maxVal=="") {
		maxVal = 0;
	}
if(numChecked==0)
{
showInfo('No Row Selected','Please Select Atleast One Row');

}
else{
var unit_labor,unit_mtrl,unit_add_lbr,unit_add_mtrl;
addNewRowPreFn(id);
$(checkedmaterials).each(function(){
	var addDualUnit=	$(this).find("td[name='addDualUnit']").text();
	var lPObj=$(this).find("td[name='labor_price']");
	var mPObj=$(this).find("td[name='matrl_price']");
	var lPAddObj=$(this).find("td[name='labor_price_add']");
	var mPAddObj=$(this).find("td[name='matrl_price_add']");
	var lPLomoObj=$(this).find("td[name='l_pr_lomo']");
	var mPLomoObj=$(this).find("td[name='m_pr_lomo']");
	if(lPObj.find("input").val()==undefined)
	{
		unit_labor=lPObj.text().replace(/,/g, '');
	}
	else
	{
		unit_labor=lPObj.find("input").val();
	}	
	if(mPObj.find("input").val()==undefined)
	{
		unit_mtrl=mPObj.text().replace(/,/g, '');
	}
	else
	{
		unit_mtrl=mPObj.find("input").val();
	}
	unit_add_lbr=lPAddObj.find("input").val();
	unit_add_mtrl=mPAddObj.find("input").val();

	var unit_des=$(this).find("td[name='unit_des']").text();
	var bomId=	$(this).find("td[name='bomId']").text();
	var bomprimary=$(this).find("td[name='bomPrimary']").text();
	var calcTrnId= $(this).find("td[name='calcTrnId']").text();
	var plistId= $(this).find("td[name='plistId']").text();
	var matId=	$(this).find("td.chkbx").children("input[name=matId]").val();
	var priceInd=	 $(this).find("td[name='priceInd']").text();
	var consCompId=$('div#pri_cmp_id').text();
	var maxDualGroupNo=	$(this).find("td[name='maxDualGroupNo']").text();
	var materialType=	 $(this).find("td[name='materialType']").text();
	var isCustom=	 $(this).find("td[name='isCustom']").text();
	var capitalExpense=$(this).find("td[name='capital_expense']").children("select").val();
	var route=$(this).find("input[name='staked_route']").val();
	var sheet=$(this).find("input[name='staked_sheet']").val();
	var taxcode=$(this).find("td[name='tax_code']").children("select").val();
	var dualGroupNo= $(this).find("td[name='dualGroupNo']").text();
	var lomo=$(this).find("td[name='lomo']").text();
	var qty=$(this).find("input[name='matQty']").val();	
	addNewRow(id,matId,unit_des,unit_labor,unit_mtrl,bomId,bomprimary,0,0,plistId,priceInd,consCompId,materialType,isCustom,null,route,sheet,null,qty,null,null,null,taxcode, capitalExpense,maxDualGroupNo,addDualUnit,dualGroupNo,lomo,unit_add_lbr,unit_add_mtrl);
	//addNewRow(id,matId,materialName,laborPrice,materialPrice,bomId,bomPrimary,bomQty,bomCd,plistId,priceInd,consCompId,materialType,customFlag,matserial_No,route,sheets,taxCode,quantity,extLabor,extMat,totalLabMat,taxCdId, capitalExpense,maxDualGroupNo,addDualUnit)

})
addNewRowPostFn(id);
$('#'+tableid+' thead input[type="checkbox"]').prop('checked',false);

}
	
}

$("#slideHandle ,#sliderImg").click(function () {
    // Set the effect type
    var effect = 'slide';

    
    // Set the options for the effect type chosen
    var options = { direction: 'Left' };
 
    // Set the duration (default: 400 milliseconds)
    var duration = 500;
    if( $('#detail_wrapper').css('left')!="0px")
    {$('#appln_wrapper').animate({"left": '0'});
    	$('#detail_wrapper').animate({"left": '0'});
    	$('#slideHandle').removeClass('expand_left');
    	$('#slideHandle').addClass('expand_right');
    	//toggle('slide');//toggle(effect,options );//toggle(effect, options,duration);
    }
    else
    	{$('#appln_wrapper').animate({"left": '198'});
    	$('#detail_wrapper').animate({"left": '262'});
       	$('#slideHandle').removeClass('expand_right');
    	$('#slideHandle').addClass('expand_left');}
});

function saveStakedUnits(){
	preloaderMask(true);
	var ele=$('#fieldsetnew div[group=conCmp]');
	
	var totmatLength=$('#fieldsetnew div[group=conCmp] table tbody tr').length;
	var routeEle=$('#fieldsetnew div[group=conCmp] table tbody tr td input[name=staked_route] ');
	var sheetEle=$('#fieldsetnew div[group=conCmp] table tbody tr td input[name=staked_sheet] ');
	var routeFlag=false;
	var sheetFlag=false;
	var qtyFlag=false;
	var qtyEle=$('#fieldsetnew div[group=conCmp] table tbody tr td[name=matQty] input ');
	var invalidField=[];
	
	$( routeEle ).each(function() {
		if($( this ).val()==""){	
			routeFlag=true;
			invalidField.push(this);
			//return false;
			}
	});
	
	$( sheetEle ).each(function() {
		if($( this ).val()==""){	
			sheetFlag=true;
			invalidField.push(this);
			//return false;
			}
	});
	
	$( qtyEle ).each(function() {
		if($( this ).val()==""){	
			qtyFlag=true;
			invalidField.push(this);
			//return false;
			}
	});
	
	if(totmatLength>0 && !routeFlag && !sheetFlag && !qtyFlag){
		var stakedDtls=[];
		$( ele ).each(function() {
			var addDualUnit;
			if($('#'+this.id+' table').parents("div.fieldset_wrapper.wrapper").find("span.dual-unit a").attr("class")=="selected"){
				addDualUnit=1;
			}else{
				addDualUnit=0;
			}
		 	var matLength=$('#'+this.id+' table tbody tr').length;
		 	var mat=$('#'+this.id+' table tbody tr');
		 	$(mat).each(function(){
		 		var tdId=$(this).find("td[name=tax_code] select").val()==0?null:$(this).find("td[name=tax_code] select").val();
		 		var unitLab=parseFloat(($(this).find("td[name=labor_price]").text()=="")?$(this).find("td[name=labor_price] input").val():$(this).find("td[name=labor_price]").text().replace(/,/g, ''));
		 		var matLab=parseFloat(($(this).find("td[name=matrl_price]").text()=="")?$(this).find("td[name=matrl_price] input").val():$(this).find("td[name=matrl_price]").text().replace(/,/g, ''));
				var bomId=$(this).find("td[name=bomId]").text()==0?null:$(this).find("td[name=bomId]").text();
				var plistId=$(this).find("td[name=plistId]").text()==0?null:$(this).find("td[name=plistId]").text();
				var capExp=$(this).find("td[name=capital_expense] select").val()==0?null:$(this).find("td[name=capital_expense] select").val();
				var addDualLabPrice=parseFloat(($(this).find("td[name=labor_price_add]").text()=="")?$(this).find("td[name=labor_price_add] input").val():$(this).find("td[name=labor_price_add]").text().replace(/,/g, ''));
				var addDualMatPrice=parseFloat(($(this).find("td[name=matrl_price_add]").text()=="")?$(this).find("td[name=matrl_price_add] input").val():$(this).find("td[name=matrl_price_add]").text().replace(/,/g, ''));
				var dualGroupNo=$(this).find("td[name=dualGroupNo]").text()==0?null:$(this).find("td[name=dualGroupNo]").text();
				
				if ((dualGroupNo==null) || (dualGroupNo=="null")|| (dualGroupNo=="")){
					dualGroupNo=0;
				}
				
				if ((addDualLabPrice==null) || (addDualLabPrice=="null") || (addDualLabPrice=="")){
					addDualLabPrice=0;
				}
				
				if ((addDualMatPrice==null) || (addDualMatPrice=="null")|| (addDualMatPrice=="")){
					addDualMatPrice=0;
				}
				//LOMO
				var lomo = $(this).find('td[name=lomo]').html();
				stakedDtls.push({contrId:$(this).parents('table').attr("value"),consCompId:$('div#pri_cmp_id').text(),matId:$(this).find('input[name=matId]').val(),dgnQty:parseFloat($(this).find('td[name=matQty] input').val()),labPrice:(unitLab=="")?0:unitLab,matPrice:(matLab=="")?0:matLab,route:$(this).find("input[name=staked_route]").val(),sheet:$(this).find("input[name=staked_sheet]").val(),tdId:tdId,plistId:plistId,bomId:bomId,bomPrimary:$(this).find("td[name=bomPrimary]").text(),conQty:$(this).find("td[name=conQty]").text(),slNo:$(this).find("td[name=rowNo]").text(),capitalExpense:capExp,addDualLabPrice:addDualLabPrice,addDualMatPrice:addDualMatPrice,addDualUnit:addDualUnit,loMo:lomo,dualGroupNo:dualGroupNo});
		 	});
		});

		var data= {prjId:currentProjectId,calcId:currentCalcId,calcTrnId:$('input#calcTrnId').val(),stakedUnits:stakedDtls};
		$.ajax({
			url: 'saveStakedUnits',
			cache: false,
			type:'POST',
			data:{data:JSON.stringify(data)},
			success: function(response) {
				 if(response.stat!=0)
				 {
					 if(stakedUnitsProjectListData[$('figure.active').prev().val()].statusId==1)
					{
						 stakedUnitsProjectListData[$('figure.active').prev().val()].statusId=2; 
						 $('figure.active').find('.image').attr("class","image project_img icon-design-estimate");
					}
				 }
				 preloaderMask(false);
				showConfirmationBox('Message', response.stMsg,null , null, 'hideSaveMsg()',null, false,false, true, false, 1);
			}
		});
	}else{
		if(totmatLength==0){
			showErrorMsg("Information","Please Add Atleast One Material. ",null);
		}else if(routeFlag){
			showErrorMsg("Information","Please Enter Value For Mandatory Fields. ",invalidField);
			
		}else if(sheetFlag){
			showErrorMsg("Information","Please Enter Value For Mandatory Fields. ",invalidField);
		}else if(qtyFlag){
			showErrorMsg("Information","Please Enter Value For Mandatory Fields. ",invalidField);
		}
	}
}

function updateTotlabFiltered(obj){
	var tableId=$(obj).parents('table').attr("id");
	var cmpId=$(obj).parents('table').attr("value");
	var cntrNm;
	cntrNm=$(obj).parents('div').find('input[name=cmpName]').val();
   // if(!cntrNm){
    	//cntrNm=$('div[id=projectViewContractorNm]').text();
	//}
	var totCheckedEle=$('#'+tableId+' input[name=matChkBx]:checked');
	var flag=true;
	var allMat=$('#'+tableId+' tbody input[type="checkbox"]');
	/*$( allMat ).each(function() {
		if(!$(this).prop('checked')){
			flag=false;
	    	return;
	    }
	});*/

	/*if(!$(obj).prop('checked')){
		$('#'+tableId+' thead input[name=chekboxAll]').prop('checked',false);
	}else if(flag){
		$('#'+tableId+' thead input[name=chekboxAll]').prop('checked',true);
	}*/
    
	var extLabTot=0;
    var extMatTot=0;
    var totLabMat=0;
    if($(obj).prop("checked")){ 
    	if (  $('#filteredLabTab tr#'+cmpId).length ==0) {
    		$("#filteredLabTab").append('<tr id='+cmpId+'><td>'+cntrNm+'</td>	<td class="number" name="extlab">0.00</td><td class="number" name="extmat">0.00</td><td class="number" name="totlabour">0.00</td></tr>');
    	}
    }else{
    	if(totCheckedEle.length==0){
    		$('#filteredLabTab tr#'+cmpId).remove();
    	} 
	}
    
    
    $( totCheckedEle ).each(function() {
    	if($(this).parents().eq(1).children("[name=extlab]").text()!=""){
    		extLabTot=extLabTot+=parseFloat(($(this).parents().eq(1).children("[name=extlab]").text()).replace(/,/g, ''));
    		extMatTot=extMatTot+=parseFloat(($(this).parents().eq(1).children("[name=extmat]").text()).replace(/,/g, ''));
    		totLabMat=totLabMat+=parseFloat(($(this).parents().eq(1).children("[name=extmat]").next().text()).replace(/,/g, ''));
    	}
	});

    
    $('#filteredLabTab tr#'+cmpId+' td[name=extlab]').text($.formatNumber(extLabTot, {format:"#,##0.00", locale:"us"}));
    $('#filteredLabTab tr#'+cmpId+' td[name=extmat]').text($.formatNumber(extMatTot, {format:"#,##0.00", locale:"us"}));
    $('#filteredLabTab tr#'+cmpId+' td[name=extmat]').next().text($.formatNumber(totLabMat, {format:"#,##0.00", locale:"us"}));
    
    var totFilterEle=$('#filteredLabTab td[name=totlabour]');
    var totLabFilter=0;
    $( totFilterEle ).each(function() {
    	if($(this).text()!=""){
    		totLabFilter=totLabFilter+=parseFloat(($(this).text()).replace(/,/g, ''));
    	}
    	
    });
    $('#filteredTotlab div.grand_sum_total span.number').text($.formatNumber(totLabFilter, {format:"#,##0.00", locale:"us"}));
}


function getPriceIndicator(stakedDtls){
	
	var data= {listType:0,stakedUnitsMaterialList:stakedDtls}
		$.ajax({
		  url: 'getPriceIndicator',
		  cache: false,
		  data:{data:JSON.stringify(data)},
		  success: function(response) {
		  	for(var i=0;i<response.length;i++){
		  		//var tr=$('table[value='+response[i].consCompId+'] tbody tr');
		  		if(response[i].flag==1){
		  			var tr=$('#fieldsetnew table[value=161] tbody input[name=matId][value=1]').parents().eq(1);
		  			$('#'+$(tr).attr("id")+' td[name="unit_des"]').addClass("price-red")
		  		}
		  		else
		  		{
		  			var tr=$('#fieldsetnew table[value=161] tbody input[name=matId][value=1]').parents().eq(1);
		  			$('#'+$(tr).attr("id")+' td[name="unit_des"]').addClass("price-green")
		  		}
		  		var matLength=tr.length;
		  	}
			
		  }
		});
	
}
function showErrorMsg(header ,message,field){
	
	$('#confrmtn_fig').attr('class','info');
var fieldId=[];
if(field!=null)
{  $( field ).each(function() {
		   fieldId.push(this.id);
	    	
	    	});
}
	showConfirmationBox(header,message,null,null,'focusField('+JSON.stringify(fieldId)+')',null,false,false,true,false);
	
}

function focusField(field)
{
	hideConfirmationBox();
	//var myJsonString = JSON.parse(field);
	if(field.length!=0)
	{	   $( field ).each(function() {
		 //  $('#'+this).css("border","2px solid red");
		   $('#'+this).addClass("error_field");
	    	});
	
	
	$('#'+field[0]).focus();
	}
	
	}
function hideSaveMsg()
{
	$('#confirmationBox').attr('class', 'gray-box hidden');

/*var page = $('#page_projects_su').jqPagination('getParam','current_page');
if (page != 1) {
	page = ((page - 1) * 25)+1;
}*/
//getStakedUnitProjects(page,26,true);
viewHomeProject($('figure.active').prev().val());
}

function hideNotification(materialMismatch)

{$('#confirmationBox').attr('class', 'gray-box hidden');

var materialDetails=materialMismatch;
//navigateToMenu(stakedunitsList);
var page = $('#page_projects_su').jqPagination('getParam','current_page');
if (page != 1) {
	page = ((page - 1) * 25)+1;
}
//getStakedUnitProjects(page,26,true);
//viewHomeProject($('figure.active').prev().val());

if(materialDetails=="false"){
  saveStakedUnits();
}
}


function autoFillRouteValue(obj)
{if($(obj).val()=="")
{
	$(obj).val($(obj).parents("tr").prev().children("td").children("input[name=staked_route]").val())	;
}

}
function autoFillSheetValue(obj)
{if($(obj).val()=="")
{
	$(obj).val($(obj).parents("tr").prev().children("td").children("input[name=staked_sheet]").val())	;
}

}


function loadTemplate()
{
	var my_form = document.createElement('FORM');
	my_form.name = 'Download Template';
	my_form.setAttribute('hidden', true);
	my_form.style = 'display:none;';
	my_form.method = 'POST';
	my_form.action = 'download_file_stakedUnits';
	my_form.setAttribute("target", "_self");
	
	my_tb2 = document.createElement('INPUT');
	my_tb2.type = 'TEXT';
	my_tb2.name = 'projectName';
	my_tb2.value =  $('#projectViewProjectName').html();
	my_form.appendChild(my_tb2);

	my_tb2 = document.createElement('INPUT');
	my_tb2.type = 'TEXT';
	my_tb2.name = 'sapWbsCd';
	my_tb2.value = $('#projectViewSapWbsCode').html();
	my_form.appendChild(my_tb2);
//	
//	Contractor Name
//	Contract Type
//	Company Name
//	Exchange Name
//	Estimation Date//

	
	my_tb2 = document.createElement('INPUT');
	my_tb2.type = 'TEXT';
	my_tb2.name = 'contrNm';
	my_tb2.value = $('#projectViewContractorNm').html();
	my_form.appendChild(my_tb2);
	
	
	my_tb2 = document.createElement('INPUT');
	my_tb2.type = 'TEXT';
	my_tb2.name = 'contrTypeNm';
	my_tb2.value = $('#projectViewContractType').html();
	my_form.appendChild(my_tb2);
	
	
	my_tb2 = document.createElement('INPUT');
	my_tb2.type = 'TEXT';
	my_tb2.name = 'compName';
	my_tb2.value = $('#pri_company_name').html();
	my_form.appendChild(my_tb2);
	
	my_tb2 = document.createElement('INPUT');
	my_tb2.type = 'TEXT';
	my_tb2.name = 'exchange';
	my_tb2.value = $('#pri_exchange_name').html();
	my_form.appendChild(my_tb2);
	
	
	document.body.appendChild(my_form);
	my_form.submit();
	}


function getCaptialExpense()
{
	$.ajax({
		  url: 'get_ce',
		  cache: false,
		  async:false,
		  success: function(response) {
			cEObj=response;
		  }
		});

}




//To Change the Materials And Labour added based on the Labour Only / Material Only Flag when the page is loaded first.
function showLoMo(runCheck){

	var cntr=$('#fieldsetnew div[group=conCmp]');
 	$( cntr ).each(function() {
	var mats=$('#'+this.id+' table tbody tr');
	var dualImg =  $('#'+this.id).find("span.dual-unit a").hasClass("selected");
		$(mats).each(function(){
		var lomo=$(this).find('td[name=lomo]').text()==0?null:$(this).find('td[name=lomo]').text();
		var addDualFlg= 0;
	
			if(dualImg) {
				 addDualFlg= 1;
			} else {
				addDualFlg = 0;
			}
		
			
			

			// WHEN NEW PRICE LIST IS AVAILABLE
			var labPr;
			var matPr;
			var unitDescTd=$(this).find('td[name=unit_des]');
			var isCustom = $(this).children('td[name=isCustom]').text();
			
			if ((addDualFlg==1) && (isCustom==0)){
				labPr = $(this).children('td[name=labor_price_add]'); //==null?$(this).children('td[name=labor_price_add]'):$(this).children('td[name=labor_price]');
				matPr =  $(this).children('td[name=matrl_price_add]'); //==null?$(this).children('td[name=matrl_price_add]'):$(this).children('td[name=matrl_price_add]');
			}else if ((addDualFlg==1) && (isCustom==1)) {
				labPr = $(this).children('td[name=labor_price]'); //==null?$(this).children('td[name=labor_price_add]'):$(this).children('td[name=labor_price]');
				matPr =  $(this).children('td[name=matrl_price]'); //==null?$(this).children('td[name=matrl_price_add]'):$(this).children('td[name=matrl_price_add]');
			}else{
				labPr = $(this).children('td[name=labor_price]'); //==null?$(this).children('td[name=labor_price_add]'):$(this).children('td[name=labor_price]');
				matPr =  $(this).children('td[name=matrl_price]'); //==null?$(this).children('td[name=matrl_price_add]'):$(this).children('td[name=matrl_price_add]');
			}
			
			if(lomo==1){
				//When Labour Only -Hide Material And Show Labour
				if ((addDualFlg==1) && (isCustom==0)){
					matPr.removeClass("hidden");
					matPr.children('input[name=matrl_price_add]').addClass('hidden');
					matPr.parent("tr").find('td[name=matrl_price]').addClass('hidden');
					matPr.attr('lomoHidden', true);
					if (matPr.find('input[name=m_pr_lomo]').length==0){
						matPr.append('<input type="text"  value="0.00" style="text-align: right; width:52px !important" size="7" class="number disabledText" enabled="false"  name="m_pr_lomo" readonly="true" title= "Labour Only selected. Material Price not required">');
					}
				}else if (matPr.children('input[name=matrl_price]').size() > 0) {
						if (!matPr.children('input[name=matrl_price]').hasClass('hidden')) {
							matPr.children('input[name=matrl_price]').addClass('hidden');
							matPr.attr('lomoHidden',true);
							matPr.append('<input type="text"  style="width:52px !important" value="0.00" class="number disabledText" name="m_pr_lomo" readonly="true">'); //onchange="updateLabourValues(this);"
						}
					} else {//try to remove the prev. give direct
						var prev = matPr.prev();
						if (!matPr.hasClass('hidden')) {
							matPr.addClass('hidden');
							matPr.attr('lomoHidden',true);
							prev.after('<td name="m_pr_lomo" id="" class="number"> 0.00</td>');
						}
					}
				$(unitDescTd).removeClass("m_only");
				$(unitDescTd).removeClass("lm_only");
				$(unitDescTd).addClass("l_only");
			}else if(lomo==2){
				if ((addDualFlg==1) && (isCustom==0)){
					labPr.removeClass("hidden");
					labPr.children('input[name=labor_price_add]').addClass('hidden');
					labPr.parent("tr").find('td[name=labor_price]').addClass('hidden');
					labPr.attr('lomoHidden', true);
					if (labPr.find('input[name=l_pr_lomo]').length==0){
						labPr.append('<input type="text"  value="0.00" style="text-align: right; width:52px !important" size="7" class="number disabledText" enabled="false"  name="l_pr_lomo" readonly="true" title= "Material Only selected. Labour Price not required">');
					}
				}else if (labPr.children('input[name=labor_price]').size() > 0) {
					//When Material Only -Hide Labour And Show Material
					if (!labPr.children('input[name=labor_price]').hasClass('hidden')) {
						labPr.children('input[name=labor_price]').addClass('hidden');
						labPr.attr('lomoHidden',true);
						labPr.append('<input type="text"  style="width:52px !important"  value="0.00" class="number disabledText" enabled="false"  name="l_pr_lomo" readonly="true">'); //onchange="updateLabourValues(this);"
					}
				} else {
					var prev = labPr.prev();
					if (!labPr.hasClass('hidden')) {
						labPr.addClass('hidden');
						labPr.attr('lomoHidden',true);
						prev.after('<td  name="l_pr_lomo" id="" class="number"> 0.00</td>');
					}
				}
				$(unitDescTd).removeClass("l_only");
				$(unitDescTd).removeClass("lm_only");
				$(unitDescTd).addClass("m_only");
			}else{
				//When lomo==0 or lomo = null then Show both Labour and Material
				$(unitDescTd).removeClass("l_only");
				$(unitDescTd).removeClass("lm_only")
				$(unitDescTd).removeClass("m_only")
				$(unitDescTd).addClass("lm_only");
			}
				updateLabourWithLoMo($(this),runCheck);
			
		});
	});
}

function setLabourOrMaterialOnly(switchVal, index,flg) {
	var tableid="stackedContents" + index + "table";
	//var chkbx = $('#stackedContents' + index + 'table').find("tr input[name=matChkBx]");
	var chkbx = $("#"+tableid+" input[name='matChkBx']:checked").parents('tr');
	var dualImg =  $('#stackedContents' + index ).find("span.dual-unit a").length;
	var addDualFlg= 0;
	if(dualImg>0) {
		if( $('#stackedContents' + index).find("span.dual-unit a").hasClass("selected")) {
			 addDualFlg= 1;
		} else {
			addDualFlg = 0;
		}
	} else {
		addDualFlg = 0;
	}

	var countChecked = 0;
	$(chkbx)
			.each(
					function() {// may need to change td name also
						
						var isCustom=$(this).find('td[name=isCustom]').text();
							//countChecked++;
							var lomo=$(this).find('td[name=lomo]').text();
							if (lomo==switchVal){
								return;
							}
							var unitDescTd = $(this).find('td[name=unit_des]');
							var labPr;
							if ((addDualFlg == 0) && ($(this).find('td[name=labor_price] input').size() > 0))  {
								if ($(this).find('td[name=labor_price] input').hasClass('hidden')
										&& $(this).find('td[name=labor_price]').attr('lomoHidden')) {
									labPr = $(this).find('td[name=labor_price]');
								} else if ($(this).find('td[name=labor_price]').children('input[name=labor_price]').hasClass('hidden')
										&& !$(this).find('td[name=labor_price]').attr('lomoHidden')) {
									labPr = $(this).find('td[name=new_lp]');
								}
								else {
									labPr = $(this).find('td[name=labor_price]');
								}
							} else if ((addDualFlg == 1) && ($(this).find('td[name=labor_price_add]').children('input[name=labor_price_add]').size() > 0)){
								if(isCustom==1) {
									labPr = $(this).find('td[name=labor_price]');
								} else {
									labPr = $(this).find('td[name=labor_price_add]');
								}
							}else {
								if ($(this).find('td[name=labor_price]').hasClass('hidden')
										&& $(this).find('td[name=labor_price]').attr('lomoHidden')) {
									labPr = $(this).find('td[name=labor_price]');
								} else if ($(this).find('td[name=labor_price]').hasClass('hidden')
										&& !$(this).find('td[name=labor_price]').attr('lomoHidden')) {
									labPr = $(this).find('td[name=new_lp]');
								} else {
									labPr = $(this).find('td[name=labor_price]');
								}
							}

							var matPr;
							if ((addDualFlg == 0) && ($(this).find('td[name=matrl_price]').children('input[name=matrl_price]').size() > 0)) {
								if ($(this).find('td[name=matrl_price]').children('input[name=matrl_price]').hasClass('hidden')
										&& $(this).find('td[name=matrl_price]').attr('lomoHidden')) {
									matPr = $(this).find('td[name=matrl_price]');
								} else if ($(this).find('td[name=matrl_price]').children('input[name=matrl_price]').hasClass('hidden')
										&& !$(this).find('td[name=matrl_price]').attr('lomoHidden')) {
									matPr = $(this).find('td[name=new_mp]');
								} else {
									matPr = $(this).find('td[name=matrl_price]');
								}
							} else if ((addDualFlg == 1) && ($(this).find('td[name=matrl_price_add]').children('input[name=matrl_price_add]').size() > 0)) {
								if(isCustom==1) {
									matPr = $(this).find('td[name=matrl_price]');

								} else {
									matPr = $(this).find('td[name=matrl_price_add]');

								}
							}else {
								if ($(this).find('td[name=matrl_price]').hasClass('hidden')
										&& $(this).find('td[name=matrl_price]').attr('lomoHidden')) {
									matPr = $(this).find('td[name=matrl_price]');
								} else if ($(this).find('td[name=matrl_price]').hasClass('hidden')
										&& !$(this).find('td[name=matrl_price]').attr('lomoHidden')) {
									matPr = $(this).find('td[name=new_mp]');
								} else {
									matPr = $(this).find('td[name=matrl_price]');
								}
							}
							if (switchVal == 1) {
								// show labour
								if (labPr.children('input[name=labor_price]').size() > 0) {/* input */
									if (labPr.children('input[name=labor_price]').hasClass('hidden')) {
										labPr.children('input[name=l_pr_lomo]').addClass('hidden');
										labPr.children('input[name=labor_price]').removeClass('hidden');
										labPr.attr('lomoHidden', false);
									}
								}else if(labPr.children('input[name=labor_price_add]').size() > 0) {/* input */
									
									labPr.attr('lomoHidden', false);
									labPr.children('input[name=l_pr_lomo]').addClass('hidden');
									labPr.parent("tr").find('td[name=l_pr_lomo]').addClass('hidden');
									labPr.parent("tr").find('td[name=labor_price]').addClass('hidden');
									labPr.attr('readonly', false);
									labPr.children('input[name=labor_price_add]').removeClass('hidden');
									labPr.children('input[name=labor_price_add]').removeClass('disabledText');
									labPr.removeClass('hidden');
									labPr.children('input[name=labor_price_add]').attr("readonly",false);
									
								} else {
									if (labPr.hasClass('hidden')) {
										labPr.removeClass('hidden');
										labPr.attr('lomoHidden', false);
										$(this).find('td[name=l_pr_lomo]').remove();
									}
								}
								// hide mat
								if (matPr.children('input[name=matrl_price]').size() > 0) {/* input */
									if (!matPr.children('input[name=matrl_price]').hasClass('hidden')) {

										matPr.children('input[name=matrl_price]').addClass('hidden');
										matPr.attr('lomoHidden', true);
										matPr.append('<input type="text"  value="0.00" style="text-align: right; width:52px !important" size="7" class="number disabledText" enabled="false"  name="m_pr_lomo" readonly="true" title= "Labour Only selected. Material Price not required">');
									}
								} else if (matPr.children('input[name=matrl_price_add]').size() > 0) {/* input */
										matPr.removeClass("hidden");
										matPr.children('input[name=matrl_price_add]').addClass('hidden');
										matPr.children('input[name=m_pr_lomo]').removeClass('hidden');
										matPr.parent("tr").find('td[name=matrl_price]').addClass('hidden');
										matPr.attr('lomoHidden', true);
										if (matPr.find('input[name=m_pr_lomo]').length==0){
											matPr.append('<input type="text"  value="0.00" style="text-align: right; width:52px !important" size="7" class="number disabledText" enabled="false" name="m_pr_lomo" readonly="true" title= "Labour Only selected. Material Price not required">');
										}
								}else {// try to remove the prev. give direct
									var prev = matPr.prev();
									if (!matPr.hasClass('hidden')) {
										matPr.addClass('hidden');
										matPr.attr('lomoHidden', true);
										prev.after('<td name="m_pr_lomo" id="" class="number"> 0.00</td>');
									}
								}
								$(this).find('td[name=lomo]').text(1);
								$(unitDescTd).removeClass("m_only");
								$(unitDescTd).removeClass("lm_only");
								$(unitDescTd).addClass("l_only");
							} else if (switchVal == 2) {
								// mat only:hide lab , show mat
								// show mat
								if (matPr.children('input[name=matrl_price]').size() > 0) {/* input */
									if (matPr.children('input[name=matrl_price]').hasClass('hidden')) {
										matPr.children('input[name=m_pr_lomo]').addClass('hidden');
										matPr.children('input[name=matrl_price]').removeClass('hidden');
										matPr.attr('lomoHidden', false);
									}
								} else if (matPr.children('input[name=matrl_price_add]').size() > 0) {/* input */
									matPr.attr('lomoHidden', false);
									matPr.children('input[name=m_pr_lomo]').addClass('hidden');
									matPr.parent("tr").find('td[name=m_pr_lomo]').addClass('hidden');
									matPr.attr('readonly', false);
									matPr.children('input[name=matrl_price_add]').removeClass('disabledText');
									matPr.children('input[name=matrl_price_add]').removeClass('hidden');
									matPr.parent("tr").find('td[name=matrl_price]').addClass('hidden'); //saritha added for material only case
									matPr.removeClass('hidden');
									matPr.children('input[name=matrl_price_add]').attr("readonly",false);
									
								}else {
									if (matPr.hasClass('hidden')) {
										matPr.removeClass('hidden');
										matPr.attr('lomoHidden', false);
										$(this).find('td[name=m_pr_lomo]').remove();
									}
								}
								// hide lab
								if (labPr.children('input[name=labor_price]').size() > 0) {/* input */
									if (!labPr.children('input[name=labor_price]').hasClass('hidden')) {
										labPr.children('input[name=labor_price]').addClass('hidden');
										labPr.attr('lomoHidden', true);
										labPr.append('<input type="text"  value="0.00" style="text-align: right; width:52px !important" size="7" class="number disabledText" enabled="false"  name="l_pr_lomo" readonly="true" title= "Material Only selected. Labour Price not required">');
									}
								}else if (labPr.children('input[name=labor_price_add]').size() > 0) {/* input */
										labPr.removeClass("hidden");
										labPr.children('input[name=labor_price_add]').addClass('hidden');
										labPr.parent("tr").find('td[name=labor_price]').addClass('hidden');
										labPr.attr('lomoHidden', true);
										labPr.find('input[name=l_pr_lomo]').removeClass('hidden');
										if (labPr.find('input[name=l_pr_lomo]').length==0){
											labPr.append('<input type="text"  value="0.00" style="text-align: right; width:52px !important" size="7" class="number disabledText" enabled="false"  name="l_pr_lomo" readonly="true" title= "Material Only selected. Labour Price not required">');
										}
								} else {
									var prev = labPr.prev();
									if (!labPr.hasClass('hidden')) {
										labPr.addClass('hidden');
										labPr.attr('lomoHidden', true);
										prev.after('<td  name="l_pr_lomo" id="" class="number"> 0.00</td>');
									}
								}

								$(this).find('td[name=lomo]').text(2);
								$(unitDescTd).removeClass("l_only");
								$(unitDescTd).removeClass("lm_only");
								$(unitDescTd).addClass("m_only");
							} else if (switchVal == 0)
							{
								//IF LA AND MAT SHOW BOTH LABOUR AND MATERIAL
								// show lab
								if (labPr.children('input[name=labor_price]').size() > 0) {/* input */
									if (labPr.children('input[name=labor_price]').hasClass('hidden')) {
										labPr.children('input[name=l_pr_lomo]').addClass('hidden');
										labPr.children('input[name=labor_price]').removeClass('hidden');
									}
								}else if (labPr.children('input[name=labor_price_add]').size() > 0) {/* input */
										labPr.children('input[name=l_pr_lomo]').addClass('hidden');
										labPr.children('input[name=labor_price_add]').removeClass('hidden');
										labPr.children('input[name=labor_price_add]').removeClass('disabledText');
										labPr.children('input[name=labor_price_add]').attr("readonly",false);
								} else {
									if (labPr.hasClass('hidden')) {
										labPr.removeClass('hidden');
										$(this).find('td[name=l_pr_lomo]').remove();
									}
								}
								// show mat
								if (matPr.children('input[name=matrl_price]').size() > 0) {/* input */
									if (matPr.children('input[name=matrl_price]').hasClass('hidden')) {
										matPr.children('input[name=m_pr_lomo]').addClass('hidden');
										matPr.children('input[name=matrl_price]').removeClass('hidden');
									}
								}else if (matPr.children('input[name=matrl_price_add]').size() > 0) {/* input */
										matPr.children('input[name=m_pr_lomo]').addClass('hidden');
										matPr.children('input[name=matrl_price_add]').removeClass('hidden');
										matPr.children('input[name=matrl_price_add]').removeClass('disabledText');
										matPr.children('input[name=matrl_price_add]').attr("readonly",false);
								} else {
									if (matPr.hasClass('hidden')) {
										matPr.removeClass('hidden');
										$(this).find('td[name=m_pr_lomo]').remove();
									}
								}
								$(this).find('td[name=lomo]').text(0);
								$(unitDescTd).removeClass("l_only");
								$(unitDescTd).removeClass("m_only");
								$(unitDescTd).addClass("lm_only");
							}
							// Update Sum of Extended Labout and Material and Total 
							updateLabourWithLoMo($(this),true);
						

			});
	updateTotalLabour(tableid);
	updateTotlabFiltered($('#stackedContents' + index).find("input[name=chekboxAll]"));
	
	if ($("#"+tableid+" input[name='matChkBx']:checked").length==0){
		showInfo('No Row Selected','Please Select Atleast One Material');
	}

}



function updateLabourWithLoMo(tableRowobj,runCheck)
{
	var qtyId_ = $(tableRowobj).find('td[name=matQty] input').attr("id");
	var qtyVal = $('#'+qtyId_).val();
	var isCustom = $(tableRowobj).find('td[name=isCustom]').text();

	
	var unitLabVal ;
	var addDualFlg=($(tableRowobj).find('td[name=addDualUnit]').text()==''||$(tableRowobj).find('td[name=addDualUnit]').text()==0)?0:$(tableRowobj).find('td[name=addDualUnit]').text();
	
	if (addDualFlg==0){
		var labPr_ = $(tableRowobj).find('td[name=labor_price]').attr("id");
		unitLabVal = parseFloat(($('#'+labPr_).find('input[name=labor_price]').length==0?$(tableRowobj).find('td[name=labor_price]').text():$('#'+labPr_).find('input[name=labor_price]').attr("value")).replace(/,/g, ''));
	}else{
		if (isCustom==1){
			unitLabVal = parseFloat(($(tableRowobj).find('td[name=labor_price]').find('input[name=labor_price]').length==0?$('#'+labPr_).text():$(tableRowobj).find('td[name=labor_price]').find('input[name=labor_price]').attr("value")).replace(/,/g, ''));
		}else{
				unitLabVal = parseFloat(($(tableRowobj).find('td[name=labor_price_add]').find('input[name=labor_price_add]').length==0?$('#'+labPr_).text():$(tableRowobj).find('td[name=labor_price_add]').find('input[name=labor_price_add]').attr("value")).replace(/,/g, ''));
		}
	}
	var unitMatVal ;
	if (addDualFlg==0){
		var matPr_ = $(tableRowobj).find('td[name=matrl_price]').attr("id");
		unitMatVal =   parseFloat(($('#'+matPr_).find('input[name=matrl_price]').length==0?$(tableRowobj).find('td[name=matrl_price]').text():$('#'+matPr_).find('input[name=matrl_price]').attr("value")).replace(/,/g, ''));
	}else{
		if (isCustom==1){
			unitMatVal =   parseFloat(($(tableRowobj).find('td[name=matrl_price]').find('input[name=matrl_price]').length==0?$('#'+matPr_).text():$(tableRowobj).find('td[name=matrl_price]').find('input[name=matrl_price]').attr("value")).replace(/,/g, ''));
		}else{
				unitMatVal =   parseFloat(($(tableRowobj).find('td[name=matrl_price_add]').find('input[name=matrl_price_add]').length==0?$('#'+matPr_).text():$(tableRowobj).find('td[name=matrl_price_add]').find('input[name=matrl_price_add]').attr("value")).replace(/,/g, ''));
		}
	}
	// If Labour only then Material charge not required in calculation and if Material only then Labour not required
	var lomo =$(tableRowobj).find('td[name=lomo]').text()==0?null:$(tableRowobj).find('td[name=lomo]').text();
	if(lomo==1){
		unitMatVal=0;
	}else if(lomo==2){
		unitLabVal=0;
	}
	var extLabVal=qtyVal*unitLabVal;
	var extMatVal=qtyVal*unitMatVal;
	var dgnStackedTotal=extLabVal+extMatVal;
	
	$(tableRowobj).find('td[name=extlab]').text($.formatNumber(extLabVal, {format:"#,##0.00", locale:"us"}));
	$(tableRowobj).find('td[name=extmat]').text($.formatNumber(extMatVal, {format:"#,##0.00", locale:"us"}));
	$(tableRowobj).find('td[name=totalLabMat]').text($.formatNumber(extLabVal+extMatVal, {format:"#,##0.00", locale:"us"}));
	

	if (runCheck==null){
		var tableId=$(tableRowobj).parents("table").attr("id");
		updateTotalLabour(tableId);
		var chkbx= $(tableRowobj).parent().find("tr input[name=matChkBx]");
		$(chkbx).each(function() {// may need to change td name also
			if (($(this).prop('checked'))) {
				updateTotlabFiltered(this);
			}
		});
	}
}

function showAdditionalDualUnit(id){
	tableid =id+"table";
	var rowObject = $( '#'+tableid+" tbody input:checkbox" );
	var totalRow = $( '#'+tableid+" tbody input:checkbox" ).length;
	var isCustom =0;
	
	var dualImg =  $('#' + id ).find("span.dual-unit a").length;
	var addDualFlg= 0;
	if(dualImg>0) {
		if( $('#' + id).find("span.dual-unit a").hasClass("selected")) {
			 addDualFlg= 1;
		} else {
			addDualFlg = 0;
		}
	} else {
		addDualFlg = 0;
	}
	var mats=$('#'+id+' table tbody tr');
	if(addDualFlg == 0) { // not dual
		
		$("#"+id).find("span.dual-unit a").addClass("selected");
		$("#"+id).find("span.dual-unit a i").prop('title',"Click to Disable Additional Dual Unit");
		addDualFlg =1;
		$(mats).each(function(){
			
			 //$('#'+rowObject[i].id).parents().eq(1).children("td[name='addDualUnit']").text("1");
			 $(this).find("td[name='addDualUnit']").text("1");
			isCustom = $(this).find("td[name='isCustom']").text();
			if(isCustom==0) {
				
				var lomo =$(this).find('td[name=lomo]').text()==null?0:$(this).find('td[name=lomo]').text();
				
				$(this).find("td[name='labor_price']").addClass("hidden");
				$(this).find("td[name='matrl_price']").addClass("hidden");
				$(this).find("td[name='l_pr_lomo']").addClass("hidden");
				$(this).find("td[name='m_pr_lomo']").addClass("hidden");
				$(this).find("td[name='labor_price_add']").removeClass("hidden");
				$(this).find("td[name='matrl_price_add']").removeClass("hidden");
				if 	(lomo==0){
					$(this).find("td[name='labor_price_add']").children('input[name=labor_price_add]').attr("readonly",false);
					$(this).find("td[name='matrl_price_add']").children('input[name=matrl_price_add]').attr("readonly",false);
					$(this).find("td[name='labor_price_add']").children('input[name=labor_price_add]').removeClass("hidden");
					$(this).find("td[name='matrl_price_add']").children('input[name=matrl_price_add]').removeClass("hidden");
					$(this).find("td[name='labor_price_add']").children('input[name=l_pr_lomo]').addClass("hidden");
					$(this).find("td[name='matrl_price_add']").children('input[name=m_pr_lomo]').addClass("hidden");
					$(this).find("td[name='labor_price_add']").children('input[name=labor_price_add]').removeClass("disabledText");
					$(this).find("td[name='matrl_price_add']").children('input[name=matrl_price_add]').removeClass("disabledText");
				
				}else if (lomo==1){
					
					$(this).find("td[name='labor_price_add']").children('input[name=labor_price_add]').attr("readonly",false);
					$(this).find("td[name='matrl_price_add']").children('input[name=matrl_price_add]').attr("readonly",true);
					$(this).find("td[name='matrl_price_add']").children('input[name=matrl_price_add]').addClass("disabledText");
					$(this).find("td[name='labor_price_add']").children('input[name=labor_price_add]').removeClass("disabledText");
					$(this).find("td[name='matrl_price_add']").children('input[name=matrl_price_add]').addClass("hidden");
					$(this).find("td[name='labor_price_add']").children('input[name=l_pr_lomo]').addClass("hidden");
					$(this).find("td[name='labor_price_add']").children('input[name=labor_price_add]').removeClass("hidden");
					$(this).find("td[name='matrl_price_add']").children('input[name=m_pr_lomo]').removeClass("hidden");
				}else if (lomo==2){
				$(this).find("td[name='matrl_price_add']").children('input[name=matrl_price_add]').attr("readonly",false);
				$(this).find("td[name='labor_price_add']").children('input[name=labor_price_add]').attr("readonly",true);
				$(this).find("td[name='labor_price_add']").children('input[name=labor_price_add]').addClass("disabledText");
				$(this).find("td[name='matrl_price_add']").children('input[name=matrl_price_add]').removeClass("disabledText");
				$(this).find("td[name='labor_price_add']").children('input[name=labor_price_add]').addClass("hidden");
				$(this).find("td[name='labor_price_add']").children('input[name=l_pr_lomo]').removeClass("hidden");
				$(this).find("td[name='matrl_price_add']").children('input[name=m_pr_lomo]').addClass("hidden");
				$(this).find("td[name='matrl_price_add']").children('input[name=matrl_price_add]').removeClass("hidden");
				}	
			}
			//updateLabourWithLoMo($(this),true);
			
		})
		
			
	}
	else{
			$("#"+id).find("span.dual-unit a").removeClass("selected");
			$("#"+id).find("span.dual-unit a i").prop('title',"Click to Enable Additional Dual Unit");
			addDualFlg =0;
			$(mats).each(function(){
				$(this).find("td[name='addDualUnit']").text("0");

				isCustom = $(this).find("td[name='isCustom']").text();
				if(isCustom==0) {
					isCustom = $(this).find("td[name='labor_price']").removeClass("hidden");
					isCustom = $(this).find("td[name='labor_price_add']").addClass("hidden");
					isCustom = $(this).find("td[name='matrl_price']").removeClass("hidden");
					isCustom = $(this).find("td[name='matrl_price_add']").addClass("hidden");
					
				}
				//updateLabourWithLoMo($(this),true);
			})
			
		}
	showLoMo(true);
	updateTotalLabour(tableid);
	updateTotlabFiltered($('#' + id ).find("input[name=chekboxAll]"));
}
function linkAdditionalDualUnit(id){

  
	tableid =id+"table";
	var checkedmaterials=$( '#'+tableid+" tbody input:checked" );

	var numChecked = $( '#'+tableid+" tbody input:checked" ).length;
	var maxDualGroupNo = 0;
	if(numChecked==0)
	{
		showInfo('No Row Selected','Please Select Atleast One Row');
	
	} else if(numChecked==1) {
		findMaxDualNumber(id);
		if($('#'+checkedmaterials[0].id).parents().eq(1).children("td[name='dualGroupNo']").text()!="") {
			showInfo('Link Material','Selected material(s) which are already linked');	
		} else {
			if($('#'+checkedmaterials[0].id).parents().eq(1).children("td[name='maxDualGroupNo']").text()=="" || $('#'+checkedmaterials[0].id).parents().eq(1).children("td[name='maxDualGroupNo']").text()==null) {
				maxDualGroupNo = 1;
			}   else {
				 maxDualGroupNo = parseInt($('#'+checkedmaterials[0].id).parents().eq(1).children("td[name='maxDualGroupNo']").text())+1;
			}		
			$('#'+checkedmaterials[0].id).parents().eq(1).children("td[name='dualGroupNo']").text(maxDualGroupNo);
		}
		return;
	} else {
		findMaxDualNumber(id);
		var firstChkDualVal = $('#'+checkedmaterials[0].id).parents().eq(1).children("td[name='dualGroupNo']").text();
		var dupFlg = false;
		var noValFlg = false;
		maxDualGroupNo = parseInt($('#'+checkedmaterials[0].id).parents().eq(1).children("td[name='maxDualGroupNo']").text())+1;
		for (var i=1; i<numChecked; i++){
			if(firstChkDualVal=="") {
				firstChkDualVal = $('#'+checkedmaterials[i].id).parents().eq(1).children("td[name='dualGroupNo']").text();
				noValFlg = true;
			} 
			var dualVal = $('#'+checkedmaterials[i].id).parents().eq(1).children("td[name='dualGroupNo']").text();
			if((dualVal!=""  && firstChkDualVal !="") && firstChkDualVal!=dualVal) {
				showInfo('Link Material','Please select same material Dual Unit');
				dupFlg = true;
				return;
			} else {
				if(dualVal=="" || firstChkDualVal=="") {
					noValFlg = true;
				}
				if(firstChkDualVal!= "" && dualVal>firstChkDualVal) {
					maxDualGroupNo = dualVal;
				} else if(firstChkDualVal!= "" && firstChkDualVal>dualVal) {
					maxDualGroupNo = firstChkDualVal;
				}  else if(firstChkDualVal!= "" &&firstChkDualVal==dualVal) {
					maxDualGroupNo = firstChkDualVal;
				}
			}
		}
		if(firstChkDualVal==""&& dualVal==""&&maxDualGroupNo==0) {
			maxDualGroupNo = 1;
		}
		if(!noValFlg) {
			showInfo('Link Material','Selected material(s) which are already linked');	
			return;
		}
		if(!dupFlg) {
			for (var i=0; i<numChecked; i++){
				$('#'+checkedmaterials[i].id).parents().eq(1).children("td[name='dualGroupNo']").text(maxDualGroupNo);
			}
		}
	
	}
	
}
function unlinkConfirmationAdditionalDualUnit(id){
	tableid =id+"table";
	var checkedmaterials=$( '#'+tableid+" tbody input:checked" );
	var numChecked = $( '#'+tableid+" tbody input:checked" ).length;
	
	if(numChecked==0)
	{
		showInfo('No Row Selected','Please Select Atleast One Row');
	
	} else {	
		var chkFlg = false;
		for (var i=0; i<numChecked; i++) {
			if($('#'+checkedmaterials[i].id).parents().eq(1).children("td[name='dualGroupNo']").text()>0) {
				chkFlg = true;
				showConfirmationBox('Unlink Material','Are you sure you want to unlink the material?','unlinkAdditionalDualUnit("'+id+'");','hideConfirmationBox()',null,null,true,true,false,false);
				break;
			}
		}
		if(!chkFlg) {
			showInfo('Unlink Material','Please Select linked material');
		}
	}
	
}
function unlinkAdditionalDualUnit(id){
	hideConfirmationBox();
	tableid =id+"table";
	var checkedmaterials=$( '#'+tableid+" tbody input:checked" );
	var numChecked = $( '#'+tableid+" tbody input:checked" ).length;
	for (var i=0; i<numChecked; i++){
		$('#'+checkedmaterials[i].id).parents().eq(1).children("td[name='dualGroupNo']").text("");
	}
	
}

function findMaxDualNumber(id) {

	tableid =id+"table";
	var rowObject = $( '#'+tableid+" tbody input:checkbox" );
	var totalRow = $( '#'+tableid+" tbody input:checkbox" ).length;
	
	var maxVal = $('#'+rowObject[0].id).parents().eq(1).children("td[name='dualGroupNo']").text();
	var nextVal;
	if(maxVal=="") {
		maxVal = 0;
	}
	if(totalRow>1) {
		for (var i=1; i<totalRow; i++){	
			
			nextVal = $('#'+rowObject[i].id).parents().eq(1).children("td[name='dualGroupNo']").text();
			if(parseInt(nextVal)>parseInt(maxVal)) {
				maxVal =  nextVal;
			}
		}
	}

	for (var i=0; i<totalRow; i++){
		$('#'+rowObject[i].id).parents().eq(1).children("td[name='maxDualGroupNo']").text(maxVal);
	}
}
