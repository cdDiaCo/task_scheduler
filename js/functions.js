$(document).ready(function(){
    $(".triangleIconWrapper").click(rotateTriangleIcon);
    $("#search_box_wrapper").find("input").keyup(searchTasks);
    $("span.tip input").click(THESITENAME.CURRENT_SECTION.hideTipPermanently);
    $( "#datepicker" ).datepicker({
        dateFormat: "yy-mm-dd"
    });
    $(".datepicker_wrapper").click(showDatePicker);
    $("#addNewTaskForm").submit(submitAddNewTaskForm);
    getAllTasks();
    $( "select[name=frequency_filter]" ).change(function() {
        var frequency = $(this).find(":selected").text();
        getAllTasksByFrequency(frequency);
    });
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
            //console.log("in display - Matching-tasks");
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
            //console.log("in add - MAtching-tasks");
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
            //console.log("in removeUnnecessary - displayed tasks");
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
        },
        generatePagination: function(numOfMatchingTasks, numOfColumns, numOfTaskRowsPerPage ) {
            //console.log("in generatePagination - displayedTasks");
            var section = THESITENAME.CURRENT_SECTION.get();
            var sectionID = section.attr("id");
            var numOfPages = Math.floor(numOfMatchingTasks / (numOfColumns * numOfTaskRowsPerPage)) + 1;
            THESITENAME.DISPLAYED_TASKS.removePagination(section);
            for(var i=0; i<numOfPages; i++) {
                //console.log("numOfPages" + numOfPages);
                section.find(".pagination_wrapper ul").append($('<li>')
                                                        .append($('<a href="#' + sectionID + '">')
                                                            .click(changePage)
                                                            .addClass("paginationLink")
                                                            .append($('<span>')
                                                                .text(i+1))));
            }
        },
        removePagination: function(section) {
            section.find(".pagination_wrapper ul").empty();
        },
        displayPage: function(requestedPage) {
            //console.log("displayPAge - displayedd tasks");
            var taskWidth = THESITENAME.ALL_TASKS.get_taskWidth();
            var allTasks = THESITENAME.ALL_TASKS.getAllTasks();
            //console.log("allTAsks" + allTasks);
            var numOfAvailableTaskSpots = THESITENAME.ALL_TASKS.get_numOfAvailableTaskSpots();
            //console.log("numOfAvailableTAskSpots " + numOfAvailableTaskSpots);
            var section = THESITENAME.CURRENT_SECTION.get();
            section.find(".matchingTasks").empty();

            var taskBtnMargin = taskWidth/10; // this means I like the margins to be one tenth of the taskWidth

            // generating the task buttons according to:
            //  the requested page number, num of available task spots in a page, and the number of total tasks
            for (var i=(requestedPage-1)*(numOfAvailableTaskSpots);
                 i<allTasks.length && i< requestedPage*numOfAvailableTaskSpots;
                 i++) {
                //console.log("i: " + i);
                //console.log("alltasks.length: " + allTasks.length);
                section.find(".matchingTasks").append($('<input>')
                    .prop('type', 'button')
                    .val("" + allTasks[i].taskName)
                    .addClass("taskButton")
                    .css({"width": taskWidth+"px", "margin-right": taskBtnMargin+"px", "margin-bottom": taskBtnMargin+"px"})
                );
            }
        }
    }
}());

THESITENAME.ALL_TASKS = (function() {
    var allTasks;
    var numOfAvailableTaskSpots;
    return {
        setAllTasks: function(data) {
            allTasks = data;
        },
        getAllTasks: function() {
            return allTasks;
        },
        set_numOfAvailableTaskSpots: function(num) {
            numOfAvailableTaskSpots = num;
        },
        get_numOfAvailableTaskSpots: function() {
            return numOfAvailableTaskSpots;
        },
        get_taskWidth: function() {
            var contentWidth = parseInt($(".content_wrapper").css("width")); // get the width in px
            contentWidth = contentWidth/parseInt($("html").css("font-size")); //convert to em
            var taskWidth;
            switch(contentWidth) {
                case 51:
                    taskWidth = 160;
                    break;
                case 60: // his is to be updated for real situations
                    taskWidth = 170; // this is to be updated for real situations
                    break;
            }
            return taskWidth;
        },
        display: function(allTasks) {
            //console.log("display - all tasks");
            var taskWidth = THESITENAME.ALL_TASKS.get_taskWidth();
            var section = THESITENAME.CURRENT_SECTION.get();

            var containerWidth = section.find(".matchingTasks").css("width");
            var numOfColumns = Math.floor( parseInt(containerWidth)/taskWidth ) - 1;
            var numOfTaskRowsPerPage = 4;
            THESITENAME.ALL_TASKS.set_numOfAvailableTaskSpots( numOfColumns * numOfTaskRowsPerPage );

            THESITENAME.DISPLAYED_TASKS.generatePagination(allTasks.length, numOfColumns, numOfTaskRowsPerPage);
            section.find(".paginationLink").first().addClass("active");
            THESITENAME.DISPLAYED_TASKS.displayPage(1); // request results for the first page
        }
    }
}());