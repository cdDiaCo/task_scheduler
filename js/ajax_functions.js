/**
 * Created by claudia on 08.11.2016.
 */

function addNewTask(JSONString) {
    var posting = $.post( "http://demo8922849.mockable.io/test.php", {'action': 'addNewTask', 'json': JSONString} );
    posting.done(function( data ) {
        console.log(" " + JSON.stringify(data));
    });
    posting.fail(function() {
        console.log(" addNewTask has failed ");
    });
}

function getTasksByName(searchTerm) {
    $.get( "http://demo8922849.mockable.io/test.php", {'action': 'getTasksByName', 'searchTerm': searchTerm} )
        .done( function( data ) {
            console.log(JSON.stringify(data));
            THESITENAME.MATCHING_TASKS.set(data);
            THESITENAME.MATCHING_TASKS.display();
        })
        .fail( function() {
            console.log("getTasksByName failed");
        });
}