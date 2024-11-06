import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Banner from "./Components/Banner"
import { TypeCard } from "./Components/TypeCard"

const items = ["+", "-", "×", "/"]

interface Calculation {
  id: string
  numberOne: number
  numberTwo: number
  operation: string
  result: number
}

function App() {
  const [numberOne, setNumberOne] = useState<string>("")
  const [numberTwo, setNumberTwo] = useState<string>("")
  const [operation, setOperation] = useState<string>("+")
  const [sum, setSum] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [history, setHistory] = useState<Calculation[]>([])

  // Debounce effect hook för fetchSum
  useEffect(() => {
    if (numberOne !== "" && numberTwo !== "") {
      const debounceTimer = setTimeout(() => {
        fetchSum()
      }, 500)

      // Rensa timeout om något ändras innan 500 ms har gått
      return () => clearTimeout(debounceTimer)
    }
  }, [numberOne, numberTwo, operation])

  const fetchSum = async (): Promise<void> => {
    try {
      const response = await fetch(
        "http://localhost:8080/api/Calculation/calculate",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            numberOne: parseFloat(numberOne),
            numberTwo: parseFloat(numberTwo),
            operation: operation,
          }),
        }
      )

      if (!response.ok) {
        const errorData = await response.json()
        setError(errorData.error)
        setSum(null)
      } else {
        const data = await response.json()
        setSum(data.result)
        setError(null)
        fetchHistory()
      }
    } catch (error) {
      console.error("Error fetching result:", error)
      setError("An error occurred while calculating.")
      setSum(null)
    }
  }

  const fetchHistory = async (): Promise<void> => {
    try {
      const response = await fetch(
        "http://localhost:8080/api/Calculation/history"
      )
      if (response.ok) {
        const data = await response.json()
        setHistory(data)
      } else {
        console.error("Failed to fetch history")
      }
    } catch (error) {
      console.error("Error fetching history:", error)
    }
  }

  useEffect(() => {
    fetchHistory()
  }, [])

  const handleNumberOneChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const value = e.target.value
    setNumberOne(value)
  }

  const handleNumberTwoChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const value = e.target.value
    setNumberTwo(value)
  }

  const handleOperationChange = (newOperation: string): void => {
    setOperation(newOperation)
  }

  return (
    <div className='relative bg-[#242424] overflow-hidden w-full min-h-screen flex flex-col text-white font-sora'>
      {/* Banner */}
      <Banner />

      {/* Mittsektion för operation och resultat */}
      <div className='flex flex-col items-center justify-center space-y-8 h-screen'>
        {/* Operationer */}
        <div className='z-10 flex space-x-8 mb-8'>
          {items.map((op) => (
            <button
              key={op}
              className={`flex justify-center items-center w-12 h-12 text-2xl ${
                operation === op ? "bg-[#4a4a4a]" : "bg-[#313131]"
              }`}
              onClick={() => handleOperationChange(op)}>
              {op}
            </button>
          ))}
        </div>

        {/* Formulär för nummer och operation */}
        <form className='z-10 flex items-center gap-4'>
          <div className='space-y-2'>
            <label htmlFor='numberOne'>
              <div className='text-xl text-center'>Number 1</div>
            </label>
            <input
              type='text'
              name='numberOne'
              id='numberOne'
              className='text-black rounded-md text-center text-lg w-36 h-9'
              value={numberOne}
              onChange={handleNumberOneChange}
            />
          </div>

          <p className='text-3xl mt-9'>{operation}</p>

          <div className='space-y-2'>
            <label htmlFor='numberTwo'>
              <div className='text-xl text-center'>Number 2</div>
            </label>
            <input
              type='text'
              name='numberTwo'
              id='numberTwo'
              className='text-black rounded-md text-center text-lg w-36 h-9'
              value={numberTwo}
              onChange={handleNumberTwoChange}
            />
          </div>
        </form>

        {/* Resultat */}
        <p className='text-4xl z-10'>=</p>
        {error ? (
          <motion.p
            key={error}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className='text-red-500 text-[1.75rem] z-10'>
            {error}
          </motion.p>
        ) : (
          <motion.p
            key={sum}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className='text-3xl z-10'>
            {sum}
          </motion.p>
        )}
      </div>

      {/* TypeCard */}
      <TypeCard />

      {/* Historik */}
      <div className='hidden sm:block absolute right-0 2xl:right-80 top-1/2 transform -translate-y-1/2 px-5'>
        <h2 className='text-2xl font-semibold mb-5 text-center'>History</h2>
        <ul className='text-center flex flex-col items-center space-y-2 h-[380px] 2xl:h-[600px] overflow-hidden'>
          {history
            .slice()
            .reverse()
            .map((calc) => (
              <li className='flex text-md' key={calc.id}>
                <div className='rounded-lg w-24'>{calc.numberOne}</div>
                <p className='w-4'>{calc.operation}</p>
                <div className='rounded-md w-24'>{calc.numberTwo}</div>
                <p className='w-4'>=</p>
                <div className='rounded-md w-24 font-bold px-4'>
                  {parseFloat(calc.result.toFixed(2))}
                </div>
              </li>
            ))}
        </ul>
      </div>
    </div>
  )
}

export default App
