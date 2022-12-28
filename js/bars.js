function load_bar(){
var margin = {top: 20, right: 120, bottom: 170, left: 50},
    width = 850 - margin.left - margin.right,
    height = 550 - margin.top - margin.bottom;
// append the pp object to the body of the page

//console.log(d)
var pp = d3.select("#bars")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");


var tooltip = d3.select("#bars")    
    .append('div')
    .attr('class', 'tooltip');
tooltip.append('div')
    .attr('class', 'label');

tooltip.append('div')
    .attr('class', 'percent');

  // Y Label
pp.append("text")
    .attr("y", -35)
    .attr("x", -200)
    .attr("font-size", "15px")
    .attr("text-anchor", "middle")
    .attr("transform", "rotate(-90)")
    .text("Cantidad de municipios");

  // X Label
  pp.append("text")
      .attr("y", height + 130)
      .attr("x", width / 2)
      .attr("font-size", "15px")
      .attr("text-anchor", "middle")
      .text("Departamentos");
 // Add X axis
  x = d3.scaleBand()
    .domain(groups)
    .range([0, width])
    .padding([0]);

  var xAxis = pp.append("g")    
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

    xAxis.selectAll("text")
      .style("text-anchor", "end")
      .attr("font-size", "55px")
      .attr("y", "-7")
      .attr("x", "-7")
      .attr("transform", "rotate(-90)");

  var y = d3.scaleLinear()
    .domain([0, Math.ceil(max(result) / 10) * 10])
    .range([ height, 0 ]);

  var yAxis = pp.append("g")
    .call(d3.axisLeft(y));

  var xSubgroup = d3.scaleBand()
    .domain(subgroups)
    .range([0, x.bandwidth()])//aca para el ancho
    .padding([0.1]);

    var selectizeControl = selections[0].selectize
    selectizeControl.on('change', function() {    

      var listaindex=[]
      var test = selectizeControl;
      listaindex.push(test.items)
      
      updates(listaindex[0])

    });

  updates([])
  function updates(selectedGroup) {
    pp.selectAll("rect").remove()

    if (selectedGroup.length>0){
      dataFilter = result.filter(function(d,i){if (selectedGroup.includes(d.Departamento)){return d};});


      ff= dataFilter.sort((x, y) => {
        return Object.keys(y).length - Object.keys(x).length
      });
      subgroups = Object.keys(ff[0]).slice(1).sort();
      dataFilter = result.filter(function(d,i){if (selectedGroup.includes(d.Departamento)){return d};});


    }else {
      dataFilter=result

      subgroups=Object.keys(cat).sort();
    }

    var groups = d3.map(dataFilter, function(d){return(d.Departamento)}).keys();
    y.domain([0, Math.ceil(max(dataFilter) / 10) * 10])

    yAxis.call(d3.axisLeft(y));

  x.domain(groups)
   xAxis.call(d3.axisBottom(x))
     xAxis.selectAll("text")
      .style("text-anchor", "end")
      .attr("font-size", "55px")
      .attr("y", "-7")
      .attr("x", "-7")
      .attr("transform", "rotate(-90)");

    xSubgroup.domain(subgroups)
    xSubgroup.range([0, x.bandwidth()])//

  var rectG = pp.selectAll('rect')
    .data(dataFilter);

  rectG.exit().remove();

  var  rectGEnter= rectG.enter().append("g")
      .append("g")
        .attr("transform", function(d) {return "translate(" + x(d.Departamento) + ",0)"; })
      .selectAll("rect")
      .data(function(d) { return subgroups.map(function(key) {return {key: key, value: d[key]?d[key]:0}; }); })
      .enter().append("rect")
         .attr("x", function(d) { if(d.value>0){return xSubgroup(d.key)}; })
         .attr("y", function(d) { return y(d.value? d.value : 0); })
         .attr("width", xSubgroup.bandwidth())
         .attr("height", function(d) { return height - y(d.value? d.value : 0); })
         .attr("fill", function(d) { return getColor(d.key); });


      pp.selectAll("text")
      .data(dataFilter)
      .enter().append("text")
         //.attr("x", function(d) { return xSubgroup(d.key); })
         .attr("x", function(d) { if (d.value>0){return xSubgroup(d.key)}else{console.log('nohay')}; })
         .attr("y", function(d) { return y(d.value? d.value : 0); })
         .attr("width", xSubgroup.bandwidth())
         .attr("height", function(d) { return height - y(d.value? d.value : 0); })
         .attr("fill", function(d) { return getColor(d.key); })
         .text('e')


    var legendG = pp.selectAll(".legend")
           .data(subgroups.slice())

           
    var  legendEnter= legendG.enter().append("g")
           .attr("transform", function (d, i) { return "translate(" + (width - 500) + "," + (i * 15 + 20) + ")"; })
           .attr("text-anchor", "end")
           .attr("class", "legend");    

    legendG.exit().remove();

    //para leyenda

      pp.selectAll("mydots")
        .data(subgroups)
        .enter()
        .append("circle")
          .attr("cx", width/2 + 370)
          .attr("cy", function(d,i){ return  i*23}) // 100 is where the first dot appears. 25 is the distance between dots
          .attr("r", 7)
          .attr("class", "legend")
          .style("fill", function(d) { return getColor(d); })

      pp.selectAll("mylabels")
        .data(subgroups)
        .enter()
        .append("text")
          .attr("x", width/2 + 300)
          .attr("y", function(d,i){ return  i*23}) // 100 is where the first dot appears. 25 is the distance between dots
          .style("fill", 'grey')
          .text(function(d){return d})
          .attr("text-anchor", "left")
          .attr("class", "legend")
          .style("alignment-baseline", "middle")
      //fin



    rectGEnter.on('mouseover', function(d) {
      tooltip.select('.label').html(d.key);
      tooltip.select('.percent').html("Municipios:"+d.value);
      tooltip.style('display', 'block');
      });

    rectGEnter.on('mousemove', function(d) {
      tooltip.style('top', (d3.event.layerY - 50) + 'px')
      .style('left', (d3.event.layerX - 25) + 'px');
    });

    rectGEnter.on('mouseout', function() {                              // NEW
          tooltip.style('display', 'none');                           // NEW
          });  
      }
}

