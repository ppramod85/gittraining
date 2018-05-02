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
package com.immco.d3.web.repository;

import java.io.IOException;
import java.io.InputStream;
import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.Date;
import java.util.List;
import java.util.Properties;

import javax.mail.MessagingException;

import oracle.jdbc.OracleTypes;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.immco.d3.core.repository.StoredProcDefinitionRepository;
import com.immco.d3.web.model.InsStatRef;
import com.immco.d3.web.model.SchedulerDtlRef;
import com.immco.d3.web.model.SchedulerGridRef;
import com.immco.d3.web.model.UserSchedulerRef;
import com.immco.pce.util.EmailBean;

@Repository
public class ClarityPceRepositoryImpl 
		implements ClarityPceRepository {

	public static final String MAIL_CC_RECEPIENTS = "caPush.cc.recepients";
	public static final String MAIL_TO_RECEPIENTS = "caPush.to.recepients";
	public static final String PCE_DATABASE_URL = "app.jdbc.url";
	public static final String PCE_DATABASE_USERNAME = "app.jdbc.username";
	public static final String PCE_DATABASE_PASSWORD = "app.jdbc.password";
	public static final String PCE_DATABASE_DRIVER = "app.jdbc.driverClassName";
	public static final String CA_DATABASE_URL = "ca.database.url";
	public static final String CA_DATABASE_USERNAME = "ca.database.username";
	public static final String CA_DATABASE_PASSWORD = "ca.database.password";
	public static final String CA_DATABASE_DRIVER = "ca.database.driver";
	public static final String CA_SYNC_FROM = "ca.sync.from";
	public static final String CONFIG_PROPERTIES = "config.properties";
	public static final String QUARTZ_PROPERTIES = "quartz.properties";

	/** The Constant LOGGER. */
	private static final Logger LOGGER = LoggerFactory.getLogger(ClarityPceRepositoryImpl.class);
	
	@Autowired
	private StoredProcDefinitionRepository defRepo;
	
	/*@Autowired
	private QueryBuilder queryBuilder;
	*/
	
	@SuppressWarnings("unchecked")
	public UserSchedulerRef getUserSchedulerjob()
	{
		LOGGER.info("loading getUserSchedulerjob DAO");
		List<UserSchedulerRef> values = (List<UserSchedulerRef>) defRepo.find("f_scheduled_jobs",  new Object());// ret_data
		LOGGER.info("loading getUserSchedulerjob DAO=="+values.size());
		
		return values.get(0);
	}
	
	@SuppressWarnings("unchecked")
	public List<SchedulerGridRef> getschedulerGrid(Object... params)
	{
		LOGGER.info("loading getschedulerGrid DAO");
		List<SchedulerGridRef> values = (List<SchedulerGridRef>) defRepo.find("f_scheduler_grid_get", params);// ret_data
		LOGGER.info("loading getschedulerGrid DAO=="+values.size());
		
		return values;
	}
	
	@SuppressWarnings("unchecked")
	public List<SchedulerDtlRef> getschedulerDtl(Object... params)
	{
		LOGGER.info("loading getschedulerDtl DAO");
		List<SchedulerDtlRef> values = (List<SchedulerDtlRef>) defRepo.find("f_scheduler_grid_dtl", params);// ret_data
		LOGGER.info("loading getschedulerDtl DAO=="+values.size());
		
		return values;
	}

	public UserSchedulerRef getSyncPropertiesFromDb() {

		Properties prop = new Properties();
		InputStream input = null;

		String pceDatabaseUrl = null;
		String pceDatabaseDriver = null;
		String pceDatabaseUsername = null;
		String pceDatabasePwd = null;

		// Date lastExecOn =null;
		UserSchedulerRef syncProp = new UserSchedulerRef();

		try {

			String fileName ="config.properties";
			input = this.getClass().getClassLoader()
					.getResourceAsStream(fileName);

			// load a properties file
			prop.load(input);

			// get the property value and print it out
			pceDatabaseUrl = prop.getProperty("app.jdbc.url");
			pceDatabaseDriver = prop.getProperty("app.jdbc.driverClassName");
			pceDatabaseUsername = prop.getProperty("app.jdbc.username");
			pceDatabasePwd = prop.getProperty("app.jdbc.password");
			



		} catch (IOException ex) {
			LOGGER.error(ex.getMessage());
		} finally {
			if (input != null) {
				try {
					input.close();
				} catch (IOException e) {
					LOGGER.error(e.getMessage());
				}
			}
		}
		try {
			Class.forName(pceDatabaseDriver);
		} catch (Exception e) {
			LOGGER.error("Failed to load Oracle Driver." + e);
		}

		try {
			Connection tdsCon = DriverManager.getConnection(pceDatabaseUrl,
					pceDatabaseUsername, pceDatabasePwd);
			tdsCon.setAutoCommit(false);

			ResultSet res1 = null;
			CallableStatement cstmt1 = null;
			try {
				cstmt1 = tdsCon.prepareCall("{? = call F_Scheduled_Jobs()}");
				cstmt1.registerOutParameter(1, OracleTypes.CURSOR);
				cstmt1.execute();
				res1 = (ResultSet) cstmt1.getObject(1);

				while (res1.next()) {
					syncProp.setLastExecOnSchStr(res1
							.getString("last_exec_on_sch_str"));
					syncProp.setNextDueOnStr(res1.getString("next_due_on_str"));
					syncProp.setLastExecOnManStr(res1
							.getString("last_exec_on_man_str"));
					syncProp.setSchStatus(res1.getString("sch_status"));
					syncProp.setSchInterval(res1.getInt("sch_interval"));
					syncProp.setSysDate(res1.getString("sys_date"));
					
					LOGGER.info("Inside F_Scheduled_Jobs==manual=="+syncProp.getLastExecOnManStr()+"==scheduler=="+syncProp.getLastExecOnSchStr());
					
				}
				cstmt1.close();
				cstmt1 = null;
			} catch (Exception e) {
				LOGGER.error(e.getMessage());
			} finally {
				if (cstmt1 != null) {
					cstmt1.close();
				}
				//added on july 14 2015 leak fix
				//if (res1 != null) {
				//	res1.close();
				//}
				if(tdsCon!=null)
	        	{
	        		try {
	        			tdsCon.close();
					} catch (SQLException e) {
						// TODO Auto-generated catch block
						LOGGER.error(e.getMessage());
					}
	        	}
			}
		} catch (Exception e) {
			LOGGER.error(e.getMessage());
		}
		return syncProp;

	}
	
	@Override
	public InsStatRef pullClarityData(int inAction) {
		LOGGER.info("inside pullClarityData "+inAction+" at "+new Date());
		// load db properties
		Properties prop =null;
		Connection tdsCon = null;
		Connection clarityCon = null;
		InsStatRef caInsRef = null;
		InsStatRef caDateInsRef = null;
		//Statement select = null;
		//PreparedStatement insert =null;
		//ResultSet result=null;

		try {
			
			prop= loadDBProperties();
			try {
				Class.forName(prop.getProperty(PCE_DATABASE_DRIVER));
			} catch (Exception e) {
				LOGGER.info("Failed to load Oracle Driver." + e);
			}

			tdsCon = DriverManager.getConnection(
					prop.getProperty(PCE_DATABASE_URL),
					prop.getProperty(PCE_DATABASE_USERNAME),
					prop.getProperty(PCE_DATABASE_PASSWORD));
			clarityCon = DriverManager.getConnection(
					prop.getProperty(CA_DATABASE_URL),
					prop.getProperty(CA_DATABASE_USERNAME),
					prop.getProperty(CA_DATABASE_PASSWORD)); 
			tdsCon.setAutoCommit(false);

			caInsRef = proceedPull(tdsCon,inAction);
			LOGGER.info("outside proceedPull with "+caInsRef.getStat());

			if ((caInsRef.getStat()!=null && caInsRef.getStat() == 0) ) {
				LOGGER.info("outside pullClarityData from proceedPull "+inAction+" with "+caInsRef.getStat()+"----"+caInsRef.getStMsg());


				return caInsRef;
			}
			
			caDateInsRef = insertSysncStartDate(tdsCon,inAction);
			if ((caDateInsRef.getStat()!=null && caDateInsRef.getStat() == 0) ) {
				LOGGER.info("outside insertSysncStartDate "+inAction+" with "+caDateInsRef.getStat()+"----"+caInsRef.getStMsg());


				return caDateInsRef;
			}
			LOGGER.info("outside insertSysncStartDate "+inAction+" with "+caDateInsRef.getStat()+"----"+caInsRef.getStMsg());

			InsStatRef caTimeInsRef = new InsStatRef();
			// set status running
			Statement st =null;
			try {
				 st = tdsCon.createStatement();
				st.executeUpdate("TRUNCATE TABLE tds_pce_view");
				LOGGER.info("TRUNCATED tds_pce_view not Blocked");
			} catch (Exception e1) {
				LOGGER.info("Inside catch of truncate tds_pce_view="+e1.getMessage());
				caTimeInsRef.setStat(0);
				//caInsRef.setStMsg("The previous sync is still running or terminated abnormally.Please wait and try after few minutes.");
				caTimeInsRef.setStMsg(e1.getMessage());

				return caInsRef;
				
			}finally{
				st.close();
				}
			
			LOGGER.info("Truncate completed");

			PreparedStatement insert = tdsCon
					.prepareStatement("INSERT INTO tds_pce_view(PROJECT_NAME,"
							+ "PROJECT_CODE,"
							+ "PROJECT_START,"
							+ "PROJECT_DESCRIPTION,"
							+ "PROJECT_STATUS,"
							+ "PROJECT_SCOPE,"
							+ "BSE_OWNER,"
							+ "DESIGN_ESTIMATE_USER,"
							+ "OSPE_OWNER,"
							+ "CONSTRUCTION_ESTIMATE_USER,"
							+ "OSP_CONSTRUCTION_OWNER,"
							+ "CONSTRUCTION_PROJECT_TYPE,"
							+ "PROJECT_EXPEDITE,"
							+ "STATE_CODE,"
							+ "COMPANY_CODE,"
							+ "COMPANY_NAME,"
							+ "MARKET_SEGMENT_CODE,"
							+ "MARKET_SEGMENT,"
							+ "EXCHANGE_CODE,"
							+ "EXCHANGE_NAME,"
							+ "EXCHANGE_SAP_SITE,"
							+ "LOCATION_CODE,"
							+ "LOCATION_NAME,"
							+ "BSE_PROJECT_TYPE,"
							+ "OSP_CONST_CONTRACTOR_CODE,"
							+ "OSP_CONST_CONTRACTOR,"
							+ "OSP_ENG_CONSULTANT,"
							+ "ISP_CONST_CONTRACTOR,"
							+ "ISP_ENG_CONSULTANT,"
							+ "WBS_CODE,"
							+ "TECH_APPROVAL_STATUS,"
							+ "TECH_APPROVAL_DATE,"
							+ "TECH_APPROVER_TYPE,"
							+ "TECH_APPROVERS,"
							+ "OSPE_EP_COMPLETED,"
							+ "BSE_EP_COMPLETED,"
							+ "OSP_CLOSING_PKG_COMPLETED,"
							+ "ISP_CONST_CONTRACTOR_CODE,"
							+ "CLUSTER_CODE,"
							+ "CLUSTER_NAME,"
							+ "PROJECT_ACTIVE,"
							+ "OSP_CONTRACT_TYPE,"
							+ "PROJECT_INFO,"
							+ "ISPC_OWNER,"
							+ "IPNE_OWNER,BSE_OWNER_TN,EXCHANGE_SAP_COST_CENTER,PRJ_MGR,PRJ_MGR_TN,PRJ_OWNER,ISPC_OWNER_TN) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)");

			Statement select = clarityCon.createStatement();
			ResultSet result = select
					.executeQuery("SELECT * FROM "
							+ prop.getProperty(CA_SYNC_FROM)
							+ " WHERE project_code IS NOT NULL AND wbs_code IS NOT NULL");
			LOGGER.info("select from clarity completed");

			int recordCount = 0;
			
			while (result.next()) {
				try {
					int pos = 0;
					
					insert.setString(++pos, result.getString("PROJECT_NAME"));
					insert.setString(++pos, result.getString("PROJECT_CODE"));
					insert.setDate(++pos, result.getDate("PROJECT_START"));
					insert.setString(++pos,
							result.getString("PROJECT_DESCRIPTION"));
					insert.setString(++pos, result.getString("PROJECT_STATUS"));
					insert.setString(++pos, result.getString("PROJECT_SCOPE"));
					insert.setString(++pos, result.getString("BSE_OWNER"));
					insert.setString(++pos,
							result.getString("DESIGN_ESTIMATE_USER"));
					insert.setString(++pos, result.getString("OSPE_OWNER"));
					insert.setString(++pos,
							result.getString("CONSTRUCTION_ESTIMATE_USER"));
					insert.setString(++pos,
							result.getString("OSP_CONSTRUCTION_OWNER"));
					insert.setString(++pos,
							result.getString("CONSTRUCTION_PROJECT_TYPE"));
					insert.setString(++pos, result.getString("PROJECT_EXPEDITE"));
					insert.setString(++pos, result.getString("STATE_CODE"));
					insert.setString(++pos, result.getString("COMPANY_CODE"));
					insert.setString(++pos, result.getString("COMPANY_NAME"));
					insert.setString(++pos, result.getString("MARKET_SEGMENT_CODE"));
					insert.setString(++pos, result.getString("MARKET_SEGMENT"));
					insert.setString(++pos, result.getString("EXCHANGE_CODE"));
					insert.setString(++pos, result.getString("EXCHANGE_NAME"));
					insert.setString(++pos,
							result.getString("EXCHANGE_SAP_SITE"));
					insert.setString(++pos, result.getString("LOCATION_CODE"));
					insert.setString(++pos, result.getString("LOCATION_NAME"));
					insert.setString(++pos,
							result.getString("BSE_PROJECT_TYPE"));
					insert.setString(++pos,
							result.getString("OSP_CONST_CONTRACTOR_CODE"));
					insert.setString(++pos,
							result.getString("OSP_CONST_CONTRACTOR"));
					insert.setString(++pos,
							result.getString("OSP_ENG_CONSULTANT"));
					insert.setString(++pos,
							result.getString("ISP_CONST_CONTRACTOR"));
					insert.setString(++pos,
							result.getString("ISP_ENG_CONSULTANT"));
					insert.setString(++pos, result.getString("WBS_CODE"));
					insert.setString(++pos,
							result.getString("TECH_APPROVAL_STATUS"));
					insert.setString(++pos,
							result.getString("TECH_APPROVAL_DATE"));
					insert.setString(++pos,
							result.getString("TECH_APPROVER_TYPE"));
					insert.setString(++pos, result.getString("TECH_APPROVERS"));
					insert.setDate(++pos, result.getDate("OSPE_EP_COMPLETED"));
					insert.setDate(++pos, result.getDate("BSE_EP_COMPLETED"));
					insert.setDate(++pos,
							result.getDate("OSP_CLOSING_PKG_COMPLETED"));
					insert.setString(++pos,
							result.getString("ISP_CONST_CONTRACTOR_CODE"));
					insert.setString(++pos, result.getString("CLUSTER_CODE"));
					insert.setString(++pos, result.getString("CLUSTER_NAME"));
					insert.setString(++pos, result.getString("PROJECT_ACTIVE"));
					insert.setString(++pos, result.getString("OSP_CONTRACT_TYPE"));
					insert.setString(++pos, result.getString("PROJECT_INFO"));
					insert.setString(++pos, result.getString("ISPC_OWNER"));
					insert.setString(++pos, result.getString("IPNE_OWNER"));
					insert.setString(++pos, result.getString("BSE_OWNER_TN"));
					insert.setString(++pos, result.getString("EXCHANGE_SAP_COST_CENTER"));
					insert.setString(++pos, result.getString("PRJ_MGR"));
					insert.setString(++pos, result.getString("PRJ_MGR_TN"));
					insert.setString(++pos, result.getString("PRJ_OWNER"));
					insert.setString(++pos, result.getString("ISPC_OWNER_TN"));
					insert.addBatch();
					recordCount++;
					if (recordCount >= 10000) {
						insert.executeBatch();
						LOGGER.info("Batch insert into tds_pce_view");
						insert.clearBatch();
						recordCount = 0;
					}
				} catch (Exception e) {
					LOGGER.info("Inside catch of insert to tds_pce_view 1="+e.getMessage());
					caInsRef.setStat(0);
			//		caInsRef.setStMsg("The previous sync is still running or terminated abnormally.Please wait and try after few minutes.");
					caInsRef.setStMsg(e.getMessage());
					return caInsRef;
				}
			}
			
			try {
				insert.executeBatch();
				LOGGER.info("insert into tds_pce_view completed");
			} catch (Exception e1) {
				LOGGER.info("Inside catch of insert to tds_pce_view 2="+e1.getMessage());
				caInsRef.setStat(0);
				//caInsRef.setStMsg("The previous sync is still running or terminated abnormally.Please wait and try after few minutes.");
				caInsRef.setStMsg(e1.getMessage());
				return caInsRef;
			}

			
			String recepients[] = getMailRecipients();

			ResultSet res = null;
			CallableStatement cstmt = null;
			try {
				cstmt = tdsCon
						.prepareCall("{call Ca_Update_Pce_Bulk(?,?,?,?,?)}");
				
				cstmt.setInt(1, caDateInsRef.getStat());
				cstmt.setInt(2, inAction);
				cstmt.setString(3, recepients[0]); // TO recipients
				cstmt.setString(4, recepients[1]); // CC recipients
				cstmt.registerOutParameter(5, OracleTypes.CURSOR);
				cstmt.execute();
				LOGGER.info("Executing Ca_Update_Pce_Bulk");

				res = (ResultSet) cstmt.getObject(5);

				while (res.next()) {
					int flag = res.getInt("flag");
					if (flag==0) {
						flag=1;
						String msgSubj = res.getString("msg_sub");
						String msgBody1 = res.getString("msg_bdy1");
						String msgBody2 = res.getString("msg_bdy2");
						sendFailedMessage(msgSubj, msgBody1, msgBody2);
						LOGGER.info("Outside sendFailedMessage");
					}
					
					caInsRef.setStat(flag);//removed (byte) from here 
					caInsRef.setStMsg(res.getString("msg"));
					
				}
				cstmt.close();
				cstmt = null;
			} catch (Exception e) {
				LOGGER.info("Inside catch A "+e.getMessage());
				caInsRef.setStat(0);
				caInsRef.setStMsg(e.getMessage());
			} finally {
				if (res != null) {
					res.close();
				}
				if (cstmt != null) {
					cstmt.close();
				}

			}
			tdsCon.commit();
			select.close();
			insert.close();



		} catch (Exception e) {
			LOGGER.info("Inside catch B "+e.getMessage());
			caInsRef.setStat(0);
			caInsRef.setStMsg(e.getMessage());
		} finally {
			// set run status
			
			try {
			//	tdsCon.commit();
			//	select.close();
			//	insert.close();
			//	result.close();
				tdsCon.close();
				clarityCon.close();
			} catch (SQLException e) {
				// TODO Auto-generated catch block
				LOGGER.info("Inside catch C "+e.getMessage());
			}
		}
		LOGGER.info("outside pullClarityData "+inAction+" with "+caInsRef.getStat());
		LOGGER.info("--message-- "+caInsRef.getStMsg());
		return caInsRef;
	}

	public Properties loadDBProperties() throws IOException {
		Properties prop = new Properties();
		InputStream input = null;
		try {

			String fileName = CONFIG_PROPERTIES;
			input = this.getClass().getClassLoader()
					.getResourceAsStream(fileName);
			
			// load a properties file
			prop.load(input);
		} catch (IOException ex) {
			LOGGER.error("Unable to load config.properties ::" + ex);
			throw ex;
		} finally {
			if (input != null) {
				try {
					input.close();
				} catch (IOException e) {
					LOGGER.error(e.getMessage());
				}
			}
		}
		return prop;
	}
	
	public void sendFailedMessage(String msgSubj, String msgBody1,
			String msgBody2) {
		LOGGER.info("Inside sendFailedMessage");

		String recepients[] = getMailRecipients();
		String toRecepients[] = null;
		if(recepients[0]!=null)
		{
			toRecepients=recepients[0].split(",");
		}
		
		String ccRecepients[] = null;
		if(recepients[1]!=null)
		{
			 ccRecepients=recepients[1].split(",");
		}
		EmailBean email = new EmailBean();
		try {
			email.sendMailToMany(toRecepients, ccRecepients, msgSubj,msgBody1
					+ "</br></br>" + msgBody2, "", "");

		} catch (MessagingException e) {
			// TODO Auto-generated catch block
			LOGGER.info("Inside sendFailedMessage MessagingException "+e.getMessage());
		}
		catch (Exception e1) {
			// TODO Auto-generated catch block
			LOGGER.info("Inside sendFailedMessage Exception "+e1.getMessage());

		}
	}
	
	public String[] getMailRecipients() {
		Properties prop = new Properties();
		InputStream input = null;
		String ccRecepients = null;
		String toRecepients = null;
		String[] recepients = null;
		try {

			String fileName = "messageResources.properties";
			input = this.getClass().getClassLoader()
					.getResourceAsStream(fileName);

			// load a properties file
			prop.load(input);

			// get the property value and print it out
			ccRecepients = prop.getProperty(MAIL_CC_RECEPIENTS).trim().length()==0?null:prop.getProperty(MAIL_CC_RECEPIENTS).trim();
			toRecepients = prop.getProperty(MAIL_TO_RECEPIENTS).trim().length()==0?null:prop.getProperty(MAIL_TO_RECEPIENTS).trim();
			recepients = new String[] { toRecepients, ccRecepients };

		} catch (IOException ex) {
			LOGGER.error(ex.getMessage());
		} finally {
			if (input != null) {
				try {
					input.close();
				} catch (IOException e) {
					LOGGER.error(e.getMessage());
				}
			}
		}
		return recepients;
	}
	public InsStatRef proceedPull(Connection tdsCon,int action) {
		ResultSet res1 = null;
		InsStatRef caInsRef = new InsStatRef();
		CallableStatement cstmt1 = null;
		try {
			cstmt1 = tdsCon.prepareCall("{? = call f_ca_sync_start(?)}");
			cstmt1.registerOutParameter(1, OracleTypes.CURSOR);
			cstmt1.setInt(2, action);
			cstmt1.execute();
			LOGGER.info("Inside proceedPull f_ca_sync_start");
			res1 = (ResultSet) cstmt1.getObject(1);
			while (res1.next()) {
				int stat = res1.getString("stat")==null?0:res1.getByte("stat");//chnages stat to int from byte
				String stMsg = res1.getString("st_msg");
				// function returns 0 if sync should not proceed
				//if (stat != 1) {
					caInsRef.setStat(stat);
					caInsRef.setStMsg(stMsg);
					break;
				//}
			}
			cstmt1.close();
			cstmt1 = null;
		} catch (Exception e) {
			LOGGER.error(e.getMessage());
		} finally {
			if(res1 !=null)
			{
				try {
					res1.close();
				} catch (SQLException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
			}
			if (cstmt1 != null) {
				try {
					cstmt1.close();
				} catch (SQLException e) {
					// TODO Auto-generated catch block
					LOGGER.error(e.getMessage());
				}
			}
		}
		
		return caInsRef;
	}
	
	public InsStatRef insertSysncStartDate(Connection tdsCon,int action) {
		ResultSet res1 = null;
		InsStatRef caInsRef = new InsStatRef();
		CallableStatement cstmt1 = null;
	try {
			cstmt1 = tdsCon.prepareCall("{call p_sync_start_ins(?,?)}");
			cstmt1.setInt(1, action);
			cstmt1.registerOutParameter(2, OracleTypes.CURSOR);
			cstmt1.execute();
			LOGGER.info("Inside proceedPull p_sync_start_ins");
			res1 = (ResultSet) cstmt1.getObject(2);
			while (res1.next()) {
				Integer stat = res1.getString("stat")==null?0:res1.getInt("stat");//chnages stat to int from byte
				String stMsg = res1.getString("st_msg");
				// function returns 0 if sync should not proceed
				//if (stat != 1) {
					caInsRef.setStat(stat);
					caInsRef.setStMsg(stMsg);
					break;
				//}
			}
			cstmt1.close();
			cstmt1 = null;
		} catch (Exception e) {
			LOGGER.error(e.getMessage());
		} finally {
			if(res1 !=null)
			{
				try {
					res1.close();
				} catch (SQLException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
			}
			if (cstmt1 != null) {
				try {
					cstmt1.close();
				} catch (SQLException e) {
					// TODO Auto-generated catch block
					LOGGER.error(e.getMessage());
				}
			}
		}
		
		return caInsRef;
	}


	@Override
	public int updateInterval(Object... params) {		
		LOGGER.info("loading updateInterval DAO");
		defRepo.find("p_ca_push_config_upd", params);
		return 0;
	}
	
	
	@Override
	public void toggleSchedular(Object...params) {
		LOGGER.info("loading toggleSchedular DAO");
		defRepo.find("p_ca_push_config_upd", params);
	}

	

	/*
	@Override
	public int getMode(int inAction) {
		
		 * JQCaPushManage inout= new JQCaPushManage(); //commented to avoid
		 * error at below line -midhila //inout.setInAction(inAction);
		 * inout.execute(factory); // org.jooq.Result<org.jooq.Record> result =
		 * inout.getReturnValue();
		 return 0;
	}
	

*/

}
