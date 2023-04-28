import CustomEditor from "./components/CustomEditor";
import React, { useEffect, useState } from "react";
import {
  ContentState,
  EditorState,
  Modifier,
  RichUtils,
  convertFromHTML,
  convertFromRaw,
  convertToRaw,
} from "draft-js";
import "draft-js/dist/Draft.css";

function App() {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  const handleOnChange = (newState) => {
    const contentState = newState.getCurrentContent();
    const selectionState = newState.getSelection();

    // Get the current block and its text
    const currentBlock = contentState.getBlockForKey(
      selectionState.getStartKey()
    );
    const currentText = currentBlock.getText();

    // Check if the current block is a new block and starts with #
    if (currentText.startsWith("# ") && currentBlock.getType() === "unstyled") {
      // Remove the # from the text and set the new block type to heading
      const newText = currentText.substring(2);
      const newContentState = contentState.merge({
        blockMap: contentState.getBlockMap().set(
          currentBlock.getKey(),
          currentBlock.merge({
            text: newText,
            type: "header-one",
          })
        ),
      });
      const newEditorState = EditorState.push(
        newState,
        newContentState,
        "change-block-type"
      );
      setEditorState(newEditorState);
      return;
    }

    // Handle "*" for bold
    if (currentText.startsWith("* ") && currentBlock.getType() === "unstyled") {
      // Apply bold styling to the current selection using RichUtils.toggleInlineStyle
      const newEditorState = RichUtils.toggleInlineStyle(newState, "BOLD");
      setEditorState(newEditorState);
      return;
    }

    // Handle "**" for red color
    if (currentText.endsWith(" **") && currentBlock.getType() === "unstyled") {
      const start = currentText.lastIndexOf("** ");
      const end = currentText.length - 2;
      const selection = selectionState.merge({
        anchorOffset: start,
        focusOffset: end,
      });
      const contentWithRedText = Modifier.applyInlineStyle(
        contentState,
        selection,
        "RED"
      );
      const newEditorState = EditorState.push(
        newState,
        contentWithRedText,
        "change-inline-style"
      );
      setEditorState(newEditorState);
      return;
    }

    // Handle "***" for underline
    if (currentText.endsWith("*** ") && currentBlock.getType() === "unstyled") {
      const start = currentText.lastIndexOf("*** ");
      const end = currentText.length - 2;
      const selection = selectionState.merge({
        anchorOffset: start,
        focusOffset: end,
      });
      const contentWithUnderline = Modifier.applyInlineStyle(
        contentState,
        selection,
        "UNDERLINE"
      );
      const newEditorState = EditorState.push(
        newState,
        contentWithUnderline,
        "change-inline-style"
      );
      setEditorState(newEditorState);
      return;
    }

    // If no special handling is required, just update the editor state
    setEditorState(newState);
  };

  const handleSave = () => {
    const contentState = editorState.getCurrentContent();
    const rawContent = convertToRaw(contentState);
    localStorage.setItem("data", JSON.stringify(rawContent));
  };

  useEffect(() => {
    const data = localStorage.getItem("data");
    if (data) {
      const rawContent = convertFromRaw(JSON.parse(data));
      setEditorState(EditorState.createWithContent(rawContent));
    }
  }, []);

  return (
    <div
      className="App"
      style={{
        width: "60rem",
        margin: "auto",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          marginBottom: "12px",
        }}
      >
        <h6 style={{ margin: 0 }}> </h6>
        <h6 style={{ margin: 0 }}>React Sorcerer</h6>
        <button onClick={handleSave}>save</button>
      </div>
      <CustomEditor editorState={editorState} handleOnChange={handleOnChange} />
    </div>
  );
}

export default App;
