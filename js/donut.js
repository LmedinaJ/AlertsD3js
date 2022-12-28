var marginD = {top: 50, right: 10, bottom: 50, left: 150},
    widthD = 500 - marginD.right - marginD.left,
    heightD = 500 - marginD.top - marginD.bottom,
    radius = Math.min(widthD, heightD) / 2;
// arc generator    
var arc = d3.arc()
    .outerRadius(radius - 10)
    .innerRadius(radius - 70);
// Another arc that won't be drawn. Just for labels positioning
var outerArc = d3.arc()
  .innerRadius(radius * 0.9)
  .outerRadius(radius * 0.9)
// generate pie chart and donut chart
var pie = d3.pie()
    .sort(null)
    .value(function(d) { return d.value; });
// define the svg for pie chart
var svg = d3.select("#donut").append("svg")
    .attr("width", widthD + marginD.right + marginD.left)
    .attr("height", heightD + marginD.top + marginD.bottom)
    .append("g")
    .attr("transform", "translate(" + widthD / 2 + "," + heightD / 2 + ")");

var tooltip = d3.select("#donut")    
    .append('div')
    .attr('class', 'tooltip');
tooltip.append('div')
    .attr('class', 'label');

tooltip.append('div')
    .attr('class', 'percent');

function k_alert(obj){  
  t_dona=[]
  if($(obj).is(":checked")){
    var x=($(obj).attr('id'));
    if (x=='r'){
      t_dona='alertas'
    }else{
      t_dona='regiones'
    }   
  }
  load_donut(checkedArray.toString(),t_dona)
}


function load_donut(x,t_dona){
  console.log(t_dona)

  if (t_dona=='regiones'){
    t_dona='regiones'
    document.getElementById("tipo_dona").innerHTML = 'Municipios por región';
  }else if (t_dona=='alertas'){
    t_dona='alertas'
    document.getElementById("tipo_dona").innerHTML = 'Muncipios por nivel de amenaza';
  }else if (t_dona=='al'){
    t_dona='regiones'
    document.getElementById("tipo_dona").innerHTML = 'Municipios por región';
  }else{
    t_dona='alertas'
    document.getElementById("tipo_dona").innerHTML = 'Muncipios por nivel de amenaza';
  }
  var selectizeControl = selections[0].selectize
    selectizeControl.on('change', function() {       

      var listaindex=[]
      var test = selectizeControl;
      listaindex.push(test.items)
      
      updates(listaindex[0].map(function(x){ return x.toUpperCase() }))

    });


    updates([])
    function updates(selectedGroup) {
        svg.selectAll('rect').remove()
        svg.selectAll('text').remove()

        var newdata=[]

        if (t_dona==undefined||t_dona=='alertas'){
          if ((selectedGroup.length>0) ){
            newdata = data.filter(function(d,i){if (selectedGroup.includes(d.DEPTO||d.DEPARTAMENTO)){return d}    ;});

            dataFilter =  (d3.nest()
                              .key(function(d) { return d.PROBABILIDAD||d.TEXTO_AMENAZA; })
                              .rollup(function(v) { return v.length; })
                              .entries(newdata)).sort(sorter);
         }else {
            dataFilter=amenazasCount

          }
        }else{
          if (selectedGroup.length>0){
            console.log('entre')

            newdataa = data.filter(function(d,i){if (selectedGroup.includes(d.DEPTO||d.DEPARTAMENTO)){return d}    ;});
            console.log(newdataa)

            dataFilter =  (d3.nest()
                    .key(function(d) { return d.REGION; })
                    .rollup(function(v) { return v.length; })
                    .entries(newdataa)).sort(sorter);
            console.log(dataFilter)

          }else{
            newdataa=data
            dataFilter =  (d3.nest()
                    .key(function(d) { return d.REGION; })
                    .rollup(function(v) { return v.length; })
                    .entries(newdataa)).sort(sorter);
          }
        }

        total = d3.sum(dataFilter.map(function(d) {return d.value;}))

        var g = svg.selectAll("arc")
            .data(pie(dataFilter))

        var gEnter = g.enter().append('g')
            .attr("class", "arc");

        gEnter.append("path")
            .attr("d", arc)
            .style("fill", function(d) { return getColor(d.data.key); });

        gEnter.on('mouseover', function(d) {
          var percent = Math.round(1000 * d.data.value / total) / 10;
          tooltip.select('.label').html(d.data.key.toLowerCase());
          tooltip.select('.percent').html(percent + '%');
          tooltip.style('display', 'block');
          });

        gEnter.on('mousemove', function(d) {
          tooltip.style('top', (d3.event.layerY - 30) + 'px')
          .style('left', (d3.event.layerX - 25) + 'px');
        });

        gEnter.on('mouseout', function() {
              tooltip.style('display', 'none');
              }); 

        var legendG = svg.selectAll("legend")
            .data(pie(dataFilter))

        var legendEnter= legendG.enter().append('g')
            .attr("transform", function(d,i){
                return "translate(" + (widthD / 2 - radius*1.2) + "," + ((i * + 20)) + ")";
            })
            .attr("class", "legend");

        legendG.exit().remove();

        legendEnter.append("rect")
          .attr("x", -35)
          .attr("y", -30)
          .attr("width", 10)
          .attr("height", 10)
          .attr("fill",  function(d) {return getColor(d.data.key); });

        legendEnter.append("text")
          .text(function(d){if (t_dona!='regiones'){
            return 'Municipios: '+d.value +' ('+ ((d.value/total)*100).toFixed(1)+ "%)";
          }
          else{
            return d.data.key.toLowerCase()+': ' +''+ ((d.value/total)*100).toFixed(1)+ "%";
          }
          })
          .style("text-transform", "capitalize")
          .style("font-size", 13)
          .attr("y", -20)
          .attr("x", -20);

          document.getElementById('amenazaCount').innerHTML =  'Total municipios '+ ': ' +total;


          console.log(total);

          alertas=[0,1,2,3,4]

          if (t_dona=='alertas'){
            for (i = 0; i < alertas.length; i++){
              if(dataFilter[i]!=undefined){
                document.getElementById('amenazaCount'+i).style.border = "1px solid #ccc";
                document.getElementById('amenazaCount').style.border = "1px solid #ccc";
                if(dataFilter[i].value>1){mun=' municipios'}else{mun=' municipio'}
                document.getElementById('amenazaCount'+i).innerHTML =  'Alerta '+ dataFilter[i].key.toLowerCase() +': ' +dataFilter[i].value+mun;
              }else{
                document.getElementById('amenazaCount'+i).style.border = "none";
                document.getElementById('amenazaCount'+i).innerHTML =  '';
              }
            }
          }else{
            for (i = 0; i < alertas.length; i++){
              if(dataFilter[i]!=undefined){
                document.getElementById('amenazaCount'+i).style.border = "1px solid #ccc";
                document.getElementById('amenazaCount').style.border = "none";        
                if(dataFilter[i].value>1){mun=' municipios'}else{mun=' municipio'}
                document.getElementById('amenazaCount'+i).innerHTML =  'Región '+ dataFilter[i].key.toLowerCase() +': ' +dataFilter[i].value+mun//+
                document.getElementById('amenazaCount').innerHTML =  '';
              }else{
                document.getElementById('amenazaCount'+i).style.border = "none";
                document.getElementById('amenazaCount').style.border = "none";
                document.getElementById('amenazaCount'+i).innerHTML =  '';
                document.getElementById('amenazaCount').innerHTML =  '';


              }
            }
          }

          tablas.innerHTML = ""
          tablas2.innerHTML = ""
          tablas3.innerHTML = ""

          //tabulate(result,['Departamento'].concat(subgroups),[])
          tabulate(result,['Departamento'].concat('Amarilla'),[],['#Amarillaa'])
          tabulate(result,['Departamento'].concat('Naranja'),[],['#Naranjaa'])
          tabulate(result,['Departamento'].concat('Roja'),[],['#Rojaa'])






    }
}