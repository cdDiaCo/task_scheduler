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
        getTasksByFrequency(frequency);
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
        },
        generatePagination: function(numOfColumns, numOfTaskRowsPerPage ) {
            var section = THESITENAME.CURRENT_SECTION.get();
            var sectionID = section.attr("id");

            var tasks = THESITENAME.ALL_TASKS.getTasks();

            var numOfMatchingTasks = tasks.length;
            var numOfPages = Math.floor(numOfMatchingTasks / (numOfColumns * numOfTaskRowsPerPage)) + 1;
            THESITENAME.DISPLAYED_TASKS.removePagination(section);
            for(var i=0; i<numOfPages; i++) {
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
            var section = THESITENAME.CURRENT_SECTION.get();
            if(requestedPage === 1) {
                section.find(".paginationLink").first().addClass("active");
            }

            section.find(".matchingTasks").empty();

            var taskWidth = THESITENAME.ALL_TASKS.get_taskWidth();
            var taskBtnMargin = taskWidth/10; // this means I like the margins to be one tenth of the taskWidth

            // generating the task buttons according to:
            //  the requested page number, num of available task spots in a page, and the number of total tasks
            var numOfAvailableTaskSpots = THESITENAME.ALL_TASKS.get_numOfAvailableTaskSpots();
            var tasks = THESITENAME.ALL_TASKS.getTasks();
            var start = (requestedPage-1)*(numOfAvailableTaskSpots);
            var availableSpotsPerPage = requestedPage*numOfAvailableTaskSpots;
            for (var i= start; i<tasks.length && i<availableSpotsPerPage; i++) {
                        section.find(".matchingTasks").append($('<input>')
                            .prop('type', 'button')
                            .val("" + tasks[i].taskName)
                            .addClass("taskButton")
                            .css({"width": taskWidth+"px", "margin-right": taskBtnMargin+"px", "margin-bottom": taskBtnMargin+"px"})
                        );
            }
        }
    }
}());

THESITENAME.ALL_TASKS = (function() {
    var allTasks;
    var filteredTasks = [];
    var isFrequencyFilter = false;
    var filterTagsArray = [];
    var numOfAvailableTaskSpots;
    return {
        setAllTasks: function(data) {
            allTasks = data;
        },
        getAllTasks: function() {
            return allTasks;
        },
        setFilteredTasks: function(data) {
            filteredTasks = data;
        },
        getFilteredTasks: function() {
            return filteredTasks;
        },
        setFrequencyFilter: function(bool) {
            isFrequencyFilter = bool;
        },
        getFrequencyFilter: function() {
            return isFrequencyFilter;
        },
        setFilterTagsArray: function(array) {
            filterTagsArray = array;
        },
        getFilterTagsArray: function() {
            return filterTagsArray;
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
        display: function() {
            var taskWidth = THESITENAME.ALL_TASKS.get_taskWidth();
            var section = THESITENAME.CURRENT_SECTION.get();
            var containerWidth = section.find(".matchingTasks").css("width");
            var numOfColumns = Math.floor( parseInt(containerWidth)/taskWidth ) - 1;
            // the next variable value is chosen by me, but at some point in the future it may become dynamic
            var numOfTaskRowsPerPage = 4;

            THESITENAME.ALL_TASKS.set_numOfAvailableTaskSpots( numOfColumns * numOfTaskRowsPerPage );
            THESITENAME.DISPLAYED_TASKS.generatePagination(numOfColumns, numOfTaskRowsPerPage);

            THESITENAME.DISPLAYED_TASKS.displayPage(1); // request results for the first page
        },
        addFilterTag: function(frequencyType) {
            $(".filterTagSection").append($('<div>')
                .addClass("filterTag")
                .append($('<span>')
                    .text("" + frequencyType)
                    .addClass("filterTagText"))
                .append($('<input>')
                    .prop('type', 'button')
                    .val("x")
                    .addClass("filterTagCloseBtn")
                    .on('click', function() {
                        THESITENAME.ALL_TASKS.removeFilterTag(this); }))
                );
        },
        removeFilterTag: function(elem) {
            $(elem).parent().remove();
            var frequencyType = ($(elem).siblings().text()).toLowerCase();

            var filterTagsArray = THESITENAME.ALL_TASKS.getFilterTagsArray();
            for(var i=0; i<filterTagsArray.length; i++) {
                if(filterTagsArray[i] === frequencyType) {
                    filterTagsArray.splice(i, 1);
                    console.log(filterTagsArray);
                    break;
                }
            }

            THESITENAME.ALL_TASKS.setFilterTagsArray(filterTagsArray);
            THESITENAME.ALL_TASKS.removeUnnecessaryFilteredTasks(frequencyType);
        },
        removeUnnecessaryFilteredTasks: function(frequencyType) {
            // this is used when the user cancels a filter tag
            // therefore the tasks associated with that filter tag must not be displayed
            var filteredTasks = THESITENAME.ALL_TASKS.getFilteredTasks();
            for(var i=0; i<filteredTasks.length;) {
                if( (filteredTasks[i].taskFrequency).toString() === frequencyType) {
                    filteredTasks.splice(i, 1);
                }
                else {
                    i++;
                }
            }

            THESITENAME.ALL_TASKS.setFilteredTasks(filteredTasks);
            console.log(filteredTasks);
            var filterTagsArray = THESITENAME.ALL_TASKS.getFilterTagsArray();
            if(filterTagsArray.length === 0) {
                //if no filter tags are applied, show all tasks
                THESITENAME.ALL_TASKS.setFrequencyFilter(false);
                THESITENAME.ALL_TASKS.display();
            }
            else {
                // show filtered tasks
                THESITENAME.ALL_TASKS.display();
            }
        },
        getTasks: function() {
            //this returns either allTasks or filteredTasks
            var isFrequencyFilter = THESITENAME.ALL_TASKS.getFrequencyFilter();
            var tasks;
            if(isFrequencyFilter) {
                tasks = THESITENAME.ALL_TASKS.getFilteredTasks();
            }
            else {
                tasks = THESITENAME.ALL_TASKS.getAllTasks();
            }
            return tasks;
        }

     }
}());