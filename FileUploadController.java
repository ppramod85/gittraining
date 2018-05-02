/* ****************************************************************************
 * Project Name : TDS-PCE
 * Author : Sikha
 * Creation Date : Jul 15, 2013
 * Reviewed By :
 * Review Date :
 * 
 * 
 * Copyright Notice
 * 
 * Copyright (c) 2013 IMMCO, Inc. All Rights Reserved.
 * This software is the confidential and proprietary information of IMMCO, Inc.
 * You shall not disclose or use Confidential information without the express
 * written agreement of IMMCO, Inc.
 * 
 * 
 * ****************************************************************************
 * Change History
 * 
 * Sl No. Modified Date Modified By Change Description
 * ---------------------------------------------------------------------------
 * 1.
 * 2.
 * 3.
 * ---------------------------------------------------------------------------
 * 
 * ****************************************************************************
 */
package com.immco.d3.web.ui;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;

import com.google.gson.Gson;
import com.immco.d2.web.utils.ReadExcelFile;
import com.immco.d3.web.model.MaterialUploadExcelAllDtls;
import com.immco.d3.web.model.MaterialUploadExcelMasterDtls;
import com.immco.d3.web.service.MaterialUploadService;

//TODO: Auto-generated Javadoc
/**
* << Handle request while uploading excel in Staked/Units >>
* 
* <h4>Description</h4>
* 
* 
* 
* <h4>Notes</h4>
* 
* 
* <h4>References</h4>.
* 
* @author sikha
* @version
* @see
*/

@Controller
public class FileUploadController
{
	@Autowired
	private MaterialUploadService materialUploadService;
	/** The Constant LOGGER. */
	private static final Logger LOGGER = LoggerFactory.getLogger(LoginHomeController.class);
	
	@RequestMapping(value = "/stakedUnit_generateExcel", method = RequestMethod.POST)
	@ResponseBody
	public 
	String generateExcelPanel(HttpServletRequest request, HttpServletResponse response,
            @RequestParam("file") MultipartFile file, @RequestParam("prjId") String prjId,  @RequestParam("conscompId") Integer consCompId, @RequestParam("contNm") String contNmAct, @RequestParam("contId") Integer contId,@RequestParam("caPrjId") String caPrjId,@RequestParam("inFrom") Integer inFrom, @ModelAttribute("ExcelData") MaterialUploadExcelAllDtls masterAllDlts) throws IOException, ServletException
	{
		List<MaterialUploadExcelAllDtls> reMaterialList=  new ArrayList<MaterialUploadExcelAllDtls>();
	LOGGER.info("loading stackedUnits_home----------------------------------&&"+prjId);
	
	
	//uploadFile upload = new uploadFile();
	
	MaterialUploadExcelMasterDtls masterDetail = new MaterialUploadExcelMasterDtls();
	if(inFrom==1)
	{	
	masterDetail = ReadExcelFile.readExcelData(file, prjId, consCompId, contNmAct, contId, caPrjId);
	}else
	{
		masterDetail = ReadExcelFile.readAsBuiltExcelData(file, prjId, consCompId, contNmAct, contId, caPrjId);
	}
	reMaterialList.clear();
	String msgValid = masterDetail.getMsgValidity();
	if(msgValid != null)
	{
		masterAllDlts.setMsgValidity(msgValid);
		reMaterialList.add(masterAllDlts);
		
	}
	else{
		
		reMaterialList=materialUploadService.uploadMaterial(masterDetail,inFrom);
		LOGGER.info("id in materials controller---------------------"+masterDetail.getRowCount());
		
		LOGGER.info("id in materials controller---------------------"+masterDetail.getSapWBSCodeVal());
		
	}
	return new Gson().toJson(reMaterialList);

	}
	

}