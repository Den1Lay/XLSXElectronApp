// Убрать деление на 2. +
// Добавить возможность валидировать альтернативное название  2023-09-11_10-58-04(71L)_17000002  ---> 71 литр в час +
// Улучшить визуал +
// Добавить меню и возможность запускать другие программы




window.addEventListener("load", () => {
  // var oFileIn = document.getElementById('my_file_input');
  // var oFileIn_2 = document.getElementById('my_file_input_2');
  // var downloadBtn_t1 = document.getElementById('downloadBtn_t1');
  // oFileIn.addEventListener('change', (ev) => filePicked(ev, 1), false);
  // oFileIn_2.addEventListener('change', ev => filePicked(ev, 2), false);
  // downloadBtn_t1.addEventListener('click', downloadFile, false);
  debugger
  buildDOMColumn();
})
// onchange="(ev)=>filePicked(ev, ${i}, 1)"
function buildDOMColumn() {
  const parentId = "t1_box_id";
  for(let i = 0; i < 5; i++) {
    let div = document.createElement('div');

    div.className="t1_payload";
    div.innerHTML = 
    `<div class="t1_payload_input">
      <button type="button" class="btn btn-primary" onclick="document.getElementById('my_file_input_t1_${i}').click()">Выберите файл .csv</button>
      <input onchange="filePicked(event, ${i})" type="file" id="my_file_input_t1_${i}" style="display:none;"/>
      <div>Текущий файл:</div>
      <div id="file_name_t2_1"></div>
      </div>

      <div class="t1_payload_download">
      <button type="button" class="btn btn-secondary" id="downloadBtn_t1_${i}">Файл после фильтрации</button>
      </div>
      <div  class="t1_payload_middle">
      <div>Среднее значение: </div>
      <div id="mid_div_t1_${i}">0.0</div>
      </div>
      <div class="t1_payload_flow">
      <div>Расход: </div>
      <div id="flow_div_t1_${i}">0.0</div>
      </div>`;
    // var my_file_input_t1 = document.getElementById(`my_file_input_t1_${i}`);

    // my_file_input_t1.addEventListener('load', () =>{
    //   my_file_input_t1.addEventListener('change', (ev) => filePicked(ev, i), false);
    // })

    let t1_box_h = document.getElementById(parentId);
    t1_box_h.append(div);
  }
}


var globalWorkbook;
var sFilename;

function downloadFile(){
    console.log("check");
    if (globalWorkbook != undefined) {
    
    var newName = sFilename.split(".");
    console.log("SEND");
    XLSX.writeFile(globalWorkbook, newName[0]+".xlsx", { compression: true });
    }

}  

function filePicked(oEvent, timeNumb) {
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

  if(timeNumb === 1) {
    midDiv = document.getElementById('mid_div_t1_1');
    flowDiv = document.getElementById('flow_div_t1_1');
    fileName = document.getElementById('file_name_t1_1');
  }
  if(timeNumb === 2) {
    midDiv = document.getElementById('mid_div_t2_1');
    flowDiv = document.getElementById('flow_div_t2_1');
    fileName = document.getElementById('file_name_t2_1');
  }
  
  
  midDiv.innerHTML = ' '+mainMid.toFixed(1);
  // Установка расхода
  var splitedStr = sFilename.split(/\(|\)/g)[1];
  debugger
  if(splitedStr.includes('m')) {
    flowDiv.innerHTML = ' '+splitedStr.replace('m', ',') + ' м³/ч';
  } else if(splitedStr.includes('L')) {
    flowDiv.innerHTML = ' '+splitedStr.replace('L', '') + ' л/ч';
  }

  // Установка имени файла
  fileName.innerHTML = ' '+sFilename;

  

  let div = document.createElement('div');
  div.className="t1_payload";
  div.innerHTML = 
  `<div class="t1_payload_input">
    <button type="button" class="btn btn-primary" onclick="document.getElementById('my_file_input_2').click()">Выберите файл .csv</button>
    <input type="file" id="my_file_input_2" style="display:none;"/>
    <div>Текущий файл:</div>
    <div id="file_name_t2_1"></div>
    </div>

    <div class="t1_payload_download">
    <button type="button" class="btn btn-secondary" id="downloadBtn_t1_2">Файл после фильтрации</button>
    </div>
    <div  class="t1_payload_middle">
    <div>Среднее значение: </div>
    <div id="mid_div_t2_1">0.0</div>
    </div>
    <div class="t1_payload_flow">
    <div>Расход: </div>
    <div id="flow_div_t2_1">0.0</div>
    </div>`;
  let t1_box_h = document.getElementById('t1_box_h');
  t1_box_h.append(div);

  // workbook.SheetNames.forEach(function(sheetName) {
  //   // Here is your object
  //   var XL_row_object = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
  //   console.log("XL_row_object", XL_row_object);
  //   var json_object = JSON.stringify(XL_row_object);
  //   console.log(json_object);

  // })

  // const url = "https://sheetjs.com/data/executive.json";
  // // const raw_data = await (await ).json();
  // fetch(url)
  //   .then((res, er) => res.json().then(data => dataHandler(data)));
      
  
  // function dataHandler(raw_data) {
  //   debugger
  //   const prez = raw_data.filter(row => row.terms.some(term => term.type === "prez"));

  //   /* sort by first presidential term */
  //   prez.forEach(row => row.start = row.terms.find(term => term.type === "prez").start);
  //   prez.sort((l,r) => l.start.localeCompare(r.start));

  //   /* flatten objects */
  //   const rows = prez.map(row => ({
  //     name: row.name.first + " " + row.name.last,
  //     birthday: row.bio.birthday
  //   }));
  //   console.log(rows);

  //   const worksheet = XLSX.utils.json_to_sheet(rows);
  //   worksheet["D1"] = {t: 's', v: "val"}; // Add external element
  //   const workbook = XLSX.utils.book_new();
  //   XLSX.utils.book_append_sheet(workbook, worksheet, "Dates");

  //   // Dirty method. Not shift D object
  //   XLSX.utils.sheet_add_aoa(worksheet, [["Name", "Birthday", " ", "D header"]], { origin: "A1" });

  //   const max_width = rows.reduce((w, r) => Math.max(w, r.name.length), 10);
  //   worksheet["!cols"] = [ { wch: max_width } ];

  //   worksheet["!ref"] = "A1:E50";
  //   XLSX.writeFile(workbook, "Presidents.xlsx", { compression: true });

  // }

  };

  reader.onerror = function(ex) {
  console.log(ex);
  };

  reader.readAsBinaryString(oFile);
}
