function init(){
// select dropdown menu and event handler
    let dropDown = d3.select("#selDataset");
    dropDown.on("change", onSelect);

// add data to the dropdown menu
d3.json("/samples.json").then((data) => {
    data.names.forEach(name => {
    option  = dropDown.append("option")
    option.text(name)
    option.attr("value", name)
    });

// get intial value of dropdown menu and make charts
    let val = parseInt(data.names[0]);
    makeCharts(val);
    });  
};

// event handler function for the drop down
function onSelect(){
    let val = parseInt(d3.select(this).property("value"));
    makeCharts(val);
}

// function to retreive samples and makeCharts
function makeCharts(val){
    d3.json("/samples.json").then((data) => {
// Get metaData
    let met = data.metadata.filter(d => d.id === val);
    metaDataBar = d3.select("#sample-metadata");

// Clear metadata from metaDataBar
    metaDataBar.html("")

    metaDataList = metaDataBar.append("ul")

Object.entries(met[0]).forEach(function ([key, value]){
    metaDataList.append("li").text(`${key}: ${value}`);
});

    let sampl = data.samples.filter(d => parseInt(d.id) === val); 
    let otuIds = sampl[0].otu_ids;
    let sampleVals = sampl[0].sample_values;
    let otuLabels = sampl[0].otu_labels;

    plotBar(otuIds.slice(0,10), otuLabels.slice(0,10), sampleVals.slice(0,10));
    plotBubble(otuIds, otuLabels, sampleVals);
 });
}
// create function for the Bar chart
function plotBar(otuIds, otuLabels, sampleVals){
    let trace1 = {
    y: otuIds.map(id => "OTU ID ".concat(id)).reverse(),
    x: sampleVals.reverse(),
    type: "bar",
    orientation: 'h',
    text: otuLabels,
    hovertemplate: '%{text}<extra></extra>'
    };
    
    let data = [trace1];

    let layout = {

};

    Plotly.newPlot("bar", data, layout);
}

// create function for the Bubble chart
function plotBubble(otuIds, otuLabels, sampleVals){
    let trace2 = {
    x: otuIds,
    y: sampleVals,
    mode: 'markers',
    marker: {
        color: otuIds,
        size: sampleVals
    },
        text: otuLabels
    };

    let data = [trace2];

    let layout = {
    
    };

    Plotly.newPlot('bubble', data, layout);     
}
init();