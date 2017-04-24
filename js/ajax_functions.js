/**
 * Created by claudia on 08.11.2016.
 */

function addNewTask(JSONString) {
    //console.log("in addNewTask funct");
    var posting = $.post( "http://demo8922849.mockable.io/test.php", {'action': 'addNewTask', 'json': JSONString} );
    posting.done(function( data ) {
        //console.log(" " + JSON.stringify(data));
    });
    posting.fail(function() {
        //console.log(" addNewTask has failed ");
    });
}

function getTasksByName(searchTerm) {
    $.get( "http://demo8922849.mockable.io/test.php", {'action': 'getTasksByName', 'searchTerm': searchTerm} )
        .done( function( data ) {
            //console.log(JSON.stringify(data));
            THESITENAME.MATCHING_TASKS.set(data);
            THESITENAME.MATCHING_TASKS.display();
        })
        .fail( function() {
            //console.log("getTasksByName failed");
        });
}

function getAllTasks() {
    var section = $("#all_tasks");
    THESITENAME.CURRENT_SECTION.set(section);
    $.get( "http://demo8922849.mockable.io/test.php", {'action': 'getAllTasks'} )
        .done( function( data ) {
            //console.log(JSON.stringify(data));
            THESITENAME.ALL_TASKS.setAllTasks(data);
            THESITENAME.ALL_TASKS.display();
        })
        .fail( function() {
            //console.log("getAllTasks failed");
        });
}

/*
function getAllTasksByFrequency(frequencyType) {
    var section = $("#all_tasks");
    var isFrequencyFilter = true;
    THESITENAME.CURRENT_SECTION.set(section);
    $.get( "http://demo8922849.mockable.io/test.php", {'action': 'getAllTasksByFrequency', 'frequency': 'weekly'} )
        .done( function( data ) {
            //console.log(JSON.stringify(data));
            THESITENAME.ALL_TASKS.setAllTasks(data, isFrequencyFilter, frequencyType);
            THESITENAME.ALL_TASKS.display(data, isFrequencyFilter, frequencyType);
        })
        .fail( function() {
            console.log("getAllTasksByFrequency failed");
        });
}
*/