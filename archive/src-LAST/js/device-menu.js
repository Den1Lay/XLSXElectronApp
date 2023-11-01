window.addEventListener("load", () => {

  var main_menu_btn = document.getElementById("dm_main_menu_btn");
  main_menu_btn.addEventListener('click', () => {
    window.rootDataObj.changeDir("main_menu")
  }, false);

  const temp_time_btn = document.getElementById("dm_temp-time_btn");
  temp_time_btn.addEventListener('click', () => {
    window.rootDataObj.changeDir("temp-time_input");
  }, false)

  const dm_koef_TK_btn = document.getElementById("dm_koef-TK_btn");
  dm_koef_TK_btn.addEventListener('click', () => {
    window.rootDataObj.changeDir("koef-TK_input");
  })

  const dm_koef_TK_down = document.getElementById("dm_koef-TK_down");
  dm_koef_TK_down.addEventListener('click', () => {
    downloadKoefs();
  })

  const dm_temp_time_down = document.getElementById("dm_temp-time_down");
  dm_temp_time_down.addEventListener('click', () => {
    downloadTempTime();
  })

});

function updateTTChartData() {
  
  const {currentDeviceInd: dInd, currentTempInd: tInd, currentFlowInd: fInd, tempsNumb, flowsNumb} = window.rootDataObj;
  const dataAr = [];

  // Формирование и сохранение данных
  for(let t = 0; t < tempsNumb; t++) {
    let midSum = 0;
    let setedCount = 0;
    // debugger
    for(let q = 0; q < flowsNumb; q++) {
      const {mainMid, isSeted} =  window.rootDataObj.devices[dInd].temp_data[t].flow_data[q];
      if(isSeted) {
        midSum += mainMid;
        setedCount++;
      }
    }
    // debugger
    if(setedCount > 0) {
      const midFlowForT = midSum/setedCount;
      window.rootDataObj.devices[dInd].temp_data[t].flow_mid = midFlowForT;
      dataAr.push(midFlowForT);
    }
  }


  // redraw
  if(window.rootDataObj.hasOwnProperty("chart1")) {
    window.rootDataObj.chart1.destroy();
  }
  // Привязать температуру к данным с таблицы ТК.
  let temps = Array(tempsNumb).fill('').map((el, i) => 20+i*10);
  const protocolsValue = Object.values(window.rootDataObj.devices[dInd].protocol_data);
  if(protocolsValue.every(({accureTemp}) => accureTemp != 0)) {
    temps = protocolsValue.map(({accureTemp}) => accureTemp.toFixed(2));
  }

  const ctx = document.getElementById('temp-time_chart');
  const data = {
    labels: temps,
    datasets: [{
      label: 'Время от температуры',
      data: dataAr.map((el) => (el/262144).toFixed(2)),
      fill: false,
      borderColor: 'rgb(75, 192, 192)',
      tension: 0.1
    }]
  };
  
  const config = {
    type: 'line',
    data: data,
    options: {
      responsive: true,
      scales: {
        y: {
          title: {
            display: true,
            text: "Время"
          }
        },
        x: {
          title: {
            display: true,
            text: "Температура, °C"
          }
        }
      }
    }
  };

  
  const chart = new Chart(ctx, config);
  window.rootDataObj.chart1 = chart;
}

function updateKoefTKChartData() {
  // Вычисление коэффициента и ошибки
  const {currentDeviceInd: dInd, devices, tempsNumb} = window.rootDataObj;
  const { protocol_data } = devices[dInd]
  const formated_protocol_data = {};
  for(let i = 0; i < tempsNumb; i++) {
    const { accureTemp, errorRateObj, sFilename } = protocol_data[i];
    const masFlowInd = Object.keys(errorRateObj).reduce((a, next) => +next > +a ? +next : +a, 0);
    formated_protocol_data[i] = {
      accureTemp,
      errorRateObj: {}
    };

    if(sFilename) {
      for(let erInd = 0; erInd <= masFlowInd; erInd++ ) {
        const base = 1/(errorRateObj[erInd].er/100 + 1);
        const er = i > 0 ? base : 1;
        formated_protocol_data[i].errorRateObj[erInd] = {er, q: errorRateObj[erInd].q};
      }
    }
    
     
  }
  devices[dInd].formated_protocol_data = formated_protocol_data;

  const check_formated_protocol_data = {};
  for(let i = 0; i < tempsNumb; i++) {
    const { accureTemp, errorRateObj, sFilename } = protocol_data[i];
    const { errorRateObj: formErrorRateObj } = formated_protocol_data[i];
    const masFlowInd = Object.keys(errorRateObj).reduce((a, next) => +next > +a ? +next : +a, 0);
    check_formated_protocol_data[i] = {
      accureTemp,
      errorRateObj: {}
    };
    
    if(sFilename) {
      for(let erInd = 0; erInd <= masFlowInd; erInd++ ) {
        const base = errorRateObj[erInd].er;
        const newCoef = formErrorRateObj[erInd].er;
        const payloadValue = ((100 + base)/100)*newCoef;
        const er = i > 0 ? payloadValue : 1;
        check_formated_protocol_data[i].errorRateObj[erInd] = {er, q: errorRateObj[erInd].q};
      }
    }
    
     
  }
  devices[dInd].check_formated_protocol_data = check_formated_protocol_data;
  // debugger

  // redraw
  if(window.rootDataObj.hasOwnProperty("chart2")) {
    window.rootDataObj.chart2.destroy();
  }
  const { currentDeviceInd } = window.rootDataObj;
  const flowsObj = window.rootDataObj.devices[currentDeviceInd].formated_protocol_data['0'].errorRateObj;
  const flows = Object.keys(flowsObj).map(key => flowsObj[key].q.toFixed(2));
  console.log("flows ", flows);
  const datasets = getDatasets();
  // debugger
  const ctx2 = document.getElementById('koef-TK_chart');
  const data = {
    labels: flows,
    datasets,
  };

  const config = {
    type: 'line',
    data: data,
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: 'Коэффициенты термокомпенсации для температур:'
        }
      },
      scales: {
        y: {
          title: {
            display: true,
            text: "Коэффициент, ое"
          }
        },
        x: {
          title: {
            display: true,
            text: "Расход, м³/ч"
          }
        }
      }
    }
  };

  window.rootDataObj.chart2 = new Chart(ctx2, config);

}


function getDatasets() {
  const resArr = [];
  const { currentDeviceInd: dInd } = window.rootDataObj;
  const formatedObj =  window.rootDataObj.devices[dInd].formated_protocol_data;
  const colorStorage = ['rgb(75, 192, 192)', 'rgb(201, 50, 159)', 'rgb(7, 58, 240)', 'rgb(242, 65, 65)', 'rgb(70, 166, 7)', 'rgb(252, 149, 23)', 'rgb(61, 200, 255)', 'rgb(218, 112, 214)', 'rgb(255, 255, 0)']
  
  Object.keys(formatedObj).forEach((key, i) => {
    if(formatedObj[key].accureTemp !== 0.0) {
      const datasetObj = {
        label: formatedObj[key].accureTemp.toFixed(2),
        fill: false,
        borderColor: colorStorage[i],
        tension: 0.1,
        data: Object.values(formatedObj[key].errorRateObj).map(({er}) => er),
      }
      resArr.push(datasetObj);
    }
  })
  if(!resArr.length) {
    resArr.push({
      label: "Нет данных",
      fill: false,
      borderColor: colorStorage[Math.random()*100%8],
      tension: 0.1,
      data: [0],
    })
  }
  return resArr;
}

function downloadKoefs() {
  const {currentDeviceInd: dInd, currentTempInd: tInd, currentFlowInd: fInd} = window.rootDataObj;
  const { protocol_data: pD, formated_protocol_data: fpD, check_formated_protocol_data: cfpD } = window.rootDataObj.devices[dInd] 
  
  const simbols = ["A", 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];  
  const resWorkbookData = {};
  resWorkbookData['A'+1] = {v:"Погрешность", w:"Погрешность", t:'s'};
  resWorkbookData['A'+13] = {v:"Коэффициенты", w:"Коэффициенты", t:'s'};
  resWorkbookData['A'+25] = {v:"Проверка", w:"Проверка", t:'s'};

  let lastFlowInd = 0;
  // установка расходов
  let workSimbol = simbols[0];
  const flows = Object.values(pD[0].errorRateObj).map(({q}) => q);
  let startInd = 1;
  
  for(let t = 1; t <= 3; t++) {

    flows.forEach((el, i) => {
      lastFlowInd = i+1;
      const pass = +el.toFixed(2);
      resWorkbookData[workSimbol+(startInd+i+1)] = {v:pass, w:''+pass, t:'n'}
    });
    startInd+=12;
  }
  
  // установка температур
  startInd = 1;
  let startSimbolInd = 1;
  
  for(let t = 0; t < 3; t++) {

    const accureTemps = Object.values(pD)
      .map(({sFilename, accureTemp}) => sFilename && accureTemp)
      .filter(el => el);
    accureTemps.forEach((el, i) => {
      
      const pass = +el.toFixed(2);
      resWorkbookData[simbols[startSimbolInd+i]+startInd] = {v:pass, w:''+pass, t:'n'};
    });
    startInd+=12;
  }
  
  startInd = 2;
  startSimbolInd = 1;
  // установка погрешностей и других структур из window->device->protocol_data
  const payloadArs = [Object.values(pD), Object.values(fpD), Object.values(cfpD)];
  payloadArs.forEach(payloadAr => {
    
    payloadAr.forEach(({errorRateObj, accureTemp}, i) => {
      let workSimbol = simbols[startSimbolInd+i];
      if(accureTemp != 0) {
        const eROValue = Object.values(errorRateObj);
        eROValue.forEach(({er}, k) => {
          const pass = er;
          resWorkbookData[workSimbol+(startInd+k)] = {v:pass, w:''+pass, t:'n'};
        })
      }
    });

    startInd+=12;
  })

  resWorkbookData["!ref"] = "A1:P299";
  const resWorkbook = {
    SheetNames: ["Sheet1"],
    Sheets: {
      Sheet1: resWorkbookData
    }
  }
  console.log(globalWorkbook);


  XLSX.writeFile(resWorkbook, "Коэффициенты.xlsx", { compression: true });

}

function downloadTempTime() {
  const {currentDeviceInd: cDI} = window.rootDataObj;
  const { temp_data } = window.rootDataObj.devices[cDI];

  const resWorkbookData = {};
  resWorkbookData['A'+1] = {v:"Темпер.", w:"Темпер.", t:'s'};
  resWorkbookData['B'+1] = {v:"Время", w:"Время", t:'s'};

  const startInd = 2;
  Object.values(temp_data)
    .filter((el) => el.hasOwnProperty('flow_mid'))
    .forEach(({flow_mid}, i) => {
      const temp_val = 20+i*10;
      const flow_val = (flow_mid/262144).toFixed(2);
      resWorkbookData['A'+(startInd+i)] = {v: temp_val, w:""+temp_val, t:'n'};
      resWorkbookData['B'+(startInd+i)] = {v: flow_val, w:""+flow_val, t:'n'};
    })

  resWorkbookData["!ref"] = "A1:P299";
  const resWorkbook = {
    SheetNames: ["Sheet1"],
    Sheets: {
      Sheet1: resWorkbookData
    }
  }

  XLSX.writeFile(resWorkbook, "Температура_время.xlsx", { compression: true })
}
