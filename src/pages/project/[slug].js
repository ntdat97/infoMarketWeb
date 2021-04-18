import React, { useState, useLayoutEffect } from "react";
import { MdAccessTime, MdImage } from "react-icons/md";
import CarouselComponent from "../../components/common/CaroselComponent";
import { Uploader } from "../../components/common/Upload";
import { ModalSubmit } from "../../components/project/ModalSubmit";
import Header from "../../components/common/Header";
import Sidebar from "../../components/common/Sidebar";
import Link from "next/link";
const pics = [
  {
    url: "/slider.jpg",
    height: 300,
    width: 300,
  },
  {
    url: "/slider.jpg",
    height: 300,
    width: 300,
  },
  {
    url: "/slider.jpg",
    height: 300,
    width: 300,
  },
];
const ProjectInfo = () => {
  return (
    <div className="flex flex-row pb-2.5 border-b border-[#f0f0f0]">
      <div className="w-9/12 px-2">
        <div className="text-3xl m font-bold  py-2">Prescriptions Receipts</div>
        <div style={{ paddingVertical: 1.5 }}>Microsoft Corporation</div>
        <div
          style={{
            fontSize: 17,
            color: "black",
            alignItems: "center",
            paddingVertical: 3,
            color: "#454545",
          }}
        >
          $ 0.25/photo
        </div>
        <div className="flex flex-row items-center py-1">
          <MdImage color="#8f8f8f" className="mr-1" />
          <div style={{ color: "#454545", fontSize: 17 }}>
            {" "}
            {"2000"} {"photos"}
          </div>
        </div>
        <div className="flex flex-row items-center py-1">
          <MdAccessTime color="#8f8f8f" className="mr-1" />
          <div style={{ color: "#454545", fontSize: 17 }}> Ngày 24/02/2021</div>
        </div>
      </div>
      <div className="flex justify-center items-center w-3/12">
        <Link href="/profile/user">
          <a /* onPress={() => navigation.navigate('Profilediver')} */>
            <img src="/microsoft.png" style={{ height: 70, width: 70 }} />
          </a>
        </Link>
      </div>
    </div>
  );
};

export default function ProjectDetail() {
  const [coverImage, setCoverImage] = useState([]);
  const [isShowUploader, setIsShowUploader] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  return (
    <>
      {isShowUploader ? (
        <Uploader
          isOpen={isShowUploader}
          setIsOpen={setIsShowUploader}
          outFiles={coverImage}
          setOutFile={setCoverImage}
        />
      ) : null}
      <Header />

      <div className="flex flex-row ">
        <div className="w-1/6 sticky top-16 self-start h-auto border-r border-[#e6e6e6] ">
          <Sidebar />
        </div>
        <div className="flex w-11/12 ">
          <div className="max-w-[1108px] mx-auto mt-4">
            <div style={{ backgroundColor: "white" }}>
              <ModalSubmit />
              <div>
                <CarouselComponent data={pics} />
              </div>
              <ProjectInfo />
              <div className="py-2.5 px-2 border-b border-[#f0f0f0]">
                <div
                  style={{
                    fontSize: 17,
                    fontWeight: "700",
                    paddingVertical: 7,
                  }}
                >
                  Description
                </div>
                <div>
                  Means, in relation to a form, the latest version of the
                  corresponding form appearing on the Website, as may be amended
                  or replaced by the IESO from time to time and without notice
                  to the Supplier.
                </div>
              </div>
              <div className="py-2.5 px-2 border-b border-[#f0f0f0]">
                <div
                  style={{
                    fontSize: 17,
                    fontWeight: "700",
                    paddingVertical: 7,
                  }}
                >
                  How photos will be used
                </div>
                <div>
                  Means, in relation to a form, the latest version of the
                  corresponding form appearing on the Website, as may be amended
                  or replaced by the IESO from time to time and without notice
                  to the Supplier.
                </div>
              </div>
              <div className="py-2.5 px-2 border-b border-[#f0f0f0]">
                <div
                  style={{
                    fontSize: 17,
                    fontWeight: "700",
                    paddingVertical: 7,
                  }}
                >
                  How photos will be used
                </div>
                <div>
                  Career growth is encouraged through training and mentoring.
                  Benefits include health and life insurance, flexible work
                  schedules, paid sick and vacation leave, and retirement
                  benefits. Responsibilities include but are not limited to:
                  Interdiv clients, in person and/or via phone, to gather
                  information for applications for public assistance programs.
                  Process verification provided by clients to determine
                  eligibility for public assistance programs. Explain program
                  requirements to clients, including what information is needed
                  to process their case and program requirements to which they
                  may be subject. Identify resources in the community and make
                  appropriate referrals. Answer inquiries from clients regarding
                  general program rules as well as case-specific questions.
                </div>
              </div>
              <div className="py-2.5 px-2 border-b border-[#f0f0f0]">
                <div
                  style={{
                    fontSize: 17,
                    fontWeight: "700",
                    paddingVertical: 10,
                    marginBottom: 5,
                  }}
                >
                  Contact requester
                </div>
                <Link href="#">
                  <a>
                    <div className="text-center border-[#006A73] py-1.5 mx-4 border rounded-md mb-4 text-[#006A73] font-semibold">
                      Ask a question
                    </div>
                  </a>
                </Link>
                <Link href="#">
                  <a>
                    <div className="text-center border-[#006A73] py-1.5 mx-4 border rounded-md mb-4 text-[#006A73] font-semibold">
                      Share project
                    </div>
                  </a>
                </Link>
                <div
                  style={{
                    padding: 10,
                    borderWidth: 1,
                    borderColor: "#f0f0f0",
                    borderRadius: 5,
                  }}
                >
                  <div>Photo right and responsibilities</div>
                  <div className="flex flex-row items-center py-[10px]">
                    <MdAccessTime
                      name="clock-time-three-outline"
                      size={24}
                      color="#8f8f8f"
                      style={{ marginRight: 10 }}
                    />
                    <div>Photo can be use indefinitely</div>
                  </div>
                  <div className="flex flex-row items-center py-[10px]">
                    <MdAccessTime
                      color="#8f8f8f"
                      size={24}
                      style={{ marginRight: 10 }}
                    />
                    <div>Photo can be use indefinitely</div>
                  </div>
                  <div className="flex flex-row items-center py-[10px]">
                    <MdAccessTime
                      color="#8f8f8f"
                      size={24}
                      style={{ marginRight: 10 }}
                    />
                    <div>Photo can be use indefinitely</div>
                  </div>
                  <div className="flex flex-row items-center py-[10px]">
                    <MdAccessTime
                      color="#8f8f8f"
                      size={24}
                      style={{ marginRight: 10 }}
                    />
                    <div>Photo can be use indefinitely</div>
                  </div>
                  <div style={{ paddingVertical: 5 }}>
                    Fot the complete rights and responsibilities, please read
                    the Terms of Use.
                  </div>
                </div>
              </div>
            </div>
            <div className="p-2 border-t-[0.5px] border-[#f0f0f0]  mt-0.5  bg-white sticky bottom-0 ">
              <button
                onClick={() => setIsShowUploader(true)}
                className="py-1  rounded-md bg-[#006A73] flex w-full items-center justify-center"
              >
                <div className="text-white font-semibold">Send photos</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
