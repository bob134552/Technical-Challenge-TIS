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
    url: "https://raw.githubusercontent.com/bob134552/Technical-Challenge-TIS/main/assets/events_2020.csv",
    method: "GET",
    headers: {
    }}).then(response => {
        data.push($.csv.toObjects(response));
});

$("#datepicker").change(function () {
    var nextAvailable, prevAvailable, nextDate, prevDate;
    var selectedDate = this.value;
    var messageContainer = $("#message");

    if (data[0].find((x) => x.Day === selectedDate) === undefined) {
        // If date is available.
        messageContainer.html(`${this.value} is available to book.`);
    } else if (data[0].find((x) => x.Day === selectedDate) !== undefined) {
        index = data[0].indexOf(data[0].find((x) => x.Day === selectedDate));
        band = data[0][index].Booking;

        for (var i = 1; ; i++) {
            nextAvailable = moment(selectedDate, "DDMMYYYY").add(i, "days");
            prevAvailable = moment(selectedDate, "DDMMYYYY").subtract(i, "days");

            // If either way is equal days from selected date.
            if (data[0].find((x) => x.Day === prevAvailable.format("L")) === undefined && bankHolidays.find(day => day === prevAvailable.format("L")) === undefined && prevAvailable.format("dddd") !== "Wednesday" &&
                data[0].find((x) => x.Day === nextAvailable.format("L")) === undefined && bankHolidays.find(day => day === nextAvailable.format("L")) === undefined && nextAvailable.format("dddd") !== "Wednesday") {
                nextDate = nextAvailable.format("L");
                prevDate = prevAvailable.format("L");
                messageContainer.html(`${this.value} is unavailable to book as ${band} is on this day. The next available date is ${prevDate} or ${nextDate}.`);
                break;
            // If next day is sooner than equal days from selected date.
            } else if (data[0].find((x) => x.Day === nextAvailable.format("L")) === undefined && bankHolidays.find(day => day === nextAvailable.format("L")) === undefined && nextAvailable.format("dddd") !== "Wednesday") {
                nextDate = nextAvailable.format("L");
                messageContainer.html(`${this.value} is unavailable to book as ${band} is on this day. The next available date is ${nextDate}.`);
                break;
            };
        };
    };
});