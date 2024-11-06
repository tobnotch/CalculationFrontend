import { motion } from "framer-motion"
import { LiaCalculatorSolid } from "react-icons/lia";

const companies = [
  { id: "calculator", logo: <LiaCalculatorSolid size={45} /> },
  { id: "docker", logo: "Docker Calculator" },
  { id: "calculator", logo: <LiaCalculatorSolid size={45} /> },
  { id: "docker", logo: "Docker Calculator" },
]

const Banner = () => {
  return (
    <div className='absolute top-5 left-1/2 transform -translate-x-1/2 flex flex-col items-center justify-center'>
      <div className='relative w-[40rem] overflow-hidden flex items-center justify-start'>
        <motion.div
          className='bg-white text-black flex w-[200%]'
          initial={{ x: 0 }}
          animate={{ x: "-50%" }}
          transition={{ duration: 12, ease: "linear", repeat: Infinity }}>
          {[...companies, ...companies].map((company) => (
            <div
              key={`${company.id}`}
              className='flex items-center justify-center w-[10rem] h-16 uppercase'>
              <span className='cursor-pointer text-center text-xl font-tiny'>
                {company.logo}
              </span>
            </div>
          ))}
        </motion.div>

        <div className='absolute left-0 h-full w-24 bg-gradient-to-r from-[#242424] to-transparent pointer-events-none'></div>
        <div className='absolute right-0 h-full w-24 bg-gradient-to-l from-[#242424] to-transparent pointer-events-none'></div>
      </div>

      <div className='relative w-[40rem] overflow-hidden flex items-center justify-end mt-2'>
        <motion.div
          className='bg-white text-black flex w-[200%] cursor-default'
          initial={{ x: 0 }}
          animate={{ x: "50%" }}
          transition={{ duration: 12, ease: "linear", repeat: Infinity }}>
          {[...companies, ...companies].map((company) => (
            <div
              key={`${company.id}`}
              className='flex items-center justify-center w-[10rem] h-16 uppercase'>
              <span className='cursor-pointer text-center text-xl font-tiny'>
                {company.logo}
              </span>
            </div>
          ))}
        </motion.div>

        <div className='absolute left-0 h-full w-24 bg-gradient-to-r from-[#242424] to-transparent pointer-events-none'></div>
        <div className='absolute right-0 h-full w-24 bg-gradient-to-l from-[#242424] to-transparent pointer-events-none'></div>
      </div>
    </div>
  )
}

export default Banner
