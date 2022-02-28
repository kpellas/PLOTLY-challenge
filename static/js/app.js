// Initialise the page
function init(){
  buildPlot()
}

// Build plot when option is changed in drop down men
function optionChanged() {
   buildPlot();
}

// Build plot fuction
function buildPlot(){

  // Read in data using D3
  d3.json("samples.json").then(function(data) {

      // Create variables for names and data objects
      const samples = data.samples;
      const idOTU = data.names;

      // Add all of the values to the drop down menu
      idOTU.forEach(id => d3.select('#selDataset').append('option').text(id).property("value", id));
      
      // Set variable for values
      const selection = d3.selectAll("#selDataset").node().value;
      
      // Filter based on selected value
      const selected = data.samples.filter(entry => entry.id == selection);

      // Filter metadata based on selected value
      const selectedMeta = data.metadata.filter(entry => entry.id == selection);

      // Capture 10 most frequent OTUs IDs, values fpr bar chart
      const topTen = selected[0].sample_values.slice(0,10).reverse();
      const topTenLabel = selected[0].otu_ids.slice(0,10).reverse();

      // Capture IDs and sample values for traces for demographic table
      const otuIDs = selected[0].otu_ids; 
      const sampleValues = selected[0].sample_values;

      // Set trace for bar graph
      const trace1 = {
        type: 'bar',
        x: topTen,
        y: topTenLabel.map(num => "OTU" + num.toString() + " "),
        text: data.samples[0].otu_labels,
        orientation: 'h'
      };

      const plotData = [trace1];

      const layout = {
        title: 'Top 10 OTU Samples',
        width: 1000

      };
      Plotly.newPlot('bar', plotData, layout);

      // Capture democraphic values
      const demographics = {
        'id: ': selectedMeta[0].id,
        'ethnicity: ': selectedMeta[0].ethnicity,
        'gender: ': selectedMeta[0].gender,
        'age: ': selectedMeta[0].age,
        'location: ': selectedMeta[0].location,
        'bbtype: ': selectedMeta[0].bbtype,
        'wfreq: ': selectedMeta[0].wfreq
        };
        console.log("Demographics", demographics);

  // Select HTML DIv
    panelBody = d3.select("#sample-metadata")
    panelBody.html("")

    // append demographics data to html <p>
    for(const sample in demographics) {
      const demo = (`${sample} ${demographics[sample]}`);
      panelBody.append('p').text(demo).attr('style', 'font-weight: bold');

    }
      // Create trace for bubble chart
      var trace2 = {
        x: otuIDs,
        y: sampleValues,
        text: data.samples[0].otu_labels,
        mode: 'markers',
        marker: {
          color: data.samples[0].otu_ids,
          size: data.samples[0].sample_values
        }
      };
      
      var dataBubble = [trace2];
      
      var layoutBubble = {
        title: 'Bubble Chart for OTUs',
        showlegend: false,
        xaxis: {
          title: {
            text: "OTU ID",
        }},
        height: 600,
        width: 1000
      };
      
      Plotly.newPlot('bubble', dataBubble, layoutBubble);

      // Gauge Chart

      var dataGauge = [
        {
          domain: { x: [0, 9], y: [0, 9] },
          // value:  selectedMeta[0].wfreq,

          value:  selectedMeta[0].wfreq,
          title: { text: "Belly Button Washing Frequency" },
          gauge: {
            axis: { range: [null, 9] },
            bar: {color: "white"}, 
            steps: [
              { range: [0, 1], color: "#cFEAE2" },
              { range: [1, 2], color: "#B4D6C1" },
              { range: [2, 3], color: "#8DC3A7" },
              { range: [3, 4], color: "#6BAF92" },
              { range: [4, 5], color: "#4E9C81" },
              { range: [5, 6], color: "#358873" },
              { range: [6, 7], color: "#207567" },
              { range: [7, 8], color: "365544" },
              { range: [8, 9], color: "1b332d" },
            ],
          },
          type: "indicator",
          mode: "gauge"
        }
      ];
      var layoutGauge = { width: 500, height: 500, margin: { t: 0, b: 0 } };
      Plotly.newPlot('gauge', dataGauge, layoutGauge);
    })   
}

init()