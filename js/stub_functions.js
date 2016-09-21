
function searchExistingTasks_ajax() {
    console.log("you have pressed...");
    var searchTerm = $(this).val();
    var matchedTasks = getMatchingTasks_serverSide(searchTerm);
    console.log(matchedTasks);
}

function getMatchingTasks_serverSide(searchTerm) {
    var allTasks = getAllTasks_serverSide();
    var matchedTasks = [];
    for (var i=0; i < allTasks.length; i++) {
        if( allTasks[i].indexOf(searchTerm) !== -1) {
            matchedTasks.push(allTasks[i]);
        }
    }

    return matchedTasks ? matchedTasks : "no results found" ;
}

function getAllTasks_serverSide() {
    var allTasks = ["spalat WC", "spalat masina", "deparazitare caine"];
    return allTasks;
}