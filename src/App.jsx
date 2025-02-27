import { useEffect, useRef, useState } from 'react'
import {CandlestickSeries, createChart, HistogramSeries} from "lightweight-charts"
import axios from "axios"
import './App.css'

function App() {
  const TIME_FRAMES = ["1m", "5m", "30m", "1h", "4h", "1d"];
  const [mode,setMode]= useState("dark")
  const [frame,setFrame]= useState("30m")
  const [priceBitcoin, setPriceBitcoin]= useState(0)
  const [priceBitcoinBefore, setPriceBitcoinBofore]= useState(0)
  const chartDiv= useRef()
  const chartRef = useRef()
  const handleChangeMode = ()=>{
    if(mode=="light"){ setMode("dark")}
    else{
      setMode("light")
    }
  }
  const handleChangeFrame =(e)=>{
    setFrame(e.target.innerText)
  }

  const handleGetBitCoin= async()=>{
    let url = "https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=1m&limit=2"
    const result =await axios.get(url)
    setPriceBitcoin(result.data[1][4]/1)
    setPriceBitcoinBofore(result.data[0][4]/1)
  }
 
  useEffect(()=>{
    handleGetBitCoin()
  },[])
  useEffect(()=>{
    
    
      if(chartDiv!=null){
        const getDataChart = async()=>{
      
          const result = await axios.get(`https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=${frame}&limit=100`)
          // console.log(result.data)
          const formatData = result.data.map((dta,index)=>{return {value: index,time: dta[0] / 1000,
            open: parseFloat(dta[1]),
            high: parseFloat(dta[2]),
            low: parseFloat(dta[3]),
            close: parseFloat(dta[4]),}})
          const datavolume = result.data.map((dta)=>{
              return {
                time: dta[0] / 1000,
                value: parseFloat(dta[5]),
                color: parseFloat(dta[4]) > parseFloat(dta[1]) ? "#26a69a" : "#ef5350",
              }
          })  
            candlestickSeries.setData(formatData);
            VolumeSeries.setData(datavolume)
          
          
        }
        
        const chartOptions = { layout: { textColor: mode=="light"?'black':"white", background: { type: 'solid', color: mode=="light"?'white':"black" } } };
        chartRef.current= createChart(chartDiv.current, chartOptions);
        const candlestickSeries = chartRef.current.addSeries(CandlestickSeries, { 
          upColor: '#26a69a', 
          downColor: '#ef5350', 
          borderVisible: false, 
          wickUpColor: '#26a69a', 
          wickDownColor: '#ef5350',
          autoScale: true,
          scaleMargins: { top: 0, bottom: 0.3 } // lấy 70 %
        });
        const VolumeSeries = chartRef.current.addSeries(HistogramSeries,{ 
          color: "#26a69a",
          autoScale: true,
          scaleMargins: { top: 0.7, bottom: 0 }, // lấy 30%
          priceFormat: { type: 'volume' }, 
        } )
      
        chartRef.current.timeScale().fitContent();
        getDataChart()

      }


  return ()=>{
    chartRef.current.remove();
  }
      },[mode,frame])
  return (
    <>
    <div className="header">
      <div className='remote'>
        <button onClick={handleChangeMode}>{mode}</button>
        {TIME_FRAMES.map((time, index)=><button key={index} style={{height: "30px",width:"30px",margin:"10px", backgroundColor:time===frame?"yellow":"white"}} onClick={handleChangeFrame}>{time}
        </button>)}
        
      </div>
      <div className="bitcoin">
      <span>giá bitcoin hiện tại: {priceBitcoin}$</span>
      <span> giá bitcoin 1 phút trước: {priceBitcoinBefore}$</span>
      <button style={{height: "30px",margin:"10px",padding:"2px"}} onClick={handleGetBitCoin}>lấy giá trị bitcoin</button>
      </div>
      
    </div>
      
      <div ref={chartDiv}
      style={{width:"100%", height: "98vh", background:"blue"}}>
      </div>
    </>
  )
}

export default App
