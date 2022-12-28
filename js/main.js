moment.locale("es");

//esto es para cargar por defento la opcion que ya esta seleciconada (deslizamientos)
$(document).ready(function () {
  var checkboxes = $("input[type=checkbox]");
  checkboxes.each(function (index, value) {
    if ($(value).is(":checked")) {
      $(value).click(); // by default checked. if click now check box will be unchecked
      $(value).click(); // above line uncheck the checkbox  now we have to check it again, because this is what all we want
    }
  });
});

var bar = document.getElementById("bars");
var donut = document.getElementById("donut");
var tablas = document.getElementById("Amarillaa");
var tablas2 = document.getElementById("Naranjaa");
var tablas3 = document.getElementById("Rojaa");
function func_nivel_alerta(d) {
  //Nivel de alertas Deslizamientos y alertas Incendios
  return d === "Baja"
    ? "Amarilla"
    : d === "Moderada"
    ? "Naranja"
    : d === "Alta"
    ? "Naranja"
    : d === "Muy Alta"
    ? "Roja"
    : d === "3"
    ? "Amarilla"
    : d === "4"
    ? "Naranja"
    : d === "5"
    ? "Roja"
    : "Roja";
}
function getColor(d) {
  //GetColor para alertas Deslizamientos y alertas Incendios
  return d === "Baja"
    ? "#EEFF00"
    : d === "Moderada"
    ? "#FF6200"
    : d === "Alta"
    ? "#FF6200"
    : d === "Muy Alta"
    ? "#FF0000"
    : d === "Amarilla"
    ? "#EEFF00"
    : d === "Naranja"
    ? "#FF6200"
    : d === "Roja"
    ? "#FF0000"
    : d === "Andina"
    ? "#538234"
    : d === "Caribe"
    ? "#92D14F"
    : d === "Orinoquia"
    ? "#C5E0B5"
    : d === "Pacifico"
    ? "#E2F0D9"
    : d === "Amazonia"
    ? "#3A5721"
    : d === "ANDINA"
    ? "#538234"
    : d === "CARIBE"
    ? "#92D14F"
    : d === "ORINOQUIA"
    ? "#C5E0B5"
    : d === "PACIFICO"
    ? "#E2F0D9"
    : d === "AMAZONIA"
    ? "#3A5721"
    : d === "Departamento"
    ? "#C7CDCD"
    : "#FF0000";
}
function categorizar_des(data) {
  for (var i in data) {
    if (data[i].TEXTO_AMENAZA == "Baja") {
      data[i].TEXTO_AMENAZA = func_nivel_alerta("Baja");
    } else if (data[i].TEXTO_AMENAZA == "Moderada") {
      data[i].TEXTO_AMENAZA = func_nivel_alerta("Moderada");
    } else if (data[i].TEXTO_AMENAZA == "Alta") {
      data[i].TEXTO_AMENAZA = func_nivel_alerta("Alta");
    } else if (data[i].TEXTO_AMENAZA == "Muy Alta") {
      data[i].TEXTO_AMENAZA = func_nivel_alerta("Muy Alta");
    }
  }
}
function categorizar_icv(data) {
  for (var i in data) {
    if (data[i].PROBABILIDAD == "5") {
      data[i].PROBABILIDAD = func_nivel_alerta("5");
    } else if (data[i].PROBABILIDAD == "4") {
      data[i].PROBABILIDAD = func_nivel_alerta("4");
    } else if (data[i].PROBABILIDAD == "3") {
      data[i].PROBABILIDAD = func_nivel_alerta("3");
    }
  }
}
function sorter(a, b) {
  if (a.Departamento < b.Departamento || a.key < b.key) {
    return -1;
  }
  if (a.Departamento > b.Departamento || a.key > b.key) {
    return 1;
  }
  return 0;
}

function max(_data) {
  var out = 0;
  for (var key in _data) {
    out = Math.max(
      out,
      _data[key].Amarilla ? _data[key].Amarilla : 0,
      _data[key].Naranja ? _data[key].Naranja : 0,
      _data[key].Roja ? _data[key].Roja : 0
    );
  }
  return out;
}
$("input:checkbox").on("click", function () {
  var $box = $(this);
  if ($box.is(":checked")) {
    var group = "input:checkbox[name='" + $box.attr("name") + "']";
    // the checked state of the group/box on the other hand will change
    // and the current value is retrieved using .prop() method
    $(group).prop("checked", false);
    $box.prop("checked", true);
  } else {
    $box.prop("checked", false);
  }
});
//para que siempre este seleccionada al menos una opcion
$(document).ready(function () {
  $(document).on("change", ".radio", function () {
    $(".radio").prop("checked", false);
    $(this).prop("checked", true);
  });
});
//fin
checkedArray = [];
$(":radio").change(function () {
  checkedArray = [];
  if (this.checked) {
    checkedArray.push(this.id);
  } else {
    checkedArray.splice(checkedArray.indexOf(this.id), 1);
  }
});

csv_file("", checkedArray.toString());
function csv_file(obj, t_dona) {
  if ($(obj).is(":checked")) {
    var x = $(obj).attr("id");
    if (x == "a") {
      bar.innerHTML = "";
      tablas.innerHTML = "";
      tablas2.innerHTML = "";
      $("#selectButton").selectize()[0].selectize.destroy();
      document.getElementById("textalert").innerHTML =
        "Pronóstico de la amenaza por deslizamientos de tierra";
      id = "data/alertas_deslizamiento.csv";
    } else {
      bar.innerHTML = "";
      tablas.innerHTML = "";
      $("#selectButton").selectize()[0].selectize.destroy();
      document.getElementById("textalert").innerHTML =
        "Pronóstico de la amenaza por incendios de la cobertura vegetal";
      id = "data/latest_ICV.csv";
    }

    var selected = document.getElementById("selectButton");
    var length = selected.options.length;

    d3.text(id, function (raw) {
      var dsv = d3.dsvFormat(";");
      data = dsv.parse(raw);

      //para borrar los datos con nulos

      var listToDelete = [""];

      for (var i = 0; i < data.length; i++) {
        var obj = data[i];

        if (listToDelete.indexOf(obj.PROBABILIDAD) !== -1) {
          data.splice(i, 1);
          i--;
        }
      }
      //para borrar los datos con nulos

      if (data.columns.length == 12 || data.columns.length == 11) {
        categorizar_des(data);

        amenazasdptos = d3
          .nest()
          .key(function (d) {
            return d.DEPTO.toLowerCase();
          })
          .key(function (d) {
            return d.TEXTO_AMENAZA;
          })
          .rollup(function (v) {
            return v.length;
          })
          .object(data);
      } else {
        categorizar_icv(data);

        amenazasdptos = d3
          .nest()
          .key(function (d) {
            return d.DEPARTAMENTO.toLowerCase();
          })
          .key(function (d) {
            return d.PROBABILIDAD;
          })
          .rollup(function (v) {
            return v.length;
          })
          .object(data);
      }

      amenazasCount = d3
        .nest()
        .key(function (d) {
          return d.PROBABILIDAD || d.TEXTO_AMENAZA;
        })
        .rollup(function (v) {
          return v.length;
        })
        .entries(data)
        .sort(sorter);

      cat = d3
        .nest()
        .key(function (d) {
          return d.PROBABILIDAD || d.TEXTO_AMENAZA;
        })
        .object(data);

      //para sacar la fecha de actualizacion de las alertas
      fecha = d3
        .nest()
        .key(function (d) {
          return d.FECHA || d.FECHA_EJECUCION;
        })
        .rollup(function (v) {
          return v.length;
        })
        .object(data);

      fecha = Object.keys(fecha).toString();

      starttime = moment().seconds(0).minutes(20).hours(11);
      deadline = moment().seconds(0).minutes(0).hours(16);
      local_time = moment();

      m = moment(fecha, "DD/MM/YYYY").format("LL");

      if (local_time.isBefore(deadline) && local_time.isAfter(starttime)) {
        HLC = " | 13:00 HLC";
      } else {
        HLC = " | 18:00 HLC";
      }

      document.getElementById("date").innerHTML =
        "Actualización " + m.toString() + HLC;

      amenazasCount.forEach(function (d) {
        d.value = +d.value;
      });

      result = Object.entries(amenazasdptos)
        .reduce(
          (acc, [Departamento, properties]) => [
            ...acc,
            { Departamento, ...properties },
          ],
          []
        )
        .sort(sorter);

      for (i = length - 1; i >= 0; i--) {
        selected.options[i] = null;
      }

      for (index in result) {
        selected.options[selected.options.length] = new Option(
          result[index]["Departamento"]
        );
      }

      //nuevo para multiples selecciones

      var $select = $("#selectButton").selectize({
        create: true,
        placeholder: "Seleccione un departamento",
      });

      selections = $select;

      $("head").append(
        '<link rel="stylesheet" href="css/selectize.' + "default" + '.css">'
      );

      //fin multiples seleciones

      subgroups = Object.keys(cat).sort();

      groups = d3
        .map(result, function (d) {
          return d.Departamento;
        })
        .keys();

      total = d3.sum(
        amenazasCount.map(function (d) {
          return d.value;
        })
      );

      load_bar();
      load_donut(x, checkedArray.toString());
      //tabulate(result,['Departamento'].concat(subgroups),[])
    });
  }
}
