// @flow

import React from "react";

const Images = props => {
  if (!props.imgTrue || !props.imgFalse) {
    return <div>{"Images's URI not found"}</div>;
  } else {
    return (
      <div>
        <img src={props.imgTrue} alt={""} height={"100"} />
        <br />
        <img src={props.imgFalse} alt={""} height={"100"} />
      </div>
    );
  }
};

export default Images;
