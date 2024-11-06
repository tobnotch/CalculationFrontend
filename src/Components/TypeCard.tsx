import { ReactNode, useEffect, useState } from "react"
import { motion } from "framer-motion"

export const TypeCard = () => (
  <div className='hidden absolute w-80 top-1/2 transform -translate-y-1/2 md:flex items-center justify-center px-8 py-24 text-white'>
    <BlockInTextCard
      tag='/ Guide'
      text={
        <>
          <div className='font-bold'>How to use?</div>
          <div>Choose an operation and two numbers and we'll do the rest!</div>
        </>
      }
      examples={[
        "Calculate the sum of two numbers, like 45 + 23.",
        "Find the difference between two values, such as 80 - 32.",
        "Determine the product by multiplying numbers, like 12 × 6.",
        "Calculate the quotient, for example, 144 ÷ 12.",
      ]}
    />
  </div>
)

const BlockInTextCard = ({
  tag,
  text,
  examples,
}: {
  tag: string
  text: ReactNode
  examples: string[]
}) => (
  <div className='w-full max-w-xl space-y-6'>
    <p className='mb-1.5 text-sm font-light uppercase'>{tag}</p>
    <p className='max-w-lg text-xl'>{text}</p>
    <Typewrite examples={examples} />
  </div>
)

const Typewrite = ({ examples }: { examples: string[] }) => {
  const [exampleIndex, setExampleIndex] = useState(0)

  useEffect(() => {
    const intervalId = setInterval(
      () => setExampleIndex((prev) => (prev + 1) % examples.length),
      5000
    )
    return () => clearInterval(intervalId)
  }, [examples.length])

  return (
    <p className='text-sm font-light'>
      <div className='flex items-center'>
        <span className='inline-block size-2 mb-[1.5px] mr-2 bg-white' />
        EXAMPLE:
      </div>
      {examples[exampleIndex].split(" ").map((word, i) => (
        <AnimatedWord key={`${exampleIndex}-${i}`} word={word} index={i} />
      ))}
    </p>
  )
}

const AnimatedWord = ({ word, index }: { word: string; index: number }) => (
  <motion.span
    initial={{ opacity: 1 }}
    animate={{ opacity: 0 }}
    transition={{
      delay: 5,
      duration: 0.25,
      ease: "easeInOut",
    }}
    className='relative inline-block mr-1'>
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: index * 0.1, duration: 0 }}>
      {word}
    </motion.span>
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 1, 0] }}
      transition={{
        delay: index * 0.1,
        times: [0, 0.1, 1],
        duration: 0.125,
        ease: "easeInOut",
      }}
      className='absolute bottom-[3px] left-[1px] right-0 top-[3px] bg-white/25'
    />
  </motion.span>
)
