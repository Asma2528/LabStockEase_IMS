import BarChart from "./components/BarChart"
import PieChart from "./components/PieChart"

const HomePage = ()=>{

    return <div className="w-full flex flex-wrap justify-evenly mt-10">
        <BarChart/>

        <PieChart/>

    </div>

}

export default HomePage

