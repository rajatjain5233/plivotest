// import logo from './logo.svg';
import './App.css';
import React from 'react';
import ReactDOM from 'react-dom';
import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import { CountdownCircleTimer } from 'react-countdown-circle-timer'
import Button from '@material-ui/core/Button';
// import { CountdownCircleTimer } from 'react-countdown-circle-timer'



const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: 1,
    marginRight: 1,
    width: 200,
  },
  dense: {
    marginTop: 19,
  },
  menu: {
    width: 200,
  },
});
const minuteSeconds = 60;
const hourSeconds = 3600;
const daySeconds = 86400;
const renderTime = (dimension, time) => {
  return (
    <div className="time-wrapper">
      <div className="time">{time}</div>
      <div>{dimension}</div>
    </div>
  );
};
const getTimeSeconds = (time) => (time) | 0;
const getTimeMinutes = (time) => ((time % hourSeconds) / minuteSeconds) | 0;
const getTimeHours = (time) => ((time % daySeconds) / hourSeconds) | 0;
const getTimeDays = (time) => (time / daySeconds) | 0;

class NumberForm extends React.Component {
  state={
    name1:"",
    number1:"",
    name2:"",
    number2:"",
    call_status:true,
    desired_time:1,
    call_uuid:""


  }
  handleChange = name => event => {
    var change={};
    console.log(name);
    this.setState({
            [name]: event.target.value,
    });        
    // change[name] = e.target.value;
    // this.setState(change);

  }
  onhandleCall=()=>{
    let from_number=this.state.number1;
    let to=this.state.number2;

    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ from: from_number,to:to })
    };
    fetch('/api/calls/createCall', requestOptions)
        .then(response => response.json())
        .then((response)=>{
             var s=response.result.message;
             var count=0;
             var res = s.split(" ");

             var call_uuid=res[res.length-1];
            call_uuid=call_uuid.match(/'([^']+)'/)[1];

            this.setState({
              call_status:false,
              call_uuid:call_uuid
            });


        });


  }
  onCompletetime=()=>{
      let url="https://api.plivo.com/v1/Account/";
      url=url+"MAMJFHYWRINZRMZTE5NZ";
      url=url+"/Call/";
      url=url+this.state.call_uuid;
      const requestOptions = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ call_uuid: this.state.call_uuid})
      };
      fetch('/api/calls/dropCall', requestOptions)
          .then(response => response.json())
          .then((response)=>{
              console.log("Disconnected");
          });

  }


  render(){
      const { classes } = this.props;

    return (
        <div className="App">
          <div className="App-header">
            Free phone Calling between two numbers
          </div>
        {this.state.call_status?(<div>
              <div style={{marginTop: "15px"}}>
                  Enter the Name from which you want to call 
              </div>
              
              <TextField
                    id="name1"
                    label="Name1"
                    value={this.state.name1}
                    onChange={this.handleChange('name1')}
                    className={classes.textField}
                    margin="normal"
                    variant="outlined"
                  />
              <br/>    
              <TextField
                    id="standard-name"
                    label="Number1"
                    value={this.state.number1}
                    onChange={this.handleChange('number1')}
                    className={classes.textField}
                    margin="normal"
                    variant="outlined"
                  /> 
              <br/>        
              <TextField
                    id="standard-name"
                    label="Name2"
                    value={this.state.name2}
                    onChange={this.handleChange('name2')}
                    className={classes.textField}
                    margin="normal"
                    variant="outlined"
                  />
              <br/>    
              <TextField
                    id="standard-name"
                    label="Number2"
                    value={this.state.number2}
                    onChange={this.handleChange('number2')}
                    className={classes.textField}
                    margin="normal"
                    variant="outlined"
                  />
              <br/> 
              <TextField
                    id="standard-name"
                    label="Desired time(minutes)"
                    value={this.state.desired_time}
                    onChange={this.handleChange('desired_time')}
                    className={classes.textField}
                    margin="normal"
                    variant="outlined"
                  />
              <br/>    
              <Button variant="contained"           
                      color="primary"
                      size="large"
                      style={{marginTop:"25px"}}
                      onClick={this.onhandleCall}
              > 
                Call 
              </Button>
          </div>):(
          <div>
              <div style={{marginTop: "15px"}}>
                  Call in progress 
              </div>
              <div style={{marginLeft: "640px",marginTop: "15px"}}> 
              <CountdownCircleTimer
                isPlaying
                duration={20}
                colors={[
                  ['#004777', 0.33],
                  ['#F7B801', 0.33],
                  ['#A30000', 0.33],
                ]}
                onComplete={this.onCompletetime}
              >
                 {({ elapsedTime }) =>
                    renderTime("seconds", getTimeSeconds(elapsedTime))
                  }
    
              </CountdownCircleTimer>
              </div> 
              <Button variant="contained"           
                      color="primary"
                      size="large"
                      style={{marginTop:"25px"}}
                      onClick={this.onCompletetime}
              > 
                Disconnect 
              </Button>
          </div>
          )
        }
          



        </div>
    );
  }
}

export default withStyles(styles)(NumberForm);
