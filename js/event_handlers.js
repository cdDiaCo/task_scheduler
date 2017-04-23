/**
 * Created by claudia on 08.11.2016.
 */

function submitAddNewTaskForm() {
    event.preventDefault();

    var fields = $( this ).serializeArray();
    var JSONObj = {};
    var readjustFrequencyFlag = false;
    $.each(fields, function(i, field) {
        JSONObj[field.name] = field.value;
        if(field.name === "readjust_frequency") {
            readjustFrequencyFlag = true;
        }
    });

    if(! readjustFrequencyFlag) {
        // if readjust_frequency check box is not checked, add the value false to this field
        JSONObj["readjust_frequency"] = "false";
    }

    var JSONString = JSON.stringify(JSONObj);

    addNewTask(JSONString);
}

function searchTasks() {
    var section = $("#search_tasks");
    THESITENAME.CURRENT_SECTION.set(section);
    var searchTerm = $(this).val();

    if( searchTerm !== "" && searchTerm !== " " ) {
        //the search term IS NOT an empty string
        getTasksByName(searchTerm);
    }
    else {
        //the search term IS an empty string
        var displayedTaskButtons = THESITENAME.DISPLAYED_TASKS.get();

        if(displayedTaskButtons.length > 0) {
            $(displayedTaskButtons).remove();
            THESITENAME.CURRENT_SECTION.hideTipTemporarily();

        }
        else {
            THESITENAME.NO_MATCHING_TASKS.remove();
        }
    }
}

function showDatePicker() { // this is for the calendar icon
    var widget = $( "#datepicker" ).datepicker( "widget").is(":visible");
    if(!widget) {
        $( "#datepicker" ).datepicker("show");
    }
}

function rotateTriangleIcon() {
    var triangleIcon =  $(this).find("i");
    var sectionContent = $(this).parent().next(".section_content");
    var contentWrapper = $(sectionContent).find(".content_wrapper");

    if( triangleIcon.hasClass("left") ) {
        triangleIcon.removeClass("left");
        sectionContent.removeClass("closed");
        sectionContent.addClass("open");
        setTimeout(function() {
            contentWrapper.fadeToggle(500);
        }, 700);
    }
    else {
        triangleIcon.addClass("left");
        sectionContent.removeClass("open");
        contentWrapper.fadeToggle(500, function() {
            sectionContent.addClass("closed");
        });
    }
}

function changePage() {
    var section = THESITENAME.CURRENT_SECTION.get();
    section.find(".paginationLink").removeClass("active");
    $(this).addClass("active");
    var requestedPage = parseInt($(this).text());
    THESITENAME.DISPLAYED_TASKS.displayPage(requestedPage);
}

function getTasksByFrequency(frequencyType) {
    var section = $("#all_tasks");
    THESITENAME.CURRENT_SECTION.set(section);
    var allTasks = THESITENAME.ALL_TASKS.getAllTasks();
    var filteredTasks = [];
    for(var i=0; i<allTasks.length; i++) {
        if( (allTasks[i].taskFrequency).toString() === frequencyType.toLowerCase() ) {
            filteredTasks.push(allTasks[i]);
        }
    }
    console.log(filteredTasks);
    THESITENAME.ALL_TASKS.setFilteredTasks(filteredTasks);
    THESITENAME.ALL_TASKS.setFrequencyFilter();
    THESITENAME.ALL_TASKS.display(filteredTasks, frequencyType);
}


