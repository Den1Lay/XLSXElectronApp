
window.addEventListener("load", () => {
  const ki_device_menu_btn = document.getElementById("ki_device_menu_btn");
  ki_device_menu_btn.addEventListener('click', () => {
    window.rootDataObj.changeDir("device_menu");
  });
  
  const ki_device_transfer_btn = document.getElementById('ki_device_transfer_btn');
  ki_device_transfer_btn.addEventListener('click', () => {
    transferHandler();
  })
  
})

function buildDOMKoefTKIputs() {
  const parentId = "ki_box_workArea";
  const ki_box_workArea = document.getElementById(parentId);
  ki_box_workArea.innerHTML = '';
  const tempsNumb = window.rootDataObj.tempsNumb;
  for(let i = 0; i < tempsNumb; i++) {
    let div = document.createElement('div');

    div.className = 'ki_payload';
    div.innerHTML = 
      `<div class="ki_temp_number">
          ${20+10*i} °C
        </div>
        <div class="ki_input_area">
          <div class="ki_btn_zone">
            
            <div class="ki_payload_input">
              <button type="button" class="btn btn-outline-primary btn-sm" onclick="document.getElementById('my_ki_file_input_${i}').click()">
              Файл ${i === 0 ? "градуировки" : "протокола"} .xlsx
              </button>
              <input onchange="pickProtocol(event, ${i})" type="file" id="my_ki_file_input_${i}" style="display:none;"/>
            </div>

            <button onclick='deleteProtocol(${i})' type="button" class="btn btn-outline-secondary btn-sm">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
              </svg>
            </button>

            <div class="ki_accure_temp" id="ki_accure_temp_${i}">
              Точная темп: ${20+10*i} °C
            </div>
          </div>
          
          <div class="ki_filename_area" id="ki_filename_area_${i}">
            Текущий файл:
          </div>
        </div>`;
    ki_box_workArea.append(div);
  }
}

function updateDOMKoefTKIputs() {
  // debugger
  const { currentDeviceInd } = window.rootDataObj;
  const { protocol_data } = window.rootDataObj.devices[currentDeviceInd];
  Object.keys(protocol_data).forEach(key => {
    const { sFilename, deviceNumbInProto, accureTemp } = window.rootDataObj.devices[currentDeviceInd].protocol_data[key];
    const ki_accure_temp_id = document.getElementById(`ki_accure_temp_${key}`);
    const ki_filename_area_id = document.getElementById(`ki_filename_area_${key}`);
    ki_accure_temp_id.innerHTML = `Точная темп: ${accureTemp.toFixed(2)} °C`;
    ki_filename_area_id.innerHTML = `Текущий файл: ${sFilename}`;
  })
}

function pickProtocol(oEvent, tempInd) {
  // Необходимо интегрировать обработку файлов градуировки

  var oFile = oEvent.target.files[0];
  sFilename = oFile.name;

  var reader = new FileReader();

  reader.onload = function(e) {
    // Необходимо добавить минимальную проверку приходящих файлов
    var data = e.target.result;
    var workbook = XLSX.read(data, {
        type: 'binary'
    });
    console.log(workbook);

    const {valueAsNumber: deviceNumbInProto} = document.getElementById("ki_device_input");
    
    const {currentDeviceInd: dInd} = window.rootDataObj;

    let accureTemp;
    let errorRateObj;
    if(tempInd === 0) {
      // проверкить, что это действительно файл градуировки
      accureTemp = getGradTemp(workbook);
      if (accureTemp === 0) editAlert('ki_dev_id_grad');
      errorRateObj = {};
    } else {
      
      accureTemp = getAccureTemp(workbook);
      errorRateObj = getErrorRateObj(workbook, deviceNumbInProto);

      // Заполнить errorRateObj файла градуировки расходами, как у остальных.
    }

    window.rootDataObj.devices[dInd].protocol_data[tempInd] = {
      sFilename,
      workbook,
      deviceNumbInProto,
      accureTemp,
      errorRateObj,
    }

    updateDOMKoefTKIputs();
  }

  reader.onerror = function(ex) {
    console.log("ERROR", ex);
  };

  reader.readAsBinaryString(oFile);

  function getAccureTemp(workbook) {
    
    const contolAr = [];
    const workObj = workbook.Sheets["Погреш_контр_точ"];
    for(let i = 15; i > 0; i=i+2) {
      if(!workObj.hasOwnProperty('G'+i)) break;
      const value = workObj['G'+i].v;
      if(value === 0.0) continue;
      contolAr.push(value);
    }
    console.log(contolAr);
    return contolAr.reduce((a, next) => a+next)/contolAr.length;
  }

  
}

function getErrorRateObj(workbook, deviceNumb, sFileNAME = '') {
  
  const devicesCharAr = ['0', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S'];
  const devChar = devicesCharAr[deviceNumb];
  const resObj = {};
  const workObj = workbook.Sheets["Погреш_контр_точ"];

  let prevFlow = 0;
  let resObjInd = 0;
  
  // Необходимо найти исходную точку путем поиска паттерна
  // let AInd = 1;
  // while(1) {
  //   const key = 'A'+AInd;
  //   if(!workObj.hasOwnProperty(key)) {
  //     AInd+=1;
  //     continue
  //   }
  //   if(workObj[key].v.includes("погрешность")) {
  //     AInd+=1;
  //     break
  //   }
  //   AInd+=1;
  // };
  let AInd = 1;
  while(1) {
    const key = 'G'+AInd;
    if(!workObj.hasOwnProperty(key)) {
      AInd+=1;
      continue
    }
    if(workObj[key].v > 10 || workObj[key].v === 0) {
      // Фильтрация температур и пустых нулей
      AInd+=1;
      continue;
    }
    let k = 1;
    let deathFlag = false
    while(1) {
      // check
      const checkKey = 'G'+(AInd+k);
      if(!workObj.hasOwnProperty(checkKey)) {
        AInd++;
        break
      }

      const real_q = workObj[checkKey].v;
      if(real_q > 10 || real_q === 0) {
        // Фильтрация температур и пустых нулей
        AInd++;
        break
      }
      if(k > 5) {
        deathFlag = true;
        break;
      }

      k++;
    }
    if(deathFlag) break;
  }
  
  let i = AInd;
  while(1) {
    const q_key = 'G'+i;
    if(!workObj.hasOwnProperty(q_key)) {
      break
    }
    const q_pot = workObj[q_key].v;
    if(!workObj.hasOwnProperty(devChar+i)) {
      // Обработка пустых полей
      i++;
      continue
    }
    const er_obj = workObj[devChar+i];
    const er_pot = er_obj.v;
    if(er_pot === 0.0) {
      // Обработка нулевых позиций
      i++;
      continue
    }

    const isNear = Math.abs(prevFlow/q_pot-1) < 0.15;
    if(isNear) {
      const {q: prevQ, er: prevEr} = resObj[resObjInd-1];
      resObj[resObjInd-1] = {q: (prevQ+q_pot)/2, er: (prevEr+er_pot)/2};
    } else {
      resObj[resObjInd] = {q: q_pot, er: er_pot};
      resObjInd++;
    }

    prevFlow = q_pot;
    i++;
  }
  
  // Активировать предупреждение, если resObj.length == 0
  if(Object.keys(resObj).length === 0) {
    const toastLiveExample = document.getElementById('ki_dev_id_toast');
    const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample);
    toastBootstrap.show();
  }
  return resObj;
}


function deleteProtocol(tempInd) {
  
  const {currentDeviceInd: dInd} = window.rootDataObj;

  window.rootDataObj.devices[dInd].protocol_data[tempInd] = {
    sFilename: "",
    workbook: {},
    deviceNumbInProto: 4,
    accureTemp: 0.0,
    errorRateObj: {},
  }

  updateDOMKoefTKIputs();
}


function transferHandler() {
  const {valueAsNumber: copyDeviceInd} = document.getElementById("ki_device_transfer_index");
  
  const devicesIndexes = Object.keys(window.rootDataObj.devices);
  if(devicesIndexes.some(el => (+el+1) === copyDeviceInd)) {
    const {valueAsNumber: deviceNumbInProto} = document.getElementById("ki_device_input");

    const { currentDeviceInd: cDI } = window.rootDataObj;
    const { protocol_data } = window.rootDataObj.devices[copyDeviceInd-1];
    Object.values(protocol_data).forEach(({sFilename, accureTemp, workbook}, i) => {
      if(accureTemp !== 0) {
        let errorRateObj = {};
        if(i != 0) errorRateObj = getErrorRateObj(workbook, deviceNumbInProto, sFilename);
        window.rootDataObj.devices[cDI].protocol_data[i] = {
          sFilename,
          accureTemp,
          workbook,
          deviceNumbInProto,
          errorRateObj,
        }
      }

    });
    console.log(window.rootDataObj.devices[cDI]);


    updateDOMKoefTKIputs();
  } else {
    const toastLiveExample = document.getElementById('liveToast');
    const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample);
    toastBootstrap.show();
  }
}

function getGradTemp(workbook) {
  const contolAr = [];
  const workObj = workbook.Sheets["Kосн"];
  for(let i = 15; i < 21; i=i+2) {
    const value = workObj['G'+i].v;
    contolAr.push(value);
  } 

  return contolAr.reduce((a, next) => a+next, 0)/contolAr.length;
}

function editAlert(documentId) {
  const toastLiveExample = document.getElementById(documentId);
    const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample);
    toastBootstrap.show();
}

function transferDataRateObject() {
  // Вызывается при переходе, чтобы забить файл градиуировки значениями расходов.
  // Это используется, чтобы подключить график Temp - Time

  const {currentDeviceInd: cDI} = window.rootDataObj;
  const { protocol_data } = window.rootDataObj.devices[cDI];
  if (Object.keys(protocol_data["0"].errorRateObj).length > 0) return
  Object.values(protocol_data).forEach(({errorRateObj}) => {
    const checkObj = Object.keys(errorRateObj);
    if(checkObj.length != 0) {
      // производится отправка errorRateObj на объект градуировки
      protocol_data["0"].errorRateObj = errorRateObj;
    }
  })

}
// function updateDOMTempTimeColumn() {
//   const {currentDeviceInd: dInd, currentTempInd: tInd, currentFlowInd: fInd, flowsNumb} = window.rootDataObj;

//   for(let i = 0; i < flowsNumb; i++) {
//     const {mainMid, sFilename} = window.rootDataObj.devices[dInd].temp_data[tInd].flow_data[i]

//     const midDiv = document.getElementById(`mid_div_t0_${i}`);
//     const flowDiv = document.getElementById(`flow_div_t0_${i}`);
//     const fileName = document.getElementById(`file_name_t0_${i}`);
//     // debugger
//     midDiv.innerHTML = ' '+mainMid.toFixed(1);
//   // Установка расхода
//     if(sFilename !== "") {
//       var splitedStr = sFilename.split(/\(|\)/g)[1];
//       if(splitedStr.includes('m')) {
//         flowDiv.innerHTML = ' '+splitedStr.replace('m', '.') + ' м³/ч';
//       } else if(splitedStr.includes('L')) {
//         flowDiv.innerHTML = ' '+splitedStr.replace('L', '') + ' л/ч';
//       }
//     } else {
//       flowDiv.innerHTML = "0.0";
//     }

//     // Установка имени файла
//     fileName.innerHTML = ` ${sFilename}`
      
//   }

// }

