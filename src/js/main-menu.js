window.addEventListener("load", () => {

  var reset_btn = document.getElementById("mm_reset_btn");
  reset_btn.addEventListener('click', resetGlobalData, false)

  const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
  const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));
  // отладка 
  // window.rootDataObj = {
  //   changeDir: function(newDir, deviceInd=-1) {
  //     let prevPage = document.getElementById(this.dir);
  //     prevPage.classList.add("blocked");

  //     let newPage = document.getElementById(newDir);
  //     newPage.classList = "main"
  //     this.dir = newDir;

  //     // работа с девайсами
  //     if(deviceInd != -1) {
  //       this.currentDevice = deviceInd;
  //       const dm_device_ind = document.getElementById("dm_device_ind");
  //       dm_device_ind.innerHTML = `Прибор ${deviceInd+1}`
  //     }
  //   },
  //   devicesNumb: 2,
  //   tempsNumb: 8,
  //   flowsNumb: 3,
  //   dir: "main_menu",
  //   currentDeviceInd:0,
  // }
  // window.rootDataObj.changeDir("koef-TK_input", 0);
  // отладка 

});

function resetGlobalData() {
  const {valueAsNumber: devicesNumb} = document.getElementById("mm_device_input");
  const {valueAsNumber: tempsNumb} = document.getElementById("mm_temp_input");
  const {valueAsNumber: flowsNumb} = document.getElementById("mm_flows_input");
  if(window.hasOwnProperty("rootDataObj")) {
    if(window.rootDataObj.hasOwnProperty("chart1")) {
      window.rootDataObj.chart1.destroy();
      delete window.rootDataObj.chart1;
    }
    if(window.rootDataObj.hasOwnProperty("chart2")) {
      window.rootDataObj.chart2.destroy();
      delete window.rootDataObj.chart2;
    }
  }

  window.rootDataObj = {
    changeDir: function(newDir, deviceInd=-1) {
      let prevPage = document.getElementById(this.dir);
      prevPage.classList.add("blocked");

      let newPage = document.getElementById(newDir);
      newPage.classList = "main"
      this.dir = newDir;
     
      // работа с девайсами
      if(deviceInd != -1) {
        this.currentDeviceInd = deviceInd;
        const dm_device_ind = document.getElementById("dm_device_ind");
        dm_device_ind.innerHTML = `Прибор ${deviceInd+1}`
      }

      updateDOMTempTimeColumn();
      updateDOMKoefTKIputs();
      
      updateTTChartData();
      updateKoefTKChartData();
    },
    devicesNumb,
    tempsNumb,
    flowsNumb,
    dir: "main_menu",
    currentDeviceInd:-1,
    currentTempInd: 0,
    currentFlowInd: 0,
  }
  // Инициализация главного хранилища
  window.rootDataObj.devices = {};
  for(let d = 0; d < devicesNumb; d++) {
    window.rootDataObj.devices[d] = {}
    window.rootDataObj.devices[d].temp_data = {};
    window.rootDataObj.devices[d].protocol_data = {};
    
    for(let t = 0; t < tempsNumb; t++) {
      window.rootDataObj.devices[d].temp_data[t] = {};
      window.rootDataObj.devices[d].temp_data[t].flow_data = {};
      for(let q = 0; q < flowsNumb; q++) {
        window.rootDataObj.devices[d].temp_data[t].flow_data[q] = {
          sFilename: "",
          workbook: {},
          mainMid: 0.0,
          isSeted: false,
        };
      }


      window.rootDataObj.devices[d].protocol_data[t] = {
        sFilename: "",
        workbook: {},
        deviceNumbInProto: 4,
        accureTemp: 0.0,
        errorRateObj: {},
      }
    }

    
  }

  var devices_container = document.getElementById("mm_devices_container");
  devices_container.innerHTML = "";


  for(let i = 0; i < +devicesNumb; i++) {
    let btn = document.createElement('button');
    btn.className = "btn btn-primary btn-sm mm_cont_btn";
    btn.type = "button";
    btn.innerHTML = `Прибор ${i+1}`
    btn.onclick = () => window.rootDataObj.changeDir("device_menu", i);
    devices_container.append(btn);
  }

  buildDOMTempTimeHeader();
  buildDOMTempTimeColumn();

  buildDOMKoefTKIputs()

  
}





