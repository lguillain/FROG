// @flow

import React from "react";

import { type ActivityRunnerT } from "frog-utils";

import Images from "./Images";
import Rules from "./Rules";

export default ({
  // logger,
  activityData
}: // data,
// dataFn,
// userInfo
ActivityRunnerT) =>
  <div>
    <h4>{activityData.config.title}</h4>
    <div style={{ display: "flex", flexDirection: "row" }}>
      <div>
        <Images
          srcURITrue="{activityData.config.imgTrue}"
          srcURIFalse="{activityData.config.imgFalse}"
          {...activityData.config}
        />
      </div>
      <div>
        <Rules
          generateNewPics={e => {
            formSubmitEvent.preventDefault();

            console.log("You have selected:", this.state.value);
          }}
          {...activityData.config}
        />
      </div>
    </div>
  </div>;
//      style={{ width: 150, height: 200 }}
