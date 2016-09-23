/**
 * Created by claudia on 12.09.2016.
 */

$(document).ready(function(){
    $(".triangleIconWrapper").click(rotateTriangleIcon);
    $("#search_box_wrapper").find("input").keyup(searchForExistingTasks_ajax);
});

var THESITENAME = (function() {
    var noMatchingTasksText = false;

    return {
        isDisplayedNoMatchingTasksText: function() {
            return noMatchingTasksText;
        },
        set_isDisplayedNoMatchingTasksText: function(newVal) {
            noMatchingTasksText = newVal;
        }
    };

}());


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

