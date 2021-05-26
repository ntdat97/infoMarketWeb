import { Dashboard, DashboardModal } from "@uppy/react";
import Uppy from "@uppy/core";
import XHRUpload from "@uppy/xhr-upload";
import React, { useState } from "react";
import Vietnam from "@uppy/locales/lib/vi_VN";
import "@uppy/core/dist/style.css";
import "@uppy/dashboard/dist/style.css";
export const Uploader = ({
  isOpen,
  setIsOpen,
  outFiles,
  setOutFile,
  /* setCountTempFiles, */
  isUploadButtonDisable = false,
  isAllowMultipleUploads = true,
}) => {
  const [uppy, setUppy] = useState(null);

  React.useEffect(() => {
    const uppyInstance = Uppy({
      locale: Vietnam,
      allowMultipleUploads: isAllowMultipleUploads,
    })
      .use(XHRUpload, {
        endpoint: "/api/upload",
        fieldName: "files",
        timeout: 120 * 1000,
      })
      .on("complete", (result) => {
        console.log("Upload result:", result);
        setOutFile(result.successful);
      });
    setUppy(uppyInstance);
  }, []);
  // React.useEffect(() => {
  //   if (!uppy) return;
  //   return () => uppy.close();
  // }, [uppy]);

  // useUppy() will automatically `.close()` the Uppy instance for us when
  // MyUploader unmounts.

  return (
    <>
      {uppy && (
        <DashboardModal
          open={true}
          disablePageScrollWhenModalOpen={false}
          hideUploadButton={isUploadButtonDisable}
          uppy={uppy}
          closeAfterFinish
          // closeModalOnClickOutside
          onRequestClose={() => setIsOpen(false)}
        />
      )}
    </>
  );
};
