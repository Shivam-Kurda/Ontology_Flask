fetch('/static/d3_modified.json')
  .then(response => response.json())
  .then(data => {
    
    console.log("Success");

    
    // key1="Textile Mills"
    // console.log(data.key1.def); // Output: value1
    // console.log(data.key2); // Output: value2
    // console.log(data.key3); // Output: value3

    // // You can also iterate over the object's keys and values
    // for (let key in data) {
    //   console.log(key + ": " + data[key]);
    // }
  })
  .catch(error => {
    console.error('Error loading data:', error);
  });