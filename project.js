var projectFilters = [], currentFilter, pages, paginationStatus;
var mainTabId;
var projectCompanyList = [];
var projectExchangeList = [];
var stateFiltered =false;
var companyFiltered =false;
var exchangeFiltered =false;
var multipleCompanyExchangeFiltered =false;
var MULTISORT_FIELD_TOTAL_COUNT=8;
var currentModuleScope ;
var isSaveSearchCriteria;
var MULTISORT_FIELD = 1;
var MULTISORT_ORDER = 2;
var MULTISORT_FLAG = 3;
var globalProjectSelectedObj=null;

function setCurrentModuleScope()
{mainTabId=$('#mainTabList li[class="selected"]').attr('idVal'); 


	if(mainTabId==6)
		{
		currentModuleScope=58;
		}
	else if(mainTabId==7)
		{
		currentModuleScope=57;
		}
	else
		{
		currentModuleScope=56;
		}
	return currentModuleScope;
	}
//setCurrentModuleScope(mainTabId);
function showProjectHomeSearchOptionsGrayBox(type) { //alert(type);
	//alert(projectsSearchMode);
	/*design =1 , construction=2, common=0*/
	var currentScreenStatus;
switch(projectsSearchMode){
case 'pr':
	currentScreenStatus=0;
	break;
case 'su':
	currentScreenStatus=1;
	break;
case 'oh':
	currentScreenStatus=1;
	break;
case 'es':
	currentScreenStatus=1;
	break;
case 'ef':currentScreenStatus=1;
	break;
case 'ca':currentScreenStatus=2;
	break;
case 'cas':currentScreenStatus=2;
	break;
case 'coh':currentScreenStatus=2;
	break;
case 'caf':currentScreenStatus=2;
	break;
case 'ispL':currentScreenStatus=0;
	break;
case 'ispM':currentScreenStatus=0;
	break;
case 'ispO':currentScreenStatus=0;
break;
case 'ospL':currentScreenStatus=0;
	break;
case 'ospM':currentScreenStatus=0;
	break;
case 'ospO':currentScreenStatus=0;
	break;
case 'ospE':currentScreenStatus=0;
	break;
case 'alaC':currentScreenStatus=0;
	break;
case 'prL':currentScreenStatus=0;
break;
case 'ispEstMat':currentScreenStatus=1;
	break;
case 'ipEng':currentScreenStatus=0;
	break;
case 'redlines':currentScreenStatus=2;
	break;
case 'hldrom':currentScreenStatus=0;
break;	
case 'trnsln':currentScreenStatus=0;
	break;
case 'chngs':currentScreenStatus=2;
break;	
case 'jcr':currentScreenStatus=2;
	break;
case 'ispEngg':currentScreenStatus=0;
	break;
case 'inspectns':currentScreenStatus=2;
	break;
case 'circuitInfo':currentScreenStatus=0;
	break;
case 'cableR':currentScreenStatus=0;
break;
default:currentScreenStatus=0;
}

	$.ajax({
				url : 'projectAdvancedSearchOptions',
				cache : false,
				data : {
					currentScope : setCurrentModuleScope(),
					currentScreenStatus:currentScreenStatus
				},
				success : function(response) {
					$('#searchOptionsBox').html(response);
					showAdVancedSearchGrayBox();
					 stateFiltered =false;
					 companyFiltered =false;
					 exchangeFiltered =false;
					 multipleCompanyExchangeFiltered =false;
					// updateProjectsFilterForm(null);
				}
			});
}

/*
 * $( "#manage_ftr" ).click(function() { //alert( "Handler for .click() called." );
 * showFilterPanel(); });
 */
function showFilterPanel() {// alert("aaa");

	$.ajax({
				url : 'projectAdvancedSearch_filter',
				cache : false,
				data : {},
				success : function(response) {
					$('#popupbox').html(response);
					showAdVancedSearchFilterPopup();
				}
			});
}
function saveProjectSearchCriteria(searchName, filter) {
  //in saveProjectSearchCriteria
	var date1 = new Date($('#createdFrom_prj_filter').val());

	var date2 = new Date($('#createdTo_prj_filter').val());
	if ($('#createdFrom_prj_filter').val() && $('#createdTo_prj_filter').val()) {
		if (!(date1 <= date2)) {
			showMessage('Save Criteria',
					'From date should be less than to date');
			return;
		}
	}

	filter = (filter ? filter : currentFilter);
	searchName = searchName || (filter ? filter.searchName : null);
	searchName = searchName.replace(' (Default)', '');
	if (!searchName) {
		showMessage('Error', 'Error while saving.');
		return;
	}

	var sortBy = "";
	var selectedMultiSortOptions =$('#rightValues option');
	var selectedMultiSortVal='';
	for(var i=0;i<selectedMultiSortOptions.length;i++)
		{
		selectedMultiSortVal+=selectedMultiSortOptions[i].value+' '+selectedMultiSortOptions[i].getAttribute('sortVal');
		 if((i+1)!=selectedMultiSortOptions.length)
		  {
			 selectedMultiSortVal+=','
		  }
		}
	var data = {
		curScope : setCurrentModuleScope(),
		offset : 1,
		limit : 26,
		frmSearch : true,
		//TODO remove searchFrom
		searchFrom : 1,
		searchName : searchName,
		searchId : filter ? filter.searchId : null,
		isDefault : ($('#set_as_default')[0].checked ? 1 : 0),
		caPrjId : $('#projectId_prj_filter').val().trim(),
		sapWbsCd : $('#sapWbsCode_prj_filter').val().trim(),
		projectName : $('#pjtName_prj_filter').val().trim(),
		lobType : ($('#projectType_prj_filter').val()
				? $('#projectType_prj_filter').val().join(',')
				: null),
		prjPhase : ($('#phase_prj_filter').val() ? $('#phase_prj_filter').val()
				.join(',') : null),
		projectScopeId : $('#pjtScope_prj_filter').val(),//jan 20
		owner : ($('#owner_prj_filter').val()
				? $('#owner_prj_filter').val().join('`')
						: null),
		stateId : $('#state_prj_filter option:selected').val(),
		prjCompany : $('#company_prj_filter option:selected').val(),
		exchangeId : $('#exchange_prj_filter option:selected').val(),
		msegId : $('#marketSeg_prj_filter option:selected').val(),
		prjCrtdFrm : $('#createdFrom_prj_filter').val(),
		prjCrtdTo : $('#createdTo_prj_filter').val(),
		phaseDysFrm : $('#phaseDysFrm_prj_filter').val(),
		phaseDysTo : $('#phaseDysTo_prj_filter').val(),
		projectExpedite : $('#expedite_prj_filter').val(),
		module:currentMainTab,
		prjSortBy:selectedMultiSortVal/*for multisort*/
		
		
	};
	
	$.ajax({
		url : 'saveProjectFilterCriteria',
		cache : false,
		data : data,
		success : function(response) {
			if (response) {
				if (response
						&& (response.toLowerCase() == 'criteria name already exists' ||response.indexOf('ORA') != -1)) {
					showMessage('Save Criteria', response);
					return;
				} 
				showMessage('Save Criteria', response);
				$('#popupbox').addClass('hidden');
			}
			currentFilter = data;
			currentFilter.filterId = $('#projectFilter').val();
			$('#current_filter_lbl').html(currentFilter.searchName
					? currentFilter.searchName.replace(' (Default)', '')
					: '');
			
			filterProjectSearch(false,true);
			hideAdVancedSearchGrayBox();
			$('#advanceSearchResetIcon').removeClass('hidden');
			
			
		}
	});

}

function showSaveFilterPanel() {
	var validateFilter = function() {
		var date1 = new Date($('#createdFrom_prj_filter').val());

		var date2 = new Date($('#createdTo_prj_filter').val());
		if ($('#createdFrom_prj_filter').val()
				&& $('#createdTo_prj_filter').val()) {
			if (!(date1 <= date2)) {
				showMessage('Save Criteria',
						'From date should be less than to date');
				return false;
			}
		}
		if (($('#phaseDysFrm_prj_filter').val() && $('#phaseDysTo_prj_filter')
				.val())
				&& Number($('#phaseDysFrm_prj_filter').val()) > Number($('#phaseDysTo_prj_filter')
						.val())) {
			showConfirmationBox(
					"Warning",
					"'Phase Days To' should be greater than or equal to the value of 'Phase Days From'",
					null, null, 'hideConfirmationBox()', null, false, false,
					okButton, false);
			return false;
		}

		return true;

	}
	if (!validateFilter()) {
		return;
	}
	if ($('#pjtFilterSave').val() == 'Update') {
		var filter = null;
		if ($('#projectFilter').val() != -1) {
			filter = projectFilters[$('#projectFilter').val()];
		}
		currentFilter = filter;
		// saveProjectSearchCriteria($('#projectFilter :selected').text(),
		// filter);
	}
	$.ajax({
				url : 'save_search_filter',
				cache : false,
				data : {
					name : (currentFilter && currentFilter.searchName
							? currentFilter.searchName
									.replace(' (Default)', '')
							: '')
				},
				success : function(response) {
					$('#popupbox').html(response);
					showSaveSearchFilterPopup();
				}
			});

}
function searchDashBoardProjectsFilter(offset, limit, init)
{
	//in searchDashBoardProjectsFilter
	var data;
//	if (!isGlobalSearch) {
		var searchName;
		if ($('#projectFilter').val() != -1) {
			searchName = $('#projectFilter :selected').text();
		}
		try {
			if($('#page_projects_db').jqPagination('getParam', 'current_page') != 0){
			$('#page_projects_db').jqPagination('option', 'current_page',
					1, true);
			}
		} catch (err) {
			if (console) {
				console.error(err);
			}
		}
		var sortBy = "";
		/*
		 * getMultiSortParameters--
		 * pass 1 : for fields 
		pass 2: for order
		pass 3: for sortFlag, default sortflag for multi sort=1. but if no fields used in sort sortflag=0*/
		var sortFieldValString=getMultiSortParameters(MULTISORT_FIELD);	
		var sortOrderValString=getMultiSortParameters(MULTISORT_ORDER);
		var sortFlag=1;
		sortFlag=(getMultiSortParameters(MULTISORT_FLAG)==null)?sortFlag:getMultiSortParameters(MULTISORT_FLAG);
		if (currentFilter) {
			var filterName = currentFilter.searchName
					? currentFilter.searchName
							.replace(' (Default)', '')
					: '';
							}
		data = {
			offset : 1,
			limit : 26,
			searchName : isSaveSearchCriteria?filterName:'',
			frmSearch : true,
			searchId : null,
			isDefault : 0,
			searchFrom :0,
			caPrjId : $('#projectId_prj_filter').val().trim(),
			sapWbsCd : $('#sapWbsCode_prj_filter').val().trim(),
			projectName :$('#pjtName_prj_filter').val().trim(),
			lobType : ($('#projectType_prj_filter').val()
					? $('#projectType_prj_filter').val().join(',')
					: null),
			prjPhase :($('#phase_prj_filter').val() ? $('#phase_prj_filter')
					.val().join(',') : null),
					projectScopeId : $('#pjtScope_prj_filter option:selected').val(),
					owner : ($('#owner_prj_filter').val()
							? $('#owner_prj_filter').val().join('`')
									: null),
					stateId : $('#state_prj_filter option:selected').val(),
					prjCompany : $('#company_prj_filter option:selected').val(),
					exchangeId : $('#exchange_prj_filter option:selected').val(),
					msegId : $('#marketSeg_prj_filter option:selected').val(),
			prjCrtdFrm : $('#createdFrom_prj_filter').val(),
			prjCrtdTo : $('#createdTo_prj_filter').val(),
			phaseDysFrm : $('#phaseDysFrm_prj_filter').val(),
			phaseDysTo :$('#phaseDysTo_prj_filter').val(),
			projectExpedite : $('#expedite_prj_filter').val(),
			order :sortBy,//remove this//TODO
			sortFields:sortFieldValString,/*for multisort*/
		    sortOrders:sortOrderValString,
		    sortFlag:sortFlag
			
		};
	/*} else {
		data = {
			offset : 1,
			limit : 26,
			searchFrom : 1,
			searchFlag : 2,
			projectName : $('#txt_global_search_projects').val().trim(),
			sapWbsCd : $('#txt_global_search_projects').val().trim()
		}
	}*/
	var project = projectFilters[$('#projectFilter').val()];

	data['curScope'] = setCurrentModuleScope();
	if (projectListRequest && typeof projectListRequest.abort == 'function') {
		projectListRequest.abort();
	}
	
	projectListRequest = $.ajax({
		url : 'getDashBoardProjectsSearch',
		cache : false,
		data : data,
		success : function(response) {
/*
			$("#projects_grid").jqGrid('clearGridData');
			dashBoardProjectListData.length = 0;
			for (var index = 0; index < response.projectDetails.length; index++) {
				$("#projects_grid").jqGrid('addRowData', index + 1,
						response.projectDetails[index]);
				dashBoardProjectListData.push(response.projectDetails[index]);
			}
			if ($('#page_projects_projects')[0].status) {
				try {
					$('#page_projects_projects').jqPagination('destroy');
				} catch (err) {
					if (console) {
						console.erroe(err);
					}
				}

				// $('#page_projects_projects').jqPagination('option','current_page',
				// 1);
			}
			var pages = 0, totalCount = 0;
			if (response.projectDetails[0]) {
				totalCount = response.projectDetails[0].totalCount;
				pages = Math.ceil(totalCount / 25);
			}

			$('#page_projects_projects').jqPagination({
						link_string : '/?page={page_number}',
						max_page : pages,
						totalCount : totalCount,
						paged : function(page) {
							if (page != 1) {
								page = ((page - 1) * 25) + 1;
							}
							loadProjects(page, 26, null, isGlobalSearch);
						}
					});
			$('#page_projects_projects')[0].status = true;
			
			 * $('#page_projects_projects').jqPagination('option',
			 * 'current_page', 1); var pages =
			 * Math.ceil(response.projectDetails[0].totalCount / 25);
			 * $('#page_projects_projects').jqPagination('option', 'max_page',
			 * pages);
			 
			// if (!currentFilter || $('#projectFilter').val() == -1) {
			if (!isGlobalSearch) {
				currentFilter = data;
				currentFilter.filterId = '';
			} else {
				currentFilter = null;
			}
			// }
			$('#current_filter_lbl').html('');*/
			//TODO recheck code 
			currentFilter = data;
			if(!isSaveSearchCriteria)
				{
				currentFilter.filterId = '';
				}
			
			dashBoardProjectList.length = 0;
			$('#project_list_db').html(response);

			if ($('#page_projects_db')[0].status) {
				try {
					$('#page_projects_db').jqPagination('destroy');
				} catch (err) {
					if (console) {
						console.erroe(err);
					}
				}

				// $('#page_projects_projects').jqPagination('option','current_page',
				// 1);
			}
			
			if (init) {
				//setSearchId();

				var totalCount = 0;
				if (dashBoardProjectList.length != 0) {
					totalCount = dashBoardProjectList[0].totalCount;
					pages = Math.ceil(totalCount / 25);
				}

				else {
					pages = 0;
				}

				$('#page_projects_db').jqPagination({
							link_string : '/?page={page_number}',
							max_page : pages,
							current_page : 1,
							totalCount : totalCount,
							paged : function(page) {

								if (page != 1) {
									page = ((page - 1) * 25) + 1;
								}
								getDashBoardProjects(page, 26,false);

							}
						});
				$('#page_projects_db')[0].status=true;

			}
			loadProjectDetails(0);
		}
	});	
}

function filterProjectSearchFromProjects(isGlobalSearch) {
	var data;
	if (!isGlobalSearch) {
		var searchName;
		if ($('#projectFilter').val() != -1) {
			searchName = $('#projectFilter :selected').text();
		}
		try {
			if ($('#page_projects_projects').jqPagination('getParam', 'max_page') != 0) {
			$('#page_projects_projects').jqPagination('option', 'current_page',
					1, true);
			}
		} catch (err) {
			if (console) {
				console.error(err);
			}
		}
		var sortBy = "";
		/*
		 * getMultiSortParameters--
		 * pass 1 : for fields 
		pass 2: for order
		pass 3: for sortFlag, default sortflag for multi sort=1. but if no fields used in sort sortflag=0*/
		var sortFieldValString=getMultiSortParameters(MULTISORT_FIELD);	
		var sortOrderValString=getMultiSortParameters(MULTISORT_ORDER);
		var sortFlag=1;
		sortFlag=(getMultiSortParameters(MULTISORT_FLAG)==null)?sortFlag:getMultiSortParameters(MULTISORT_FLAG);
		if (currentFilter) {
			var filterName = currentFilter.searchName
					? currentFilter.searchName
							.replace(' (Default)', '')
					: '';
							}
		
		data = {
			offset : 1,
			limit : 26,
			searchName : isSaveSearchCriteria? filterName:'',
			frmSearch : true,
			searchId : null,
			searchFrom : 1,
			isDefault : 0,
			caPrjId : $('#projectId_prj_filter').val().trim(),
			sapWbsCd : $('#sapWbsCode_prj_filter').val().trim(),
			projectName : $('#pjtName_prj_filter').val().trim(),
			lobType : ($('#projectType_prj_filter').val()
					? $('#projectType_prj_filter').val().join(',')
					: null),
			prjPhase :($('#phase_prj_filter').val() ? $('#phase_prj_filter')
					.val().join(',') : null),
					projectScopeId : $('#pjtScope_prj_filter option:selected').val(),
					owner : ($('#owner_prj_filter').val()
							? $('#owner_prj_filter').val().join('`')
									: null),
					stateId : $('#state_prj_filter option:selected').val(),
					prjCompany : $('#company_prj_filter option:selected').val(),
					exchangeId : $('#exchange_prj_filter option:selected').val(),
					msegId : $('#marketSeg_prj_filter option:selected').val(),
			prjCrtdFrm : $('#createdFrom_prj_filter').val(),
			prjCrtdTo : $('#createdTo_prj_filter').val(),
			phaseDysFrm : $('#phaseDysFrm_prj_filter').val(),
			phaseDysTo :$('#phaseDysTo_prj_filter').val(),
			projectExpedite : $('#expedite_prj_filter').val(),
			order :sortBy,//remove this//TODO
			sortFields:sortFieldValString,/*for multisort*/
		    sortOrders:sortOrderValString,
		    sortFlag:sortFlag
			
		};
	} else {
		data = {
			offset : 1,
			limit : 26,
			searchFrom : 1,
			searchFlag : 2,
			projectName :  ($('#txt_global_search_projects')
					? $('#txt_global_search_projects').val().trim()
							: null),
			sapWbsCd :  ($('#txt_global_search_projects')
					? $('#txt_global_search_projects').val().trim()
							: null),
			caPrjId :  ($('#txt_global_search_projects')
									? $('#txt_global_search_projects').val().trim()
											: null)				
		}
	}
	var project = projectFilters[$('#projectFilter').val()];

	data['curScope'] = setCurrentModuleScope();
	if (projectListRequest && typeof projectListRequest.abort == 'function') {
		projectListRequest.abort();
	}
	
	$("#projects_grid").setGridParam({sortname: ""});// jan 20 : to clear grid sort after taking 2nd time advanced search
	
	projectListRequest = $.ajax({
		url : 'filterProjectSearch',
		cache : false,
		data : data,
		success : function(response) {

			$("#projects_grid").jqGrid('clearGridData');
			dashBoardProjectListData.length = 0;
			for (var index = 0; index < response.projectDetails.length; index++) {
				$("#projects_grid").jqGrid('addRowData', index + 1,
						response.projectDetails[index]);
				dashBoardProjectListData.push(response.projectDetails[index]);
			}
			if ($('#page_projects_projects')[0].status) {
				try {
					$('#page_projects_projects').jqPagination('destroy');
				} catch (err) {
					if (console) {
						console.erroe(err);
					}
				}

				// $('#page_projects_projects').jqPagination('option','current_page',
				// 1);
			}
			var pages = 0, totalCount = 0;
			if (response.projectDetails[0]) {
				totalCount = response.projectDetails[0].totalCount;
				pages = Math.ceil(totalCount / 25);
			}

			$('#page_projects_projects').jqPagination({
						link_string : '/?page={page_number}',
						max_page : pages,
						totalCount : totalCount,
						paged : function(page) {
							if (page != 1) {
								page = ((page - 1) * 25) + 1;
							}
							loadProjects(page, 26, null, isGlobalSearch);
						}
					});
			$('#page_projects_projects')[0].status = true;
			/*
			 * $('#page_projects_projects').jqPagination('option',
			 * 'current_page', 1); var pages =
			 * Math.ceil(response.projectDetails[0].totalCount / 25);
			 * $('#page_projects_projects').jqPagination('option', 'max_page',
			 * pages);
			 */
			// if (!currentFilter || $('#projectFilter').val() == -1) {
			if (!isGlobalSearch) {
				currentFilter = data;
				if(!isSaveSearchCriteria)
					{
					currentFilter.filterId = '';
					}
				//
			} else {
				currentFilter = null;
			}
			// }
		//
			if(!isSaveSearchCriteria)
			{
				$('#current_filter_lbl').html('');
			}
		}
	});

}

function filterProjectSearch(isGlobalSearch,isSaveSearchCriteriaFlag) {
//alert(isGlobalSearch);
	isSaveSearchCriteria = isSaveSearchCriteriaFlag;
	
	var validateFilter = function() {
		var date1 = new Date($('#createdFrom_prj_filter').val());

		var date2 = new Date($('#createdTo_prj_filter').val());
		if ($('#createdFrom_prj_filter').val()
				&& $('#createdTo_prj_filter').val()) {
			if (!(date1 <= date2)) {
				showMessage('Save Criteria',
						'From date should be less than to date');
				return false;
			}
		}
		if (($('#phaseDysFrm_prj_filter').val() && $('#phaseDysTo_prj_filter')
				.val())
				&& Number($('#phaseDysFrm_prj_filter').val()) > Number($('#phaseDysTo_prj_filter')
						.val())) {
			showConfirmationBox(
					"Warning",
					"'Phase Days To' should be greater than or equal to the value of 'Phase Days From'",
					null, null, 'hideConfirmationBox()', null, false, false,
					okButton, false);
			return false;
		}

		return true;

	}
	
	if (projectsSearchMode == 'pr') {
		if (!isGlobalSearch) {
			$('#txt_global_search_projects').val('');
		}
		if (isGlobalSearch || validateFilter()) {
			filterProjectSearchFromProjects(isGlobalSearch);
			$('#advanceSearchResetIcon').removeClass('hidden');
			if (!isGlobalSearch) {
				hideAdVancedSearchGrayBox();
			}
		}
		if ($('#page_projects_projects').jqPagination('getParam',
				'current_page') != 1 && $('#page_projects_projects').jqPagination('getParam',
				'current_page') != 0) {
			$('#page_projects_projects').jqPagination('option', 'current_page',
					1, true);
		}
	}
	//TODO include all das
	else if (projectsSearchMode == 'isp_dashboard' ||projectsSearchMode == 'osp_dashboard'||projectsSearchMode == 'catv_dashboard') {
//		if (isGlobalSearch == false) {
//			$('#txt_global_search_staked').val('');
//			$('#searchBox_projects_su').val('');
//		} else {
//			$('#searchBox_projects_su').val('');
//		}
		//getDashBoardProjectsSearch
		if (isGlobalSearch || validateFilter()) {
			searchDashBoardProjectsFilter(1,26,true);
			$('#advanceSearchResetIcon').removeClass('hidden');
			if (!isGlobalSearch) {
				hideAdVancedSearchGrayBox();
			}
		}
	} else if (projectsSearchMode == 'su') {
		if (isGlobalSearch == false) {
			$('#txt_global_search_staked').val('');
			$('#searchBox_projects_su').val('');
		} else {
			$('#searchBox_projects_su').val('');
		}
		if (isGlobalSearch || validateFilter()) {
			redirectToGetProjects(null, null, null, isGlobalSearch);
			$('#advanceSearchResetIcon').removeClass('hidden');
			/*if (!isGlobalSearch) {
				hideAdVancedSearchGrayBox();
			}*/
		}
	} else if (projectsSearchMode == 'oh') {
		if (isGlobalSearch == false) {
			$('#txt_global_search_overheads').val('');
			$('#searchBox_projects_oh').val('');
		} else {
			$('#searchBox_projects_oh').val('');
		}
		if (isGlobalSearch || validateFilter()) {
			redirectToGetProjects(null, null, null, isGlobalSearch);
			$('#advanceSearchResetIcon').removeClass('hidden');
			/*if (!isGlobalSearch) {
				hideAdVancedSearchGrayBox();
			}*/
		}
	} else if (projectsSearchMode == 'es') {
		if (isGlobalSearch == false) {
			$('#txt_global_search_estimationSummary').val('');
			$('#searchBox_projects_es').val('');
		} else {
			$('#searchBox_projects_es').val('');
		}
		if (isGlobalSearch || validateFilter()) {
			//getEstimationSummaryProjects(null, null, null, isGlobalSearch);
			redirectToGetProjects(null, null, null, isGlobalSearch);
			$('#advanceSearchResetIcon').removeClass('hidden');
			/*if (!isGlobalSearch) {
				hideAdVancedSearchGrayBox();
			}*/
		}
	} else if (projectsSearchMode == 'ef') {
		if (isGlobalSearch == false) {
			$('#txt_global_search_estimationFootage').val('');
			$('#searchBox_projects_ef').val('');
		} else {
			$('#searchBox_projects_ef').val('');
		}
		if (isGlobalSearch || validateFilter()) {
			//getEstimationFootageProjects(null, null, null, isGlobalSearch);
			redirectToGetProjects(null, null, null, isGlobalSearch);
			$('#advanceSearchResetIcon').removeClass('hidden');
			/*if (!isGlobalSearch) {
				hideAdVancedSearchGrayBox();
			}*/
		}
	} else if (projectsSearchMode == 'ca') {
		if (isGlobalSearch == false) {
			$('#txt_global_search_constructionAsbuilt').val('');
			$('#searchBox_projects_ca').val('');
		} else {
			$('#searchBox_projects_ca').val('');
		}
		if (isGlobalSearch || validateFilter()) {
			//getConstructionAsbuiltProjects(null, null, null, isGlobalSearch);
			redirectToGetProjects(null, null, null, isGlobalSearch);
			$('#advanceSearchResetIcon').removeClass('hidden');
			/*if (!isGlobalSearch) {
				hideAdVancedSearchGrayBox();
			}*/
		}
	} else if (projectsSearchMode == 'cas') {
		if (isGlobalSearch == false) {
			$('#txt_global_search_constructionAsbuiltSummary').val('');
			$('#searchBox_projects_cas').val('');
		} else {
			$('#searchBox_projects_cas').val('');
		}
		if (isGlobalSearch || validateFilter()) {
			//getConstructionAsbuiltSummaryProjects(null, null, null,isGlobalSearch);
					redirectToGetProjects(null, null, null,isGlobalSearch);
			$('#advanceSearchResetIcon').removeClass('hidden');
			/*if (!isGlobalSearch) {
				hideAdVancedSearchGrayBox();
			}*/
		}
	} else if (projectsSearchMode == 'caf') {
		if (isGlobalSearch == false) {
			$('#txt_global_search_constructionAsbuiltFootage').val('');
			$('#searchBox_projects_caf').val('');
		} else {
			$('#searchBox_projects_caf').val('');
		}
		if (isGlobalSearch || validateFilter()) {
			//getConstructionAsbuiltFootageProjects(null, null, null,isGlobalSearch);
			redirectToGetProjects(null, null, null,isGlobalSearch);
			$('#advanceSearchResetIcon').removeClass('hidden');
			/*if (!isGlobalSearch) {
				hideAdVancedSearchGrayBox();
			}*/
		}
	}
	else if (projectsSearchMode == 'ispL') {
		if (isGlobalSearch == false) {
			$('#txt_global_search_isp_labor').val('');
			$('#searchBox_projects_isp_labor').val('');
		} else {
			$('#searchBox_projects_isp_labor').val('');
		}
		if (isGlobalSearch || validateFilter()) {
			getIspLaborProjects(null, null, null,
					isGlobalSearch);
			$('#advanceSearchResetIcon').removeClass('hidden');
			/*if (!isGlobalSearch) {
				hideAdVancedSearchGrayBox();
			}*/
		}
	}
	else if (projectsSearchMode == 'ispM') {
		if (isGlobalSearch == false) {
			$('#txt_global_search_isp_material').val('');
			$('#searchBox_projects_isp_material').val('');
		} else {
			$('#searchBox_projects_isp_material').val('');
		}
		if (isGlobalSearch || validateFilter()) {
			getIspMaterialsProjects(null, null, null,
					isGlobalSearch);
			$('#advanceSearchResetIcon').removeClass('hidden');
			/*if (!isGlobalSearch) {
				hideAdVancedSearchGrayBox();
			}*/
		}
	}
	else if (projectsSearchMode == 'ispO') {
		if (isGlobalSearch == false) {
			$('#txt_global_search_isp_overheads').val('');
			$('#searchBox_projects_isp_overheads').val('');
		} else {
			$('#searchBox_projects_isp_overheads').val('');
		}
		if (isGlobalSearch || validateFilter()) {
			getIspOverheadsProjects(null, null, null,
					isGlobalSearch);
			$('#advanceSearchResetIcon').removeClass('hidden');
			/*if (!isGlobalSearch) {
				hideAdVancedSearchGrayBox();
			}*/
		}
	}	
	else if (projectsSearchMode == 'ospL') {
		if (isGlobalSearch == false) {
			$('#txt_global_search_osp_labor').val('');
			$('#searchBox_projects_osp_labor').val('');
		} else {
			$('#searchBox_projects_osp_labor').val('');
		}
		if (isGlobalSearch || validateFilter()) {
			getOspLaborProjects(null, null, null,
					isGlobalSearch);
			$('#advanceSearchResetIcon').removeClass('hidden');
			/*if (!isGlobalSearch) {
				hideAdVancedSearchGrayBox();
			}*/
		}
	}	
	else if (projectsSearchMode == 'ospM') {
		if (isGlobalSearch == false) {
			$('#txt_global_search_osp_material').val('');
			$('#searchBox_projects_osp_material').val('');
		} else {
			$('#searchBox_projects_osp_material').val('');
		}
		if (isGlobalSearch || validateFilter()) {
			getOspMaterialsProjects(null, null, null,
					isGlobalSearch);
			$('#advanceSearchResetIcon').removeClass('hidden');
			/*if (!isGlobalSearch) {
				hideAdVancedSearchGrayBox();
			}*/
		}
	}
	else if (projectsSearchMode == 'ospO') {
		if (isGlobalSearch == false) {
			$('#txt_global_search_osp_overheads').val('');
			$('#searchBox_projects_osp_overheads').val('');
		} else {
			$('#searchBox_projects_osp_overheads').val('');
		}
		if (isGlobalSearch || validateFilter()) {
			getOspOverheadsProjects(null, null, null,
					isGlobalSearch);
			$('#advanceSearchResetIcon').removeClass('hidden');
			/*if (!isGlobalSearch) {
				hideAdVancedSearchGrayBox();
			}*/
		}
	}
	else if (projectsSearchMode == 'ospE') {
		if (isGlobalSearch == false) {
			$('#txt_global_search_osp_est').val('');
			$('#searchBox_projects_osp_est').val('');
		} else {
			$('#searchBox_projects_osp_est').val('');
		}
		if (isGlobalSearch || validateFilter()) {
			getOspEstimationFootageProjects(null, null, null,
					isGlobalSearch);
			$('#advanceSearchResetIcon').removeClass('hidden');
			/*if (!isGlobalSearch) {
				hideAdVancedSearchGrayBox();
			}*/
		}
	}
	else if (projectsSearchMode == 'alaC') {
		if (isGlobalSearch == false) {
			$('#txt_global_search_ala_carte').val('');
			$('#searchBox_projects_ala_carte').val('');
		} else {
			$('#searchBox_projects_ala_carte').val('');
		}
		if (isGlobalSearch || validateFilter()) {
			getAlaCarteProjects(null, null, null,
					isGlobalSearch);
			$('#advanceSearchResetIcon').removeClass('hidden');
			/*if (!isGlobalSearch) {
				hideAdVancedSearchGrayBox();
			}*/
		}
	}
	else if (projectsSearchMode == 'prL') {
		if (!isGlobalSearch) {
			$('#txt_global_search_projects').val('');
		}
		if (isGlobalSearch || validateFilter()) {
			loadProjectReport(null, null, null,
					isGlobalSearch);
			$('#advanceSearchResetIcon').removeClass('hidden');
			/*if (!isGlobalSearch) {
				hideAdVancedSearchGrayBox();
			}*/
		}
		if ($('#page_projects_projects').jqPagination('getParam',
				'current_page') != 1 && $('#page_projects_projects').jqPagination('getParam',
				'current_page') != 0) {
			$('#page_projects_projects').jqPagination('option', 'current_page',
					1, true);
		}
	} 
	else if (projectsSearchMode == 'ispEstMat') {
		if (isGlobalSearch == false) {
			$('#txt_global_search_isp_est').val('');
			$('#searchBox_projects_isp_estMat').val('');
		} else {
			$('#searchBox_projects_isp_estMat').val('');
		}
		if (isGlobalSearch || validateFilter()) {
			redirectToGetProjects(null, null, null, isGlobalSearch);
			$('#advanceSearchResetIcon').removeClass('hidden');
			/*if (!isGlobalSearch) {
				hideAdVancedSearchGrayBox();
			}*/
		}
	
	}
	else if (projectsSearchMode == 'ipEng') {
		if (isGlobalSearch == false) {
			$('#txt_global_search_ip_eng').val('');
			$('#searchBox_projects_ip_eng').val('');
		} else {
			$('#searchBox_projects_ip_eng').val('');
		}
		if (isGlobalSearch || validateFilter()) {
			getIpEngineeringProjects(null, null, null, isGlobalSearch);
			$('#advanceSearchResetIcon').removeClass('hidden');
			/*if (!isGlobalSearch) {
				hideAdVancedSearchGrayBox();
			}*/
		}

	}
	else if (projectsSearchMode == 'redlines') {
		if (isGlobalSearch == false) {
			$('#txt_global_search_redlines').val('');
			$('#searchBox_projects_redlines').val('');
		} else {
			$('#searchBox_projects_redlines').val('');
		}
		if (isGlobalSearch || validateFilter()) {
			//getRedlinesProjects(null, null, null, isGlobalSearch);
			redirectToGetProjects(null, null, null, isGlobalSearch);
			$('#advanceSearchResetIcon').removeClass('hidden');
			/*if (!isGlobalSearch) {
			hideAdVancedSearchGrayBox();
		}*/
	}

	}
	else if (projectsSearchMode == 'hldrom') {
		if (isGlobalSearch == false) {
			$('#txt_global_search_isp_hldrom').val('');
			$('#searchBox_projects_isp_hldrom').val('');
		} else {
			$('#searchBox_projects_isp_hldrom').val('');
		}
		if (isGlobalSearch || validateFilter()) {
			getHldromProjects(null, null, null, isGlobalSearch);
			$('#advanceSearchResetIcon').removeClass('hidden');
			/*if (!isGlobalSearch) {
			hideAdVancedSearchGrayBox();
		}*/
		}

	}
	else if (projectsSearchMode == 'trnsln') {
		if (isGlobalSearch == false) {
			$('#txt_global_search_translations').val('');
			$('#searchBox_projects_translations').val('');
		} else {
			$('#searchBox_projects_translations').val('');
		}
		if (isGlobalSearch || validateFilter()) {
			getTranslationsProjects(null, null, null, isGlobalSearch);
			$('#advanceSearchResetIcon').removeClass('hidden');
			/*if (!isGlobalSearch) {
				hideAdVancedSearchGrayBox();
			}*/
		}
	
}
	else if (projectsSearchMode == 'chngs') {
		if (isGlobalSearch == false) {
			$('#txt_global_search_changes').val('');
			$('#searchBox_projects_changes').val('');
		} else {
			$('#searchBox_projects_changes').val('');
		}
		if (isGlobalSearch || validateFilter()) {
			//getChangesProjects(null, null, null, isGlobalSearch);
			redirectToGetProjects(null, null, null, isGlobalSearch);
			$('#advanceSearchResetIcon').removeClass('hidden');
			/*if (!isGlobalSearch) {
				hideAdVancedSearchGrayBox();
			}*/
		}
	
}
	else if (projectsSearchMode == 'jcr') {
		if (isGlobalSearch == false) {
			$('#txt_global_search_jcr').val('');
			$('#searchBox_projects_jcr').val('');
		} else {
			$('#searchBox_projects_jcr').val('');
		}
		if (isGlobalSearch || validateFilter()) {
			//getJcrProjects(null, null, null, isGlobalSearch);
			redirectToGetProjects(null, null, null, isGlobalSearch);
			$('#advanceSearchResetIcon').removeClass('hidden');
			/*if (!isGlobalSearch) {
				hideAdVancedSearchGrayBox();
			}*/
		}
	
}
	else if (projectsSearchMode == 'ispEngg') {
		if (isGlobalSearch == false) {
			$('#txt_global_search_isp_engg').val('');
			$('#searchBox_projects_isp_engg').val('');
		} else {
			$('#searchBox_projects_isp_engg').val('');
		}
		if (isGlobalSearch || validateFilter()) {
			getIspEngineeringProjects(null, null, null, isGlobalSearch);
			$('#advanceSearchResetIcon').removeClass('hidden');
			/*if (!isGlobalSearch) {
				hideAdVancedSearchGrayBox();
			}*/
		}
	
}
	else if (projectsSearchMode == 'inspectns') {
		if (isGlobalSearch == false) {
			$('#txt_global_search_inspections').val('');
			$('#searchBox_projects_inspections').val('');
		} else {
			$('#searchBox_projects_inspections').val('');
		}
		if (isGlobalSearch || validateFilter()) {
			//getInspectionProjects(null, null, null, isGlobalSearch);
			redirectToGetProjects(null, null, null, isGlobalSearch);
			$('#advanceSearchResetIcon').removeClass('hidden');
			/*if (!isGlobalSearch) {
				hideAdVancedSearchGrayBox();
			}*/
		}
	}
	else if (projectsSearchMode == 'circuitInfo') {
		if (isGlobalSearch == false) {
			$('#txt_global_search_circuit_info').val('');
			$('#searchBox_projects_circuit_info').val('');
		} else {
			$('#searchBox_projects_circuit_info').val('');
		}
		if (isGlobalSearch || validateFilter()) {
			getCircuitInformationProjects(null, null, null, isGlobalSearch);
			$('#advanceSearchResetIcon').removeClass('hidden');
			/*if (!isGlobalSearch) {
				hideAdVancedSearchGrayBox();
			}*/
		}
	}
	else if (projectsSearchMode == 'cableR') {
		if (isGlobalSearch == false) {
			$('#txt_global_search_cable_running').val('');
			$('#searchBox_projects_cable_running').val('');
		} else {
			$('#searchBox_projects_cable_running').val('');
		}
		if (isGlobalSearch || validateFilter()) {
			getCableRunningListProjects(null, null, null, isGlobalSearch);
			$('#advanceSearchResetIcon').removeClass('hidden');
			/*if (!isGlobalSearch) {
				hideAdVancedSearchGrayBox();
			}*/
		}
	} else if (projectsSearchMode == 'coh') {
		if (isGlobalSearch == false) {
			$('#txt_global_search_construction_overheads').val('');
			$('#searchBox_projects_coh').val('');
		} else {
			$('#searchBox_projects_coh').val('');
		}
		if (isGlobalSearch || validateFilter()) {
			redirectToGetProjects(null, null, null, isGlobalSearch);
			$('#advanceSearchResetIcon').removeClass('hidden');
			/*if (!isGlobalSearch) {
				hideAdVancedSearchGrayBox();
			}*/
		}
	}
}
function loadProjectFilterEst()
{
	$.ajax({
		url : 'getProjectsSearchCriteria',
		cache : false,
		async:false,
		success : function(response) {
			projectFilters.length = 0;
			//in loadProjectFilterEst
			for (var index = 0; index < response.length; index++) {
				projectFilters.push(response[index]);
				var searchName = projectFilters[index].searchName
						? projectFilters[index].searchName.replace(
								' (Default)', '')
						: '';
				if (currentFilter) {
					var filterName = currentFilter.searchName
							? currentFilter.searchName
									.replace(' (Default)', '')
							: '';
					if (searchName ==filterName) {
						$('#projectFilter').append('<option selected value='
								+ index + '>' + response[index].searchName
								+ '</option>');
						currentFilter.filterId = index;
					} else {
						$('#projectFilter').append('<option value=' + index
								+ '>' + response[index].searchName
								+ '</option>');
					}
				} else {
					$('#projectFilter').append('<option value=' + index + '>'
							+ response[index].searchName + '</option>');
				}
			}
			if (currentFilter) {
				updateProjectsFilterForm($('#projectFilter'));
			} 
			
			var mindate;
			var maxdate = 0;

			$('#createdFrom_prj_filter').datetimepicker({

				step : 1,
				timepicker : false,
				format : 'm/d/Y',
				onShow : function() {
					$('#createdFrom_prj_filter').val("");
					var date = $('#createdTo_prj_filter').val();
					if (date != null && date != '') {
						var selectedDate = new Date(date);
						maxdate = ((selectedDate.getFullYear() + '/' + ('0' + (selectedDate
								.getMonth() + 1)).slice(-2))
								+ '/' + ('0' + selectedDate.getDate())
								.slice(-2));

					} else {
						maxdate = 0;

					}
					$('#createdFrom_prj_filter').datetimepicker({
								step : 1,
								timepicker : false,
								format : 'm/d/Y',
								maxDate : maxdate
							});

				}
			});

			$('#createdTo_prj_filter').datetimepicker({
				step : 1,
				timepicker : false,
				format : 'm/d/Y',
				maxDate : 0,
				onShow : function() {
					$('#createdTo_prj_filter').val("");
					var date = $('#createdFrom_prj_filter').val();
					if (date != null && date != '') {
						var selectedDate = new Date(date);

						mindate = ((selectedDate.getFullYear() + '/' + ('0' + (selectedDate
								.getMonth() + 1)).slice(-2))
								+ '/' + ('0' + selectedDate.getDate())
								.slice(-2));

					} else {
						mindate = "1970/01/01";
					}

					$('#createdTo_prj_filter').datetimepicker({
								step : 1,
								timepicker : false,
								format : 'm/d/Y',
								minDate : mindate
							});

				}
			});
		}
	});
}
function loadProjectFilterMaster(arg) {
	//in loadProjectFilterMaster
	$.ajax({
		url : 'getProjectsSearchCriteria',
		cache : false,
		async:false,
		success : function(response) {
			projectFilters.length = 0;
			for (var index = 0; index < response.length; index++) {
				projectFilters.push(response[index]);
				var searchName = projectFilters[index].searchName
						? projectFilters[index].searchName.replace(
								' (Default)', '')
						: '';
				if (currentFilter) {
					var filterName = currentFilter.searchName
							? currentFilter.searchName
									.replace(' (Default)', '')
							: '';
					if (searchName ==filterName) {
						$('#projectFilter').append('<option selected value='
								+ index + '>' + response[index].searchName
								+ '</option>');
						currentFilter.filterId = index;
					} else {
						$('#projectFilter').append('<option value=' + index
								+ '>' + response[index].searchName
								+ '</option>');
					}
				} else {
					$('#projectFilter').append('<option value=' + index + '>'
							+ response[index].searchName + '</option>');
				}
			}
			if (currentFilter) {
				updateProjectsFilterForm($('#projectFilter'));
			} else {
				if (projectsSearchMode != 'pr') {
					var phases = ['isp_dashboard','catv_dashboard','osp_dashboard','ca', 'cas','coh', 'caf','ispL','ispM','ispO','ospL','ospM','ospO','ospE','alaC','hldrom','ipEng','ispEngg','chngs','jcr','redlines','inspectns','cableR','trnsln','circuitInfo','prL'];
					if (phases.indexOf(projectsSearchMode) == -1) {
						currentFilter = {
							prjPhase : '1,2'
						}
					} else if (projectsSearchMode == 'ca'
								|| projectsSearchMode == 'chngs'
									|| projectsSearchMode == 'jcr'
										|| projectsSearchMode == 'redlines'
											|| projectsSearchMode == 'inspectns') {
						currentFilter = {
							prjPhase : '3'
						}
					}else if (projectsSearchMode == 'ispL'
							|| projectsSearchMode == 'ispM'
								|| projectsSearchMode == 'ispO'||
								projectsSearchMode == 'ospL'
									|| projectsSearchMode == 'ospM'
										|| projectsSearchMode == 'ospO'
											|| projectsSearchMode == 'ospE'
												|| projectsSearchMode == 'alaC'
													|| projectsSearchMode == 'isp_dashboard'
														|| projectsSearchMode == 'catv_dashboard'
															|| projectsSearchMode == 'osp_dashboard') {
						currentFilter = {
							prjPhase : '1,2,3'
						}
					}else if(projectsSearchMode == 'hldrom'
								|| projectsSearchMode == 'ispEngg')
							{
							currentFilter = {
									prjPhase : '2,3'
								}
							
					} 
					else if(projectsSearchMode == 'cableR'
						|| projectsSearchMode == 'trnsln'
							|| projectsSearchMode == 'circuitInfo')
						{
						currentFilter = {
								prjPhase : '2,3'
							}
						
				} else if (projectsSearchMode == 'cas' || projectsSearchMode == 'caf' || projectsSearchMode == 'coh')
					{
					currentFilter = {
							prjPhase : '3,4,7'
						}
					}
				else if (projectsSearchMode == 'prL')
				{
					currentFilter = {
							prjPhase : '1,2,3,4,7,98,99'
						}
				}
				else if (projectsSearchMode == 'ipEng')
				{
					currentFilter = {
							prjPhase : '1,2'
						}
				}
				else {
					currentFilter = {
						prjPhase : '3,4'
					}
					}
					updateProjectsFilterForm($('#projectFilter'));
				}
			}
			if (arg) {
				loadDefaultProjects();
			}
			var mindate;
			var maxdate = 0;

			$('#createdFrom_prj_filter').datetimepicker({

				step : 1,
				timepicker : false,
				format : 'm/d/Y',
				onShow : function() {
					$('#createdFrom_prj_filter').val("");
					var date = $('#createdTo_prj_filter').val();
					if (date != null && date != '') {
						var selectedDate = new Date(date);
						maxdate = ((selectedDate.getFullYear() + '/' + ('0' + (selectedDate
								.getMonth() + 1)).slice(-2))
								+ '/' + ('0' + selectedDate.getDate())
								.slice(-2));

					} else {
						maxdate = 0;

					}
					$('#createdFrom_prj_filter').datetimepicker({
								step : 1,
								timepicker : false,
								format : 'm/d/Y',
								maxDate : maxdate
							});

				}
			});

			$('#createdTo_prj_filter').datetimepicker({
				step : 1,
				timepicker : false,
				format : 'm/d/Y',
				maxDate : 0,
				onShow : function() {
					$('#createdTo_prj_filter').val("");
					var date = $('#createdFrom_prj_filter').val();
					if (date != null && date != '') {
						var selectedDate = new Date(date);

						mindate = ((selectedDate.getFullYear() + '/' + ('0' + (selectedDate
								.getMonth() + 1)).slice(-2))
								+ '/' + ('0' + selectedDate.getDate())
								.slice(-2));

					} else {
						mindate = "1970/01/01";
					}

					$('#createdTo_prj_filter').datetimepicker({
								step : 1,
								timepicker : false,
								format : 'm/d/Y',
								minDate : mindate
							});

				}
			});
		}
	});
}

function loadProjectDetails(i) {

	var project = dashBoardProjectList[i], img, html, createdDateTime, date, time;
	switch (project && Number(project.statusId)) {
		case 1 :
			img = 'resources/css/theme/images/structure/common/submitted-form2.png';
			break;

		case 2 :
			img = 'resources/css/theme/images/structure/common/design-estimate2.png';
			break;

		case 3 :
			img = 'resources/css/theme/images/structure/common/construction-estimate2.png';
			break;

		case 4 :
			img = 'resources/css/theme/images/structure/common/construction-estimate2.png';
			break;

		case 7 :
			img = 'resources/css/theme/images/structure/common/close2.png';
			break;

		case 98 :
			img = 'resources/css/theme/images/structure/common/lock2.png';
			break;

		case 99 :
			img = 'resources/css/theme/images/structure/common/cancel2.png';
			break;

		default :
			img = 'resources/css/theme/images/structure/common/item-active_both.png';
			break;

	}
	/*
	 * if(project) { createdDateTime=project.createdDate.split(" "); // date =
	 * new Date(createdDateTime[0]).toLocaleFormat('%m/%d/%Y'); var dateTemp =
	 * new Date(createdDateTime[0].split(" ")); // time=createdDateTime[1];
	 * date=((('0'+(dateTemp.getMonth() + 1)).slice(-2)) + '/' +('0'+
	 * dateTemp.getDate()).slice(-2) + '/' + dateTemp.getFullYear());
	 * //alert(date.getDate() + '/' + (date.getMonth() + 1) + '/' +
	 * date.getFullYear()); }
	 */

	html = '<span class="heading"'
			+ 'style="background: url('
			+ img
			+ ') no-repeat scroll 3px 3px rgba(0, 0, 0, 0);">'
			+ '<span class="p_name"'
			+ 'title="'
			+ (project ? project.projectName : '')
			+ '">'
			+ (project ? project.projectName : '')
			+ '</span>'
			+ '<span class="p_id">PROJECT ID:'
			+ (project ? project.caPrjId : '')
			+ '<label></label>'
			+ '</span>'
			+ '</span>'
			+ '<ul>'
			+ '<li><span>SAP WBS Code:<label>'
			+ (project ? project.sapWbsCd : '')
			+ '</label></span></li>'
			+ '<li>State:<label>'
			+ (project ? project.state : '')
			+ '</label></li>'
			/* +'<li>Tax District: <label>'+project.sapWbsCd+'</label></li>' */
			+ '<li>Market Segment:<label>'
			+ (project ? project.mseg : '')
			+ '</label></li>'
			+ '<li>Cluster:<label>'
			+ (project
					? ((project.cluster == undefined) ? '' : project.cluster)
					: '')
			+ '</label></li>'
			+ '<li>Company:<label>'
			+ (project ? project.ccnm : '')
			+ '</label></li>'
			+ '<li>Exchange/SAP Site:<label>'
			+ (project ? project.exchange : '')
			+ /*
				 * '' + (project ? project.sapSite : '') +
				 */'</label></li>'
			/* +'<li>Project Type:<label>'+project.sapWbsCd+'</label></li>' */
			+ '<li><span>Phase:<label>' + (project ? project.statusDesc : '')
			+ '</label></span></li>' + '<li>Created Date:<label>'
			+ (project ? project.createdDate /* +" "+ time */: '')
			+ '</label></li>' + '<li><span>Phase Date:<label>'
			+ (project ? project.statDt : '') + '</label></span></li>'
			+ '</ul>';

	$('#project_details_aside').html(html);
	$('div.selected').removeClass('selected');
	$('#div_project_details_' + i).addClass('selected');
}
/*
function getDashBoardProjects(offset, limit, init) {
	// alert("out search");
	//loadProjectFilterMaster(true);
	$.ajax({
				url : 'getDashBoardProjects',
				cache : false,
				data : {
					offset : offset,
					limit : limit,
					currentModule:setCurrentModuleScope()

				},
				success : function(response) {

					dashBoardProjectList.length = 0;
					$('#project_list_db').html(response);
					if ($('#searchid_db').val() == 0) {
						$('#reset_filter').hide();
					}

					
					 * var pagination=$(".pagination"); $.each(pagination,
					 * function( index, value ) {
					 * $(value).jqPagination('destroy'); alert( index + ": " +
					 * value ); });
					 
					// if (dashBoardProjectList.length > 0) {
					if (init) {
						// alert("dashbord");
						setSearchId();
						// setpagination();
						
						 * if($('#page_projects_db').jqPagination()!=undefined) {
						 
						
						 * $('#page_projects_db').jqPagination('option',
						 * 'current_page', 1);
						 
						// }
						var totalCount;
						if (dashBoardProjectList.length > 0) {
							totalCount = dashBoardProjectList[0].totalCount;
							pages = Math.ceil(totalCount / 25);
						} else {
							totalCount = 0;
							pages = 0;
						}

						$('#page_projects_db').jqPagination({
									link_string : '/?page={page_number}',
									max_page : pages,
									current_page : 1,
									totalCount : totalCount,
									paged : function(page) {

										// alert(page);
										if (page != 1) {
											page = ((page - 1) * 25) + 1;
										}
										pagination(page);
										// getDashBoardProjects(page, 26,
										// false);
									}
								});
						// $('#page_projects_db').jqPagination('option',
						// 'max_page', pages);

					}
					loadProjectDetails(0);
					// }
				}
			});
}*/
function getStakedUnitProjects(offset, limit, init, isGlobalSearch, isSapWbs) {
	if (!offset && !limit) {
		offset = 1;
		limit = 26;
	}
	if($('#advanceSearchResetIcon').is(':visible') && !isGlobalSearch && !isSapWbs)
	{
		var data=getSavedSearchDetails(offset,limit); 
	}
	else
	{
		var data = {
				offset : offset,
				limit : limit,
				searchFlag : 2,
				prjPhase : '1,2',
				projectName : ($('#searchBox_projects_su')
						? $('#searchBox_projects_su').val()
						: null),
				sapWbsCd : ($('#searchBox_projects_su') ? $('#searchBox_projects_su')
						.val() : null)
			};
	}
	if($('#searchBox_projects_su').val()!="" && 
			$('#advanceSearchResetIcon').is(':visible'))
	{
		resetStakedUnitsProjects(1);
	}
	if((isSapWbs ==true)&&$('#searchBox_projects_su').val()=="")
		{
		data['searchFlag'] =0;
		resetStakedUnitsProjects(1);
		}
	/*
	 * getMultiSortParameters--
	 * pass 1 : for fields 
	pass 2: for order
	pass 3: for sortFlag, default sortflag for multi sort=1. but if no fields used in sort sortflag=0*/
	var sortFieldValString=getMultiSortParameters(MULTISORT_FIELD);	
	var sortOrderValString=getMultiSortParameters(MULTISORT_ORDER);
	var sortFlag=1;
	sortFlag=(getMultiSortParameters(MULTISORT_FLAG)==null)?sortFlag:getMultiSortParameters(MULTISORT_FLAG);
	
	if (($('#projectId_prj_filter').is(':visible') && $('#projectId_prj_filter').val()!=undefined)
			|| (!isGlobalSearch && $('#advanceSearchResetIcon').is(':visible') && !$('#searchBox_projects_su')
					.val()) && !isSapWbs && $('#projectId_prj_filter').val()!=undefined) {
		// $('#searchBox_projects_su').val('');
		
		if (currentFilter) {
			var filterName = currentFilter.searchName
					? currentFilter.searchName
							.replace(' (Default)', '')
					: '';
							}
		data = {
			offset : offset || 1,
			limit : limit || 26,
			searchName : isSaveSearchCriteria?filterName:'',
			prjPhase : '1,2',
			frmSearch : true,
			searchId : null,
			searchFrom : 1,
			isDefault : 0,
			caPrjId :$('#projectId_prj_filter').val().trim(),
			sapWbsCd :$('#sapWbsCode_prj_filter').val().trim(),
			projectName : $('#pjtName_prj_filter').val().trim(),
			lobType : ($('#projectType_prj_filter').val()
					? $('#projectType_prj_filter').val().join(',')
					: null),
			/*
			 * prjPhase : ($('#phase_prj_filter').val() ? $('#phase_prj_filter')
			 * .val().join(',') : null),
			 */
					projectScopeId : $('#pjtScope_prj_filter option:selected').val(),
					owner : ($('#owner_prj_filter').val()
							? $('#owner_prj_filter').val().join('`')
									: null),
					stateId : $('#state_prj_filter option:selected').val(),
					prjCompany : $('#company_prj_filter option:selected').val(),
					exchangeId : $('#exchange_prj_filter option:selected').val(),
					msegId : $('#marketSeg_prj_filter option:selected').val(),
			prjCrtdFrm : $('#createdFrom_prj_filter').val(),
			prjCrtdTo : $('#createdTo_prj_filter').val(),
			phaseDysFrm : $('#phaseDysFrm_prj_filter').val(),
			phaseDysTo : $('#phaseDysTo_prj_filter').val(),
			projectExpedite : $('#expedite_prj_filter').val(),
			sortFields:sortFieldValString,/*for multisort*/
		    sortOrders:sortOrderValString,
		    sortFlag:sortFlag
		};
	}
	// $('#page_projects_su').jqPagination({max_page : 0,current_page : 1});
	if (!init) {
		try {
			$('#page_projects_su').jqPagination('destroy');
			if ($('#page_projects_su').jqPagination('getParam', 'max_page') != 0) {
				$('#page_projects_su').jqPagination('option', 'current_page',
						1, true);
			}
			$('#page_projects_su')[0].status = false;
		} catch (err) {

		}
	}
	if (isGlobalSearch) {
		$('#searchBox_projects_su').val('');
		data = {
			offset : offset || 1,
			limit : limit || 26,
			searchFrom : 1,
			searchFlag : 2,
			prjPhase : null,
			projectName : $('#txt_global_search_staked').val().trim(),
			sapWbsCd : $('#txt_global_search_staked').val().trim()
		}
	} else {
		$('#txt_global_search_staked').val('');
	}
	data['curScope'] = setCurrentModuleScope();
	if (projectListRequest && typeof projectListRequest.abort == 'function') {
		projectListRequest.abort();
	}
	projectListRequest = $.ajax({
				url : 'getStakedUnitProjects',
				cache : false,
				data : data,
				success : function(response) {
					stakedUnitsProjectListData.length = 0;
					$('#list-frame_su').html(response);
					if (!isGlobalSearch
							&& !$('#txt_global_search_staked').val()
							&& !$('#searchBox_projects_su').val()) {
						currentFilter = data;
						if(!isSaveSearchCriteria)
						{
						currentFilter.filterId = '';
						}
					} else {
						currentFilter = null;
					}
					var totalCount = 0, pages = 0;
					if (stakedUnitsProjectListData.length) {
						totalCount = stakedUnitsProjectListData[0].totalCount;
						pages = Math.ceil(totalCount / 25);
					}
					if (!$('#page_projects_su')[0].status) {
						$('#page_projects_su').jqPagination({
							link_string : '/?page={page_number}',
							max_page : pages,
							paged : function(page) {
								if (page != 1) {
									page = ((page - 1) * 25) + 1;
								}
								getStakedUnitProjects(page, 26, true,
										isGlobalSearch);
							}
						});
						$('#page_projects_su')[0].status = true;
					}
				}
			});
}
function getOverHeadsProjects(offset, limit, init, isGlobalSearch, isSapWbs) {
	if (!offset && !limit) {
		offset = 1;
		limit = 26;
	}
	if($('#advanceSearchResetIcon').is(':visible') && !isGlobalSearch && !isSapWbs)
	{
		var data=getSavedSearchDetails(offset,limit); 
	}
	else
	{
		
		var data = {
			offset : offset,
			limit : limit,
			prjPhase : '1,2',
			searchFlag : 2,
			projectName : ($('#searchBox_projects_oh')
					? $('#searchBox_projects_oh').val()
					: null),
			sapWbsCd : ($('#searchBox_projects_oh') ? $('#searchBox_projects_oh')
					.val() : null)
		};
	}
	if($('#searchBox_projects_oh').val()!="" && 
			$('#advanceSearchResetIcon').is(':visible'))
	{
		resetOverHeadsProjects(1);
	}
	if((isSapWbs ==true)&&$('#searchBox_projects_oh').val()=="")
		{
		data['searchFlag'] =0;
		resetOverHeadsProjects(1);
		}
	var sortFieldValString=getMultiSortParameters(MULTISORT_FIELD);	
	var sortOrderValString=getMultiSortParameters(MULTISORT_ORDER);
	var sortFlag=1;
	sortFlag=(getMultiSortParameters(MULTISORT_FLAG)==null)?sortFlag:getMultiSortParameters(MULTISORT_FLAG);
	if (($('#projectId_prj_filter').is(':visible') && $('#projectId_prj_filter').val()!=undefined)
			|| (!isGlobalSearch && $('#advanceSearchResetIcon').is(':visible') && !$('#searchBox_projects_oh')
					.val()) && !isSapWbs && $('#projectId_prj_filter').val()!=undefined) {
		// $('#searchBox_projects_oh').val('');
		if (currentFilter) {
			var filterName = currentFilter.searchName
					? currentFilter.searchName
							.replace(' (Default)', '')
					: '';
							}
		data = {
			offset : offset || 1,
			limit : limit || 26,
			searchName : isSaveSearchCriteria?filterName:'',
			prjPhase : '1,2',
			frmSearch : true,
			searchId : null,
			searchFrom : 1,
			isDefault : 0,
			caPrjId : $('#projectId_prj_filter').val().trim(),
			sapWbsCd : $('#sapWbsCode_prj_filter').val().trim(),
			projectName : $('#pjtName_prj_filter').val().trim(),
			lobType : ($('#projectType_prj_filter').val()
					? $('#projectType_prj_filter').val().join(',')
					: null),
			/*
			 * prjPhase : ($('#phase_prj_filter').val() ? $('#phase_prj_filter')
			 * .val().join(',') : null),
			 */
					projectScopeId : $('#pjtScope_prj_filter option:selected').val(),
					owner : ($('#owner_prj_filter').val()
							? $('#owner_prj_filter').val().join('`')
									: null),
					stateId : $('#state_prj_filter option:selected').val(),
					prjCompany : $('#company_prj_filter option:selected').val(),
					exchangeId : $('#exchange_prj_filter option:selected').val(),
					msegId : $('#marketSeg_prj_filter option:selected').val(),
			prjCrtdFrm : $('#createdFrom_prj_filter').val(),
			prjCrtdTo : $('#createdTo_prj_filter').val(),
			phaseDysFrm : $('#phaseDysFrm_prj_filter').val(),
			phaseDysTo : $('#phaseDysTo_prj_filter').val(),
			projectExpedite : $('#expedite_prj_filter').val(),
			sortFields:sortFieldValString,/*for multisort*/
		    sortOrders:sortOrderValString,
		    sortFlag:sortFlag
		};
	}
	// $('#page_projects_oh').jqPagination({max_page : 0,current_page : 1});
	if (!init) {
		$('#page_projects_oh').jqPagination('destroy');
		if ($('#page_projects_oh').jqPagination('getParam', 'max_page') != 0) {
			$('#page_projects_oh').jqPagination('option', 'current_page', 1,
					true);
		}
		$('#page_projects_oh')[0].status = false;
	}
	if (isGlobalSearch) {
		data = {
			offset : offset || 1,
			limit : limit || 26,
			prjPhase : null,
			searchFrom : 1,
			searchFlag : 2,
			projectName : $('#txt_global_search_overheads').val().trim(),
			sapWbsCd : $('#txt_global_search_overheads').val().trim()
		}
	} else {
		$('#txt_global_search_overheads').val('');
	}
	data['curScope'] = setCurrentModuleScope();
	if (projectListRequest && typeof projectListRequest.abort == 'function') {
		projectListRequest.abort();
	}
	projectListRequest = $.ajax({
				url : 'getOverHeadsProjects',
				cache : false,
				data : stakedToOverheadsProjectId > 0 ? {
					projectId : stakedToOverheadsProjectId,
					searchFlag : 1,
					curScope : setCurrentModuleScope()
				} : data,// used in proced to overheads functionality in
				// staked units
				success : function(response) {
					overHeadsProjectListData.length = 0;
					$('#list-frame_oh').html(response);
					if (!isGlobalSearch
							&& !$('#txt_global_search_overheads').val()
							&& !$('#searchBox_projects_oh').val()) {
						currentFilter = data;
						if(!isSaveSearchCriteria)
						{
						currentFilter.filterId = '';
						}
					} else {
						currentFilter = null;
					}
					var totalCount = 0, page = 0;
					if (overHeadsProjectListData.length) {
						totalCount = overHeadsProjectListData[0].totalCount;
						page = Math.ceil(totalCount / 25);
					}
					if (!$('#page_projects_oh')[0].status) {
						$('#page_projects_oh').jqPagination({
							link_string : '/?page={page_number}',
							max_page : page,
							paged : function(page) {
								if (page != 1) {
									page = ((page - 1) * 25) + 1;
								};
								getOverHeadsProjects(page, 26, true,
										isGlobalSearch);
							}
						});
						$('#page_projects_oh')[0].status = true;
					}
					stakedToOverheadsProjectId = 0;
				}
			});
}

function getConstructionOverHeadsProjects(offset, limit, init, isGlobalSearch, isSapWbs) {
	if (!offset && !limit) {
		offset = 1;
		limit = 26;
	}
	if($('#advanceSearchResetIcon').is(':visible') && !isGlobalSearch && !isSapWbs)
	{
		var data=getSavedSearchDetails(offset,limit); 
	}
	else
	{
		
		var data = {
			offset : offset,
			limit : limit,
			prjPhase : '1,2',
			searchFlag : 2,
			projectName : ($('#searchBox_projects_coh')
					? $('#searchBox_projects_coh').val()
					: null),
			sapWbsCd : ($('#searchBox_projects_coh') ? $('#searchBox_projects_coh')
					.val() : null)
		};
	}
	if($('#searchBox_projects_coh').val()!="" && 
			$('#advanceSearchResetIcon').is(':visible'))
	{
		resetOverHeadsProjects(1);
	}
	if((isSapWbs ==true)&&$('#searchBox_projects_coh').val()=="")
		{
		data['searchFlag'] =0;
		resetOverHeadsProjects(1);
		}
	var sortFieldValString=getMultiSortParameters(MULTISORT_FIELD);	
	var sortOrderValString=getMultiSortParameters(MULTISORT_ORDER);
	var sortFlag=1;
	sortFlag=(getMultiSortParameters(MULTISORT_FLAG)==null)?sortFlag:getMultiSortParameters(MULTISORT_FLAG);
	if (($('#projectId_prj_filter').is(':visible') && $('#projectId_prj_filter').val()!=undefined)
			|| (!isGlobalSearch && $('#advanceSearchResetIcon').is(':visible') && !$('#searchBox_projects_coh')
					.val()) && !isSapWbs && $('#projectId_prj_filter').val()!=undefined) {
		// $('#searchBox_projects_coh').val('');
		if (currentFilter) {
			var filterName = currentFilter.searchName
					? currentFilter.searchName
							.replace(' (Default)', '')
					: '';
							}
		data = {
			offset : offset || 1,
			limit : limit || 26,
			searchName : isSaveSearchCriteria?filterName:'',
			prjPhase : '1,2',
			frmSearch : true,
			searchId : null,
			searchFrom : 1,
			isDefault : 0,
			caPrjId : $('#projectId_prj_filter').val().trim(),
			sapWbsCd : $('#sapWbsCode_prj_filter').val().trim(),
			projectName : $('#pjtName_prj_filter').val().trim(),
			lobType : ($('#projectType_prj_filter').val()
					? $('#projectType_prj_filter').val().join(',')
					: null),
			/*
			 * prjPhase : ($('#phase_prj_filter').val() ? $('#phase_prj_filter')
			 * .val().join(',') : null),
			 */
					projectScopeId : $('#pjtScope_prj_filter option:selected').val(),
					owner : ($('#owner_prj_filter').val()
							? $('#owner_prj_filter').val().join('`')
									: null),
					stateId : $('#state_prj_filter option:selected').val(),
					prjCompany : $('#company_prj_filter option:selected').val(),
					exchangeId : $('#exchange_prj_filter option:selected').val(),
					msegId : $('#marketSeg_prj_filter option:selected').val(),
			prjCrtdFrm : $('#createdFrom_prj_filter').val(),
			prjCrtdTo : $('#createdTo_prj_filter').val(),
			phaseDysFrm : $('#phaseDysFrm_prj_filter').val(),
			phaseDysTo : $('#phaseDysTo_prj_filter').val(),
			projectExpedite : $('#expedite_prj_filter').val(),
			sortFields:sortFieldValString,/*for multisort*/
		    sortOrders:sortOrderValString,
		    sortFlag:sortFlag
		};
	}
	// $('#page_projects_coh').jqPagination({max_page : 0,current_page : 1});
	if (!init) {
		$('#page_projects_coh').jqPagination('destroy');
		if ($('#page_projects_coh').jqPagination('getParam', 'max_page') != 0) {
			$('#page_projects_coh').jqPagination('option', 'current_page', 1,
					true);
		}
		$('#page_projects_coh')[0].status = false;
	}
	if (isGlobalSearch) {
		data = {
			offset : offset || 1,
			limit : limit || 26,
			prjPhase : null,
			searchFrom : 1,
			searchFlag : 2,
			projectName : $('#txt_global_search_overheads').val().trim(),
			sapWbsCd : $('#txt_global_search_overheads').val().trim()
		}
	} else {
		$('#txt_global_search_overheads').val('');
	}
	data['curScope'] = setCurrentModuleScope();
	if (projectListRequest && typeof projectListRequest.abort == 'function') {
		projectListRequest.abort();
	}
	projectListRequest = $.ajax({
				url : 'getConstructionOverHeadsProjects',
				cache : false,
				data : stakedToOverheadsProjectId > 0 ? {
					projectId : stakedToOverheadsProjectId,
					searchFlag : 1,
					curScope : setCurrentModuleScope()
				} : data,// used in proced to overheads functionality in
				// staked units
				success : function(response) {
					overHeadsProjectListData.length = 0;
					$('#list-frame_coh').html(response);
					if (!isGlobalSearch
							&& !$('#txt_global_search_overheads').val()
							&& !$('#searchBox_projects_coh').val()) {
						currentFilter = data;
						if(!isSaveSearchCriteria)
						{
						currentFilter.filterId = '';
						}
					} else {
						currentFilter = null;
					}
					var totalCount = 0, page = 0;
					if (overHeadsProjectListData.length) {
						totalCount = overHeadsProjectListData[0].totalCount;
						page = Math.ceil(totalCount / 25);
					}
					if (!$('#page_projects_coh')[0].status) {
						$('#page_projects_coh').jqPagination({
							link_string : '/?page={page_number}',
							max_page : page,
							paged : function(page) {
								if (page != 1) {
									page = ((page - 1) * 25) + 1;
								};
								getConstructionOverHeadsProjects(page, 26, true,
										isGlobalSearch);
							}
						});
						$('#page_projects_coh')[0].status = true;
					}
					stakedToOverheadsProjectId = 0;
				}
			});
}

function getEstimationSummaryProjects(offset, limit, init, isGlobalSearch,
		isSapWbs) {
	if (!offset && !limit) {
		offset = 1;
		limit = 26;
	}
	if($('#advanceSearchResetIcon').is(':visible') && !isGlobalSearch && !isSapWbs)
	{
		var data=getSavedSearchDetails(offset,limit); 
	}
	else
	{
		var data = {
			offset : offset,
			limit : limit,
			prjPhase : '1,2',
			searchFlag : 2,
			projectName : ($('#searchBox_projects_es')
					? $('#searchBox_projects_es').val()
					: null),
			sapWbsCd : ($('#searchBox_projects_es') ? $('#searchBox_projects_es')
					.val() : null)
		};
	}
	if($('#searchBox_projects_es').val()!="" && 
			$('#advanceSearchResetIcon').is(':visible'))
	{
		resetEstimationSummaryProjects(1);
	}
	if((isSapWbs ==true)&&$('#searchBox_projects_es').val()=="")
		{
		data['searchFlag'] =0;
		resetEstimationSummaryProjects(1);
		}
	var sortFieldValString=getMultiSortParameters(MULTISORT_FIELD);	
	var sortOrderValString=getMultiSortParameters(MULTISORT_ORDER);
	var sortFlag=1;
	sortFlag=(getMultiSortParameters(MULTISORT_FLAG)==null)?sortFlag:getMultiSortParameters(MULTISORT_FLAG);
	if (($('#projectId_prj_filter').is(':visible') && $('#projectId_prj_filter').val()!=undefined)
			|| (!isGlobalSearch && $('#advanceSearchResetIcon').is(':visible') && !$('#searchBox_projects_es')
					.val()) && !isSapWbs && $('#projectId_prj_filter').val()!=undefined) {
		// $('#searchBox_projects_es').val('');
		if (currentFilter) {
			var filterName = currentFilter.searchName
					? currentFilter.searchName
							.replace(' (Default)', '')
					: '';
							}
		data = {
			offset : offset || 1,
			limit : limit || 26,
			searchName : isSaveSearchCriteria?filterName:'',
			prjPhase : '1,2',
			frmSearch : true,
			searchId : null,
			searchFrom : 1,
			isDefault : 0,
			caPrjId : $('#projectId_prj_filter').val().trim(),
			sapWbsCd :$('#sapWbsCode_prj_filter').val().trim(),
			projectName :$('#pjtName_prj_filter').val().trim(),
			lobType : ($('#projectType_prj_filter').val()
					? $('#projectType_prj_filter').val().join(',')
					: null),
			/*
			 * prjPhase : ($('#phase_prj_filter').val() ? $('#phase_prj_filter')
			 * .val().join(',') : null),
			 */
					projectScopeId : $('#pjtScope_prj_filter option:selected').val(),
					owner : ($('#owner_prj_filter').val()
							? $('#owner_prj_filter').val().join('`')
									: null),
					stateId : $('#state_prj_filter option:selected').val(),
					prjCompany : $('#company_prj_filter option:selected').val(),
					exchangeId : $('#exchange_prj_filter option:selected').val(),
					msegId : $('#marketSeg_prj_filter option:selected').val(),
			prjCrtdFrm : $('#createdFrom_prj_filter').val(),
			prjCrtdTo : $('#createdTo_prj_filter').val(),
			phaseDysFrm : $('#phaseDysFrm_prj_filter').val(),
			phaseDysTo : $('#phaseDysTo_prj_filter').val(),
			projectExpedite : $('#expedite_prj_filter').val(),
			sortFields:sortFieldValString,/*for multisort*/
		    sortOrders:sortOrderValString,
		    sortFlag:sortFlag
		};
	}
	// $('#page_projects_es').jqPagination({max_page : 0,current_page : 1});
	if (!init) {
		$('#page_projects_es').jqPagination('destroy');
		if ($('#page_projects_es').jqPagination('getParam', 'max_page') != 0) {
			$('#page_projects_es').jqPagination('option', 'current_page', 1,
					true);
		}
		$('#page_projects_es')[0].status = false;
	}
	if (isGlobalSearch) {
		data = {
			offset : offset || 1,
			limit : limit || 26,
			prjPhase : null,
			searchFrom : 1,
			searchFlag : 2,
			projectName : $('#txt_global_search_estimationSummary').val()
					.trim(),
			sapWbsCd : $('#txt_global_search_estimationSummary').val().trim()
		}
	} else {
		$('#txt_global_search_estimationSummary').val('');
	}
	data['curScope'] = setCurrentModuleScope();
	if (projectListRequest && typeof projectListRequest.abort == 'function') {
		projectListRequest.abort();
	}
	projectListRequest = $.ajax({
				url : 'getEstimationSummaryProjects',
				cache : false,
				data : data,
				success : function(response) {
					estimationSummaryProjectListData.length = 0;
					$('#list-frame_es').html(response);
					if (!isGlobalSearch
							&& !$('#txt_global_search_estimationSummary').val()
							&& !$('#searchBox_projects_es').val()) {
						currentFilter = data;
						if(!isSaveSearchCriteria)
						{
						currentFilter.filterId = '';
						}
					} else {
						currentFilter = null;
					}
					var totalCount = 0, page = 0;
					if (estimationSummaryProjectListData.length) {
						totalCount = estimationSummaryProjectListData[0].totalCount;
						page = Math.ceil(totalCount / 25);
					}
					if (!$('#page_projects_es')[0].status) {
						$('#page_projects_es').jqPagination({
							link_string : '/?page={page_number}',
							max_page : page,
							paged : function(page) {
								if (page != 1) {
									page = ((page - 1) * 25) + 1;
								};
								getEstimationSummaryProjects(page, 26, true,
										isGlobalSearch);
							}
						});
						$('#page_projects_es')[0].status = true;
					}
				}
			});
}

function getEstimationFootageProjects(offset, limit, init, isGlobalSearch,
		isSapWbs) {
	if (!offset && !limit) {
		offset = 1;
		limit = 26;
	}
	if($('#advanceSearchResetIcon').is(':visible') && !isGlobalSearch && !isSapWbs)
	{
		var data=getSavedSearchDetails(offset,limit); 
	}
	else
	{
	var data = {
		offset : offset,
		limit : limit,
		prjPhase : '1,2',
		searchFlag : 2,
		projectName : ($('#searchBox_projects_ef')
				?$('#searchBox_projects_ef').val()
				: null),
		sapWbsCd : ($('#searchBox_projects_ef') ?$('#searchBox_projects_ef')
				.val() : null)
	};
	}
	if($('#searchBox_projects_ef').val()!="" && 
			$('#advanceSearchResetIcon').is(':visible'))
	{
		resetEstimationFootageProjects(1);
	}
	if((isSapWbs ==true)&&$('#searchBox_projects_ef').val()=="")
		{
		data['searchFlag'] =0;
		resetEstimationFootageProjects(1);
		}
	var sortFieldValString=getMultiSortParameters(MULTISORT_FIELD);	
	var sortOrderValString=getMultiSortParameters(MULTISORT_ORDER);
	var sortFlag=1;
	sortFlag=(getMultiSortParameters(MULTISORT_FLAG)==null)?sortFlag:getMultiSortParameters(MULTISORT_FLAG);
	if (($('#projectId_prj_filter').is(':visible') && $('#projectId_prj_filter').val()!=undefined)
			|| (!isGlobalSearch && $('#advanceSearchResetIcon').is(':visible') && !$('#searchBox_projects_ef')
					.val()) && !isSapWbs && $('#projectId_prj_filter').val()!=undefined) {
		// $('#searchBox_projects_es').val('');
		if (currentFilter) {
			var filterName = currentFilter.searchName
					? currentFilter.searchName
							.replace(' (Default)', '')
					: '';
							}
		data = {
			offset : offset || 1,
			limit : limit || 26,
			searchName :  isSaveSearchCriteria?filterName:'',
			prjPhase : '1,2',
			frmSearch : true,
			searchId : null,
			searchFrom : 1,
			isDefault : 0,
			caPrjId : $('#projectId_prj_filter').val().trim(),
			sapWbsCd : $('#sapWbsCode_prj_filter').val().trim(),
			projectName :$('#pjtName_prj_filter').val().trim(),
			lobType : ($('#projectType_prj_filter').val()
					? $('#projectType_prj_filter').val().join(',')
					: null),
			/*
			 * prjPhase : ($('#phase_prj_filter').val() ? $('#phase_prj_filter')
			 * .val().join(',') : null),
			 */
					projectScopeId : $('#pjtScope_prj_filter option:selected').val(),
					owner : ($('#owner_prj_filter').val()
							? $('#owner_prj_filter').val().join('`')
									: null),
					stateId : $('#state_prj_filter option:selected').val(),
					prjCompany : $('#company_prj_filter option:selected').val(),
					exchangeId : $('#exchange_prj_filter option:selected').val(),
					msegId : $('#marketSeg_prj_filter option:selected').val(),
			prjCrtdFrm : $('#createdFrom_prj_filter').val(),
			prjCrtdTo : $('#createdTo_prj_filter').val(),
			phaseDysFrm : $('#phaseDysFrm_prj_filter').val(),
			phaseDysTo : $('#phaseDysTo_prj_filter').val(),
			projectExpedite : $('#expedite_prj_filter').val(),
			sortFields:sortFieldValString,/*for multisort*/
		    sortOrders:sortOrderValString,
		    sortFlag:sortFlag
		};
	}
	// $('#page_projects_es').jqPagination({max_page : 0,current_page : 1});
	if (!init) {
		$('#page_projects_ef').jqPagination('destroy');
		if ($('#page_projects_ef').jqPagination('getParam', 'max_page') != 0) {
			$('#page_projects_ef').jqPagination('option', 'current_page', 1,
					true);
		}
		$('#page_projects_ef')[0].status = false;
	}
	if (isGlobalSearch) {
		data = {
			offset : offset || 1,
			limit : limit || 26,
			prjPhase : null,
			searchFrom : 1,
			searchFlag : 2,
			projectName : $('#txt_global_search_estimationFootage').val()
					.trim(),
			sapWbsCd : $('#txt_global_search_estimationFootage').val().trim()
		}
	} else {
		$('#txt_global_search_estimationFootage').val('');
	}
	data['curScope'] = setCurrentModuleScope();
	if (projectListRequest && typeof projectListRequest.abort == 'function') {
		projectListRequest.abort();
	}
	projectListRequest = $.ajax({
				url : 'getEstimationFootageProjects',
				cache : false,
				data : data,
				success : function(response) {
					estimationFootageProjectListData.length = 0;
					$('#list-frame_ef').html(response);
					if (!isGlobalSearch
							&& !$('#txt_global_search_estimationFootage').val()
							&& !$('#searchBox_projects_ef').val()) {
						currentFilter = data;
						if(!isSaveSearchCriteria)
						{
						currentFilter.filterId = '';
						}
					} else {
						currentFilter = null;
					}
					var totalCount = 0, page = 0;
					if (estimationFootageProjectListData.length) {
						totalCount = estimationFootageProjectListData[0].totalCount;
						page = Math.ceil(totalCount / 25);
					}
					if (!$('#page_projects_ef')[0].status) {
						$('#page_projects_ef').jqPagination({
							link_string : '/?page={page_number}',
							max_page : page,
							paged : function(page) {
								if (page != 1) {
									page = ((page - 1) * 25) + 1;
								};
								getEstimationFootageProjects(page, 26, true,
										isGlobalSearch);
							}
						});
						$('#page_projects_ef')[0].status = true;
					}
				}
			});
}

function getConstructionAsbuiltProjects(offset, limit, init, isGlobalSearch,
		isSapwbs) {
	if (!offset && !limit) {
		offset = 1;
		limit = 26;
	}
	if($('#advanceSearchResetIcon').is(':visible') && !isGlobalSearch && !isSapwbs)
	{
		var data=getSavedSearchDetails(offset,limit); 
	}
	else
	{
		
	var data = {
		offset : offset,
		limit : limit,
		prjPhase : '3',
		searchFlag : 2,
		projectName : ($('#searchBox_projects_ca')
				? $('#searchBox_projects_ca').val()
				: null),
		sapWbsCd : ($('#searchBox_projects_ca') ? $('#searchBox_projects_ca')
				.val() : null)
	};
	}
	if($('#searchBox_projects_ca').val()!="" && 
			$('#advanceSearchResetIcon').is(':visible'))
	{
		resetConstructionAsbuiltProjects(1);
	}
	if((isSapwbs ==true)&&$('#searchBox_projects_ca').val()=="")
		{
		data['searchFlag'] =0;
		resetConstructionAsbuiltProjects(1);
		}
	var sortFieldValString=getMultiSortParameters(MULTISORT_FIELD);	
	var sortOrderValString=getMultiSortParameters(MULTISORT_ORDER);
	var sortFlag=1;
	sortFlag=(getMultiSortParameters(MULTISORT_FLAG)==null)?sortFlag:getMultiSortParameters(MULTISORT_FLAG);
	if (($('#projectId_prj_filter').is(':visible') && $('#projectId_prj_filter').val()!=undefined)
			|| (!isGlobalSearch && $('#advanceSearchResetIcon').is(':visible') && !$('#searchBox_projects_ca')
					.val()) && !isSapwbs && $('#projectId_prj_filter').val()!=undefined) {
		// $('#searchBox_projects_es').val('');

		if (currentFilter) {
			var filterName = currentFilter.searchName
					? currentFilter.searchName
							.replace(' (Default)', '')
					: '';
							}
		data = {
			offset : offset || 1,
			limit : limit || 26,
			searchName : isSaveSearchCriteria?filterName:'',
			prjPhase : '3',
			frmSearch : true,
			searchId : null,
			searchFrom : 1,
			isDefault : 0,
			caPrjId : $('#projectId_prj_filter').val().trim(),
			sapWbsCd :$('#sapWbsCode_prj_filter').val().trim(),
			projectName :$('#pjtName_prj_filter').val().trim(),
			lobType : ($('#projectType_prj_filter').val()
					? $('#projectType_prj_filter').val().join(',')
					: null),
			/*
			 * prjPhase : ($('#phase_prj_filter').val() ? $('#phase_prj_filter')
			 * .val().join(',') : null),
			 */
					projectScopeId : $('#pjtScope_prj_filter option:selected').val(),
					owner :($('#owner_prj_filter').val()
							? $('#owner_prj_filter').val().join('`')
									: null),
					stateId : $('#state_prj_filter option:selected').val(),
					prjCompany : $('#company_prj_filter option:selected').val(),
					exchangeId : $('#exchange_prj_filter option:selected').val(),
					msegId : $('#marketSeg_prj_filter option:selected').val(),
			prjCrtdFrm : $('#createdFrom_prj_filter').val(),
			prjCrtdTo : $('#createdTo_prj_filter').val(),
			phaseDysFrm : $('#phaseDysFrm_prj_filter').val(),
			phaseDysTo : $('#phaseDysTo_prj_filter').val(),
			projectExpedite : $('#expedite_prj_filter').val(),
			sortFields:sortFieldValString,/*for multisort*/
		    sortOrders:sortOrderValString,
		    sortFlag:sortFlag
		};
	}
	// $('#page_projects_es').jqPagination({max_page : 0,current_page : 1});
	if (!init) {
		$('#page_projects_ca').jqPagination('destroy');
		if ($('#page_projects_ca').jqPagination('getParam', 'max_page') != 0) {
			$('#page_projects_ca').jqPagination('option', 'current_page', 1,
					true);
		}
		$('#page_projects_ca')[0].status = false;
	}
	if (isGlobalSearch) {
		data = {
			offset : offset || 1,
			limit : limit || 26,
			prjPhase : null,
			searchFrom : 1,
			searchFlag : 2,
			projectName : $('#txt_global_search_constructionAsbuilt').val()
					.trim(),
			sapWbsCd : $('#txt_global_search_constructionAsbuilt').val().trim()
		}
	} else {
		$('#txt_global_search_constructionAsbuilt').val('');
	}
	data['curScope'] = setCurrentModuleScope();
	if (projectListRequest && typeof projectListRequest.abort == 'function') {
		projectListRequest.abort();
	}
	projectListRequest = $.ajax({
				url : 'getConstructionAsbuiltProjects',
				cache : false,
				data : data,
				success : function(response) {
					constructionAsbuiltProjectListData.length = 0;
					$('#list-frame_ca').html(response);
					if (!isGlobalSearch
							&& !$('#txt_global_search_constructionAsbuilt')
									.val()
							&& !$('#searchBox_projects_ca').val()) {
						currentFilter = data;
						if(!isSaveSearchCriteria)
						{
						currentFilter.filterId = '';
						}
					} else {
						currentFilter = null;
					}
					var totalCount = 0, page = 0;
					if (constructionAsbuiltProjectListData.length) {
						totalCount = constructionAsbuiltProjectListData[0].totalCount;
						page = Math.ceil(totalCount / 25);
					}
					if (!$('#page_projects_ca')[0].status) {
						$('#page_projects_ca').jqPagination({
							link_string : '/?page={page_number}',
							max_page : page,
							paged : function(page) {
								if (page != 1) {
									page = ((page - 1) * 25) + 1;
								};
								getConstructionAsbuiltProjects(page, 26, true,
										isGlobalSearch);
							}
						});
						$('#page_projects_ca')[0].status = true;
					}
				}
			});
}

function getConstructionAsbuiltSummaryProjects(offset, limit, init,
		isGlobalSearch, isSapWbs) {
	if (!offset && !limit) {
		offset = 1;
		limit = 26;
	}
	if($('#advanceSearchResetIcon').is(':visible') && !isGlobalSearch && !isSapWbs)
	{
		var data=getSavedSearchDetails(offset,limit); 
	}
	else
	{
	var data = {
		offset : offset,
		limit : limit,
		prjPhase : '3,4,7',
		searchFlag : 2,
		projectName : ($('#searchBox_projects_cas')
				? $('#searchBox_projects_cas').val()
				: null),
		sapWbsCd : ($('#searchBox_projects_cas') ?$('#searchBox_projects_cas')
				.val() : null)
	};
	}
	if($('#searchBox_projects_cas').val()!="" && 
			$('#advanceSearchResetIcon').is(':visible'))
	{
		resetConstructionAsbuiltSummaryProjects(1);
	}
	if((isSapWbs ==true)&&$('#searchBox_projects_cas').val()=="")
		{
		data['searchFlag'] =0;
		resetConstructionAsbuiltSummaryProjects(1);
		}
	var sortFieldValString=getMultiSortParameters(MULTISORT_FIELD);	
	var sortOrderValString=getMultiSortParameters(MULTISORT_ORDER);
	var sortFlag=1;
	sortFlag=(getMultiSortParameters(MULTISORT_FLAG)==null)?sortFlag:getMultiSortParameters(MULTISORT_FLAG);
	if (($('#projectId_prj_filter').is(':visible') && $('#projectId_prj_filter').val()!=undefined)
			|| (!isGlobalSearch && $('#advanceSearchResetIcon').is(':visible') && !$('#searchBox_projects_cas')
					.val()) && !isSapWbs && $('#projectId_prj_filter').val()!=undefined) {
		// $('#searchBox_projects_es').val('');

		if (currentFilter) {
			var filterName = currentFilter.searchName
					? currentFilter.searchName
							.replace(' (Default)', '')
					: '';
							}
		data = {
			offset : offset || 1,
			limit : limit || 26,
			searchName : isSaveSearchCriteria?filterName:'',
			prjPhase : '3,4,7',
			frmSearch : true,
			searchId : null,
			searchFrom : 1,
			isDefault : 0,
			caPrjId : $('#projectId_prj_filter').val().trim(),
			sapWbsCd : $('#sapWbsCode_prj_filter').val().trim(),
			projectName : $('#pjtName_prj_filter').val().trim(),
			lobType : ($('#projectType_prj_filter').val()
					? $('#projectType_prj_filter').val().join(',')
					: null),
			/*
			 * prjPhase : ($('#phase_prj_filter').val() ? $('#phase_prj_filter')
			 * .val().join(',') : null),
			 */
					 projectScopeId : $('#pjtScope_prj_filter option:selected').val(),
					   owner :($('#owner_prj_filter').val()
								? $('#owner_prj_filter').val().join('`')
										: null),
						stateId : $('#state_prj_filter option:selected').val(),
						prjCompany : $('#company_prj_filter option:selected').val(),
						exchangeId : $('#exchange_prj_filter option:selected').val(),
						msegId : $('#marketSeg_prj_filter option:selected').val(),
			prjCrtdFrm : $('#createdFrom_prj_filter').val(),
			prjCrtdTo : $('#createdTo_prj_filter').val(),
			phaseDysFrm : $('#phaseDysFrm_prj_filter').val(),
			phaseDysTo : $('#phaseDysTo_prj_filter').val(),
			projectExpedite : $('#expedite_prj_filter').val(),
			sortFields:sortFieldValString,/*for multisort*/
		    sortOrders:sortOrderValString,
		    sortFlag:sortFlag
		};
	}
	// $('#page_projects_es').jqPagination({max_page : 0,current_page : 1});
	if (!init) {
		$('#page_projects_cas').jqPagination('destroy');
		if ($('#page_projects_cas').jqPagination('getParam', 'max_page') != 0) {
			$('#page_projects_cas').jqPagination('option', 'current_page', 1,
					true);
		}
		$('#page_projects_cas')[0].status = false;
	}
	if (isGlobalSearch) {
		data = {
			offset : offset || 1,
			limit : limit || 26,
			prjPhase : null,
			searchFrom : 1,
			searchFlag : 2,
			projectName : $('#txt_global_search_constructionAsbuiltSummary')
					.val().trim(),
			sapWbsCd : $('#txt_global_search_constructionAsbuiltSummary').val()
					.trim()
		}
	} else {
		$('#txt_global_search_constructionAsbuiltSummary').val('');
	}
	data['curScope'] = setCurrentModuleScope();
	if (projectListRequest && typeof projectListRequest.abort == 'function') {
		projectListRequest.abort();
	}
	projectListRequest = $.ajax({
		url : 'getConstructionAsbuiltSummaryProjects',
		cache : false,
		data : data,
		success : function(response) {
			constructionAsbuiltSummaryProjectListData.length = 0;
			$('#list-frame_cas').html(response);
			if (!isGlobalSearch
					&& !$('#txt_global_search_constructionAsbuiltSummary')
							.val() && !$('#searchBox_projects_cas').val()) {
				currentFilter = data;
				if(!isSaveSearchCriteria)
				{
				currentFilter.filterId = '';
				}
			} else {
				currentFilter = null;
			}
			var totalCount = 0, page = 0;
			if (constructionAsbuiltSummaryProjectListData.length) {
				totalCount = constructionAsbuiltSummaryProjectListData[0].totalCount;
				page = Math.ceil(totalCount / 25);
			}
			if (!$('#page_projects_cas')[0].status) {
				$('#page_projects_cas').jqPagination({
					link_string : '/?page={page_number}',
					max_page : page,
					paged : function(page) {
						if (page != 1) {
							page = ((page - 1) * 25) + 1;
						};
						getConstructionAsbuiltSummaryProjects(page, 26, true,
								isGlobalSearch);
					}
				});
				$('#page_projects_cas')[0].status = true;
			}
		}
	});
}

function getConstructionAsbuiltFootageProjects(offset, limit, init,
		isGlobalSearch, isSapWbs) {
	if (!offset && !limit) {
		offset = 1;
		limit = 26;
	}
	if($('#advanceSearchResetIcon').is(':visible') && !isGlobalSearch && !isSapWbs)
	{
		var data=getSavedSearchDetails(offset,limit); 
	}
	else
	{
	var data = {
		offset : offset,
		limit : limit,
		prjPhase : '3',
		searchFlag : 2,
		projectName : ($('#searchBox_projects_caf')
				?$('#searchBox_projects_caf').val()
				: null),
		sapWbsCd : ($('#searchBox_projects_caf') ? $('#searchBox_projects_caf')
				.val(): null)
	};
	}
	if($('#searchBox_projects_caf').val()!="" && 
			$('#advanceSearchResetIcon').is(':visible'))
	{
		resetConstructionAsbuiltFootageProjects(1);
	}
	if((isSapWbs ==true)&&$('#searchBox_projects_caf').val()=="")
		{
		data['searchFlag'] =0;
		resetConstructionAsbuiltFootageProjects(1);
		}
	var sortFieldValString=getMultiSortParameters(MULTISORT_FIELD);	
	var sortOrderValString=getMultiSortParameters(MULTISORT_ORDER);
	var sortFlag=1;
	sortFlag=(getMultiSortParameters(MULTISORT_FLAG)==null)?sortFlag:getMultiSortParameters(MULTISORT_FLAG);
	if (($('#projectId_prj_filter').is(':visible') && $('#projectId_prj_filter').val()!=undefined)
			|| (!isGlobalSearch && $('#advanceSearchResetIcon').is(':visible') && !$('#searchBox_projects_caf')
					.val()) && !isSapWbs && $('#projectId_prj_filter').val()!=undefined) {
		// $('#searchBox_projects_es').val('');
		if (currentFilter) {
			var filterName = currentFilter.searchName
					? currentFilter.searchName
							.replace(' (Default)', '')
					: '';
							}
		data = {
			offset : offset || 1,
			limit : limit || 26,
			searchName : isSaveSearchCriteria?filterName:'',
			prjPhase : '3',
			frmSearch : true,
			searchId : null,
			searchFrom : 1,
			isDefault : 0,
			caPrjId : $('#projectId_prj_filter').val().trim(),
			sapWbsCd :$('#sapWbsCode_prj_filter').val().trim(),
			projectName : $('#pjtName_prj_filter').val().trim(),
			lobType : ($('#projectType_prj_filter').val()
					? $('#projectType_prj_filter').val().join(',')
					: null),
			/*
			 * prjPhase : ($('#phase_prj_filter').val() ? $('#phase_prj_filter')
			 * .val().join(',') : null),
			 */
					projectScopeId : $('#pjtScope_prj_filter option:selected').val(),
					owner :($('#owner_prj_filter').val()
							? $('#owner_prj_filter').val().join('`')
									: null),
					stateId : $('#state_prj_filter option:selected').val(),
					prjCompany : $('#company_prj_filter option:selected').val(),
					exchangeId : $('#exchange_prj_filter option:selected').val(),
					msegId : $('#marketSeg_prj_filter option:selected').val(),
			prjCrtdFrm : $('#createdFrom_prj_filter').val(),
			prjCrtdTo : $('#createdTo_prj_filter').val(),
			phaseDysFrm : $('#phaseDysFrm_prj_filter').val(),
			phaseDysTo : $('#phaseDysTo_prj_filter').val(),
			projectExpedite : $('#expedite_prj_filter').val(),
			sortFields:sortFieldValString,/*for multisort*/
		    sortOrders:sortOrderValString,
		    sortFlag:sortFlag
		};
	}
	// $('#page_projects_es').jqPagination({max_page : 0,current_page : 1});
	if (!init) {
		$('#page_projects_caf').jqPagination('destroy');
		if ($('#page_projects_caf').jqPagination('getParam', 'max_page') != 0) {
			$('#page_projects_caf').jqPagination('option', 'current_page', 1,
					true);
		}
		$('#page_projects_caf')[0].status = false;
	}
	if (isGlobalSearch) {
		data = {
			offset : offset || 1,
			limit : limit || 26,
			prjPhase : null,
			searchFrom : 1,
			searchFlag : 2,
			projectName : $('#txt_global_search_constructionAsbuiltFootage')
					.val().trim(),
			sapWbsCd : $('#txt_global_search_constructionAsbuiltFootage').val()
					.trim()
		}
	} else {
		$('#txt_global_search_constructionAsbuiltFootage').val('');
	}
	data['curScope'] = setCurrentModuleScope();
	if (projectListRequest && typeof projectListRequest.abort == 'function') {
		projectListRequest.abort();
	}
	projectListRequest = $.ajax({
		url : 'getConstructionAsbuiltFootageProjects',
		cache : false,
		data : data,
		success : function(response) {
			constructionAsbuiltFootageProjectListData.length = 0;
			$('#list-frame_caf').html(response);
			if (!isGlobalSearch
					&& !$('#txt_global_search_constructionAsbuiltFootage')
							.val() && !$('#searchBox_projects_caf').val()) {
				currentFilter = data;
				if(!isSaveSearchCriteria)
				{
				currentFilter.filterId = '';
				}
			} else {
				currentFilter = null;
			}
			var totalCount = 0, page = 0;
			if (constructionAsbuiltFootageProjectListData.length) {
				totalCount = constructionAsbuiltFootageProjectListData[0].totalCount;
				page = Math.ceil(totalCount / 25);
			}
			if (!$('#page_projects_caf')[0].status) {
				$('#page_projects_caf').jqPagination({
					link_string : '/?page={page_number}',
					max_page : page,
					paged : function(page) {
						if (page != 1) {
							page = ((page - 1) * 25) + 1;
						};
						getConstructionAsbuiltFootageProjects(page, 26, true,
								isGlobalSearch);
					}
				});
				$('#page_projects_caf')[0].status = true;
			}
		}
	});
}
function getDashBoardProjects(offset, limit,init)
{
	//in loadDashboardProjects
	if($('#advanceSearchResetIcon').is(':visible'))
	{
		var data=getSavedSearchDetails(offset,limit); 
	}
	else
	{
		data = {
				searchName : "dshbord",
				frmSearch : true,
				searchId : null,
				isDefault : 0,
				searchFrom :0,
				order : (order || null),
				offset : offset,
				limit : limit,
				inFrom:1
			}
	}
//	if(currentFilter)
//	{
//	if(currentFilter['prjSortBy'])
//		{
//		currentFilter['sortFlag'] = 1;
//		}
//	}
/*	var data = currentFilter;
	if (!currentFilter) {
		data = {
			searchName : "dshbord",
			frmSearch : true,
			searchId : null,
			isDefault : 0,
			searchFrom :0,
			order : (order || null),
			offset : offset,
			limit : limit
		}
	} else {
		data['offset'] = offset;
		data['limit'] = limit;
		data['order'] = order;
		data['phaseDysTo'] = currentFilter['phaseDysTo'] == 0
				? null
				: currentFilter['phaseDysTo'];
		data['phaseDysFrm'] = currentFilter['phaseDysFrm'] == 0
				? null
				: currentFilter['phaseDysFrm'];
		data['prjCompany'] = currentFilter['prjCompany'] == 0
				? null
				: currentFilter['prjCompany'];
		data['prjPhase'] = currentFilter['prjPhase'] == 0
				? null
				: currentFilter['prjPhase'];
		data['projectExpedite'] = currentFilter['projectExpedite'] == -1
				? null
				: currentFilter['projectExpedite'];
		data['projectScopeId'] = currentFilter['projectScopeId'] == 0
				? null
				: currentFilter['projectScopeId'];
		data['searchFrom'] = currentFilter['searchFrom'] == 0
				? null
				: currentFilter['searchFrom'];
		data['stateId'] = currentFilter['stateId'] == 0
				? null
				: currentFilter['stateId'];
		data['prjSortBy'] = currentFilter['prjSortBy'] == 0
		? null
		: currentFilter['prjSortBy'];

	}*/
	/*if (isGlobalSearch) {
		data = {
			offset : offset ? offset : 1,
			limit : limit ? limit : 26,
			searchFrom : 1,
			searchFlag : 2,
			prjPhase : null,
			projectName : $('#txt_global_search_projects').val().trim(),
			sapWbsCd : $('#txt_global_search_projects').val().trim()
		}
	}*/
	delete data.asJson;
	delete data.projectDetails;
/*	if ($('#txt_global_search_projects').val()) {
		data = {
			offset : offset ? offset : 1,
			limit : limit ? limit : 26,
			searchFrom : 1,
			searchFlag : 2,
			prjPhase : null,
			order : (order || null),
			projectName : $('#txt_global_search_projects').val().trim(),
			sapWbsCd : $('#txt_global_search_projects').val().trim()
		}
	}*/
	data['curScope'] = setCurrentModuleScope();
	if (projectListRequest && typeof projectListRequest.abort == 'function') {
		projectListRequest.abort();
	}
	data['inFrom'] = 1;
	projectListRequest = $.ajax({
		url : 'getDashBoardProjects',
		cache : false,
		data : data,
		success : function(response)  {

			dashBoardProjectList.length = 0;
			$('#project_list_db').html(response);
			if ($('#searchid_db').val() == 0) {
				$('#reset_filter').hide();
			}

			/*
			 * var pagination=$(".pagination"); $.each(pagination,
			 * function( index, value ) {
			 * $(value).jqPagination('destroy'); alert( index + ": " +
			 * value ); });
			 */
			// if (dashBoardProjectList.length > 0) {
			if (init) {
				// alert("dashbord");
				//setSearchId();
				// setpagination();
				/*
				 * if($('#page_projects_db').jqPagination()!=undefined) {
				 */
				/*
				 * $('#page_projects_db').jqPagination('option',
				 * 'current_page', 1);
				 */
				// }
				var totalCount;
				if (dashBoardProjectList.length > 0) {
					totalCount = dashBoardProjectList[0].totalCount;
					pages = Math.ceil(totalCount / 25);
				} else {
					totalCount = 0;
					pages = 0;
				}
				
				if ($('#page_projects_db')[0].status) {
					try {
						$('#page_projects_db').jqPagination('destroy');
					} catch (err) {
						if (console) {
							console.erroe(err);
						}
					}
					// $('#page_projects_projects').jqPagination('option','current_page',
					// 1);
				}

				$('#page_projects_db').jqPagination({
							link_string : '/?page={page_number}',
							max_page : pages,
							current_page : 1,
							totalCount : totalCount,
							paged : function(page) {

								// alert(page);
								if (page != 1) {
									page = ((page - 1) * 25) + 1;
								}
								//pagination(page);
								getDashBoardProjects(page, 26,false);
							}
						});
				// $('#page_projects_db').jqPagination('option',
				// 'max_page', pages);
				$('#page_projects_db')[0].status=true;

			}
			
			loadProjectDetails(0);
			// }
		}
	});	
}
function loadProjects(offset, limit, order, isGlobalSearch) {
//	in loadProjects

	if($("#projects_grid").jqGrid('getGridParam','sortname')=='prj_id')
		{
			if (!order  && (currentFilter)?(!currentFilter['prjSortBy'] && !currentFilter['sortFields']):!currentFilter) {
				var sortColumnName = $("#projects_grid").jqGrid('getGridParam',
						'sortname');
				var sortOrder = $("#projects_grid").jqGrid('getGridParam', 'sortorder');
				if (sortColumnName && sortOrder) {
					order = sortColumnName + ' ' + sortOrder;
				}
			}
			else if(!order && (currentFilter)?(currentFilter['prjSortBy'] && currentFilter['sortFields']):!currentFilter)
			{
			order=null;
			}
		}
	else{
			if (!order) {
				var sortColumnName = $("#projects_grid").jqGrid('getGridParam',
						'sortname');
				var sortOrder = $("#projects_grid").jqGrid('getGridParam', 'sortorder');
				if (sortColumnName && sortOrder) {
					order = sortColumnName + ' ' + sortOrder;
				}
			}
	}
	
	
	if(currentFilter)
	{
	if((currentFilter['prjSortBy'] ||currentFilter['sortFields'])  && !order)
		{
		currentFilter['sortFlag'] = 1;
		}
	else
		{
		currentFilter['sortFlag'] = 0;
		}
	}
	var data = currentFilter;
	if (!currentFilter) {
		data = {
			order : (order || null),
			offset : offset,
			limit : limit
		}
	} else {
		data['offset'] = offset;
		data['limit'] = limit;
		data['order'] = order;
		data['phaseDysTo'] = currentFilter['phaseDysTo'] == 0
				? null
				: currentFilter['phaseDysTo'];
		data['phaseDysFrm'] = currentFilter['phaseDysFrm'] == 0
				? null
				: currentFilter['phaseDysFrm'];
		data['prjCompany'] = currentFilter['prjCompany'] == 0
				? null
				: currentFilter['prjCompany'];
		data['prjPhase'] = currentFilter['prjPhase'] == 0
				? null
				: currentFilter['prjPhase'];
		data['projectExpedite'] = currentFilter['projectExpedite'] == -1
				? null
				: currentFilter['projectExpedite'];
		data['projectScopeId'] = currentFilter['projectScopeId'] == 0
				? null
				: currentFilter['projectScopeId'];
		data['searchFrom'] = currentFilter['searchFrom'] == 0
				? null
				: currentFilter['searchFrom'];
		data['stateId'] = currentFilter['stateId'] == 0
				? null
				: currentFilter['stateId'];/*
		data['sortFileds'] = (currentFilter['sortFields'] == null ||currentFilter['sortFields'] == "")
		? null
		: currentFilter['sortFields'];
		data['sortOrders'] = (currentFilter['sortOrders'] == null ||currentFilter['sortOrders'] == "")
		? null
		: currentFilter['sortOrders'];*/
		//TODO
/*		sortFields:sortFieldValString,
	    sortOrders:sortOrderValString,
	    sortFlag:sortFlag
*/

	}
	if (isGlobalSearch) {
		data = {
			offset : offset ? offset : 1,
			limit : limit ? limit : 26,
			searchFrom : 1,
			searchFlag : 2,
			prjPhase : null,
			projectName : ($('#txt_global_search_projects')
					? $('#txt_global_search_projects').val().trim()
							: null),
			sapWbsCd : ($('#txt_global_search_projects')
					? $('#txt_global_search_projects').val().trim()
							: null)
		}
	}
	delete data.asJson;
	delete data.projectDetails;
	if ($('#txt_global_search_projects').val()) {
		data = {
			offset : offset ? offset : 1,
			limit : limit ? limit : 26,
			searchFrom : 1,
			searchFlag : 2,
			prjPhase : null,
			order : (order || null),
			projectName :  ($('#txt_global_search_projects')
					? $('#txt_global_search_projects').val().trim()
							: null),
			sapWbsCd :  ($('#txt_global_search_projects')
					? $('#txt_global_search_projects').val().trim()
							: null)
		}
	}
	data['curScope'] = setCurrentModuleScope();
	if (projectListRequest && typeof projectListRequest.abort == 'function') {
		projectListRequest.abort();
	}
	//alert("3")
	projectListRequest = $.ajax({
		url : 'filterProjectSearch',
		cache : false,
		data : data,
		success : function(response) {
			$("#projects_grid").jqGrid('clearGridData');
			dashBoardProjectListData.length = 0;
			for (var index = 0; index < response.projectDetails.length; index++) {
				$("#projects_grid").jqGrid('addRowData', index + 1,
						response.projectDetails[index]);
				dashBoardProjectListData.push(response.projectDetails[index]);
			}
			var pages = 0, totalCount = 0;
			if (response.projectDetails[0]) {
				totalCount = response.projectDetails[0].totalCount;
				pages = Math.ceil(totalCount / 25);
			}
			if ($('#page_projects_projects')[0].status) {
				try {
					$('#page_projects_projects').jqPagination('destroy');
				} catch (err) {
					if (console) {
						console.erroe(err);
					}
				}
				// $('#page_projects_projects').jqPagination('option','current_page',
				// 1);
			}
			$('#page_projects_projects').jqPagination({
						link_string : '/?page={page_number}',
						max_page : pages,
						totalCount : totalCount,
						paged : function(page) {
							if (page != 1) {
								page = ((page - 1) * 25) + 1;
							}
							loadProjects(page, 26, null, isGlobalSearch);
						}
					});
			$('#page_projects_projects')[0].status = true;
			// $('#page_projects_projects').jqPagination('option','current_page',
			// 1);
			// }
		}
	});
}

function loadDefaultProjects(offset, limit) {
	for (var index = 0; index < projectFilters.length; index++) {
		if (projectFilters[index].isDefault == 1) {
			
			assignMultiSortParameters(index);
			currentFilter = projectFilters[index];
			currentFilter.filterId = index;
			// $('#advanceSearchIcon').addClass('active');
			$('#advanceSearchResetIcon').removeClass('hidden');
			break;
		}
	}
	offset = offset ? offset : 1;
	limit = limit ? limit : 26;
	loadProjects(offset, limit);
	if (currentFilter) {
		$('#current_filter_lbl').html(currentFilter.searchName
				? currentFilter.searchName.replace(' (Default)', '')
				: '');
	}
}

function resetFilter() {
	currentFilter = undefined;
	if(projectsSearchMode == 'pr'){
		$('#current_filter_lbl').html('');
		$('#advanceSearchResetIcon').addClass('hidden');
		$('#txt_global_search_projects').val('');
		loadProjects(1, 26, null);
		if ($('#page_projects_projects').jqPagination('getParam', 'current_page') != 1 && $('#page_projects_projects').jqPagination('getParam', 'current_page') != 0) {
			$('#page_projects_projects').jqPagination('option', 'current_page', 1,
					true);
		}
	} else {
		if($('#advanceSearchResetIcon') && $('#advanceSearchResetIcon').is(':visible')) {
			$('#advanceSearchResetIcon').click();
		}
	}
	$('#advanceSearchIcon').removeClass('active');
}
function projectGridList(offset, limit, init) {
	currentProjectId = null;
	currentPrjectId = null;
	if (arguments.length <= 0) {
		offset = 1;
		limit = 26;
		init = true;
	}
	$.ajax({
				url : 'loadProjectsView',
				cache : false,
				data : {
					offset : offset,
					limit : limit,
					curScope : setCurrentModuleScope()
				},
				success : function(response) {
					
					$('#ifrMain').html(response);
					projectsSearchMode = 'pr';
					currentFilter = null;
					if (init) {
						if (dashBoardProjectListData[0]) {
							var totalCount = dashBoardProjectListData[0].totalCount;
							var pages = Math.ceil(totalCount / 25);
							$('#page_projects_projects').jqPagination({
										link_string : '/?page={page_number}',
										max_page : pages,
										totalCount : totalCount,
										paged : function(page) {
											if (page != 1) {
												page = ((page - 1) * 25) + 1;
											}
											loadProjects(page, 26);
										}
									});
						}
						loadProjectFilterMaster(true);
					}
				}
			});
}

function filterProjectDashBoard() {

	if (($("#searchTo").val().trim() != ""
			&& $("#searchTo").val().trim() != "0" && $("#phaseDays").val()
			.trim() != "")
			&& (parseFloat($("#phaseDays").val().trim()) > parseFloat($("#searchTo")
					.val().trim()))) {

		showConfirmationBox(
				"Warning",
				"'Phase Days To' should be greater than or equal to the value of 'Phase Days From'",
				null, null, 'hideConfirmationBox()', null, false, false,
				okButton, false);

	}

	else if ($("#projectId").val().trim() != ""
			|| $("#sapWbsCode").val().trim() != ""
			|| $("#searchPjtName").val().trim() != ""
			|| $("#projectType").val() != null
			|| $("#phase").val() != null
			|| (($("#pjtScope").val() == "") ? null : $("#pjtScope").val()) != null
			//|| $("#searchowner").val().trim() !== ""
			||	 (($("#searchowner").val() == "") ? null : $("#searchowner").val()) != null
			|| (($("#searchState").val() == "") ? null : $("#searchState")
					.val()) != null
			|| (($("#company").val() == "") ? null : $("#company").val()) != null
			|| (($("#exchange").val() == "") ? null : $("#exchange").val()) != null
			|| (($("#marketSeg").val() == "") ? null : $("#marketSeg").val()) != null
			|| $("#datetimepicker_createdFrom").val() != ""
			|| $("#datetimepicker_createdTo").val() != ""
			|| $("#phaseDays").val().trim() != ""
			|| $("#searchTo").val().trim() != "" || $("#expedite").val() != 2
			|| $('#rightValues').val() != null || $('#searchid_db').val() != 0) {

		hideAdVancedSearchGrayBox();
		$('#reset_filter').show();
		if($('#page_projects_db').jqPagination('getParam', 'current_page') != 0){
			$('#page_projects_db').jqPagination('option', 'current_page', 1, true);
		}
		$('#page_projects_db').jqPagination('destroy');

		searchDashBoardProjects(1, 26, true);

	} else

	{
		showConfirmationBox("Warning",
				'Please Select Atleast One Filter Criteria..', null, null,
				'hideConfirmationBox()', null, false, false, okButton, false);

	}

}
/*function searchDashBoardProjects(offset, limit, init) {

	var projectId = "", sapWbsCode = "", projectName = "", projectType = "", phase = "", projectScope = "", owner = "", state = "", company = "", exchange = "", marketSegment = "", createdFrom = "", createdTo = "", phaseDaysFrom = "", phaseDaysTo = "", expedite = "", sortBy = "";
	if ($("#projectId").val() != undefined) {
		projectId = $("#projectId").val().trim();
	}
	if ($("#sapWbsCode").val() != undefined) {
		sapWbsCode = $("#sapWbsCode").val().trim();
	}
	if ($("#searchPjtName").val() != undefined) {
		projectName = $("#searchPjtName").val().trim();
	}
	if ($("#projectType").attr('value') != ""
			&& $("#projectType").attr('value') != undefined) {
		projectType = $("#projectType").val().join(',');
	} else {
		projectType = "";
	}
	if ($('#phase').attr('value') != ""
			&& $("#phase").attr('value') != undefined) {
		phase = $("#phase").val().join(',');
	} else {
		phase = "";
	}

	projectScope = $("#pjtScope").val();
	
	if ($("#searchowner").attr('value') != ""
		&& $("#searchowner").attr('value') != undefined) {
		owner = ($('#searchowner').val()
				? $('#searchowner').val().join(',')
						: null)
	//	owner = $("#searchowner").val().trim();
	}

	state = $("#searchState").val();

	company = $("#company").val();
    
	exchange = $("#exchange").val();

	marketSegment = $("#marketSeg").val();

	createdFrom = $("#datetimepicker_createdFrom").val();

	createdTo = $("#datetimepicker_createdTo").val();
	if ($("#phaseDays").val() != undefined) {

		phaseDaysFrom = $("#phaseDays").val().trim();
	}
	if ($("#searchTo").val() != undefined) {

		phaseDaysTo = $("#searchTo").val().trim();
	}

	expedite = $("#expedite").val();
	if ($('#rightValues').val() != null) {
		sortBy = $('#rightValues').val() + " "
				+ $('[name=sort_ordr]:checked').val();
	}
	if ($('#searchid_db').val() != "") {
		searchId = $('#searchid_db').val();
	} else {
		searchId = 0;
	}

	var data = {
		offset : offset,
		limit : limit,
		frmSearch : true,
		searchFrom : 0,
		searchName : "dshbord",
		isDefault : 0,
		createdBy : 1,
		createdDate :new Date(),
		updatedBy : 1,
		updatedDate : new Date(),
		prjId : projectId,
		prjSapWbsCd : sapWbsCode,
		prjName : projectName,
		prjType : projectType,
		prjPhase : phase,
		prjScope : projectScope,
		prjOwner : owner,
		prjState : state,
		prjCompany : company,
		prjExchange : exchange,
		prjMSEG : marketSegment,
		prjCrtdFrm : createdFrom,
		prjCrtdTo : createdTo,
		prjPhaseDysFrm : phaseDaysFrom,
		prjPhaseDysTo : phaseDaysTo,
		prjExpedite : expedite,
		sortOrder : sortBy,
		searchId : searchId,
		currentModule:setCurrentModuleScope(),
		module:currentMainTab
		
		
	};
	//data['curScope'] = setCurrentModuleScope();
	$.ajax({
				url : 'getDashBoardProjectsSearch',
				cache : false,
				data : data,
				success : function(response) {

					dashBoardProjectList.length = 0;
					$('#project_list_db').html(response);

					if (init) {
						setSearchId();

						var totalCount = 0;
						if (dashBoardProjectList.length != 0) {
							totalCount = dashBoardProjectList[0].totalCount;
							pages = Math.ceil(totalCount / 25);
						}

						else {
							pages = 0;
						}

						$('#page_projects_db').jqPagination({
									link_string : '/?page={page_number}',
									max_page : pages,
									current_page : 1,
									totalCount : totalCount,
									paged : function(page) {

										if (page != 1) {
											page = ((page - 1) * 25) + 1;
										}
										pagination(page);

									}
								});

					}
					loadProjectDetails(0);

				}
			});

}*/

function updateProjectsFilterForm(cmb, clear) {
	// in updateProjectsFilterForm
	//alert('updateProjectsFilterForm');
	var value = cmb ? $(cmb).val() : -1, filter;
	if (value && value == -1 && clear) {
		resetProjectFilterForm();
		return;
	}
	/*
	 * for (var index = 0; index < projectFilters.length; index++) { if
	 * (projectFilters[index].searchId == currentFilter.searchId) { filter =
	 * projectFilters[index]; currentFilter.filterId = index; break; }
	 */
	filter = projectFilters[value] || currentFilter;
	if ((cmb && currentFilter) || value != -1) {
		$('#set_as_default')[0].checked = (!!Number(filter.isDefault));
		$('#projectId_prj_filter').val(filter.caPrjId);
		$('#sapWbsCode_prj_filter').val(filter.sapWbsCd);
		$('#pjtName_prj_filter').val(filter.projectName);
		$('#projectType_prj_filter').val(filter.lobType ? filter.lobType
				.split(',') : '');
		// multple sort and assign the current order to each field and set the first selected field's order(asc /desc) default
	/*	if(filter.prjSortBy)
			{
		var sortText=filter.prjSortBy.split(' ');
		$('#leftValues').val(sortText[0]);
		$("#btnRight").click();
		(sortText[1]=='ASC')?$('#ascending_sort').prop("checked", true):$('#descending_sort').prop("checked", true);
			}*/
		
		if(filter.sortFields && filter.sortOrders)
			{
			//For populating the filters with current serach filters
			var sortFieldsArray=filter.sortFields.split(',');
			var sortOrdersArray=filter.sortOrders.split(',');
			for(var i=0;i<sortFieldsArray.length;i++)
				{
				$('#leftValues').val(sortFieldsArray[i]);
				$('#leftValues option:selected').attr('sortval',sortOrdersArray[i]);
				
				$("#btnRight").click();
				}
			$('#rightValues option:first-child').attr("selected", true);
			($('#rightValues option:first-child').attr('sortval')=='ASCD')?$('#ascending_sort').prop("checked", true):$('#descending_sort').prop("checked", true);
			}
		
		if(filter.prjSortBy)
			{
			//For populating the filters with selected criteria from dropdown
			var sortArray=filter.prjSortBy.split(',');
			for(var i=0;i<sortArray.length;i++)
				{
				var orderby = sortArray[i].split(' ');
				var field = orderby[0];
				var order = orderby[1];
				$('#leftValues').val(field);
				$('#leftValues option:selected').attr('sortval',order);
				
				$("#btnRight").click();
				
				}
			$('#rightValues option:first-child').attr("selected", true);
			($('#rightValues option:first-child').attr('sortval')=='ASCD')?$('#ascending_sort').prop("checked", true):$('#descending_sort').prop("checked", true);
	
			
			}
		
		// 
		$("#phase_prj_filter option:selected").removeAttr("selected");
		var phases = ['ispEstMat','isp_dashboard','catv_dashboard','osp_dashboard','ca', 'cas', 'caf','ispL','ispM','ispO','ospL','ospM','ospO','ospE','alaC','hldrom','ipEng','ispEngg','chngs','jcr','redlines','inspectns','cableR','trnsln','circuitInfo','prL','coh'];
		
		if(projectsSearchMode=='pr'){
			$('#phase_prj_filter').val(filter.prjPhase
					? filter.prjPhase.split(',')
					: '');
		}
		else if(projectsSearchMode=='cableR' || projectsSearchMode=='trnsln' || projectsSearchMode=='circuitInfo' || projectsSearchMode=='ispEstMat')
			{
			if(currentFilter.prjPhase)
				{
				$('#phase_prj_filter').val(currentFilter.prjPhase.split(','));
				}
			else
				{
				$('#phase_prj_filter').val(2);
				}
			
			$('#phase_prj_filter').prop('disabled',false);
			$('#phase_prj_filter').find('option[value=4], option[value=7] ,option[value=98], option[value=99]').prop('disabled',true);
			}
		else if(projectsSearchMode=='hldrom' || projectsSearchMode=='ispEngg')
		{
			//commented for avoid reseting current prjPhase
			//currentFilter['prjPhase']='2,3';
			$('#phase_prj_filter').val(currentFilter.prjPhase
					? currentFilter.prjPhase.split(',')
					: '');
		
		}
		else if(projectsSearchMode=='ipEng')
			{
			//commented for avoid reseting current prjPhase
			//currentFilter['prjPhase']='1,2';
			$('#phase_prj_filter').val(currentFilter.prjPhase
					? currentFilter.prjPhase.split(',')
					: '');
			}
		else if (phases.indexOf(projectsSearchMode) == -1) {
//				currentFilter = {
//					prjPhase : '1,2'
//				}
			currentFilter['prjPhase']='1,2';
				$('#phase_prj_filter').val(currentFilter.prjPhase
						? currentFilter.prjPhase.split(',')
						: '');
			} else if (projectsSearchMode == 'ca'
						|| projectsSearchMode == 'chngs'
							|| projectsSearchMode == 'jcr'
								|| projectsSearchMode == 'redlines'
									|| projectsSearchMode == 'inspectns') {
				currentFilter['prjPhase']= '3';
				
				$('#phase_prj_filter').val(currentFilter.prjPhase
						? currentFilter.prjPhase.split(',')
						: '');
			}else if (projectsSearchMode == 'ispL'
					|| projectsSearchMode == 'ispM'
						|| projectsSearchMode == 'ispO'||
						projectsSearchMode == 'ospL'
							|| projectsSearchMode == 'ospM'
								|| projectsSearchMode == 'ospO'
									|| projectsSearchMode == 'ospE'
										|| projectsSearchMode == 'alaC' 
											|| projectsSearchMode == 'isp_dashboard'
												|| projectsSearchMode == 'catv_dashboard'
													|| projectsSearchMode == 'ispEstMat') {
//				currentFilter = {
//					prjPhase : '1,2,3'
//				}
				currentFilter['prjPhase']='1,2,3';
				$('#phase_prj_filter').val(currentFilter.prjPhase
						? currentFilter.prjPhase.split(',')
						: '');
			}
			else if (projectsSearchMode == 'cas' 
					|| projectsSearchMode == 'caf'
					|| projectsSearchMode == 'coh')
			{
//				debugger;
				if(currentFilter.prjPhase){
					$('#phase_prj_filter').val(currentFilter.prjPhase.split(','));
				} else {
					currentFilter['prjPhase']= '3,4,7';
				}
					
					$('#phase_prj_filter').val(currentFilter.prjPhase
							? currentFilter.prjPhase.split(',')
							: '');
					$('#phase_prj_filter').find('option[value=1], option[value=2] ,option[value=98], option[value=99]').prop('disabled',true);
			}
			else if (projectsSearchMode == 'prL')
			{
				currentFilter['prjPhase']='1,2,3,4,7,98,99';
					
					$('#phase_prj_filter').val(currentFilter.prjPhase
							? currentFilter.prjPhase.split(',')
							: '');
			}else if(projectsSearchMode == 'cableR'
				|| projectsSearchMode == 'trnsln'
					|| projectsSearchMode == 'circuitInfo')
				{
				currentFilter['prjPhase']= '2,3';
					
					$('#phase_prj_filter').val(currentFilter.prjPhase
							? currentFilter.prjPhase.split(',')
							: '');
				
		}
		if (projectsSearchMode == 'ispL'||projectsSearchMode == 'ispM'||projectsSearchMode == 'ispO'||projectsSearchMode == 'ospL'||projectsSearchMode == 'ospM'||projectsSearchMode == 'ospO'||projectsSearchMode == 'ospE')
		{
			if(filter.projectScopeText=="-- ALL ---")
			{
				$("#pjtScope_prj_filter").prop('selectedIndex', 0);
			}
			/*else if(!filter.defaultScope)//change jan 20
			{
				$('#pjtScope_prj_filter').val(filter.projectScopeId);
			}*/
			else 
			{
				$('#pjtScope_prj_filter').val(filter.projectScopeId);
			}
		}
		else 
		
		{
			$('#pjtScope_prj_filter').val(filter.projectScopeId);
		}
		$('#owner_prj_filter').val(filter.owner ? filter.owner
				.split('`') : '');
		
		$('#state_prj_filter').val(filter.stateId);
		$('#company_prj_filter').val(filter.prjCompany);
	//	selectExchange('company_prj_filter', true);
		$('#exchange_prj_filter').val(filter.exchangeId);
		$('#marketSeg_prj_filter').val(filter.msegId);
		$('#createdFrom_prj_filter').val(filter.prjCrtdFrm);
		$('#createdTo_prj_filter').val(filter.prjCrtdTo);
		$('#phaseDysFrm_prj_filter').val(filter.phaseDysFrm);
		$('#phaseDysTo_prj_filter').val(filter.phaseDysTo);
		$('#expedite_prj_filter').val(filter.projectExpedite);
	//	if (value != -1 && projectsSearchMode == 'pr') {
		//TODO Changed on jan 6
			if (value != -1) {
			$('#pjtFilterSave').val('Update');
			$('#pjtFilterDelete').removeClass('hidden');
		}

		if (projectsSearchMode != 'pr'&&projectsSearchMode != 'cableR' &&projectsSearchMode != 'trnsln' && projectsSearchMode!='circuitInfo' 
			&& projectsSearchMode!='hldrom' && projectsSearchMode!='ispEngg' && projectsSearchMode!='ipEng' 
			&& projectsSearchMode != 'cas' && projectsSearchMode != 'caf' && projectsSearchMode != 'coh' && projectsSearchMode != 'ispEstMat') {
			$('#phase_prj_filter').attr('disabled', true);
		}

	} else {
		resetProjectFilterForm();
	}
}

function resetProjectFilterForm() {
	if ($('#set_as_default')[0]) {
		$('#set_as_default')[0].checked = false;
	}
	$('#projectId_prj_filter').val('');
	$('#sapWbsCode_prj_filter').val('');
	$('#pjtName_prj_filter').val('');
	$('#projectType_prj_filter').val('');
	$('#phase_prj_filter').val('');
	$('#pjtScope_prj_filter').val('');
	$('#owner_prj_filter').val('');
	$('#state_prj_filter').val('');
	$('#company_prj_filter').val('');
	$('#exchange_prj_filter').val('');
	$('#marketSeg_prj_filter').val('');
	$('#createdFrom_prj_filter').val('');
	$('#createdTo_prj_filter').val('');
	$('#phaseDysFrm_prj_filter').val('');
	$('#phaseDysTo_prj_filter').val('');
	$('#expedite_prj_filter').val('');
	$('#pjtFilterSave').val('Save');
	$('#pjtFilterDelete').addClass('hidden');
	currentFilter.searchId = null;
	currentFilter.searchName = null;
}

function showSaveSearchFilterPopup() {
	$('#popupbox').removeClass('hidden');

}
function hideSaveSearchFilterPopup() {
	//in hideSaveSearchFilterPopup
	if ($('#filtername').val().trim()) {
	//	$('#popupbox').addClass('hidden');
		saveProjectSearchCriteria($('#filtername').val().trim());
	} else {
		showMessage('Save Criteria', 'Please enter a valid Filter Name.');
	}
}

function deleteSearchCriteria() {
	var filter;
	if ($('#projectFilter').val() != -1) {
		filter = projectFilters[$('#projectFilter').val()];
	}
	if (filter && filter.searchId) {
		$.ajax({
					url : 'deleteSearchCriteria',
					cache : false,
					data : {
						searchId : filter.searchId
					},
					success : function(response) {
						hideConfirmationBox();
						showMessage('Delete Search Criteria', response);
						hideAdVancedSearchGrayBox();
						if (projectsSearchMode == 'isp_dashboard'
								|| projectsSearchMode == 'catv_dashboard'
								|| projectsSearchMode == 'osp_dashboard') {
							resetDashBoardProjects();
						} else {
							resetFilter();
						}
					}
				});
	}
}

function confirmDelete() {
	var val = $('#projectFilter :selected').text();
	showConfirmationBox('Search Criteria', 'Are you sure you want to delete "'
					+ val + '"?', 'deleteSearchCriteria()', 'hideConfirmationBox()', null, null, true, true, false, false);
}

function resetOverHeadsProjects(val) {
	
	$('#txt_global_search_overheads').val('');
	$('#advanceSearchResetIcon').addClass('hidden');
	if(!val)
	{$('#searchBox_projects_oh').val('');
	redirectToGetProjects();
	}
	// $('#advanceSearchIcon').removeClass('active');
}

function resetStakedUnitsProjects(val) {

	$('#txt_global_search_staked').val('');
	$('#advanceSearchResetIcon').addClass('hidden');
	if(!val)
	{	$('#searchBox_projects_su').val('');
	redirectToGetProjects();
	}
	// $('#advanceSearchIcon').removeClass('active');
}

function resetEstimationSummaryProjects(val) {
	
	$('#txt_global_search_estimationSummary').val('');
	$('#advanceSearchResetIcon').addClass('hidden');
	if(!val)
	{$('#searchBox_projects_es').val('');
		//getEstimationSummaryProjects();
	redirectToGetProjects();
	}
	// $('#advanceSearchIcon').removeClass('active');
}

function resetEstimationFootageProjects(val) {

	$('#txt_global_search_estimationFootage').val('');
	$('#advanceSearchResetIcon').addClass('hidden');
	if(!val)
	{	$('#searchBox_projects_ef').val('');
	redirectToGetProjects();
	}
	// $('#advanceSearchIcon').removeClass('active');
}

function resetConstructionAsbuiltProjects(val) {
	
	$('#txt_global_search_constructionAsbuilt').val('');
	$('#advanceSearchResetIcon').addClass('hidden');
	if(!val)
	{$('#searchBox_projects_ca').val('');
	redirectToGetProjects();
	}
	// $('#advanceSearchIcon').removeClass('active');
}

function resetConstructionAsbuiltSummaryProjects(val) {

	$('#txt_global_search_constructionAsbuiltSummary').val('');
	$('#advanceSearchResetIcon').addClass('hidden');
	if(!val)
	{	$('#searchBox_projects_cas').val('');
		//getConstructionAsbuiltSummaryProjects();
	redirectToGetProjects();
	}
	// $('#advanceSearchIcon').removeClass('active');
}

function resetConstructionAsbuiltFootageProjects(val) {
	
	$('#txt_global_search_constructionAsbuiltFootage').val('');
	$('#advanceSearchResetIcon').addClass('hidden');
	if(!val)
	{$('#searchBox_projects_cas').val('');
		//getConstructionAsbuiltFootageProjects();
		redirectToGetProjects();
	}
	// $('#advanceSearchIcon').removeClass('active');
}

function resetIspLaborProjects(val) {
	
	$('#txt_global_search_isp_labor').val('');
	$('#advanceSearchResetIcon').addClass('hidden');
	if(!val)
	{
		getIspLaborProjects();
		$('#searchBox_projects_isp_labor').val('');
	}
	// $('#advanceSearchIcon').removeClass('active');
}
function resetIspMaterialProjects(val) {
	
	$('#txt_global_search_isp_material').val('');
	$('#advanceSearchResetIcon').addClass('hidden');
	if(!val)
	{
	getIspMaterialsProjects();
	$('#searchBox_projects_isp_material').val('');
	}
	// $('#advanceSearchIcon').removeClass('active');
}
function resetIspOverheadsProjects(val) {
	
	$('#txt_global_search_isp_overheads').val('');
	$('#advanceSearchResetIcon').addClass('hidden');
	if(!val)
	{
	getIspOverheadsProjects();
	$('#searchBox_projects_isp_overheads').val('');
	}
	// $('#advanceSearchIcon').removeClass('active');
}
function resetOspLaborProjects(val) {
	
	$('#txt_global_search_osp_labor').val('');
	$('#advanceSearchResetIcon').addClass('hidden');
	
	if(!val)
	{
		getOspLaborProjects();
		$('#searchBox_projects_osp_labor').val('');
	}
	// $('#advanceSearchIcon').removeClass('active');
}
function resetOspMaterialsProjects(val) {
	

	$('#txt_global_search_osp_material').val('');
	$('#advanceSearchResetIcon').addClass('hidden');
	if(!val)
	{
		getOspMaterialsProjects();
		$('#searchBox_projects_osp_material').val('');
	}
	// $('#advanceSearchIcon').removeClass('active');
}
function resetOspOverheadsProjects(val) {
	
	$('#txt_global_search_osp_overheads').val('');
	$('#advanceSearchResetIcon').addClass('hidden');
	if(!val)
	{getOspOverheadsProjects();
	$('#searchBox_projects_osp_overheads').val('');
	}
	// $('#advanceSearchIcon').removeClass('active');
}
function resetOspEstimationFootageProjects(val) {
	
	$('#txt_global_search_osp_est').val('');
	$('#advanceSearchResetIcon').addClass('hidden');
	if(!val)
	{
		getOspEstimationFootageProjects();
		$('#searchBox_projects_osp_est').val('');
	}
	// $('#advanceSearchIcon').removeClass('active');
}
function resetAlaCarteProjects(val) {

	$('#txt_global_search_ala_carte').val('');
	$('#advanceSearchResetIcon').addClass('hidden');
	if(!val)
	{
		getAlaCarteProjects();
		$('#searchBox_projects_ala_carte').val('');
	}
	// $('#advanceSearchIcon').removeClass('active');
}
function resetProjectListProjects() {
	//$('#searchBox_projects_ala_carte').val('');
	$('#txt_global_search_projects').val('');
	$('#advanceSearchResetIcon').addClass('hidden');
	loadProjectReport();
	// $('#advanceSearchIcon').removeClass('active');
}
function resetIspEstimationProjects(val) {
	
	
	$('#txt_global_search_isp_est').val('');
	$('#advanceSearchResetIcon').addClass('hidden');
	if(!val)
	{
		redirectToGetProjects();
	$('#searchBox_projects_isp_estMat').val('');
	}
	// $('#advanceSearchIcon').removeClass('active');
}
function resetTranslationsProjects(val) {

	$('#txt_global_search_translations').val('');
	$('#advanceSearchResetIcon').addClass('hidden');
	if(!val)
	{	$('#searchBox_projects_translations').val('');
		getTranslationsProjects();
	}
	// $('#advanceSearchIcon').removeClass('active');
}
function resetChangesProjects(val) {
	
	$('#txt_global_search_changes').val('');
	$('#advanceSearchResetIcon').addClass('hidden');
	if(!val)
	{$('#searchBox_projects_changes').val('');
		//getChangesProjects();
		redirectToGetProjects();
	}
	// $('#advanceSearchIcon').removeClass('active');
}
function resetJcrProjects(val) {
	
	$('#txt_global_search_jcr').val('');
	$('#advanceSearchResetIcon').addClass('hidden');
	if(!val)
	{$('#searchBox_projects_jcr').val('');
		//getJcrProjects();
		redirectToGetProjects();
	}
	// $('#advanceSearchIcon').removeClass('active');
}
function resetIspEnggProjects(val) {

	$('#txt_global_search_isp_engg').val('');
	$('#advanceSearchResetIcon').addClass('hidden');
	if(!val)
	{	$('#searchBox_projects_isp_engg').val('');
		getIspEngineeringProjects();
	}
	// $('#advanceSearchIcon').removeClass('active');
}
function resetIspHldromProjects(val) {

	$('#txt_global_search_isp_hldrom').val('');
	$('#advanceSearchResetIcon').addClass('hidden');
	if(!val)
	{	$('#searchBox_projects_isp_hldrom').val('');
		getHldromProjects();
	}
	// $('#advanceSearchIcon').removeClass('active');
}
function resetIpEngineeringProjects(val) {
	
	$('#txt_global_searchsearchBox_projects_ip_eng').val('');
	$('#advanceSearchResetIcon').addClass('hidden');
	if(!val)
	{$('#searchBox_projects_ip_eng').val('');
		getIpEngineeringProjects();
	}
	// $('#advanceSearchIcon').removeClass('active');
}
function resetRedlinesProjects(val) {
	
	$('#txt_global_searchsearchBox_projects_redlines').val('');
	$('#advanceSearchResetIcon').addClass('hidden');
	if(!val)
	{$('#searchBox_projects_redlines').val('');
		//getRedlinesProjects();
		redirectToGetProjects();
	}
	// $('#advanceSearchIcon').removeClass('active');
}
function resetInspectionsProjects(val) {
	
	$('#txt_global_searchsearchBox_projects_inspections').val('');
	$('#advanceSearchResetIcon').addClass('hidden');
	if(!val)
	{$('#searchBox_projects_inspections').val('');
		//getInspectionProjects();
		redirectToGetProjects();
	}
	// $('#advanceSearchIcon').removeClass('active');
}
function resetCircuitInfoProjects(val) {

	$('#txt_global_searchsearchBox_projects_circuit_info').val('');
	$('#advanceSearchResetIcon').addClass('hidden');
	if(!val)
	{	$('#searchBox_projects_circuit_info').val('');
		getCircuitInformationProjects();
	}
	// $('#advanceSearchIcon').removeClass('active');
}
function resetCableRunningProjects(val) {

	$('#txt_global_search_cable_running').val('');
	$('#advanceSearchResetIcon').addClass('hidden');
	if(!val)
	{	$('#searchBox_projects_cable_running').val('');
		getCableRunningListProjects();
	}
	// $('#advanceSearchIcon').removeClass('active');
}
function resetDashBoardProjects() {
	/*var data = {

		searchId : $('#searchid_db').val()
	};
	if (pages != 0) {
		$('#page_projects_db').jqPagination('option', 'current_page', 1, true);
	}
	$('#page_projects_db').jqPagination('destroy');

	$.ajax({
				url : 'projects_dashBoard_search_reset',
				cache : false,
				data : data,
				success : function() {
					$('#searchid_db').val(0);
					$('#reset_filter').hide();
					$('#confirmationBox').attr('class', 'gray-box hidden');

					getDashboardProjects(1, 26, true);

				}
			});*/
	
	currentFilter = undefined;
	//$('#current_filter_lbl').html('');
	$('#advanceSearchResetIcon').addClass('hidden');
	$('#confirmationBox').attr('class', 'gray-box hidden');
	$('#txt_global_search_projects').val('');
	$('#page_projects_db').jqPagination('destroy');
	getDashBoardProjects(1, 26, true);
	if ($('#page_projects_db').jqPagination('getParam', 'current_page') != 1 && $('#page_projects_db').jqPagination('getParam', 'current_page') != 0) {
		$('#page_projects_db').jqPagination('option', 'current_page', 1,
				true);
	}

}
function setSearchId() {

	$.ajax({
				url : 'Search_Filter_Set_Values',
				cache : false,
				data : {},
				success : function(response) {

					$('#searchid_db').val(response.searchId);

				}
			});

}2
function pagination(page) {
	if ($('#searchid_db').val() == 0) {

		getDashBoardProjects(page, 26, false);
	} else {

		searchDashBoardProjects(page, 26, false);
	}
}

function getProjectsByGlobalSearch() {

	$.ajax({
				url : 'getProjectsByGlobalSearch',
				cache : false,
				data : {
					searchValue : 'w',
					module : currentMainTabName
				},
				success : function(response) {

					$('#searchid_db').val(response.searchId);

				}
			});
}

function onGlobalSearchListClick(obj, url) {
	$.ajax({
				url : url,
				cache : false,
				data : {
					prjId : obj.id,
					offset : 1,
					limit : 999999,
					calcId : 46
				},
				success : function(response) {
					$('#ifrView').html(response);
					$('figure.active').removeClass('active');
				}
			});
}


function getIspLaborProjects(offset, limit, init, isGlobalSearch, isSapWbs) {
	 if (!offset && !limit) {
	  offset = 1;
	  limit = 26;
	 }
	 if($('#advanceSearchResetIcon').is(':visible') && !isGlobalSearch && !isSapWbs)
		{
			var data=getSavedSearchDetails(offset,limit); 
		}
		else
		{
	 var data = {
	  offset : offset,
	  limit : limit,
	  searchFlag :0,//(isSapWbs==true )? 2:0,
	  prjPhase : '1,2,3',
	  projectName : ($('#searchBox_projects_isp_labor')
	    ? $('#searchBox_projects_isp_labor').val()
	    : null),
	  sapWbsCd : ($('#searchBox_projects_isp_labor') ? $('#searchBox_projects_isp_labor')
	    .val() : null),
	  caPrjId : ($('#searchBox_projects_isp_labor') ? $('#searchBox_projects_isp_labor')
	    	    .val() : null)
	 };
		}
	 if($('#searchBox_projects_isp_labor').val()!="" && 
				$('#advanceSearchResetIcon').is(':visible'))
	 {
	  resetIspLaborProjects(1);
	 }
	 if((isSapWbs ==true)&&$('#searchBox_projects_isp_labor').val()=="")
	  {
	  data['searchFlag'] =0;
	  resetIspLaborProjects(1);
	  }
	 else if(/*(isSapWbs ==true)&&*/$('#searchBox_projects_isp_labor').val()!="")
	  {
		  data['searchFlag'] =2;
		  }
	 var sortFieldValString=getMultiSortParameters(MULTISORT_FIELD);	
		var sortOrderValString=getMultiSortParameters(MULTISORT_ORDER);
		var sortFlag=1;
		sortFlag=(getMultiSortParameters(MULTISORT_FLAG)==null)?sortFlag:getMultiSortParameters(MULTISORT_FLAG);
	 if (($('#projectId_prj_filter').is(':visible') && $('#projectId_prj_filter').val()!=undefined)
	   || (!isGlobalSearch && $('#advanceSearchResetIcon').is(':visible') && !$('#searchBox_projects_isp_labor')
	     .val()) && !isSapWbs && $('#projectId_prj_filter').val()!=undefined) {
	  // $('#searchBox_projects_su').val('');
			if (currentFilter) {
				var filterName = currentFilter.searchName
						? currentFilter.searchName
								.replace(' (Default)', '')
						: '';
								}
	  data = {
	   offset : offset || 1,
	   limit : limit || 26,
	   searchName : isSaveSearchCriteria?filterName:'',
	   prjPhase : '1,2,3',
	   frmSearch : true,
	   searchId : null,
	   searchFrom : 0,
	   isDefault : 0,
	   caPrjId : $('#projectId_prj_filter').val().trim(),
	   sapWbsCd :$('#sapWbsCode_prj_filter').val().trim(),
	   projectName :$('#pjtName_prj_filter').val().trim(),
	   lobType : ($('#projectType_prj_filter').val()
	     ? $('#projectType_prj_filter').val().join(',')
	     : null),
	   
	    prjPhase : ($('#phase_prj_filter').val() ? $('#phase_prj_filter')
	     .val().join(',') : null),
	   
	     projectScopeId : $('#pjtScope_prj_filter').val(),
	     projectScopeText:$('#pjtScope_prj_filter').text(),
	   owner : ($('#owner_prj_filter').val()
				? $('#owner_prj_filter').val().join('`')
						: null),
		stateId : $('#state_prj_filter option:selected').val(),
		prjCompany : $('#company_prj_filter option:selected').val(),
		exchangeId : $('#exchange_prj_filter option:selected').val(),
		msegId : $('#marketSeg_prj_filter option:selected').val(),
	   prjCrtdFrm : $('#createdFrom_prj_filter').val(),
	   prjCrtdTo : $('#createdTo_prj_filter').val(),
	   phaseDysFrm : $('#phaseDysFrm_prj_filter').val(),
	   phaseDysTo : $('#phaseDysTo_prj_filter').val(),
	   projectExpedite : $('#expedite_prj_filter').val(),
		sortFields:sortFieldValString,/*for multisort*/
	    sortOrders:sortOrderValString,
	    sortFlag:sortFlag
	  };
	 }
	 // $('#page_projects_su').jqPagination({max_page : 0,current_page : 1});
	 if (!init) {
	  try {
	   $('#page_projects_isp_labor').jqPagination('destroy');
	   if ($('#page_projects_isp_labor').jqPagination('getParam', 'max_page') != 0) {
	    $('#page_projects_isp_labor').jqPagination('option', 'current_page',
	      1, true);
	   }
	   $('#page_projects_isp_labor')[0].status = false;
	  } catch (err) {

	  }
	 }
	 if (isGlobalSearch) {
	  $('#searchBox_projects_isp_labor').val('');
	  data = {
	   offset : offset || 1,
	   limit : limit || 26,
	   searchFrom : 1,
	   searchFlag : 2,
	   prjPhase : null,
	   projectName : $('#txt_global_search_isp_labor').val().trim(),
	   sapWbsCd : $('#txt_global_search_isp_labor').val().trim(),
	   caPrjId : $('#txt_global_search_isp_labor').val().trim(),
	   projectId:!globalProjectSelectedObj?null:globalProjectSelectedObj.id
	  }
	  if(globalProjectSelectedObj)
		{
			globalProjectSelectedObj=null;
		}
			
	 } else {
	  $('#txt_global_search_isp_labor').val('');
	 }
	 data['curScope'] = setCurrentModuleScope();
	/* if(!isGlobalSearch&&!$('#projectId_prj_filter').is(':visible'))
	 {
	  data['inFrom'] =2;
	 }*/
	 data['inFrom'] =2;
	 if((init||isSapWbs)&& $('#searchBox_projects_isp_labor').val()!="")
	 {
	//  data['projectScopeId'] =56;
	  data['projectScopeId'] =null;
	  data['defaultScope'] =true;
	 }
	 if(($('#searchBox_projects_isp_labor').val()!="")||isGlobalSearch)
	 {
	 data['searchFlag'] =2;
	 
	 }
	 if(!data['projectScopeId'])
	 {data['defaultScope'] =true;
	 //Changed scope to null to implement saved search
	 data['projectScopeId']=null;
	 data['inFrom']=2;
	 }
	 if(isGlobalSearch)
	  {
	  data['inFrom']=0;
	  data['projectScopeId']=null;
	  }
	 if (projectListRequest && typeof projectListRequest.abort == 'function') {
	  projectListRequest.abort();
	 }
	 if(!isGlobalSearch && !$('#projectId_prj_filter').is(':visible'))
	 {
	  data['inFrom']=2;
	 }
	/* if (data['projectScopeText']=="-- ALL ---")
	  {
	  data['inFrom']=2;
	  }*/
		if(data['projectName']!=null && data['projectName'].trim().length==0&& data['projectName'].length>0)
			{
			data['searchFlag']=0;
			}
	 projectListRequest = $.ajax({
	    url : 'getIspLaborProjects',
	    cache : false,
	    data : data,
	    async:false,
	    success : function(response) {
	     stakedUnitsProjectListData.length = 0;
	     $('#list-frame_su').html(response);
	     if (!isGlobalSearch
	       && !$('#txt_global_search_isp_labor').val()
	       && !$('#searchBox_projects_isp_labor').val()) {
	      currentFilter = data;
	      if(!isSaveSearchCriteria)
			{
	      currentFilter.filterId = '';
			}
	     } else {
	      currentFilter = null;
	     }
	     var totalCount = 0, pages = 0;
	     if (stakedUnitsProjectListData.length) {
	      totalCount = stakedUnitsProjectListData[0].totalCount;
	      pages = Math.ceil(totalCount / 25);
	     }

	     if (!$('#page_projects_isp_labor')[0].status) {
	      $('#page_projects_isp_labor').jqPagination({
	       link_string : '/?page={page_number}',
	       max_page : pages,
	       paged : function(page) {
	        if (page != 1) {
	         page = ((page - 1) * 25) + 1;
	        }
	        getIspLaborProjects(page, 26, true,
	          isGlobalSearch);
	       }
	      });
	      $('#page_projects_isp_labor')[0].status = true;
	     }
	     if (!isGlobalSearch && !$('#searchOptionsBox').hasClass('hidden')) {
				hideAdVancedSearchGrayBox();
			}
	    }
	   });
	}
function getOspOverheadsProjects(offset, limit, init, isGlobalSearch, isSapWbs) {
	if (!offset && !limit) {
		offset = 1;
		limit = 26;
	}
	if($('#advanceSearchResetIcon').is(':visible') && !isGlobalSearch && !isSapWbs)
	{
		var data=getSavedSearchDetails(offset,limit); 
	}
	else
	{
	var data = {
		offset : offset,
		limit : limit,
		searchFlag :0,//(isSapWbs==true )? 2:0,
		prjPhase : '1,2,3',
		projectName : ($('#searchBox_projects_osp_overheads')
				? $('#searchBox_projects_osp_overheads').val()
				: null),
		sapWbsCd : ($('#searchBox_projects_osp_overheads') ? $('#searchBox_projects_osp_overheads')
				.val() : null),
				caPrjId : ($('#searchBox_projects_osp_overheads') ? $('#searchBox_projects_osp_overheads')
						.val() : null)
	};
	}
	if($('#searchBox_projects_osp_overheads').val()!="" && 
			$('#advanceSearchResetIcon').is(':visible'))
	{
		resetOspOverheadsProjects(1);
	}
	if((isSapWbs ==true)&&$('#searchBox_projects_osp_overheads').val()=="")
		{
		data['searchFlag'] =0;
		resetOspOverheadsProjects(1);
		}
	else if(/*(isSapWbs ==true)&&*/$('#searchBox_projects_osp_overheads').val()!="")
	{
	data['searchFlag'] =2;
	}
	 var sortFieldValString=getMultiSortParameters(MULTISORT_FIELD);	
		var sortOrderValString=getMultiSortParameters(MULTISORT_ORDER);
		var sortFlag=1;
		sortFlag=(getMultiSortParameters(MULTISORT_FLAG)==null)?sortFlag:getMultiSortParameters(MULTISORT_FLAG);
	if (($('#projectId_prj_filter').is(':visible') && $('#projectId_prj_filter').val()!=undefined)
			|| (!isGlobalSearch && $('#advanceSearchResetIcon').is(':visible') && !$('#searchBox_projects_osp_overheads')
					.val()) && !isSapWbs && $('#projectId_prj_filter').val()!=undefined) {
		// $('#searchBox_projects_su').val('');
		data = {
			offset : offset || 1,
			limit : limit || 26,
			searchName : '',
		//	prjPhase : '1,2',
			frmSearch : true,
			searchId : null,
			searchFrom : 1,
			isDefault : 0,
			caPrjId : $('#projectId_prj_filter').val().trim(),
			sapWbsCd : $('#sapWbsCode_prj_filter').val().trim(),
			projectName : $('#pjtName_prj_filter').val().trim(),
			lobType : ($('#projectType_prj_filter').val()
					? $('#projectType_prj_filter').val().join(',')
					: null),
			
			 prjPhase : ($('#phase_prj_filter').val() ? $('#phase_prj_filter')
			  .val().join(',') : null),
			
			  projectScopeId : $('#pjtScope_prj_filter').val(),
			     projectScopeText:$('#pjtScope_prj_filter').text(),
			   owner : ($('#owner_prj_filter').val()
						? $('#owner_prj_filter').val().join('`')
								: null),
				stateId : $('#state_prj_filter option:selected').val(),
				prjCompany : $('#company_prj_filter option:selected').val(),
				exchangeId : $('#exchange_prj_filter option:selected').val(),
				msegId : $('#marketSeg_prj_filter option:selected').val(),
			prjCrtdFrm : $('#createdFrom_prj_filter').val(),
			prjCrtdTo : $('#createdTo_prj_filter').val(),
			phaseDysFrm : $('#phaseDysFrm_prj_filter').val(),
			phaseDysTo : $('#phaseDysTo_prj_filter').val(),
			projectExpedite : $('#expedite_prj_filter').val(),
			sortFields:sortFieldValString,/*for multisort*/
		    sortOrders:sortOrderValString,
		    sortFlag:sortFlag
		};
	}
	// $('#page_projects_su').jqPagination({max_page : 0,current_page : 1});
	if (!init) {
		try {
			$('#page_projects_osp_overheads').jqPagination('destroy');
			if ($('#page_projects_osp_overheads').jqPagination('getParam', 'max_page') != 0) {
				$('#page_projects_osp_overheads').jqPagination('option', 'current_page',
						1, true);
			}
			$('#page_projects_osp_overheads')[0].status = false;
		} catch (err) {

		}
	}
	if (isGlobalSearch) {
		$('#searchBox_projects_osp_overheads').val('');
		data = {
			offset : offset || 1,
			limit : limit || 26,
			searchFrom : 1,
			searchFlag : 2,
			prjPhase : null,
			projectName : $('#txt_global_search_osp_overheads').val().trim(),
			caPrjId : $('#txt_global_search_osp_overheads').val().trim(),
			sapWbsCd : $('#txt_global_search_osp_overheads').val().trim(),
			   projectId:!globalProjectSelectedObj?null:globalProjectSelectedObj.id
		  }
		  if(globalProjectSelectedObj)
			{
				globalProjectSelectedObj=null;
			}	
	} else {
		$('#txt_global_search_osp_overheads').val('');
	}
	data['curScope'] = setCurrentModuleScope();
	/*if(!isGlobalSearch&&!$('#projectId_prj_filter').is(':visible'))
	{
		data['inFrom'] =3;
	}*/
	data['inFrom'] =3;
	if((init||isSapWbs)&& $('#searchBox_projects_osp_overheads').val()!="")
	{	
		//data['projectScopeId'] =57;
		data['projectScopeId'] =null;
		data['defaultScope'] =true;
	}
	if(($('#searchBox_projects_osp_overheads').val()!="")||isGlobalSearch)
		{
		data['searchFlag'] =2;
		}
	if(!data['projectScopeId'])
	{data['defaultScope'] =true;
	//Changed scope to null to implement saved search
	data['projectScopeId']=null;
	data['inFrom']=3;
	}
	if(isGlobalSearch)
	{
	data['inFrom']=0;
	data['projectScopeId']=null;
	}
	if (projectListRequest && typeof projectListRequest.abort == 'function') {
		projectListRequest.abort();
	}
	if(!isGlobalSearch && !$('#projectId_prj_filter').is(':visible'))
	{
		data['inFrom']=3;
	}
	/*if (data['projectScopeText']=="-- ALL ---")
	{
	data['inFrom']=3;
	}*/
	if(data['projectName']!=null && data['projectName'].trim().length==0&& data['projectName'].length>0)
	{
	data['searchFlag']=0;
	}
	projectListRequest = $.ajax({
				url : 'getOspOverheadsProjects',
				cache : false,
				data : data,
				async:false,
				success : function(response) {
					
					overHeadsProjectListData.length = 0;
					$('#list-frame_su').html(response);
					if (!isGlobalSearch
							&& !$('#txt_global_search_osp_overheads').val()
							&& !$('#txt_global_search_osp_overheads').val()) {
						currentFilter = data;
						currentFilter.filterId = '';
					} else {
						currentFilter = null;
					}
					var totalCount = 0, pages = 0;
					if (overHeadsProjectListData.length) {
						totalCount = overHeadsProjectListData[0].totalCount;
						pages = Math.ceil(totalCount / 25);
					}

					if (!$('#page_projects_osp_overheads')[0].status) {
						$('#page_projects_osp_overheads').jqPagination({
							link_string : '/?page={page_number}',
							max_page : pages,
							paged : function(page) {
								if (page != 1) {
									page = ((page - 1) * 25) + 1;
								}
								getOspOverheadsProjects(page, 26, true,
										isGlobalSearch);
							}
						});
						$('#page_projects_osp_overheads')[0].status = true;
					}
					if (!isGlobalSearch && !$('#searchOptionsBox').hasClass('hidden')) {
						hideAdVancedSearchGrayBox();
					}
				}
			});
}
function getOspLaborProjects(offset, limit, init, isGlobalSearch, isSapWbs) {

	if (!offset && !limit) {
		offset = 1;
		limit = 26;
	}
	if($('#advanceSearchResetIcon').is(':visible') && !isGlobalSearch && !isSapWbs)
	{
		var data=getSavedSearchDetails(offset,limit); 
	}
	else
	{
	var data = {
		offset : offset,
		limit : limit,
		searchFlag :0,//(isSapWbs==true )? 2:0,
		prjPhase : '1,2,3',
		projectName : ($('#searchBox_projects_osp_labor')
				?$('#searchBox_projects_osp_labor').val()
				: null),
		sapWbsCd : ($('#searchBox_projects_osp_labor') ?$('#searchBox_projects_osp_labor')
				.val() : null),
				caPrjId : ($('#searchBox_projects_osp_labor') ?$('#searchBox_projects_osp_labor')
						.val() : null)
	};
	}
	if($('#searchBox_projects_osp_labor').val()!="" && 
			$('#advanceSearchResetIcon').is(':visible'))
	{
		resetOspLaborProjects(1);
	}
	if((isSapWbs ==true)&&$('#searchBox_projects_osp_labor').val()=="")
		{
		data['searchFlag'] =0;
		resetOspLaborProjects(1);
		}
	else if(/*(isSapWbs ==true)&&*/$('#searchBox_projects_osp_labor').val()!="")
	{
	data['searchFlag'] =2;
	}
	 var sortFieldValString=getMultiSortParameters(MULTISORT_FIELD);	
		var sortOrderValString=getMultiSortParameters(MULTISORT_ORDER);
		var sortFlag=1;
		sortFlag=(getMultiSortParameters(MULTISORT_FLAG)==null)?sortFlag:getMultiSortParameters(MULTISORT_FLAG);
	if (($('#projectId_prj_filter').is(':visible') && $('#projectId_prj_filter').val()!=undefined)
			|| (!isGlobalSearch && $('#advanceSearchResetIcon').is(':visible') && !$('#searchBox_projects_osp_labor')
					.val()) && !isSapWbs && $('#projectId_prj_filter').val()!=undefined) {
		// $('#searchBox_projects_su').val('');
		data = {
			offset : offset || 1,
			limit : limit || 26,
			searchName : '',
		//	prjPhase : '1,2,3',
			frmSearch : true,
			searchId : null,
			searchFrom : 1,
			isDefault : 0,
			caPrjId : $('#projectId_prj_filter').val().trim(),
			sapWbsCd : $('#sapWbsCode_prj_filter').val().trim(),
			projectName :$('#pjtName_prj_filter').val().trim(),
			lobType : ($('#projectType_prj_filter').val()
					? $('#projectType_prj_filter').val().join(',')
					: null),
			
			 prjPhase : ($('#phase_prj_filter').val() ? $('#phase_prj_filter')
			.val().join(',') : null),
			 projectScopeId : $('#pjtScope_prj_filter').val(),
		     projectScopeText:$('#pjtScope_prj_filter').text(),
		   owner :($('#owner_prj_filter').val()
					? $('#owner_prj_filter').val().join('`')
							: null),
			stateId : $('#state_prj_filter option:selected').val(),
			prjCompany : $('#company_prj_filter option:selected').val(),
			exchangeId : $('#exchange_prj_filter option:selected').val(),
			msegId : $('#marketSeg_prj_filter option:selected').val(),
			
			
			prjCrtdFrm : $('#createdFrom_prj_filter').val(),
			prjCrtdTo : $('#createdTo_prj_filter').val(),
			phaseDysFrm : $('#phaseDysFrm_prj_filter').val(),
			phaseDysTo : $('#phaseDysTo_prj_filter').val(),
			projectExpedite : $('#expedite_prj_filter').val(),
			sortFields:sortFieldValString,/*for multisort*/
		    sortOrders:sortOrderValString,
		    sortFlag:sortFlag
		};
	}
	// $('#page_projects_su').jqPagination({max_page : 0,current_page : 1});
	if (!init) {
		try {
			$('#page_projects_osp_labor').jqPagination('destroy');
			if ($('#page_projects_osp_labor').jqPagination('getParam', 'max_page') != 0) {
				$('#page_projects_osp_labor').jqPagination('option', 'current_page',
						1, true);
			}
			$('#page_projects_osp_labor')[0].status = false;
		} catch (err) {

		}
	}
	if (isGlobalSearch) {
		$('#searchBox_projects_osp_labor').val('');
		data = {
			offset : offset || 1,
			limit : limit || 26,
			searchFrom : 1,
			searchFlag : 2,
			prjPhase : null,
			projectName : $('#txt_global_search_osp_labor').val().trim(),
			sapWbsCd : $('#txt_global_search_osp_labor').val().trim(),
			caPrjId : $('#txt_global_search_osp_labor').val().trim(),
			   projectId:!globalProjectSelectedObj?null:globalProjectSelectedObj.id
		  }
		  if(globalProjectSelectedObj)
			{
				globalProjectSelectedObj=null;
			}
	} else {
		$('#txt_global_search_osp_labor').val('');
	}
	data['curScope'] = setCurrentModuleScope();
	//debugger;
	/*if(!isGlobalSearch&&!$('#projectId_prj_filter').is(':visible'))
	{
		data['inFrom'] =3;
	}*/
	data['inFrom'] =3;
	if((init ||isSapWbs)&& $('#searchBox_projects_osp_labor').val()!="")
	{
		//data['projectScopeId'] =57;
		data['projectScopeId'] =null;
		data['defaultScope'] =true;
	}
	if(($('#searchBox_projects_osp_labor').val()!="")||isGlobalSearch)
	{
	data['searchFlag'] =2;
	}
	if (projectListRequest && typeof projectListRequest.abort == 'function') {
		projectListRequest.abort();
	}
	if(!data['projectScopeId'])
		{data['defaultScope'] =true;
		//Changed scope to null to implement saved search
		data['projectScopeId']=null;
		data['inFrom']=3;
		}
	if(isGlobalSearch)
	{
	data['inFrom']=0;
	data['projectScopeId']=null;
	}
	if(!isGlobalSearch && !$('#projectId_prj_filter').is(':visible'))
	{
		data['inFrom']=/*($('#advanceSearchResetIcon').is(':visible'))?0:*/3;
	}
	
	if(data['projectName']!=null && data['projectName'].trim().length==0&& data['projectName'].length>0)
	{
	data['searchFlag']=0;
	}
	projectListRequest = $.ajax({
				url : 'getOspLaborProjects',
				cache : false,
				data : data,
				async:false,
				success : function(response) {
					
					stakedUnitsProjectListData.length = 0;
					$('#list-frame_su').html(response);
					if (!isGlobalSearch
							&& !$('#txt_global_search_osp_labor').val()
							&& !$('#searchBox_projects_osp_labor').val()) {
						currentFilter = data;
						currentFilter.filterId = '';
					} else {
						currentFilter = null;
					}
					var totalCount = 0, pages = 0;
					if (stakedUnitsProjectListData.length) {
						totalCount = stakedUnitsProjectListData[0].totalCount;
						pages = Math.ceil(totalCount / 25);
					}

					if (!$('#page_projects_osp_labor')[0].status) {
						$('#page_projects_osp_labor').jqPagination({
							link_string : '/?page={page_number}',
							max_page : pages,
							paged : function(page) {
								if (page != 1) {
									page = ((page - 1) * 25) + 1;
								}
								getOspLaborProjects(page, 26, true,
										isGlobalSearch);
							}
						});
						$('#page_projects_osp_labor')[0].status = true;
					}
					if (!isGlobalSearch && !$('#searchOptionsBox').hasClass('hidden')) {
						hideAdVancedSearchGrayBox();
					}
				}
			});
}
function getIspMaterialsProjects(offset, limit, init, isGlobalSearch, isSapWbs) {
	if (!offset && !limit) {
		offset = 1;
		limit = 26;
	}
	if($('#advanceSearchResetIcon').is(':visible') && !isGlobalSearch && !isSapWbs)
	{
		var data=getSavedSearchDetails(offset,limit); 
	}
	else
	{
	var data = {
		offset : offset,
		limit : limit,
		searchFlag :0,//(isSapWbs==true)? 2:0,
		prjPhase : '1,2,3',
		projectName : ($('#searchBox_projects_isp_material')
				? $('#searchBox_projects_isp_material').val()
				: null),
		sapWbsCd : ($('#searchBox_projects_isp_material') ? $('#searchBox_projects_isp_material')
				.val(): null),
		caPrjId : ($('#searchBox_projects_isp_material') ? $('#searchBox_projects_isp_material')
						.val(): null)
	};
	}
	if($('#searchBox_projects_isp_material').val()!="" && 
			$('#advanceSearchResetIcon').is(':visible'))
	{
		resetIspMaterialProjects(1);
	}
	if((isSapWbs ==true)&&$('#searchBox_projects_isp_material').val()=="")
		{
		data['searchFlag'] =0;
		resetIspMaterialProjects(1);
		}
	else if(/*(isSapWbs ==true)&&*/$('#searchBox_projects_isp_material').val()!="")
		{
		data['searchFlag'] =2;
		}
	var sortFieldValString=getMultiSortParameters(MULTISORT_FIELD);	
	var sortOrderValString=getMultiSortParameters(MULTISORT_ORDER);
	var sortFlag=1;
	sortFlag=(getMultiSortParameters(MULTISORT_FLAG)==null)?sortFlag:getMultiSortParameters(MULTISORT_FLAG);
	if (($('#projectId_prj_filter').is(':visible') && $('#projectId_prj_filter').val()!=undefined)
			|| (!isGlobalSearch && $('#advanceSearchResetIcon').is(':visible') && !$('#searchBox_projects_isp_material')
					.val()) && !isSapWbs && $('#projectId_prj_filter').val()!=undefined) {
		// $('#searchBox_projects_su').val('');
		if (currentFilter) {
			var filterName = currentFilter.searchName
					? currentFilter.searchName
							.replace(' (Default)', '')
					: '';
							}
		data = {
			offset : offset || 1,
			limit : limit || 26,
			searchName :isSaveSearchCriteria?filterName:'',
		prjPhase : '1,2,3',
			frmSearch : true,
			searchId : null,
			searchFrom : 1,
			isDefault : 0,
			caPrjId : $('#projectId_prj_filter').val().trim(),
			sapWbsCd : $('#sapWbsCode_prj_filter').val().trim(),
			projectName :$('#pjtName_prj_filter').val().trim(),
			lobType : ($('#projectType_prj_filter').val()
					? $('#projectType_prj_filter').val().join(',')
					: null),
			
			  prjPhase : ($('#phase_prj_filter').val() ? $('#phase_prj_filter')
			  .val().join(',') : null),
			 
			  projectScopeId : $('#pjtScope_prj_filter').val(),
			     projectScopeText:$('#pjtScope_prj_filter').text(),
			   owner :($('#owner_prj_filter').val()
						? $('#owner_prj_filter').val().join('`')
								: null),
				stateId : $('#state_prj_filter option:selected').val(),
				prjCompany : $('#company_prj_filter option:selected').val(),
				exchangeId : $('#exchange_prj_filter option:selected').val(),
				msegId : $('#marketSeg_prj_filter option:selected').val(),
			prjCrtdFrm : $('#createdFrom_prj_filter').val(),
			prjCrtdTo : $('#createdTo_prj_filter').val(),
			phaseDysFrm : $('#phaseDysFrm_prj_filter').val(),
			phaseDysTo : $('#phaseDysTo_prj_filter').val(),
			projectExpedite : $('#expedite_prj_filter').val(),
			sortFields:sortFieldValString,/*for multisort*/
		    sortOrders:sortOrderValString,
		    sortFlag:sortFlag
		};
	}
	// $('#page_projects_su').jqPagination({max_page : 0,current_page : 1});
	if (!init) {
		try {
			$('#page_projects_isp_material').jqPagination('destroy');
			if ($('#page_projects_isp_material').jqPagination('getParam', 'max_page') != 0) {
				$('#page_projects_isp_material').jqPagination('option', 'current_page',
						1, true);
			}
			$('#page_projects_isp_material')[0].status = false;
		} catch (err) {

		}
	}
	if (isGlobalSearch) {
		$('#searchBox_projects_isp_material').val('');
		data = {
			offset : offset || 1,
			limit : limit || 26,
			searchFrom : 1,
			searchFlag : 2,
			prjPhase : null,
			projectName : $('#txt_global_search_isp_material').val().trim(),
			sapWbsCd : $('#txt_global_search_isp_material').val().trim(),
			caPrjId : $('#txt_global_search_isp_material').val().trim(),
			   projectId:!globalProjectSelectedObj?null:globalProjectSelectedObj.id
		  }
		  if(globalProjectSelectedObj)
			{
				globalProjectSelectedObj=null;
			}
	} else {
		$('#txt_global_search_isp_material').val('');
	}
	data['curScope'] = setCurrentModuleScope();
	/*if(!isGlobalSearch&&!$('#projectId_prj_filter').is(':visible'))
	{
		data['inFrom'] =2;
	}*/
	data['inFrom']=2;
	if((init||isSapWbs)&& $('#searchBox_projects_isp_material').val()!="")
	{
		//data['projectScopeId'] =56;
		data['projectScopeId'] =null;
		data['defaultScope'] =true;
	}
	if(($('#searchBox_projects_isp_material').val()!="")||isGlobalSearch)
	{
	data['searchFlag'] =2;
	}
	if(!data['projectScopeId'])
	{data['defaultScope'] =true;
	//Changed scope to null to implement saved search
	data['projectScopeId']=null;
	data['inFrom']=2;
	}
	if(isGlobalSearch)
	{
	data['inFrom']=0;
	data['projectScopeId']=null;
	}
	if (projectListRequest && typeof projectListRequest.abort == 'function') {
		projectListRequest.abort();
	}
	if(!isGlobalSearch && !$('#projectId_prj_filter').is(':visible'))
	{
		data['inFrom']=/*($('#advanceSearchResetIcon').is(':visible'))?0:*/2;
	}
	/* if (data['projectScopeText']=="-- ALL ---")
	  {
	  data['inFrom']=2;
	  }*/
	 if(data['projectName']!=null && data['projectName'].trim().length==0&& data['projectName'].length>0)
		{
		data['searchFlag']=0;
		}
	projectListRequest = $.ajax({
				url : 'getIspMaterialProjects',
				cache : false,
				data : data,
				async:false,
				success : function(response) {
					
					stakedUnitsProjectListData.length = 0;
					$('#list-frame_su').html(response);
					if (!isGlobalSearch
							&& !$('#txt_global_search_isp_material').val()
							&& !$('#searchBox_projects_isp_material').val()) {
						currentFilter = data;
						if(!isSaveSearchCriteria)
						{
						currentFilter.filterId = '';
						}
					} else {
						currentFilter = null;
					}
					var totalCount = 0, pages = 0;
					if (stakedUnitsProjectListData.length) {
						totalCount = stakedUnitsProjectListData[0].totalCount;
						pages = Math.ceil(totalCount / 25);
					}

					if (!$('#page_projects_isp_material')[0].status) {
						$('#page_projects_isp_material').jqPagination({
							link_string : '/?page={page_number}',
							max_page : pages,
							paged : function(page) {
								if (page != 1) {
									page = ((page - 1) * 25) + 1;
								}
								getIspMaterialsProjects(page, 26, true,
										isGlobalSearch);
							}
						});
						$('#page_projects_isp_material')[0].status = true;
					}
					
					if (!isGlobalSearch && !$('#searchOptionsBox').hasClass('hidden')) {
						hideAdVancedSearchGrayBox();
					}
				}
			});
}
function getIspOverheadsProjects(offset, limit, init, isGlobalSearch, isSapWbs) {
	
	if (!offset && !limit) {
		offset = 1;
		limit = 26;
	}
	if($('#advanceSearchResetIcon').is(':visible') && !isGlobalSearch && !isSapWbs)
	{
		var data=getSavedSearchDetails(offset,limit); 
	}
	else
	{
	var data = {
		offset : offset,
		limit : limit,
		searchFlag :0,//(isSapWbs==true)? 2:0,
		prjPhase : '1,2,3',
		projectName : ($('#searchBox_projects_isp_overheads')
				? $('#searchBox_projects_isp_overheads').val()
				: null),
		sapWbsCd : ($('#searchBox_projects_isp_overheads') ?$('#searchBox_projects_isp_overheads')
				.val() : null),
		caPrjId : ($('#searchBox_projects_isp_overheads') ?$('#searchBox_projects_isp_overheads')
						.val() : null)
	};
	}
	if($('#searchBox_projects_isp_overheads').val()!="" && 
			$('#advanceSearchResetIcon').is(':visible'))
	{
		resetIspOverheadsProjects(1);
	}
	if((isSapWbs ==true)&&$('#searchBox_projects_isp_overheads').val()=="")
		{
		data['searchFlag'] =0;
		resetIspOverheadsProjects(1);
		}
	else if(/*(isSapWbs ==true)&&*/$('#searchBox_projects_isp_overheads').val()!="")
		{
		data['searchFlag'] =2;
		}
	var sortFieldValString=getMultiSortParameters(MULTISORT_FIELD);	
	var sortOrderValString=getMultiSortParameters(MULTISORT_ORDER);
	var sortFlag=1;
	sortFlag=(getMultiSortParameters(MULTISORT_FLAG)==null)?sortFlag:getMultiSortParameters(MULTISORT_FLAG);
	if (($('#projectId_prj_filter').is(':visible') && $('#projectId_prj_filter').val()!=undefined)
			|| (!isGlobalSearch && $('#advanceSearchResetIcon').is(':visible') && !$('#searchBox_projects_isp_overheads')
					.val()) && !isSapWbs && $('#projectId_prj_filter').val()!=undefined) {
		// $('#searchBox_projects_su').val('');
		if (currentFilter) {
			var filterName = currentFilter.searchName
					? currentFilter.searchName
							.replace(' (Default)', '')
					: '';
							}
		data = {
			offset : offset || 1,
			limit : limit || 26,
			searchName : isSaveSearchCriteria?filterName:'',
		prjPhase : '1,2,3',
			frmSearch : true,
			searchId : null,
			searchFrom : 1,
			isDefault : 0,
			caPrjId : $('#projectId_prj_filter').val().trim(),
			sapWbsCd : $('#sapWbsCode_prj_filter').val().trim(),
			projectName :$('#pjtName_prj_filter').val().trim(),
			lobType : ($('#projectType_prj_filter').val()
					? $('#projectType_prj_filter').val().join(',')
					: null),
			
			  prjPhase : ($('#phase_prj_filter').val() ? $('#phase_prj_filter')
			  .val().join(',') : null),
			 
			  projectScopeId : $('#pjtScope_prj_filter').val(),
			     projectScopeText:$('#pjtScope_prj_filter').text(),
			   owner :($('#owner_prj_filter').val()
						? $('#owner_prj_filter').val().join('`')
								: null),
				stateId : $('#state_prj_filter option:selected').val(),
				prjCompany : $('#company_prj_filter option:selected').val(),
				exchangeId : $('#exchange_prj_filter option:selected').val(),
				msegId : $('#marketSeg_prj_filter option:selected').val(),
			prjCrtdFrm : $('#createdFrom_prj_filter').val(),
			prjCrtdTo : $('#createdTo_prj_filter').val(),
			phaseDysFrm : $('#phaseDysFrm_prj_filter').val(),
			phaseDysTo : $('#phaseDysTo_prj_filter').val(),
			projectExpedite : $('#expedite_prj_filter').val(),
			sortFields:sortFieldValString,/*for multisort*/
		    sortOrders:sortOrderValString,
		    sortFlag:sortFlag
		};
	}
	// $('#page_projects_su').jqPagination({max_page : 0,current_page : 1});
	if (!init) {
		try {
			$('#page_projects_isp_overheads').jqPagination('destroy');
			if ($('#page_projects_isp_overheads').jqPagination('getParam', 'max_page') != 0) {
				$('#page_projects_isp_overheads').jqPagination('option', 'current_page',
						1, true);
			}
			$('#page_projects_isp_overheads')[0].status = false;
		} catch (err) {

		}
	}
	if (isGlobalSearch) {
		$('#searchBox_projects_isp_overheads').val('');
		data = {
			offset : offset || 1,
			limit : limit || 26,
			searchFrom : 1,
			searchFlag : 2,
			prjPhase : null,
			projectName : $('#txt_global_search_isp_overheads').val().trim(),
			sapWbsCd : $('#txt_global_search_isp_overheads').val().trim(),
			caPrjId : $('#txt_global_search_isp_overheads').val().trim(),
			   projectId:!globalProjectSelectedObj?null:globalProjectSelectedObj.id
		  }
		  if(globalProjectSelectedObj)
			{
				globalProjectSelectedObj=null;
			}
	} else {
		$('#txt_global_search_isp_overheads').val('');
	}
	data['curScope'] = setCurrentModuleScope();
	/*if(!isGlobalSearch&&!$('#projectId_prj_filter').is(':visible'))
	{
		data['inFrom'] =2;
	}*/
	data['inFrom'] =2;
	if((init||isSapWbs)&& $('#searchBox_projects_isp_overheads').val()!="")
	{
		//data['projectScopeId'] =56;
		data['projectScopeId'] =null;
		data['defaultScope'] =true;
	}
	if(($('#searchBox_projects_isp_overheads').val()!="")||isGlobalSearch)
	{
	data['searchFlag'] =2;
	}
	if(!data['projectScopeId'])
	{data['defaultScope'] =true;
	//Changed scope to null to implement saved search
	data['projectScopeId']=null;
	data['inFrom']=2;
	}
	if(isGlobalSearch)
	{
	data['inFrom']=0;
	data['projectScopeId']=null;
	}
	if (projectListRequest && typeof projectListRequest.abort == 'function') {
		projectListRequest.abort();
	}
	if(!isGlobalSearch && !$('#projectId_prj_filter').is(':visible'))
	{
		data['inFrom']=/*($('#advanceSearchResetIcon').is(':visible'))?0:*/2;
	}
	/*if (data['projectScopeText']=="-- ALL ---")
	{
	data['inFrom']=2;
	}*/
	if(data['projectName']!=null && data['projectName'].trim().length==0&& data['projectName'].length>0)
	{
	data['searchFlag']=0;
	}
	projectListRequest = $.ajax({
				url : 'getIspOverHeadsProjects',
				cache : false,
				data : data,
				success : function(response) {
					overHeadsProjectListData.length = 0;
					$('#list-frame_su').html(response);
					if (!isGlobalSearch
							&& !$('#txt_global_search_isp_overheads').val()
							&& !$('#searchBox_projects_isp_overheads').val()) {
						currentFilter = data;
						if(!isSaveSearchCriteria)
						{
						currentFilter.filterId = '';
						}
					} else {
						currentFilter = null;
					}
					var totalCount = 0, pages = 0;
					if (overHeadsProjectListData.length) {
						totalCount = overHeadsProjectListData[0].totalCount;
						pages = Math.ceil(totalCount / 25);
					}

					if (!$('#page_projects_isp_overheads')[0].status) {
						$('#page_projects_isp_overheads').jqPagination({
							link_string : '/?page={page_number}',
							max_page : pages,
							paged : function(page) {
								if (page != 1) {
									page = ((page - 1) * 25) + 1;
								}
								getIspOverheadsProjects(page, 26, true,
										isGlobalSearch);
							}
						});
						$('#page_projects_isp_overheads')[0].status = true;
					}
					if (!isGlobalSearch && !$('#searchOptionsBox').hasClass('hidden')) {
						hideAdVancedSearchGrayBox();
					}
				}
			});
}
function getOspMaterialsProjects(offset, limit, init, isGlobalSearch, isSapWbs) {
	
	if (!offset && !limit) {
		offset = 1;
		limit = 26;
	}
	if($('#advanceSearchResetIcon').is(':visible') && !isGlobalSearch && !isSapWbs)
	{
		var data=getSavedSearchDetails(offset,limit); 
	}
	else
	{
	var data = {
		offset : offset,
		limit : limit,
		searchFlag :0,//(isSapWbs==true)? 2:0,
		prjPhase : '1,2,3',
		projectName : ($('#searchBox_projects_osp_material')
				?$('#searchBox_projects_osp_material').val()
				: null),
		sapWbsCd : ($('#searchBox_projects_osp_material') ? $('#searchBox_projects_osp_material')
				.val() : null),
				caPrjId : ($('#searchBox_projects_osp_material') ? $('#searchBox_projects_osp_material')
						.val() : null)
	};
	}
	if($('#searchBox_projects_osp_material').val()!="" && 
			$('#advanceSearchResetIcon').is(':visible'))
	{
		resetOspMaterialsProjects(1);
	}
	if((isSapWbs ==true)&&$('#searchBox_projects_osp_material').val()=="")
		{
		data['searchFlag'] =0;
		resetOspMaterialsProjects(1);
		}
	else if(/*(isSapWbs ==true)&&*/$('#searchBox_projects_osp_material').val()!="")
		{
		data['searchFlag'] =2;
		}
	 var sortFieldValString=getMultiSortParameters(MULTISORT_FIELD);	
		var sortOrderValString=getMultiSortParameters(MULTISORT_ORDER);
		var sortFlag=1;
		sortFlag=(getMultiSortParameters(MULTISORT_FLAG)==null)?sortFlag:getMultiSortParameters(MULTISORT_FLAG);
	if (($('#projectId_prj_filter').is(':visible') && $('#projectId_prj_filter').val()!=undefined)
			|| (!isGlobalSearch && $('#advanceSearchResetIcon').is(':visible') && !$('#searchBox_projects_osp_material')
					.val()) && !isSapWbs && $('#projectId_prj_filter').val()!=undefined) {
		// $('#searchBox_projects_su').val('');
		data = {
			offset : offset || 1,
			limit : limit || 26,
			searchName : '',
		//	prjPhase : '1,2',
			frmSearch : true,
			searchId : null,
			searchFrom : 1,
			isDefault : 0,
			caPrjId : $('#projectId_prj_filter').val().trim(),
			sapWbsCd : $('#sapWbsCode_prj_filter').val().trim(),
			projectName : $('#pjtName_prj_filter').val().trim(),
			lobType : ($('#projectType_prj_filter').val()
					? $('#projectType_prj_filter').val().join(',')
					: null),
			
			  prjPhase : ($('#phase_prj_filter').val() ? $('#phase_prj_filter')
			 .val().join(',') : null),
			 
			 projectScopeId : $('#pjtScope_prj_filter').val(),
		     projectScopeText:$('#pjtScope_prj_filter').text(),
		   owner :($('#owner_prj_filter').val()
					? $('#owner_prj_filter').val().join('`')
							: null),
			stateId : $('#state_prj_filter option:selected').val(),
			prjCompany : $('#company_prj_filter option:selected').val(),
			exchangeId : $('#exchange_prj_filter option:selected').val(),
			msegId : $('#marketSeg_prj_filter option:selected').val(),
			prjCrtdFrm : $('#createdFrom_prj_filter').val(),
			prjCrtdTo : $('#createdTo_prj_filter').val(),
			phaseDysFrm : $('#phaseDysFrm_prj_filter').val(),
			phaseDysTo : $('#phaseDysTo_prj_filter').val(),
			projectExpedite : $('#expedite_prj_filter').val(),
			sortFields:sortFieldValString,/*for multisort*/
		    sortOrders:sortOrderValString,
		    sortFlag:sortFlag
		};
	}
	// $('#page_projects_su').jqPagination({max_page : 0,current_page : 1});
	if (!init) {
		try {
			$('#page_projects_osp_material').jqPagination('destroy');
			if ($('#page_projects_osp_material').jqPagination('getParam', 'max_page') != 0) {
				$('#page_projects_osp_material').jqPagination('option', 'current_page',
						1, true);
			}
			$('#page_projects_osp_material')[0].status = false;
		} catch (err) {

		}
	}
	if (isGlobalSearch) {
		$('#searchBox_projects_osp_material').val('');
		data = {
			offset : offset || 1,
			limit : limit || 26,
			searchFrom : 1,
			searchFlag : 2,
			prjPhase : null,
			projectName : $('#txt_global_search_osp_material').val().trim(),
			sapWbsCd : $('#txt_global_search_osp_material').val().trim(),
			caPrjId : $('#txt_global_search_osp_material').val().trim(),
			   projectId:!globalProjectSelectedObj?null:globalProjectSelectedObj.id
		  }
		  if(globalProjectSelectedObj)
			{
				globalProjectSelectedObj=null;
			}	
	} else {
		$('#txt_global_search_osp_material').val('');
	}
	data['curScope'] = setCurrentModuleScope();
	/*if(!isGlobalSearch&&!$('#projectId_prj_filter').is(':visible'))
	{
		data['inFrom'] =3;
	}*/
	data['inFrom'] =3;
	if((init||isSapWbs) && $('#searchBox_projects_osp_material').val()!="")
	{
		//data['projectScopeId'] =57;
		data['projectScopeId'] =null;
		data['defaultScope'] =true;
	}
	if(($('#searchBox_projects_osp_material').val()!="")||isGlobalSearch)
	{
	data['searchFlag'] =2;
	}
	if(!data['projectScopeId'])
	{data['defaultScope'] =true;
	//Changed scope to null to implement saved search
	data['projectScopeId']=null;
	data['inFrom']=3;
	}
	if(isGlobalSearch)
	{
	data['inFrom']=0;
	data['projectScopeId']=null;
	}
	if (projectListRequest && typeof projectListRequest.abort == 'function') {
		projectListRequest.abort();
	}
	if(!isGlobalSearch && !$('#projectId_prj_filter').is(':visible'))
	{
		data['inFrom']=/*($('#advanceSearchResetIcon').is(':visible'))?0:*/3;
	}
	/*if (data['projectScopeText']=="-- ALL ---")
	{
	data['inFrom']=3;
	}*/
	if(data['projectName']!=null && data['projectName'].trim().length==0&& data['projectName'].length>0)
	{
	data['searchFlag']=0;
	}
	projectListRequest = $.ajax({
				url : 'getOspMaterialProjects',
				cache : false,
				async:false,
				data : data,
				success : function(response) {
					stakedUnitsProjectListData.length = 0;
					$('#list-frame_su').html(response);
					if (!isGlobalSearch
							&& !$('#txt_global_search_osp_material').val()
							&& !$('#searchBox_projects_osp_material').val()) {
						currentFilter = data;
						currentFilter.filterId = '';
					} else {
						currentFilter = null;
					}
					var totalCount = 0, pages = 0;
					if (stakedUnitsProjectListData.length) {
						totalCount = stakedUnitsProjectListData[0].totalCount;
						pages = Math.ceil(totalCount / 25);
					}

					if (!$('#page_projects_osp_material')[0].status) {
						$('#page_projects_osp_material').jqPagination({
							link_string : '/?page={page_number}',
							max_page : pages,
							paged : function(page) {
								if (page != 1) {
									page = ((page - 1) * 25) + 1;
								}
								getOspMaterialsProjects(page, 26, true,
										isGlobalSearch);
							}
						});
						$('#page_projects_osp_material')[0].status = true;
					}
					if (!isGlobalSearch && !$('#searchOptionsBox').hasClass('hidden')) {
						hideAdVancedSearchGrayBox();
					}
				}
			});
}
function getOspEstimationFootageProjects(offset, limit, init, isGlobalSearch, isSapWbs) {
	
	if (!offset && !limit) {
		offset = 1;
		limit = 26;
	}
	if($('#advanceSearchResetIcon').is(':visible') && !isGlobalSearch && !isSapWbs)
	{
		var data=getSavedSearchDetails(offset,limit); 
	}
	else
	{
	var data = {
		offset : offset,
		limit : limit,
		searchFlag : 0,
		prjPhase : '1,2,3',
		projectName : ($('#searchBox_projects_osp_est')
				? $('#searchBox_projects_osp_est').val()
				: null),
		sapWbsCd : ($('#searchBox_projects_osp_est') ? $('#searchBox_projects_osp_est')
				.val(): null),
				caPrjId : ($('#searchBox_projects_osp_est') ? $('#searchBox_projects_osp_est')
						.val(): null)
	};
	}
	if($('#searchBox_projects_osp_est').val()!="" && 
			$('#advanceSearchResetIcon').is(':visible'))
	{
		resetOspEstimationFootageProjects(1);
	}
	if((isSapWbs ==true)&&$('#searchBox_projects_osp_est').val()=="")
		{
		data['searchFlag'] =0;
		resetOspEstimationFootageProjects(1);
		}
	else if(/*(isSapWbs ==true)&&*/$('#searchBox_projects_osp_est').val()!="")
		{
		data['searchFlag'] =2;
		}
	var sortFieldValString=getMultiSortParameters(MULTISORT_FIELD);	
	var sortOrderValString=getMultiSortParameters(MULTISORT_ORDER);
	var sortFlag=1;
	sortFlag=(getMultiSortParameters(MULTISORT_FLAG)==null)?sortFlag:getMultiSortParameters(MULTISORT_FLAG);
	if (($('#projectId_prj_filter').is(':visible') && $('#projectId_prj_filter').val()!=undefined)
			|| (!isGlobalSearch && $('#advanceSearchResetIcon').is(':visible') && !$('#searchBox_projects_osp_est')
					.val()) && !isSapWbs && $('#projectId_prj_filter').val()!=undefined) {
		// $('#searchBox_projects_su').val('');

		if (currentFilter) {
			var filterName = currentFilter.searchName
					? currentFilter.searchName
							.replace(' (Default)', '')
					: '';
							}
		data = {
			offset : offset || 1,
			limit : limit || 26,
			searchName : isSaveSearchCriteria?filterName:'',
		//	prjPhase : '1,2',
			frmSearch : true,
			searchId : null,
			searchFrom : 1,
			isDefault : 0,
			caPrjId :$('#projectId_prj_filter').val().trim(),
			sapWbsCd :$('#sapWbsCode_prj_filter').val().trim(),
			projectName :$('#pjtName_prj_filter').val().trim(),
			lobType : ($('#projectType_prj_filter').val()
					? $('#projectType_prj_filter').val().join(',')
					: null),
			
			  prjPhase : ($('#phase_prj_filter').val() ? $('#phase_prj_filter')
			 .val().join(',') : null),
			
			 projectScopeId : $('#pjtScope_prj_filter').val(),
		     projectScopeText:$('#pjtScope_prj_filter').text(),
		   owner :($('#owner_prj_filter').val()
					? $('#owner_prj_filter').val().join('`')
							: null),
			stateId : $('#state_prj_filter option:selected').val(),
			prjCompany : $('#company_prj_filter option:selected').val(),
			exchangeId : $('#exchange_prj_filter option:selected').val(),
			msegId : $('#marketSeg_prj_filter option:selected').val(),
			prjCrtdFrm : $('#createdFrom_prj_filter').val(),
			prjCrtdTo : $('#createdTo_prj_filter').val(),
			phaseDysFrm : $('#phaseDysFrm_prj_filter').val(),
			phaseDysTo : $('#phaseDysTo_prj_filter').val(),
			projectExpedite : $('#expedite_prj_filter').val(),
			sortFields:sortFieldValString,/*for multisort*/
		    sortOrders:sortOrderValString,
		    sortFlag:sortFlag
		};
	}
	// $('#page_projects_su').jqPagination({max_page : 0,current_page : 1});
	if (!init) {
		try {
			$('#page_projects_osp_est').jqPagination('destroy');
			if ($('#page_projects_osp_est').jqPagination('getParam', 'max_page') != 0) {
				$('#page_projects_osp_est').jqPagination('option', 'current_page',
						1, true);
			}
			$('#page_projects_osp_est')[0].status = false;
		} catch (err) {

		}
	}
	if (isGlobalSearch) {
		$('#searchBox_projects_osp_est').val('');
		data = {
			offset : offset || 1,
			limit : limit || 26,
			searchFrom : 1,
			searchFlag : 2,
			prjPhase : null,
			projectName : $('#txt_global_search_osp_est').val().trim(),
			sapWbsCd : $('#txt_global_search_osp_est').val().trim(),
			caPrjId : $('#txt_global_search_osp_est').val().trim(),
			   projectId:!globalProjectSelectedObj?null:globalProjectSelectedObj.id
		  }
		  if(globalProjectSelectedObj)
			{
				globalProjectSelectedObj=null;
			}
	} else {
		$('#txt_global_search_osp_est').val('');
	}
	data['curScope'] = setCurrentModuleScope();
	/*if(!isGlobalSearch&&!$('#projectId_prj_filter').is(':visible'))
	{
		data['inFrom'] =3;
	}*/
	data['inFrom'] =3;
	if((init||isSapWbs) && $('#searchBox_projects_osp_est').val()!="")
	{
		//data['projectScopeId'] =57;
		data['projectScopeId'] =null;
		data['defaultScope'] =true;
	}
	if(($('#searchBox_projects_osp_est').val()!="")||isGlobalSearch)
	{
	data['searchFlag'] =2;
	}
	if(!data['projectScopeId'])
	{data['defaultScope'] =true;
	//Changed scope to null to implement saved search
	data['projectScopeId']=null;
	data['inFrom']=3;
	}
	if(isGlobalSearch)
	{
	data['inFrom']=0;
	data['projectScopeId']=null;
	}
	if (projectListRequest && typeof projectListRequest.abort == 'function') {
		projectListRequest.abort();
	}
	if(!isGlobalSearch && !$('#projectId_prj_filter').is(':visible'))
	{
		data['inFrom']=/*($('#advanceSearchResetIcon').is(':visible'))?0:*/3;
	}
	/*if (data['projectScopeText']=="-- ALL ---")
	{
	data['inFrom']=3;
	}*/
	if(data['projectName']!=null && data['projectName'].trim().length==0&& data['projectName'].length>0)
	{
	data['searchFlag']=0;
	}
	projectListRequest = $.ajax({
				url : 'getOspEstFootageProjects',
				cache : false,
				async:false,
				data : data,
				success : function(response) {
					estimationFootageProjectListData.length = 0;
					$('#list-frame_su').html(response);
					if (!isGlobalSearch
							&& !$('#txt_global_search_osp_est').val()
							&& !$('#searchBox_projects_osp_est').val()) {
						currentFilter = data;
						if(!isSaveSearchCriteria)
						{
						currentFilter.filterId = '';
						}
					} else {
						currentFilter = null;
					}
					var totalCount = 0, pages = 0;
					if (estimationFootageProjectListData.length) {
						totalCount = estimationFootageProjectListData[0].totalCount;
						pages = Math.ceil(totalCount / 25);
					}

					if (!$('#page_projects_osp_est')[0].status) {
						$('#page_projects_osp_est').jqPagination({
							link_string : '/?page={page_number}',
							max_page : pages,
							paged : function(page) {
								if (page != 1) {
									page = ((page - 1) * 25) + 1;
								}
								getOspEstimationFootageProjects(page, 26, true,
										isGlobalSearch);
							}
						});
						$('#page_projects_osp_est')[0].status = true;
					}
					if (!isGlobalSearch && !$('#searchOptionsBox').hasClass('hidden')) {
						hideAdVancedSearchGrayBox();
					}
				}
			});
}
function getAlaCarteProjects(offset, limit, init, isGlobalSearch, isSapWbs) {
	
	if (!offset && !limit) {
		offset = 1;
		limit = 26;
	}
	if($('#advanceSearchResetIcon').is(':visible') && !isGlobalSearch && !isSapWbs)
	{
		var data=getSavedSearchDetails(offset,limit); 
	}
	else
	{
	var data = {
		offset : offset,
		limit : limit,
	//	searchFlag : 2,
		prjPhase : '1,2,3',
		projectName : ($('#searchBox_projects_ala_carte')
				? $('#searchBox_projects_ala_carte').val()
				: null),
		sapWbsCd : ($('#searchBox_projects_ala_carte') ?$('#searchBox_projects_ala_carte')
				.val(): null),
				caPrjId : ($('#searchBox_projects_ala_carte') ?$('#searchBox_projects_ala_carte')
						.val(): null)
	};
	}
	if($('#searchBox_projects_ala_carte').val()!="" && 
			$('#advanceSearchResetIcon').is(':visible'))
	{
		resetAlaCarteProjects(1);
	}
	if((isSapWbs ==true)&&$('#searchBox_projects_ala_carte').val()=="")
		{
		data['searchFlag'] =0;
		resetAlaCarteProjects(1);
		}
	else if(/*(isSapWbs ==true)&&*/$('#searchBox_projects_ala_carte').val()!="")
	{
	data['searchFlag'] =2;
	//resetAlaCarteProjects(1);
	}
	var sortFieldValString=getMultiSortParameters(MULTISORT_FIELD);	
	var sortOrderValString=getMultiSortParameters(MULTISORT_ORDER);
	var sortFlag=1;
	sortFlag=(getMultiSortParameters(MULTISORT_FLAG)==null)?sortFlag:getMultiSortParameters(MULTISORT_FLAG);
	if (($('#projectId_prj_filter').is(':visible') && $('#projectId_prj_filter').val()!=undefined)
			|| (!isGlobalSearch && $('#advanceSearchResetIcon').is(':visible') && !$('#searchBox_projects_ala_carte')
					.val()) && !isSapWbs && $('#projectId_prj_filter').val()!=undefined) {
		// $('#searchBox_projects_su').val('');
		if (currentFilter) {
			var filterName = currentFilter.searchName
					? currentFilter.searchName
							.replace(' (Default)', '')
					: '';
							}
		data = {
			offset : offset || 1,
			limit : limit || 26,
			searchName : isSaveSearchCriteria?filterName:'',
		//	prjPhase : '1,2',
			frmSearch : true,
			searchId : null,
			searchFrom : 1,
			isDefault : 0,
			caPrjId : $('#projectId_prj_filter').val().trim(),
			sapWbsCd : $('#sapWbsCode_prj_filter').val().trim(),
			projectName : $('#pjtName_prj_filter').val().trim(),
			lobType : ($('#projectType_prj_filter').val()
					? $('#projectType_prj_filter').val().join(',')
					: null),
			
			  prjPhase : ($('#phase_prj_filter').val() ? $('#phase_prj_filter')
			  .val().join(',') : null),
			
			  projectScopeId : $('#pjtScope_prj_filter').val(),
			   owner :($('#owner_prj_filter').val()
						? $('#owner_prj_filter').val().join('`')
								: null),
				stateId : $('#state_prj_filter option:selected').val(),
				prjCompany : $('#company_prj_filter option:selected').val(),
				exchangeId : $('#exchange_prj_filter option:selected').val(),
				msegId : $('#marketSeg_prj_filter option:selected').val(),
			prjCrtdFrm : $('#createdFrom_prj_filter').val(),
			prjCrtdTo : $('#createdTo_prj_filter').val(),
			phaseDysFrm : $('#phaseDysFrm_prj_filter').val(),
			phaseDysTo : $('#phaseDysTo_prj_filter').val(),
			projectExpedite : $('#expedite_prj_filter').val(),
			sortFields:sortFieldValString,/*for multisort*/
		    sortOrders:sortOrderValString,
		    sortFlag:sortFlag
		};
	}
	// $('#page_projects_su').jqPagination({max_page : 0,current_page : 1});
	if (!init) {
		try {
			$('#page_projects_ala_carte').jqPagination('destroy');
			if ($('#page_projects_ala_carte').jqPagination('getParam', 'max_page') != 0) {
				$('#page_projects_ala_carte').jqPagination('option', 'current_page',
						1, true);
			}
			$('#page_projects_ala_carte')[0].status = false;
		} catch (err) {

		}
	}
	if (isGlobalSearch) {
		$('#searchBox_projects_ala_carte').val('');
		data = {
			offset : offset || 1,
			limit : limit || 26,
			searchFrom : 1,
			searchFlag : 2,
			prjPhase : null,
			projectName : $('#txt_global_search_ala_carte').val().trim(),
			caPrjId : $('#txt_global_search_ala_carte').val().trim(),
			sapWbsCd : $('#txt_global_search_ala_carte').val().trim()
		}
	} else {
		$('#txt_global_search_ala_carte').val('');
	}
	data['curScope'] = setCurrentModuleScope();
	//data['inFrom'] =2;
	//data['projectScopeId'] =57;
	if (projectListRequest && typeof projectListRequest.abort == 'function') {
		projectListRequest.abort();
	}
	projectListRequest = $.ajax({
				url : 'getAlaCarteProjects',
				cache : false,
				async:false,
				data : data,
				success : function(response) {
					stakedUnitsProjectListData.length = 0;
					$('#list-frame_su').html(response);
					if (!isGlobalSearch
							&& !$('#txt_global_search_ala_carte').val()
							&& !$('#searchBox_projects_ala_carte').val()) {
						currentFilter = data;
						if(!isSaveSearchCriteria)
						{
						currentFilter.filterId = '';
						}
					} else {
						currentFilter = null;
					}
					var totalCount = 0, pages = 0;
					if (stakedUnitsProjectListData.length) {
						totalCount = stakedUnitsProjectListData[0].totalCount;
						pages = Math.ceil(totalCount / 25);
					}
		if (!$('#page_projects_ala_carte')[0].status) {
						$('#page_projects_ala_carte').jqPagination({
							link_string : '/?page={page_number}',
							max_page : pages,
							paged : function(page) {
								if (page != 1) {
									page = ((page - 1) * 25) + 1;
								}
								getAlaCarteProjects(page, 26, true,
										isGlobalSearch);
							}
						});
						$('#page_projects_ala_carte')[0].status = true;
					}
		if (!isGlobalSearch && !$('#searchOptionsBox').hasClass('hidden')) {
			hideAdVancedSearchGrayBox();
		}
				}
			});
}

function projectReportGrid(offset, limit, init) {
	currentProjectId = null;
	currentPrjectId = null;
	if (arguments.length <= 0) {
		offset = 1;
		limit = 26;
		init = true;
	}
	$('#searchOptionsBox').empty();
	
	$.ajax({
				url : 'projectReportGrid',
				cache : false,
				data : {
					offset : offset,
					limit : limit,
					curScope : currentModuleScope
				},
				success : function(response) {
					$('#ifrMain').html(response);
						currentFilter = null;
					projectsSearchMode = 'prL';
					loadProjectFilterEst();
					for (var index = 0; index < projectFilters.length; index++) {
						if (projectFilters[index].isDefault == 1) {
							assignMultiSortParameters(index);
							currentFilter = projectFilters[index];
							currentFilter.filterId = index;
							// $('#advanceSearchIcon').addClass('active');
							$('#advanceSearchResetIcon').removeClass('hidden');
							break;
						}
					}
					loadProjectReport(1, 26);
					if (init) {
						if (dashBoardProjectListData[0]) {
							var totalCount = dashBoardProjectListData[0].totalCount;
							var pages = Math.ceil(totalCount / 25);
							$('#page_projects_projects_rpt').jqPagination({
										link_string : '/?page={page_number}',
										max_page : pages,
										totalCount : totalCount,
										paged : function(page) {
											if (page != 1) {
												page = ((page - 1) * 25) + 1;
											}
											loadProjectReport(page, 26);
										}
									});
						}
						//loadProjectFilterMaster(true);
					}
				}
			});
}


function loadProjectReport(offset, limit, order, isGlobalSearch,init) {
	//alert("loadProjectReport"+order);
/*	if (!order) {
		var sortColumnName = $("#projects_grid_rpt").jqGrid('getGridParam',
				'sortname');
		var sortOrder = $("#projects_grid_rpt").jqGrid('getGridParam', 'sortorder');
		if (sortColumnName && sortOrder) {
			order = sortColumnName + ' ' + sortOrder;
		}
	}*/
	//TODO multisort in db 
	if (!order && (currentFilter)?!currentFilter['prjSortBy']:!currentFilter) {
		var sortColumnName = $("#projects_grid_rpt").jqGrid('getGridParam',
				'sortname');
		var sortOrder = $("#projects_grid_rpt").jqGrid('getGridParam', 'sortorder');
		if (sortColumnName && sortOrder) {
			order = sortColumnName + ' ' + sortOrder;
		}
	}
	else if(!order && (currentFilter)?currentFilter['prjSortBy']:!currentFilter)
	{
	order=null;
	}
	
	if(currentFilter)
	{
	if(currentFilter['prjSortBy'])
		{
		currentFilter['sortFlag'] = 1;
		}
	}
 
var data = currentFilter;
	
if (!offset && !limit) {
	offset = 1;
	limit = 26;
}
if($('#advanceSearchResetIcon').is(':visible') && !isGlobalSearch)
{
	var data=getSavedSearchDetails(offset,limit); 
}
else
{
var data = {
	offset : offset,
	limit : limit,
	order:(order || null)
	//searchFlag : 2,
	//prjPhase : '1,2',
	/*projectName : ($('#searchBox_projects_ala_carte')
			? $('#searchBox_projects_ala_carte').val()
			: null),
	sapWbsCd : ($('#searchBox_projects_ala_carte') ? $('#searchBox_projects_ala_carte')
			.val() : null)
*/};
}
var sortFieldValString=getMultiSortParameters(MULTISORT_FIELD);	
var sortOrderValString=getMultiSortParameters(MULTISORT_ORDER);
var sortFlag=1;
sortFlag=(getMultiSortParameters(MULTISORT_FLAG)==null)?sortFlag:getMultiSortParameters(MULTISORT_FLAG);
if (($('#projectId_prj_filter').is(':visible') && $('#projectId_prj_filter').val()!=undefined)
		|| (!isGlobalSearch && $('#advanceSearchResetIcon').is(':visible') && $('#projectId_prj_filter').val()!=undefined)) {
	// $('#searchBox_projects_su').val('');

	if (currentFilter) {
		var filterName = currentFilter.searchName
				? currentFilter.searchName
						.replace(' (Default)', '')
				: '';
						}
	data = {
		offset : offset || 1,
		limit : limit || 26,
		order:(order || null),
		searchName : isSaveSearchCriteria?filterName:'',
	//	prjPhase : '1,2',
		frmSearch : true,
		searchId : null,
		searchFrom : 1,
		isDefault : 0,
		caPrjId :$('#projectId_prj_filter').val().trim(),
		sapWbsCd : $('#sapWbsCode_prj_filter').val().trim(),
		projectName :$('#pjtName_prj_filter').val().trim(),
		lobType : ($('#projectType_prj_filter').val()
				? $('#projectType_prj_filter').val().join(',')
				: null),
		
		  prjPhase : ($('#phase_prj_filter').val() ? $('#phase_prj_filter').val().join(',') : null),
		 
		  projectScopeId : $('#pjtScope_prj_filter option:selected').val(),
		   owner : ($('#owner_prj_filter').val()
					? $('#owner_prj_filter').val().join('`')
					: null),
			stateId : $('#state_prj_filter option:selected').val(),
			prjCompany : $('#company_prj_filter option:selected').val(),
			exchangeId : $('#exchange_prj_filter option:selected').val(),
			msegId : $('#marketSeg_prj_filter option:selected').val(),
		prjCrtdFrm : $('#createdFrom_prj_filter').val(),
		prjCrtdTo : $('#createdTo_prj_filter').val(),
		phaseDysFrm : $('#phaseDysFrm_prj_filter').val(),
		phaseDysTo : $('#phaseDysTo_prj_filter').val(),
		projectExpedite : $('#expedite_prj_filter').val(),
		sortFields:sortFieldValString,/*for multisort*/
	    sortOrders:sortOrderValString,
	    sortFlag:sortFlag
	};
}
// $('#page_projects_su').jqPagination({max_page : 0,current_page : 1});
if (!init) {
	try {
		$('#page_projects_projects_rpt').jqPagination('destroy');
		if ($('#page_projects_projects_rpt').jqPagination('getParam', 'max_page') != 0) {
			$('#page_projects_projects_rpt').jqPagination('option', 'current_page',
					1, true);
		}
		$('#page_projects_projects_rpt')[0].status = false;
	} catch (err) {

	}
}
if (isGlobalSearch) {

	data = {
		offset : offset || 1,
		limit : limit || 26,
		order:(order || null),
		searchFrom : 1,
		searchFlag : 2,
		prjPhase : null,
		projectName : $('#txt_global_search_projects').val().trim(),
		sapWbsCd : $('#txt_global_search_projects').val().trim(),
		projectId:!globalProjectSelectedObj?null:globalProjectSelectedObj.id
	  }
	  if(globalProjectSelectedObj)
		{
			globalProjectSelectedObj=null;
		}
} else {
	$('#txt_global_search_projects').val('');
}
data['curScope'] = setCurrentModuleScope();
//data['inFrom'] =2;
//data['projectScopeId'] =57;
if (projectListRequest && typeof projectListRequest.abort == 'function') {
	projectListRequest.abort();
}
if(!isGlobalSearch)
{
	currentFilter = data;
	currentProjectRepFilter = data;
}
//alert("1");
	projectListRequest = $.ajax({
		url : 'filterProjectSearch',
		cache : false,
		async:false,
		data : data,
		success : function(response) {
			$("#projects_grid_rpt").jqGrid('clearGridData');
			dashBoardProjectListData.length = 0;
			for (var index = 0; index < response.projectDetails.length; index++) {
				$("#projects_grid_rpt").jqGrid('addRowData', index + 1,
						response.projectDetails[index]);
				dashBoardProjectListData.push(response.projectDetails[index]);
			}
			var pages = 0, totalCount = 0;
			if (response.projectDetails[0]) {
				totalCount = response.projectDetails[0].totalCount;
				pages = Math.ceil(totalCount / 25);
			}

			/*if ($('#page_projects_projects_rpt')[0].status) {
				try {
					$('#page_projects_projects_rpt').jqPagination('destroy');
				} catch (err) {
					if (console) {
						console.erroe(err);
					}
				}*/
				// $('#page_projects_projects').jqPagination('option','current_page',
				// 1);
		//	}
			$('#page_projects_projects_rpt').jqPagination({
						link_string : '/?page={page_number}',
						max_page : pages,
						totalCount : totalCount,
						paged : function(page) {
							if (page != 1) {
								page = ((page - 1) * 25) + 1;
							}
							loadProjectReport(page, 26, null, isGlobalSearch,true);
						}
					});
			$('#page_projects_projects_rpt')[0].status = true;
			// $('#page_projects_projects').jqPagination('option','current_page',
			// 1);
			// }
			if (!isGlobalSearch && !$('#searchOptionsBox').hasClass('hidden')) {
				hideAdVancedSearchGrayBox();
			}
		}
	});

}
function selectExchange(type, reset) {
var compId ;
	if(reset)
		{
		compId = type;
		}
	else
		{
	 compId = type.id;
		}
	var compVal = $("#"+compId).val();
	/*if(!compVal)
		{
		compVal=type;
		} */
	var exchId = $("#"+compId).parent().next().children().eq(1).attr("id");
	$("#"+exchId).empty();
	if(compVal == "")
		{
		
		$('#'+exchId).append('<option value="">'+"-- ALL ---"+'</option>');
		
		}
	else
		{

	$.ajax({
				url : 'pjtSearchGetExchange',
				cache : false,
				async : false,
				data : {consCompId:compVal},
				success : function(response) {
					projectExchangeList.length =0;
					$("#"+exchId).empty();
					for (var index = 0; index < response.length; index++) {
						projectExchangeList.push(response[index]);
						$("#"+exchId)
						.append('<option selected value='
								+ response[index].projectExchangeId + '>'
								+ response[index].projectExchangeName
								+ '</option>');
						
					}
						
			     
					
				}
			});
		}
}

function getIspEstimationMaterialProjects(offset, limit, init, isGlobalSearch, isSapWbs) {
	if (!offset && !limit) {
		offset = 1;
		limit = 26;
	}
	if($('#advanceSearchResetIcon').is(':visible') && !isGlobalSearch && !isSapWbs)
	{
		var data=getSavedSearchDetails(offset,limit); 
	}
	else
	{
	var data = {
		offset : offset,
		limit : limit,
		searchFlag : 2,
		prjPhase : '1,2,3',
		projectName : ($('#searchBox_projects_isp_estMat')
				?$('#searchBox_projects_isp_estMat').val()
				: null),
		sapWbsCd : ($('#searchBox_projects_isp_estMat') ? $('#searchBox_projects_isp_estMat')
				.val() : null)
	};
	}
	if($('#searchBox_projects_isp_estMat').val()!="" && 
			$('#advanceSearchResetIcon').is(':visible'))
	{
		resetIspEstimationProjects(1);
	}
	if((isSapWbs ==true)&&$('#searchBox_projects_isp_estMat').val()=="")
		{
		data['searchFlag'] =0;
		resetIspEstimationProjects(1);
		}
	var sortFieldValString=getMultiSortParameters(MULTISORT_FIELD);	
	var sortOrderValString=getMultiSortParameters(MULTISORT_ORDER);
	var sortFlag=1;
	sortFlag=(getMultiSortParameters(MULTISORT_FLAG)==null)?sortFlag:getMultiSortParameters(MULTISORT_FLAG);
	if (($('#projectId_prj_filter').is(':visible') && $('#projectId_prj_filter').val()!=undefined)
			|| (!isGlobalSearch && $('#advanceSearchResetIcon').is(':visible') && !$('#searchBox_projects_su')
					.val()) && !isSapWbs && $('#projectId_prj_filter').val()!=undefined) {
		// $('#searchBox_projects_su').val('');
		if (currentFilter) {
			var filterName = currentFilter.searchName
					? currentFilter.searchName
							.replace(' (Default)', '')
					: '';
							}
		data = {
			offset : offset || 1,
			limit : limit || 26,
			searchName : isSaveSearchCriteria?filterName:'',
			prjPhase : '1,2,3',
			frmSearch : true,
			searchId : null,
			searchFrom : 1,
			isDefault : 0,
			caPrjId : $('#projectId_prj_filter').val().trim(),
			sapWbsCd : $('#sapWbsCode_prj_filter').val().trim(),
			projectName : $('#pjtName_prj_filter').val().trim(),
			lobType : ($('#projectType_prj_filter').val()
					? $('#projectType_prj_filter').val().join(',')
					: null),
			/*
			 * prjPhase : ($('#phase_prj_filter').val() ? $('#phase_prj_filter')
			 * .val().join(',') : null),
			 */
					 projectScopeId : $('#pjtScope_prj_filter option:selected').val(),
					   owner : ($('#owner_prj_filter').val()
								? $('#owner_prj_filter').val().join('`')
										: null),
						stateId : $('#state_prj_filter option:selected').val(),
						prjCompany : $('#company_prj_filter option:selected').val(),
						exchangeId : $('#exchange_prj_filter option:selected').val(),
						msegId : $('#marketSeg_prj_filter option:selected').val(),
			prjCrtdFrm : $('#createdFrom_prj_filter').val(),
			prjCrtdTo : $('#createdTo_prj_filter').val(),
			phaseDysFrm : $('#phaseDysFrm_prj_filter').val(),
			phaseDysTo : $('#phaseDysTo_prj_filter').val(),
			projectExpedite : $('#expedite_prj_filter').val(),
			sortFields:sortFieldValString,/*for multisort*/
		    sortOrders:sortOrderValString,
		    sortFlag:sortFlag
		};
	}
	// $('#page_projects_su').jqPagination({max_page : 0,current_page : 1});
	if (!init) {
		try {
			$('#page_projects_isp_estMat').jqPagination('destroy');
			if ($('#page_projects_isp_estMat').jqPagination('getParam', 'max_page') != 0) {
				$('#page_projects_isp_estMat').jqPagination('option', 'current_page',
						1, true);
			}
			$('#page_projects_isp_estMat')[0].status = false;
		} catch (err) {

		}
	}
	if (isGlobalSearch) {
		$('#searchBox_projects_isp_estMat').val('');
		data = {
			offset : offset || 1,
			limit : limit || 26,
			searchFrom : 1,
			searchFlag : 2,
			prjPhase : null,
			projectName : $('#txt_global_search_isp_est').val().trim(),
			sapWbsCd : $('#txt_global_search_isp_est').val().trim()
		}
	} else {
		$('#txt_global_search_isp_est').val('');
	}
	data['curScope'] = setCurrentModuleScope();
	if (projectListRequest && typeof projectListRequest.abort == 'function') {
		projectListRequest.abort();
	}
	
	projectListRequest = $.ajax({
				url : 'getIspEstMaterialProjects',
				cache : false,
				data : estimationProjectId > 0 ? {
					projectId : estimationProjectId,
					searchFlag : 1,
					curScope : setCurrentModuleScope()
				} : data,
				success : function(response) {
					stakedUnitsProjectListData.length = 0;
					$('#list-frame_su').html(response);
					if (!isGlobalSearch
							&& !$('#txt_global_search_isp_est').val()
							&& !$('#searchBox_projects_isp_estMat').val()) {
						currentFilter = data;
						if(!isSaveSearchCriteria)
						{
						currentFilter.filterId = '';
						}
					} else {
						currentFilter = null;
					}
					var totalCount = 0, pages = 0;
					if (stakedUnitsProjectListData.length) {
						totalCount = stakedUnitsProjectListData[0].totalCount;
						pages = Math.ceil(totalCount / 25);
					}

					if (!$('#page_projects_isp_estMat')[0].status) {
						$('#page_projects_isp_estMat').jqPagination({
							link_string : '/?page={page_number}',
							max_page : pages,
							paged : function(page) {
								if (page != 1) {
									page = ((page - 1) * 25) + 1;
								}
								getIspEstimationMaterialProjects(page, 26, true,
										isGlobalSearch);
							}
						});
						$('#page_projects_isp_estMat')[0].status = true;
					}
				}
			});
	estimationProjectId=0;
}
function getIpEngineeringProjects(offset, limit, init, isGlobalSearch, isSapWbs) {
	/*if(!isSapWbs || (isSapWbs && $('#searchBox_projects_ip_eng').val().trim()!="" ))
	{*/
	if (!offset && !limit) {
		offset = 1;
		limit = 26;
	}
	if($('#advanceSearchResetIcon').is(':visible') && !isGlobalSearch && !isSapWbs)
	{
		var data=getSavedSearchDetails(offset,limit); 
	}
	else
	{
	var data = {
		offset : offset,
		limit : limit,
		//searchFlag : 2,
		//prjPhase : (isSapWbs==true)?'2,3':'2',
		prjPhase :  (isSapWbs==true)?'1,2,3,4,7,98,99':'1,2',
		projectName : ($('#searchBox_projects_ip_eng')
				?$('#searchBox_projects_ip_eng').val()
				: null),
		sapWbsCd : ($('#searchBox_projects_ip_eng') ? $('#searchBox_projects_ip_eng')
				.val(): null),
		caPrjId : ($('#searchBox_projects_ip_eng') ? $('#searchBox_projects_ip_eng')
						.val(): null)
	};
	}
	if($('#searchBox_projects_ip_eng').val()!="" && 
			$('#advanceSearchResetIcon').is(':visible'))
	{
		resetIpEngineeringProjects(1);
	}
	if((isSapWbs ==true)&&$('#searchBox_projects_ip_eng').val()=="")
		{
		data['searchFlag'] =0;
		resetIpEngineeringProjects(1);
		}
	else if(/*(isSapWbs ==true)&&*/$('#searchBox_projects_ip_eng').val()!="")
		{
		data['searchFlag'] =2;
		}
	var sortFieldValString=getMultiSortParameters(MULTISORT_FIELD);	
	var sortOrderValString=getMultiSortParameters(MULTISORT_ORDER);
	var sortFlag=1;
	sortFlag=(getMultiSortParameters(MULTISORT_FLAG)==null)?sortFlag:getMultiSortParameters(MULTISORT_FLAG);
	if (($('#projectId_prj_filter').is(':visible') && $('#projectId_prj_filter').val()!=undefined)
			|| (!isGlobalSearch && $('#advanceSearchResetIcon').is(':visible') && !$('#searchBox_projects_su')
					.val()) && !isSapWbs && $('#projectId_prj_filter').val()!=undefined) {
		// $('#searchBox_projects_su').val('');
		if (currentFilter) {
			var filterName = currentFilter.searchName
					? currentFilter.searchName
							.replace(' (Default)', '')
					: '';
							}
		data = {
			offset : offset || 1,
			limit : limit || 26,
			searchName :isSaveSearchCriteria?filterName:'',
			prjPhase : ($('#phase_prj_filter').val()
					? $('#phase_prj_filter').val().join(',')
							: '1,2'),//changed 2 to 2,3 for jira 875
			frmSearch : true,
			searchId : null,
			searchFrom : 1,
			isDefault : 0,
			caPrjId : $('#projectId_prj_filter').val().trim(),
			sapWbsCd : $('#sapWbsCode_prj_filter').val().trim(),
			projectName :$('#pjtName_prj_filter').val().trim(),
			lobType : ($('#projectType_prj_filter').val()
					? $('#projectType_prj_filter').val().join(',')
					: null),
			/*
			 * prjPhase : ($('#phase_prj_filter').val() ? $('#phase_prj_filter')
			 * .val().join(',') : null),
			 */
					 projectScopeId : $('#pjtScope_prj_filter option:selected').val(),
					   owner :  ($('#owner_prj_filter').val()
								? $('#owner_prj_filter').val().join('`')
										: null),
						stateId : $('#state_prj_filter option:selected').val(),
						prjCompany : $('#company_prj_filter option:selected').val(),
						exchangeId : $('#exchange_prj_filter option:selected').val(),
						msegId : $('#marketSeg_prj_filter option:selected').val(),
			prjCrtdFrm : $('#createdFrom_prj_filter').val(),
			prjCrtdTo : $('#createdTo_prj_filter').val(),
			phaseDysFrm : $('#phaseDysFrm_prj_filter').val(),
			phaseDysTo : $('#phaseDysTo_prj_filter').val(),
			projectExpedite : $('#expedite_prj_filter').val(),
			sortFields:sortFieldValString,/*for multisort*/
		    sortOrders:sortOrderValString,
		    sortFlag:sortFlag
		};
	}
	// $('#page_projects_su').jqPagination({max_page : 0,current_page : 1});
	if (!init) {
		try {
			$('#page_projects_ip_engineering').jqPagination('destroy');
			if ($('#page_projects_ip_engineering').jqPagination('getParam', 'max_page') != 0) {
				$('#page_projects_ip_engineering').jqPagination('option', 'current_page',
						1, true);
			}
			$('#page_projects_ip_engineering')[0].status = false;
		} catch (err) {

		}
	}
	if (isGlobalSearch) {
		$('#searchBox_projects_ip_eng').val('');
		data = {
			offset : offset || 1,
			limit : limit || 26,
			searchFrom : 1,
			searchFlag : 2,
			prjPhase : null,
			projectName : $('#txt_global_search_ip_eng').val().trim(),
			sapWbsCd : $('#txt_global_search_ip_eng').val().trim(),
			caPrjId : $('#txt_global_search_ip_eng').val().trim(),
			   projectId:!globalProjectSelectedObj?null:globalProjectSelectedObj.id
		  }
		  if(globalProjectSelectedObj)
			{
				globalProjectSelectedObj=null;
			}	
	} else {
		$('#txt_global_search_ip_eng').val('');
	}
	data['curScope'] = setCurrentModuleScope();
	if (projectListRequest && typeof projectListRequest.abort == 'function') {
		projectListRequest.abort();
	}
	if($('#searchBox_projects_ip_eng').val().trim()!="")
	{
	data['prjPhase']='1,2,3,4,7,98,99';
	}
	if(isSapWbs && $('#searchBox_projects_ip_eng').val().trim()=="" )
	{
		data['prjPhase']='1,2';
	}
	projectListRequest = $.ajax({
				url : 'getIpEngineeringProjects',
				cache : false,
				async:false,
				data : data,
				success : function(response) {
					stakedUnitsProjectListData.length = 0;
					$('#list-frame_su').html(response);
					if (!isGlobalSearch
							&& !$('#txt_global_search_ip_eng').val()
							&& !$('#searchBox_projects_ip_eng').val()) {
						currentFilter = data;
						if(!isSaveSearchCriteria)
						{
						currentFilter.filterId = '';
						}
					} else {
						currentFilter = null;
					}
					var totalCount = 0, pages = 0;
					if (stakedUnitsProjectListData.length) {
						totalCount = stakedUnitsProjectListData[0].totalCount;
						pages = Math.ceil(totalCount / 25);
					}

					if (!$('#page_projects_ip_engineering')[0].status) {
						$('#page_projects_ip_engineering').jqPagination({
							link_string : '/?page={page_number}',
							max_page : pages,
							paged : function(page) {
								if (page != 1) {
									page = ((page - 1) * 25) + 1;
								}
								getIpEngineeringProjects(page, 26, true,
										isGlobalSearch);
							}
						});
						$('#page_projects_ip_engineering')[0].status = true;
					}
					if (!isGlobalSearch && !$('#searchOptionsBox').hasClass('hidden')) {
						hideAdVancedSearchGrayBox();
					}
				}
			});
//	}
}



function getRedlinesProjects(offset, limit, init, isGlobalSearch, isSapWbs) {
	if (!offset && !limit) {
		offset = 1;
		limit = 26;
	}
	if($('#advanceSearchResetIcon').is(':visible') && !isGlobalSearch && !isSapWbs)
	{
		var data=getSavedSearchDetails(offset,limit); 
	}
	else
	{
	var data = {
		offset : offset,
		limit : limit,
		searchFlag : 2,
		prjPhase : '3',
		projectName : ($('#searchBox_projects_redlines')
				? $('#searchBox_projects_redlines').val()
				: null),
		sapWbsCd : ($('#searchBox_projects_redlines') ?$('#searchBox_projects_redlines')
				.val(): null)
	};
	}
	if($('#searchBox_projects_redlines').val()!="" && 
			$('#advanceSearchResetIcon').is(':visible'))
	{
		resetRedlinesProjects(1);
	}
	if((isSapWbs ==true)&&$('#searchBox_projects_redlines').val()=="")
		{
		data['searchFlag'] =0;
		resetRedlinesProjects(1);
		}
	var sortFieldValString=getMultiSortParameters(MULTISORT_FIELD);	
	var sortOrderValString=getMultiSortParameters(MULTISORT_ORDER);
	var sortFlag=1;
	sortFlag=(getMultiSortParameters(MULTISORT_FLAG)==null)?sortFlag:getMultiSortParameters(MULTISORT_FLAG);
	if (($('#projectId_prj_filter').is(':visible') && $('#projectId_prj_filter').val()!=undefined)
			|| (!isGlobalSearch && $('#advanceSearchResetIcon').is(':visible') && !$('#searchBox_projects_redlines')
					.val()) && !isSapWbs && $('#projectId_prj_filter').val()!=undefined) {
		// $('#searchBox_projects_su').val('');

		if (currentFilter) {
			var filterName = currentFilter.searchName
					? currentFilter.searchName
							.replace(' (Default)', '')
					: '';
							}
		data = {
			offset : offset || 1,
			limit : limit || 26,
			searchName :  isSaveSearchCriteria?filterName:'',
			prjPhase : '3',
			frmSearch : true,
			searchId : null,
			searchFrom : 1,
			isDefault : 0,
			caPrjId : $('#projectId_prj_filter').val().trim(),
			sapWbsCd : $('#sapWbsCode_prj_filter').val().trim(),
			projectName : $('#pjtName_prj_filter').val().trim(),
			lobType : ($('#projectType_prj_filter').val()
					? $('#projectType_prj_filter').val().join(',')
					: null),
			/*
			 * prjPhase : ($('#phase_prj_filter').val() ? $('#phase_prj_filter')
			 * .val().join(',') : null),
			 */
					 projectScopeId : $('#pjtScope_prj_filter option:selected').val(),
					   owner : ($('#owner_prj_filter').val()
								? $('#owner_prj_filter').val().join('`')
										: null),
						stateId : $('#state_prj_filter option:selected').val(),
						prjCompany : $('#company_prj_filter option:selected').val(),
						exchangeId : $('#exchange_prj_filter option:selected').val(),
						msegId : $('#marketSeg_prj_filter option:selected').val(),
			prjCrtdFrm : $('#createdFrom_prj_filter').val(),
			prjCrtdTo : $('#createdTo_prj_filter').val(),
			phaseDysFrm : $('#phaseDysFrm_prj_filter').val(),
			phaseDysTo : $('#phaseDysTo_prj_filter').val(),
			projectExpedite : $('#expedite_prj_filter').val(),
			sortFields:sortFieldValString,/*for multisort*/
		    sortOrders:sortOrderValString,
		    sortFlag:sortFlag
		};
	}
	// $('#page_projects_su').jqPagination({max_page : 0,current_page : 1});
	if (!init) {
		try {
			$('#page_projects_redlines').jqPagination('destroy');
			if ($('#page_projects_redlines').jqPagination('getParam', 'max_page') != 0) {
				$('#page_projects_redlines').jqPagination('option', 'current_page',
						1, true);
			}
			$('#page_projects_redlines')[0].status = false;
		} catch (err) {

		}
	}
	if (isGlobalSearch) {
		$('#searchBox_projects_redlines').val('');
		data = {
			offset : offset || 1,
			limit : limit || 26,
			searchFrom : 1,
			searchFlag : 2,
			prjPhase : null,
			projectName : $('#txt_global_search_redlines').val().trim(),
			sapWbsCd : $('#txt_global_search_redlines').val().trim()
		}
	} else {
		$('#txt_global_search_redlines').val('');
	}
	data['curScope'] = setCurrentModuleScope();
	if (projectListRequest && typeof projectListRequest.abort == 'function') {
		projectListRequest.abort();
	}
	
	projectListRequest = $.ajax({
				url : 'getRedlinesProjects',
				cache : false,
				data : data,
				success : function(response) {
					stakedUnitsProjectListData.length = 0;
					$('#list-frame_su').html(response);
					if (!isGlobalSearch
							&& !$('#txt_global_search_redlines').val()
							&& !$('#searchBox_projects_redlines').val()) {
						currentFilter = data;
						if(!isSaveSearchCriteria)
						{
						currentFilter.filterId = '';
						}
					} else {
						currentFilter = null;
					}
					var totalCount = 0, pages = 0;
					if (stakedUnitsProjectListData.length) {
						totalCount = stakedUnitsProjectListData[0].totalCount;
						pages = Math.ceil(totalCount / 25);
					}

					if (!$('#page_projects_redlines')[0].status) {
						$('#page_projects_redlines').jqPagination({
							link_string : '/?page={page_number}',
							max_page : pages,
							paged : function(page) {
								if (page != 1) {
									page = ((page - 1) * 25) + 1;
								}
								getRedlinesProjects(page, 26, true,
										isGlobalSearch);
							}
						});
						$('#page_projects_redlines')[0].status = true;
					}
				}
			});
}



function getHldromProjects(offset, limit, init, isGlobalSearch, isSapWbs) {
	/*if(!isSapWbs || (isSapWbs && $('#searchBox_projects_isp_hldrom').val().trim()!="" ))
	{*/
	if (!offset && !limit) {
		offset = 1;
		limit = 26;
	}
	if($('#advanceSearchResetIcon').is(':visible') && !isGlobalSearch && !isSapWbs)
	{
		var data=getSavedSearchDetails(offset,limit); 
	}
	else
	{
	var data = {
		offset : offset,
		limit : limit,
		searchFlag : 2,
		prjPhase : (isSapWbs==true)?'1,2,3,4,7,98,99':'2,3',
		//prjPhase : '2,3',		
		projectName : ($('#searchBox_projects_isp_hldrom')
				? $('#searchBox_projects_isp_hldrom').val()
				: null),
		sapWbsCd : ($('#searchBox_projects_isp_hldrom') ?$('#searchBox_projects_isp_hldrom')
				.val(): null),
		caPrjId : ($('#searchBox_projects_isp_hldrom') ?$('#searchBox_projects_isp_hldrom')
						.val(): null)
	};
	}
	if($('#searchBox_projects_isp_hldrom').val()!="" && 
			$('#advanceSearchResetIcon').is(':visible'))
	{
		resetIspHldromProjects(1);
	}
	if((isSapWbs ==true)&&$('#searchBox_projects_isp_hldrom').val()=="")
		{
		data['searchFlag'] =0;
		resetIspHldromProjects(1);
		}
	var sortFieldValString=getMultiSortParameters(MULTISORT_FIELD);	
	var sortOrderValString=getMultiSortParameters(MULTISORT_ORDER);
	var sortFlag=1;
	sortFlag=(getMultiSortParameters(MULTISORT_FLAG)==null)?sortFlag:getMultiSortParameters(MULTISORT_FLAG);
	if (($('#projectId_prj_filter').is(':visible') && $('#projectId_prj_filter').val()!=undefined)
			|| (!isGlobalSearch && $('#advanceSearchResetIcon').is(':visible') && !$('#searchBox_projects_su')
					.val()) && !isSapWbs && $('#projectId_prj_filter').val()!=undefined) {
		// $('#searchBox_projects_su').val('');

		if (currentFilter) {
			var filterName = currentFilter.searchName
					? currentFilter.searchName
							.replace(' (Default)', '')
					: '';
							}
		data = {
			offset : offset || 1,
			limit : limit || 26,
			searchName : isSaveSearchCriteria?filterName:'',
			prjPhase :  ($('#phase_prj_filter').val()
					? $('#phase_prj_filter').val().join(',')
							: '2,3'),//changed 2 to 2,3 for jira 875
			frmSearch : true,
			searchId : null,
			searchFrom : 1,
			isDefault : 0,
			caPrjId : $('#projectId_prj_filter').val().trim(),
			sapWbsCd : $('#sapWbsCode_prj_filter').val().trim(),
			projectName : $('#pjtName_prj_filter').val().trim(),
			lobType : ($('#projectType_prj_filter').val()
					? $('#projectType_prj_filter').val().join(',')
					: null),
			/*
			 * prjPhase : ($('#phase_prj_filter').val() ? $('#phase_prj_filter')
			 * .val().join(',') : null),
			 */
					 projectScopeId : $('#pjtScope_prj_filter option:selected').val(),
					   owner : ($('#owner_prj_filter').val()
								? $('#owner_prj_filter').val().join('`')
										: null),
						stateId : $('#state_prj_filter option:selected').val(),
						prjCompany : $('#company_prj_filter option:selected').val(),
						exchangeId : $('#exchange_prj_filter option:selected').val(),
						msegId : $('#marketSeg_prj_filter option:selected').val(),
			prjCrtdFrm : $('#createdFrom_prj_filter').val(),
			prjCrtdTo : $('#createdTo_prj_filter').val(),
			phaseDysFrm : $('#phaseDysFrm_prj_filter').val(),
			phaseDysTo : $('#phaseDysTo_prj_filter').val(),
			projectExpedite : $('#expedite_prj_filter').val(),
			sortFields:sortFieldValString,/*for multisort*/
		    sortOrders:sortOrderValString,
		    sortFlag:sortFlag
		};
	}
	// $('#page_projects_su').jqPagination({max_page : 0,current_page : 1});
	if (!init) {
		try {
			$('#page_projects_isp_hldrom').jqPagination('destroy');
			if ($('#page_projects_isp_hldrom').jqPagination('getParam', 'max_page') != 0) {
				$('#page_projects_isp_hldrom').jqPagination('option', 'current_page',
						1, true);
			}
			$('#page_projects_isp_hldrom')[0].status = false;
		} catch (err) {

		}
	}
	if (isGlobalSearch) {
		$('#searchBox_projects_isp_hldrom').val('');
		data = {
			offset : offset || 1,
			limit : limit || 26,
			searchFrom : 1,
			searchFlag : 2,
			prjPhase : null,
			projectName : $('#txt_global_search_isp_hldrom').val().trim(),
			sapWbsCd : $('#txt_global_search_isp_hldrom').val().trim(),
			caPrjId : $('#txt_global_search_isp_hldrom').val().trim(),
			projectId:!globalProjectSelectedObj?null:globalProjectSelectedObj.id
		  }
		  if(globalProjectSelectedObj)
			{
				globalProjectSelectedObj=null;
			}	
	} else {
		$('#txt_global_search_isp_hldrom').val('');
	}
	data['curScope'] = setCurrentModuleScope();
	if (projectListRequest && typeof projectListRequest.abort == 'function') {
		projectListRequest.abort();
	}
	if($('#searchBox_projects_isp_hldrom').val().trim()!="" ||isSapWbs)
		{
		data['prjPhase']='1,2,3,4,7,98,99';
		}
	if(isSapWbs && $('#searchBox_projects_isp_hldrom').val().trim()=="" )
	{
		data['prjPhase']='2,3';
	}
		projectListRequest = $.ajax({
				url : 'getHldromProjects',
				cache : false,
				async:false,
				data : hldRomPrjId > 0 ? {
					projectId : hldRomPrjId,
					searchFlag : 1,
					curScope : setCurrentModuleScope()
				} : stakedToOverheadsProjectId > 0 ? {
					projectId : stakedToOverheadsProjectId,
					searchFlag : 1,
					curScope : setCurrentModuleScope()
					} :data,// used in proced to hld rom functionality in
				// hldrom
				success : function(response) {
					stakedUnitsProjectListData.length = 0;
					$('#list-frame_su').html(response);
					if (!isGlobalSearch
							&& !$('#txt_global_search_isp_hldrom').val()
							&& !$('#searchBox_projects_isp_hldrom').val()) {
						currentFilter = data;
						if(!isSaveSearchCriteria)
						{
						currentFilter.filterId = '';
						}
					} else {
						currentFilter = null;
					}
					var totalCount = 0, pages = 0;
					if (stakedUnitsProjectListData.length) {
						totalCount = stakedUnitsProjectListData[0].totalCount;
						pages = Math.ceil(totalCount / 25);
					}

					if (!$('#page_projects_isp_hldrom')[0].status) {
						$('#page_projects_isp_hldrom').jqPagination({
							link_string : '/?page={page_number}',
							max_page : pages,
							paged : function(page) {
								if (page != 1) {
									page = ((page - 1) * 25) + 1;
								}
								getHldromProjects(page, 26, true,
										isGlobalSearch);
							}
						});
						$('#page_projects_isp_hldrom')[0].status = true;
					}
					if (!isGlobalSearch && !$('#searchOptionsBox').hasClass('hidden')) {
						hideAdVancedSearchGrayBox();
					}
				}
			});
//	}
}

function getCircuitInformationProjects(offset, limit, init, isGlobalSearch, isSapWbs) {
	/*if(!isSapWbs || (isSapWbs && $('#searchBox_projects_circuit_info').val().trim()!="" ))
	{*/
	if (!offset && !limit) {
		offset = 1;
		limit = 26;
	}
	if($('#advanceSearchResetIcon').is(':visible') && !isGlobalSearch && !isSapWbs)
	{
		var data=getSavedSearchDetails(offset,limit); 
	}
	else
	{
	var data = {
		offset : offset,
		limit : limit,
	//	searchFlag : 2,
		prjPhase : (isSapWbs==true)?'1,2,3':'2',
		projectName : ($('#searchBox_projects_circuit_info')
				?$('#searchBox_projects_circuit_info').val()
				: null),
		sapWbsCd : ($('#searchBox_projects_circuit_info') ?$('#searchBox_projects_circuit_info')
				.val() : null),
				caPrjId : ($('#searchBox_projects_circuit_info') ?$('#searchBox_projects_circuit_info')
						.val() : null)
	};
	}
	if($('#searchBox_projects_circuit_info').val()!="" && 
			$('#advanceSearchResetIcon').is(':visible'))
	{
		resetCircuitInfoProjects(1);
	}
	if((isSapWbs ==true)&&$('#searchBox_projects_circuit_info').val()=="")
		{
		data['searchFlag'] =0;
		resetCircuitInfoProjects(1);
		}
	else if(/*(isSapWbs ==true)&&*/$('#searchBox_projects_circuit_info').val()!="")
	{
	data['searchFlag'] =2;
	}
	var sortFieldValString=getMultiSortParameters(MULTISORT_FIELD);	
	var sortOrderValString=getMultiSortParameters(MULTISORT_ORDER);
	var sortFlag=1;
	sortFlag=(getMultiSortParameters(MULTISORT_FLAG)==null)?sortFlag:getMultiSortParameters(MULTISORT_FLAG);
	if (($('#projectId_prj_filter').is(':visible') && $('#projectId_prj_filter').val()!=undefined)
			|| (!isGlobalSearch && $('#advanceSearchResetIcon').is(':visible') && !$('#searchBox_projects_circuit_info')
					.val()) && !isSapWbs && $('#projectId_prj_filter').val()!=undefined) {
		// $('#searchBox_projects_su').val('');
		if (currentFilter) {
			var filterName = currentFilter.searchName
					? currentFilter.searchName
							.replace(' (Default)', '')
					: '';
							}
		data = {
			offset : offset || 1,
			limit : limit || 26,
			searchName :  isSaveSearchCriteria?filterName:'',
			prjPhase : ($('#phase_prj_filter').val()
					? $('#phase_prj_filter').val().join(',')
							: null),
			frmSearch : true,
			searchId : null,
			searchFrom : 1,
			isDefault : 0,
			caPrjId  :$('#projectId_prj_filter').val().trim(),
			sapWbsCd :$('#sapWbsCode_prj_filter').val().trim(),
			projectName : $('#pjtName_prj_filter').val().trim(),
			lobType : ($('#projectType_prj_filter').val()
					? $('#projectType_prj_filter').val().join(',')
					: null),
			/*
			 * prjPhase : ($('#phase_prj_filter').val() ? $('#phase_prj_filter')
			 * .val().join(',') : null),
			 */
			projectScopeId : $('#pjtScope_prj_filter option:selected').val(),
			owner : ($('#owner_prj_filter').val()
					? $('#owner_prj_filter').val().join('`')
							: null),
			stateId : $('#state_prj_filter option:selected').val(),
			prjCompany : $('#company_prj_filter option:selected').val(),
			exchangeId : $('#exchange_prj_filter option:selected').val(),
			msegId : $('#marketSeg_prj_filter option:selected').val(),
			prjCrtdFrm : $('#createdFrom_prj_filter').val(),
			prjCrtdTo : $('#createdTo_prj_filter').val(),
			phaseDysFrm : $('#phaseDysFrm_prj_filter').val(),
			phaseDysTo : $('#phaseDysTo_prj_filter').val(),
			projectExpedite : $('#expedite_prj_filter').val(),
			sortFields:sortFieldValString,/*for multisort*/
		    sortOrders:sortOrderValString,
		    sortFlag:sortFlag
		};
	}
	// $('#page_projects_su').jqPagination({max_page : 0,current_page : 1});
	if (!init) {
		try {
			$('#page_projects_circuit_info').jqPagination('destroy');
			if ($('#page_projects_circuit_info').jqPagination('getParam', 'max_page') != 0) {
				$('#page_projects_circuit_info').jqPagination('option', 'current_page',
						1, true);
			}
			$('#page_projects_circuit_info')[0].status = false;
		} catch (err) {

		}
	}
	if (isGlobalSearch) {
		$('#searchBox_projects_circuit_info').val('');
		data = {
			offset : offset || 1,
			limit : limit || 26,
			searchFrom : 1,
			searchFlag : 2,
			prjPhase : null,
			projectName : $('#txt_global_search_circuit_info').val().trim(),
			sapWbsCd : $('#txt_global_search_circuit_info').val().trim(),
			caPrjId : $('#txt_global_search_circuit_info').val().trim(),
			   projectId:!globalProjectSelectedObj?null:globalProjectSelectedObj.id
		  }
		  if(globalProjectSelectedObj)
			{
				globalProjectSelectedObj=null;
			}	
	} else {
		$('#txt_global_search_circuit_info').val('');
	}
	data['curScope'] = setCurrentModuleScope();
	if (projectListRequest && typeof projectListRequest.abort == 'function') {
		projectListRequest.abort();
	}
	if($('#searchBox_projects_circuit_info').val().trim()!="")
	{
	data['prjPhase']='1,2,3';
	}
	if(isSapWbs && $('#searchBox_projects_circuit_info').val().trim()=="" )
	{
		data['prjPhase']='2';
	}
	projectListRequest = $.ajax({
				url : 'getCircuitInformationProjects',
				cache : false,
				async:false,
				data : data,
				success : function(response) {
					circuitInfoProjectsListData.length = 0;
					$('#list-frame_su').html(response);
					if (!isGlobalSearch
							&& !$('#txt_global_search_circuit_info').val()
							&& !$('#searchBox_projects_circuit_info').val()) {
						currentFilter = data;
						if(!isSaveSearchCriteria)
						{
						currentFilter.filterId = '';
						}
					} else {
						currentFilter = null;
					}
					var totalCount = 0, pages = 0;
					if (circuitInfoProjectsListData.length) {
						totalCount = circuitInfoProjectsListData[0].totalCount;
						pages = Math.ceil(totalCount / 25);
						
					}

					if (!$('#page_projects_circuit_info')[0].status) {
						$('#page_projects_circuit_info').jqPagination({
							link_string : '/?page={page_number}',
							max_page : pages,
							paged : function(page) {
								if (page != 1) {
									page = ((page - 1) * 25) + 1;
								}
								getCircuitInformationProjects(page, 26, true,
										isGlobalSearch);
							}
						});
						$('#page_projects_circuit_info')[0].status = true;
					}
					if (!isGlobalSearch && !$('#searchOptionsBox').hasClass('hidden')) {
						hideAdVancedSearchGrayBox();
					}
				}
			});
	//}
}


function getInspectionProjects(offset, limit, init, isGlobalSearch, isSapWbs) {

	if (!offset && !limit) {
		offset = 1;
		limit = 26;
	}
	if($('#advanceSearchResetIcon').is(':visible') && !isGlobalSearch && !isSapWbs)
	{
		var data=getSavedSearchDetails(offset,limit); 
	}
	else
	{
	var data = {
		offset : offset,
		limit : limit,
		searchFlag : 2,
		prjPhase : '3',
		projectName : ($('#searchBox_projects_inspections')
				?$('#searchBox_projects_inspections').val()
				: null),
		sapWbsCd : ($('#searchBox_projects_inspections') ?$('#searchBox_projects_inspections')
				.val(): null)
	};
	}
	if($('#searchBox_projects_inspections').val()!="" && 
			$('#advanceSearchResetIcon').is(':visible'))
	{
		resetInspectionsProjects(1);
	}
	if((isSapWbs ==true)&&$('#searchBox_projects_inspections').val()=="")
		{
		data['searchFlag'] =0;
		resetInspectionsProjects(1);
		}
	var sortFieldValString=getMultiSortParameters(MULTISORT_FIELD);	
	var sortOrderValString=getMultiSortParameters(MULTISORT_ORDER);
	var sortFlag=1;
	sortFlag=(getMultiSortParameters(MULTISORT_FLAG)==null)?sortFlag:getMultiSortParameters(MULTISORT_FLAG);
	if (($('#projectId_prj_filter').is(':visible') && $('#projectId_prj_filter').val()!=undefined)
			|| (!isGlobalSearch && $('#advanceSearchResetIcon').is(':visible') && !$('#searchBox_projects_su')
					.val()) && !isSapWbs && $('#projectId_prj_filter').val()!=undefined) {
		// $('#searchBox_projects_su').val('');

		if (currentFilter) {
			var filterName = currentFilter.searchName
					? currentFilter.searchName
							.replace(' (Default)', '')
					: '';
							}
		data = {
			offset : offset || 1,
			limit : limit || 26,
			searchName : isSaveSearchCriteria?filterName:'',
			prjPhase : '3',
			frmSearch : true,
			searchId : null,
			searchFrom : 1,
			isDefault : 0,
			caPrjId : $('#projectId_prj_filter').val().trim(),
			sapWbsCd :$('#sapWbsCode_prj_filter').val().trim(),
			projectName :$('#pjtName_prj_filter').val().trim(),
			lobType : ($('#projectType_prj_filter').val()
					? $('#projectType_prj_filter').val().join(',')
					: null),
			/*
			 * prjPhase : ($('#phase_prj_filter').val() ? $('#phase_prj_filter')
			 * .val().join(',') : null),
			 */
					projectScopeId : $('#pjtScope_prj_filter option:selected').val(),
					owner :($('#owner_prj_filter').val()
							? $('#owner_prj_filter').val().join('`')
									: null),
					stateId : $('#state_prj_filter option:selected').val(),
					prjCompany : $('#company_prj_filter option:selected').val(),
					exchangeId : $('#exchange_prj_filter option:selected').val(),
					msegId : $('#marketSeg_prj_filter option:selected').val(),
			prjCrtdFrm : $('#createdFrom_prj_filter').val(),
			prjCrtdTo : $('#createdTo_prj_filter').val(),
			phaseDysFrm : $('#phaseDysFrm_prj_filter').val(),
			phaseDysTo : $('#phaseDysTo_prj_filter').val(),
			projectExpedite : $('#expedite_prj_filter').val(),
			sortFields:sortFieldValString,/*for multisort*/
		    sortOrders:sortOrderValString,
		    sortFlag:sortFlag
		};
	}
	// $('#page_projects_su').jqPagination({max_page : 0,current_page : 1});
	if (!init) {
		try {
			$('#page_projects_inspections').jqPagination('destroy');
			if ($('#page_projects_inspections').jqPagination('getParam', 'max_page') != 0) {
				$('#page_projects_inspections').jqPagination('option', 'current_page',
						1, true);
			}
			$('#page_projects_inspections')[0].status = false;
		} catch (err) {

		}
	}
	if (isGlobalSearch) {
		$('#searchBox_projects_inspections').val('');
		data = {
			offset : offset || 1,
			limit : limit || 26,
			searchFrom : 1,
			searchFlag : 2,
			prjPhase : null,
			projectName : $('#txt_global_search_inspections').val().trim(),
			sapWbsCd : $('#txt_global_search_inspections').val().trim()
		}
	} else {
		$('#txt_global_search_inspections').val('');
	}
	data['curScope'] = setCurrentModuleScope();
	if (projectListRequest && typeof projectListRequest.abort == 'function') {
		projectListRequest.abort();
	}
	
	projectListRequest = $.ajax({
				url : 'getInspectionsProjects',
				cache : false,
				data : data,
				success : function(response) {
					
					inspectionsProjectsListData.length = 0;
					$('#list-frame_su').html(response);
					if (!isGlobalSearch
							&& !$('#txt_global_search_inspections').val()
							&& !$('#searchBox_projects_inspections').val()) {
						currentFilter = data;
						if(!isSaveSearchCriteria)
						{
						currentFilter.filterId = '';
						}
					} else {
						currentFilter = null;
					}
					var totalCount = 0, pages = 0;
					if (inspectionsProjectsListData.length) {
						totalCount = inspectionsProjectsListData[0].totalCount;
						pages = Math.ceil(totalCount / 25);
						
					}

					if (!$('#page_projects_inspections')[0].status) {
						$('#page_projects_inspections').jqPagination({
							link_string : '/?page={page_number}',
							max_page : pages,
							paged : function(page) {
								if (page != 1) {
									page = ((page - 1) * 25) + 1;
								}
								getInspectionProjects(page, 26, true,
										isGlobalSearch);
							}
						});
						$('#page_projects_inspections')[0].status = true;
					}
				}
			});
}

function getIspEngineeringProjects(offset, limit, init, isGlobalSearch, isSapWbs) {
	/*if(!isSapWbs || (isSapWbs && $('#searchBox_projects_isp_engg').val().trim()!="" ))
	{*/
	if (!offset && !limit) {
		offset = 1;
		limit = 26;
	}
	if($('#advanceSearchResetIcon').is(':visible') && !isGlobalSearch && !isSapWbs)
	{
		var data=getSavedSearchDetails(offset,limit); 
	}
	else
	{
	var data = {
		offset : offset,
		limit : limit,
		//searchFlag : 2,
		prjPhase : (isSapWbs==true)?'1,2,3,4,7,98,99':'2,3',
		//prjPhase : '2,3',
		projectName : ($('#searchBox_projects_isp_engg')
				? $('#searchBox_projects_isp_engg').val()
				: null),
		sapWbsCd : ($('#searchBox_projects_isp_engg') ?$('#searchBox_projects_isp_engg')
				.val(): null),
		caPrjId : ($('#searchBox_projects_isp_engg') ?$('#searchBox_projects_isp_engg')
						.val(): null)
	};
	}
	if($('#searchBox_projects_isp_engg').val()!="" && 
			$('#advanceSearchResetIcon').is(':visible'))
	{
		resetIspEnggProjects(1);
	}
	if((isSapWbs ==true)&&$('#searchBox_projects_isp_engg').val()=="")
		{
		data['searchFlag'] =0;
		resetIspEnggProjects(1);
		}
	else if(/*(isSapWbs ==true)&&*/$('#searchBox_projects_isp_engg').val()!="")
	{
	data['searchFlag'] =2;
	}
	var sortFieldValString=getMultiSortParameters(MULTISORT_FIELD);	
	var sortOrderValString=getMultiSortParameters(MULTISORT_ORDER);
	var sortFlag=1;
	sortFlag=(getMultiSortParameters(MULTISORT_FLAG)==null)?sortFlag:getMultiSortParameters(MULTISORT_FLAG);
	if (($('#projectId_prj_filter').is(':visible') && $('#projectId_prj_filter').val()!=undefined)
			|| (!isGlobalSearch && $('#advanceSearchResetIcon').is(':visible') && !$('#searchBox_projects_isp_engg')
					.val()) && !isSapWbs && $('#projectId_prj_filter').val()!=undefined) {
		// $('#searchBox_projects_su').val('');

		if (currentFilter) {
			var filterName = currentFilter.searchName
					? currentFilter.searchName
							.replace(' (Default)', '')
					: '';
							}
		data = {
			offset : offset || 1,
			limit : limit || 26,
			searchName :  isSaveSearchCriteria?filterName:'',
			prjPhase : ($('#phase_prj_filter').val()
					? $('#phase_prj_filter').val().join(',')
							: '2,3'),//changed 2 to 2,3 for jira 875
			frmSearch : true,
			searchId : null,
			searchFrom : 1,
			isDefault : 0,
			caPrjId : $('#projectId_prj_filter').val().trim(),
			sapWbsCd : $('#sapWbsCode_prj_filter').val().trim(),
			projectName : $('#pjtName_prj_filter').val().trim(),
			lobType : ($('#projectType_prj_filter').val()
					? $('#projectType_prj_filter').val().join(',')
					: null),
			/*
			 * prjPhase : ($('#phase_prj_filter').val() ? $('#phase_prj_filter')
			 * .val().join(',') : null),
			 */
					projectScopeId : $('#pjtScope_prj_filter option:selected').val(),
					owner :($('#owner_prj_filter').val()
							? $('#owner_prj_filter').val().join('`')
									: null),
					stateId : $('#state_prj_filter option:selected').val(),
					prjCompany : $('#company_prj_filter option:selected').val(),
					exchangeId : $('#exchange_prj_filter option:selected').val(),
					msegId : $('#marketSeg_prj_filter option:selected').val(),
			prjCrtdFrm : $('#createdFrom_prj_filter').val(),
			prjCrtdTo : $('#createdTo_prj_filter').val(),
			phaseDysFrm : $('#phaseDysFrm_prj_filter').val(),
			phaseDysTo : $('#phaseDysTo_prj_filter').val(),
			projectExpedite : $('#expedite_prj_filter').val(),
			sortFields:sortFieldValString,/*for multisort*/
		    sortOrders:sortOrderValString,
		    sortFlag:sortFlag
		};
	}
	// $('#page_projects_su').jqPagination({max_page : 0,current_page : 1});
	if (!init) {
		try {
			$('#page_projects_ispEngg').jqPagination('destroy');
			if ($('#page_projects_ispEngg').jqPagination('getParam', 'max_page') != 0) {
				$('#page_projects_ispEngg').jqPagination('option', 'current_page',
						1, true);
			}
			$('#page_projects_ispEngg')[0].status = false;
		} catch (err) {

		}
	}
	if (isGlobalSearch) {
		$('#searchBox_projects_isp_engg').val('');
		data = {
			offset : offset || 1,
			limit : limit || 26,
			searchFrom : 1,
			searchFlag : 2,
			prjPhase : null,
			projectName : $('#txt_global_search_isp_engg').val().trim(),
			sapWbsCd : $('#txt_global_search_isp_engg').val().trim(),
			caPrjId:$('#txt_global_search_isp_engg').val().trim(),	
			   projectId:!globalProjectSelectedObj?null:globalProjectSelectedObj.id
		  }
		  if(globalProjectSelectedObj)
			{
				globalProjectSelectedObj=null;
			}	
	} else {
		$('#txt_global_search_isp_engg').val('');
	}
	data['curScope'] = setCurrentModuleScope();
	if (projectListRequest && typeof projectListRequest.abort == 'function') {
		projectListRequest.abort();
	}
	if($('#searchBox_projects_isp_engg').val().trim()!="")
	{
	data['prjPhase']='1,2,3,4,7,98,99';
	}
	if(isSapWbs && $('#searchBox_projects_isp_engg').val().trim()=="" )
	{
		data['prjPhase']='2,3';
	}
	projectListRequest = $.ajax({
				url : 'getIspEngineeringProjects',
				cache : false,
				async:false,
				data : data,
				success : function(response) {
					ispEngineeringProjectsListData.length = 0;
					$('#list-frame_su').html(response);
					if (!isGlobalSearch
							&& !$('#txt_global_search_isp_engg').val()
							&& !$('#searchBox_projects_isp_engg').val()) {
						currentFilter = data;
						if(!isSaveSearchCriteria)
						{
						currentFilter.filterId = '';
						}
					} else {
						currentFilter = null;
					}
					var totalCount = 0, pages = 0;
					if (ispEngineeringProjectsListData.length) {
						totalCount = ispEngineeringProjectsListData[0].totalCount;
						pages = Math.ceil(totalCount / 25);
					}

					if (!$('#page_projects_ispEngg')[0].status) {
						$('#page_projects_ispEngg').jqPagination({
							link_string : '/?page={page_number}',
							max_page : pages,
							paged : function(page) {
								if (page != 1) {
									page = ((page - 1) * 25) + 1;
								}
								getIspEngineeringProjects(page, 26, true,
										isGlobalSearch);
							}
						});
						$('#page_projects_ispEngg')[0].status = true;
					}
					if (!isGlobalSearch && !$('#searchOptionsBox').hasClass('hidden')) {
						hideAdVancedSearchGrayBox();
					}
				}
			});
	
//	}
	
}

function getTranslationsProjects(offset, limit, init, isGlobalSearch, isSapWbs) {
/*	if(!isSapWbs || (isSapWbs && $('#searchBox_projects_translations').val().trim()!="" ))
	{*/
	if (!offset && !limit) {
		offset = 1;
		limit = 26;
	}
	if($('#advanceSearchResetIcon').is(':visible') && !isGlobalSearch && !isSapWbs)
	{
		var data=getSavedSearchDetails(offset,limit); 
	}
	else
	{
	var data = {
		offset : offset,
		limit : limit,
		//searchFlag : 2,
		prjPhase : (isSapWbs==true)?'1,2,3':'2',
		projectName : ($('#searchBox_projects_translations')
				? $('#searchBox_projects_translations').val()
				: null),
		sapWbsCd : ($('#searchBox_projects_translations') ?$('#searchBox_projects_translations')
				.val() : null),
				caPrjId : ($('#searchBox_projects_translations') ?$('#searchBox_projects_translations')
						.val() : null)
	};
	}
	if($('#searchBox_projects_translations').val()!="" && 
			$('#advanceSearchResetIcon').is(':visible'))
	{
		resetTranslationsProjects(1);
	}
	if((isSapWbs ==true)&&$('#searchBox_projects_translations').val()=="")
		{
		data['searchFlag'] =0;
		resetTranslationsProjects(1);
		}
	if(/*(isSapWbs ==true)&&*/$('#searchBox_projects_translations').val()!="")
	{
	data['searchFlag'] =2;
	}
	var sortFieldValString=getMultiSortParameters(MULTISORT_FIELD);	
	var sortOrderValString=getMultiSortParameters(MULTISORT_ORDER);
	var sortFlag=1;
	sortFlag=(getMultiSortParameters(MULTISORT_FLAG)==null)?sortFlag:getMultiSortParameters(MULTISORT_FLAG);
	if (($('#projectId_prj_filter').is(':visible') && $('#projectId_prj_filter').val()!=undefined)
			|| (!isGlobalSearch && $('#advanceSearchResetIcon').is(':visible') && !$('#searchBox_projects_su')
					.val()) && !isSapWbs && $('#projectId_prj_filter').val()!=undefined) {
		// $('#searchBox_projects_su').val('');

		if (currentFilter) {
			var filterName = currentFilter.searchName
					? currentFilter.searchName
							.replace(' (Default)', '')
					: '';
							}
		data = {
			offset : offset || 1,
			limit : limit || 26,
			searchName :  isSaveSearchCriteria?filterName:'',
			prjPhase : ($('#phase_prj_filter').val()
					? $('#phase_prj_filter').val().join(',')
							:' 2'),
			frmSearch : true,
			searchId : null,
			searchFrom : 1,
			isDefault : 0,
			caPrjId : $('#projectId_prj_filter').val().trim(),
			sapWbsCd : $('#sapWbsCode_prj_filter').val().trim(),
			projectName : $('#pjtName_prj_filter').val().trim(),
			lobType : ($('#projectType_prj_filter').val()
					? $('#projectType_prj_filter').val().join(',')
					: null),
			/*
			 * prjPhase : ($('#phase_prj_filter').val() ? $('#phase_prj_filter')
			 * .val().join(',') : null),
			 */
					projectScopeId : $('#pjtScope_prj_filter option:selected').val(),
					owner : ($('#owner_prj_filter').val()
							? $('#owner_prj_filter').val().join('`')
									: null),
					stateId : $('#state_prj_filter option:selected').val(),
					prjCompany : $('#company_prj_filter option:selected').val(),
					exchangeId : $('#exchange_prj_filter option:selected').val(),
					msegId : $('#marketSeg_prj_filter option:selected').val(),
			prjCrtdFrm : $('#createdFrom_prj_filter').val(),
			prjCrtdTo : $('#createdTo_prj_filter').val(),
			phaseDysFrm : $('#phaseDysFrm_prj_filter').val(),
			phaseDysTo : $('#phaseDysTo_prj_filter').val(),
			projectExpedite : $('#expedite_prj_filter').val(),
			sortFields:sortFieldValString,/*for multisort*/
		    sortOrders:sortOrderValString,
		    sortFlag:sortFlag
		};
	}
	// $('#page_projects_su').jqPagination({max_page : 0,current_page : 1});
	if (!init) {
		try {
			$('#page_projects_translations').jqPagination('destroy');
			if ($('#page_projects_translations').jqPagination('getParam', 'max_page') != 0) {
				$('#page_projects_translations').jqPagination('option', 'current_page',
						1, true);
			}
			$('#page_projects_translations')[0].status = false;
		} catch (err) {

		}
	}
	if (isGlobalSearch) {
		$('#searchBox_projects_translations').val('');
		data = {
			offset : offset || 1,
			limit : limit || 26,
			searchFrom : 1,
			searchFlag : 2,
			prjPhase : null,
			projectName : $('#txt_global_search_translations').val().trim(),
			sapWbsCd : $('#txt_global_search_translations').val().trim(),
			caPrjId:$('#txt_global_search_translations').val().trim(),
			projectId:!globalProjectSelectedObj?null:globalProjectSelectedObj.id
		  }
		  if(globalProjectSelectedObj)
			{
				globalProjectSelectedObj=null;
			}	
	} else {
		$('#txt_global_search_translations').val('');
	}
	data['curScope'] = setCurrentModuleScope();
	if (projectListRequest && typeof projectListRequest.abort == 'function') {
		projectListRequest.abort();
	}
	if($('#searchBox_projects_translations').val().trim()!="")
	{
	data['prjPhase']='1,2,3';
	}
	if(isSapWbs && $('#searchBox_projects_translations').val().trim()=="" )
	{
		data['prjPhase']='2';
	}
	projectListRequest = $.ajax({
				url : 'translationsProjectList',
				cache : false,
				async:false,
				data : data,
				success : function(response) {
					stakedUnitsProjectListData.length = 0;
					$('#list-frame_su').html(response);
					if (!isGlobalSearch
							&& !$('#txt_global_search_translations').val()
							&& !$('#searchBox_projects_translations').val()) {
						currentFilter = data;
						if(!isSaveSearchCriteria)
						{
						currentFilter.filterId = '';
						}
					} else {
						currentFilter = null;
					}
					var totalCount = 0, pages = 0;
					if (stakedUnitsProjectListData.length) {
						totalCount = stakedUnitsProjectListData[0].totalCount;
						pages = Math.ceil(totalCount / 25);
					}

					if (!$('#page_projects_translations')[0].status) {
						$('#page_projects_translations').jqPagination({
							link_string : '/?page={page_number}',
							max_page : pages,
							paged : function(page) {
								if (page != 1) {
									page = ((page - 1) * 25) + 1;
								}
								getTranslationsProjects(page, 26, true,
										isGlobalSearch);
							}
						});
						$('#page_projects_translations')[0].status = true;
					}
					if (!isGlobalSearch && !$('#searchOptionsBox').hasClass('hidden')) {
						hideAdVancedSearchGrayBox();
					}
				}
			});
	//}
}
function getChangesProjects(offset, limit, init, isGlobalSearch, isSapWbs) {

	if (!offset && !limit) {
		offset = 1;
		limit = 26;
	}
	if($('#advanceSearchResetIcon').is(':visible') && !isGlobalSearch && !isSapWbs)
	{
		var data=getSavedSearchDetails(offset,limit); 
	}
	else
	{
	var data = {
		offset : offset,
		limit : limit,
		searchFlag : 2,
		prjPhase : '3',
		projectName : ($('#searchBox_projects_changes')
				?$('#searchBox_projects_changes').val()
				: null),
		sapWbsCd : ($('#searchBox_projects_changes') ? $('#searchBox_projects_changes')
				.val(): null)
	};
	}
	if($('#searchBox_projects_changes').val()!="" && 
			$('#advanceSearchResetIcon').is(':visible'))
	{
		resetChangesProjects(1);
	}
	if((isSapWbs ==true)&&$('#searchBox_projects_changes').val()=="")
		{
		data['searchFlag'] =0;
		resetChangesProjects(1);
		}
	var sortFieldValString=getMultiSortParameters(MULTISORT_FIELD);	
	var sortOrderValString=getMultiSortParameters(MULTISORT_ORDER);
	var sortFlag=1;
	sortFlag=(getMultiSortParameters(MULTISORT_FLAG)==null)?sortFlag:getMultiSortParameters(MULTISORT_FLAG);
	if (($('#projectId_prj_filter').is(':visible') && $('#projectId_prj_filter').val()!=undefined)
			|| (!isGlobalSearch && $('#advanceSearchResetIcon').is(':visible') && !$('#searchBox_projects_su')
					.val()) && !isSapWbs && $('#projectId_prj_filter').val()!=undefined) {
		// $('#searchBox_projects_su').val('');
		if (currentFilter) {
			var filterName = currentFilter.searchName
					? currentFilter.searchName
							.replace(' (Default)', '')
					: '';
							}
		data = {
			offset : offset || 1,
			limit : limit || 26,
			searchName :isSaveSearchCriteria?filterName:'',
			prjPhase : '3',
			frmSearch : true,
			searchId : null,
			searchFrom : 1,
			isDefault : 0,
			caPrjId : $('#projectId_prj_filter').val().trim(),
			sapWbsCd :$('#sapWbsCode_prj_filter').val().trim(),
			projectName : $('#pjtName_prj_filter').val().trim(),
			lobType : ($('#projectType_prj_filter').val()
					? $('#projectType_prj_filter').val().join(',')
					: null),
			/*
			 * prjPhase : ($('#phase_prj_filter').val() ? $('#phase_prj_filter')
			 * .val().join(',') : null),
			 */
					projectScopeId : $('#pjtScope_prj_filter option:selected').val(),
					owner :($('#owner_prj_filter').val()
							? $('#owner_prj_filter').val().join('`')
									: null),
					stateId : $('#state_prj_filter option:selected').val(),
					prjCompany : $('#company_prj_filter option:selected').val(),
					exchangeId : $('#exchange_prj_filter option:selected').val(),
					msegId : $('#marketSeg_prj_filter option:selected').val(),
			prjCrtdFrm : $('#createdFrom_prj_filter').val(),
			prjCrtdTo : $('#createdTo_prj_filter').val(),
			phaseDysFrm : $('#phaseDysFrm_prj_filter').val(),
			phaseDysTo : $('#phaseDysTo_prj_filter').val(),
			projectExpedite : $('#expedite_prj_filter').val(),
			sortFields:sortFieldValString,/*for multisort*/
		    sortOrders:sortOrderValString,
		    sortFlag:sortFlag
		};
	}
	// $('#page_projects_su').jqPagination({max_page : 0,current_page : 1});
	if (!init) {
		try {
			$('#page_projects_changes').jqPagination('destroy');
			if ($('#page_projects_changes').jqPagination('getParam', 'max_page') != 0) {
				$('#page_projects_changes').jqPagination('option', 'current_page',
						1, true);
			}
			$('#page_projects_changes')[0].status = false;
		} catch (err) {

		}
	}
	if (isGlobalSearch) {
		$('#searchBox_projects_changes').val('');
		data = {
			offset : offset || 1,
			limit : limit || 26,
			searchFrom : 1,
			searchFlag : 2,
			prjPhase : null,
			projectName : $('#txt_global_search_changes').val().trim(),
			sapWbsCd : $('#txt_global_search_changes').val().trim()
		}
	} else {
		$('#txt_global_search_changes').val('');
	}
	data['curScope'] = setCurrentModuleScope();
	if (projectListRequest && typeof projectListRequest.abort == 'function') {
		projectListRequest.abort();
	}
	
	projectListRequest = $.ajax({
				url : 'changesProjectList',
				cache : false,
				data : data,
				success : function(response) {
					stakedUnitsProjectListData.length = 0;
					$('#list-frame_su').html(response);
					if (!isGlobalSearch
							&& !$('#txt_global_search_changes').val()
							&& !$('#searchBox_projects_changes').val()) {
						currentFilter = data;
						if(!isSaveSearchCriteria)
						{
						currentFilter.filterId = '';
						}
					} else {
						currentFilter = null;
					}
					var totalCount = 0, pages = 0;
					if (stakedUnitsProjectListData.length) {
						totalCount = stakedUnitsProjectListData[0].totalCount;
						pages = Math.ceil(totalCount / 25);
					}

					if (!$('#page_projects_changes')[0].status) {
						$('#page_projects_changes').jqPagination({
							link_string : '/?page={page_number}',
							max_page : pages,
							paged : function(page) {
								if (page != 1) {
									page = ((page - 1) * 25) + 1;
								}
								getChangesProjects(page, 26, true,
										isGlobalSearch);
							}
						});
						$('#page_projects_changes')[0].status = true;
					}
				}
			});
}



function getJcrProjects(offset, limit, init, isGlobalSearch, isSapWbs) {

	if (!offset && !limit) {
		offset = 1;
		limit = 26;
	}
	if($('#advanceSearchResetIcon').is(':visible') && !isGlobalSearch && !isSapWbs)
	{
		var data=getSavedSearchDetails(offset,limit); 
	}
	else
	{
	var data = {
		offset : offset,
		limit : limit,
		searchFlag : 2,
		prjPhase : '3',
		projectName : ($('#searchBox_projects_jcr')
				?$('#searchBox_projects_jcr').val()
				: null),
		sapWbsCd : ($('#searchBox_projects_jcr') ?$('#searchBox_projects_jcr')
				.val(): null)
	};
	}
	if($('#searchBox_projects_jcr').val()!="" && 
			$('#advanceSearchResetIcon').is(':visible'))
	{
		resetJcrProjects(1);
	}
	if((isSapWbs ==true)&&$('#searchBox_projects_jcr').val()=="")
		{
		data['searchFlag'] =0;
		resetJcrProjects(1);
		}
	var sortFieldValString=getMultiSortParameters(MULTISORT_FIELD);	
	var sortOrderValString=getMultiSortParameters(MULTISORT_ORDER);
	var sortFlag=1;
	sortFlag=(getMultiSortParameters(MULTISORT_FLAG)==null)?sortFlag:getMultiSortParameters(MULTISORT_FLAG);
	if (($('#projectId_prj_filter').is(':visible') && $('#projectId_prj_filter').val()!=undefined)
			|| (!isGlobalSearch && $('#advanceSearchResetIcon').is(':visible') && !$('#searchBox_projects_su')
					.val()) && !isSapWbs && $('#projectId_prj_filter').val()!=undefined) {
		// $('#searchBox_projects_su').val('');

		if (currentFilter) {
			var filterName = currentFilter.searchName
					? currentFilter.searchName
							.replace(' (Default)', '')
					: '';
							}
		data = {
			offset : offset || 1,
			limit : limit || 26,
			searchName : isSaveSearchCriteria?filterName:'',
			prjPhase : '3',
			frmSearch : true,
			searchId : null,
			searchFrom : 1,
			isDefault : 0,
			caPrjId : $('#projectId_prj_filter').val().trim(),
			sapWbsCd : $('#sapWbsCode_prj_filter').val().trim(),
			projectName : $('#pjtName_prj_filter').val().trim(),
			lobType : ($('#projectType_prj_filter').val()
					? $('#projectType_prj_filter').val().join(',')
					: null),
			/*
			 * prjPhase : ($('#phase_prj_filter').val() ? $('#phase_prj_filter')
			 * .val().join(',') : null),
			 */
					projectScopeId : $('#pjtScope_prj_filter option:selected').val(),
					owner :($('#owner_prj_filter').val()
							? $('#owner_prj_filter').val().join('`')
									: null),
					stateId : $('#state_prj_filter option:selected').val(),
					prjCompany : $('#company_prj_filter option:selected').val(),
					exchangeId : $('#exchange_prj_filter option:selected').val(),
					msegId : $('#marketSeg_prj_filter option:selected').val(),
			prjCrtdFrm : $('#createdFrom_prj_filter').val(),
			prjCrtdTo : $('#createdTo_prj_filter').val(),
			phaseDysFrm : $('#phaseDysFrm_prj_filter').val(),
			phaseDysTo : $('#phaseDysTo_prj_filter').val(),
			projectExpedite : $('#expedite_prj_filter').val(),
			sortFields:sortFieldValString,/*for multisort*/
		    sortOrders:sortOrderValString,
		    sortFlag:sortFlag
		};
	}
	// $('#page_projects_su').jqPagination({max_page : 0,current_page : 1});
	if (!init) {
		try {
			$('#page_projects_jcr').jqPagination('destroy');
			if ($('#page_projects_jcr').jqPagination('getParam', 'max_page') != 0) {
				$('#page_projects_jcr').jqPagination('option', 'current_page',
						1, true);
			}
			$('#page_projects_jcr')[0].status = false;
		} catch (err) {

		}
	}
	if (isGlobalSearch) {
		$('#searchBox_projects_jcr').val('');
		data = {
			offset : offset || 1,
			limit : limit || 26,
			searchFrom : 1,
			searchFlag : 2,
			prjPhase : null,
			projectName : $('#txt_global_search_jcr').val().trim(),
			sapWbsCd : $('#txt_global_search_jcr').val().trim()
		}
	} else {
		$('#txt_global_search_jcr').val('');
	}
	data['curScope'] = setCurrentModuleScope();
	if (projectListRequest && typeof projectListRequest.abort == 'function') {
		projectListRequest.abort();
	}
	
	projectListRequest = $.ajax({
				url : 'jcrProjectList',
				cache : false,
				data : data,
				success : function(response) {
					stakedUnitsProjectListData.length = 0;
					$('#list-frame_su').html(response);
					if (!isGlobalSearch
							&& !$('#txt_global_search_jcr').val()
							&& !$('#searchBox_projects_jcr').val()) {
						currentFilter = data;
						if(!isSaveSearchCriteria)
						{
						currentFilter.filterId = '';
						}
					} else {
						currentFilter = null;
					}
					var totalCount = 0, pages = 0;
					if (stakedUnitsProjectListData.length) {
						totalCount = stakedUnitsProjectListData[0].totalCount;
						pages = Math.ceil(totalCount / 25);
					}

					if (!$('#page_projects_jcr')[0].status) {
						$('#page_projects_jcr').jqPagination({
							link_string : '/?page={page_number}',
							max_page : pages,
							paged : function(page) {
								if (page != 1) {
									page = ((page - 1) * 25) + 1;
								}
								getJcrProjects(page, 26, true,
										isGlobalSearch);
							}
						});
						$('#page_projects_jcr')[0].status = true;
					}
				}
			});
}


function getCableRunningListProjects(offset, limit, init, isGlobalSearch, isSapWbs) {
	/*if(!isSapWbs || (isSapWbs && $('#searchBox_projects_cable_running').val().trim()!="" ))
	{*/
	if (!offset && !limit) {
		offset = 1;
		limit = 26;
	}
	if($('#advanceSearchResetIcon').is(':visible') && !isGlobalSearch && !isSapWbs)
	{
		var data=getSavedSearchDetails(offset,limit); 
	}
	else
	{
	var data = {
		offset : offset,
		limit : limit,
		//searchFlag : 2,
		prjPhase : (isSapWbs==true)?'1,2,3':'2',
		projectName : ($('#searchBox_projects_cable_running')
				? $('#searchBox_projects_cable_running').val()
				: null),
		sapWbsCd : ($('#searchBox_projects_cable_running') ? $('#searchBox_projects_cable_running')
				.val() : null),
				caPrjId : ($('#searchBox_projects_cable_running') ? $('#searchBox_projects_cable_running')
						.val() : null)
	};
	}
	if($('#searchBox_projects_cable_running').val()!="" && 
			$('#advanceSearchResetIcon').is(':visible'))
	{
		resetCableRunningProjects(1);
	}
	if((isSapWbs ==true)&&$('#searchBox_projects_cable_running').val()=="")
		{
		data['searchFlag'] =0;
		resetCableRunningProjects(1);
		}
	else if(/*(isSapWbs ==true)&&*/$('#searchBox_projects_cable_running').val()!="")
	{
	data['searchFlag'] =2;
	}
	var sortFieldValString=getMultiSortParameters(MULTISORT_FIELD);	
	var sortOrderValString=getMultiSortParameters(MULTISORT_ORDER);
	var sortFlag=1;
	sortFlag=(getMultiSortParameters(MULTISORT_FLAG)==null)?sortFlag:getMultiSortParameters(MULTISORT_FLAG);
	if (($('#projectId_prj_filter').is(':visible') && $('#projectId_prj_filter').val()!=undefined)
			|| (!isGlobalSearch && $('#advanceSearchResetIcon').is(':visible') && !$('#searchBox_projects_su')
					.val()) && !isSapWbs && $('#projectId_prj_filter').val()!=undefined) {
		// $('#searchBox_projects_su').val('');
		if (currentFilter) {
			var filterName = currentFilter.searchName
					? currentFilter.searchName
							.replace(' (Default)', '')
					: '';
							}
							
		data = {
			offset : offset || 1,
			limit : limit || 26,
			searchName : isSaveSearchCriteria?filterName:'',
			prjPhase : ($('#phase_prj_filter').val()
					?$('#phase_prj_filter').val().join(',')
							: '2'),//'2,3',
			frmSearch : true,
			searchId : null,
			searchFrom : 1,
			isDefault : 0,
			caPrjId :$('#projectId_prj_filter').val().trim(),
			sapWbsCd :$('#sapWbsCode_prj_filter').val().trim(),
			projectName : $('#pjtName_prj_filter').val().trim(),
			lobType : ($('#projectType_prj_filter').val()
					? $('#projectType_prj_filter').val().join(',')
					: null),
			/*
			 * prjPhase : ($('#phase_prj_filter').val() ? $('#phase_prj_filter')
			 * .val().join(',') : null),
			 */
					projectScopeId : $('#pjtScope_prj_filter option:selected').val(),
					owner : ($('#owner_prj_filter').val()
							? $('#owner_prj_filter').val().join('`')
									: null),
					stateId : $('#state_prj_filter option:selected').val(),
					prjCompany : $('#company_prj_filter option:selected').val(),
					exchangeId : $('#exchange_prj_filter option:selected').val(),
					msegId : $('#marketSeg_prj_filter option:selected').val(),
			prjCrtdFrm : $('#createdFrom_prj_filter').val(),
			prjCrtdTo : $('#createdTo_prj_filter').val(),
			phaseDysFrm : $('#phaseDysFrm_prj_filter').val(),
			phaseDysTo : $('#phaseDysTo_prj_filter').val(),
			projectExpedite : $('#expedite_prj_filter').val(),
			sortFields:sortFieldValString,/*for multisort*/
		    sortOrders:sortOrderValString,
		    sortFlag:sortFlag
		};
	}
	// $('#page_projects_su').jqPagination({max_page : 0,current_page : 1});
	if (!init) {
		try {
			$('#page_projects_cable_running').jqPagination('destroy');
			if ($('#page_projects_cable_running').jqPagination('getParam', 'max_page') != 0) {
				$('#page_projects_cable_running').jqPagination('option', 'current_page',
						1, true);
			}
			$('#page_projects_cable_running')[0].status = false;
		} catch (err) {

		}
	}
	if (isGlobalSearch) {
		$('#searchBox_projects_cable_running').val('');
		data = {
			offset : offset || 1,
			limit : limit || 26,
			searchFrom : 1,
			searchFlag : 2,
			prjPhase : null,
			projectName : $('#txt_global_search_cable_running').val().trim(),
			sapWbsCd : $('#txt_global_search_cable_running').val().trim(),
			caPrjId : $('#txt_global_search_cable_running').val().trim(),
			   projectId:!globalProjectSelectedObj?null:globalProjectSelectedObj.id
		  }
		  if(globalProjectSelectedObj)
			{
				globalProjectSelectedObj=null;
			}
	} else {
		$('#txt_global_search_cable_running').val('');
	}
	data['curScope'] = setCurrentModuleScope();
	if (projectListRequest && typeof projectListRequest.abort == 'function') {
		projectListRequest.abort();
	}
	if($('#searchBox_projects_cable_running').val().trim()!="")
	{
	data['prjPhase']='1,2,3';
	}
	if(isSapWbs && $('#searchBox_projects_cable_running').val().trim()=="" )
	{
		data['prjPhase']='2';
	}
	projectListRequest = $.ajax({
				url : 'getCableRunningListProjects',
				cache : false,
				data : data,
				async:false,
				success : function(response) {
					cableRunningProjectListData.length = 0;
					$('#list-frame_su').html(response);
					if (!isGlobalSearch
							&& !$('#txt_global_search_cable_running').val()
							&& !$('#searchBox_projects_cable_running').val()) {
						currentFilter = data;
						if(!isSaveSearchCriteria)
						{
						currentFilter.filterId = '';
						}
					} else {
						currentFilter = null;
					}
					var totalCount = 0, pages = 0;
					if (cableRunningProjectListData.length) {
						totalCount = cableRunningProjectListData[0].totalCount;
						pages = Math.ceil(totalCount / 25);
					}

					if (!$('#page_projects_cable_running')[0].status) {
						$('#page_projects_cable_running').jqPagination({
							link_string : '/?page={page_number}',
							max_page : pages,
							paged : function(page) {
								if (page != 1) {
									page = ((page - 1) * 25) + 1;
								}
								getCableRunningListProjects(page, 26, true,
										isGlobalSearch);
							}
						});
						$('#page_projects_cable_running')[0].status = true;
					}
					if (!isGlobalSearch && !$('#searchOptionsBox').hasClass('hidden')) {
						hideAdVancedSearchGrayBox();
					}
				}
			});
	//}
}


function filterByState(state,report)
{
	multipleCompanyExchangeFiltered = false;
	var stateElementId = state.id;
	if(report)
	{ 
		var companyElementId = $('#'+stateElementId).parents('.one-bi-three').siblings().eq(0).find("select").attr('id')
		var exchangeElementId = $('#'+stateElementId).parents('.one-bi-three').siblings().eq(1).find("select").attr('id');
	}
	else
	{
		
		var companyElementId = $('#'+stateElementId).parent().next().children().eq(1).attr('id');
		var exchangeElementId =$('#'+companyElementId).parent().next().children().eq(1).attr('id')
	}
	//debugger;
	var stateId=$("#"+stateElementId+" option:selected").val();
	$('#'+companyElementId+' span').showOption(); 
	$('#'+companyElementId+' option').each(function(index) {
		if($(this).attr("stateId")!=stateId && $(this).val()!="" && $("#"+stateElementId+" option:selected").val()!="")
		{
			//$(this).hide();
			$(this).wrap('<span>').hide();
			$(this).selected(false);
		}
		/*else
		{
			$(this).selected(true);
		}*/
	})
	//$("#"+companyElementId +" option:first").attr('selected','selected');		
	  $("#"+companyElementId +" option").selected(false);
	  
	  if($("#"+stateElementId+" option:selected").attr("multi")==0){
	  	
			$('#'+exchangeElementId+' span').showOption(); 
			$('#'+exchangeElementId+' option').each(function(index) {
				if($(this).attr("stateId")!=stateId && $(this).val()!="" && $("#"+stateElementId+" option:selected").val()!="")
				{
					//$(this).hide();
					$(this).wrap('<span>').hide();
					$(this).selected(false);
				}
				/*else
				{
					$(this).selected(true);
				}*/
			})
		
	 }
	 else
	 {
	 	//TODO issue 1 and 4
	 	populateExchange(exchangeElementId,null,stateId,report);
	 		
	 }
	 
	if(stateId)
		{
		companyFiltered = true;
		exchangeFiltered  = true;
		}
	else
	{
		companyFiltered = false;
		exchangeFiltered  = false;
	}
	
	
	/*$("#company_prj_filter").valid();
	$("#exchange_prj_filter").valid();
	$("#state_prj_filter").valid();*/
}
function filterByCompany(company,report)
{
	
	/*if(companyFiltered)
		{
		alert("companyFiltered true")
		}
	else
		{
		alert("companyFiltered false")
		}*/
	var companyElementId = company.id;
	if(report)
	{ 
		var stateElementId = $('#'+companyElementId).parents('.one-bi-three').siblings().eq(0).find("select").attr('id')
		var exchangeElementId = $('#'+companyElementId).parents('.one-bi-three').siblings().eq(1).find("select").attr('id');
	}
	else
	{
		var stateElementId = $('#'+companyElementId).parent().prev().children().eq(1).attr('id');
		var exchangeElementId =$('#'+companyElementId).parent().next().children().eq(1).attr('id')
	}
	
	//debugger;
	//TODO:issue 2:temp fixed with index
	//var companyObject = $("#"+companyElementId+" option").eq($("#"+companyElementId+" option:selected").index());
	var companyObject = $("#"+companyElementId+" option:selected");
	var companyId=companyObject.val();
	//alert(companyId)
	//alert($("#"+companyElementId+" option:selected").val())
	//companyId=$("#"+companyElementId+" option:selected").val();
	
	 if(!companyFiltered){
	var stateId=companyObject.attr("stateId");
	$("#"+stateElementId).val(stateId);
	
	 }
	 var currentState  =  $("#"+stateElementId+" option:selected").val();
	 
	 //TODO issue 1 and 4
	 if(!multipleCompanyExchangeFiltered){
		 if(companyObject.attr("multi")==0){
		 	
			 $('#'+exchangeElementId+' span').showOption(); 
				$('#'+exchangeElementId+' option').each(function(index) {
					
					if($(this).attr("companyId")!=companyId && $(this).val()!="" && $("#"+companyElementId +" option:selected").val()!="")
					{
						$(this).wrap('<span>').hide();
						$(this).selected(false);
						
					}
					else if(currentState && $(this).attr("stateId")!=currentState && $(this).val()!="" )
					{
						//alert("sdfdsf")
						$(this).wrap('<span>').hide();
						$(this).selected(false);
					}
					
				})
		 }
		 else
		 {
		 	 //TODO issue 1 and 4
		 	populateExchange(exchangeElementId,companyId,null,report)
		 	
		 }
	 }
	 
		
		if(companyId && !multipleCompanyExchangeFiltered)
			{
			exchangeFiltered = true;
			}
		else
			{
			exchangeFiltered = false;
			}
	
	
/*	$("#company_prj_filter").valid();
	$("#exchange_prj_filter").valid();
	$("#state_prj_filter").valid();*/
}

function filterByExchange(exchange,report)
{
	
/*	if(exchangeFiltered)
		{
		alert("exchangeFiltered true")
		}
	else
		{
		alert("exchangeFiltered false")
		}*/
	var exchangeElementId = exchange.id;
	if(report)
	{ 
		var stateElementId = $('#'+exchangeElementId).parents('.one-bi-three').siblings().eq(0).find("select").attr('id');
		var companyElementId = $('#'+exchangeElementId).parents('.one-bi-three').siblings().eq(1).find("select").attr('id');
	}
	else
	{
		var companyElementId = $('#'+exchangeElementId).parent().prev().children().eq(1).attr('id');
		var stateElementId =$('#'+companyElementId).parent().prev().children().eq(1).attr('id')
	}
	//debugger;
	if(multipleCompanyExchangeFiltered)
	{
		////
		$('#'+companyElementId+' span').showOption(); 
		$("#"+companyElementId +" option").selected(false);
		//$("#"+stateElementId +" option").selected(false);

	}
//	var exchangeObject = $("#"+exchangeElementId+" option").eq($("#"+exchangeElementId+" option:selected").index());
	var exchangeObject = $("#"+exchangeElementId+" option:selected")
	var exchangeId=exchangeObject.val();
	
	if(multipleCompanyExchangeFiltered || !exchangeFiltered){
		var stateId=exchangeObject.attr("stateId");
		$("#"+stateElementId).val((stateId||""));
		
		var companyId=exchangeObject.attr("companyId");
		$("#"+companyElementId).val((companyId||""));
		
	 }
	else
		{
		if(companyFiltered){
			 var currentCompany  =  $("#"+companyElementId+" option:selected").val();
			  var currentState  =  $("#"+stateElementId+" option:selected").val();
		//	alert("companyFiltered true in ex");
			companyId=exchangeObject.attr("companyId");
			$("#"+companyElementId).val((companyId||""));
			}
		/*else
			{
			alert("companyFiltered false in ex");
			}*/
		}
		multipleCompanyExchangeFiltered = false;
	//alert("companyId="+!companyId)
		if(companyId==0 || !companyId)
		{
			
			filterCompanyBasedOnExchange(exchangeId,exchangeElementId,companyElementId);
			multipleCompanyExchangeFiltered = true;
			$("#"+companyElementId).val((currentCompany||""));
			$("#"+stateElementId).val((currentState||""));
			
			// $("#"+stateElementId +" option").selected(false);
			 companyFiltered = false;
			 
		}
		
	/*$("#company_prj_filter").valid();
	$("#exchange_prj_filter").valid();
	$("#state_prj_filter").valid();*/
		
		
}

function filterCompanyBasedOnExchange(exchangeId,exchangeElementId,companyElementId)
{
	//alert("dfds")
	//console.log("exchangeElementId=="+exchangeId);
	//TODO ajax call to fetch the multiple companies of the exchange
	
	$.ajax({
				url : 'filterCompanyBasedOnExchange',
				cache : false,
				async : false,
				data : {
					exchangeId : exchangeId
				},
				success : function(response) {
				/*	console.log(response.length);
					console.log("----"+response[0].consCompId);
					$('#' + companyElementId + ' span').showOption();
					for(var i = 0;i<response.length;i++)
							{
					$('#' + companyElementId + ' option').each(function(index) {
							// TODO; get exchange id of the company sharing that
							// exchange
							console.log("----"+response[i].consCompId);
								console.log("val--"+$(this).val() );
							if ( $(this).val() != response[i].consCompId) {
								// $(this).hide();
								if(!$(this).parent().is('span')){
								$(this).wrap('<span>').hide();
								$(this).selected(false);}
							
						}
					})
							}*/
					////
					//$('#' + companyElementId + ' option').hideOption();
						$('#' + companyElementId + ' option').each(function(index) {
						if ($(this).val() != "") {
							$(this).wrap('<span>').hide();
							$(this).selected(false);
						}
						})
					
					
					for (var i = 0; i < response.length; i++) {
						$('#' + companyElementId + ' option').each(
								function(index) {

									if ($(this).val() == response[i].consCompId
										|| $(this).val() == "") {
											
									
										$(this).parents('span').showOption();
										$(this).selected(false);

									}
								})
					}
					
				}
			});
			
	
	
}

function populateExchange(exchangeElementId,companyId,stateId,report)
{
		$.ajax({
				url : 'pjtSearchGetExchange',
				cache : false,
				async : false,
				data : {
					consCompId : companyId,
					stateId:stateId
				},
				success : function(response) {
				
					//projectExchangeList.length =0;
					$("#"+exchangeElementId).empty();
					
					if(report){
					$("#"+exchangeElementId)
						.append('<option value="" selected>-- Select ---</option>');}
					else{$("#"+exchangeElementId)
						.append('<option value="" selected="selected">-- ALL ---</option>');}
						
					for (var index = 0; index < response.length; index++) {
						//projectExchangeList.push(response[index]);
						//console.log(response[index]);
						
						$("#"+exchangeElementId)
						.append('<option selected  value='
								+ response[index].projectExchangeId + ' multi='
								+ response[index].multipleCompany + ' stateId='
								+ response[index].stateId + ' companyId='
								+ response[index].consCompId + '> '
								+ response[index].projectExchangeName
								+ '</option>');
						//$("#"+exchangeElementId +" option:first").attr('selected','selected');	
						 $("#"+exchangeElementId +" option").selected(false);
						
					}
						
			     
					
				
					
				}
			});
}

function getSavedSearchDetails(offset,limit){
	//in getSavedSearchDetails
	if (projectsSearchMode != 'pr') {
		var phases = ['ispEstMat', 'isp_dashboard','catv_dashboard','osp_dashboard','ca', 'cas', 'caf','ispL','ispM','ispO','ospL','ospM','ospO','ospE','alaC','hldrom','ipEng','ispEngg','chngs','jcr','redlines','inspectns','cableR','trnsln','circuitInfo','prL','coh'];
		if (phases.indexOf(projectsSearchMode) == -1) {
			currentFilter['prjPhase']='1,2';
		} else if (projectsSearchMode == 'ca'
					|| projectsSearchMode == 'chngs'
						|| projectsSearchMode == 'jcr'
							|| projectsSearchMode == 'redlines'
								|| projectsSearchMode == 'inspectns') {
			currentFilter['prjPhase']='3';
		}else if (projectsSearchMode == 'ispL'
				|| projectsSearchMode == 'ispM'
					|| projectsSearchMode == 'ispO'||
					projectsSearchMode == 'ospL'
						|| projectsSearchMode == 'ospM'
							|| projectsSearchMode == 'ospO'
								|| projectsSearchMode == 'ospE'
									|| projectsSearchMode == 'alaC'
										|| projectsSearchMode == 'isp_dashboard'
											|| projectsSearchMode =='catv_dashboard'
												|| projectsSearchMode =='osp_dashboard'
													|| projectsSearchMode =='ispEstMat') {
			currentFilter['prjPhase']='1,2,3';
		}
		else if( projectsSearchMode == 'ipEng')
			{
			currentFilter['prjPhase']='1,2';
			}
		else if(projectsSearchMode == 'cableR'
			|| projectsSearchMode == 'trnsln'
				|| projectsSearchMode == 'circuitInfo'
					||	projectsSearchMode == 'hldrom'
						|| projectsSearchMode == 'ispEngg')
			{
			currentFilter['prjPhase']='2,3';
			
	} else if(projectsSearchMode == 'cas' || projectsSearchMode == 'caf' || projectsSearchMode == 'coh')
		{
			currentFilter['prjPhase']='3,4';
		}
		else if(projectsSearchMode == 'prL'){
			currentFilter['prjPhase']='1,2,3,4,7,98,99';
		}
		else
		{
			currentFilter['prjPhase']='3,4';
		}
	}
	
	if(currentFilter)
	{
	if(currentFilter['prjSortBy'])
		{
		currentFilter['sortFlag'] = 1;
		}
	}
var data = currentFilter;
data['offset'] = offset;
data['limit'] = limit;
data['projectId']=stakedToOverheadsProjectId;
if(order!=undefined)
{
	data['order'] = order;
}
data['phaseDysTo'] = currentFilter['phaseDysTo'] == 0
		? null
		: currentFilter['phaseDysTo'];
data['phaseDysFrm'] = currentFilter['phaseDysFrm'] == 0
		? null
		: currentFilter['phaseDysFrm'];
data['prjCompany'] = currentFilter['prjCompany'] == 0
		? null
		: currentFilter['prjCompany'];
data['prjPhase'] = currentFilter['prjPhase'] == 0
		? null
		: currentFilter['prjPhase'];
data['projectExpedite'] = currentFilter['projectExpedite'] == -1
		? null
		: currentFilter['projectExpedite'];
data['projectScopeId'] = currentFilter['projectScopeId'] == 0
		? null
		: currentFilter['projectScopeId'];
data['searchFrom'] = currentFilter['searchFrom'] == 0
		? null
		: currentFilter['searchFrom'];
data['stateId'] = currentFilter['stateId'] == 0
		? null
		: currentFilter['stateId'];
delete data.asJson;
delete data.projectDetails;
return data;
}
function getMultiSortParameters(flag)
{
	var sortFlag=null;
	if(flag==1||flag==3)
	{
	var sortFieldObj = $("#rightValues>option").map(function() { return $(this).val(); });
	
	var sortFieldLength = sortFieldObj.length;
	
	var sortFieldValString='';
	
	for(var i=0;i<sortFieldLength;i++)
	{
		sortFieldValString+=sortFieldObj[i];
	  if((i+1)!=sortFieldLength)
	  {
		  sortFieldValString+=','
	  }
	  
	}
	/*//append the elements to complete 8 fields
*/		
	if(sortFieldLength!=MULTISORT_FIELD_TOTAL_COUNT)
		{
		var remainingLength=MULTISORT_FIELD_TOTAL_COUNT-sortFieldLength;
		var sortFieldValString2='';
		
		for(var j=0;j<remainingLength;j++)
			{
			sortFieldValString2=sortFieldValString2.concat(',na');
			/*if((j+1)==remainingLength)
			{
				sortFieldValString.slice(0,-1);
			}*/
			}
		sortFieldValString=sortFieldValString.concat(sortFieldValString2);
		
		}
	if(sortFieldLength==0)
	{
		//sortFieldValString=sortFieldValString2.slice(1);
		sortFieldValString=null;
		
		 sortFlag=0;
		
	}
	if(flag==3){
		return sortFlag;
		}
	if(flag==1){
		return sortFieldValString;}
}
	if(flag==2||flag==3)
		{
	var sortOrderObj = $("#rightValues>option").map(function() { return $(this).attr('sortval'); });
	var sortOrderLength = sortOrderObj.length;
	var sortOrderValString='';
	
	for(var i=0;i<sortOrderLength;i++)
	{
		sortOrderValString+=sortOrderObj[i];
	  if((i+1)!=sortOrderLength)
	  {
		  sortOrderValString+=','
	  }
	  
	}
	/*//append the elements to complete 8 fields
	*/		
			if(sortOrderLength!=MULTISORT_FIELD_TOTAL_COUNT)
				{
				var remainingLength=MULTISORT_FIELD_TOTAL_COUNT-sortOrderLength;
				var sortOrderValString2='';
				
				for(var j=0;j<remainingLength;j++)
					{
					sortOrderValString2=sortOrderValString2.concat(',na');
//					if((j+1)==remainingLength)
//					{
//						sortOrderValString.slice(0,-1);
//					}
					}
				sortOrderValString=sortOrderValString.concat(sortOrderValString2);
				
				}
			if(sortOrderLength==0)
			{
			//sortOrderValString=sortOrderValString2.slice(1);
			sortOrderValString=null;
			 sortFlag=0;
			
			}
			if(flag==3){
				return sortFlag;
				}
	if(flag==2){
		return sortOrderValString;}
		}
}
function assignMultiSortParameters(index)
{
	if(projectFilters[index].prjSortBy)
	{
		var sortFields='',sortOrders='';
		var sortArray = projectFilters[index].prjSortBy.split(',');
		for(var i=0;i<sortArray.length;i++)
		{
			var orderby = sortArray[i].split(' ');
			sortFields+=orderby[0]+',';
			sortOrders+=orderby[1]+',';
		}
		sortFields=sortFields.slice(0,-1);
		sortOrders=sortOrders.slice(0,-1);
	



if(sortArray.length!=MULTISORT_FIELD_TOTAL_COUNT)
{
var remainingLength=MULTISORT_FIELD_TOTAL_COUNT-sortArray.length;
var sortFieldsValString2='';
var sortOrdersValString2='';
for(var j=0;j<remainingLength;j++)
	{
	sortFieldsValString2=sortFieldsValString2.concat(',na');
	sortOrdersValString2=sortOrdersValString2.concat(',na');
	}
sortFields=sortFields.concat(sortFieldsValString2);
sortOrders=sortOrders.concat(sortOrdersValString2);

}

projectFilters[index].sortFields=sortFields;
projectFilters[index].sortOrders=sortOrders;
	}	
}


function redirectToGetProjects(offset, limit, init, isGlobalSearch, isSapWbs)
{
	var projectListFilter,resetFunction, pagination,globalSearchTextBox,url, data,prjPhase,projectListFrame,projectListDataArray,getProjectFunction;
	var projectSearchObject ;
	
	 if (projectsSearchMode == 'su') {
		 
		 projectSearchObject={
					projectListFilter:"searchBox_projects_su",
					resetFunction:resetStakedUnitsProjects, 
					pagination:"page_projects_su",
					globalSearchTextBox:"txt_global_search_staked",
					url:"getStakedUnitProjects",
					data:stakedToOverheadsProjectId > 0 ? {
						projectId : stakedToOverheadsProjectId,
						searchFlag : 1,
						curScope : setCurrentModuleScope()
					} : null,
					prjPhase : '1,2',
					projectListFrame:"list-frame_su",
					projectListDataArray:stakedUnitsProjectListData,
					getProjectFunction:getStakedUnitProjects
					};
		 getProjectsForAllScreens(projectSearchObject,offset, limit, init, isGlobalSearch, isSapWbs);
		
	} else if (projectsSearchMode == 'oh') {
		
		 
		projectSearchObject={
				projectListFilter:"searchBox_projects_oh",
				resetFunction:resetOverHeadsProjects, 
				pagination:"page_projects_oh",
				globalSearchTextBox:"txt_global_search_overheads",
				url:"getOverHeadsProjects",
				data:stakedToOverheadsProjectId > 0 ? {
					projectId : stakedToOverheadsProjectId,
					searchFlag : 1,
					curScope : setCurrentModuleScope()
				} : null, // used in proced to overheads functionality in staked units
				prjPhase : '1,2',
				projectListFrame:"list-frame_oh",
				projectListDataArray:overHeadsProjectListData,
				getProjectFunction:getOverHeadsProjects
				};
	 getProjectsForAllScreens(projectSearchObject,offset, limit, init, isGlobalSearch, isSapWbs);
	
	} else if (projectsSearchMode == 'es') {
		 projectSearchObject={
					projectListFilter:"searchBox_projects_es",
					resetFunction:resetEstimationSummaryProjects, 
					pagination:"page_projects_es",
					globalSearchTextBox:"txt_global_search_estimationSummary",
					projectId : stakedToOverheadsProjectId,
					url:"getEstimationSummaryProjects",
					data:stakedToOverheadsProjectId > 0 ? {
						projectId : stakedToOverheadsProjectId,
						searchFlag : 1,
						curScope : setCurrentModuleScope()
					} : null,
					prjPhase : '1,2',
					projectListFrame:"list-frame_es",
					projectListDataArray:estimationSummaryProjectListData,
					getProjectFunction:getEstimationSummaryProjects
					};
		 getProjectsForAllScreens(projectSearchObject,offset, limit, init, isGlobalSearch, isSapWbs);
		/*if (isGlobalSearch == false) {
			$('#txt_global_search_estimationSummary').val('');
			$('#searchBox_projects_es').val('');
		} else {
			$('#searchBox_projects_es').val('');
		}
		if (isGlobalSearch || validateFilter()) {
			getEstimationSummaryProjects(null, null, null, isGlobalSearch);
			$('#advanceSearchResetIcon').removeClass('hidden');
			if (!isGlobalSearch) {
				hideAdVancedSearchGrayBox();
			}
		}*/
	} else if (projectsSearchMode == 'ef') {
		
		 projectSearchObject={
					projectListFilter:"searchBox_projects_ef",
					resetFunction:resetEstimationFootageProjects, 
					pagination:"page_projects_ef",
					globalSearchTextBox:"txt_global_search_estimationFootage",
					url:"getEstimationFootageProjects",
					data:stakedToOverheadsProjectId > 0 ? {
						projectId : stakedToOverheadsProjectId,
						searchFlag : 1,
						curScope : setCurrentModuleScope()
					} : null,
					prjPhase : '1,2',
					projectListFrame:"list-frame_ef",
					projectListDataArray:estimationFootageProjectListData,
					getProjectFunction:getEstimationFootageProjects
					};
		 getProjectsForAllScreens(projectSearchObject,offset, limit, init, isGlobalSearch, isSapWbs);
		/*if (isGlobalSearch == false) {
			$('#txt_global_search_estimationFootage').val('');
			$('#searchBox_projects_ef').val('');
		} else {
			$('#searchBox_projects_ef').val('');
		}
		if (isGlobalSearch || validateFilter()) {
			getEstimationFootageProjects(null, null, null, isGlobalSearch);
			$('#advanceSearchResetIcon').removeClass('hidden');
			if (!isGlobalSearch) {
				hideAdVancedSearchGrayBox();
			}
		}*/
	} else if (projectsSearchMode == 'ca') {
		 projectSearchObject={
					projectListFilter:"searchBox_projects_ca",
					resetFunction:resetConstructionAsbuiltProjects, 
					pagination:"page_projects_ca",
					globalSearchTextBox:"txt_global_search_constructionAsbuilt",
					url:"getConstructionAsbuiltProjects",
					data:stakedToOverheadsProjectId > 0 ? {
						projectId : stakedToOverheadsProjectId,
						searchFlag : 1,
						curScope : setCurrentModuleScope()
					} : null,
					prjPhase : '3',
					projectListFrame:"list-frame_ca",
					projectListDataArray:constructionAsbuiltProjectListData,
					getProjectFunction:getConstructionAsbuiltProjects
					};
		 getProjectsForAllScreens(projectSearchObject,offset, limit, init, isGlobalSearch, isSapWbs);
	/*	if (isGlobalSearch == false) {
			$('#txt_global_search_constructionAsbuilt').val('');
			$('#searchBox_projects_ca').val('');
		} else {
			$('#searchBox_projects_ca').val('');
		}
		if (isGlobalSearch || validateFilter()) {
			getConstructionAsbuiltProjects(null, null, null, isGlobalSearch);
			$('#advanceSearchResetIcon').removeClass('hidden');
			if (!isGlobalSearch) {
				hideAdVancedSearchGrayBox();
			}
		}*/
	} else if (projectsSearchMode == 'cas') {
		var prjPhase = '3,4';
		if($('#popup_saveSearch').is(':visible') 
			&& $('#phase_prj_filter').is(':visible')){
				prjPhase = $('#phase_prj_filter').val().join(',');
		} else if(currentFilter && $('#advanceSearchResetIcon').is(':visible')){
			prjPhase = currentFilter.prjPhase;
		}
		 projectSearchObject={
					projectListFilter:"searchBox_projects_cas",
					resetFunction:resetConstructionAsbuiltSummaryProjects, 
					pagination:"page_projects_cas",
					globalSearchTextBox:"txt_global_search_constructionAsbuiltSummary",
					url:"getConstructionAsbuiltSummaryProjects",
					data:stakedToOverheadsProjectId > 0 ? {
						projectId : stakedToOverheadsProjectId,
						searchFlag : 1,
						curScope : setCurrentModuleScope()
					} : null,
					prjPhase : prjPhase,
					projectListFrame:"list-frame_cas",
					projectListDataArray:constructionAsbuiltSummaryProjectListData,
					getProjectFunction:getConstructionAsbuiltSummaryProjects
					};
		 getProjectsForAllScreens(projectSearchObject,offset, limit, init, isGlobalSearch, isSapWbs);
	/*	if (isGlobalSearch == false) {
			$('#txt_global_search_constructionAsbuiltSummary').val('');
			$('#searchBox_projects_cas').val('');
		} else {
			$('#searchBox_projects_cas').val('');
		}
		if (isGlobalSearch || validateFilter()) {
			getConstructionAsbuiltSummaryProjects(null, null, null,
					isGlobalSearch);
			$('#advanceSearchResetIcon').removeClass('hidden');
			if (!isGlobalSearch) {
				hideAdVancedSearchGrayBox();
			}
		}*/
	} else if (projectsSearchMode == 'caf') {
		var prjPhase = '3,4';
		if($('#popup_saveSearch').is(':visible') 
			&& $('#phase_prj_filter').is(':visible')){
				prjPhase = $('#phase_prj_filter').val().join(',');
		} else if(currentFilter && $('#advanceSearchResetIcon').is(':visible')){
			prjPhase = currentFilter.prjPhase;
		}
		 projectSearchObject={
					projectListFilter:"searchBox_projects_caf",
					resetFunction:resetConstructionAsbuiltFootageProjects, 
					pagination:"page_projects_caf",
					globalSearchTextBox:"txt_global_search_constructionAsbuiltFootage",
					url:"getConstructionAsbuiltFootageProjects",
					data:stakedToOverheadsProjectId > 0 ? {
						projectId : stakedToOverheadsProjectId,
						searchFlag : 1,
						curScope : setCurrentModuleScope()
					} : null,
					prjPhase : prjPhase,
					projectListFrame:"list-frame_caf",
					projectListDataArray:constructionAsbuiltFootageProjectListData,
					getProjectFunction:getConstructionAsbuiltFootageProjects
					};
		 getProjectsForAllScreens(projectSearchObject,offset, limit, init, isGlobalSearch, isSapWbs);
	/*	if (isGlobalSearch == false) {
			$('#txt_global_search_constructionAsbuiltFootage').val('');
			$('#searchBox_projects_caf').val('');
		} else {
			$('#searchBox_projects_caf').val('');
		}
		if (isGlobalSearch || validateFilter()) {
			getConstructionAsbuiltFootageProjects(null, null, null,
					isGlobalSearch);
			$('#advanceSearchResetIcon').removeClass('hidden');
			if (!isGlobalSearch) {
				hideAdVancedSearchGrayBox();
			}
		}*/
	}
/*	else if (projectsSearchMode == 'ispL') {// TODO cant do
		if (isGlobalSearch == false) {
			$('#txt_global_search_isp_labor').val('');
			$('#searchBox_projects_isp_labor').val('');
		} else {
			$('#searchBox_projects_isp_labor').val('');
		}
		if (isGlobalSearch || validateFilter()) {
			getIspLaborProjects(null, null, null,
					isGlobalSearch);
			$('#advanceSearchResetIcon').removeClass('hidden');
			if (!isGlobalSearch) {
				hideAdVancedSearchGrayBox();
			}
		}
	}
	else if (projectsSearchMode == 'ispM') {// TODO cant do
		if (isGlobalSearch == false) {
			$('#txt_global_search_isp_material').val('');
			$('#searchBox_projects_isp_material').val('');
		} else {
			$('#searchBox_projects_isp_material').val('');
		}
		if (isGlobalSearch || validateFilter()) {
			getIspMaterialsProjects(null, null, null,
					isGlobalSearch);
			$('#advanceSearchResetIcon').removeClass('hidden');
			if (!isGlobalSearch) {
				hideAdVancedSearchGrayBox();
			}
		}
	}
	else if (projectsSearchMode == 'ispO') {
		if (isGlobalSearch == false) {
			$('#txt_global_search_isp_overheads').val('');
			$('#searchBox_projects_isp_overheads').val('');
		} else {
			$('#searchBox_projects_isp_overheads').val('');
		}
		if (isGlobalSearch || validateFilter()) {
			getIspOverheadsProjects(null, null, null,
					isGlobalSearch);
			$('#advanceSearchResetIcon').removeClass('hidden');
			if (!isGlobalSearch) {
				hideAdVancedSearchGrayBox();
			}
		}
	}	
	else if (projectsSearchMode == 'ospL') {
		if (isGlobalSearch == false) {
			$('#txt_global_search_osp_labor').val('');
			$('#searchBox_projects_osp_labor').val('');
		} else {
			$('#searchBox_projects_osp_labor').val('');
		}
		if (isGlobalSearch || validateFilter()) {
			getOspLaborProjects(null, null, null,
					isGlobalSearch);
			$('#advanceSearchResetIcon').removeClass('hidden');
			if (!isGlobalSearch) {
				hideAdVancedSearchGrayBox();
			}
		}
	}	
	else if (projectsSearchMode == 'ospM') {
		if (isGlobalSearch == false) {
			$('#txt_global_search_osp_material').val('');
			$('#searchBox_projects_osp_material').val('');
		} else {
			$('#searchBox_projects_osp_material').val('');
		}
		if (isGlobalSearch || validateFilter()) {
			getOspMaterialsProjects(null, null, null,
					isGlobalSearch);
			$('#advanceSearchResetIcon').removeClass('hidden');
			if (!isGlobalSearch) {
				hideAdVancedSearchGrayBox();
			}
		}
	}
	else if (projectsSearchMode == 'ospO') {
		if (isGlobalSearch == false) {
			$('#txt_global_search_osp_overheads').val('');
			$('#searchBox_projects_osp_overheads').val('');
		} else {
			$('#searchBox_projects_osp_overheads').val('');
		}
		if (isGlobalSearch || validateFilter()) {
			getOspOverheadsProjects(null, null, null,
					isGlobalSearch);
			$('#advanceSearchResetIcon').removeClass('hidden');
			if (!isGlobalSearch) {
				hideAdVancedSearchGrayBox();
			}
		}
	}
	else if (projectsSearchMode == 'ospE') {
		if (isGlobalSearch == false) {
			$('#txt_global_search_osp_est').val('');
			$('#searchBox_projects_osp_est').val('');
		} else {
			$('#searchBox_projects_osp_est').val('');
		}
		if (isGlobalSearch || validateFilter()) {
			getOspEstimationFootageProjects(null, null, null,
					isGlobalSearch);
			$('#advanceSearchResetIcon').removeClass('hidden');
			if (!isGlobalSearch) {
				hideAdVancedSearchGrayBox();
			}
		}
	}
	else if (projectsSearchMode == 'alaC') {
		if (isGlobalSearch == false) {
			$('#txt_global_search_ala_carte').val('');
			$('#searchBox_projects_ala_carte').val('');
		} else {
			$('#searchBox_projects_ala_carte').val('');
		}
		if (isGlobalSearch || validateFilter()) {
			getAlaCarteProjects(null, null, null,
					isGlobalSearch);
			$('#advanceSearchResetIcon').removeClass('hidden');
			if (!isGlobalSearch) {
				hideAdVancedSearchGrayBox();
			}
		}
	}
	else if (projectsSearchMode == 'prL') {
		if (!isGlobalSearch) {
			$('#txt_global_search_projects').val('');
		}
		if (isGlobalSearch || validateFilter()) {
			loadProjectReport(null, null, null,
					isGlobalSearch);
			$('#advanceSearchResetIcon').removeClass('hidden');
			if (!isGlobalSearch) {
				hideAdVancedSearchGrayBox();
			}
		}
		if ($('#page_projects_projects').jqPagination('getParam',
				'current_page') != 1) {
			$('#page_projects_projects').jqPagination('option', 'current_page',
					1, true);
		}
	}*/ 
	else if (projectsSearchMode == 'ispEstMat') {
		var prjPhase = '1,2,3';
		if($('#popup_saveSearch').is(':visible') 
			&& $('#phase_prj_filter').is(':visible')){
				prjPhase = $('#phase_prj_filter').val().join(',');
		} else if(currentFilter && $('#advanceSearchResetIcon').is(':visible')){
			prjPhase = currentFilter.prjPhase;
		}
		 projectSearchObject={
					projectListFilter:"searchBox_projects_isp_estMat",
					resetFunction:resetIspEstimationProjects, 
					pagination:"page_projects_isp_estMat",
					globalSearchTextBox:"txt_global_search_isp_est",
					url:"getIspEstMaterialProjects",
					data: estimationProjectId > 0 ? {
						projectId : estimationProjectId,
						searchFlag : 1,
						curScope : setCurrentModuleScope()
					}:null,
					prjPhase : prjPhase,
					projectListFrame:"list-frame_su",
					projectListDataArray:stakedUnitsProjectListData,
					getProjectFunction:getIspEstimationMaterialProjects
					};
		 getProjectsForAllScreens(projectSearchObject,offset, limit, init, isGlobalSearch, isSapWbs);
/*		if (isGlobalSearch == false) {
			$('#txt_global_search_isp_est').val('');
			$('#searchBox_projects_isp_estMat').val('');
		} else {
			$('#searchBox_projects_isp_estMat').val('');
		}
		if (isGlobalSearch || validateFilter()) {
			getIspEstimationMaterialProjects(null, null, null, isGlobalSearch);
			$('#advanceSearchResetIcon').removeClass('hidden');
			if (!isGlobalSearch) {
				hideAdVancedSearchGrayBox();
			}
		}*/
	
}
/*else if (projectsSearchMode == 'ipEng') {//TODO cant do
	if (isGlobalSearch == false) {
		$('#txt_global_search_ip_eng').val('');
		$('#searchBox_projects_ip_eng').val('');
	} else {
		$('#searchBox_projects_ip_eng').val('');
	}
	if (isGlobalSearch || validateFilter()) {
		getIpEngineeringProjects(null, null, null, isGlobalSearch);
		$('#advanceSearchResetIcon').removeClass('hidden');
		if (!isGlobalSearch) {
			hideAdVancedSearchGrayBox();
		}
	}

}*/
else if (projectsSearchMode == 'redlines') {
	 projectSearchObject={
				projectListFilter:"searchBox_projects_redlines",
				resetFunction:resetRedlinesProjects, 
				pagination:"page_projects_redlines",
				globalSearchTextBox:"txt_global_search_redlines",
				url:"getRedlinesProjects",
				data:null,
				prjPhase : '3',
				projectListFrame:"list-frame_su",
				projectListDataArray:stakedUnitsProjectListData,
				getProjectFunction:getRedlinesProjects
				};
	 getProjectsForAllScreens(projectSearchObject,offset, limit, init, isGlobalSearch, isSapWbs);
/*	if (isGlobalSearch == false) {
		$('#txt_global_search_redlines').val('');
		$('#searchBox_projects_redlines').val('');
	} else {
		$('#searchBox_projects_redlines').val('');
	}
	if (isGlobalSearch || validateFilter()) {
		getRedlinesProjects(null, null, null, isGlobalSearch);
		$('#advanceSearchResetIcon').removeClass('hidden');
		if (!isGlobalSearch) {
			hideAdVancedSearchGrayBox();
		}
	}*/

}
/*else if (projectsSearchMode == 'hldrom') {//TODO cant do
	if (isGlobalSearch == false) {
		$('#txt_global_search_isp_hldrom').val('');
		$('#searchBox_projects_isp_hldrom').val('');
	} else {
		$('#searchBox_projects_isp_hldrom').val('');
	}
	if (isGlobalSearch || validateFilter()) {
		getHldromProjects(null, null, null, isGlobalSearch);
		$('#advanceSearchResetIcon').removeClass('hidden');
		if (!isGlobalSearch) {
			hideAdVancedSearchGrayBox();
		}
	}

}*/
/*	else if (projectsSearchMode == 'trnsln') {//TODO cant do
		if (isGlobalSearch == false) {
			$('#txt_global_search_translations').val('');
			$('#searchBox_projects_translations').val('');
		} else {
			$('#searchBox_projects_translations').val('');
		}
		if (isGlobalSearch || validateFilter()) {
			getTranslationsProjects(null, null, null, isGlobalSearch);
			$('#advanceSearchResetIcon').removeClass('hidden');
			if (!isGlobalSearch) {
				hideAdVancedSearchGrayBox();
			}
		}
	
}*/
	else if (projectsSearchMode == 'chngs') {
		 projectSearchObject={
					projectListFilter:"searchBox_projects_changes",
					resetFunction:resetChangesProjects, 
					pagination:"page_projects_changes",
					globalSearchTextBox:"txt_global_search_changes",
					url:"changesProjectList",
					data:null,
					prjPhase : '3',
					projectListFrame:"list-frame_su",
					projectListDataArray:stakedUnitsProjectListData,
					getProjectFunction:getChangesProjects
					};
		 getProjectsForAllScreens(projectSearchObject,offset, limit, init, isGlobalSearch, isSapWbs);


/*		if (isGlobalSearch == false) {
			$('#txt_global_search_changes').val('');
			$('#searchBox_projects_changes').val('');
		} else {
			$('#searchBox_projects_changes').val('');
		}
		if (isGlobalSearch || validateFilter()) {
			getChangesProjects(null, null, null, isGlobalSearch);
			$('#advanceSearchResetIcon').removeClass('hidden');
			if (!isGlobalSearch) {
				hideAdVancedSearchGrayBox();
			}
		}
	*/
}
	else if (projectsSearchMode == 'jcr') {
		 projectSearchObject={
					projectListFilter:"searchBox_projects_jcr",
					resetFunction:resetJcrProjects, 
					pagination:"page_projects_jcr",
					globalSearchTextBox:"txt_global_search_jcr",
					url:"jcrProjectList",
					data:null,
					prjPhase : '3',
					projectListFrame:"list-frame_su",
					projectListDataArray:stakedUnitsProjectListData,
					getProjectFunction:getJcrProjects
					};
		 getProjectsForAllScreens(projectSearchObject,offset, limit, init, isGlobalSearch, isSapWbs);
	/*	if (isGlobalSearch == false) {
			$('#txt_global_search_jcr').val('');
			$('#searchBox_projects_jcr').val('');
		} else {
			$('#searchBox_projects_jcr').val('');
		}
		if (isGlobalSearch || validateFilter()) {
			getJcrProjects(null, null, null, isGlobalSearch);
			$('#advanceSearchResetIcon').removeClass('hidden');
			if (!isGlobalSearch) {
				hideAdVancedSearchGrayBox();
			}
		}*/
	
}
/*
 * else if (projectsSearchMode == 'ispEngg') {//TODO cant do if (isGlobalSearch ==
 * false) { $('#txt_global_search_isp_engg').val('');
 * $('#searchBox_projects_isp_engg').val(''); } else {
 * $('#searchBox_projects_isp_engg').val(''); } if (isGlobalSearch ||
 * validateFilter()) { getIspEngineeringProjects(null, null, null,
 * isGlobalSearch); $('#advanceSearchResetIcon').removeClass('hidden'); if
 * (!isGlobalSearch) { hideAdVancedSearchGrayBox(); } }
 *  }
 */
	else if (projectsSearchMode == 'inspectns') {
		 projectSearchObject={
					projectListFilter:"searchBox_projects_inspections",
					resetFunction:resetInspectionsProjects, 
					pagination:"page_projects_inspections",
					globalSearchTextBox:"txt_global_search_inspections",
					url:"getInspectionsProjects",
					data:null,
					prjPhase : '3',
					projectListFrame:"list-frame_su",
					projectListDataArray:inspectionsProjectsListData,
					getProjectFunction:getInspectionProjects
					};
		 getProjectsForAllScreens(projectSearchObject,offset, limit, init, isGlobalSearch, isSapWbs);
	/*	if (isGlobalSearch == false) {
			$('#txt_global_search_inspections').val('');
			$('#searchBox_projects_inspections').val('');
		} else {
			$('#searchBox_projects_inspections').val('');
		}
		if (isGlobalSearch || validateFilter()) {
			getInspectionProjects(null, null, null, isGlobalSearch);
			$('#advanceSearchResetIcon').removeClass('hidden');
			if (!isGlobalSearch) {
				hideAdVancedSearchGrayBox();
			}
		}*/
	} 
	else if (projectsSearchMode == 'coh') {
		var prjPhase = '3,4';
		if($('#popup_saveSearch').is(':visible') 
			&& $('#phase_prj_filter').is(':visible')){
				prjPhase = $('#phase_prj_filter').val().join(',');
		} else if(currentFilter && $('#advanceSearchResetIcon').is(':visible')){
			prjPhase = currentFilter.prjPhase;
		}
		 projectSearchObject={
				projectListFilter:"searchBox_projects_coh",
				resetFunction:resetOverHeadsProjects, 
				pagination:"page_projects_coh",
				globalSearchTextBox:"txt_global_search_construction_overheads",
				url:"getConstructionOverHeadsProjects",
				data:stakedToOverheadsProjectId > 0 ? {
					projectId : stakedToOverheadsProjectId,
					searchFlag : 1,
					curScope : setCurrentModuleScope()
				} : null, // used in proced to overheads functionality in staked units
				prjPhase : prjPhase,
				projectListFrame:"list-frame_coh",
				projectListDataArray:overHeadsProjectListData,
				getProjectFunction:getConstructionOverHeadsProjects
			};
		 getProjectsForAllScreens(projectSearchObject,offset, limit, init, isGlobalSearch, isSapWbs);
	}
	/*else if (projectsSearchMode == 'circuitInfo') {//TODO cant do
		if (isGlobalSearch == false) {
			$('#txt_global_search_circuit_info').val('');
			$('#searchBox_projects_circuit_info').val('');
		} else {
			$('#searchBox_projects_circuit_info').val('');
		}
		if (isGlobalSearch || validateFilter()) {
			getCircuitInformationProjects(null, null, null, isGlobalSearch);
			$('#advanceSearchResetIcon').removeClass('hidden');
			if (!isGlobalSearch) {
				hideAdVancedSearchGrayBox();
			}
		}
	}*/
	/*else if (projectsSearchMode == 'cableR') {//TODO cant do
		if (isGlobalSearch == false) {
			$('#txt_global_search_cable_running').val('');
			$('#searchBox_projects_cable_running').val('');
		} else {
			$('#searchBox_projects_cable_running').val('');
		}
		if (isGlobalSearch || validateFilter()) {
			getCableRunningListProjects(null, null, null, isGlobalSearch);
			$('#advanceSearchResetIcon').removeClass('hidden');
			if (!isGlobalSearch) {
				hideAdVancedSearchGrayBox();
			}
		}
	}*/
}


function getProjectsForAllScreens(projectSearchObject,offset, limit, init, isGlobalSearch, isSapWbs) {
	if (!offset && !limit) {
		offset = 1;
		limit = 26;
	}
	if($('#advanceSearchResetIcon').is(':visible') && !isGlobalSearch && !isSapWbs)
	{
		var data=getSavedSearchDetails(offset,limit); 
	}
	else
	{
		var data = {
				offset : offset,
				limit : limit,
				//searchFlag : 2,
				projectId : stakedToOverheadsProjectId,
				prjPhase : projectSearchObject.prjPhase,
				projectName : ($('#'+projectSearchObject.projectListFilter)
						? $('#'+projectSearchObject.projectListFilter).val()
						: null),
				sapWbsCd : ($('#'+projectSearchObject.projectListFilter) ? $('#'+projectSearchObject.projectListFilter)
						.val() : null),
				caPrjId : ($('#'+projectSearchObject.projectListFilter)
						? $('#'+projectSearchObject.projectListFilter).val()
						: null)
			};
	}
	if($('#'+projectSearchObject.projectListFilter).val()!="" && 
			$('#advanceSearchResetIcon').is(':visible'))
	{
		projectSearchObject.resetFunction(1);
	}
	if((isSapWbs ==true)&&$('#'+projectSearchObject.projectListFilter).val()=="")
		{
		data['searchFlag'] =0;
		projectSearchObject.resetFunction(1);
		}
	else if(/*(isSapWbs ==true)&&*/$('#'+projectSearchObject.projectListFilter).val()!="")
	{
	data['searchFlag'] =2;
	}
	
/*	if($('#'+projectSearchObject.projectListFilter).val()=="")
		{
		data['searchFlag'] =0;
		projectSearchObject.resetFunction(1);
		}
	else if($('#'+projectSearchObject.projectListFilter).val()!="")
	{
	data['searchFlag'] =2;
	}*/
	/*
	 * getMultiSortParameters--
	 * pass 1 : for fields 
	pass 2: for order
	pass 3: for sortFlag, default sortflag for multi sort=1. but if no fields used in sort sortflag=0*/
	var sortFieldValString=getMultiSortParameters(MULTISORT_FIELD);	
	var sortOrderValString=getMultiSortParameters(MULTISORT_ORDER);
	var sortFlag=1;
	sortFlag=(getMultiSortParameters(MULTISORT_FLAG)==null)?sortFlag:getMultiSortParameters(MULTISORT_FLAG);
	
	if (($('#projectId_prj_filter').is(':visible') && $('#projectId_prj_filter').val()!=undefined)
			|| (!isGlobalSearch && $('#advanceSearchResetIcon').is(':visible') && !$('#'+projectSearchObject.projectListFilter)
					.val()) && !isSapWbs && $('#projectId_prj_filter').val()!=undefined) {
		// $('#searchBox_projects_su').val('');
		
		if (currentFilter) {
			var filterName = currentFilter.searchName
					? currentFilter.searchName
							.replace(' (Default)', '')
					: '';
							}
		data = {
			offset : offset || 1,
			limit : limit || 26,
			searchName : isSaveSearchCriteria?filterName:'',
			prjPhase : projectSearchObject.prjPhase,
			frmSearch : true,
			searchId : null,
			searchFrom : 1,
			isDefault : 0,
			caPrjId : $('#projectId_prj_filter').val().trim(),
			sapWbsCd : $('#sapWbsCode_prj_filter').val().trim(),
			projectName : $('#pjtName_prj_filter').val().trim(),
			lobType : ($('#projectType_prj_filter').val()
					? $('#projectType_prj_filter').val().join(',')
					: null),
			/*
			 * prjPhase : ($('#phase_prj_filter').val() ? $('#phase_prj_filter')
			 * .val().join(',') : null),
			 */
					projectScopeId : $('#pjtScope_prj_filter option:selected').val(),
					owner : ($('#owner_prj_filter').val()
							? $('#owner_prj_filter').val().join('`')
									: null),
					stateId : $('#state_prj_filter option:selected').val(),
					prjCompany : $('#company_prj_filter option:selected').val(),
					exchangeId : $('#exchange_prj_filter option:selected').val(),
					msegId : $('#marketSeg_prj_filter option:selected').val(),
			prjCrtdFrm : $('#createdFrom_prj_filter').val(),
			prjCrtdTo : $('#createdTo_prj_filter').val(),
			phaseDysFrm : $('#phaseDysFrm_prj_filter').val(),
			phaseDysTo : $('#phaseDysTo_prj_filter').val(),
			projectExpedite : $('#expedite_prj_filter').val(),
			sortFields:sortFieldValString,/*for multisort*/
		    sortOrders:sortOrderValString,
		    sortFlag:sortFlag
		};
	}
	// $('#page_projects_su').jqPagination({max_page : 0,current_page : 1});
	if (!init) {
		try {
			$('#'+projectSearchObject.pagination).jqPagination('destroy');
			if ($('#'+projectSearchObject.pagination).jqPagination('getParam', 'max_page') != 0) {
				$('#'+projectSearchObject.pagination).jqPagination('option', 'current_page',
						1, true);
			}
			$('#'+projectSearchObject.pagination)[0].status = false;
		} catch (err) {

		}
	}
	if (isGlobalSearch) {
		//$('#'+projectSearchObject.projectListFilter).val('');//only in stakedunit //TODO check
		data = {
			offset : offset || 1,
			limit : limit || 26,
			searchFrom : 1,
			searchFlag : 2,
			prjPhase : null,
			projectName : $('#'+projectSearchObject.globalSearchTextBox).val().trim(),
			sapWbsCd : $('#'+projectSearchObject.globalSearchTextBox).val().trim(),
			caPrjId:$('#'+projectSearchObject.globalSearchTextBox).val().trim(),
			projectId:!globalProjectSelectedObj?null:globalProjectSelectedObj.id
		}
		if(globalProjectSelectedObj)
		{
			globalProjectSelectedObj=null;
		}
	} else {
		$('#'+projectSearchObject.globalSearchTextBox).val('');
	}
	data['curScope'] = setCurrentModuleScope();
	if (projectListRequest && typeof projectListRequest.abort == 'function') {
		projectListRequest.abort();
	}
	projectListRequest = $.ajax({
				url : projectSearchObject.url,
				cache : false,
				async:false,
				data : projectSearchObject.data?projectSearchObject.data:data,
				success : function(response) {
					projectSearchObject.projectListDataArray.length = 0;
					$('#'+projectSearchObject.projectListFrame).html(response);
					if (!isGlobalSearch
							&& !$('#'+projectSearchObject.globalSearchTextBox).val()
							&& !$('#'+projectSearchObject.projectListFilter).val()) {
						currentFilter = data;
						if(!isSaveSearchCriteria)
						{
						currentFilter.filterId = '';
						}
					} else {
						currentFilter = null;
					}
					var totalCount = 0, pages = 0;
					if (projectSearchObject.projectListDataArray.length) {
						totalCount = projectSearchObject.projectListDataArray[0].totalCount;
						pages = Math.ceil(totalCount / 25);
					}
					if (!$('#'+projectSearchObject.pagination)[0].status) {
						$('#'+projectSearchObject.pagination).jqPagination({
							link_string : '/?page={page_number}',
							max_page : pages,
							paged : function(page) {
								if (page != 1) {
									page = ((page - 1) * 25) + 1;
								}
								redirectToGetProjects(page, 26, true,
										isGlobalSearch);
							}
						});
						$('#'+projectSearchObject.pagination)[0].status = true;
					}
					if (!isGlobalSearch && !$('#searchOptionsBox').hasClass('hidden')) {
						hideAdVancedSearchGrayBox();
					}
				}
			});
}

function findPrjectsearch(eventObj,offset, limit, init, isGlobalSearch, isSapWbs)
{
	if(eventObj.which == 13) {
		if(projectsSearchMode == 'hldrom'){
			getHldromProjects(offset, limit, init, isGlobalSearch, isSapWbs);
		}
		else if(projectsSearchMode == 'ispEngg'){
			getIspEngineeringProjects(offset, limit, init, isGlobalSearch, isSapWbs);
		}
		else if(projectsSearchMode == 'ipEng'){
			getIpEngineeringProjects(offset, limit, init, isGlobalSearch, isSapWbs);
		}
		else if(projectsSearchMode == 'cableR'){
			getCableRunningListProjects(offset, limit, init, isGlobalSearch, isSapWbs);
		}
		else if(projectsSearchMode == 'trnsln'){
			getTranslationsProjects(offset, limit, init, isGlobalSearch, isSapWbs);
		}
		else if(projectsSearchMode == 'circuitInfo'){
			getCircuitInformationProjects(offset, limit, init, isGlobalSearch, isSapWbs);
		}
		else{
			redirectToGetProjects(offset, limit, init, isGlobalSearch, isSapWbs);
		}
	}  
}