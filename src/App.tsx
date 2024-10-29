import "./App.css"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import GrainLeft from "./assets/grainLeftYellow.png"
import GrainRight from "./assets/grainRightYellow.png"

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

  const fetchSum = async (
    updatedNumberOne: string,
    updatedNumberTwo: string,
    selectedOperation: string
  ): Promise<void> => {
    if (updatedNumberOne !== "" && updatedNumberTwo !== "") {
      try {
        const response = await fetch(
          "http://localhost:8080/api/Calculation/calculate",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              numberOne: parseFloat(updatedNumberOne),
              numberTwo: parseFloat(updatedNumberTwo),
              operation: selectedOperation,
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
    fetchSum(value, numberTwo, operation)
  }

  const handleNumberTwoChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const value = e.target.value
    setNumberTwo(value)
    fetchSum(numberOne, value, operation)
  }

  const handleOperationChange = (newOperation: string): void => {
    setOperation(newOperation)
    fetchSum(numberOne, numberTwo, newOperation)
  }

  return (
    <div className='min-h-screen flex justify-center items-center 2xl:flex-col text-white'>
      <div className='hidden 2xl:block absolute w-[35rem] h-[35rem] left-0 top-96 overflow-x-hidden'>
        {/* Grain bild */}
        <img
          src={GrainLeft}
          className='absolute left-0 w-[35rem] h-full pointer-events-none select-none'
        />

        {/* Fade-effekt på toppen */}
        <div className='absolute left-0 top-0 w-[35rem] h-20 bg-gradient-to-b from-[#242424] to-transparent pointer-events-none' />

        {/* Fade-effekt på botten */}
        <div className='absolute left-0 bottom-0 w-[35rem] h-20 bg-gradient-to-t from-[#242424] to-transparent pointer-events-none' />
      </div>

      <div className='hidden 2xl:block absolute w-[35rem] h-[35rem] right-0 bottom-14 md:top-72 overflow-x-hidden'>
        <img
          src={GrainRight}
          className='absolute right-0 w-[35rem] h-full pointer-events-none select-none'
        />

        {/* Fade-effekt på toppen */}
        <div className='absolute right-0 top-0 w-[35rem] h-20 bg-gradient-to-b from-[#242424] to-transparent pointer-events-none' />

        {/* Fade-effekt på botten */}
        <div className='absolute right-0 bottom-0 w-[35rem] h-20 bg-gradient-to-t from-[#242424] to-transparent pointer-events-none' />
      </div>

      <img
        className='absolute top-0 sm:left-6 2xl:left-0 2xl:relative w-48 2xl:w-64 mx-auto mt-10'
        src='src/assets/calcLogo.png'
        alt='logo'
      />

      <div className='flex-grow flex flex-col items-center justify-center space-y-8'>
        <div className='flex space-x-8 mb-8'>
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

        <form className='flex items-center space-x-4'>
          <div className='space-y-2'>
            <label htmlFor='numberOne' className='block text-lg text-center'>
              <img
                className='w-28 mx-auto'
                src='src/assets/numberOne.png'
                alt='number one'
              />
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

          <p className='text-3xl mt-7 w-7'>{operation}</p>

          <div className='space-y-2'>
            <label htmlFor='numberTwo' className='block text-lg text-center'>
              <img
                className='w-28 mx-auto'
                src='src/assets/numberTwo.png'
                alt='number two'
              />
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

        <p className='text-4xl'>=</p>

        {error ? (
          <motion.p
            key={error}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className='text-red-500 text-[1.75rem]'>
            {error}
          </motion.p>
        ) : (
          <motion.p
            key={sum}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className='text-4xl'>
            {sum}
          </motion.p>
        )}
      </div>

      {/* Historik */}
      <div className='hidden sm:block absolute 2xl:relative right-0 2xl:my-10'>
        <h2 className='text-2xl font-semibold mb-5'>History</h2>
        <ul className='flex flex-col items-center space-y-2 w-[35rem] h-[388px] overflow-y-hidden'>
          {history
            .slice()
            .reverse()
            .map((calc) => (
              <li className='flex text-lg' key={calc.id}>
                <div className='rounded-lg w-24'>{calc.numberOne}</div>
                <p className='w-4'>{calc.operation}</p>
                <div className='rounded-lg w-24'>{calc.numberTwo}</div>
                <p className='w-4'>=</p>
                <div className='rounded-lg w-24 font-bold px-4'>
                  {calc.result}
                </div>
              </li>
            ))}
        </ul>
      </div>
    </div>
  )
}

export default App
