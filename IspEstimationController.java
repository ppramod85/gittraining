/* ****************************************************************************
 * Project Name  : TDS-PCE
 * Author        : Lakshmi Vijai
 * Creation Date : August 29 14, 2014
 * Reviewed By   :
 * Review Date   :
 *
 *
 * Copyright Notice
 *
 * Copyright (c) 2012 IMMCO, Inc. All Rights Reserved.
 * This software is the confidential and proprietary information of IMMCO, Inc.
 * You shall not disclose or use Confidential information without the express
 * written agreement of IMMCO, Inc.
 *
 *
 * ****************************************************************************
 *                          Change History
 *
 * Sl No.   Modified Date     Modified By       Change Description
 * ---------------------------------------------------------------------------
 *   1.
 *   2.
 *   3.
 * ---------------------------------------------------------------------------
 *
 *****************************************************************************
 */
package com.immco.d3.web.ui;



import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.joda.time.DateTime;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.google.gson.Gson;
import com.immco.d3.web.model.InsStatRef;
import com.immco.d3.web.model.IspLocationsModel;
import com.immco.d3.web.model.IspMaterial;
import com.immco.d3.web.model.IspMaterialManufacturerModel;
import com.immco.d3.web.model.IspMaterialsModel;
import com.immco.d3.web.model.MaterialDtlRef;
import com.immco.d3.web.model.ProjectDetails;
import com.immco.d3.web.model.PurchaseReqModel;
import com.immco.d3.web.model.QuoteModel;
import com.immco.d3.web.model.VendorModel;
import com.immco.d3.web.service.IspEstimationService;
import com.immco.d3.web.service.LocationsService;
import com.immco.pce.auth.SecurityService;
import com.itextpdf.text.log.SysoLogger;

@Controller
public class IspEstimationController {
	
	@Autowired
	private SecurityService securityService;
	
	@Autowired
	private IspEstimationService ispEstimationService;
	
	@Autowired
	private LocationsService locationsService; 
	
	private static final Logger LOGGER = LoggerFactory.getLogger(StakedUnitsController.class);
	
	@RequestMapping(value = "/ispMaterialProjects", method = RequestMethod.GET)
	public String ispLaborProjects(Locale locale,@ModelAttribute("IspMaterialsModel") IspMaterialsModel ispMaterialsModel)
	{
		LOGGER.info("entered in IspLabor------------------------------------------------------------------------------");
		return "IspEstimationMaterialProjectListHome";
	}
	@RequestMapping(value = "/ispMaterialEstimationView", method = RequestMethod.GET)
	public String ispMaterialEstimationView(Locale locale,@ModelAttribute("IspMaterialsModel") IspMaterialsModel ispMaterialsModel,@ModelAttribute("VendorModel") VendorModel vendorModel,@ModelAttribute("IspMaterialManufacturerModel") IspMaterialManufacturerModel  manufacturer,@ModelAttribute("IspLocationsModel") IspLocationsModel ispLocationsModel)
	{
		LOGGER.info("entered in ispMaterialEstimationView------------------------------------------------------------------------------");
	
		Long userId = securityService.getLoggedOnUserId();
        Map ispMaterialFamily=ispEstimationService.getEstimationDetails(ispMaterialsModel,userId);
        vendorModel.setOrder("VENDOR_NM ASC");
        List<VendorModel> vendorList=ispEstimationService.getVendorDtlList(vendorModel);
    	vendorModel.setVendorGridList(vendorList);
    	manufacturer.setOrder("MFR_NM ASC");
    	List<IspMaterialManufacturerModel> manufacturerList = ispEstimationService.getManufacturerListData(manufacturer);
    	
		manufacturer.setManufacturerList(manufacturerList);
		//List<StakedUnitsModel>stakedUnitsSummaryList=stakedUnitsService.getEstimationSummaryDetails(stakedUnitsModel,userId);
        List<ProjectDetails> headerList=(List<ProjectDetails>) ispMaterialFamily.get("REF_HDR");
		
		
		List<IspMaterialsModel> ispMaterialFamilyParentList=(List<IspMaterialsModel>) ispMaterialFamily.get("REF_DTL");
		ispMaterialsModel.setParentMaterialList(ispMaterialFamilyParentList);
		if(ispMaterialFamilyParentList.size()>0)
		{
			ispMaterialsModel.setEstId((Integer) ispMaterialFamilyParentList.get(0).getEstId());
			ispMaterialsModel.setCalcTrnId((Integer) ispMaterialFamilyParentList.get(0).getCalcTrnId());
		}
		List<QuoteModel> quoteDtl=(List<QuoteModel>) ispMaterialFamily.get("REF_QUOTE");
		
		List<PurchaseReqModel> prList=(List<PurchaseReqModel>) ispMaterialFamily.get("REF_PR");
	
       Map<Integer,List<IspMaterialsModel>>materialFamilyparentMap=new LinkedHashMap<Integer,List<IspMaterialsModel>>();
		
		for (IspMaterialsModel unit : ispMaterialFamilyParentList) {
			if(materialFamilyparentMap.get(unit.getLocationId()) != null){
				materialFamilyparentMap.get(unit.getLocationId()).add(unit);
			} else {
				List<IspMaterialsModel> units = new ArrayList<IspMaterialsModel>();
				units.add(unit);
				materialFamilyparentMap.put(unit.getLocationId(), units);
			}
		}
		Long prjId=new Long(ispMaterialsModel.getProjectId());
		Long locationId=ispLocationsModel.getLocationId();
		Map shippingLocationsMap = locationsService
				.populateShippingLocationsData(locationId,prjId);

		List<IspLocationsModel> mappedShippingLocationsList = (List<IspLocationsModel>) shippingLocationsMap
				.get("o_mapped_lst");
		List<IspLocationsModel> spareLocationList = (List<IspLocationsModel>) shippingLocationsMap
				.get("o_spare_loc_lst");
		ispLocationsModel.setMappedShippingLocationsList(mappedShippingLocationsList);
		ispLocationsModel.setSpareLocationList(spareLocationList);
		
DateTime date=new DateTime();
List<Integer> yearList=new ArrayList<Integer>();
yearList.add(date.getYear());
yearList.add(date.getYear()+1);
		ispMaterialsModel.setMaterialFamilyMap(materialFamilyparentMap);
		ispMaterialsModel.setQuoteDtl(quoteDtl);
		ispMaterialsModel.setProjectDtls(headerList);
		ispMaterialsModel.setYearList(yearList);
		ispMaterialsModel.setPrList(prList);
		//System.out.println(ispMaterialsModel.getMaterialFamilyMap().size()+"sizeeeeeeeee");
		return "ispMaterialEstimationView";
	}
	@RequestMapping(value = "/getMappedLocations", method = RequestMethod.GET)
	@ResponseBody
	public List<IspLocationsModel> getMappedLocations(Locale locale,@ModelAttribute("IspLocationsModel") IspLocationsModel ispLocationsModel)
	{
		Long prjId=new Long(0);
		Long locationId=ispLocationsModel.getLocationId(); 
		Map shippingLocationsMap = locationsService
				.populateShippingLocationsData(locationId,prjId);

		List<IspLocationsModel> mappedShippingLocationsList = (List<IspLocationsModel>) shippingLocationsMap
				.get("o_mapped_lst");
		ispLocationsModel.setMappedShippingLocationsList(mappedShippingLocationsList);
		
		return mappedShippingLocationsList;
	}
	@RequestMapping(value = "/ispMaterialEstimationAdd", method = RequestMethod.GET)
	public String ispMaterialEstimationAdd(Locale locale,@ModelAttribute("IspMaterialsModel") IspMaterialsModel ispMaterialsModel)
	{
		LOGGER.info("entered in ispMaterialEstimationAdd------------------------------------------------------------------------------");
		return "addMaterialFamily";
	}
	

@RequestMapping(value = "/ispMaterialChildView", method = RequestMethod.GET)
public String ispMaterialChildView(Locale locale,@ModelAttribute("IspMaterialsModel") IspMaterialsModel ispMaterialsModel,HttpServletRequest request)
{
	LOGGER.info("entered in ispMaterialChildView------------------------------------------------------------------------------");

	Long userId = securityService.getLoggedOnUserId();
    Map ispMaterialFamily=ispEstimationService.getEstimationDetails(ispMaterialsModel,userId);
	
	//List<StakedUnitsModel>stakedUnitsSummaryList=stakedUnitsService.getEstimationSummaryDetails(stakedUnitsModel,userId);
List<ProjectDetails> headerList=(List<ProjectDetails>) ispMaterialFamily.get("REF_HDR");
	
	
	List<IspMaterialsModel> ispMaterialFamilyChildList=(List<IspMaterialsModel>) ispMaterialFamily.get("REF_DTL");
	ispMaterialsModel.setParentMaterialList(ispMaterialFamilyChildList);
	


	

	DateTime date=new DateTime();
	
	
	
	Map<Integer, IspMaterialsModel> parents = new HashMap<Integer, IspMaterialsModel>();
	List<IspMaterialsModel> rootList = new ArrayList<IspMaterialsModel>();
	
	 for (IspMaterialsModel isspMaterialsModel : ispMaterialFamilyChildList) {
		 IspMaterialsModel node = new IspMaterialsModel();
	
			 node=isspMaterialsModel;
			 parents.put(node.getCalcDtlTrnId(), node);
			
	 } 
	 for (IspMaterialsModel isspMaterialsModel : ispMaterialFamilyChildList) {
	      int id = isspMaterialsModel.getCalcDtlTrnId();
	      if(isspMaterialsModel.getIsSpare()==0){
            if (isspMaterialsModel.getLvl()==1) {
                rootList.add(parents.get(id));
            } else {
            	
                parents.get(isspMaterialsModel.getParentId()).getChildren()
                        .add(parents.get(id));
            }
	      }
            parents.put(parents.get(id).getCalcDtlTrnId(), parents.get(id));
	 } 
	 
	
	 List<Integer> yearList=new ArrayList<Integer>();
	 yearList.add(date.getYear());
	 yearList.add(date.getYear()+1);
	 ispMaterialsModel.setYearList(yearList);
	 ispMaterialsModel.setMaterialFamilyList(rootList);
	 request.setAttribute("child",rootList.get(0));
		
	
	
	
	return "materialFamilyChild";
}


@RequestMapping(value = "/getmaterialFamilyList", method = RequestMethod.GET)
public String getmaterialFamilyList(Locale locale, @ModelAttribute("IspMaterialsModel") IspMaterialsModel ispMaterialsModel)
{
	Long userId = securityService.getLoggedOnUserId();
	List<IspMaterialsModel> materialFamilyList=ispEstimationService.getMaterialsFamilyGridList(userId,ispMaterialsModel);
	ispMaterialsModel.setMaterialFamilyGridList(materialFamilyList);
	return "ispMaterialFamilyList";
	
}


@RequestMapping(value = "/addMaterialFamily", method = RequestMethod.GET)
public String getMaterialFamilyDetails(Locale locale, @ModelAttribute("IspMaterialsModel") IspMaterialsModel ispMaterialsModel,HttpServletRequest request) {
	LOGGER.info("entered in getMaterialFamilyDetails------------------------------------------------------------------------------");
	Long userId = securityService.getLoggedOnUserId();
	List<IspMaterialsModel> materialFamilyList=ispEstimationService.getMaterialsFamilyGridList(userId,ispMaterialsModel);

	ispMaterialsModel.setMaterialFamilyGridList(materialFamilyList);
	long i=0;
	 DateTime date=new DateTime();
	Map<Integer, IspMaterialsModel> parents = new HashMap<Integer, IspMaterialsModel>();
	List<IspMaterialsModel> rootList = new ArrayList<IspMaterialsModel>();
	 for (IspMaterialsModel isspMaterialsModel : materialFamilyList) {
		 IspMaterialsModel node = new IspMaterialsModel();
		 isspMaterialsModel.setKeyId(date.getMillis()+i);
			 node=isspMaterialsModel;
			 parents.put(node.getId(), node);
			 i++;
	 } 
	 long mergekey=0;
	 for (IspMaterialsModel isspMaterialsModel : materialFamilyList) {
	      int id = isspMaterialsModel.getId();
            if (isspMaterialsModel.getLvl()==1) {
            	isspMaterialsModel.setParentKey( ispMaterialsModel.getParentKey());
            	if(ispMaterialsModel.getLvl().equals(0))
            	{
            	mergekey=0;
            	}
            	else
            	{
            		mergekey=isspMaterialsModel.getKeyId();
            	}
            	isspMaterialsModel.setMergeKey(mergekey);
            	
                rootList.add(parents.get(id));
            	
            } else {
            	isspMaterialsModel.setParentKey( parents.get(isspMaterialsModel.getParentId()).getKeyId());
            	isspMaterialsModel.setMergeKey(mergekey);
                parents.get(isspMaterialsModel.getParentId()).getChildren()
                        .add(parents.get(id));
            }
            
            parents.put(parents.get(id).getId(), parents.get(id));
	 } 
	
	 List<Integer> yearList=new ArrayList<Integer>();
	 yearList.add(date.getYear());
	 yearList.add(date.getYear()+1);
	 ispMaterialsModel.setYearList(yearList);
	 ispMaterialsModel.setMaterialFamilyList(rootList);
	 
	 request.setAttribute("child",rootList.get(0));
	 ispMaterialsModel.setParentFlag(1);;
	// ispMaterialsModel.setRequiredList(requiredList);
	return "materialFamilyChild";
}
@RequestMapping(value = "/ispPurchaseRequestAdd", method = RequestMethod.GET)
public String ispPurchaseRequestAdd(Locale locale,Model model)
{
	LOGGER.info("entered in ispPurchaseRequestAdd------------------------------------------------------------------------------");
	return "addPurchaseRequest";
}
@RequestMapping(value = "/getMaterialVendorList", method = RequestMethod.GET)
@ResponseBody
public List<VendorModel> getMaterialVendorList(Locale locale, @ModelAttribute("VendorModel") VendorModel vendorModel)
{
	Long userId = securityService.getLoggedOnUserId();
	List<VendorModel> materialVendorList=ispEstimationService.getMaterialVendorList(vendorModel.getMaterialId());
	//vendorModel.setMaterialFamilyGridList(materialFamilyList);
	return materialVendorList;
	
	
}

@RequestMapping(value = "/attachQuotesScreen", method = RequestMethod.GET)
public String attachQuotesScreen(Locale locale,@ModelAttribute("QuoteModel") QuoteModel quoteModel,String data)
{
	QuoteModel quoteModel1  = new Gson().fromJson(data, QuoteModel.class);
	quoteModel.setQuoteList(quoteModel1.getQuoteList());
	quoteModel.setQuoteAttachedCount(quoteModel1.getQuoteAttachedCount());
	quoteModel.setCalcId(quoteModel1.getCalcId());
	LOGGER.info("entered in addQuotesScreen------------------------------------------------------------------------------");
	return "attachQuotes";
}
@RequestMapping(value = "/addQuotesScreen", method = RequestMethod.GET)
public String addQuotesScreen(Locale locale,@ModelAttribute("VendorModel") VendorModel vendorModel)
{
	vendorModel.setOrder("VENDOR_NM ASC");
	List<VendorModel> vendorList=ispEstimationService.getVendorDtlList(vendorModel);
	vendorModel.setVendorGridList(vendorList);
	LOGGER.info("entered in addQuotesScreen------------------------------------------------------------------------------");
	return "addQuotes";
}
@RequestMapping(value = "/ispSaveTemp", method = RequestMethod.GET)
public String ispSaveTemp(Locale locale,Model model)
{
	LOGGER.info("entered in ispSaveTemp------------------------------------------------------------------------------");
	return "saveTemplate";
}
@RequestMapping(value = "/saveMatEstimationTemplate", method = RequestMethod.POST)
@ResponseBody 
public InsStatRef saveMaterialFamily(Locale locale, @ModelAttribute("IspMaterialsModel") IspMaterialsModel ispMaterialsModel,String data)
{
	LOGGER.info("saveMaterialFamily----------------------------------");
	ispMaterialsModel = new Gson().fromJson(data, IspMaterialsModel.class);
	Long userId = securityService.getLoggedOnUserId();
	InsStatRef status=new InsStatRef();
	status=ispEstimationService.saveEstimationTemplate(ispMaterialsModel,userId);
	return status;
}
@RequestMapping(value = "/ispMaterialEstimationTemplateScreen", method = RequestMethod.GET)
public String ispMaterialEstimationTemplateScreen(Locale locale,Model model)
{
	LOGGER.info("entered in ispMaterialEstimationTemplateScreen------------------------------------------------------------------------------");
	return "copyIspMatEstTemplate";
}
@RequestMapping(value = "/getMaterialTemplateList", method = RequestMethod.GET)
public String getMaterialTemplateList(Locale locale, @ModelAttribute("IspMaterialsModel") IspMaterialsModel ispMaterialsModel)
{
	List<IspMaterialsModel> materialTemplateList=ispEstimationService.getMaterialsTemplateList(ispMaterialsModel);
	ispMaterialsModel.setTemplateList(materialTemplateList);
	return "ispMaterialTemplateList";
	
}
@RequestMapping(value = "/addTemplate", method = RequestMethod.GET)
public String addTemplate(Locale locale, @ModelAttribute("IspMaterialsModel") IspMaterialsModel ispMaterialsModel,HttpServletRequest request) {
	
	Long userId = securityService.getLoggedOnUserId();
	List<IspMaterialsModel> materialFamilyList=ispEstimationService.getMaterialsTemplateDetails(ispMaterialsModel);

	ispMaterialsModel.setMaterialFamilyGridList(materialFamilyList);
	long i=0;
	 DateTime date=new DateTime();
	Map<Integer, IspMaterialsModel> parents = new HashMap<Integer, IspMaterialsModel>();
	List<IspMaterialsModel> rootList = new ArrayList<IspMaterialsModel>();
	 for (IspMaterialsModel isspMaterialsModel : materialFamilyList) {
		 IspMaterialsModel node = new IspMaterialsModel();
		 isspMaterialsModel.setKeyId(date.getMillis()+i);
			 node=isspMaterialsModel;
			 parents.put(node.getId(), node);
			 i++;
	 } 
	 long mergekey=0;
	 for (IspMaterialsModel isspMaterialsModel : materialFamilyList) {
	      int id = isspMaterialsModel.getId();
            if (isspMaterialsModel.getLvl()==1) {
            	isspMaterialsModel.setParentKey( ispMaterialsModel.getParentKey());
            //	mergekey=isspMaterialsModel.getKeyId();
            //	isspMaterialsModel.setMergeKey(mergekey);
            	if(!ispMaterialsModel.getLvl().equals(0))
            	{
            		mergekey=isspMaterialsModel.getKeyId();
            		isspMaterialsModel.setMergeKey(mergekey);
            	}
                rootList.add(parents.get(id));
            	
            } else {
            	isspMaterialsModel.setParentKey( parents.get(isspMaterialsModel.getParentId()).getKeyId());
            	if(!ispMaterialsModel.getLvl().equals(0)&& (isspMaterialsModel.getMergeKey().equals((Long)(long)0)))
            	{
            		
            		isspMaterialsModel.setMergeKey(mergekey);
            	}
            //	isspMaterialsModel.setMergeKey(mergekey);
                parents.get(isspMaterialsModel.getParentId()).getChildren()
                        .add(parents.get(id));
            }
            
            parents.put(parents.get(id).getId(), parents.get(id));
	 } 
	
	 List<Integer> yearList=new ArrayList<Integer>();
	 yearList.add(date.getYear());
	 yearList.add(date.getYear()+1);
	 ispMaterialsModel.setYearList(yearList);
	 ispMaterialsModel.setMaterialFamilyList(rootList);
	 
	 request.setAttribute("child",rootList.get(0));
	 ispMaterialsModel.setParentFlag(1);;
	// ispMaterialsModel.setRequiredList(requiredList);
	return "materialFamilyChild";
}

@RequestMapping(value = "/getMaterialVendors", method = RequestMethod.GET)
@ResponseBody
public VendorModel getMaterialVendors(Locale locale, @ModelAttribute("VendorModel") VendorModel vendorModel)
{
	vendorModel.setOrder("VENDOR_NM ASC");
	List<VendorModel> vendorList=ispEstimationService.getVendorDtlList(vendorModel);
vendorModel.setVendorGridList(vendorList);
	return vendorModel;
	
	
}
@RequestMapping(value = "/getmanufacturerList", method = RequestMethod.GET)
@ResponseBody
public IspMaterialManufacturerModel getmanufacturerList(Locale locale, @ModelAttribute("IspMaterialManufacturerModel") IspMaterialManufacturerModel manufacturer)
{
	manufacturer.setOrder("MFR_NM ASC");
	List<IspMaterialManufacturerModel> manufacturerList = ispEstimationService.getManufacturerListData(manufacturer);

			manufacturer.setManufacturerList(manufacturerList);

	return manufacturer;
	
	
}
@RequestMapping(value = "/ispMaterialPr", method = RequestMethod.GET)
public String ispMaterialPr(Locale locale,@ModelAttribute("IspMaterialsModel") IspMaterialsModel ispMaterialsModel,HttpServletRequest request)
{
	LOGGER.info("entered in ispMaterialChildView------------------------------------------------------------------------------");

	Long userId = securityService.getLoggedOnUserId();
    Map ispMaterialFamily=ispEstimationService.getEstimationDetails(ispMaterialsModel,userId);
	
	//List<StakedUnitsModel>stakedUnitsSummaryList=stakedUnitsService.getEstimationSummaryDetails(stakedUnitsModel,userId);

	
	
	List<IspMaterialsModel> ispMaterialFamilyChildList=(List<IspMaterialsModel>) ispMaterialFamily.get("REF_DTL");
	ispMaterialsModel.setParentMaterialList(ispMaterialFamilyChildList);
	


	

	DateTime date=new DateTime();
	
	
	

	 
	
	 List<Integer> yearList=new ArrayList<Integer>();
	 yearList.add(date.getYear());
	 yearList.add(date.getYear()+1);
	 ispMaterialsModel.setYearList(yearList);

		
	
	
	
	return "ispEstMaterialFamilyParent";
}

@RequestMapping(value = "/quoteAttchedCheck", method = RequestMethod.GET)
@ResponseBody
public QuoteModel quoteAttchedCheck(Locale locale, @ModelAttribute("IspMaterialsModel") IspMaterialsModel ispMaterialsModel)
{
	QuoteModel quoteModel = ispEstimationService.quoteAttchedCheck(ispMaterialsModel);

		

	return quoteModel;
	
	
}
@RequestMapping(value = "/saveIspEstimation", method = RequestMethod.POST)
@ResponseBody
public InsStatRef saveIspEstimation(Locale locale, @ModelAttribute("IspMaterialsModel") IspMaterialsModel ispMaterialsModel, @ModelAttribute("QuoteModel") QuoteModel quoteModel,@ModelAttribute("PurchaseReqModel") PurchaseReqModel purchaseReqModel,String data)
{
	LOGGER.info("saving estimation----------------------------------");
	ispMaterialsModel = new Gson().fromJson(data, IspMaterialsModel.class);
	quoteModel= new Gson().fromJson(data, QuoteModel.class);
	purchaseReqModel= new Gson().fromJson(data, PurchaseReqModel.class);
	Long userId = securityService.getLoggedOnUserId();
	InsStatRef ref=ispEstimationService.saveIspEstimation(ispMaterialsModel,quoteModel,purchaseReqModel,userId);
	return ref;
}
@RequestMapping(value = "/quoteAttachedMaterials", method = RequestMethod.POST)
public String quoteAttachedMaterials(Locale locale,@ModelAttribute("QuoteModel") QuoteModel quoteModel,String data,@ModelAttribute("IspMaterialsModel") IspMaterialsModel ispMaterialsModel)
{
	QuoteModel quoteModel1  = new Gson().fromJson(data, QuoteModel.class);
	quoteModel1.setQuoteAttachedMaterials(quoteModel1.getQuoteAttachedMaterials());
	quoteModel.setQuoteAttachedMaterials(quoteModel1.getQuoteAttachedMaterials());
	ispMaterialsModel.setQuoteRemovedList(quoteModel1.getQuoteRemovedList());
	List<IspMaterialsModel>  quoteAttachedmaterials = ispEstimationService.quoteAttachedMaterials(ispMaterialsModel,quoteModel1);
	ispMaterialsModel.setMaterials(quoteAttachedmaterials);
	LOGGER.info("entered in quoteAttachedMaterials------------------------------------------------------------------------------");
	return "quoteAttachedMaterials";
}
/*@RequestMapping(value = "/ispEstOverheadsProjects", method = RequestMethod.GET)
public String ispOverheadsProjects(Locale locale,Model model)
{
	LOGGER.info("entered in IspEstimationOvrhds------------------------------------------------------------------------------");
	return "IspEstimationOverheadsProjectListHome";
}*/

/*@RequestMapping(value = "/checkTempDuplication", method = RequestMethod.GET)
@ResponseBody
public IspMaterialsModel checkTempDuplication(Locale locale, @ModelAttribute("IspMaterialsModel") IspMaterialsModel ispMaterialsModel)
{
	IspMaterialsModel ispMaterialsModel = ispEstimationService.quoteAttchedCheck(ispMaterialsModel);

		

	return quoteModel;
	
	
}*/

@RequestMapping(value = "/ispPurchaseRequestDelete", method = RequestMethod.GET)
public String ispPurchaseRequestDelete(Locale locale,@ModelAttribute("PurchaseReqModel") PurchaseReqModel purchaseReqModel,String data)
{
	PurchaseReqModel purchaseReqModel1  = new Gson().fromJson(data, PurchaseReqModel.class);
	 purchaseReqModel.setPrList(purchaseReqModel1.getPrList());
	return "purchaseRequestDelete";
}
@RequestMapping(value = "/getQuoteLocation", method = RequestMethod.GET)
@ResponseBody
public List<QuoteModel>  getQuoteLocation(Locale locale, @ModelAttribute("IspMaterialsModel") IspMaterialsModel ispMaterialsModel)
{
	List<QuoteModel>  quoteList = ispEstimationService.getQuoteLocation(ispMaterialsModel);

		

	return quoteList;
	
	
}
@RequestMapping(value = "/showSpareListWindowScreen", method = RequestMethod.GET)
public String showSpareListWindowScreen(Locale locale,@ModelAttribute("IspMaterialsModel") IspMaterialsModel ispMaterialsModel)
{
	LOGGER.info("entered in ispMaterialEstimationAdd------------------------------------------------------------------------------");
	return "spareMaterialGridPopup";
}

@RequestMapping(value = "/ispSparedMaterialGridList", method = RequestMethod.GET)
@ResponseBody
public MaterialDtlRef ispSparedMaterialGridList(Locale locale, @ModelAttribute("MaterialDtlRef") MaterialDtlRef materialDtlRef) {
	
	Long userId = securityService.getLoggedOnUserId();
	List<IspMaterialsModel> materialDtlList=ispEstimationService.getIspSparedMaterialGridList(materialDtlRef,userId);
	materialDtlRef.setIspSpareMaterialDtlList(materialDtlList);
	
	return materialDtlRef;
}
}