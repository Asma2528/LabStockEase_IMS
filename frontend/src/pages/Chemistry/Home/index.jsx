import BarChart from "./components/BarChart"
import PieChart from "./components/PieChart"
import BreadCrumbs from '../../../components/BreadCrumbs';

const HomePage = ()=>{

    return <div className="w-full flex flex-wrap justify-evenly mt-10">
         <BreadCrumbs PageLink='/Chemicals' PageName='Chemicals' />
         <BarChart/>

<PieChart/>
dashboard ui
    </div>

}

export default HomePage

