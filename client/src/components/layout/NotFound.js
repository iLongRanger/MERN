import React, { Fragment } from "react";

const NotFound = () => {
  return (
    <Fragment>
      <h1 className="x-large text-primary">
        <i className="fas fa-exclamation-triangle"></i> Page not Found
      </h1>
      <p className="text-large">Sorry Page Does Not Exist</p>
    </Fragment>
  );
};

export default NotFound;
