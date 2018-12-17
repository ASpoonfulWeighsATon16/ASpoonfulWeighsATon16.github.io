package org.webproject.servlet;

import java.io.IOException;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.HashMap;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.webproject.servlet.DBUtility;

/**
 * Servlet implementation class HttpServlet
 */
@WebServlet("/HttpServlet")
public class HttpServlet extends javax.servlet.http.HttpServlet {
    private static final long serialVersionUID = 1L;

    /**
     * @see javax.servlet.http.HttpServlet#javax.servlet.http.HttpServlet()
     */
    public HttpServlet() {
        super();
    }

    /**
     * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
     */
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
    }

    /**
     * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
     */
    protected void doPost(HttpServletRequest request, HttpServletResponse
            response) throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        String tab_id = request.getParameter("tab_id");

        // create a report
        if (tab_id.equals("0")) {
            System.out.println("A report is submitted!");
            try {
                createIncident(request, response);
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }

        // query reports
        else if (tab_id.equals("1")) {
            try {
                queryReport(request, response);
            } catch (JSONException e) {
                // TODO Auto-generated catch block
                e.printStackTrace();
            } catch (SQLException e) {
                // TODO Auto-generated catch block
                e.printStackTrace();
            }
        }
    }

    private void createIncident(HttpServletRequest request, HttpServletResponse
            response) throws SQLException, IOException {

        DBUtility dbutil = new DBUtility();
        String sql;
        String unitid = "";
        String unitname = "";

        int incident_id = 0;
        int year = 2016;

        ResultSet lastID = dbutil.queryDB("select max(gid) from incidents");

       // ResultSet lastID = dbutil.queryDB("select gid from incidents");
        lastID.next();
        incident_id = lastID.getInt(1);
        incident_id = incident_id + 1;


        String inctdte = request.getParameter("inctdte");
        String increpodt = request.getParameter("increpodt");
        String address = request.getParameter("address");
        String lon = request.getParameter("longitude");
        String lat = request.getParameter("latitude");
        String crime_category = request.getParameter("crime_category");
        String description = request.getParameter("description");
        String gang_related = request.getParameter("gang_related");
        String unit_name = request.getParameter("unit_name");

        if (inctdte != null) {
            inctdte = "'" + inctdte + "'";
        }
        if (increpodt != null) {
            increpodt = "'" + increpodt + "'";
        }

        if (address != null) {
            address = "'" + address + "'";
        }
        if (crime_category != null) {
            crime_category = "'" + crime_category + "'";
        }

        if (description != null) {
            description = "'" + description + "'";
        }

        if (gang_related != null) {
            gang_related = "'" + gang_related + "'";
        }

        if (unit_name != null) {
            unitid = unit_name.substring(0,9);
            unitid = "'" + unitid + "'";
            unitname = unit_name.substring(10);
            unitname = "'" + unitname + "'";
        }

        //3824
        sql = "insert into incidents (gid, inctdte, increpodt, category, statdesc, address, gangrelat, unitid, unitname, year, geom" +
                ") values (" + incident_id + "," + inctdte + "," + increpodt + ","
                + crime_category + "," + description + "," + address + ","
                + gang_related + "," + unitid + "," + unitname + ","
                + year + ", ST_GeomFromText('POINT(" + lon + " " + lat + ")', 4326)" + ")";

        //System.out.println("Success! Report created.");
        System.out.println(sql);

        dbutil.modifyDB(sql);

        // response that the report submission is successful
        JSONObject data = new JSONObject();
        try {
            data.put("status", "success");
        } catch (JSONException e) {
            e.printStackTrace();
        }
        response.getWriter().write(data.toString());

    }  // end createIncident Function

    private void queryReport(HttpServletRequest request, HttpServletResponse
            response) throws JSONException, SQLException, IOException {
        JSONArray list = new JSONArray();


        String crime_type = request.getParameter("crime_type");
        String sql = "";

        System.out.println(crime_type);


        if(crime_type == null || crime_type.equals("All")){
            sql = "select gid, INCTDTE, INCREPODT, CATEGORY, STAT, " +
                    "STATDESC, ADDRESS, STREET,  CITY, ZIP, INCIDID, " +
                    "SEQ, GANGRELAT, UNITID, UNITNAME, DELETED, YEAR, " +
                    "ST_X(geom) as longitude, ST_Y(geom) as latitude from incidents ";
        }


       else if(crime_type.equals("DrunkDriving")){
             sql = "select gid, INCTDTE, INCREPODT, CATEGORY, STAT, " +
                    "STATDESC, ADDRESS, STREET,  CITY, ZIP, INCIDID, " +
                    "SEQ, GANGRELAT, UNITID, UNITNAME, DELETED, YEAR, " +
                    "ST_X(geom) as longitude, ST_Y(geom) as latitude from incidents " +
                    "Where CATEGORY = 'DRUNK DRIVING VEHICLE / BOAT'";
        }

        else if(crime_type.equals("Burglary")) {
            sql = "select gid, INCTDTE, INCREPODT, CATEGORY, STAT, " +
                    "STATDESC, ADDRESS, STREET,  CITY, ZIP, INCIDID, " +
                    "SEQ, GANGRELAT, UNITID, UNITNAME, DELETED, YEAR, " +
                    "ST_X(geom) as longitude, ST_Y(geom) as latitude from incidents " +
                    "Where CATEGORY = 'BURGLARY'";

        }
       else if(crime_type.equals("Narcotics")){
            sql = "select gid, INCTDTE, INCREPODT, CATEGORY, STAT, " +
                    "STATDESC, ADDRESS, STREET,  CITY, ZIP, INCIDID, " +
                    "SEQ, GANGRELAT, UNITID, UNITNAME, DELETED, YEAR, " +
                    "ST_X(geom) as longitude, ST_Y(geom) as latitude from incidents " +
                    "Where CATEGORY = 'NARCOTICS'";
        }

        else if(crime_type.equals("Homicide")){
            sql = "select gid, INCTDTE, INCREPODT, CATEGORY, STAT, " +
                    "STATDESC, ADDRESS, STREET,  CITY, ZIP, INCIDID, " +
                    "SEQ, GANGRELAT, UNITID, UNITNAME, DELETED, YEAR, " +
                    "ST_X(geom) as longitude, ST_Y(geom) as latitude from incidents " +
                    "Where CATEGORY = 'CRIMINAL HOMICIDE'";
        }

        DBUtility dbutil = new DBUtility();
        ResultSet res = dbutil.queryDB(sql);

        while (res.next()) {
            // add to response
            HashMap<String, String> m = new HashMap<String, String>();
            m.put("GID", res.getString("GID"));
            m.put("INCTDTE", res.getString("INCTDTE"));
            m.put("INCREPODT", res.getString("INCREPODT"));
            m.put("CATEGORY", res.getString("CATEGORY"));
            m.put("STAT", res.getString("STAT"));
            m.put("STATDESC", res.getString("STATDESC"));
            m.put("ADDRESS", res.getString("ADDRESS"));
            m.put("STREET", res.getString("STREET"));
            m.put("ZIP", res.getString("ZIP"));
            m.put("INCIDID", res.getString("INCIDID"));
            m.put("SEQ", res.getString("SEQ"));
            m.put("GANGRELAT", res.getString("GANGRELAT"));
            m.put("UNITID", res.getString("UNITID"));
            m.put("UNITNAME", res.getString("UNITNAME"));
            m.put("DELETED", res.getString("DELETED"));
            m.put("YEAR", res.getString("YEAR"));
            m.put("longitude", res.getString("longitude"));
            m.put("latitude", res.getString("latitude"));

            list.put(m);
        }

        response.getWriter().write(list.toString());
    }

}

/**

 public void main() throws JSONException {
 }
 }
 */