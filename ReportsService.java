/* ****************************************************************************
 * Project Name  : TDS-PCE
 * Author        : Midhila Mohan
 * Creation Date : May 30, 2014
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
package com.immco.d3.web.service;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.text.DecimalFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import net.sf.jasperreports.engine.JRDataSource;
import net.sf.jasperreports.engine.JRException;
import net.sf.jasperreports.engine.JasperCompileManager;
import net.sf.jasperreports.engine.JasperFillManager;
import net.sf.jasperreports.engine.JasperPrint;
import net.sf.jasperreports.engine.JasperReport;
import net.sf.jasperreports.engine.data.JRBeanCollectionDataSource;
import net.sf.jasperreports.engine.design.JasperDesign;
import net.sf.jasperreports.engine.export.JRPdfExporter;
import net.sf.jasperreports.engine.export.JRPdfExporterParameter;
import net.sf.jasperreports.engine.export.JRXlsExporter;
import net.sf.jasperreports.engine.export.JRXlsExporterParameter;
import net.sf.jasperreports.engine.xml.JRXmlLoader;
import net.sf.jxls.transformer.XLSTransformer;

import org.apache.poi.common.usermodel.Hyperlink;
import org.apache.poi.hssf.usermodel.HSSFCellStyle;
import org.apache.poi.hssf.usermodel.HSSFHyperlink;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.hssf.util.CellRangeAddress;
import org.apache.poi.hssf.util.HSSFRegionUtil;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.CreationHelper;
import org.apache.poi.ss.usermodel.DataValidation;
import org.apache.poi.ss.usermodel.DataValidationConstraint;
import org.apache.poi.ss.usermodel.DataValidationHelper;
import org.apache.poi.ss.usermodel.Font;
import org.apache.poi.ss.usermodel.IndexedColors;
import org.apache.poi.ss.usermodel.Name;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.util.CellRangeAddressList;
import org.apache.poi.xssf.usermodel.XSSFHyperlink;
import org.joda.time.DateTime;
import org.joda.time.format.DateTimeFormat;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.immco.d2.web.utils.GeneralUtils;
import com.immco.d3.web.model.CalculatorModel;
import com.immco.d3.web.model.CalculatorReportModel;
import com.immco.d3.web.model.CostPerMileReportModel;
import com.immco.d3.web.model.ISPMaterialsReportDetails;
import com.immco.d3.web.model.IspEstimationsRepModel;
import com.immco.d3.web.model.IspMaterialsModel;
import com.immco.d3.web.model.LookUp;
import com.immco.d3.web.model.OverHeadList;
import com.immco.d3.web.model.OverHeadsModel;
import com.immco.d3.web.model.OverheadTreeNode;
import com.immco.d3.web.model.PriceListDetails;
import com.immco.d3.web.model.ProjectDetails;
import com.immco.d3.web.model.ProjectReportModel;
import com.immco.d3.web.model.QuoteModel;
import com.immco.d3.web.model.SOWReportDetails;
import com.immco.d3.web.model.StakedUnitsModel;
import com.immco.d3.web.repository.PriceListRepository;
import com.immco.d3.web.repository.ReportsRepository;
import com.immco.d3.web.repository.UtilsRepository;
import com.immco.pce.auth.SecurityService;

@Service
@Transactional
public class ReportsService {

	@Autowired
	private ReportsRepository reportsRepository;

	@Autowired
	private PriceListRepository priceListRepository;

	@Autowired
	private SecurityService securityService;

	@Autowired
	private UtilsRepository utilsRepository;

	@Value("${pce.excel.path}")
	private String excelPath;
	private static final String sowMaterialExcelPath = "reports/isp-reports/Purchase-Requisition.xls";

	private static final String FORMAT = "%s.%s";
	private static final String DATEFORMAT = "MM-dd-YY";
	private static final int BUFFERSIZE = 10240;
	private static final String CONTENT_DISPOSITION = "Content-disposition";
	private static final int ISP_REPORT_CONTENT_ROW_NO = 41;
	/*
	 * @Autowired private SecurityService securityService;
	 */

	/** The Constant LOGGER. */
	private static final Logger LOGGER = LoggerFactory
			.getLogger(ReportsService.class);

	public void generateEstVsActualReport(ProjectDetails projectDetails,
			HttpServletRequest request, HttpServletResponse response,
			String fromWhere) throws IOException {
		InputStream inputStream = null;

		String filename = null;

		// }
		if (fromWhere.equalsIgnoreCase("stat")) {
			inputStream = request.getSession(false).getServletContext()

			.getResourceAsStream("/reports/StatisticsReport.jrxml");
			filename = String.format(
					FORMAT,
					"StatisticsReport"
							+ DateTimeFormat.forPattern(DATEFORMAT).print(
									new DateTime()), "xls");
		} else {
			inputStream = request.getSession(false).getServletContext()

			.getResourceAsStream("/reports/EstimationVsActualReport.jrxml");
			filename = String.format(
					FORMAT,
					"EstimationVsActualReport"
							+ DateTimeFormat.forPattern(DATEFORMAT).print(
									new DateTime()), "xls");
		}
		String url = request.getRequestURL().toString();
		url = url.replace(request.getServletPath(),
				"/resources/css/login/images/tdslogo.png");

		OutputStream outputStream = null;
		LOGGER.debug("--generateEstVsActualReport--"
				+ projectDetails.getStateId() + "----"
				+ projectDetails.getConsCompId() + "----"
				+ projectDetails.getExchangeId() + "----"
				+ projectDetails.getPrjCrtdFrm() + "----"
				+ projectDetails.getPrjCrtdTo());
		// Long userId = securityService.getLoggedOnUserId();
		
		
		List<StakedUnitsModel> stakedUnitsList = reportsRepository
				.generateEstVsActualReport(projectDetails.getStateId(),
						projectDetails.getConsCompId(), projectDetails
								.getExchangeId(), projectDetails
								.getPrjCrtdFrm().length() == 0 ? null
								: projectDetails.getPrjCrtdFrm(),
						projectDetails.getPrjCrtdTo().length() == 0 ? null
								: projectDetails.getPrjCrtdTo());
		
		SimpleDateFormat format = new SimpleDateFormat("MM/dd/yyyy");
		String fromdT = projectDetails.getPrjCrtdFrm().length() == 0 ? null
				: projectDetails.getPrjCrtdFrm();
		String todT = projectDetails.getPrjCrtdTo().length() == 0 ? format
				.format(new Date()) : projectDetails.getPrjCrtdTo();

		String duration = null;
		if (fromdT == null) {
			duration = "Till date " + todT;
		} else {
			duration = "For the period " + fromdT + " to " + todT;
		}
		LOGGER.debug("duration-----------" + duration);

		// if (stakedUnitsList.size() > 0) {

		try {
			Double grandTotAsbuilt = 0.0;
			Double grandTotStaked = 0.0;
			for (int i = 0; i < stakedUnitsList.size(); i++) {
				// stakedUnitsList.get(i).setLogo(url.toString());
				grandTotAsbuilt += stakedUnitsList.get(i).getTotAsbuilt();
				grandTotStaked += stakedUnitsList.get(i).getTotStaked();
			}

			Double percentageDiff = (grandTotStaked == 0) ? 0.0
					: ((grandTotAsbuilt - grandTotStaked) / grandTotStaked) * 100;

			Map parameterMap = new HashMap();
			parameterMap.put("logo", url.toString());
			parameterMap.put("reportDuration", duration);
			parameterMap.put("grandDiffPercent", percentageDiff);
			JRDataSource jrDataSource = new JRBeanCollectionDataSource(
					stakedUnitsList);
			JasperDesign jasperdesign = JRXmlLoader.load(inputStream);
			JasperReport jasperreport = JasperCompileManager
					.compileReport(jasperdesign);

			JasperPrint jasperPrint = JasperFillManager.fillReport(
					jasperreport, parameterMap, jrDataSource);

			response.reset();
			response.setBufferSize(BUFFERSIZE);

			response.setContentType("application/vnd.ms-excel");
			response.setHeader(CONTENT_DISPOSITION, "attachment; filename="
					+ filename);
			response.setHeader("Cache-Control", "private");
			response.setDateHeader("Expires", 0);
			ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
			JRXlsExporter exporterXLS = new JRXlsExporter();
			outputStream = response.getOutputStream();
			exporterXLS.setParameter(JRXlsExporterParameter.JASPER_PRINT,
					jasperPrint);
			exporterXLS.setParameter(JRXlsExporterParameter.OUTPUT_STREAM,
					byteArrayOutputStream);

			exporterXLS.exportReport();

			outputStream.write(byteArrayOutputStream.toByteArray());

			outputStream.flush();
			outputStream.close();

		} catch (JRException e) {
			LOGGER.error(e.getMessage(), e);

		}
		// }
	}

	public void generateEmpPerformanceReport(ProjectDetails projectDetails,
			HttpServletRequest request, HttpServletResponse response)
			throws IOException {
		InputStream inputStream = null;

		String filename = null;
		filename = String.format(FORMAT, "EmployeePerformanceReport"
				+ DateTimeFormat.forPattern(DATEFORMAT).print(new DateTime()),
				"xls");
		// }

		inputStream = request
				.getSession(false)
				.getServletContext()
				.getResourceAsStream("/reports/EmployeePerformanceReport.jrxml");

		String url = request.getRequestURL().toString();
		url = url.replace(request.getServletPath(),
				"/resources/css/login/images/tdslogo.png");

		OutputStream outputStream = null;
		List<StakedUnitsModel> stakedUnitsList = null;
		
	
		// Long userId = securityService.getLoggedOnUserId();
		stakedUnitsList = reportsRepository
				.generateEmpPerformanceReport(
						projectDetails.getStateId(),
						projectDetails.getConsCompId(),
						projectDetails.getExchangeId(),
						projectDetails.getPrjCrtdFrm().trim().length() == 0 ? null
								: projectDetails.getPrjCrtdFrm(),
						projectDetails.getPrjCrtdTo().trim().length() == 0 ? null
								: projectDetails.getPrjCrtdTo(), projectDetails
								.getOspeOwner().trim().length() == 0 ? null
							: projectDetails.getOspeOwner());
		
		LOGGER.info("stakedUnitsList-------------" + stakedUnitsList.size());
		SimpleDateFormat format = new SimpleDateFormat("MM/dd/yyyy");
		String fromdT = projectDetails.getPrjCrtdFrm().length() == 0 ? null
				: projectDetails.getPrjCrtdFrm();
		String todT = projectDetails.getPrjCrtdTo().length() == 0 ? format
				.format(new Date()) : projectDetails.getPrjCrtdTo();

		String duration = null;
		if (fromdT == null) {
			duration = "Till date " + todT;
		} else {
			duration = "For the period " + fromdT + " to " + todT;
		}
		LOGGER.info("duration-----------" + duration);
		// if (stakedUnitsList.size() > 0) {
		try {
			Double grandTotAsbuilt = 0.0;
			Double grandTotStaked = 0.0;
			for (int i = 0; i < stakedUnitsList.size(); i++) {
				grandTotAsbuilt += stakedUnitsList.get(i).getTotAsbuilt();
				grandTotStaked += stakedUnitsList.get(i).getTotStaked();
			}

			Double percentageDiff = (grandTotStaked == 0) ? 0.0
					: ((grandTotAsbuilt - grandTotStaked) / grandTotStaked) * 100;

			Map parameterMap = new HashMap();
			parameterMap.put("logo", url.toString());
			parameterMap.put("reportDuration", duration);
			parameterMap.put("grandDiffPercent", percentageDiff);

			JRDataSource jrDataSource = new JRBeanCollectionDataSource(
					stakedUnitsList);
			JasperDesign jasperdesign = JRXmlLoader.load(inputStream);
			JasperReport jasperreport = JasperCompileManager
					.compileReport(jasperdesign);

			JasperPrint jasperPrint = JasperFillManager.fillReport(
					jasperreport, parameterMap, jrDataSource);

			response.reset();
			response.setBufferSize(BUFFERSIZE);

			response.setContentType("application/vnd.ms-excel");
			response.setHeader(CONTENT_DISPOSITION, "attachment; filename="
					+ filename);
			response.setHeader("Cache-Control", "private");
			response.setDateHeader("Expires", 0);
			ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
			JRXlsExporter exporterXLS = new JRXlsExporter();
			outputStream = response.getOutputStream();
			exporterXLS.setParameter(JRXlsExporterParameter.JASPER_PRINT,
					jasperPrint);
			exporterXLS.setParameter(JRXlsExporterParameter.OUTPUT_STREAM,
					byteArrayOutputStream);

			exporterXLS.exportReport();

			outputStream.write(byteArrayOutputStream.toByteArray());

			outputStream.flush();
			outputStream.close();

		} catch (JRException e) {
			LOGGER.error(e.getMessage(), e);

		}
		// }
	}

	public void generateCostPerMileReport(ProjectDetails prjDetails,
			HttpServletRequest request, HttpServletResponse response)
			throws IOException {
		InputStream inputStream = null;

		String filename = null;

		// }
		if (prjDetails.getExpenseBy() == 0) {
			inputStream = request.getSession(false).getServletContext()

			.getResourceAsStream("/reports/CostPerMileReportByConsCntr.jrxml");
		} else {
			inputStream = request.getSession(false).getServletContext()

			.getResourceAsStream("/reports/CostPerMileReportByPrjType.jrxml");
		}
		filename = String.format(FORMAT, "CostPerMileReport"
				+ DateTimeFormat.forPattern(DATEFORMAT).print(new DateTime()),
				"xls");

		String url = request.getRequestURL().toString();
		url = url.replace(request.getServletPath(),
				"/resources/css/login/images/tdslogo.png");

		OutputStream outputStream = null;

		List<CostPerMileReportModel> costPerMileReportModellist = reportsRepository
				.generateCostPerMileReport(prjDetails.getStateId(),prjDetails.getConsCompId(),
						prjDetails.getExchangeId(),
						prjDetails.getPrjCrtdFrm().length() == 0 ? null
								: prjDetails.getPrjCrtdFrm(), prjDetails
								.getPrjCrtdTo().length() == 0 ? null
								: prjDetails.getPrjCrtdTo(), prjDetails
								.getExpenseBy());
		SimpleDateFormat format = new SimpleDateFormat("MM/dd/yyyy");
		String fromdT = prjDetails.getPrjCrtdFrm().length() == 0 ? null
				: prjDetails.getPrjCrtdFrm();
		String todT = prjDetails.getPrjCrtdTo().length() == 0 ? format
				.format(new Date()) : prjDetails.getPrjCrtdTo();

		String duration = null;
		if (fromdT == null) {
			duration = "Till date " + todT;
		} else {
			duration = "For the period " + fromdT + " to " + todT;
		}

		LOGGER.info("duration-----------" + duration);
		DecimalFormat cost = new DecimalFormat("###.##");
		DecimalFormat footage = new DecimalFormat("###.###");
		for (CostPerMileReportModel costPerMileReportModel : costPerMileReportModellist) {
			// costPerMileReportModel.setReportDuration(duration);
			// costPerMileReportModel.setLogo(url.toString());
			costPerMileReportModel.setTotalCost(Double.valueOf(cost
					.format(costPerMileReportModel.getTotalCost())));
			costPerMileReportModel.setTotalFtg(Double.valueOf(footage
					.format(costPerMileReportModel.getTotalFtg())));
			LOGGER.info(costPerMileReportModel.getTotalCost() + "----"
					+ costPerMileReportModel.getTotalFtg());
			if (costPerMileReportModel.getTotalFtg() == 0) {
				costPerMileReportModel.setCostPerMile(Double.valueOf(0));
			} else {
				costPerMileReportModel
						.setCostPerMile((Double.valueOf(cost
								.format(costPerMileReportModel.getTotalCost())) / (Double
								.valueOf(footage.format(costPerMileReportModel
										.getTotalFtg())))));
				LOGGER.info(String.valueOf(costPerMileReportModel
						.getTotalCost()
						/ (costPerMileReportModel.getTotalFtg())));
			}
		}
		Map<String, Object> parameters = new HashMap<String, Object>();

		parameters.put("logo", url.toString());
		parameters.put("reportDuration", duration);
		try {

			JRDataSource jrDataSource = new JRBeanCollectionDataSource(
					costPerMileReportModellist);
			JasperDesign jasperdesign = JRXmlLoader.load(inputStream);
			JasperReport jasperreport = JasperCompileManager
					.compileReport(jasperdesign);

			JasperPrint jasperPrint = JasperFillManager.fillReport(
					jasperreport, parameters, jrDataSource);

			response.reset();
			response.setBufferSize(BUFFERSIZE);

			response.setContentType("application/vnd.ms-excel");
			response.setHeader(CONTENT_DISPOSITION, "attachment; filename="
					+ filename);
			response.setHeader("Cache-Control", "private");
			response.setDateHeader("Expires", 0);
			ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
			JRXlsExporter exporterXLS = new JRXlsExporter();
			outputStream = response.getOutputStream();
			exporterXLS.setParameter(JRXlsExporterParameter.JASPER_PRINT,
					jasperPrint);
			exporterXLS.setParameter(JRXlsExporterParameter.OUTPUT_STREAM,
					byteArrayOutputStream);

			exporterXLS.exportReport();

			outputStream.write(byteArrayOutputStream.toByteArray());

			outputStream.flush();
			outputStream.close();

		} catch (JRException e) {
			LOGGER.error(e.getMessage(), e);

		}

	}

	public void generatePListExcelReport(Map<String, Object> plistDtl,
			HttpServletRequest request, HttpServletResponse response, String scope)
			throws IOException {

		String module = scope;
		Integer offset = 1;
		Integer limit = 999999;
		InputStream inputStream = null;
		String filename = null;
		Long userId = securityService.getLoggedOnUserId();
		filename = String.format(FORMAT, "PriceListMatReports"
				+ DateTimeFormat.forPattern(DATEFORMAT).print(new DateTime()),
				"xls");
		inputStream = request.getSession(false).getServletContext()
				.getResourceAsStream("/reports/PriceListMatReports.jrxml");
		OutputStream outputStream = null;
		List<PriceListDetails> plistmatRef = null;

		try {

			plistmatRef = priceListRepository.getPriceListDetails(
					plistDtl.get("id"), module, offset, limit, null, null, 0,
					userId);
			// plistmatRef = reportsService.generatePListPdfReport(plistDtl,
			// request, response);

		} catch (Exception dae) {
			System.out.println("dae" + dae);
		}

		try {
			JRDataSource jrDataSource = new JRBeanCollectionDataSource(
					plistmatRef);
			JasperDesign jasperdesign = JRXmlLoader.load(inputStream);
			JasperReport jasperreport = JasperCompileManager
					.compileReport(jasperdesign);

			JasperPrint jasperPrint = JasperFillManager.fillReport(
					jasperreport, plistDtl, jrDataSource);

			response.reset();
			response.setBufferSize(BUFFERSIZE);
			response.setContentType("application/vnd.ms-excel");
			response.setHeader("Content-disposition", "attachment; filename="
					+ filename);
			response.setHeader("Cache-Control", "private");
			response.setDateHeader("Expires", 0);
			ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();

			JRXlsExporter exporterXLS = new JRXlsExporter();
			outputStream = response.getOutputStream();
			exporterXLS.setParameter(JRXlsExporterParameter.JASPER_PRINT,
					jasperPrint);
			exporterXLS.setParameter(JRXlsExporterParameter.OUTPUT_STREAM,
					byteArrayOutputStream);

			exporterXLS.exportReport();
			outputStream.write(byteArrayOutputStream.toByteArray());
			outputStream.flush();
			outputStream.close();
		} catch (JRException e) {
			LOGGER.error(e.getMessage(), e);

		}

	}

	public void generatePListPdfReport(Map<String, Object> plistDtl,
			HttpServletRequest request, HttpServletResponse response, String scope)
			throws IOException {

		String module = scope;
		Integer offset = 1;
		Integer limit = 999999;
		InputStream inputStream = null;
		String filename = null;
		Long userId = securityService.getLoggedOnUserId();
		filename = String.format(FORMAT, "PriceListMatReports"
				+ DateTimeFormat.forPattern(DATEFORMAT).print(new DateTime()),
				"pdf");
		inputStream = request.getSession(false).getServletContext()
				.getResourceAsStream("/reports/PriceListMatReports.jrxml");
		OutputStream outputStream = null;
		List<PriceListDetails> plistmatRef = null;

		try {

			plistmatRef = priceListRepository.getPriceListDetails(
					plistDtl.get("id"), module, offset, limit, null, null, 0,
					userId);
			// plistmatRef = reportsService.generatePListPdfReport(plistDtl,
			// request, response);

		} catch (Exception dae) {
			System.out.println("dae" + dae);
		}

		try {
			JRDataSource jrDataSource = new JRBeanCollectionDataSource(
					plistmatRef);
			JasperDesign jasperdesign = JRXmlLoader.load(inputStream);
			JasperReport jasperreport = JasperCompileManager
					.compileReport(jasperdesign);

			JasperPrint jasperPrint = JasperFillManager.fillReport(
					jasperreport, plistDtl, jrDataSource);

			response.reset();
			response.setBufferSize(BUFFERSIZE);
			response.setContentType("application/pdf");
			response.setHeader("Content-disposition", "attachment; filename="
					+ filename);
			response.setHeader("Cache-Control", "private");
			response.setDateHeader("Expires", 0);
			ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
			JRPdfExporter exporterPDF = new JRPdfExporter();
			outputStream = response.getOutputStream();
			exporterPDF.setParameter(JRPdfExporterParameter.JASPER_PRINT,
					jasperPrint);
			exporterPDF.setParameter(JRPdfExporterParameter.OUTPUT_STREAM,
					byteArrayOutputStream);

			exporterPDF.exportReport();

			outputStream.write(byteArrayOutputStream.toByteArray());
			outputStream.flush();
			outputStream.close();
		} catch (JRException e) {
			LOGGER.error(e.getMessage(), e);

		}

	}

	public void generateOhMontoringReport(ProjectDetails projectDetails,
			HttpServletRequest request, HttpServletResponse response)
			throws IOException {
		InputStream inputStream = null;

		String filename = null;
		filename = String.format(FORMAT, "OverheadsMonitoringReport"
				+ DateTimeFormat.forPattern(DATEFORMAT).print(new DateTime()),
				"xls");
		// }

		inputStream = request
				.getSession(false)
				.getServletContext()
				.getResourceAsStream("/reports/OverheadsMonitoringReport.jrxml");

		String url = request.getRequestURL().toString();
		url = url.replace(request.getServletPath(),
				"/resources/css/login/images/tdslogo.png");

		OutputStream outputStream = null;
		LOGGER.info("--generateOhMontoringReport--"
				+ projectDetails.getStateId() + "----"
				+ projectDetails.getConsCompId() + "----"
				+ projectDetails.getExchangeId() + "----"
				+ projectDetails.getPrjCrtdFrm() + "----"
				+ projectDetails.getPrjCrtdTo());
		// Long userId = securityService.getLoggedOnUserId();
		List<OverHeadsModel> ohMonitoringList = reportsRepository
				.generateOhMontoringReport(projectDetails.getStateId(),
						projectDetails.getConsCompId(), projectDetails
								.getExchangeId(), projectDetails
								.getPrjCrtdFrm().length() == 0 ? null
								: projectDetails.getPrjCrtdFrm(),
						projectDetails.getPrjCrtdTo().length() == 0 ? null
								: projectDetails.getPrjCrtdTo());
		SimpleDateFormat format = new SimpleDateFormat("MM/dd/yyyy");
		String fromdT = projectDetails.getPrjCrtdFrm().length() == 0 ? null
				: projectDetails.getPrjCrtdFrm();
		String todT = projectDetails.getPrjCrtdTo().length() == 0 ? format
				.format(new Date()) : projectDetails.getPrjCrtdTo();

		String duration = null;
		if (fromdT == null) {
			duration = "Till date " + todT;
		} else {
			duration = "For the period " + fromdT + " to " + todT;
		}
		//System.out.println("duration-----------" + duration);
		// if (stakedUnitsList.size() > 0) {
		try {
			/*
			 * Double grandTotAsbuilt = 0.0;
			 * 
			 * for (int i = 0; i < stakedUnitsList.size(); i++) {
			 * stakedUnitsList.get(i).setLogo(url.toString()); grandTotAsbuilt
			 * += stakedUnitsList.get(i).getTotAsbuilt(); grandTotStaked +=
			 * stakedUnitsList.get(i).getTotStaked(); }
			 */
			Double stkPercentage = 0.0;
			for (int i = 0; i < ohMonitoringList.size(); i++) {
				try {
					stkPercentage = (ohMonitoringList.get(i).getDgnTotal() / ohMonitoringList
							.get(i).getStkCost()) * 100;
					if (Double.isNaN(stkPercentage)) {
						stkPercentage = 0.0;
					}
				} catch (Exception e) {
					stkPercentage = 0.0;

				}
				ohMonitoringList.get(i).setStkPercentage(stkPercentage);
				LOGGER.info("oh name=" + ohMonitoringList.get(i).getName());
				LOGGER.info("oh stkPercentage="
						+ ohMonitoringList.get(i).getStkPercentage());

			}

			Map<String, Object> parameters = new HashMap<String, Object>();

			parameters.put("url", url.toString());
			parameters.put("duration", duration.toString());

			JRDataSource jrDataSource = new JRBeanCollectionDataSource(
					ohMonitoringList);
			JasperDesign jasperdesign = JRXmlLoader.load(inputStream);
			JasperReport jasperreport = JasperCompileManager
					.compileReport(jasperdesign);

			JasperPrint jasperPrint = JasperFillManager.fillReport(
					jasperreport, parameters, jrDataSource);

			response.reset();
			response.setBufferSize(BUFFERSIZE);

			response.setContentType("application/vnd.ms-excel");
			response.setHeader(CONTENT_DISPOSITION, "attachment; filename="
					+ filename);
			response.setHeader("Cache-Control", "private");
			response.setDateHeader("Expires", 0);
			ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
			JRXlsExporter exporterXLS = new JRXlsExporter();
			outputStream = response.getOutputStream();
			exporterXLS.setParameter(JRXlsExporterParameter.JASPER_PRINT,
					jasperPrint);
			exporterXLS.setParameter(JRXlsExporterParameter.OUTPUT_STREAM,
					byteArrayOutputStream);

			exporterXLS.exportReport();

			outputStream.write(byteArrayOutputStream.toByteArray());

			outputStream.flush();
			outputStream.close();

		} catch (JRException e) {
			LOGGER.error(e.getMessage(), e);

		}
		// }
	}

	public List<CalculatorModel> getCalculatorWindow(
			CalculatorModel calculatorModel) {

		LOGGER.info("loading getCalculatorWindow");
		List<CalculatorModel> calculatorList = reportsRepository
				.getCalculatorWindow(calculatorModel.getPrjId(),
						calculatorModel.getCalcType());
		// TODO roleid

		return calculatorList;

	}

	public void generateCalculatorReport(Integer prjId, List calculators,
			Integer reportType, HttpServletRequest request,
			HttpServletResponse response) throws IOException {
		InputStream inputStream = null;

		String filename = null;
		if (reportType == 1) {
			filename = String.format(
					FORMAT,
					"PCE_CalculatorReports"
							+ DateTimeFormat.forPattern(DATEFORMAT).print(
									new DateTime()), "pdf");
		} else if (reportType == 2) {
			filename = String.format(
					FORMAT,
					"PCE_CalculatorReports"
							+ DateTimeFormat.forPattern(DATEFORMAT).print(
									new DateTime()), "xls");
		}
		// }

		inputStream = request.getSession(false).getServletContext()
				.getResourceAsStream("/reports/CalculatorReports.jrxml");

		String url = request.getRequestURL().toString();
		url = url.replace(request.getServletPath(),
				"/resources/css/login/images/tdslogo.png");

		OutputStream outputStream = null;

		Long userId = securityService.getLoggedOnUserId();
		String calc = concatString(calculators);
		LOGGER.info("loading prjId==" + prjId);
		LOGGER.info("loading userId==" + userId);
		LOGGER.info("loading getCalculatorWindow==" + calc);
		List<CalculatorReportModel> estimationList = reportsRepository
				.generateCalculatorReport(userId, prjId, calc, null);
		LOGGER.info("loading size==" + estimationList.size());
		// if (stakedUnitsList.size() > 0) {
		try {

			Map parameterMap = new HashMap();
			parameterMap.put("logo", url.toString());

			JRDataSource jrDataSource = new JRBeanCollectionDataSource(
					estimationList);
			JasperDesign jasperdesign = JRXmlLoader.load(inputStream);
			JasperReport jasperreport = JasperCompileManager
					.compileReport(jasperdesign);

			JasperPrint jasperPrint = JasperFillManager.fillReport(
					jasperreport, parameterMap, jrDataSource);

			response.reset();
			response.setBufferSize(BUFFERSIZE);

			if (reportType == 1) {
				response.setContentType("application/pdf");
				response.setHeader(CONTENT_DISPOSITION, "attachment; filename="
						+ filename);
				response.setHeader("Cache-Control", "private");
				response.setDateHeader("Expires", 0);
				ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
				JRPdfExporter exporterPDF = new JRPdfExporter();
				outputStream = response.getOutputStream();
				exporterPDF.setParameter(JRPdfExporterParameter.JASPER_PRINT,
						jasperPrint);
				exporterPDF.setParameter(JRPdfExporterParameter.OUTPUT_STREAM,
						byteArrayOutputStream);

				exporterPDF.exportReport();
				outputStream.write(byteArrayOutputStream.toByteArray());
			} else if (reportType == 2) {
				response.setContentType("application/vnd.ms-excel");
				response.setHeader(CONTENT_DISPOSITION, "attachment; filename="
						+ filename);
				response.setHeader("Cache-Control", "private");
				response.setDateHeader("Expires", 0);
				ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
				JRXlsExporter exporterXLS = new JRXlsExporter();
				outputStream = response.getOutputStream();
				exporterXLS.setParameter(JRXlsExporterParameter.JASPER_PRINT,
						jasperPrint);
				exporterXLS.setParameter(JRXlsExporterParameter.OUTPUT_STREAM,
						byteArrayOutputStream);

				exporterXLS.exportReport();

				outputStream.write(byteArrayOutputStream.toByteArray());
			}

			outputStream.flush();
			outputStream.close();

		} catch (JRException e) {
			LOGGER.error(e.getMessage(), e);

		}
		// }
	}

	public String concatString(List type) {
		String typeDtls = null;
		for (Object typeDtl : type) {

			if (typeDtls == null) {
				typeDtls = typeDtl.toString().concat(",");
			} else {
				typeDtls = typeDtls.concat(typeDtl.toString()).concat(",");
			}
		}
		if (typeDtls != null) {
			typeDtls = typeDtls.substring(0, typeDtls.length() - 1);
		}
		return typeDtls;
	}

	public void generateSowReport(Integer prjId, HttpServletRequest request,
			HttpServletResponse response) {
		String filename = "";
		try {
			javax.servlet.ServletContext context = request.getSession()
					.getServletContext();
			String realContextPath = context.getRealPath("/");

			Date date = new Date();
			int dd = Integer.parseInt(new SimpleDateFormat("dd").format(date));
			int mm = Integer.parseInt(new SimpleDateFormat("MM").format(date));
			int yyyy = Integer.parseInt(new SimpleDateFormat("yyyy")
					.format(date));
			filename = "SOW-BOM" + "_" + prjId;
			File file = File.createTempFile(filename, ".xlsx");
			String outputPath = file.getAbsolutePath();
			// file.delete();
			try {
				response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
				generateExcel(prjId, realContextPath, outputPath);
				response.setHeader("Content-Disposition",
						"attachment; filename=" + filename + ".xlsx");

				BufferedInputStream in = new BufferedInputStream(
						new FileInputStream(file));
				BufferedOutputStream out = new BufferedOutputStream(
						response.getOutputStream());
				// start reading and writing data
				byte[] buf = new byte[4 * 1024];
				int bytesRead;
				while ((bytesRead = in.read(buf)) != -1) {
					out.write(buf, 0, bytesRead);
				}
				out.flush();
				in.close();
			} finally {

				File dfile = new File(outputPath);
				if (dfile.exists()) {
					dfile.delete();
				}

			}

		} catch (Exception e) {

			e.printStackTrace();
		}
	}

	public String generateExcel(Integer prjId, String realContextPath,
			String outputPath) {
		String filename = "";
		try {

			String inputFile = realContextPath + excelPath;
			
	
			
			LOGGER.info("loading prjId==" + prjId);

			List<LookUp> costTypeList = utilsRepository.getLookupList(101, 1);

			Map sowDtls = reportsRepository.getSOWReportsDtls(prjId);
			// Map sowDtls=reportsRepository.getSOWReportsDtls(808);
			SOWReportDetails sowReportDetails = new SOWReportDetails();

			sowReportDetails
					.setProjectDetailList((List<ProjectDetails>) sowDtls
							.get("sow_return"));
			sowReportDetails.setCalcIspLabor((List<CalculatorModel>) sowDtls
					.get("isp_labor"));
			sowReportDetails.setCalcOspLabor((List<CalculatorModel>) sowDtls
					.get("osp_labor"));
			sowReportDetails.setCalcIspMaterial((List<CalculatorModel>) sowDtls
					.get("isp_material"));
			sowReportDetails.setCalcOspMaterial((List<CalculatorModel>) sowDtls
					.get("osp_material"));
			//ISP OH
			List<OverHeadList> ispOhDetailList = (List<OverHeadList>) sowDtls
					.get("isp_oh");
			
			Map<Integer, OverheadTreeNode> ispParents = new HashMap<Integer, OverheadTreeNode>();
			List<OverheadTreeNode> ispOhRootList = new ArrayList<OverheadTreeNode>();
			for (OverHeadList overheads : ispOhDetailList) {
				OverheadTreeNode node = new OverheadTreeNode();
				node.setId(overheads.getId());
				node.setName(overheads.getName());
				node.setParentId(overheads.getParentId());
				node.setCatId(overheads.getCatId());
				node.setOhParentId(overheads.getOhParentId());
				node.setLevel(overheads.getLevel());
				node.setOhDtlId(overheads.getOhDtlId());
				node.setCostTypeId(overheads.getCostTypeId());
				node.setCostType(overheads.getCostType());
				node.setRate(overheads.getRate());
				node.setUnit(overheads.getUnit());
				ispParents.put(node.getId(), node);
			}
			for (OverHeadList overheads : ispOhDetailList) {
				int ohId = overheads.getId();
				if (overheads.getLevel() == 1) {
					ispOhRootList.add(ispParents.get(ohId));
				} else {
					ispParents.get(overheads.getParentId()).getChildren()
							.add(ispParents.get(ohId));
				}

				ispParents.put(ispParents.get(ohId).getId(),
						ispParents.get(ohId));
			}

			sowReportDetails.setOhCostTypeList(costTypeList);
			sowReportDetails.setIspOhRootList(ispOhRootList);
			
			// OSP OH
			List<OverHeadList> ospOhDetailList = (List<OverHeadList>) sowDtls
					.get("osp_oh");

			Map<Integer, OverheadTreeNode> ospParents = new HashMap<Integer, OverheadTreeNode>();
			List<OverheadTreeNode> ospOhRootList = new ArrayList<OverheadTreeNode>();
			for (OverHeadList overheads : ospOhDetailList) {
				OverheadTreeNode node = new OverheadTreeNode();
				node.setId(overheads.getId());
				node.setName(overheads.getName());
				node.setParentId(overheads.getParentId());
				node.setCatId(overheads.getCatId());
				node.setOhParentId(overheads.getOhParentId());
				node.setLevel(overheads.getLevel());
				node.setOhDtlId(overheads.getOhDtlId());
				node.setCostTypeId(overheads.getCostTypeId());
				node.setCostType(overheads.getCostType());
				node.setRate(overheads.getRate());
				node.setUnit(overheads.getUnit());
				ospParents.put(node.getId(), node);
			}
			for (OverHeadList overheads : ospOhDetailList) {
				int ohId = overheads.getId();
				if (overheads.getLevel() == 1) {
					ospOhRootList.add(ospParents.get(ohId));
				} else {
					ospParents.get(overheads.getParentId()).getChildren()
							.add(ospParents.get(ohId));
				}

				ospParents.put(ospParents.get(ohId).getId(),
						ospParents.get(ohId));
			}

			sowReportDetails.setOspOhRootList(ospOhRootList);

			List<OverHeadList> stakedCost = (List<OverHeadList>) sowDtls
					.get("stk_cst");
			sowReportDetails.setStkCost(stakedCost.get(0).getStkCost());

			Map beans = new HashMap();
			beans.put("sowReport", sowReportDetails);
			XLSTransformer transformer = new XLSTransformer();
			transformer.transformXLS(inputFile, beans, outputPath);
			// transformer.transformXLS(inputFile, beans, "E:/test.xlsx");

		} catch (Exception e) {

			e.printStackTrace();
		}
		return filename;

	}

	public void generateProjectReport(ProjectDetails projectDetails,
			Integer reportType, HttpServletRequest request,
			HttpServletResponse response) throws IOException {
		InputStream inputStream = null;

		String filename = null;
		if (reportType == 1) {
			filename = String.format(
					FORMAT,
					"PCE_ProjectDtlReports"
							+ DateTimeFormat.forPattern(DATEFORMAT).print(
									new DateTime()), "pdf");
		} else if (reportType == 2) {
			filename = String.format(
					FORMAT,
					"PCE_ProjectDtlReports"
							+ DateTimeFormat.forPattern(DATEFORMAT).print(
									new DateTime()), "xls");
		}
		// }

		inputStream = request.getSession(false).getServletContext()
				.getResourceAsStream("/reports/ProjectDtlReports.jrxml");

		String url = request.getRequestURL().toString();
		url = url.replace(request.getServletPath(),
				"/resources/css/login/images/tdslogo.png");

		OutputStream outputStream = null;

		Long userId = securityService.getLoggedOnUserId();
		// String calc = concatString(calculators);
		// LOGGER.info("loading prjId==" + prjId);
		LOGGER.info("loading userId==" + userId);
		// LOGGER.info("loading getCalculatorWindow==" + calc);
		List<ProjectReportModel> projectReportList = reportsRepository
				.generateProjectReport(userId, projectDetails.getProjectName(),
						projectDetails.getSapWbsCd(),
						projectDetails.getCaPrjId(),
						projectDetails.getLobType(),
						projectDetails.getPrjPhase(),
						projectDetails.getProjectExpedite(),
						projectDetails.getPhaseDysFrm(),
						projectDetails.getPhaseDysTo(),
						projectDetails.getPrjCrtdFrm(),
						projectDetails.getPrjCrtdTo(),
						projectDetails.getProjectId(),
						projectDetails.getPrjCompany(),
						projectDetails.getExchangeId(),
						projectDetails.getStateId(), projectDetails.getOwner(),
						projectDetails.getMsegId(),
						projectDetails.getProjectScopeId());
		LOGGER.info("loading size==" + projectReportList.size());
		// if (stakedUnitsList.size() > 0) {
		try {

			Map parameterMap = new HashMap();
			parameterMap.put("logo", url.toString());

			JRDataSource jrDataSource = new JRBeanCollectionDataSource(
					projectReportList);
			JasperDesign jasperdesign = JRXmlLoader.load(inputStream);
			JasperReport jasperreport = JasperCompileManager
					.compileReport(jasperdesign);

			JasperPrint jasperPrint = JasperFillManager.fillReport(
					jasperreport, parameterMap, jrDataSource);

			response.reset();
			response.setBufferSize(BUFFERSIZE);

			if (reportType == 1) {
				response.setContentType("application/pdf");
				response.setHeader(CONTENT_DISPOSITION, "attachment; filename="
						+ filename);
				response.setHeader("Cache-Control", "private");
				response.setDateHeader("Expires", 0);
				ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
				JRPdfExporter exporterPDF = new JRPdfExporter();
				outputStream = response.getOutputStream();
				exporterPDF.setParameter(JRPdfExporterParameter.JASPER_PRINT,
						jasperPrint);
				exporterPDF.setParameter(JRPdfExporterParameter.OUTPUT_STREAM,
						byteArrayOutputStream);

				exporterPDF.exportReport();
				outputStream.write(byteArrayOutputStream.toByteArray());
			} else if (reportType == 2) {
				response.setContentType("application/vnd.ms-excel");
				response.setHeader(CONTENT_DISPOSITION, "attachment; filename="
						+ filename);
				response.setHeader("Cache-Control", "private");
				response.setDateHeader("Expires", 0);
				ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
				JRXlsExporter exporterXLS = new JRXlsExporter();
				outputStream = response.getOutputStream();
				exporterXLS.setParameter(JRXlsExporterParameter.JASPER_PRINT,
						jasperPrint);
				exporterXLS.setParameter(JRXlsExporterParameter.OUTPUT_STREAM,
						byteArrayOutputStream);

				exporterXLS.exportReport();

				outputStream.write(byteArrayOutputStream.toByteArray());
			}

			outputStream.flush();
			outputStream.close();

		} catch (JRException e) {
			LOGGER.error(e.getMessage(), e);

		}
		// }
	}

	public void generateIspEstVsActualReport(ProjectDetails projectDetails,
			HttpServletRequest request, HttpServletResponse response) throws IOException {
		InputStream inputStream = null;

		String filename = null;

			inputStream = request.getSession(false).getServletContext()

			.getResourceAsStream("/reports/IspEstimationVsActualReport.jrxml");
			filename = String.format(
					FORMAT,
					"EstimationVsActualReport"
							+ DateTimeFormat.forPattern(DATEFORMAT).print(
									new DateTime()), "xls");
		
		String url = request.getRequestURL().toString();
		url = url.replace(request.getServletPath(),
				"/resources/css/login/images/tdslogo.png");

		OutputStream outputStream = null;
		LOGGER.debug("--generateEstVsActualReport--"
				+ projectDetails.getStateId() + "----"
				+ projectDetails.getConsCompId() + "----"
				+ projectDetails.getExchangeId() + "----"
				+ projectDetails.getPrjCrtdFrm() + "----"
				+ projectDetails.getPrjCrtdTo());
		// Long userId = securityService.getLoggedOnUserId();
		
		
		List<IspEstimationsRepModel> estimationUnitsList = reportsRepository
				.generateIspEstVsActualReport(projectDetails.getStateId(),
						projectDetails.getConsCompId(), projectDetails
								.getExchangeId(), projectDetails
								.getPrjCrtdFrm().length() == 0 ? null
								: projectDetails.getPrjCrtdFrm(),
						projectDetails.getPrjCrtdTo().length() == 0 ? null
								: projectDetails.getPrjCrtdTo());
		
		SimpleDateFormat format = new SimpleDateFormat("MM/dd/yyyy");
		String fromdT = projectDetails.getPrjCrtdFrm().length() == 0 ? null
				: projectDetails.getPrjCrtdFrm();
		String todT = projectDetails.getPrjCrtdTo().length() == 0 ? format
				.format(new Date()) : projectDetails.getPrjCrtdTo();

		String duration = null;
		if (fromdT == null) {
			duration = "Till date " + todT;
		} else {
			duration = "For the period " + fromdT + " to " + todT;
		}
		LOGGER.debug("duration-----------" + duration);

		// if (stakedUnitsList.size() > 0) {

		try {
			Double grandTotAsbuilt = 0.0;
			Double grandTotStaked = 0.0;
			for (int i = 0; i < estimationUnitsList.size(); i++) {
				// stakedUnitsList.get(i).setLogo(url.toString());
				grandTotAsbuilt += estimationUnitsList.get(i).getTotAsbuilt();
				grandTotStaked += estimationUnitsList.get(i).getTotEstimated();
			}

			Double percentageDiff = (grandTotStaked == 0) ? 0.0
					: ((grandTotAsbuilt - grandTotStaked) / grandTotStaked) * 100;

			Map parameterMap = new HashMap();
			parameterMap.put("logo", url.toString());
			parameterMap.put("reportDuration", duration);
			parameterMap.put("grandDiffPercent", percentageDiff);
			JRDataSource jrDataSource = new JRBeanCollectionDataSource(
					estimationUnitsList);
			JasperDesign jasperdesign = JRXmlLoader.load(inputStream);
			JasperReport jasperreport = JasperCompileManager
					.compileReport(jasperdesign);

			JasperPrint jasperPrint = JasperFillManager.fillReport(
					jasperreport, parameterMap, jrDataSource);

			response.reset();
			response.setBufferSize(BUFFERSIZE);

			response.setContentType("application/vnd.ms-excel");
			response.setHeader(CONTENT_DISPOSITION, "attachment; filename="
					+ filename);
			response.setHeader("Cache-Control", "private");
			response.setDateHeader("Expires", 0);
			ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
			JRXlsExporter exporterXLS = new JRXlsExporter();
			outputStream = response.getOutputStream();
			exporterXLS.setParameter(JRXlsExporterParameter.JASPER_PRINT,
					jasperPrint);
			exporterXLS.setParameter(JRXlsExporterParameter.OUTPUT_STREAM,
					byteArrayOutputStream);

			exporterXLS.exportReport();

			outputStream.write(byteArrayOutputStream.toByteArray());

			outputStream.flush();
			outputStream.close();

		} catch (JRException e) {
			LOGGER.error(e.getMessage(), e);

		}
		// }
	}
	
	
	public void generateIspEmpPerformanceReport(ProjectDetails projectDetails,
			HttpServletRequest request, HttpServletResponse response)
			throws IOException {
		InputStream inputStream = null;

		String filename = null;
		filename = String.format(FORMAT, "EmployeePerformanceReport"
				+ DateTimeFormat.forPattern(DATEFORMAT).print(new DateTime()),
				"xls");
		// }

		inputStream = request
				.getSession(false)
				.getServletContext()
				.getResourceAsStream("/reports/IspEmployeePerformanceReport.jrxml");

		String url = request.getRequestURL().toString();
		url = url.replace(request.getServletPath(),
				"/resources/css/login/images/tdslogo.png");

		OutputStream outputStream = null;
		List<IspEstimationsRepModel> estimationList = null;
		
		estimationList = reportsRepository
					.generateIspEmpPerformanceReport(
							projectDetails.getStateId(),
							projectDetails.getConsCompId(),
							projectDetails.getExchangeId(),
							projectDetails.getPrjCrtdFrm().trim().length() == 0 ? null
									: projectDetails.getPrjCrtdFrm(),
							projectDetails.getPrjCrtdTo().trim().length() == 0 ? null
									: projectDetails.getPrjCrtdTo(), projectDetails
									.getOspeOwner().trim().length() == 0 ? null
											: projectDetails.getOspeOwner());

		
		
		LOGGER.info("stakedUnitsList-------------" + estimationList.size());
		SimpleDateFormat format = new SimpleDateFormat("MM/dd/yyyy");
		String fromdT = projectDetails.getPrjCrtdFrm().length() == 0 ? null
				: projectDetails.getPrjCrtdFrm();
		String todT = projectDetails.getPrjCrtdTo().length() == 0 ? format
				.format(new Date()) : projectDetails.getPrjCrtdTo();

		String duration = null;
		if (fromdT == null) {
			duration = "Till date " + todT;
		} else {
			duration = "For the period " + fromdT + " to " + todT;
		}
		LOGGER.info("duration-----------" + duration);
		// if (stakedUnitsList.size() > 0) {
		try {
			Double grandTotAsbuilt = 0.0;
			Double grandTotStaked = 0.0;
			for (int i = 0; i < estimationList.size(); i++) {
				grandTotAsbuilt += estimationList.get(i).getTotAsbuilt();
				grandTotStaked += estimationList.get(i).getTotEstimated();
			}

			Double percentageDiff = (grandTotStaked == 0) ? 0.0
					: ((grandTotAsbuilt - grandTotStaked) / grandTotStaked) * 100;

			Map parameterMap = new HashMap();
			parameterMap.put("logo", url.toString());
			parameterMap.put("reportDuration", duration);
			parameterMap.put("grandDiffPercent", percentageDiff);

			JRDataSource jrDataSource = new JRBeanCollectionDataSource(
					estimationList);
			JasperDesign jasperdesign = JRXmlLoader.load(inputStream);
			JasperReport jasperreport = JasperCompileManager
					.compileReport(jasperdesign);

			JasperPrint jasperPrint = JasperFillManager.fillReport(
					jasperreport, parameterMap, jrDataSource);

			response.reset();
			response.setBufferSize(BUFFERSIZE);

			response.setContentType("application/vnd.ms-excel");
			response.setHeader(CONTENT_DISPOSITION, "attachment; filename="
					+ filename);
			response.setHeader("Cache-Control", "private");
			response.setDateHeader("Expires", 0);
			ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
			JRXlsExporter exporterXLS = new JRXlsExporter();
			outputStream = response.getOutputStream();
			exporterXLS.setParameter(JRXlsExporterParameter.JASPER_PRINT,
					jasperPrint);
			exporterXLS.setParameter(JRXlsExporterParameter.OUTPUT_STREAM,
					byteArrayOutputStream);

			exporterXLS.exportReport();

			outputStream.write(byteArrayOutputStream.toByteArray());

			outputStream.flush();
			outputStream.close();

		} catch (JRException e) {
			LOGGER.error(e.getMessage(), e);

		}
		// }
	}
	
	
	public void generateIspOhMontoringReport(ProjectDetails projectDetails,
			HttpServletRequest request, HttpServletResponse response)
			throws IOException {
		InputStream inputStream = null;

		String filename = null;
		try{
		filename = String.format(FORMAT, "IspOverheadsMonitoringReport"
				+ DateTimeFormat.forPattern(DATEFORMAT).print(new DateTime()),
				"xls");
		// }

		inputStream = request
				.getSession(false)
				.getServletContext()
				.getResourceAsStream("/reports/IspOverheadsMonitoringReport.jrxml");

		String url = request.getRequestURL().toString();
		url = url.replace(request.getServletPath(),
				"/resources/css/login/images/tdslogo.png");

		OutputStream outputStream = null;
		LOGGER.info("--generateIspOhMontoringReport--"
				+ projectDetails.getStateId() + "----"
				+ projectDetails.getConsCompId() + "----"
				+ projectDetails.getExchangeId() + "----"
				+ projectDetails.getPrjCrtdFrm() + "----"
				+ projectDetails.getPrjCrtdTo());
		// Long userId = securityService.getLoggedOnUserId();
		List<IspMaterialsModel> ispOhMonitoringList = reportsRepository
				.generateIspOhMontoringReport(projectDetails.getStateId(),
						projectDetails.getConsCompId(), projectDetails
								.getExchangeId(), projectDetails
								.getPrjCrtdFrm().length() == 0 ? null
								: projectDetails.getPrjCrtdFrm(),
						projectDetails.getPrjCrtdTo().length() == 0 ? null
								: projectDetails.getPrjCrtdTo());
		SimpleDateFormat format = new SimpleDateFormat("MM/dd/yyyy");
		String fromdT = projectDetails.getPrjCrtdFrm().length() == 0 ? null
				: projectDetails.getPrjCrtdFrm();
		String todT = projectDetails.getPrjCrtdTo().length() == 0 ? format
				.format(new Date()) : projectDetails.getPrjCrtdTo();

		String duration = null;
		if (fromdT == null) {
			duration = "Till date " + todT;
		} else {
			duration = "For the period " + fromdT + " to " + todT;
		}
		System.out.println("duration-----------" + duration);
		// if (stakedUnitsList.size() > 0) {
		try {
			/*
			 * Double grandTotAsbuilt = 0.0;
			 * 
			 * for (int i = 0; i < stakedUnitsList.size(); i++) {
			 * stakedUnitsList.get(i).setLogo(url.toString()); grandTotAsbuilt
			 * += stakedUnitsList.get(i).getTotAsbuilt(); grandTotStaked +=
			 * stakedUnitsList.get(i).getTotStaked(); }
			 */
	
				//ispOhMonitoringList.get(i).setStkPercentage(stkPercentage);
				//LOGGER.info("oh name=" + ispOhMonitoringList.get(i).getName());
				//LOGGER.info("oh stkPercentage="
					//	+ ispOhMonitoringList.get(i).getStkPercentage());
			//LOGGER.info("entered");

			//}

			Map<String, Object> parameters = new HashMap<String, Object>();
			parameters.put("logo", url.toString());	
			parameters.put("url", url.toString());
			parameters.put("duration", duration.toString());

			JRDataSource jrDataSource = new JRBeanCollectionDataSource(
					ispOhMonitoringList);
			JasperDesign jasperdesign = JRXmlLoader.load(inputStream);
			JasperReport jasperreport = JasperCompileManager
					.compileReport(jasperdesign);

			JasperPrint jasperPrint = JasperFillManager.fillReport(
					jasperreport, parameters, jrDataSource);

			response.reset();
			response.setBufferSize(BUFFERSIZE);

			//response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
			response.setContentType("application/vnd.ms-excel");
			response.setHeader(CONTENT_DISPOSITION, "attachment; filename="
					+ filename);
			response.setHeader("Cache-Control", "private");
			response.setDateHeader("Expires", 0);
			ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
			JRXlsExporter exporterXLS = new JRXlsExporter();
			outputStream = response.getOutputStream();
			exporterXLS.setParameter(JRXlsExporterParameter.JASPER_PRINT,
					jasperPrint);
			exporterXLS.setParameter(JRXlsExporterParameter.OUTPUT_STREAM,
					byteArrayOutputStream);

			exporterXLS.exportReport();

			outputStream.write(byteArrayOutputStream.toByteArray());

//			outputStream.flush();
//			outputStream.close();

		} catch (JRException e) {
			LOGGER.error(e.getMessage(), e);

		}
		finally{
			if(outputStream!=null){
				outputStream.flush();
				outputStream.close();
			}
		 }
		}
		finally{
			if(inputStream!=null){
				inputStream.close();
			}
		}
	}
	public void generateISPMaterialsReport(Integer prjId,Integer prId,Integer locId, HttpServletRequest request,
			HttpServletResponse response) {
		String filename = "";
		ISPMaterialsReportDetails ispMaterialsReportDetails =null;
		try {
			javax.servlet.ServletContext context = request.getSession()
					.getServletContext();
			String realContextPath = context.getRealPath("/");
			String inputFile = realContextPath + sowMaterialExcelPath;
		
			//filename = "PR_REQ" + "_" + prjId;
			ispMaterialsReportDetails = generateISPMaterialExcel(prjId,prId,locId);
			if(ispMaterialsReportDetails.getProjectDetailList().size()!=0)
			{	
				filename=ispMaterialsReportDetails.getProjectDetailList().get(0).getSapWbsCd()+"_"+ispMaterialsReportDetails.getProjectDetailList().get(0).getProjectName()+"_"+ispMaterialsReportDetails.getProjectDetailList().get(0).getPrName();
				filename=GeneralUtils.removeSpecialChar(filename);
			}
			else
			{
				filename = "PR_REQ_REP";
			}
			File file = File.createTempFile(filename, ".xls");
			String outputPath = file.getAbsolutePath();
			Map beans = new HashMap();
			beans.put("ispMaterialsReport", ispMaterialsReportDetails);
			XLSTransformer transformer = new XLSTransformer();
			transformer.transformXLS(inputFile, beans, outputPath);
			// file.delete();
			try {
				//response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
				response.setContentType("application/vnd.ms-excel");
				response.setHeader("Content-Disposition",
						"attachment; filename=" + filename + ".xls");

				BufferedInputStream in = new BufferedInputStream(
						new FileInputStream(file));
				
				// WORKAROUND TO CREATE THE HYPERLINK
				org.apache.poi.ss.usermodel.Workbook workbookTemplate = new HSSFWorkbook(in);
				List<QuoteModel> calcIspQuoteList = ispMaterialsReportDetails.getCalcIspQuoteList();
				int noOfRowToBeRemoved = calcIspQuoteList.size();
				org.apache.poi.ss.usermodel.Sheet sheetAt = workbookTemplate.getSheet("Purchase Requisition");
				int anchorRow_38 = 38;
				int countRow = 1;
				int quotecount=0;
				for (QuoteModel quoteModel : calcIspQuoteList) {
					sheetAt.shiftRows (anchorRow_38++, sheetAt.getLastRowNum()+1, 1);
				}
				CreationHelper createHelper = workbookTemplate.getCreationHelper();
				anchorRow_38 = 38;
				Cell cell = sheetAt.getRow(37).getCell(1);
				CellStyle cellStyle = workbookTemplate.createCellStyle(); //cell.getCellStyle();
				cellStyle.setBottomBorderColor(IndexedColors.BLACK.getIndex());
				cellStyle.setTopBorderColor(IndexedColors.BLACK.getIndex());
				cellStyle.setLeftBorderColor(IndexedColors.BLACK.getIndex());
				cellStyle.setRightBorderColor(IndexedColors.BLACK.getIndex());
				Font hlink_font = workbookTemplate.createFont();
		        hlink_font.setUnderline(Font.U_SINGLE);
		        hlink_font.setColor(IndexedColors.BLUE.getIndex());
		        hlink_font.setFontName("Arial");
		        hlink_font.setFontHeightInPoints((short) 12);
		        cellStyle.setFont(hlink_font);
				for (QuoteModel quoteModel : calcIspQuoteList) {
					quotecount=quotecount+1;
					Row row = sheetAt.getRow(anchorRow_38);
					Cell createCell = row.createCell(1);
					createCell.setCellValue(quoteModel.getQuoteDesc()+" "+quoteModel.getQuoteFilePath() );
					createCell.setCellStyle(cellStyle);
					sheetAt.addMergedRegion(new CellRangeAddress(anchorRow_38,anchorRow_38,1,5));
					HSSFRegionUtil.setBorderTop(CellStyle.BORDER_THIN, new CellRangeAddress(anchorRow_38,anchorRow_38,1,5), (HSSFSheet)sheetAt, (HSSFWorkbook)workbookTemplate);
					HSSFRegionUtil.setBorderLeft(CellStyle.BORDER_THIN, new CellRangeAddress(anchorRow_38,anchorRow_38,1,5), (HSSFSheet)sheetAt, (HSSFWorkbook)workbookTemplate);
					HSSFRegionUtil.setBorderRight(CellStyle.BORDER_THIN, new CellRangeAddress(anchorRow_38,anchorRow_38,1,5),(HSSFSheet) sheetAt, (HSSFWorkbook)workbookTemplate);
					HSSFRegionUtil.setBorderBottom(CellStyle.BORDER_THIN, new CellRangeAddress(anchorRow_38,anchorRow_38,1,5), (HSSFSheet)sheetAt,(HSSFWorkbook) workbookTemplate);
					HSSFHyperlink link = (HSSFHyperlink) createHelper.createHyperlink(Hyperlink.LINK_URL);
					link.setAddress(quoteModel.getQuoteFilePath());
					link.setShortFilename(quoteModel.getQuoteDesc());
					row.getCell(1).setHyperlink(link);
					anchorRow_38++;
				}
				sheetAt.showInPane((short)0, (short)0);
							
				//drop down coding starts here
				
				
			/*      // 1. create named range for a single cell using areareference
			      Name namedCell1 = sheetAt.getWorkbook().createName();
			      namedCell1.setNameName(parentName);
			      String reference1 = sname+"!$A$10:$C$10"; // area reference
			      namedCell1.setRefersToFormula(reference1);
			     */

				DataValidationHelper helper = null;
				DataValidationConstraint constraint = null;
				DataValidation validation = null;
				helper = sheetAt.getDataValidationHelper();
				constraint = helper.createFormulaListConstraint("$J$24:$J$29");
				// constraint =helper.createExplicitListConstraint(new
				// String[]{"8005250", "8005251",
				// "8005252","8005253","8005254","8005255"});

				HashMap<Integer, CalculatorModel> matreialMap = ispMaterialsReportDetails.getCalcIspMaterialMap();
				// for material and labor
				int startNumber = ISP_REPORT_CONTENT_ROW_NO + quotecount;
				int endNumber = ISP_REPORT_CONTENT_ROW_NO + quotecount;

				for (CalculatorModel calculatorModel : matreialMap.values()) {
					List<CalculatorModel> cvalues = calculatorModel.getChildren();
					for (CalculatorModel matModel : cvalues) {
						endNumber = endNumber + 1;
					}
					validation = helper.createValidation(constraint,
							new CellRangeAddressList(startNumber, endNumber - 1, 10, 10));
					sheetAt.addValidationData(validation);

					startNumber = endNumber + 2;
					endNumber = startNumber;
				}

				// for spares
				if (matreialMap.size() != 0) {
					startNumber = startNumber - 1;
					endNumber = startNumber;
				}
				List<CalculatorModel> calcIspSpareList = ispMaterialsReportDetails.getCalcIspSpares();
				for (CalculatorModel spareModel : calcIspSpareList) {
					endNumber = endNumber + 1;

				}
				if (calcIspSpareList.size() != 0) {
					validation = helper.createValidation(constraint,
							new CellRangeAddressList(startNumber, endNumber - 1, 10, 10));
					sheetAt.addValidationData(validation);
				}

				// for overheads
				startNumber = endNumber + 3;
				endNumber = startNumber;
				HashMap<Integer, CalculatorModel> ohMap = ispMaterialsReportDetails.getCalcIspcalcIspLabourOhMap();
				for (CalculatorModel calculatorModel : ohMap.values()) {
					List<CalculatorModel> cvalues = calculatorModel.getChildren();
					for (CalculatorModel matModel : cvalues) {
						endNumber = endNumber + 1;
					}
					validation = helper.createValidation(constraint,
							new CellRangeAddressList(startNumber, endNumber - 1, 10, 10));
					sheetAt.addValidationData(validation);
					startNumber = endNumber + 2;
					endNumber = startNumber;
				}

				BufferedOutputStream out = new BufferedOutputStream(response.getOutputStream());
				workbookTemplate.write(out);
				
				// start reading and writing data
//				byte[] buf = new byte[4 * 1024];
//				int bytesRead;
//				while ((bytesRead = in.read(buf)) != -1) {
//					out.write(buf, 0, bytesRead);
//				}
				out.flush();
				in.close();

			} finally {

				File dfile = new File(outputPath);
				if (dfile.exists()) {
					dfile.delete();
				}

			}
			

		} catch (Exception e) {

			e.printStackTrace();
		}
	}
	public ISPMaterialsReportDetails generateISPMaterialExcel(Integer prjId,Integer prId,Integer locId) {

		ISPMaterialsReportDetails ispMaterialsReportDetails = new ISPMaterialsReportDetails();

		try {

			
			LOGGER.info("loading prjId==" + prjId);

			Map matDtls = reportsRepository.getISPMaterialReportsDtls(prjId,prId,locId);
			// Map sowDtls=reportsRepository.getSOWReportsDtls(808);
			
			ispMaterialsReportDetails
					.setProjectDetailList((List<ProjectDetails>) matDtls
							.get("REF_HDR"));
			ispMaterialsReportDetails.setCalcIspQuoteList((List<QuoteModel>) matDtls.get("REF_QT"));
			ispMaterialsReportDetails.setCalcIspMaterial((List<CalculatorModel>) matDtls
					.get("REF_MAT"));
			ispMaterialsReportDetails.setCalcIspSpares((List<CalculatorModel>) matDtls
					.get("REF_SP"));
			ispMaterialsReportDetails.setCalcIspLabourOh((List<CalculatorModel>) matDtls
					.get("REF_LOH"));

			HashMap<Integer,CalculatorModel> hashMap = new HashMap<Integer, CalculatorModel>();
			
			for (CalculatorModel calculatorModel : ispMaterialsReportDetails.getCalcIspMaterial()) {
				if (!hashMap.containsKey(calculatorModel.getLocationId())) {
			
				    hashMap.put(calculatorModel.getLocationId(), calculatorModel);
				    hashMap.get(calculatorModel.getLocationId()).getChildren().add(calculatorModel);
				} else {
					hashMap.get(calculatorModel.getLocationId()).getChildren().add(calculatorModel);
				}
			}
			LOGGER.info("map size==************" + hashMap.size());
			ispMaterialsReportDetails.setCalcIspMaterialMap(hashMap);	
			
	HashMap<Integer,CalculatorModel> lbrhashMap = new HashMap<Integer, CalculatorModel>();
			
			for (CalculatorModel calculatorModel : ispMaterialsReportDetails.getCalcIspLabourOh()) {
				if (!lbrhashMap.containsKey(calculatorModel.getLocationId())) {
			
					lbrhashMap.put(calculatorModel.getLocationId(), calculatorModel);
					lbrhashMap.get(calculatorModel.getLocationId()).getChildren().add(calculatorModel);
				} else {
					lbrhashMap.get(calculatorModel.getLocationId()).getChildren().add(calculatorModel);
				}
			}
			LOGGER.info("map size==************" + hashMap.size());
			ispMaterialsReportDetails.setCalcIspcalcIspLabourOhMap(lbrhashMap);	
			
		} catch (Exception e) {

			e.printStackTrace();
		}
		return ispMaterialsReportDetails;

	}

}
