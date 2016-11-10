/**
 * Created by claudia on 08.11.2016.
 */

function addNewTask(JSONString) {
    var posting = $.post( "http://demo8922849.mockable.io/test.php", {'action': 'addNewTask', 'json': JSONString} );
    posting.done(function( data ) {
        //console.log(" " + JSON.stringify(data));
    });
    posting.fail(function() {
        console.log(" addNewTask has failed ");
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
            console.log("getTasksByName failed");
        });
}

function getAllTasks() {
    var section = $("#all_tasks");
    THESITENAME.CURRENT_SECTION.set(section);
    $.get( "http://demo8922849.mockable.io/test.php", {'action': 'getAllTasks'} )
        .done( function( data ) {
            //console.log(JSON.stringify(data));
            THESITENAME.ALL_TASKS.setAllTasks(data);
            THESITENAME.ALL_TASKS.display(data);
        })
        .fail( function() {
            cosole.log("getAllTasks failed");
        });
}