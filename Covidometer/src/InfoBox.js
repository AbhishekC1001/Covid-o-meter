import React from "react";
import { Card, CardContent, Typography } from "@material-ui/core";
import "./InfoBox.css";

function InfoBox({ title, cases, total, active, isRed, ...props }) {
  console.log(title, active);
  console.log("Titjhdsfjjbjkb",title)
  if(title === "Vaccinated"){
    return (
      <Card
      onClick={props.onClick}
      className={`infoBox ${active && "infoBox--selected"} ${
        isRed && "infoBox--red"
      }`}
      style={{borderColor: "#0000ff"}}
    >
      <CardContent>
        <Typography  color="textSecondary" gutterBottom>
          {title}
        </Typography>
        <div style={{ display: "flex",flexDirection: "row"}}>
        <h2 style={{color: "blue",marginRight:'3px'}} className={`infoBox__cases`}>
          {cases}
        </h2>
        
        <Typography className="infoBox__total" color="textSecondary">
          Total
        </Typography>
        </div>
        

        
      </CardContent>
    </Card>
    );
  }
  if(title === "Deaths"){
    return (
      <Card
      onClick={props.onClick}
      className={`infoBox ${active && "infoBox--selected"} ${
        isRed && "infoBox--red"
      }`}
      style={{borderColor: "black"}}
    >
      <CardContent>
        <Typography  color="textSecondary" gutterBottom>
          {title}
        </Typography>
        <h2 style={{color: "black"}} className={`infoBox__cases`}>
          {cases}
        </h2>

        <Typography className="infoBox__total" color="textSecondary">
          {total} Total
        </Typography>
      </CardContent>
    </Card>
    );
  }
  return (
    <Card
      onClick={props.onClick}
      className={`infoBox ${active && "infoBox--selected"} ${
        isRed && "infoBox--red"
      }`}
    >
      <CardContent>
        <Typography color="textSecondary" gutterBottom>
          {title}
        </Typography>
        <h2 className={`infoBox__cases ${!isRed && "infoBox__cases--green"}`}>
          {cases}
        </h2>

        <Typography className="infoBox__total" color="textSecondary">
          {total} Total
        </Typography>
      </CardContent>
    </Card>
  );
}

export default InfoBox;
