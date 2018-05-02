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
package com.immco.d3.web.ui;

import java.util.Locale;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;

import com.immco.d3.web.model.InsStatRef;
import com.immco.d3.web.model.ProjectSearchModel;
import com.immco.d3.web.model.Roles;
import com.immco.d3.web.model.UserDtls;
import com.immco.d3.web.model.UserHome;
import com.immco.d3.web.service.NavigationService;
import com.immco.d3.web.service.ProjectService;
import com.immco.pce.auth.SecurityService;

// TODO: Auto-generated Javadoc
/**
 * Handles requests for the application home page.
 */
@Controller
public class LoginHomeController {
	/*
	 * @Autowired private LoginService loginService;
	 * 
	 * @Resource(name = "ehCacheManager") private EhCacheCacheManager
	 * ehCacheManager;
	 */

	@Autowired
	private NavigationService navigationService;

	@Autowired
	private SecurityService securityService;
	
	@Autowired
	private ProjectService projectService;

	/** The Constant LOGGER. */
	private static final Logger LOGGER = LoggerFactory
			.getLogger(LoginHomeController.class);

	/**
	 * Simply selects the home view to render by returning its name.
	 * 
	 * @param locale
	 *            the locale
	 * @param model
	 *            the model
	 * @return the string
	 */
	@RequestMapping(value = "/", method = RequestMethod.GET)
	public String viewCriteria(Locale locale,
			@ModelAttribute("UserHome") UserHome userHome) {

		LOGGER.info("loading getNavigationTree");

		Long userId = securityService.getLoggedOnUserId();
		navigationService.getTreeMenu(userId, userHome);
		return "home";
	}
	
	@RequestMapping(value = "/hld-rom", method = RequestMethod.GET)
	public String viewHLDrom(Locale locale,
			@ModelAttribute("UserHome") UserHome userHome, @ModelAttribute("InsStatRef") InsStatRef insStatRef,@RequestParam("wbs_code")String wbsCode,@RequestParam("project_code")String prjId) {

		LOGGER.info("loading");
		LOGGER.info("********project wbsCode="+wbsCode);
		LOGGER.info("********project Id="+prjId);
		Long userId = securityService.getLoggedOnUserId();
		navigationService.getTreeMenu(userId, userHome);
		InsStatRef stat=projectService.getPrjDetails(prjId,wbsCode); 
		insStatRef.setStat(stat.getStat());
		insStatRef.setStMsg(stat.getStMsg());
		LOGGER.info("********project Id="+insStatRef.getStat());
		return "home";
	}

	/*
	 * @RequestMapping(value = "/mainHome", method = RequestMethod.POST) public
	 * String mainHome(Locale locale, @ModelAttribute("UserHome") UserHome
	 * userHome) { LOGGER.info("Welcome home! The client locale is {}.",
	 * locale);
	 * 
	 * LOGGER.info("loading getNavigationTree"); //TODO user id should get from
	 * session //int userId = securityService.getLoggedOnUserId();
	 * 
	 * int userId=1; navigationService .getTreeMenu(userId,userHome);
	 * 
	 * return "home"; }
	 */

	@RequestMapping(value = "/setAsDefaultModule", method = RequestMethod.GET)
	@ResponseBody
	public InsStatRef setAsDefaultModule(Locale locale,
			@ModelAttribute("UserHome") UserDtls userDtls) {

		Long userId = securityService.getLoggedOnUserId();
		LOGGER.info("loading setAsDefaultModule---"
				+ userDtls.getDefaultModule() + "---" + userId);

		InsStatRef result = navigationService.setAsDefaultModule(userId,
				userDtls.getDefaultModule());

		return result;
	}

	@RequestMapping(value = "/setCurrentMainTab", method = RequestMethod.GET)
	@ResponseStatus(value = HttpStatus.OK)
	public void setCurrentMainTab(Locale locale,
			@ModelAttribute("Roles") Roles roles, HttpServletRequest request) {

		LOGGER.info("loading setCurrentMainTab----" + roles.getModule());
		HttpSession session = request.getSession(true);
		String moduleStr = null;
		switch (roles.getModule()) {
		case 6:
			moduleStr = "CATV";
			break;
		case 7:
			moduleStr = "OSP";
			break;
		case 8:
			moduleStr = "ISP";
			break;

		default:
			break;
		}

		session.setAttribute("currentMainTab", moduleStr);
		LOGGER.info("loading setCurrentMainTab----"
				+ session.getAttribute("currentMainTab"));
		// return "home";
	}
}
