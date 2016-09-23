
function searchForExistingTasks_ajax() {
    var section = $("#search_tasks");
    var searchTerm = $(this).val();
    var matchedTasks;
    var displayedTaskButtons = section.find(".taskButton");

    if( searchTerm !== "" && searchTerm !== " " ) {
        //the search ter IS NOT an empty string
        matchedTasks = getMatchingTasks_serverSide(searchTerm);
        console.log(matchedTasks);
        displayExistingTasks(section, matchedTasks);
    }
    else {
        //the search term IS an empty string
        if(displayedTaskButtons.length > 0) {
            for (var i=0; i<displayedTaskButtons.length; i++) {
                removeTaskButton(displayedTaskButtons[i]);
            }
        }
        else {
            removeNoMatchingTasksText(section);
        }
    }
}

function displayNoMatchingTasksText(section) {
    section.find(".content_wrapper").append($('<p>')
        .text("no results were found")
        .addClass("noMatchingTasks"));

    THESITENAME.set_isDisplayedNoMatchingTasksText(true);
}

function removeNoMatchingTasksText(section) {
    section.find(".noMatchingTasks").remove();
    THESITENAME.set_isDisplayedNoMatchingTasksText(false);
}


function displayExistingTasks(section, matchedTasks) {

    checkForUnnecessaryTaskButtons(section, matchedTasks);

    if( (!matchedTasks || matchedTasks.length === 0)  && !THESITENAME.isDisplayedNoMatchingTasksText() ) {
        // there are no matched tasks
        displayNoMatchingTasksText(section);
    }
    else {
        //there are matched tasks
        for (var i=0; i<matchedTasks.length; i++) {
            if(! isTaskButtonDisplayed(section, matchedTasks[i]) ) {
                addTaskButton(section, matchedTasks[i]);
            }
        }
    }
}

function checkForUnnecessaryTaskButtons(section, matchedTasks) {
    var displayedTaskButtons = section.find(".taskButton");

    if( matchedTasks.length === 0 ) {
        //there are no matched tasks, so remove the ones remained from the previous search term
        displayedTaskButtons.remove();
    }
    else {

        if( THESITENAME.isDisplayedNoMatchingTasksText() ) {
            // this text is present from the previous search but now there are matching tasks
            // and the text has to be removed
            removeNoMatchingTasksText(section);
        }

        if ( displayedTaskButtons.length > matchedTasks.length ) {
            console.log("there are unnecessary task buttons");
            // remove those displayed buttons that are unnecessary
            for (var i=0; i<displayedTaskButtons.length; i++) {
                var unnecessaryTask = false;

                for (var j=0; j<matchedTasks.length; j++) {
                    console.log("in the second for");

                    if( $(displayedTaskButtons[i]).val() === matchedTasks[j] ) {
                        console.log("matching found: " + $(displayedTaskButtons[i]).val() );
                        unnecessaryTask = false;
                        break;
                    }
                    else {
                        unnecessaryTask = true;
                    }
                }
                if (unnecessaryTask) {
                    console.log("unnecessary task found!");
                    removeTaskButton($(displayedTaskButtons[i]));
                }
            }
        }
    }
}

function isTaskButtonDisplayed(section, task) {
    var displayedTaskButtons = section.find(".taskButton");
    for (var i=0; i<displayedTaskButtons.length; i++) {
        if( $(displayedTaskButtons[i]).val() === task ) {
            return true;
        }
    }
    return false;
}

function addTaskButton(section, task) {
    section.find(".content_wrapper").append($('<input>')
        .prop('type', 'button')
        .val("" + task)
        .addClass("taskButton")
    );
}

function removeTaskButton(task) {
    console.log("in remove task: " + $(task).val());
    //section.find(".taskButton[value='spalat WC']").remove();
    task.remove();
}

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
    var allTasks = ["spalat WC", "spalat masina", "sapun", "deparazitare caine"];
    return allTasks;
}