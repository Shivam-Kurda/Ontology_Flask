fetch('/static/d3_modified.json')
.then(function(resp){
    return resp.json();
})
.then(function(data){
    console.log("Test")
   parentFunction(data);
}).catch(function(error) {
    console.error("Error loading data:", error);
});


var node_inf;
fetch('/static/node_info.json')
  .then(response => response.json())
  .then(data => {
    
    console.log("Success");

    node_inf=data
    
    
  })
  .catch(error => {
    console.error('Error loading data:', error);
  });


  console.log(Object.keys(node_inf))

function parentFunction(jsondata){


console.log("the data is")
console.log(jsondata)


let mouseX = 0;

let buttonTracker = [];
let rootNode = d3.hierarchy(jsondata, d=>d.children);
var pathLinks = rootNode.links(); 
var updatePathLinks;

var circleLinks = rootNode.descendants();
var updateCircleLinks;

var textLinks = rootNode.descendants();
var updateTextLinks;


let dim = {
    'width': window.screen.width, 
    'height':window.screen.height * 3   , 
    'margin':50    
};

let svg = d3.select('#chart').append('svg')
     .style('background', 'black')   
     .attrs(dim).call(d3.zoom().on("zoom", function () {
        svg.attr("transform", d3.event.transform)
     })).append("g");

// let svg = d3.select('#chart').append('svg')
//      .style('background', 'black')   
//      .attrs(dim)
//      .append("g");
document.querySelector("#chart").classList.add("center");

//let rootNode = d3.hierarchy(data);




let g = svg.append('g')
            .attr('transform', 'translate(140,50)');

// 50,320
let layout = d3.tree().size([dim.height-100, dim.width-350]);

    layout(rootNode);
    console.log(rootNode.links());
    console.log("----------------------");
    console.log(rootNode.descendants());
    //console.log(rootNode.descendants());
   //first lets create a path 
   let lines = g.selectAll('path');  


   function wrapText(textSelection, maxWidth) {
    var lincnt=1
    textSelection.each(function() {
        
        var text = d3.select(this);
        var words = text.text().split(/\s+/).reverse(); // Split text into words
        var line = [];
        var lineNumber = 0;
        var lineHeight = 20; // Define the space between lines
        var y = text.attr('y');
        var dy = parseFloat(text.attr('dy'));

        var tspan = text.text(null).append('tspan').attr('x', text.attr('x')).attr('y', y).attr('dy', dy);

        // Go through each word and build lines
        while (words.length > 0) {
            line.push(words.pop());
            tspan.text(line.join(' '));
            if (tspan.node().getComputedTextLength() > maxWidth) {
                lincnt=lincnt+1
                var rem=line.pop(); // Remove last word from the current line
                tspan.text(line.join(' '));
                

                // Start a new tspan with the removed word
                line = [rem];
                tspan = text.append('tspan')
                            .attr('x', text.attr('x'))
                            .attr('dy', lineHeight)
                            .text(line.join(' '));
            }
        }
        
    });
    return lincnt

    
    
}

function update(data){

let group =  g.selectAll('path')
    .data(data, (d,i) => d.target.data.name)
    .join(
    function(enter){
        return enter.append('path')
                    .attrs({
                        'd': d3.linkHorizontal()
                        .x(d => mouseX)
                         .y(d => d.x),
                     'fill':'none',
                     'stroke':'white'
                    })
    },
    function(update){
        return update;
    },
    function(exit){
 


        return exit.call(path => path.transition().duration(300).remove()
                                                .attr('d', d3.linkHorizontal()
                                                              .x(d => mouseX)
                                                              .y(d =>d.x)));
    }


)
.call(path => path.transition().duration(1000).attr('d', d3.linkHorizontal()
        .x(d => d.y)
         .y(d => d.x))
         .attr("id", function(d,i){return "path"+i}));


}



update(pathLinks); //rootNode.links()



function updateCircles(data){
    g.selectAll('circle')
    .data(data, (d) => d.data.name)
    .join(
        function(enter){
            return enter.append('circle')
                        .attrs({
                            'cx':(d)=> mouseX,
                            'cy':(d) => d.x,
                            'r':12,
                            'fill':(d) => {
                                if(d.children == undefined){
                                    return 'red'
                                }
                                return 'green'
                            },
                            'id': (d,i) =>d.data.name,
                            'class':'sel'                           
                        })
        },
        function(update){
            return update;
        },
        function(exit){

            return exit.call(path => path.transition().duration(300).remove()
            .attrs({
                'cx':(d) =>mouseX,
                'r':(d) => 0
            }));

        }


    )
    .call(circle => circle.transition().duration(1000).attr('cx', (d)=>d.y))

    .on('mouseover', function(d){

       d3.select(this)
           .attrs({                
               'fill':'orange',

           })
           .transition().duration(100).attr('r', 16);
        var g=svg.append('g').attr('class','info')

        // var rect=g.append('rect')
        //    .attr('x', d.y+100) 
        //    .attr('y', d.x-20)
        //    .attr('width', 500)
        //    .attr('height', 80)
        //    .attr('fill', 'red');

        const maxWidth = 480; // Maximum width for text wrapping
        const lineHeight = 20;

        var rect=g.append('rect')
           .attr('x', d.y+100) 
           .attr('y', d.x-60)
           .attr('width', maxWidth)
           .attr('height', 150)
           .attr('fill', 'red');
        
        

        var lbl=d.data.name
        var sup_cls=node_inf[d.data.name].super
        var defintion=node_inf[d.data.name].def
        var info=`
        Label : ${lbl}
        Super : ${sup_cls}
        Definition : ${defintion}`
        ;
        console.log(info)
        

        const lines = info.trim().split('\n');


        const text = g.append('text')
                    .attr('x', d.y + 100)
                    .attr('y', d.x-40)
                    .attr('fill', 'white');

       
        // lines.forEach((line, index) => {
        // text.append('tspan')
        //     .text(line)
        //     .attr('x', d.y + 100) 
        //     .attr('dy', index === 0 ? 0 : 20); 
        // });

        // let totalLines = 0;

        // lines.forEach((line, index) => {
        //     const tspan = text.append('tspan')
        //                     .text(line)
        //                     .attr('x', d.y + 100)
        //                     .attr('dy', index === 0 ? 0 : lineHeight);

        //     totalLines += wrapText(tspan, maxWidth, lineHeight); // Get total lines required
        // });

        // const totalHeight = totalLines * lineHeight; // Calculate required height

        // rect.attr('height', totalHeight); 

        var lincnt=0
        lines.forEach((line, index) => {
            
            const tspan = text.append('tspan')
                              .text(line)
                              .attr('x', d.y + 100)
                              .attr('dy', index === 0 ? 0 : 20);
        
            // Apply text wrapping to each tspan
            lincnt+=wrapText(tspan, 480);
        });

        console.log("The line count is ",lincnt)

        rect.attr('height',lincnt*25)
        var h1=lincnt*25
        rect.attr('y',d.x-(h1))
        text.attr('y',d.x-(h1)+20)

        // g.on('mouseleave', function() {
        //     d3.select(this).remove(); // Remove the group, which removes the rectangle and text
        // });
        // g.append('text')
        // .text(info)
        // .attr('x',d.y+100)
        // .attr('y',d.x)
        // .attr('fill','white')
        
        
    })
    .on('mouseout', function(d){
       d3.select(this)
           .attr('fill', (d)=>{
                if(d.children ==undefined){
                    return 'red'
                }
                return 'green'
           })
           .transition().duration(100).attr('r', 12)
        // g.select('.circle-label').remove();
        svg.select('.info').remove();

    })
    .on('click', async function(d){

           let buttonId = d3.select(this)["_groups"][0][0]["attributes"].id.value;
           mouseX = d3.select(this)["_groups"][0][0]["attributes"].cx.value;
           //check to see if button already exists aka has been clicked
           //if it does, we need to send that data to update function
           //and remove that object

           let checkButtonExists = buttonTracker.filter(button => button.buttonId == buttonId);
 
           if(checkButtonExists[0]!=undefined){
                //also remove this item from button tracker
               buttonTracker = buttonTracker.filter(button => button.buttonId != buttonId);
               
               //handle path update
               pathLinks = checkButtonExists[0].buttonPathData.concat(pathLinks);
                              
               update(pathLinks);


                //handle  circle update
               circleLinks = checkButtonExists[0].buttonCircleData.concat(circleLinks);
                 updateCircles(circleLinks);

                 //handle text update

                textLinks =checkButtonExists[0].buttonTextData.concat(textLinks);
                updateText(textLinks);

                return;

           }

           var valueArray = await processedlinks(d.links());   

           updatePathLinks = pathLinks.filter(function(item){        
                   return !valueArray.includes(item.target.data.name);                                       
           });

           //now run the filter to get unfiltered items
           var clickedPathData = pathLinks.filter(function(item){
            return valueArray.includes(item.target.data.name);
            });


           updateCircleLinks = circleLinks.filter(function(item){
                    return !valueArray.includes(item.data.name);
           });

           var clickedCircleData = circleLinks.filter(function(item){
                    return valueArray.includes(item.data.name);
           });
        
        
           updateTextLinks = textLinks.filter(function(item){
                    return !valueArray.includes(item.data.name);
           });

           var clickedTextData = textLinks.filter(function(item){
                    return valueArray.includes(item.data.name);
           });

           //now we push the circleData to an array
           buttonTracker.push({
               buttonId:buttonId,
               buttonPathData: clickedPathData,
               buttonCircleData:clickedCircleData,
               buttonTextData:clickedTextData
           })

           
           update(updatePathLinks);
           updateCircles(updateCircleLinks);
           updateText(updateTextLinks);
          async function processedlinks(dlinks) {
           var valueArray = [];
    
               return new Promise((resolve, reject)=>{
                     dlinks.forEach(async(element) =>{
                          valueArray.push(element.target.data.name); 
                     });
                     resolve(valueArray);      
               });
           }

           pathLinks = updatePathLinks;
           circleLinks = updateCircleLinks;
           textLinks = updateTextLinks;

    });


}

updateCircles(rootNode.descendants());
 

function updateText(data){

    g.selectAll('text')
      .data(data, (d) =>d.data.name)
      .join(
        function(enter){
            return enter.append('text')
                        .attrs({
                            'x': (d) =>mouseX,
                            'y':(d) => d.x,
                            'font-size':0
                        })
                        .text((d) => d.data.name);
        },
        function(update){
            return update;
        },
        function(exit){
                return exit.call(text => text.transition().duration(300).remove().attrs({
                       'x':(d) => mouseX,
                       'font-size':0 
                }));   
        }

      )
      .call(text => text.transition().duration(1000).attrs({
          'x':(d) =>d.y+20,
          'font-size':15,
          'fill':'yellow',
        }));
}

updateText(textLinks);

}





