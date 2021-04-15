async function getDataDB() {

    const dateRange = getStartAndEndDate();
    console.log(dateRange);
    const dataWithTime = '/data?&before=' + dateRange.endDate.dateInstance + '&after=' + dateRange.startDate.dateInstance;
    const response = await fetch(dataWithTime).then(res => {          
        return res.json();
    });    
    return response;
}

updateChartType()
document.getElementById('litepicker').value = '';
for (let i = 0; i < names.length; i++) {
    const checkbox = document.getElementById(names[i]);
    checkbox.checked = false;
    checkbox.addEventListener('change', () => {
        console.log(`Checkbox ${names[i]} changed.`)
        if (checkbox.checked) {
            selected[i] = true// dataloggers[i];
        } else {
            selected[i] = false;
        }

        updateChart()
    })
}

const backgroundColors = [            
'rgba(255, 99, 132, 0.2)',
'rgba(54, 162, 235, 0.2)',
'rgba(255, 206, 86, 0.2)',
'rgba(75, 192, 192, 0.2)',
'rgba(153, 102, 255, 0.2)',
'rgba(255, 159, 64, 0.2)']

const borderColors = [
'rgba(255, 99, 132, 1)',
'rgba(54, 162, 235, 1)',
'rgba(255, 206, 86, 1)',
'rgba(75, 192, 192, 1)',
'rgba(153, 102, 255, 1)',
'rgba(255, 159, 64, 1)']

let colorIndex = 0;

function updateChart() {
    chart.data.datasets = selected.map((dataset, index) => {
        if (!dataset) return null
        console.log(names[index]);
        console.log('---------');
        console.log(dataloggers[index]);
        colorIndex++;
        if (colorIndex > 5) {
            colorIndex = 0;
        }
        return {
            label: names[index],
            data: dataloggers[index],
            backgroundColor: backgroundColors[colorIndex],
            borderColor: borderColors[colorIndex],
            borderWidth: 1
        }
    }).filter((item) => item !== null);

    chart.update();
}

async function getCheckedData() {
    const data = await getDataDB();
    dataloggers = [data.Gas_Sample_No, data.CPU_Time, data.Fluid_Temp, 
    data.Fluid_pH, data.Gas_Temp, data.Gas_RH, data.Gas_Pressure, data.Gas_MQ4, data.Gas_MQ135];

    // set the time on the x axis
    chart.data.labels = data.xs;

    updateChart();
}

function updateChartType() {
    const chartType = document.getElementById('chartType');
    chartType.addEventListener('change', () => {
        const newType = document.getElementById("chartType").value;
        const oldData = chart.data.datasets;
        const oldLabels = chart.data.labels;

        chart.destroy();
        chart = new Chart(ctx, {
            type: newType,
            data: {
                labels: oldLabels,
                datasets: oldData
            },
            options: {
                responsive: false
            }
        })
    })
}