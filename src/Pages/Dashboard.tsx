import React, { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


interface LocProps {
    name: string,
    time: string,
    id: string,
    suburb: string,
    lat: string | number,
    lng: string | number
}




const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));

// function createData(
//     name: string,
//     calories: number,
//     fat: number,
//     carbs: number,
//     protein: number,
// ) {
//     return { name, calories, fat, carbs, protein };
// }

// const rows = [
//     createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
//     createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
//     createData('Eclair', 262, 16.0, 24, 6.0),
//     createData('Cupcake', 305, 3.7, 67, 4.3),
//     createData('Gingerbread', 356, 16.0, 49, 3.9),
// ];



export default function Dashboard() {

    const navigate = useNavigate();

    const [locationName, setLocationName] = useState<LocProps[]>([]);
    // const [position, setPosition] = useState<positionProps[]>([]);
    const [call, setCall] = useState<boolean>(true);





    // const navigatefn = () => {

    // }

    useEffect(() => {


        setCall(false);
        (navigator.geolocation) &&

            (navigator.geolocation.getCurrentPosition(async (pos) => {
                const res = await axios.get(`https://api.opencagedata.com/geocode/v1/json?key=ea12808751d541f4a70bdb9de1918e2a&q=${pos.coords.latitude}%2C${pos.coords.longitude}&pretty=1`);
                console.log(res.data);
                const obj: LocProps = {
                    name: res.data.results[0].components.city,
                    time: res.data.timestamp.created_http,
                    id: res.data.timestamp.created_unix,
                    lat: pos.coords.latitude,
                    lng: pos.coords.longitude,
                    suburb: res.data.results[0].components.suburb
                }

                if (locationName.length <= 30) {
                    setLocationName([obj, ...locationName]);
                    const postresp = await axios.post(`https://httpstat.us/200`, { "location_name": res.data.results[0].components.city, "time": res.data.timestamp.created_unix });
                    // console.log(postresp.data);
                } else {
                    locationName.pop();

                    setLocationName([obj, ...locationName]);

                }
                let value = JSON.stringify(locationName);
                localStorage.setItem("key", value);
            },
                (err) => {
                    alert(err.message);
                }
            ))


        // else {
        //     alert("Couldn't get Location")
        // }
        setTimeout(() => setCall(true), 2000);


    }, [call]);
    useEffect(() => {
        let retrieve: any = localStorage.getItem("key");
        console.log(JSON.parse(retrieve));
        if (JSON.parse(retrieve)) {
            setLocationName([...JSON.parse(retrieve)]);
        }
    }, [])



    const handleDelete = (id: any) => {
        setLocationName(locationName.filter((ele) => id !== ele.id));

    }

    return (<div className='container'>
        <h3>My Location Info</h3>
        <div className='btncontainer'><Button variant="contained" sx={{ margin: "0.5rem 6rem" }} onClick={() => { setLocationName([]); localStorage.removeItem("key") }}>Delete All</Button>
            <Button variant='outlined' sx={{ margin: "0.5rem 6rem" }} onClick={() => navigate("/map", { state: locationName })}>View in Map</Button>
        </div>
        <TableContainer component={Paper} className='mytable' sx={{ maxWidth: 800, alignItems: "center", margin: "1rem 0 2rem 18%" }}>

            <Table sx={{ maxWidth: 800 }} aria-label="customized table">
                <TableHead>
                    <TableRow>
                        <StyledTableCell align='center'>City</StyledTableCell>
                        <StyledTableCell align='center'>Suburb</StyledTableCell>
                        <StyledTableCell align='center'>Time</StyledTableCell>
                        <StyledTableCell align='center'>Option</StyledTableCell>

                    </TableRow>
                </TableHead>
                <TableBody data-testid="tbody">
                    {locationName.map((row) => (
                        <StyledTableRow key={row.id}>
                            <StyledTableCell component="th" scope="row" align='center'>
                                {row.name}
                            </StyledTableCell>
                            <StyledTableCell align='center'>{row.suburb}</StyledTableCell>
                            <StyledTableCell align='center' >{row.time}</StyledTableCell>
                            <StyledTableCell align="center"><Button variant="text" onClick={() => handleDelete(row.id)} data-testid={`del-${row.id}`} >Delete</Button></StyledTableCell>

                        </StyledTableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    </div>
    );
}
