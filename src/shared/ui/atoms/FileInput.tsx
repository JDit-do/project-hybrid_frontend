import { forwardRef } from "react";

export interface FileInputProps {
  onFiles: (files: FileList | null) => void;
  accept?: string;
}

const FileInput = forwardRef<HTMLInputElement, FileInputProps>(function FileInput(
  { onFiles, accept = "image/*" },
  ref
) {
  return (
    <input
      ref={ref}
      type="file"
      accept={accept}
      multiple
      onChange={(e) => onFiles(e.target.files)}
      style={{ display: "none" }}
    />
  );
});

export default FileInput;


