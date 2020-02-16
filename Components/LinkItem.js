import React from "react";

const LinkItem = (props) => {
  const url = props.href;
  const fullUrl = props.fullHref;
  const deleteFunction = props.deleteFunction;
  // pass a delete function

  return (
    <li className="list-group-item">
      <div className="row align-items-center">
        <a className="col text-left" title={fullUrl} href={"//" + url} target="_blank">
          {url}
        </a>
        <div className="col text-right">
          <button className="btn btn-danger" onClick={() => deleteFunction(url)}>Delete</button>
        </div>
      </div>
    </li>
  );
}


export default LinkItem;