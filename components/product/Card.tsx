

// import shoe1 from "@/public/images/all-shoes/shoe1.png"
import Image from "next/image";
import shoe1 from "/public/images/all-shoes/shoe1.png"
const Card = () => {


    return (
        <div className='bg-white cursor-pointer w-56 rounded-lg card flex flex-col justify-between shadow-lg p-3' >
            <figure className='relative mb-2 w-full '>
                <span className='absolute top-0 left-0 p-1 rounded-3xl m-1 bg-white/60 text-black text-sm '>fashion</span>
                <Image src={shoe1} alt='headphones' />
            </figure>
            <p className='flex justify-between'>
                <span className='text-sm font-bold'>123</span>
                <span>$45454</span>
            </p>
        </div>
    )
}


export default Card;