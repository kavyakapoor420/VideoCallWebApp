import { useNavigate } from 'react-router-dom'
import './History.css'
import { useContext, useEffect } from 'react'
import { AuthContext } from '../../contexts/AuthContext'
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import HomeIcon from '@mui/icons-material/Home';
import { IconButton } from '@mui/material';

const History=()=>{

    const [meetings,setMeetings]=useState([])
    const routeTo=useNavigate()

    const {getHistoryOfUser}=useContext(AuthContext)

    const fetchHistory=async()=>{
        try{
              const history=await getHistoryOfUser() 
              setMeetings(history)
        }catch(err){
             console.error(err)
        }
     }
     useEffect(()=>{
      fetchHistory()  

     },[])

     let formDate=(dateString)=>{
        const date= new Date(dateString) 
        const day=date.getDate().toString().padStart(2,'0')
        const month=(date.getMonth()+1).toString().padStart(2,'0')
        const year=date.getFullYear()

        return `${day}/${month}/${year}`
     }

    return (
        <>
            {
                meetings.map((ele,indx)=>{
                     return (
                        <>
                          <Card key={indx}/>
                        </>
                     )
                })
            }
        </>
    )
}

export default History