import Card from "../components/project/Card";
import Header from "../components/common/Header";
import Sidebar from "../components/common/Sidebar";
export default function Home() {
  return (
    <>
      <Header />
      <div className="flex flex-row ">
        <div className="w-1/6 sticky top-16 border-r border-[#e6e6e6]  self-start">
          <Sidebar />
        </div>
        <div className=" w-11/12">
          <div className="max-w-[1108px] mx-auto ">
            <div className="grid-col-1 md:grid-cols-2 grid p-1.5 mb-4 ">
              <Card />
              <Card />
              <Card />
              <Card />
              <Card />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
