window.addEventListener("load", () => {

  var main_menu_btn = document.getElementById("rm_main_menu_btn");
  main_menu_btn.addEventListener('click', () => {
    window.rootDataObj.changeDir("main_menu")
  }, false);

});

function updateResTKChartData() {
  // Формирование общего протокола данных 
  // Проверка на то, что все данные протоколов выравнены
  const { devices } = window.rootDataObj;
  let first_formated_protocol_data_length = 0;
  Object.values(devices)
    .filter(el => el.hasOwnProperty("formated_protocol_data"))
    .forEach(({formated_protocol_data}, i) => {
    const check_length = Object.keys(formated_protocol_data).length;
    if(i === 0) {
      // Установка
      first_formated_protocol_data_length = check_length;
    } else {
      // Проверка
      if(first_formated_protocol_data_length != check_length) {
        // предупредить о том, что данные не выравнены
      }
    }
  })

  window.rootDataObj.result_formated_protocol_data = {};

  // 
  if(window.rootDataObj.hasOwnProperty("chart3")) {
    window.rootDataObj.chart3.destroy();
  }
}


  // // redraw
  // if(window.rootDataObj.hasOwnProperty("chart2")) {
  //   window.rootDataObj.chart2.destroy();
  // }
  // const { currentDeviceInd } = window.rootDataObj;
  // const flowsObj = window.rootDataObj.devices[currentDeviceInd].formated_protocol_data['0'].errorRateObj;
  // const flows = Object.keys(flowsObj).map(key => flowsObj[key].q.toFixed(2));
  // console.log("flows ", flows);
  // const datasets = getDatasets();
  // // debugger
  // const ctx2 = document.getElementById('koef-TK_chart');
  // const data = {
  //   labels: flows,
  //   datasets,
  // };

  // const config = {
  //   type: 'line',
  //   data: data,
  //   options: {
  //     responsive: true,
  //     plugins: {
  //       title: {
  //         display: true,
  //         text: 'Коэффициенты термокомпенсации для температур:'
  //       }
  //     },
  //     scales: {
  //       y: {
  //         title: {
  //           display: true,
  //           text: "Коэффициент, ое"
  //         }
  //       },
  //       x: {
  //         title: {
  //           display: true,
  //           text: "Расход, м³/ч"
  //         }
  //       }
  //     }
  //   }
  // };

  // window.rootDataObj.chart2 = new Chart(ctx2, config);
