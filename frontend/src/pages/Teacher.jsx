import Table from "../components/Table";
import AddButton from "../components/AddButton";
import RefreshButton from "../components/RefreshButton";
export default function Teacher() {
  return (
    <div className="lg:px-[10%] px-[5%] mt-10">
      <div className="flex justify-between items-center mb-5">
        <RefreshButton
          onClick={() => window.dispatchEvent(new Event("refresh-table"))}
        />
        <AddButton ModelName="Teacher" />
      </div>
      <Table modelName={"Teacher"} />
    </div>
  );
}
