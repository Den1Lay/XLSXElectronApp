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
  for(let i = 1; i < 50; i++) {
    buildDOMLine(i);
  }
  
})
// onchange="(ev)=>filePicked(ev, ${i}, 1)"
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


var globalWorkbook;
var sFilename;
var workbookStorage = {};

function downloadFile(colNumb, timeNumb){
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
debugger
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
  var maxIndex = 0;
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
    flowDiv.innerHTML = ' '+splitedStr.replace('m', ',') + ' м³/ч';
  } else if(splitedStr.includes('L')) {
    flowDiv.innerHTML = ' '+splitedStr.replace('L', '') + ' л/ч';
  }

  // Установка имени файла
  fileName.innerHTML = ' '+sFilename;

  };

  reader.onerror = function(ex) {
  console.log(ex);
  };

  reader.readAsBinaryString(oFile);
}
