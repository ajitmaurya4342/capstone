import {useState} from 'react';import {useNavigate} from 'react-router-dom';import api from '../services/api';
export default function Home(){const nav=useNavigate();const [form,setForm]=useState({from:'Hyderabad',to:'Bangalore',date:''});const [results,setResults]=useState([]);
 const search=async e=>{e.preventDefault();try{const r=await api.get('/schedules',{params:form});setResults(r.data)}catch(e){alert(e.response?.data?.message||'Search failed')}};return <main>
 <h1>BusGo</h1><form onSubmit={search}><input placeholder="From" value={form.from} onChange={e=>setForm({...form,from:e.target.value})}/><input placeholder="To" value={form.to} onChange={e=>setForm({...form,to:e.target.value})}/><input type="date" value={form.date} onChange={e=>setForm({...form,date:e.target.value})}/><button>Search Buses</button></form>
 <section>{results.map(s=><article key={s.id}><b>{s.bus.operatorName}</b><div>{s.fromCity} → {s.toCity}</div><div>{s.departureTime} → {s.arrivalTime}</div><div>₹{s.fare} · <button onClick={()=>nav('/seats/'+s.id)}>Select Seats</button></div></article>)}</section>
 </main>}
