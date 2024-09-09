import { useNavigate } from "react-router-dom"
import "./index.css"

function Index(){
    let navigate = useNavigate()
    const routechange = ()=>{
        navigate("/play")
    }
    return <>
    <h1> Click Diddy </h1>
    <div className="button">
        <button onClick={routechange}> Play </button>

    </div>
    </>
}


export default Index