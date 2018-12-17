function onSelectCrimeDesc(type){
    var form = $(type).parent().parent();
    var descDropDown = $(form).find(".crime_desc");

    switch (type.value) {

            case "BURGLARY":
                descDropDown.find('option').remove();

                var crimeDesc = ['BURGLARY, OTHER STRUCTURE: Day, Entry No Force', 'BURGLARY, OTHER STRUCTURE: Day, Entry No Force',
                'BURGLARY, OTHER STRUCTURE: Night, Entry By Force', 'BURGLARY, OTHER STRUCTURE: Day, Attempt',
                'BURGLARY, OTHER STRUCTURE: Unknown, Entry By Force', 'BURGLARY, OTHER STRUCTURE: Night, Entry No Force',
                'BURGLARY, RESIDENCE: Day, Entry No Force', 'BURGLARY, RESIDENCE: Unknown, Entry By Force',
                'BURGLARY, RESIDENCE: Night, Entry by Force', 'BURGLARY, RESIDENCE: Night, Attempt',
                'BURGLARY, RESIDENCE: Unknown, Entry No Force', 'BURGLARY, RESIDENCE: Day, Entry By Force',
                'BURGLARY, RESIDENCE: Night, Entry No Force', 'BURGLARY, OTHER STRUCTURE: Day, Entry By Force',
                'BURGLARY, OTHER STRUCTURE: Unknown, Entry No Force', 'BURGLARY, RESIDENCE: Day, Attempt',
                'BURGLARY, OTHER STRUCTURE: Night, Attempt', 'BURGLARY, OTHER STRUCTURE: Night, Attempt',
                'BURGLARY, OTHER STRUCTURE: Night, Attempt'];

                $.each(crimeDesc, function(index,value) {
                    descDropDown.append($("<option></option>")
                    .attr("value",value)
                    .text(value));
                });
            break;

            case "CRIMINAL HOMICIDE":
                descDropDown.find('option').remove();

                var crimeDesc = ['CRIMINAL HOMICIDE: Murder', 'DEPUTY INVOLVED SHOOTING/SUSPECT DEAD'];

                $.each(crimeDesc, function(index,value) {
                    descDropDown.append($("<option></option>")
                     .attr("value",value)
                        .text(value));
                });
            break;

            case "DRUNK DRIVING VEHICLE / BOAT":
                descDropDown.find('option').remove();

                var crimeDesc = ['DRUNK DRIVING - VEHICLE/BOAT: Alc/Drugs', 'DRUNK DRIVING - VEHICLE/BOAT: Alcohol at .08% Or Above',
                    'DRUNK DRIVING - VEHICLE/BOAT: Drugs Only', 'DRUNK DRIVING - VEHICLE/BOAT: Alcohol/Drugs (Injury/Death), Felony'];

                    $.each(crimeDesc, function(index,value) {
                        descDropDown.append($("<option></option>")
                        .attr("value",value)
                        .text(value));
                    });
            break;

            case "NARCOTICS":
                descDropDown.find('option').remove();

                var crimeDesc = ['Felony Transport. &/or Sale of Controlled Substance(excpt Marijuana)',
                    'Felony Transport. &/or Sale of Controlled Substance(excpt Marijuana)',
                    'Under The Influence Of Narcotic 11550 HS. Does Not Incl 647(f)PC',
                    'Felony Transport,Sales,Possess Marijuana,Concentrtd Cannabis/Hashsh',
                    'Misdemeanor Possessn of a Controlled Substance (excluding Marijuana)',
                    'Felony Possession of a Controlled Substance (excluding Marijuana)',
                    'NARCOTICS: Miscellaneous Felonies',
                    'Found Narcotics',
                    'NARCOTICS: Marijuana Misdemeanors (Less Than 1 oz)',
                    'NARCOTICS: Marijuana Misdemeanors (More Than 1 oz)' ];


                $.each(crimeDesc, function(index,value) {
                    descDropDown.append($("<option></option>")
                        .attr("value",value)
                        .text(value));
                });
            break;

        default:

            return;
    }

}
