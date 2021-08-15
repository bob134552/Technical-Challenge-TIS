// Declare scottish bank holidays from https://www.gov.uk/bank-holidays#scotland
const bankHolidays = [
"01/01/2021",
"04/01/2021",
"02/04/2021",
"03/05/2021",
"31/05/2021",
"02/08/2021",
"30/11/2021",
"27/12/2021",
"28/12/2021",
];

$(document).ready(function () {
    $(function () {
        // Initialize datepicker
        $("#datepicker").datepicker({
            yearRange: "2021:2021",
            dateFormat: "dd/mm/yy",
            beforeShowDay: function (date) {
                var show = true;
                var day = date.getDay(); // disables Wednesdays

                if (day === 3) {
                    show = false;
                } else {
                    var string = $.datepicker.formatDate("dd/mm/yy", date); // disables Scottish bank holidays
                    if ($.inArray(string, bankHolidays) >= 0) {
                        show = false;
                    }
                }
                return [show, ""];
            },
        });
    });
});

// Stores csv data and parses into array of objects.
var data = [];
csvData = $.ajax({
    url: "",
    method: "GET",
    headers: {
    }}).then(response => {
        data.push($.csv.toObjects(response));
});

$("#datepicker").change(function () {
    var selectedDate = this.value;
    var nextAvailable, prevAvailable, nextDate, prevDate;
    var messageContainer = $("#message");

    if (data[0].find((x) => x.Day === selectedDate) === undefined) {
        // If date is available.
        messageContainer.html(`${this.value} is available to book.`);
    }
});