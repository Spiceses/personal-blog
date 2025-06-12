import { Button, styled } from "@mui/material";
import { CloudUpload } from "@mui/icons-material";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const BlogUploader = () => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log("选择的文件:", file.name);
    }
  };

  return (
    <Button component="label" startIcon={<CloudUpload />}>
      上传文件
      <VisuallyHiddenInput type="file" onChange={handleFileChange} />
    </Button>
  );
};

export default BlogUploader;
