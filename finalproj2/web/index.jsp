<%@ page language="java" contentType="text/html; charset=ISO-8859-1" pageEncoding="ISO-8859-1"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
  <title>Web Project</title>

  <!-- Custom styles -->


  <!-- jQuery -->
  <script src="//code.jquery.com/jquery-1.11.3.min.js"></script>
  <script src="//code.jquery.com/jquery-migrate-1.2.1.min.js"></script>

  <!-- Bootstrap -->
  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css">
  <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/js/bootstrap.min.js"></script>
  <link rel="stylesheet" href="css/style.css">


  <script type="text/javascript" src="https://maps.googleapis.com/maps/api/js?key=api_here&libraries=places,visualization,geometry"></script>



</head>

<body>


<h2><strong>Los Angeles County Crime Incidents</strong></h2>


 <div class="container-fluid">


    <div class="row">

      <div class="sidebar col-xs-4">
          <ul class="nav nav-tabs">
          <li class="active"><a href="#current_crimes" data-toggle="tab">Current Crimes</a></li>
          <li><a href="#submit_crime" data-toggle="tab">Submit an Incident</a></li>
        </ul>


        <div class="tab-content ">

        <!-- Query Report Tab Panel -->
      <div class="tab-pane active" id="current_crimes">
        <form id = "query_form">

          <div id ="crimeSymbols">
            <label>Incident Symbols or Heatmap:</label>
            <label><input type="radio" name="crimeSymbols" value="symbols">&nbspSymbols</label>
            <label><input type="radio" name="crimeSymbols" checked="checked" value="heatMap">&nbspHeatmap</label>
            <p></p>
          </div>

          <label>Type of Crime:</label>
            <select id="crime_type" name="crime_type">
              <option value="All">All Crimes</option>
              <option value="DrunkDriving">Drunk Driving</option>
              <option value="Burglary">Burglary</option>
              <option value="Narcotics">Narcotics</option>
              <option value="Homicide">Homicide</option>
            </select>
            <p></p>

          <div id="demo_layer">
            <label>Show Demographic Layers:</label>
            <label><input type="radio" name="demo_layer" value="t">&nbspOn</label>
            <label><input type="radio" name="demo_layer" checked="checked" value="f">&nbspOff</label>
            <p></p>
          </div>

          <div id="demo_attribute">
            <label>Demographic Layer:</label>
            <select id="demo_dropdown" name="demo_attribute">
              <option value="medinc">Median Household Income</option>
              <option value="povu18">Poverty Level: Population Under Age 18</option>
              <option value="povall">Poverty Level: Total Population</option>
              <option value="AgeU14">Share of Population Under Age 15</option>
              <option value="Age1519">Share of Population Age 15 to 19</option>
              <option value="Age2024">Share of Population Age 20 to 24</option>
              <option value="Age2544">Share of Population Age 25 to 44</option>
              <option value="Ag4564">Share of Population Age 45 to 64</option>
              <option value="Age65Ovr">Share of Population Age 65 and Over</option>
              <option value="lthigh">Highest Ed.: Less than High School</option>
              <option value="highsch">Highest Ed.: High School Graduate</option>
              <option value="smeasso">Highest Ed.: Some College or Associate's Degree</option>
              <option value="bachigh">Highest Ed.: Bachelor's Degree or Higher</option>
            </select>
            <p></p>
          </div>

          <div>
            <label>Create Five Mile Buffer Around Address:</label>
            <input id="autocomplete" placeholder="Address">
            <p></p>
          </div>

          <div id="support_layer">
            <label>Show Support Organizations:</label>
            <label><input type="radio" name="support_layer" value="t">&nbspOn</label>
            <label><input type="radio" name="support_layer" checked="checked" value="f">&nbspOff</label>
            <p></p>
          </div>

          <p></p>
          <p></p>

          <a href="data/References.pdf" target="_blank"><h5>Data Sources</h5></a>


        </form>
      </div>

        <!-- Create Incident Tab Panel -->
        <div class="tab-pane" id="submit_crime">
          <form id = "create_form">
            <p></p>
            <div><label>Incident Date:&nbsp</label><input placeholder="2016-01-01" id="inctdte" name="inctdte"></div>
            <div><label>Reporting Date:&nbsp</label><input placeholder="2016-01-01" id="increpodt" name="increpodt"></div>
            <p></p>

            <div><label>Crime Category:</label>
              <select onchange="onSelectCrimeDesc(this)" id="crime_category" name="crime_category">
                <option value="BURGLARY">BURGLARY</option>
                <option value="CRIMINAL HOMICIDE">CRIMINAL HOMICIDE</option>
                <option value="DRUNK DRIVING VEHICLE / BOAT">DRUNK DRIVING VEHICLE / BOAT</option>
                <option value="NARCOTICS">NARCOTICS</option>
              </select>
            </div>
            <p></p>

            <div><label>Crime Description:</label>
              <select class="crime_desc" name="description">
                <option value="BURGLARY, OTHER STRUCTURE: Day, Entry No Force">BURGLARY, OTHER STRUCTURE: Day, Entry No Force</option>
                <option value="BURGLARY, OTHER STRUCTURE: Night, Entry By Force">BURGLARY, OTHER STRUCTURE: Night, Entry By Force</option>
                <option value="BURGLARY, OTHER STRUCTURE: Day, Attempt">BURGLARY, OTHER STRUCTURE: Day, Attempt</option>
                <option value="BURGLARY, OTHER STRUCTURE: Unknown, Entry By Force">BURGLARY, OTHER STRUCTURE: Unknown, Entry By Force</option>
                <option value="BURGLARY, OTHER STRUCTURE: Night, Entry No Force">BURGLARY, OTHER STRUCTURE: Night, Entry No Force</option>
                <option value="BURGLARY, RESIDENCE: Day, Entry No Force">BURGLARY, RESIDENCE: Day, Entry No Force</option>
                <option value="BURGLARY, RESIDENCE: Unknown, Entry By Force">BURGLARY, RESIDENCE: Unknown, Entry By Force</option>
                <option value="BURGLARY, RESIDENCE: Night, Entry by Force">BURGLARY, RESIDENCE: Night, Entry by Force</option>
                <option value="BURGLARY, RESIDENCE: Night, Attempt">BURGLARY, RESIDENCE: Night, Attempt</option>
                <option value="BURGLARY, RESIDENCE: Unknown, Entry No Force">BURGLARY, RESIDENCE: Unknown, Entry No Force</option>
                <option value="BURGLARY, RESIDENCE: Day, Entry By Force">BURGLARY, RESIDENCE: Day, Entry By Force</option>
                <option value="BURGLARY, RESIDENCE: Night, Entry No Force">BURGLARY, RESIDENCE: Night, Entry No Force</option>
                <option value="BURGLARY, OTHER STRUCTURE: Day, Entry By Force">BURGLARY, OTHER STRUCTURE: Day, Entry By Force</option>
                <option value="BURGLARY, OTHER STRUCTURE: Unknown, Entry No Force">BURGLARY, OTHER STRUCTURE: Unknown, Entry No Force</option>
                <option value="BURGLARY, RESIDENCE: Day, Attempt">BURGLARY, RESIDENCE: Day, Attempt</option>
                <option value="BURGLARY, OTHER STRUCTURE: Night, Attempt">BURGLARY, OTHER STRUCTURE: Night, Attempt</option>
                <option value="BURGLARY, OTHER STRUCTURE: Night, Attempt">BURGLARY, OTHER STRUCTURE: Unknown, Attempt</option>
                <option value="BURGLARY, OTHER STRUCTURE: Night, Attempt">BURGLARY, RESIDENCE: Unknown, Attempt</option>
              </select>
            </div>
            <p></p>

            <div><label>Incident Address:</label>
              <input id="autocomplete_incident" placeholder="Incident Address">
            </div>
            <p></p>

            <div><label>Gang Related?</label>
              <label><input type="radio" name="gang_related" value="NO">&nbspYes</label>
              <label><input type="radio" name="gang_related" checked="checked" value="YES">&nbspNo</label>
            </div>
            <p></p>


            <div><label>Unit Number and Name:</label>
              <select id=unit_name name="unit_name">
                <option value="CA0190006 SANTA CLARITA VALLEY">CA0190006 SANTA CLARITA VALLEY</option>
                <option value="CA0190042 COMPTON">CA0190042 COMPTON</option>
                <option value="CA0190004 NORWALK">CA0190004 NORWALK</option>
                <option value="CA0190022 MALIBU/LOST HILLS">CA0190022 MALIBU/LOST HILLS</option>
                <option value="CA0190013 LAKEWOOD">CA0190013 LAKEWOOD</option>
                <option value="CA0190024 LANCASTER">CA0190024 LANCASTER</option>
                <option value="CA0190016 CARSON">CA0190016 CARSON</option>
                <option value="CA0190002 EAST LOS ANGELES">CA0190002 EAST LOS ANGELES</option>
                <option value="CA01900W9 PALMDALE">CA01900W9 PALMDALE</option>
                <option value="CA0190017 LOMITA">CA0190017 LOMITA</option>
                <option value="CA0190014 INDUSTRY">CA0190014 INDUSTRY</option>
                <option value="CA0190009 WEST HOLLYWOOD">CA0190009 WEST HOLLYWOOD</option>
                <option value="CA0190020 WALNUT">CA0190020 WALNUT</option>
                <option value="CA01900V3 CENTURY">CA01900V3 CENTURY</option>
                <option value="CA0190008 SAN DIMAS">CA0190008 SAN DIMAS</option>
                <option value="CA0190005 TEMPLE">CA0190005 TEMPLE</option>
                <option value="CA0190031 TRANSIT SERV BUR">CA0190031 TRANSIT SERV BUR</option>
                <option value="CA0190018 AVALON">CA0190018 AVALON</option>
                <option value="CA0190015 PICO RIVERA">CA0190015 PICO RIVERA</option>
                <option value="CA0190003 SOUTH LOS ANGELES">CA0190003 SOUTH LOS ANGELES</option>
                <option value="CA0190012 CRESCENTA VALLEY">CA0190012 CRESCENTA VALLEY</option>
                <option value="CA0190007 ALTADENA">CA0190007 ALTADENA</option>
                <option value="CA01900R7 CERRITOS">CA01900R7 CERRITOS</option>
                <option value="CA0190065 MARINA DEL REY">CA0190065 MARINA DEL REY</option>
                <option value="CA0190036 NARCOTICS BUREAU">CA0190036 NARCOTICS BUREAU</option>
                <option value="CA0190082 PDC-SOUTH">CA0190082 PDC-SOUTH</option>
                <option value="CA01900W8 EAST">CA01900W8 EAST</option>
                <option value="CA0190053 CRDF">CA0190053 CRDF</option>
                <option value="CA0190026 INMATE RECEPTION CENTR">CA0190026 INMATE RECEPTION CENTR</option>
                <option value="CA0190058 MCJ">CA0190058 MCJ</option>
                <option value="CA01900U5 COMMUNITY ORIENTED POLICING SVCS">CA01900U5 COMMUNITY ORIENTED POLICING SVCS</option>
                <option value="CA01900U2 TTCF">CA01900U2 TTCF</option>
                <option value="CA01900U1 ADMIN">CA01900U1 ADMIN</option>
                <option value="CA0190095 ADMIN">CA0190095 ADMIN</option>
                <option value="CA0190087 NCCF">CA0190087 NCCF</option>
                <option value="CA01900V4 WEST">CA01900V4 WEST</option>
                <option value="CA01900R5 COMMUNITY COLLEGE BUREAU">CA01900R5 COMMUNITY COLLEGE BUREAU</option>
                <option value="CA0190030 PDC-NORTH">CA0190030 PDC-NORTH</option>
                <option value="CA01900F4 COUNTY SERVICES BUR">CA01900F4 COUNTY SERVICES BUR</option>
                <option value="CA01900F3 PARKS BUREAU">CA01900F3 PARKS BUREAU</option>
                <option value="CA01900V1 TRAP">CA01900V1 TRAP</option>
              </select>
            </div>
            <p></p>

            <button type="submit" class="btn btn-default" id="report_submit_btn">
              Submit Incident
            </button>

          </form>
        </div>
      </div> <!-- tab content -->
    </div> <!-- sidebar -->

    <div id="map-canvas" class="col-xs-8"></div>


    </div> <!-- row -->
 </div>



  <script src="js/loadmap.js"></script>
  <script src="js/setFormValues.js"></script>




</body>
</html>

