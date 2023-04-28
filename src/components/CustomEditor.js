import React, { useState, useRef } from "react";
import {
  Editor,
  EditorState,
  Modifier,
  RichUtils,
  convertToRaw,
} from "draft-js";
import "draft-js/dist/Draft.css";

const CustomEditor = ({ editorState, handleOnChange }) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          width: "100%",
          height: "30rem",
          margin: "auto",
          border: "1px solid black",
        }}
      >
        <Editor editorState={editorState} onChange={handleOnChange} />
      </div>
    </div>
  );
};

export default CustomEditor;
