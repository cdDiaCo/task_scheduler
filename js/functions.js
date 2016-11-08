$(document).ready(function(){
    $(".triangleIconWrapper").click(rotateTriangleIcon);
    $("#search_box_wrapper").find("input").keyup(searchTasks);
    $("span.tip input").click(THESITENAME.CURRENT_SECTION.hideTipPermanently);
    $( "#datepicker" ).datepicker({
        dateFormat: "yy-mm-dd"
    });
    $(".datepicker_wrapper").click(showDatePicker);
    $("#addNewTaskForm").submit(submitAddNewTaskForm);
});

var THESITENAME = {};

THESITENAME.CURRENT_SECTION = (function() {
    var currentSection;

    return {
        set: function(newVal) {
            currentSection = newVal;
        },
        get: function() {
            return currentSection;
        },
        showTip: function() {
            currentSection.find(".tip").removeClass("hidden");
        },
        hideTipPermanently: function() {
            currentSection.find(".tip").addClass("neverShowAgain");
            currentSection.find(".neverShowAgain").removeClass("tip");
            currentSection.find(".neverShowAgain").hide();
        },
        hideTipTemporarily: function() {
            currentSection.find(".tip").addClass("hidden");
        }
    }
}());

THESITENAME.MATCHING_TASKS = (function() {
    var matchedTasks;

    return {
        set: function(newVal) {
            matchedTasks = newVal;
        },
        get: function() {
            return matchedTasks;
        },
        display: function() {
            THESITENAME.DISPLAYED_TASKS.removeUnnecessary(matchedTasks);

            if( (!matchedTasks || matchedTasks.length === 0)  && !THESITENAME.NO_MATCHING_TASKS.isDisplayed() ) {
                // there are no matched tasks
                THESITENAME.NO_MATCHING_TASKS.display();
            }
            else {
                //there are matched tasks
                for (var i=0; i<matchedTasks.length; i++) {
                    if(! THESITENAME.DISPLAYED_TASKS.isDisplayed(matchedTasks[i]) ) {
                        THESITENAME.MATCHING_TASKS.add(matchedTasks[i]);
                    }
                }
                THESITENAME.CURRENT_SECTION.showTip();
            }
        },
        add: function(task) {
            var section = THESITENAME.CURRENT_SECTION.get();
            section.find(".matchingTasks").append($('<input>')
                .prop('type', 'button')
                .val("" + task.taskName)
                .addClass("taskButton")
            );
        }
    }
}());

THESITENAME.NO_MATCHING_TASKS = (function() {
    // this is about the "no results were found" text
    var noMatchingTasksText = false;

    return {
        isDisplayed: function() {
            return noMatchingTasksText;
        },
        set: function(newVal) {
            noMatchingTasksText = newVal;
        },
        display: function() {
            var section = THESITENAME.CURRENT_SECTION.get();
            $(section).find(".content_wrapper").append($('<p>')
                .text("no results were found")
                .addClass("noMatchingTasks"));

            THESITENAME.NO_MATCHING_TASKS.set(true);
        },
        remove: function() {
            var section = THESITENAME.CURRENT_SECTION.get();
            $(section).find(".noMatchingTasks").remove();
            THESITENAME.NO_MATCHING_TASKS.set(false);
        }
    };
}());

THESITENAME.DISPLAYED_TASKS = (function() {

    return {
        get: function() {
            var section = THESITENAME.CURRENT_SECTION.get();
            return $(section).find(".taskButton");
        },
        isDisplayed: function(task) {
            var displayedTaskButtons = THESITENAME.DISPLAYED_TASKS.get();
            for (var i=0; i<displayedTaskButtons.length; i++) {
                if( $(displayedTaskButtons[i]).val() === task.taskName ) {
                    return true;
                }
            }
            return false;
        },
        removeUnnecessary: function(matchedTasks) {
            var displayedTaskButtons = THESITENAME.DISPLAYED_TASKS.get();

            if( matchedTasks.length === 0 ) {
                //there are no matched tasks, so remove the ones remained from the previous search term
                $(displayedTaskButtons).remove();
                THESITENAME.CURRENT_SECTION.hideTipTemporarily();
            }
            else {
                if( THESITENAME.NO_MATCHING_TASKS.isDisplayed() ) {
                    // this text is present from the previous search but now there are matching tasks
                    // and the text has to be removed
                    THESITENAME.NO_MATCHING_TASKS.remove();
                }
                if ( displayedTaskButtons.length > matchedTasks.length ) {
                    // remove those displayed buttons that are unnecessary
                    for (var i=0; i<displayedTaskButtons.length; i++) {
                        var unnecessaryTask = false;
                        for (var j=0; j<matchedTasks.length; j++) {
                            if( $(displayedTaskButtons[i]).val() === matchedTasks[j] ) {
                                unnecessaryTask = false;
                                break;
                            }
                            else {
                                unnecessaryTask = true;
                            }
                        }
                        if (unnecessaryTask) {
                            $(displayedTaskButtons[i]).remove();
                        }
                    }
                }
            }
        }
    }
}());

