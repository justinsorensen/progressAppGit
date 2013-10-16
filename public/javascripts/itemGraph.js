$(document).ready(function() {
			var json =!{JSON.stringify(graph)};
			console.log(json);
			var x = new Date(JSON.parse(JSON.stringify(new Date())));
			console.log(x.getTime());
			var d1 = [];
			console.log("Before function");
			for(var i =0; i < json.length; i++) {
				var y = Date.parse(json[i].date);
				d1.push([y, json[i].value]);			//pushing date and value onto array
				console.log("Result of y: " + y);
				console.log("value: " + json[i].value);
				console.log("date: " + json[i].date);
				console.log("during function pass: " + i);
				console.log(d1);
			}
			$.plot("#placeholder", [{data: d1, lines: { show: true }, points: { show: true }, grid: { hoverable: true }}], 
									{ xaxis:{ mode: "time", timezone: "browser", timeformat: "%m/%d %I:%M"}});
		

		});