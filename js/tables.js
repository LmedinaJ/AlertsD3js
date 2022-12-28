function tabulate(data,columns,selectedGroup,color) {
    var table = d3.selectAll(color[0]).append("table","table")
            .attr("style", "margin-left: 250px"),
        thead = table.append("thead"),
        tbody = table.append("tbody");

    var table_color = d3.scaleOrdinal()
        .domain(['Amarilla','Naranja','Roja','Departamento'])
        //.range(['#FFFF80','#FFD27F ','#FE8081','#C7CDCD'])
        .range(['#C7CDCD','#C7CDCD ','#C7CDCD','#C7CDCD'])

    thead.append("tr")
        .selectAll("th")
        .data(columns)
        .enter()
        .append("th")
            .text(function(column) {if(column=='Departamento'){return column}else{return 'N°'}; })
    	.style('background-color',function(d) { return table_color(d); })

    var selectizeControl = selections[0].selectize
    var listaindex=[]

    selectizeControl.on('change', function() {    

      listaindex=[]
      var test = selectizeControl;
      listaindex.push(test.items)
      
      updates(listaindex[0])

    });

    updates([])
    function updates(selectedGroup){

        if (selectedGroup.length>0){

          dataFilter = data.filter(function(d,i){if (selectedGroup.includes(d.Departamento? d.Departamento : 0)){return d};});

        }else {
          dataFilter=data

        }

        function totales_a(amount){
          this.Departamento = "Total";
          this.Amarilla = amount;
        }
        function totales_n(amount){
          this.Departamento = "Total";
          this.Naranja = amount;
        }     
        function totales_r(amount){
          this.Departamento = "Total";
          this.Roja = amount;
        }    

        if (color=='#Amarillaa'){
            var sum = 0;
            for (var i in dataFilter){
                sum += parseFloat(dataFilter[i].Amarilla?dataFilter[i].Amarilla:0);
            }     
            newtotal = new totales_a(sum);    
        }else if  (color=='#Naranjaa'){
            var sum = 0;
            for (var i in dataFilter){ 
                sum += parseFloat(dataFilter[i].Naranja?dataFilter[i].Naranja:0);
            } 
            newtotal = new totales_n(sum);  
        }else{
            var sum = 0;
            for (var i in dataFilter){
                sum += parseFloat(dataFilter[i].Roja?dataFilter[i].Roja:0);
            }  
            newtotal = new totales_r(sum); 
        } 

   

        dataFilter.push(newtotal)
  

        function meter_datos(color){
        	pink=[]
            for (i = 0; i < dataFilter.length; i++){  
		        if(Object.keys(dataFilter[i]).includes(color)){
		        	pink.push(dataFilter[i])
		        }
	    	}	

	    	return{pink};
        }
  

        yellow= meter_datos('Amarilla').pink        

        orange= meter_datos('Naranja').pink

        red= meter_datos('Roja').pink


    	if (color=='#Amarillaa'){
    		color_pass=yellow
    		if (color_pass.length==0){
    			tablas.innerHTML = ""
    		}    		
    	}else if (color=='#Naranjaa'){
    		color_pass=orange
    		if (color_pass.length==0){
    			tablas2.innerHTML = ""
    		}
    	}else{
    		color_pass=red
    		if (color_pass.length==0){
    			tablas3.innerHTML = ""
    		}
    	}


        var rows = tbody.selectAll("tr")
            .data(color_pass);

        rows.exit().remove();

        rows.selectAll("td")
         .data(function(row) {
                return columns.map(function(column) {
                    return {column: column, value: row[column]?row[column]:'0'};
                });
            })
                .html(function(d) {return d.value? d.value : 0; });
        var rowsEnter = rows.enter().append('tr')
         .selectAll("td")
         .data(function(row) {
                return columns.map(function(column) {
                    return {column: column, value: row[column]?row[column]:0};
                });
            })
            .enter()
            .append("td")
            .attr("style", "font-family: Arial") // sets the font style
                .html(function(d) {return d.value? d.value : '0'; });


    dataFilter.splice(dataFilter.findIndex(item => item.Departamento === "Total"), 1)
    console.log(dataFilter)


    }   

    


    }
