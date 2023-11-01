// Убрать деление на 2. +
// Добавить возможность валидировать альтернативное название  2023-09-11_10-58-04(71L)_17000002  ---> 71 литр в час +
// Улучшить визуал +
// Добавить вкладки
// Добавить возможность сохранять все внесенные данные в файл excel




window.addEventListener("load", () => {
  // var oFileIn = document.getElementById('my_file_input');
  // var oFileIn_2 = document.getElementById('my_file_input_2');
  // var downloadBtn_t1 = document.getElementById('downloadBtn_t1');
  // oFileIn.addEventListener('change', (ev) => filePicked(ev, 1), false);
  // oFileIn_2.addEventListener('change', ev => filePicked(ev, 2), false);
  // downloadBtn_t1.addEventListener('click', downloadFile, false);
  let arc_down_btn = document.getElementById('arc_down_btn');
  arc_down_btn.addEventListener('click', () => downloadArchive(), false)

  for(let i = 2; i < 9; i++) {
    let el = document.getElementById(`a_${i}0`);
    el.addEventListener('click', (ev) => changeTab(ev, i, el), false);
  }
  for(let i = 2; i < 9; i++) {
    buildDOMColumn(i);
  }
  
})
// onchange="(ev)=>filePicked(ev, ${i}, 1)"

function buildDOMColumn(t1Ind){
  
  const parentId = `t${t1Ind}_box_id`;  
  let t1_box_h = document.getElementById(parentId);
  if(t1Ind != 2) {
    t1_box_h.className= "t1_box blocked"
  }
  for(let i = 1; i < 17; i++) {
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
          <button type="button" class="btn  btn-sm" onclick="document.getElementById('my_file_input_t${t1Ind}_${i}').click()">Выберите файл .csv</button>
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

    t1_box_h.append(div);
  }
  
}

function buildDOMLine(lineInd) {

  const parentId = `l${lineInd}_box_id`;
  let t1_box_h = document.getElementById(parentId);
  for(let i = 0; i < 7; i++) {
    let div = document.createElement('div');
    if(i === 0) {
      let numbDiv = document.createElement('div');
      numbDiv.className = "numbElem"
      numbDiv.innerHTML = `${lineInd}`
      t1_box_h.append(numbDiv);
    }
    div.className="t1_payload";
    div.innerHTML = 
    `<div class="t1_payload_input">
      <button type="button" class="btn btn-primary" onclick="document.getElementById('my_file_input_t${i}_${lineInd}').click()">Выберите файл .csv</button>
      <input onchange="filePicked(event, ${i}, ${lineInd})" type="file" id="my_file_input_t${i}_${lineInd}" style="display:none;"/>
      <div>Текущий файл:</div>
      <div id="file_name_t${i}_${lineInd}"></div>
      </div>

      <div class="t1_payload_download">
      <button type="button" class="btn btn-secondary" onclick='downloadFile(${i}, ${lineInd})'">Файл после фильтрации</button>
      </div>
      <div  class="t1_payload_middle">
      <div>Среднее значение: </div>
      <div id="mid_div_t${i}_${lineInd}">0.0</div>
      </div>
      <div class="t1_payload_flow">
      <div>Расход: </div>
      <div id="flow_div_t${i}_${lineInd}">0.0</div>
      </div>`;

    
    t1_box_h.append(div);
  }
}


// function buildDOMColumn(tInd) {
//   const parentId = `t${tInd}_box_id`;
//   for(let i = 0; i < 5; i++) {
//     let div = document.createElement('div');

//     div.className="t1_payload";
//     div.innerHTML = 
//     `<div class="t1_payload_input">
//       <button type="button" class="btn btn-primary" onclick="document.getElementById('my_file_input_t${tInd}_${i}').click()">Выберите файл .csv</button>
//       <input onchange="filePicked(event, ${tInd}, ${i})" type="file" id="my_file_input_t${tInd}_${i}" style="display:none;"/>
//       <div>Текущий файл:</div>
//       <div id="file_name_t${tInd}_${i}"></div>
//       </div>

//       <div class="t1_payload_download">
//       <button type="button" class="btn btn-secondary" onclick='downloadFile(${tInd}, ${i})'">Файл после фильтрации</button>
//       </div>
//       <div  class="t1_payload_middle">
//       <div>Среднее значение: </div>
//       <div id="mid_div_t${tInd}_${i}">0.0</div>
//       </div>
//       <div class="t1_payload_flow">
//       <div>Расход: </div>
//       <div id="flow_div_t${tInd}_${i}">0.0</div>
//       </div>`;

//     let t1_box_h = document.getElementById(parentId);
//     t1_box_h.append(div);
//   }
// }


var currentTab = 2;

var maxIndex;
var globalWorkbook;
var sFilename;
var workbookStorage = {};
var midStorage = {};

function downloadFile(colNumb, timeNumb){
  debugger
    console.log("check");
    var addr = ''+colNumb+timeNumb;
    if(workbookStorage.hasOwnProperty(''+colNumb+timeNumb)) {
      let {workbook, sFilename} = workbookStorage[addr];
      var newName = sFilename.split(".");
      console.log("SEND");
      XLSX.writeFile(workbook, newName[0]+".xlsx", { compression: true });
    }

}  

function filePicked(oEvent, colNumb, timeNumb) {
// debugger
var oFile = oEvent.target.files[0];
sFilename = oFile.name;

// Create A File Reader HTML5
var reader = new FileReader();


reader.onload = function(e) {
  var data = e.target.result;
  var workbook = XLSX.read(data, {
      type: 'binary'
  });
  console.log(workbook);
  workbookStorage[''+colNumb+timeNumb] = {workbook, sFilename};
  var storage = workbook.Sheets["Sheet1"];
  // debugger
  var keys = Object.keys(storage);

  //
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
      var baseValue = storage[sumb+startPoint].w;
      let i = 0
      
      while(++i < 8) {
          var nextValue = storage[sumb+(startPoint+i)];
          nextValue = nextValue.w;
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
      var checkValue = storage[sumb+i].w;
      if (checkValueFnc(checkValue)) {

          var reverseGear = i>maxIndex-8;
          // Обратный ход
          let k = 0;
          let kk = 0;
          let sum = 0;
          while(kk < 5) {
          var innerCheckVal;
          if(reverseGear) {
              innerCheckVal = storage[sumb+(i-k-2)].w;
          } else {
              innerCheckVal = storage[sumb+(i+k)].w;
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
  // debugger
  globalWorkbook = workbook;
  

  // Расчет среднего значения.
  var sumB = 0;
  var sumC = 0;
  for(let i = startIndex; i <= maxIndex; i++) {
      sumB+=Number(storage['B'+i].w);
      sumC+=Number(storage['C'+i].w);
  }
  var midB = sumB/(maxIndex-(startIndex-1));
  var midC = sumC/(maxIndex-(startIndex-1));
  var mainMid = (midB+midC);

  var midStorageInd = ''+colNumb+timeNumb;
  var flowData = getFlow(sFilename);
  var checkFlowRes = checkFlow(midStorageInd, flowData);
  if(checkFlowRes) {
    var flowAlertEl = document.getElementById(`same_flow_alert_t${colNumb}_${timeNumb}`);
    flowAlertEl.style ="color:red;"
  }

  midStorage[midStorageInd] = {sFilename, mainMid};
  var midDiv;
  var flowDiv;
  var fileName;

  midDiv = document.getElementById(`mid_div_t${colNumb}_${timeNumb}`);
  flowDiv = document.getElementById(`flow_div_t${colNumb}_${timeNumb}`);
  fileName = document.getElementById(`file_name_t${colNumb}_${timeNumb}`);

  midDiv.innerHTML = ' '+mainMid.toFixed(1);
  // Установка расхода
  var splitedStr = sFilename.split(/\(|\)/g)[1];
  if(splitedStr.includes('m')) {
    flowDiv.innerHTML = ' '+splitedStr.replace('m', '.') + ' м³/ч';
  } else if(splitedStr.includes('L')) {
    flowDiv.innerHTML = ' '+splitedStr.replace('L', '') + ' л/ч';
  }

  // Установка имени файла
  fileName.innerHTML = ` ${sFilename}`;

  };

  reader.onerror = function(ex) {
    console.log(ex);
  };

  reader.readAsBinaryString(oFile);
}



function changeTab(ev, tabTemp, activEl) {
  let oldEl = document.getElementById(`a_${currentTab}0`);
  oldEl.className = "nav-link";
  activEl.className = "nav-link active";
  
  
  const currentParent = `t${currentTab}_box_id`;  
  let t1_box_h = document.getElementById(currentParent);
  t1_box_h.classList.add("blocked");

  const newParent = `t${tabTemp}_box_id`;
  let t_new_box = document.getElementById(newParent);
  t_new_box.className = "t1_box";


  currentTab = tabTemp;
}

function downloadArchive() {
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

  const {numb: flow, type} = flowData;
  return Object.keys(midStorage)
  .filter(el => el[0] === index[0])
  .some(el => {
    const {sFilename} = midStorage[el];
    var {numb:f2, type: t2} = getFlow(sFilename);
    return (f2===flow && t2 === type)});
}

function deleatFile(colNumb, timeNumb) {
  var addr = ''+colNumb+timeNumb;
    if(midStorage.hasOwnProperty(addr)) {
      delete workbookStorage[addr];
    }
    if(midStorage.hasOwnProperty(addr)) {
      delete midStorage[addr];
    }
    // 
    var midDiv;
    var flowDiv;
    var fileName;
    var flowAlertEl;

    midDiv = document.getElementById(`mid_div_t${colNumb}_${timeNumb}`);
    flowDiv = document.getElementById(`flow_div_t${colNumb}_${timeNumb}`);
    fileName = document.getElementById(`file_name_t${colNumb}_${timeNumb}`);
    flowAlertEl = document.getElementById(`same_flow_alert_t${colNumb}_${timeNumb}`);

    
    midDiv.innerHTML = "0.0";
    flowDiv.innerHTML = "0.0";
    fileName.innerHTML = "";
    flowAlertEl.style ="color:transparent;"

}