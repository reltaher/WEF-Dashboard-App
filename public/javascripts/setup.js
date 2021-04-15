var names = ['Gas_Sample_No', 'CPU_Time', 'Fluid_Temp', 'Fluid_pH', 'Gas_Temp', 'Gas_RH', 'Gas_Pressure', 'Gas_MQ4', 'Gas_MQ135'];

var selected = names.map(() => null);
var ctx = document.getElementById('myChart').getContext('2d');
var chart = new Chart(ctx, {
    type: document.getElementById("chartType").value,
    data: {
        datasets: [

        ]
    },
    options: {
        responsive: false
    }
});

var dataloggers = [];