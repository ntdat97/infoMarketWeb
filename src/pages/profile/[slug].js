import React from "react";
export default function ProfileViewer() {
  return (
    <div className="flex flex-col bg-[#F8F8F8] max-w-[789px] mx-auto ">
      <div style={{ backgroundColor: "white" }}>
        <div className="flex flex-row mt-2.5 mb-5 ">
          <div className="w-3/12  py-3  items-center justify-center">
            <img src="/avatar.png" className="h-[80px] w-[80px] " />
          </div>
          <div className="flex flex-col w-9/12 justify-center">
            <div style={{ paddingBottom: 5, fontSize: 18 }}>
              email@gmail.com
            </div>
            <div style={{ fontSize: 18, color: "#868483" }}>87 reviews</div>
          </div>
        </div>
      </div>
      <div style={{ paddingHorizontal: 22, paddingVertical: 10 }}>
        Project Activites
      </div>
      <div className="flex flex-row bg-white px-6 py-3 justify-between border-b border-[#EEEEEE]">
        <div style={{}}>
          <div style={{ paddingVertical: 4 }}>12</div>
          <div style={{ paddingVertical: 4 }}>Sent</div>
        </div>
        <div style={{}}>
          <div style={{ paddingVertical: 4 }}>5</div>
          <div style={{ paddingVertical: 4 }}>Approved</div>
        </div>
        <div style={{}}>
          <div style={{ paddingVertical: 4 }}>0</div>
          <div style={{ paddingVertical: 4 }}>Created</div>
        </div>
      </div>
    </div>
  );
}
/* 
<Text style={{backgroundColor: 'white'}}>sad</Text>
*/
