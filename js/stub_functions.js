
function searchForExistingTasks_ajax() {
    var section = $("#search_tasks");
    THESITENAME.CURRENT_SECTION.set(section);
    var searchTerm = $(this).val();

    if( searchTerm !== "" && searchTerm !== " " ) {
        //the search ter IS NOT an empty string
        var matchedTasks = getMatchingTasks_serverSide(searchTerm);
        THESITENAME.MATCHING_TASKS.set(matchedTasks);
        THESITENAME.MATCHING_TASKS.display();
    }
    else {
        //the search term IS an empty string
        var displayedTaskButtons = THESITENAME.DISPLAYED_TASKS.get();

        if(displayedTaskButtons.length > 0) {
            $(displayedTaskButtons).remove();
        }
        else {
            THESITENAME.NO_MATCHING_TASKS.remove();
        }
    }
}

//
//THE NEXT FUNCTIONS ARE TO BE IMPLEMENTED ON THE SERVER SIDE
//

function getMatchingTasks_serverSide(searchTerm) {
    var allTasks = getAllTasks_serverSide();
    var matchedTasks = [];
    for (var i=0; i < allTasks.length; i++) {
        if( allTasks[i].indexOf(searchTerm) !== -1) {
            matchedTasks.push(allTasks[i]);
        }
    }
    return matchedTasks;
}

function getAllTasks_serverSide() {
    return ["spalat WC", "spalat masina", "sapun", "deparazitare caine"];
}

//
//END OF FUNCTIONS TO BE IMPLEMENTED ON THE SERVER SIDE
//
