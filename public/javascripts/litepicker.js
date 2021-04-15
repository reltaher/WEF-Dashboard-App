const litepicker = new Litepicker({
    element: document.getElementById('litepicker'),
    format: 'YYYY-MM-DD\T00:00:00\Z',
    singleMode: false,
    setup: (picker) => {
        picker.on('preselect', (startDate, endDate) => {
            console.log(startDate)
            console.log(endDate)
            console.log('preselect called')
        }),

        picker.on('selected', (startDate, endDate) => {
            console.log('dates selected')
            getCheckedData();
            return {
                startDate,
                endDate
            }
        })
    }
});

function getStartAndEndDate() {
    return {
        startDate: litepicker.getStartDate(), 
        endDate: litepicker.getEndDate()
    }
}