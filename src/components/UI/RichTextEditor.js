import React from "react";

const RichTextEditor = ({ value, onChange, placeholder }) => {
  return (
    <div className="rich-text-editor">
      <div
        className="w-full p-2 border rounded min-h-[200px]"
        contentEditable
        dangerouslySetInnerHTML={{ __html: value }}
        onBlur={(e) => onChange(e.target.innerHTML)}
        placeholder={placeholder}
      />
    </div>
  );
};

export default RichTextEditor;
