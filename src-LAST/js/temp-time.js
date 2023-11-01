
window.addEventListener("load", () => {
  const tt_device_menu_btn = document.getElementById("tt_device_menu_btn");
  tt_device_menu_btn.addEventListener('click', () => {
    window.rootDataObj.changeDir("device_menu");
  });
  // let arc_down_btn = document.getElementById('arc_down_btn');
  // arc_down_btn.addEventListener('click', () => downloadArchive(), false)

  // for(let i = 2; i < 9; i++) {
  //   let el = document.getElementById(`a_${i}0`);
  //   el.addEventListener('click', (ev) => changeTab(ev, i, el), false);
  // }
  // for(let i = 2; i < 9; i++) {
  //   buildDOMColumn(i);
  // }
  
})

function buildDOMTempTimeHeader() {
  
  const tt_header_temp_nav = document.getElementById("tt_header_temp_nav");
  tt_header_temp_nav.innerHTML = '';
  const tempsNumb = window.rootDataObj.tempsNumb;

  for(let i = 0; i < tempsNumb; i++) {
    const temp = 20 + i*10;

    const li_item = document.createElement('li');
    li_item.className = "nav-item";
    li_item.innerHTML = 
    `<a class="nav-link ${i===0 ? 'active' : ''}" href="#"
      onclick="changeTab(${i})"
      id="tt_a_${i}">
      ${temp}°C
    </a>`;
    tt_header_temp_nav.append(li_item);
  }
  
}

function buildDOMTempTimeColumn(){
  
  const parentId = `t1_box_workArea`;  
  const t1_box_workArea = document.getElementById(parentId);
  t1_box_workArea.innerHTML = '';
  const flowNumb = window.rootDataObj.flowsNumb;
  const t1Ind = 0;
  for(let i = 0; i < flowNumb; i++) {
    let div = document.createElement('div');
    div.className="t1_payload";
    div.innerHTML =
    `<div class="t1_input_area">

      <div class="t1_input_overlay">
        <div class="t1_number">
        ${i}
        </div>

        <div  class="t1_payload_middle">
          <div>Среднее значение: </div>
          <strong id="mid_div_t${t1Ind}_${i}">0.0</strong>
        </div>
        <div class="t1_payload_middle">
          <div>Расход: </div>
          <div id="flow_div_t${t1Ind}_${i}">0.0</div>
        </div>

        <div class="t1_payload_input">
          <button type="button" class="btn btn-outline-primary btn-sm" onclick="document.getElementById('my_file_input_t${t1Ind}_${i}').click()">Выберите файл .csv</button>
          <input onchange="filePicked(event, ${t1Ind}, ${i})" type="file" id="my_file_input_t${t1Ind}_${i}" style="display:none;"/>
        </div>

        <div class="t1_payload_input">
          <button onclick='downloadFile(${t1Ind}, ${i})' type="button" class="btn btn-secondary btn-sm" id="downloadBtn_t1">Файл после фильтрации</button>
        </div>

        <div class="t1_payload_input">
          <button onclick='deleatFile(${t1Ind}, ${i})' type="button" class="btn btn-outline-secondary btn-sm" id="downloadBtn_t1">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
              <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
              <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
            </svg>
          </button>
        </div>

      </div>

      <div class="t1_fileName">
        <div class="same_flow_alert" id="same_flow_alert_t${t1Ind}_${i}">Данный расход уже указан</div>
        <div>Текущий файл:</div>
        <div id="file_name_t${t1Ind}_${i}"></div>
      </div>
    </div>`;

    t1_box_workArea.append(div);
  }
  
}

function updateDOMTempTimeColumn() {
  const {currentDeviceInd: dInd, currentTempInd: tInd, currentFlowInd: fInd, flowsNumb} = window.rootDataObj;

  for(let i = 0; i < flowsNumb; i++) {
    const {mainMid, sFilename} = window.rootDataObj.devices[dInd].temp_data[tInd].flow_data[i]

    const midDiv = document.getElementById(`mid_div_t0_${i}`);
    const flowDiv = document.getElementById(`flow_div_t0_${i}`);
    const fileName = document.getElementById(`file_name_t0_${i}`);
    // debugger
    midDiv.innerHTML = ' '+mainMid.toFixed(1);
  // Установка расхода
    if(sFilename !== "") {
      var splitedStr = sFilename.split(/\(|\)/g)[1];
      if(splitedStr.includes('m')) {
        flowDiv.innerHTML = ' '+splitedStr.replace('m', '.') + ' м³/ч';
      } else if(splitedStr.includes('L')) {
        flowDiv.innerHTML = ' '+splitedStr.replace('L', '') + ' л/ч';
      }
    } else {
      flowDiv.innerHTML = "0.0";
    }

    // Установка имени файла
    fileName.innerHTML = ` ${sFilename}`
      
  }

}

var currentTab = 0;

var maxIndex;
var globalWorkbook;
var sFilename;
var workbookStorage = {};

function downloadFile(colNumb, flowInd){
  window.rootDataObj.currentFlowInd = flowInd;
  const {currentDeviceInd: dInd, currentTempInd: tInd, currentFlowInd: fInd} = window.rootDataObj;
  const {workbook, sFilename, isSeted} = window.rootDataObj.devices[dInd].temp_data[tInd].flow_data[fInd];
  debugger
  if(isSeted) {
    var newName = sFilename.split(".");
    XLSX.writeFile(workbook, newName[0]+".xlsx", { compression: true });
  }
  
}  

function filePicked(oEvent, colNumb, flowInd) {

var oFile = oEvent.target.files[0];
sFilename = oFile.name;

window.rootDataObj.currentFlowInd = flowInd

// Create A File Reader HTML5
var reader = new FileReader();


reader.onload = function(e) {
  var data = e.target.result;
  var workbook = XLSX.read(data, {
      type: 'binary'
  });
  console.log(workbook);
  const {currentDeviceInd: dInd, currentTempInd: tInd, currentFlowInd: fInd} = window.rootDataObj;
  window.rootDataObj.devices[dInd].temp_data[tInd].flow_data[fInd] = {
    sFilename,
    workbook,
    mainMid: 0.0,
    isSeted: true,
  };
  // debugger
  // workbookStorage[''+colNumb+flowInd] = {workbook, sFilename};
  var storage = workbook.Sheets["Sheet1"];
  // debugger
  var keys = Object.keys(storage);


  maxIndex = 0;
  keys.forEach((el) => {
      if(el[0] == 'B' || el[0] == 'C') {
      let ind = +(el.substring(1)); 
      maxIndex = maxIndex > ind ? maxIndex : ind;
      console.log("");
      }
  })

  var startIndex = 2;
  if(storage["B2"].t === 's') {
      startIndex = 3
  }

  var midValue;
  var midIndex;
  
  function updateColumn(sumb) {
      function getMidValue(startPoint) {
      // debugger
      var baseValue = (storage[sumb+startPoint].w).replace(',', '.');
      let i = 0
      
      while(++i < 8) {
          var nextValue = storage[sumb+(startPoint+i)];
          nextValue = (nextValue.w).replace(',', '.');
          var relate = nextValue/baseValue;
          var absDif = Math.abs(relate-1);
          if (absDif > 0.1) {
          getMidValue(Math.floor(Math.random()*(maxIndex-8-startIndex)+startIndex));
          return
          }
      }
      midValue = baseValue;
      midIndex = startPoint;
      }
      getMidValue(Math.floor(Math.random()*(maxIndex-8-startIndex)+startIndex));

      // Необходимо переписать с заменой дефектного элемента на ближайшие

      function checkValueFnc(checkValue) {
        var relate = checkValue/midValue;
        var absDif = Math.abs(relate-1);
        return absDif > 0.1;
      }

      for(let i = startIndex; i <= maxIndex; i++) {
        var checkValue = (storage[sumb+i].w).replace(',', '.');
        if (checkValueFnc(checkValue)) {

          var reverseGear = i>maxIndex-8;
          // Обратный ход
          let k = 0;
          let kk = 0;
          let sum = 0;
          while(kk < 5) {
            var innerCheckVal;
            if(reverseGear) {
                innerCheckVal = (storage[sumb+(i-k-2)].w).replace(',', '.');
            } else {
                innerCheckVal = (storage[sumb+(i+k)].w).replace(',', '.');
            }
            
            if(!checkValueFnc(innerCheckVal)) {
                kk++;
                sum+=Number(innerCheckVal);
            }
            k++;
          }
          let repValue = sum/kk;
          storage[sumb+i] = {w: ""+Math.floor(repValue), t: 'n', v: Math.floor(repValue)};

            // Проход по 3 ближайшим элементам и вычисление их среднего значения
            // Предварительно необходимо выбрать направление для дальнейшего движения
        }
      }
  }

  updateColumn('B');
  updateColumn('C');
  

  // Расчет среднего значения.
  var sumB = 0;
  var sumC = 0;
  for(let i = startIndex; i <= maxIndex; i++) {
      sumB+=Number((storage['B'+i].w).replace(',', '.'));
      sumC+=Number((storage['C'+i].w).replace(',', '.'));
  }
  var midB = sumB/(maxIndex-(startIndex-1));
  var midC = sumC/(maxIndex-(startIndex-1));
  var mainMid = midB+midC;
  window.rootDataObj.devices[dInd].temp_data[tInd].flow_data[fInd].mainMid = mainMid;

  // var midStorageInd = ''+colNumb+timeNumb;
  // var flowData = getFlow(sFilename);
  // var checkFlowRes = checkFlow(midStorageInd, flowData);
  // if(checkFlowRes) {
  //   var flowAlertEl = document.getElementById(`same_flow_alert_t${colNumb}_${timeNumb}`);
  //   flowAlertEl.style ="color:red;"
  // }

  updateDOMTempTimeColumn();
  };

  reader.onerror = function(ex) {
    console.log(ex);
  };

  reader.readAsBinaryString(oFile);
}



function changeTab(tabInd) {
  // Обновление интерфейса
  const oldEl = document.getElementById(`tt_a_${currentTab}`);
  oldEl.className = "nav-link";

  const newEl = document.getElementById(`tt_a_${tabInd}`);
  newEl.className = "nav-link active"; 

  window.rootDataObj.currentTempInd = tabInd;
  // Перерисовка элементов
  updateDOMTempTimeColumn();

  currentTab = tabInd;
}

function downloadArchive() {
  // Не работает
  let keys = Object.keys(midStorage);
  let startIndexes = [];
  keys.forEach(ind => {
    if(!startIndexes.some(els => els == ind[0])) {
      startIndexes.push(ind[0]);
    }
  });
  startIndexes = startIndexes.sort((a, b) => a > b);

  const resWorkbookData = {};
  const simbols = ["A", 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P'];  

  startIndexes.forEach((el ,i) => {
    const workSimbol = simbols[i*2+1];
    const flowSimbol = simbols[i*2];
    let localStr = [];
    keys.forEach(key => {
      if(key[0] === el) {
        localStr.push(key);
      }
    });
    localStr = localStr.sort((a, b) => Number(a) > Number(b));
    localStr.forEach((ind, k) => {
      let payload = +midStorage[ind].mainMid.toFixed(1);
      // debugger
      resWorkbookData[workSimbol+(k+2)] = {v:payload, w:''+payload, t:'n'};

      const {numb, type} = getFlow(midStorage[ind].sFilename);
      const flowPass = ''+numb+type;
      resWorkbookData[flowSimbol+(k+2)] = {v:flowPass, w: flowPass, t:'s'};
    })
    const hat = `${+startIndexes[i][0]}0°C`;
    resWorkbookData[workSimbol+1] = {v:hat, w: hat, t:'s'};

    const flowHat = `Расход`
    resWorkbookData[flowSimbol+1] = {v:flowHat, w: flowHat, t:'s'};
  });
  resWorkbookData["!ref"] = "A1:P299";
  const resWorkbook = {
    SheetNames: ["Sheet1"],
    Sheets: {
      Sheet1: resWorkbookData
    }
  }
  console.log(globalWorkbook);


  XLSX.writeFile(resWorkbook, "Архив.xlsx", { compression: true });


}

function getFlow(sFilename) {

  var splitedStr = sFilename.split(/\(|\)/g)[1];
  let resObj = {};
  if(splitedStr.includes('m')) {
    resObj.numb = Number(splitedStr.replace('m', '.'));
    resObj.type = ' м³/ч';
  } else if(splitedStr.includes('L')) {
    resObj.numb = Number(splitedStr.replace('L', ''))
    resObj.type = ' л/ч';
  }
  return resObj;
}

function checkFlow(index, flowData) {
  // Необходимо переписать
  const {numb: flow, type} = flowData;
  return Object.keys(midStorage)
  .filter(el => el[0] === index[0])
  .some(el => {
    const {sFilename} = midStorage[el];
    var {numb:f2, type: t2} = getFlow(sFilename);
    return (f2===flow && t2 === type)});
}

function deleatFile(colNumb, flowInd) {
  window.rootDataObj.currentFlowInd = flowInd;
  const {currentDeviceInd: dInd, currentTempInd: tInd, currentFlowInd: fInd} = window.rootDataObj;

  window.rootDataObj.devices[dInd].temp_data[tInd].flow_data[fInd] = {
    sFilename: "",
    workbook: {},
    mainMid: 0.0,
    isSeted: false,
  };
  updateDOMTempTimeColumn();
}