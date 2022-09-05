import React, {useState, useEffect,useRef} from 'react';
import './App.css';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import {Container, Row, Col, Button, Modal} from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Rings  } from  'react-loader-spinner'

function App() {
  const [source, setSource] = React.useState([])
  const [emptyresult, setEmptyresult] = React.useState(true)
  const [loader, setLoader] = useState(false);
  
  var today = new Date();
  var year = today.getFullYear();
  var month = (today.getMonth()+1) < 10 ? '0' + (today.getMonth()+1) : (today.getMonth()+1);
  var date = today.getDate() < 10 ? '0' + today.getDate() : today.getDate();
  const [date1, setDate1] = React.useState(year + '-' + month + '-' + date);
  const [date2, setDate2] = React.useState(year + '-' + month + '-' + date);
  
  useEffect(() => {
    getData()
}, []);

  const getData = () => {
    setLoader(true)
    fetch("https://api.openaq.org/v2/measurements?date_from=" + date1 + "&date_to=" + date2 + "&limit=10&page=2&offset=0&sort=desc&radius=1000&order_by=datetime&isMobile=false", {
      method: "GET",
      headers: {
          'Accept': 'application/json',
      },
    })
    .then((response)=> response.json())
    .then((responseJson)=>{
        console.log("responsejson", responseJson)
        setLoader(false)
        if(responseJson.results.length == 0){
          setSource(responseJson.results)
          setEmptyresult(true)
        }
        else{
          setSource(responseJson.results)
          setEmptyresult(false)
        }
        
    })
    .catch((error)=>{
        console.log(error)
    })
  }
  return (
    <div className="App">
      <Container>
        <div >
         
            <div className="headerdiv">
                   <Row>
                      <Col sm={12}>
                            <h2>Pollution data</h2>
                      </Col>
                  </Row>
          </div>
            <Row >
                  <Col sm={6} lg={2}>
                    <FormControl sx={{ mt: 3, }}>
                            <TextField
                                id="datetime-local"
                                label="From Date"
                                type="date"
                                defaultValue={year + '-' + month + '-' + date}
                                sx={{ width: '100%' }}
                                InputLabelProps={{
                                shrink: true,
                                }}
                                onChange={(newValue) => {
                                    setDate1(newValue.target.value);
                                }}
                            />
                        </FormControl>
                    </Col>
                    <Col sm={6} lg={2}>
                      <FormControl sx={{ mt: 3, }}>
                              <TextField
                                  id="datetime-local"
                                  label="To Date"
                                  type="date"
                                  defaultValue={year + '-' + month + '-' + date}
                                  sx={{ width: '100%' }}
                                  InputLabelProps={{
                                  shrink: true,
                                  }}
                                  onChange={(newValue) => {
                                      setDate2(newValue.target.value);
                                  }}
                              /> 
                        </FormControl>
                    </Col>
                    <Col xs={12} md={2}>    
                    <div style={{display: 'flex', justifyContent: 'center'}}>
                    {
                            loader ?
                            <div style={{marginTop: 17}}>
                              <Rings
                                  height="50"
                                  width="50"
                                  color='#0d6efd'
                                  ariaLabel='loading'
                                
                              />
                              </div>
                            :                 
                          <Button onClick={getData} style={{backgroundColor: '#03a5fc', color: '#fff', marginTop: 25, width: '50%'}} variant="contained">Search</Button>
                    }
                    </div>
                    </Col>
              </Row>
              <Row>
                <Col md={6}>
                  {
                    emptyresult ? 
                  <p style={{marginTop: 20, fontWeight: 'bold', color: 'gray'}}>No Data To Show(eg date : 22-8-2024 to 24-8-2024)</p>: null
                  }
                  <div className="chartdiv" style={{background: '#16113a',padding: 10, marginTop: 20}}>
                  <LineChart width={400} height={200} data={source} style={{background:'#272953'}}>
                      <XAxis dataKey="parameter" />
                      <YAxis domain={[0, 'auto']}/>
                      <Tooltip />
                      <Line type="monotone" isAnimationActive={false} dataKey="value" stroke="#8884d8" strokeWidth={2} />
                  </LineChart>
                  </div>
                </Col>
              </Row>
        </div>
        </Container>
    </div>
  );
}

export default App;
