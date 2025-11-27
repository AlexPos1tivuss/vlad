import SideMenuComponent from "./SideMenuComponent";


const MainComponent = () =>{
    return (
    <>
        <div className="min-h-screen bg-[#FFF8F0] font-rubik p-6 flex gap-6">
          <div className="w-72">
            <SideMenuComponent />
          </div>
        </div> 
        
    </>
    );
}

export default MainComponent