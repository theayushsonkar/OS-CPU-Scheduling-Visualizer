//priority preferences change
let priorityPreference = 1; 
document.getElementById("priority-toggle-btn").onclick = () => {
    let currentPriorityPreference = document.getElementById("priority-preference").innerText;
    // currentPriorityPreference.classList.add("head");
    if (currentPriorityPreference == "High") {
        document.getElementById("priority-preference").innerText = "Low";
        // document.getElementById("priority-preference").classList.add("head");
    } else {
        document.getElementById("priority-preference").innerText = "High";
    }
    priorityPreference *= -1;
};

let selectedAlgorithm = document.getElementById('algo');

//TIME QUANTUM
function checkTimeQuantumInput() {
    let timequantum = document.querySelector("#time-quantum").classList;
    // timequantum.classList.add("cpu_utiz");
    if (selectedAlgorithm.value == 'rr') {
        timequantum.remove("hide");
    } else {
        timequantum.add("hide");
    }
}

function checkPriorityCell() {
    let prioritycell = document.querySelectorAll(".priority");
    if (selectedAlgorithm.value == "pnp" || selectedAlgorithm.value == "pp") {
        prioritycell.forEach((element) => {
            element.classList.remove("hide");
        });
    } else {
        prioritycell.forEach((element) => {
            element.classList.add("hide");
        });
    }
}

//CHECK IF TIME QUANTUM AND PRIORITY CELL IS REQUIRED FOR THE SELECTED ALGORITHM.
selectedAlgorithm.onchange = () => {
    checkTimeQuantumInput();
    checkPriorityCell();
};

//ONCHANGE EVENTLISTNER FOR INPUT
function inputOnChange() { 

    //SELECTS ALL THE <INPUT> ELEMENTS AND STORES THEM IN THE INPUTS VARIABLE.
    let inputs = document.querySelectorAll('input');
    inputs.forEach((input) => {
        if (input.type == 'number') {
            input.onchange = () => {
                let inputVal = Number(input.value);
                let isInt = Number.isInteger(inputVal);

                //IF THE INPUT'S PARENT NODE HAS A CLASS 'ARRIVAL-TIME' OR THE INPUT'S ID IS 'CONTEXT-SWITCH'
                if (input.parentNode.classList.contains('arrival-time') || input.id == 'context-switch') //MIN 0 : ARRIVAL TIME
                {
                    //THE ENTERED VALUE IS NOT AN INTEGER OR IS LESS THAN 0, IT SETS THE INPUT VALUE TO 0
                    if (!isInt || (isInt && inputVal < 0)) {
                        input.value = 0;
                    } 
                    
                    //OTHERWISE, IT KEEPS THE ENTERED VALUE.
                    else {
                        input.value = inputVal;
                    }

                } 
                
                //IT'S NOT 'ARRIVAL-TIME' OR 'CONTEXT-SWITCH'
                else //MIN 1 : TIME QUANTUM, PRIORITY, PROCESS TIME
                {

                    //THE ENTERED VALUE IS NOT AN INTEGER OR IS LESS THAN 1, IT SETS THE INPUT VALUE TO 1.
                    if (!isInt || (isInt && inputVal < 1)) {
                        input.value = 1;
                    } 
                    
                    //OTHERWISE, IT KEEPS THE ENTERED VALUE.
                    else {
                        input.value = inputVal;
                    }
                }
            }
        }
    });
}

inputOnChange();

//CALCULATIONS TO RESIZE THE BURST TIME ROWS' SIZE ON +/-
let process = 1;

function gcd(x, y) {
    while (y) {
        let t = y;
        y = x % y;
        x = t;
    }
    return x;
}

function lcm(x, y) {
    return (x * y) / gcd(x, y);
}

function lcmAll() {
    let result = 1;
    for (let i = 0; i < process; i++) {
        //USES AN INDEX CALCULATION BASED ON A LOOP VARIABLE 'I' TO ACCESS THE ROW, 
        //INDEX CALCULATION: 2*i+2
        //THEN GETS THE COUNT OF CELLS IN THAT ROW USING ".CELLS.LENGTH".
        result = lcm(result, document.querySelector(".main-table").rows[2 * i + 2].cells.length);
    }
    return result;
}

//UPDATE BURST TIME CELL COLSPAN
function updateColspan() {
    let totalColumns = lcmAll(); //TOTALCOLUMNS IS SET BY CALLING THE LCMALL() & COMPUTES LCM OF CELL LENGTHS WITHIN THE TABLE.
    let processHeading = document.querySelector("thead .process-time"); //RETRIEVES AN ELEMENT FROM THE <THEAD> SECTION WITH THE CLASS .PROCESS-TIME.
    processHeading.setAttribute("colspan", totalColumns); //COLSPAN = TOTALCOLUMS: ENSURES THE HEADING SPANS ACROSS CALCULATED TOTAL COLUMNS.
    
    //LOOPS THROUGH A CERTAIN NUMBER OF PROCESSES, REPRESENTED BY THE VARIABLE 'PROCESS' (DECLARED ABOVE AS 1).
    let processTimes = [];
    let table = document.querySelector(".main-table");
    
    //CALCULATES THE NUMBER OF CELLS IN THE CORRESPONDING ROWS (2 * I + 2)
    //AND PUSHES THIS LENGTH INTO THE PROCESSTIMES ARRAY.
    for (let i = 0; i < process; i++) {
        let row = table.rows[2 * i + 2].cells;
        processTimes.push(row.length);
    }

    //FOR EACH CELL IN THE PROCESS (ROW1[J + 3] AND ROW2[J])
    //SETS THE COLSPAN ATTRIBUTE BASED ON THE CALCULATED TOTALCOLUMNS DIVIDED BY THE RESPECTIVE PROCESS TIME (TOTALCOLUMNS / PROCESSTIMES[I]).
    for (let i = 0; i < process; i++) {
        let row1 = table.rows[2 * i + 1].cells;
        let row2 = table.rows[2 * i + 2].cells;
        for (let j = 0; j < processTimes[i]; j++) {
            row1[j + 3].setAttribute("colspan", totalColumns / processTimes[i]);
            row2[j].setAttribute("colspan", totalColumns / processTimes[i]);
        }
    }
}

//THIS SECTION DYNAMICALLY ADDS/REMOVE NEW CELLS TO THE TABLE WHEN THE BUTTON (+/-) IS CLICKED
//ALLOWING USERS TO INPUT 'IO' AND 'CPU' FOR EACH PROCESSES
function addremove() {
    let processTimes = [];
    let table = document.querySelector(".main-table"); //SELECTING 'MAIN-TABLE'
    for (let i = 0; i < process; i++) {
        let row = table.rows[2 * i + 2].cells; //IT'S GETTING EVERY OTHER ROW, STARTING FROM THIRD ROW
        processTimes.push(row.length); //THEN PUSING THE LENGTH OF 'ROW'
    }

    let addbtns = document.querySelectorAll(".add-process-btn"); //SELECTS THE ELEMENT

    //LOOP ITERATES OVER EACH ELEMENT SELECTED IN 'ADDBTN' UP TO THE VALUE OF 'PROCESS'
    for (let i = 0; i < process; i++) { 
        addbtns[i].onclick = () => { //ONCLICK LISTENER
            let table = document.querySelector(".main-table"); //SELECTING ELEMENT
            let row1 = table.rows[2 * i + 1];
            let row2 = table.rows[2 * i + 2];
            let newcell1 = row1.insertCell(processTimes[i] + 3); //CELLS ARE INSERTED INTO 'ROW1' AND 'ROW2'
            //THESE CELLS ARE FILLED WITH HTML CONTENT REPRESENTING INPUT FIELDS FOR 'IO' AND 'CPU' TIME
            newcell1.innerHTML = "IO"; 
            newcell1.classList.add("process-time");
            newcell1.classList.add("io");
            newcell1.classList.add("process-heading");
            let newcell2 = row2.insertCell(processTimes[i]);
            newcell2.innerHTML = '<input type="number" min="1" step="1" value="1">';
            newcell2.classList.add("process-time");
            newcell2.classList.add("io");
            newcell2.classList.add("process-input");
            let newcell3 = row1.insertCell(processTimes[i] + 4);
            newcell3.innerHTML = "CPU";
            newcell3.classList.add("process-time");
            newcell3.classList.add("cpu");
            newcell3.classList.add("process-heading");
            let newcell4 = row2.insertCell(processTimes[i] + 1);
            newcell4.innerHTML = '<input type="number" min="1" step="1" value="1">';
            newcell4.classList.add("process-time");
            newcell4.classList.add("cpu");
            newcell4.classList.add("process-input");
            processTimes[i] += 2;
            updateColspan();
            inputOnChange();
        };
    }

    //SAME AS ABOVE, BUT HERE WE WILL REMOVE THE CELLS

    let removebtns = document.querySelectorAll(".remove-process-btn");
    //LOOP ITERATES OVER EACH ELEMENT SELECTED IN 'removebtns' UP TO THE VALUE OF 'PROCESS'
    for (let i = 0; i < process; i++) {
        removebtns[i].onclick = () => { //ONCLICK LISTENER
            if (processTimes[i] > 1) { //IF PROCESS HAVE MORE THEN 1 CELL THEN REMOVE IT
                let table = document.querySelector(".main-table");
                processTimes[i]--; //DECREMENT PROCESS
                let row1 = table.rows[2 * i + 1]; //SELECTING ROW
                row1.deleteCell(processTimes[i] + 3); //DELETING IT (REPEATING...)
                let row2 = table.rows[2 * i + 2];
                row2.deleteCell(processTimes[i]);
                processTimes[i]--;
                table = document.querySelector(".main-table");
                row1 = table.rows[2 * i + 1];
                row1.deleteCell(processTimes[i] + 3);
                row2 = table.rows[2 * i + 2];
                row2.deleteCell(processTimes[i]);
                updateColspan(); //UPDATING COLUMN SPAN
            }
        };
    }
}
addremove();

//FOR ADDING/REMOVING NEW PROCESSES
function addProcess() {
    process++; //INCREMENTING PROCESS
    
    //CODE FOR NEW TABLE ENTRY FOR NEW PROCESS
    let rowHTML1 = `
                          <td class="process-id" rowspan="2">P${process}</td>
                          <td class="priority hide" rowspan="2"><input type="number" min="1" step="1" value="1"></td>
                          <td class="arrival-time" rowspan="2"><input type="number" min="0" step="1" value="0"> </td>
                          <td class="process-time cpu process-heading" colspan="">CPU</td>
                          <td class="process-btn"><button type="button" class="add-process-btn">+</button></td>
                          <td class="process-btn"><button type="button" class="remove-process-btn">-</button></td>
                      `;
    let rowHTML2 = `
                           <td class="process-time cpu process-input"><input type="number" min="1" step="1" value="1"> </td>
                      `;
    
    //SELECTING ELEMENT
    let table = document.querySelector(".main-table tbody");
    table.insertRow(table.rows.length).innerHTML = rowHTML1; //INSERTING ROW...
    table.insertRow(table.rows.length).innerHTML = rowHTML2; //...AND ITS DATA
    checkPriorityCell(); //CHECKING IF 'PRIORITY' REQUIRED
    addremove();
    updateColspan();
    inputOnChange();
}

//DELETING PROCESS
function deleteProcess() {
    let table = document.querySelector(".main-table"); //SELECTS ELEMENT
    if (process > 1) { //IF MORE THAN 1 PROCESS IS THERE
        table.deleteRow(table.rows.length - 1);
        table.deleteRow(table.rows.length - 1);
        process--;
    }
    updateColspan();
    inputOnChange();
}

//ADD ROW - EVENT LISTENER
document.querySelector(".add-btn").onclick = () => {
    addProcess();
};

//REMOVE ROW - EVENT LISTENER
document.querySelector(".remove-btn").onclick = () => {
    deleteProcess();
};

//------------------------
class Input {
    constructor() {
        this.processId = [];
        this.priority = [];
        this.arrivalTime = [];
        this.processTime = [];
        this.processTimeLength = [];
        this.totalBurstTime = [];
        this.algorithm = "";
        this.algorithmType = "";
        this.timeQuantum = 0;
        this.contextSwitch = 0;
    }
}

class Utility {
    constructor() {
        this.remainingProcessTime = [];
        this.remainingBurstTime = [];
        this.remainingTimeRunning = [];
        this.currentProcessIndex = [];
        this.start = [];
        this.done = [];
        this.returnTime = [];
        this.currentTime = 0;
    }
}
class Output {
    constructor() {
        this.completionTime = [];
        this.turnAroundTime = [];
        this.waitingTime = [];
        this.responseTime = [];
        this.schedule = [];
        this.timeLog = [];
        this.contextSwitches = 0;
        this.averageTimes = []; //ct,tat,wt,rt
    }
}
class TimeLog {
    constructor() {
        this.time = -1;
        this.remain = [];
        this.ready = [];
        this.running = [];
        this.block = [];
        this.terminate = [];
        this.move = []; //0-remain->ready 1-ready->running 2-running->terminate 3-running->ready 4-running->block 5-block->ready
    }
}

function setAlgorithmNameType(input, algorithm) {
    input.algorithm = algorithm;
    switch (algorithm) {
        case 'fcfs':
        case 'sjf':
        case 'ljf':
        case 'pnp':
        case 'hrrn':
            input.algorithmType = "nonpreemptive";
            break;
        case 'srtf':
        case 'lrtf':
        case 'pp':
            input.algorithmType = "preemptive";
            break;
        case 'rr':
            input.algorithmType = "roundrobin";
            break;
    }
}

function setInput(input) {
    for (let i = 1; i <= process; i++) {
        input.processId.push(i - 1); //PROCESS ID
        let rowCells1 = document.querySelector(".main-table").rows[2 * i - 1].cells; //SELECTING ROWS FOR INPUT DATA
        let rowCells2 = document.querySelector(".main-table").rows[2 * i].cells; //SELECTING ROWS FOR INPUT DATA
        input.priority.push(Number(rowCells1[1].firstElementChild.value)); //PUSHING THE INPUT DATA OF 'PRIORITY' CELL INTO THE ARRAY
        input.arrivalTime.push(Number(rowCells1[2].firstElementChild.value)); //PUSHING THE INPUT DATA OF 'ARRIVAL TIME' CELL INTO THE ARRAY
        //'BURST TIME' (PROCESS TIME) OF EACH PROCESS IS EXTRACTED AND PUT IT INTO THE ARRAY
        let ptn = Number(rowCells2.length);
        let pta = [];
        for (let j = 0; j < ptn; j++) {
            pta.push(Number(rowCells2[j].firstElementChild.value));
        }
        input.processTime.push(pta);
        input.processTimeLength.push(ptn); //EXTRACTED THE LENGTH OF THE ARRAY
    }

    //TOTAL BURST TIME FOR EACH PROCESS
    input.totalBurstTime = new Array(process).fill(0);
    input.processTime.forEach((e1, i) => {
        e1.forEach((e2, j) => {
            if (j % 2 == 0) {
                input.totalBurstTime[i] += e2;
            }
        });
    });
    setAlgorithmNameType(input, selectedAlgorithm.value);

    //CONTEXT SWITCH AND TIME QUANTUM
    input.contextSwitch = Number(document.querySelector("#context-switch").value);
    input.timeQuantum = Number(document.querySelector("#tq").value);
}

//PREPARES VARIOUS UTILITY DATA STRUCTURES BASED ON THE INPUT DATA FOR USE
function setUtility(input, utility) {
    utility.remainingProcessTime = input.processTime.slice(); //Assigns a shallow copy of the processTime array from the input object to the remainingProcessTime array.
    utility.remainingBurstTime = input.totalBurstTime.slice(); //Assigns a shallow copy of the totalBurstTime array from the input object to the remainingBurstTime array.
    utility.remainingTimeRunning = new Array(process).fill(0); //Initializes an array called remainingTimeRunning in the utility object, filled with zeros.
    utility.currentProcessIndex = new Array(process).fill(0); //Initializes an array called currentProcessIndex in the utility object, filled with zeros.
    utility.start = new Array(process).fill(false); //Initializes an array called start in the utility object, filled with false.
    utility.done = new Array(process).fill(false); //Initializes an array called done in the utility object, filled with false.
    utility.returnTime = input.arrivalTime.slice(); //Assigns a shallow copy of the arrivalTime array from the input object to the returnTime array.
}

//AIMS TO REDUCE A SCHEDULE BY MERGING CONSECUTIVE ELEMENTS WITH SAME SCHEDULE ELEMENT INTO A SINGLE ELEMENT
function reduceSchedule(schedule) {
    let newSchedule = []; //WILL HOLD REDUCED SCHEDULE
    let currentScheduleElement = schedule[0][0]; 
    let currentScheduleLength = schedule[0][1];
    for (let i = 1; i < schedule.length; i++) {
        if (schedule[i][0] == currentScheduleElement) {
            currentScheduleLength += schedule[i][1];
        } else {
            newSchedule.push([currentScheduleElement, currentScheduleLength]);
            currentScheduleElement = schedule[i][0];
            currentScheduleLength = schedule[i][1];
        }
    }
    newSchedule.push([currentScheduleElement, currentScheduleLength]);
    return newSchedule;
}

//TIME LOG REPRESENTED AS AN ARRAY AND REMOVES CONSECUTIVE DUPLICATE ENTRIES, RESULTING IN A REDUCED TIME LOG WITH UNIQUE ENTRIES
function reduceTimeLog(timeLog) {
    let timeLogLength = timeLog.length; //INITIALIZATION
    let newTimeLog = [], //ARRAY
        j = 0;
    for (let i = 0; i < timeLogLength - 1; i++) {
        if (timeLog[i] != timeLog[i + 1]) { //IF TIMELOG != NEXT TIMELOG
            newTimeLog.push(timeLog[j]); //PUSH A NEW TIMELOG IN THE ARRAY FOR CALCULATION
        }
        j = i + 1;
    }
    if (j == timeLogLength - 1) { //IF j IS AT THE LAST ELEMENT THEN PUSH IT IN ARRAY
        newTimeLog.push(timeLog[j]);
    }
    return newTimeLog; //RETURN TIMELOG WITH UNIQUE ENTRIES
}

//CALCULATION OF AVERAGE TIME(S)
function outputAverageTimes(output) {
    let avgct = 0;
    output.completionTime.forEach((element) => {
        avgct += element;
    });
    avgct /= process;
    let avgtat = 0;
    output.turnAroundTime.forEach((element) => {
        avgtat += element;
    });
    avgtat /= process;
    let avgwt = 0;
    output.waitingTime.forEach((element) => {
        avgwt += element;
    });
    avgwt /= process;
    let avgrt = 0;
    output.responseTime.forEach((element) => {
        avgrt += element;
    });
    avgrt /= process;
    return [avgct, avgtat, avgwt, avgrt];
}

//CALCULATION OF OUTPUT DATA
function setOutput(input, output) {
    //SET TURNAROUND TIME AND WAITING TIME
    for (let i = 0; i < process; i++) {
        output.turnAroundTime[i] = output.completionTime[i] - input.arrivalTime[i];
        output.waitingTime[i] = output.turnAroundTime[i] - input.totalBurstTime[i];
    }
    output.schedule = reduceSchedule(output.schedule);
    output.timeLog = reduceTimeLog(output.timeLog);
    output.averageTimes = outputAverageTimes(output);
}

//TIME (ONLY MINUTES AND SECONDS)
function getDate(sec) {
    return (new Date(0, 0, 0, 0, sec / 60, sec % 60));
}

function showGanttChart(output, outputDiv) {
    //GANTT CHART HEADING
    let ganttChartHeading = document.createElement("h1");
    ganttChartHeading.innerHTML = "Gantt Chart";
    ganttChartHeading.classList.add("chart_heading");
    outputDiv.appendChild(ganttChartHeading);
    ganttChartHeading = document.createElement("hr");
    ganttChartHeading.classList.add("chart_hr");
    outputDiv.appendChild(ganttChartHeading);
    
    let ganttChartData = [];// INITIALISING
    let startGantt = 0;
    output.schedule.forEach((element) => { //ITERATES OVER EACH ELEMENT IN THE 'OUTPUT.SCHEDULE' 
        if (element[0] == -2) { //CONTEXT SWITCH
            ganttChartData.push([ //PUSHES NEW ARRAY (BECAUSE IT IS CONTEXT SWITCH)
                "Time", //TIME
                "CS", //TEXT
                "grey", //COLOR
                getDate(startGantt), //STARTING POINT
                getDate(startGantt + element[1]) //ENDING POINT
            ]);

        } else if (element[0] == -1) { //NOTHING (EMPTY SLOT)
            ganttChartData.push([ //PUSHES NEW ARRAY
                "Time", //TIME
                "Empty", //TEXT
                "black", //COLOR
                getDate(startGantt), //STARTING POINT
                getDate(startGantt + element[1]) //ENDING POINT
            ]);

        } else { //IF IT IS A PROCESS
            ganttChartData.push([ //PUSHES NEW ARRAY
                "Time", //TIME
                "P" + element[0], //PROCESS NAME (P#)
                "", //NO SPECIFIC COLOR
                getDate(startGantt), //STARTING POINT
                getDate(startGantt + element[1]) //ENDING POINT
            ]);
        }
        startGantt += element[1]; //DURATION OF CURRENT SCHEDULING ELEMENT
    });
    

    //CREATING GANTT CHART
    let ganttChart = document.createElement("div"); //CREATING 'DIV' FOR GANTT CHART
    ganttChart.id = "gantt-chart"; //SETTING ID
    ganttChart.classList.add("chart_style");

    google.charts.load("current", { packages: ["timeline"] }); //GOOGLE CHARTS LIBRARY TO LOAD 'TIMELINE' PACKAGE - CURRENT VERSION OF LIBRARY
    google.charts.setOnLoadCallback(drawGanttChart); //ONCE GOOGLE CHARTS IS LOADED, CALLBACK FUNCTION 'drawGanttChart' IS CALLED

    function drawGanttChart() {
        var container = document.getElementById("gantt-chart");//SELECTS HTML ELEMENT WITH THE ID "gantt-chart" & STORES IT IN 'container'
        var chart = new google.visualization.Timeline(container); //CREATES A NEW TIMELINE CHART OBJECT USING 'container' ELEMENT
        var dataTable = new google.visualization.DataTable(); //creates a new DataTable object, which will hold the data for the Gantt chart.

        //SETTING UP THE 'DATATABLE'
        dataTable.addColumn({ type: "string", id: "Gantt Chart" });
        dataTable.addColumn({ type: "string", id: "Process" });
        dataTable.addColumn({ type: 'string', id: 'style', role: 'style' });
        dataTable.addColumn({ type: "date", id: "Start" });
        dataTable.addColumn({ type: "date", id: "End" });
        dataTable.addRows(ganttChartData); //adds the rows of data for the Gantt chart from the ganttChartData array.
        let ganttWidth = '100%'; //TAKING THE INITIAL LENGTH
        if (startGantt >= 20) { //SETTING DUARTION (OR INTERVAL) FOR GANTT CHART - FOR BIGGER DURATION
            ganttWidth = 0.05 * startGantt ;
        }
        var options = {
            width: ganttWidth,
            timeline: {
                showRowLabels: false,
                avoidOverlappingGridLines: false
            }
        };
        chart.draw(dataTable, options); //DRAWING CHART
    }
    outputDiv.appendChild(ganttChart); //SHOWING THE CHART
}

//FUNCTION FOR TIMELINE CHART
function showTimelineChart(output, outputDiv) {
    let timelineChartHeading = document.createElement("h3"); //HEADING
    timelineChartHeading.innerHTML = "Timeline Chart"; //SELECTING
    timelineChartHeading.classList.add("chart_heading");
    outputDiv.appendChild(timelineChartHeading); //APPENDING (SHOWING)
    timelineChartHeading = document.createElement("hr");
    timelineChartHeading.classList.add("chart_hr");
    outputDiv.appendChild(timelineChartHeading);
    let timelineChartData = []; //INITIALIZING
    let startTimeline = 0;
    //ITERATES OVER THE 'output.schedule' ARRAY, EXTRACTING PROCESS-RELATED SCHEDULING INFO & POPULATING A DATA ARRAY 'timelineChartData'
    output.schedule.forEach((element) => {
        if (element[0] >= 0) { //process 
            timelineChartData.push([
                "P" + element[0],
                getDate(startTimeline), //STARTING POINT
                getDate(startTimeline + element[1]) //ENDING POINT
            ]);
        }
        startTimeline += element[1]; //DURATION OF CURRENT SCHEDULING ELEMENT
    });

    //SORTS THE 'timelineChartData' ARRAY BASED ON THE NUMERICAL VALUE OF PROCESS IDs (without the "P" prefix).
    timelineChartData.sort((a, b) => parseInt(a[0].substring(1, a[0].length)) - parseInt(b[0].substring(1, b[0].length)));
    let timelineChart = document.createElement("div"); //CREATING ELEMENT FOR TIMELINE CHART
    timelineChart.id = "timeline-chart"; //SETTING ID
    timelineChart.classList.add("chart_style");

    google.charts.load("current", { packages: ["timeline"] }); //GOOGLE CHARTS LIBRARY TO LOAD 'TIMELINE' PACKAGE - CURRENT VERSION OF LIBRARY
    google.charts.setOnLoadCallback(drawTimelineChart); //ONCE GOOGLE CHARTS IS LOADED, CALLBACK FUNCTION 'drawTimelineChart' IS CALLED

    function drawTimelineChart() {
        var container = document.getElementById("timeline-chart"); //GETTING ELEMENT
        var chart = new google.visualization.Timeline(container); //CREATES A NEW TIMELINE CHART OBJECT USING 'container' ELEMENT
        var dataTable = new google.visualization.DataTable(); //creates a new DataTable object, which will hold the data for the TIMELINE chart.

        //SETTING UP THE 'DATATABLE'
        dataTable.addColumn({ type: "string", id: "Process" });
        dataTable.addColumn({ type: "date", id: "Start" });
        dataTable.addColumn({ type: "date", id: "End" });
        dataTable.addRows(timelineChartData);

        let timelineWidth = '100%'; //TAKING THE INITIAL LENGTH
        if (startTimeline >= 20) { //SETTING DUARTION (OR INTERVAL) FOR TIMELINE CHART - FOR BIGGER DURATION
            timelineWidth = 0.05 * startTimeline * screen.availWidth;
        }
        var options = { //SETTING THE CORRECT LENGTH
            width: timelineWidth,
        };
        chart.draw(dataTable, options); //DRAWING TIMELINE CHART
    }
    outputDiv.appendChild(timelineChart); //SHOWING THE RESULT
}

function showFinalTable(input, output, outputDiv) {
    let finalTableHeading = document.createElement("h3"); //HEADING
    finalTableHeading.classList.add("chart_heading");
    finalTableHeading.innerHTML = "Final Table";
    outputDiv.appendChild(finalTableHeading); //APPENDING THE FINAL TABLE HEADING
    finalTableHeading = document.createElement("hr");
    finalTableHeading.classList.add("chart_hr");
    outputDiv.appendChild(finalTableHeading);
    let table = document.createElement("table"); //CREATING FINAL TABLE (VARIABLE)
    //CREATING TABLE
    table.classList.add("final-table"); 
    let thead = table.createTHead();
    let row = thead.insertRow(0); 
    let headings = [
        "Process",
        "Arrival Time",
        "Total Burst Time",
        "Completion Time",
        "Turn Around Time",
        "Waiting Time",
        "Response Time",
    ];
    headings.forEach((element, index) => { //FOR EACH HEADING - WE ARE INSERTING CELLS
        let cell = row.insertCell(index);
        cell.innerHTML = element;
    });
    let tbody = table.createTBody();
    //INSERTING THE DATA IN TABLE
    for (let i = 0; i < process; i++) {
        let row = tbody.insertRow(i);
        let cell = row.insertCell(0);
        cell.innerHTML = "P" + (i + 1);
        cell = row.insertCell(1);
        cell.innerHTML = input.arrivalTime[i];
        cell = row.insertCell(2);
        cell.innerHTML = input.totalBurstTime[i];
        cell = row.insertCell(3);
        cell.innerHTML = output.completionTime[i];
        cell = row.insertCell(4);
        cell.innerHTML = output.turnAroundTime[i];
        cell = row.insertCell(5);
        cell.innerHTML = output.waitingTime[i];
        cell = row.insertCell(6);
        cell.innerHTML = output.responseTime[i];
    }
    outputDiv.appendChild(table);

    //CALCULATION FOR THE TABLE
    //BURST TIME
    let tbt = 0;
    input.totalBurstTime.forEach((element) => (tbt += element));
    //COMPLETION TIME
    let lastct = 0;
    output.completionTime.forEach((element) => (lastct = Math.max(lastct, element)));
    //CPU TIME AND UTILIZATION
    let cpu = document.createElement("p");
    cpu.classList.add("cpu_utiz");
    cpu.innerHTML = "CPU Utilization : " + (tbt / lastct) * 100 + "%";
    outputDiv.appendChild(cpu);
    //THROUGHPUT
    let tp = document.createElement("p");
    tp.classList.add("cpu_utiz");
    tp.innerHTML = "Throughput : " + process / lastct;
    outputDiv.appendChild(tp);
    //CONTEXT SWITCH
    if (input.contextSwitch > 0) {
        let cs = document.createElement("p");
        cs.classList.add("cpu_utiz");
        cs.innerHTML = "Number of Context Switches : " + (output.contextSwitches - 1);
        outputDiv.appendChild(cs);
    }
}

//FUNCTION FOR TOGGLE ARROW
function toggleTimeLogArrowColor(timeLog, color) {
    let timeLogMove = ['remain-ready', 'ready-running', 'running-terminate', 'running-ready', 'running-block', 'block-ready'];
    timeLog.move.forEach(element => {
        document.getElementById(timeLogMove[element]).style.color = color;
    });
}

//TIME LOG 
function nextTimeLog(timeLog) {
    let timeLogTableDiv = document.getElementById("time-log-table-div"); //SELECTING ELEMENT

    //HTML CODE FOR ARROWS
    let arrowHTML = `
    <p id = "remain-ready" class = "arrow">&rarr;</p>
    <p id = "ready-running" class = "arrow">&#10554;</p>
    <p id = "running-ready" class = "arrow">&#10554;</p>
    <p id = "running-terminate" class = "arrow">&rarr;</p>
    <p id = "running-block" class = "arrow">&rarr;</p>
    <p id = "block-ready" class = "arrow">&rarr;</p>
    `;
    timeLogTableDiv.innerHTML = arrowHTML;

    let remainTable = document.createElement("table"); //CREATING TABLE
    remainTable.id = "remain-table"; //SETTING ID
    remainTable.className = 'time-log-table'; //SETTING CLASSNAME
    let remainTableHead = remainTable.createTHead(); //CREATE TABLE HEADING
    let remainTableHeadRow = remainTableHead.insertRow(0); //inserts a new row (tr) into the thead of the table and stores it 
    let remainTableHeading = remainTableHeadRow.insertCell(0); //inserts a new cell (th) into the row created in the previous step and stores it
    remainTableHeading.innerHTML = "Remain";
    let remainTableBody = remainTable.createTBody(); //creates the tbody element for the table and stores it 
    for (let i = 0; i < timeLog.remain.length; i++) { //iterates over the remaining process indices stored in the 'timeLog.remain' array.
        let remainTableBodyRow = remainTableBody.insertRow(i); //inserts a new row (tr) into the tbody of the table at index i and stores it
        let remainTableValue = remainTableBodyRow.insertCell(0); //inserts a new cell (td) into the row created in the previous step and stores it
        remainTableValue.innerHTML = 'P' + (timeLog.remain[i] + 1);
    }
    timeLogTableDiv.appendChild(remainTable); //SHOWING

    let readyTable = document.createElement("table"); //CREATING TABLE
    readyTable.id = "ready-table"; //SETTING ID
    readyTable.className = 'time-log-table'; //SETTING CLASSNAME
    let readyTableHead = readyTable.createTHead(); //CREATE TABLE HEADING
    let readyTableHeadRow = readyTableHead.insertRow(0); //inserts a new row (tr) into the thead of the table and stores it 
    let readyTableHeading = readyTableHeadRow.insertCell(0); //inserts a new cell (th) into the row created in the previous step and stores it
    readyTableHeading.innerHTML = "Ready"; 
    let readyTableBody = readyTable.createTBody(); //creates the tbody element for the table and stores it
    for (let i = 0; i < timeLog.ready.length; i++) { //iterates over the ready process indices stored in the 'timeLog.ready' array.
        let readyTableBodyRow = readyTableBody.insertRow(i); //inserts a new row (tr) into the tbody of the table at index i and stores it
        let readyTableValue = readyTableBodyRow.insertCell(0); //inserts a new cell (td) into the row created in the previous step and stores it
        readyTableValue.innerHTML = 'P' + (timeLog.ready[i] + 1);
    }
    timeLogTableDiv.appendChild(readyTable); //SHOWING

    //SAME AS ABOVE TWO
    let runningTable = document.createElement("table"); 
    runningTable.id = "running-table";
    runningTable.className = 'time-log-table';
    let runningTableHead = runningTable.createTHead();
    let runningTableHeadRow = runningTableHead.insertRow(0);
    let runningTableHeading = runningTableHeadRow.insertCell(0);
    runningTableHeading.innerHTML = "Running";
    let runningTableBody = runningTable.createTBody();
    for (let i = 0; i < timeLog.running.length; i++) {
        let runningTableBodyRow = runningTableBody.insertRow(i);
        let runningTableValue = runningTableBodyRow.insertCell(0);
        runningTableValue.innerHTML = 'P' + (timeLog.running[i] + 1);
    }
    timeLogTableDiv.appendChild(runningTable);

    //SAME AS ABOVE
    let blockTable = document.createElement("table");
    blockTable.id = "block-table";
    blockTable.className = 'time-log-table';
    let blockTableHead = blockTable.createTHead();
    let blockTableHeadRow = blockTableHead.insertRow(0);
    let blockTableHeading = blockTableHeadRow.insertCell(0);
    blockTableHeading.innerHTML = "Block";
    let blockTableBody = blockTable.createTBody();
    for (let i = 0; i < timeLog.block.length; i++) {
        let blockTableBodyRow = blockTableBody.insertRow(i);
        let blockTableValue = blockTableBodyRow.insertCell(0);
        blockTableValue.innerHTML = 'P' + (timeLog.block[i] + 1);
    }
    timeLogTableDiv.appendChild(blockTable);

    //SAME AS ABOVE
    let terminateTable = document.createElement("table");
    terminateTable.id = "terminate-table";
    terminateTable.className = 'time-log-table';
    let terminateTableHead = terminateTable.createTHead();
    let terminateTableHeadRow = terminateTableHead.insertRow(0);
    let terminateTableHeading = terminateTableHeadRow.insertCell(0);
    terminateTableHeading.innerHTML = "Terminate";
    let terminateTableBody = terminateTable.createTBody();
    for (let i = 0; i < timeLog.terminate.length; i++) {
        let terminateTableBodyRow = terminateTableBody.insertRow(i);
        let terminateTableValue = terminateTableBodyRow.insertCell(0);
        terminateTableValue.innerHTML = 'P' + (timeLog.terminate[i] + 1);
    }
    timeLogTableDiv.appendChild(terminateTable);
    document.getElementById("time-log-time").innerHTML = "Time : " + timeLog.time; //SHOWING TIME PASSES
}

//FUNCTION FOR SHOWING TIME LOG
function showTimeLog(output, outputDiv) {
    reduceTimeLog(output.timeLog);
    let timeLogDiv = document.createElement("div"); //CREATING ELEMENT
    timeLogDiv.id = "time-log-div"; //SETTING ID
    timeLogDiv.style.height = (15 * process) + 300 + "px"; //SETTING THE HEIGHT
    let startTimeLogButton = document.createElement("button"); //CREATING BUTTON
    startTimeLogButton.id = "start-time-log"; //BUTTON ID
    startTimeLogButton.innerHTML = "Start Time Log (Visualization)"; //SETTING TEXT
    startTimeLogButton.classList.add("timelog-button");
    timeLogDiv.appendChild(startTimeLogButton); //SHOWING
    outputDiv.appendChild(timeLogDiv); //SHOWING

    //TIME LOG
    document.querySelector("#start-time-log").onclick = () => {
        timeLogStart = 1;
        let timeLogDiv = document.getElementById("time-log-div");
        let timeLogOutputDiv = document.createElement("div");
        timeLogOutputDiv.id = "time-log-output-div";

        let timeLogTableDiv = document.createElement("div");
        timeLogTableDiv.id = "time-log-table-div";

        let timeLogTime = document.createElement("p");
        timeLogTime.id = "time-log-time";

        timeLogOutputDiv.appendChild(timeLogTableDiv);
        timeLogOutputDiv.appendChild(timeLogTime);
        timeLogDiv.appendChild(timeLogOutputDiv);
        let index = 0;
        let timeLogInterval = setInterval(() => {
            nextTimeLog(output.timeLog[index]);
            if (index != output.timeLog.length - 1) {
                setTimeout(() => {
                    toggleTimeLogArrowColor(output.timeLog[index], 'red');
                    setTimeout(() => {
                        toggleTimeLogArrowColor(output.timeLog[index], 'black');
                    }, 600);
                }, 200);
            }
            index++;
            if (index == output.timeLog.length) {
                clearInterval(timeLogInterval);
            }
            document.getElementById("calculate").onclick = () => {
                clearInterval(timeLogInterval);
                document.getElementById("time-log-output-div").innerHTML = "";
                calculateOutput();
            }
        }, 1000);
    };
}

//ROUND ROBIN CHART
function showRoundRobinChart(outputDiv) {
    let roundRobinInput = new Input(); //This object likely holds input data related to the scheduling algorithm.
    setInput(roundRobinInput);
    let maxTimeQuantum = 0;
    roundRobinInput.processTime.forEach(processTimeArray => {
        processTimeArray.forEach((time, index) => {
            if (index % 2 == 0) {
                maxTimeQuantum = Math.max(maxTimeQuantum, time);
            }
        });
    });
    let roundRobinChartData = [
        [],
        [],
        [],
        [],
        []
    ];
    let timeQuantumArray = [];
    for (let timeQuantum = 1; timeQuantum <= maxTimeQuantum; timeQuantum++) {
        timeQuantumArray.push(timeQuantum);
        let roundRobinInput = new Input();
        setInput(roundRobinInput);
        setAlgorithmNameType(roundRobinInput, 'rr');
        roundRobinInput.timeQuantum = timeQuantum;
        let roundRobinUtility = new Utility();
        setUtility(roundRobinInput, roundRobinUtility);
        let roundRobinOutput = new Output();
        CPUScheduler(roundRobinInput, roundRobinUtility, roundRobinOutput);
        setOutput(roundRobinInput, roundRobinOutput);
        for (let i = 0; i < 4; i++) {
            roundRobinChartData[i].push(roundRobinOutput.averageTimes[i]);
        }
        roundRobinChartData[4].push(roundRobinOutput.contextSwitches);
    }
    let roundRobinChartCanvas = document.createElement('canvas');
    roundRobinChartCanvas.id = "round-robin-chart";
    let roundRobinChartDiv = document.createElement('div');
    roundRobinChartDiv.id = "round-robin-chart-div";
    roundRobinChartDiv.appendChild(roundRobinChartCanvas);
    outputDiv.appendChild(roundRobinChartDiv);

    new Chart(document.getElementById('round-robin-chart'), {
        type: 'line',
        data: {
            labels: timeQuantumArray,
            datasets: [{
                    label: "Completion Time",
                    borderColor: '#3366CC',
                    data: roundRobinChartData[0]
                },
                {
                    label: "Turn Around Time",
                    borderColor: '#DC3912',
                    data: roundRobinChartData[1]
                },
                {
                    label: "Waiting Time",
                    borderColor: '#FF9900',
                    data: roundRobinChartData[2]
                },
                {
                    label: "Response Time",
                    borderColor: '#109618',
                    data: roundRobinChartData[3]
                },
                {
                    label: "Context Switches",
                    borderColor: '#990099',
                    data: roundRobinChartData[4]
                },
            ]
        },
        options: {
            title: {
                display: true,
                text: ['Round Robin', 'Comparison of Completion, Turn Around, Waiting, Response Time and Context Switches', 'The Lower The Better']
            },
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }],
                xAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: 'Time Quantum'
                    }
                }]
            },
            legend: {
                display: true,
                labels: {
                    fontColor: 'black'
                }
            }
        }
    });
}


function showAlgorithmChart(outputDiv) {
    let algorithmArray = ["sjf"];
    let algorithmNameArray = ["SJF"];
    let algorithmChartData = [
        [],
        [],
        [],
        []
    ];
    algorithmArray.forEach(currentAlgorithm => {
        let chartInput = new Input();
        let chartUtility = new Utility();
        let chartOutput = new Output();
        setInput(chartInput);
        setAlgorithmNameType(chartInput, currentAlgorithm);
        setUtility(chartInput, chartUtility);
        CPUScheduler(chartInput, chartUtility, chartOutput);
        setOutput(chartInput, chartOutput);
        for (let i = 0; i < 4; i++) {
            algorithmChartData[i].push(chartOutput.averageTimes[i]);
        }
    });
    let algorithmChartCanvas = document.createElement('canvas');
    algorithmChartCanvas.id = "algorithm-chart";
    let algorithmChartDiv = document.createElement('div');
    algorithmChartDiv.id = "algorithm-chart-div";
    algorithmChartDiv.style.height = "40vh";
    algorithmChartDiv.style.width = "80%";
    algorithmChartDiv.appendChild(algorithmChartCanvas);
    outputDiv.appendChild(algorithmChartDiv);
    new Chart(document.getElementById('algorithm-chart'), {
        type: 'bar',
        data: {
            labels: algorithmNameArray,
            datasets: [{
                    label: "Completion Time",
                    backgroundColor: '#3366CC',
                    data: algorithmChartData[0]
                },
                {
                    label: "Turn Around Time",
                    backgroundColor: '#DC3912',
                    data: algorithmChartData[1]
                },
                {
                    label: "Waiting Time",
                    backgroundColor: '#FF9900',
                    data: algorithmChartData[2]
                },
                {
                    label: "Response Time",
                    backgroundColor: '#109618',
                    data: algorithmChartData[3]
                }
            ]
        },
        options: {
            title: {
                display: true,
                text: ['Algorithm', 'Comparison of Completion, Turn Around, Waiting and Response Time', 'The Lower The Better']
            },
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }],
                xAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: 'Algorithms'
                    }
                }]
            },
            legend: {
                display: true,
                labels: {
                    fontColor: 'black'
                }
            }
        }
    });
}

//SHOWING THE ENTIRE OUTPUT
function showOutput(input, output, outputDiv) {
    // outputDiv.insertAdjacentHTML("beforeend", "<hr><BR>");
    showFinalTable(input, output, outputDiv);
    outputDiv.insertAdjacentHTML("beforeend", "<BR>");
    showGanttChart(output, outputDiv);
    outputDiv.insertAdjacentHTML("beforeend", "<BR>");
    showTimelineChart(output, outputDiv);
    outputDiv.insertAdjacentHTML("beforeend", "<hr><BR>");
    showTimeLog(output, outputDiv);
    outputDiv.insertAdjacentHTML("beforeend", "<BR>");
    if (selectedAlgorithm.value == "rr") {
        showRoundRobinChart(outputDiv);
        outputDiv.insertAdjacentHTML("beforeend", "<BR>");
    }
    showAlgorithmChart(outputDiv);
}

function CPUScheduler(input, utility, output) {
    //updates the ready queue for a scheduling algorithm based on the current time log
    function updateReadyQueue(currentTimeLog) {
        //Identifies processes in the remain queue that have arrived
        let candidatesRemain = currentTimeLog.remain.filter((element) => input.arrivalTime[element] <= currentTimeLog.time);
        if (candidatesRemain.length > 0) { 
            currentTimeLog.move.push(0);
        }
        //Identifies processes in the block queue that are ready to move
        let candidatesBlock = currentTimeLog.block.filter((element) => utility.returnTime[element] <= currentTimeLog.time);
        if (candidatesBlock.length > 0) {
            currentTimeLog.move.push(5);
        }
        //Combines the candidates from remain and block queues
        let candidates = candidatesRemain.concat(candidatesBlock);
        candidates.sort((a, b) => utility.returnTime[a] - utility.returnTime[b]); //Sorts these candidates based on their returnTime
        candidates.forEach(element => { //Moves the sorted candidates from the remain and block queues to the ready queue using moveElement
            moveElement(element, currentTimeLog.remain, currentTimeLog.ready);
            moveElement(element, currentTimeLog.block, currentTimeLog.ready);
        });
        output.timeLog.push(JSON.parse(JSON.stringify(currentTimeLog))); //Copies the updated currentTimeLog to output.timeLog.
        currentTimeLog.move = []; //Resets the move array for the next update cycle.
    }

    function moveElement(value, from, to) { //if present in from and not in to
        let index = from.indexOf(value);
        if (index != -1) {
            from.splice(index, 1);
        }
        if (to.indexOf(value) == -1) {
            to.push(value);
        }
    }

    let currentTimeLog = new TimeLog();
    currentTimeLog.remain = input.processId; //Assigns the list of process IDs from the input to the remain queue
    output.timeLog.push(JSON.parse(JSON.stringify(currentTimeLog))); //Adds a copy of currentTimeLog to timeLog array in the output. This captures the initial state of the time log.
    currentTimeLog.move = [];
    currentTimeLog.time++;
    let lastFound = -1;
    while (utility.done.some((element) => element == false)) {
        updateReadyQueue(currentTimeLog);
        let found = -1;
        if (currentTimeLog.running.length == 1) {
            found = currentTimeLog.running[0];
        } else if (currentTimeLog.ready.length > 0) {
            if (input.algorithm == 'rr') {
                found = currentTimeLog.ready[0];
                utility.remainingTimeRunning[found] = Math.min(utility.remainingProcessTime[found][utility.currentProcessIndex[found]], input.timeQuantum);
            } else {
                let candidates = currentTimeLog.ready;
                candidates.sort((a, b) => a - b);
                candidates.sort((a, b) => {
                    switch (input.algorithm) {
                        case 'fcfs':
                            return utility.returnTime[a] - utility.returnTime[b];
                        case 'sjf':
                        case 'srtf':
                            return utility.remainingBurstTime[a] - utility.remainingBurstTime[b];
                        case 'ljf':
                        case 'lrtf':
                            return utility.remainingBurstTime[b] - utility.remainingBurstTime[a];
                        case 'pnp':
                        case 'pp':
                            return priorityPreference * (input.priority[a] - input.priority[b]);
                        case 'hrrn':
                            function responseRatio(id) {
                                let s = utility.remainingBurstTime[id];
                                let w = currentTimeLog.time - input.arrivalTime[id] - s;
                                return 1 + w / s;
                            }
                            return responseRatio(b) - responseRatio(a);
                    }
                });
                found = candidates[0];
                if (input.algorithmType == "preemptive" && found >= 0 && lastFound >= 0 && found != lastFound) { //context switch
                    output.schedule.push([-2, input.contextSwitch]);
                    for (let i = 0; i < input.contextSwitch; i++, currentTimeLog.time++) {
                        updateReadyQueue(currentTimeLog);
                    }
                    if (input.contextSwitch > 0) {
                        output.contextSwitches++;
                    }
                }
            }
            moveElement(found, currentTimeLog.ready, currentTimeLog.running);
            currentTimeLog.move.push(1);
            output.timeLog.push(JSON.parse(JSON.stringify(currentTimeLog)));
            currentTimeLog.move = [];
            if (utility.start[found] == false) {
                utility.start[found] = true;
                output.responseTime[found] = currentTimeLog.time - input.arrivalTime[found];
            }
        }
        currentTimeLog.time++;
        if (found != -1) {
            output.schedule.push([found + 1, 1]);
            utility.remainingProcessTime[found][utility.currentProcessIndex[found]]--;
            utility.remainingBurstTime[found]--;

            if (input.algorithm == 'rr') {
                utility.remainingTimeRunning[found]--;
                if (utility.remainingTimeRunning[found] == 0) {
                    if (utility.remainingProcessTime[found][utility.currentProcessIndex[found]] == 0) {
                        utility.currentProcessIndex[found]++;
                        if (utility.currentProcessIndex[found] == input.processTimeLength[found]) {
                            utility.done[found] = true;
                            output.completionTime[found] = currentTimeLog.time;
                            moveElement(found, currentTimeLog.running, currentTimeLog.terminate);
                            currentTimeLog.move.push(2);
                        } else {
                            utility.returnTime[found] = currentTimeLog.time + input.processTime[found][utility.currentProcessIndex[found]];
                            utility.currentProcessIndex[found]++;
                            moveElement(found, currentTimeLog.running, currentTimeLog.block);
                            currentTimeLog.move.push(4);
                        }
                        output.timeLog.push(JSON.parse(JSON.stringify(currentTimeLog)));
                        currentTimeLog.move = [];
                        updateReadyQueue(currentTimeLog);
                    } else {
                        updateReadyQueue(currentTimeLog);
                        moveElement(found, currentTimeLog.running, currentTimeLog.ready);
                        currentTimeLog.move.push(3);
                        output.timeLog.push(JSON.parse(JSON.stringify(currentTimeLog)));
                        currentTimeLog.move = [];
                    }
                    output.schedule.push([-2, input.contextSwitch]);
                    for (let i = 0; i < input.contextSwitch; i++, currentTimeLog.time++) {
                        updateReadyQueue(currentTimeLog);
                    }
                    if (input.contextSwitch > 0) {
                        output.contextSwitches++;
                    }
                }
            } else { //preemptive and non-preemptive
                if (utility.remainingProcessTime[found][utility.currentProcessIndex[found]] == 0) {
                    utility.currentProcessIndex[found]++;
                    if (utility.currentProcessIndex[found] == input.processTimeLength[found]) {
                        utility.done[found] = true;
                        output.completionTime[found] = currentTimeLog.time;
                        moveElement(found, currentTimeLog.running, currentTimeLog.terminate);
                        currentTimeLog.move.push(2);
                    } else {
                        utility.returnTime[found] = currentTimeLog.time + input.processTime[found][utility.currentProcessIndex[found]];
                        utility.currentProcessIndex[found]++;
                        moveElement(found, currentTimeLog.running, currentTimeLog.block);
                        currentTimeLog.move.push(4);
                    }
                    output.timeLog.push(JSON.parse(JSON.stringify(currentTimeLog)));
                    currentTimeLog.move = [];
                    if (currentTimeLog.running.length == 0) { //context switch
                        output.schedule.push([-2, input.contextSwitch]);
                        for (let i = 0; i < input.contextSwitch; i++, currentTimeLog.time++) {
                            updateReadyQueue(currentTimeLog);
                        }
                        if (input.contextSwitch > 0) {
                            output.contextSwitches++;
                        }
                    }
                    lastFound = -1;
                } else if (input.algorithmType == "preemptive") {
                    moveElement(found, currentTimeLog.running, currentTimeLog.ready);
                    currentTimeLog.move.push(3);
                    output.timeLog.push(JSON.parse(JSON.stringify(currentTimeLog)));
                    currentTimeLog.move = [];
                    lastFound = found;
                }
            }
        } else {
            output.schedule.push([-1, 1]);
            lastFound = -1;
        }
        output.timeLog.push(JSON.parse(JSON.stringify(currentTimeLog)));
    }
    output.schedule.pop();
}

function calculateOutput() {
    let outputDiv = document.getElementById("output");
    outputDiv.innerHTML = "";
    let mainInput = new Input();
    let mainUtility = new Utility();
    let mainOutput = new Output();
    setInput(mainInput);
    setUtility(mainInput, mainUtility);
    CPUScheduler(mainInput, mainUtility, mainOutput);
    setOutput(mainInput, mainOutput);
    showOutput(mainInput, mainOutput, outputDiv);
}

document.getElementById("calculate").onclick = () => {
    calculateOutput();
};
